import { NextResponse } from "next/server";
import { canRequestJudge } from "@/lib/debate/rules";
import { ConfigMissingError } from "@/lib/openrouter/config";
import {
  OpenRouterTimeoutError,
  OpenRouterUpstreamError,
} from "@/lib/openrouter/client";
import {
  isUnsupportedStructuredOutputError,
  toOpenRouterApiError,
} from "@/lib/openrouter/errors";
import {
  buildJudgeInput,
  judgeJsonSchema,
  judgeSystemPrompt,
} from "@/lib/prompts/judge";
import { apiError } from "@/lib/utils/apiError";
import { isBodyTooLarge, judgeRequestSchema } from "@/lib/validation/apiSchemas";
import {
  judgeReportSchema,
  normalizeJudgeReport,
} from "@/lib/validation/judgeReportSchema";
import type { DebateSession, JudgeReport } from "@/types/debate";
import { sendServerOpenRouterChat } from "@/lib/openrouter/server";

function parseJudgeJson(content: string): unknown {
  const trimmed = content.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "");
  const withoutFence = trimmed.replace(/\s*```$/i, "");
  const firstBrace = withoutFence.indexOf("{");
  const lastBrace = withoutFence.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    throw new Error("Judge response did not contain a JSON object.");
  }

  return JSON.parse(withoutFence.slice(firstBrace, lastBrace + 1));
}

async function requestJudgeReport({
  session,
  retryInstruction,
  structuredOutput = true,
}: {
  session: DebateSession;
  retryInstruction?: string;
  structuredOutput?: boolean;
}): Promise<{
  report: JudgeReport;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}> {
  const userContent = retryInstruction
    ? `${buildJudgeInput(session)}\n\n${retryInstruction}`
    : buildJudgeInput(session);

  const result = await sendServerOpenRouterChat({
    role: "judge",
    messages: [
      { role: "system", content: judgeSystemPrompt },
      { role: "user", content: userContent },
    ],
    temperature: 0.2,
    maxCompletionTokens: 1400,
    ...(structuredOutput
      ? {
          responseFormat: {
            type: "json_schema",
            json_schema: judgeJsonSchema,
          },
          provider: {
            require_parameters: true,
          },
        }
      : {}),
  });
  const rawReport = parseJudgeJson(result.content);
  const report = normalizeJudgeReport(judgeReportSchema.parse(rawReport));

  return {
    report,
    usage: result.usage,
  };
}

export async function POST(request: Request) {
  if (isBodyTooLarge(request)) {
    return apiError(
      "INVALID_REQUEST",
      "Payload terlalu besar untuk diproses.",
      false,
      413,
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return apiError("INVALID_REQUEST", "Body JSON tidak valid.", false, 400);
  }

  const parsed = judgeRequestSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(
      "INVALID_REQUEST",
      "Request penilaian tidak sesuai kontrak.",
      false,
      400,
    );
  }

  const { session } = parsed.data;

  if (!canRequestJudge(session.messages)) {
    return apiError(
      "INVALID_REQUEST",
      "Debat belum memiliki tiga ronde lengkap.",
      false,
      400,
    );
  }

  try {
    const result = await requestJudgeReport({
      session,
    });
    return NextResponse.json(result);
  } catch (firstError) {
    if (firstError instanceof ConfigMissingError) {
      return apiError(
        "CONFIG_MISSING",
        "AI server belum dikonfigurasi untuk penilaian.",
        false,
        500,
      );
    }

    if (firstError instanceof OpenRouterTimeoutError) {
      return apiError(
        "OPENROUTER_TIMEOUT",
        "OpenRouter terlalu lama merespons penilaian.",
        true,
        504,
      );
    }

    if (
      firstError instanceof OpenRouterUpstreamError &&
      !isUnsupportedStructuredOutputError(firstError)
    ) {
      const openRouterError = toOpenRouterApiError(firstError, "judge");

      return apiError(
        openRouterError.code,
        openRouterError.message,
        openRouterError.retryable,
        openRouterError.status,
      );
    }

    try {
      const retryResult = await requestJudgeReport({
        session,
        structuredOutput: !isUnsupportedStructuredOutputError(firstError),
        retryInstruction:
          "Return valid JSON only. No markdown fences. Follow the requested schema exactly. If structured JSON mode is unavailable, still produce the same JSON object as plain text.",
      });
      return NextResponse.json(retryResult);
    } catch (retryError) {
      if (retryError instanceof ConfigMissingError) {
        return apiError(
          "CONFIG_MISSING",
          "AI server belum dikonfigurasi untuk penilaian.",
          false,
          500,
        );
      }

      if (retryError instanceof OpenRouterTimeoutError) {
        return apiError(
          "OPENROUTER_TIMEOUT",
          "OpenRouter terlalu lama merespons penilaian.",
          true,
          504,
        );
      }

      if (retryError instanceof OpenRouterUpstreamError) {
        const openRouterError = toOpenRouterApiError(retryError, "judge");

        return apiError(
          openRouterError.code,
          openRouterError.message,
          openRouterError.retryable,
          openRouterError.status,
        );
      }

      return apiError(
        "JUDGE_PARSE_ERROR",
        "AI Judge belum mengembalikan JSON yang valid. Coba ulangi penilaian.",
        true,
        502,
      );
    }
  }
}
