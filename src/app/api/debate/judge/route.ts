import { NextResponse } from "next/server";
import { canRequestJudge } from "@/lib/debate/rules";
import { DEFAULT_GEMINI_MODEL } from "@/lib/gemini/defaults";
import {
  GeminiTimeoutError,
  GeminiUpstreamError,
  sendGeminiGenerateContent,
} from "@/lib/gemini/client";
import { getOpenRouterConfig, ConfigMissingError } from "@/lib/openrouter/config";
import { DEFAULT_OPENROUTER_MODEL } from "@/lib/openrouter/defaults";
import {
  OpenRouterTimeoutError,
  OpenRouterUpstreamError,
  sendOpenRouterChat,
} from "@/lib/openrouter/client";
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
import type { z } from "zod";
import type { clientAiConfigSchema } from "@/lib/validation/apiSchemas";

type ClientAiConfig = z.infer<typeof clientAiConfigSchema>;

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
  aiConfig,
  retryInstruction,
}: {
  session: DebateSession;
  aiConfig: ClientAiConfig;
  retryInstruction?: string;
}): Promise<{
  report: JudgeReport;
  model?: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}> {
  const userContent = retryInstruction
    ? `${buildJudgeInput(session)}\n\n${retryInstruction}`
    : buildJudgeInput(session);

  if (aiConfig?.provider === "gemini") {
    const model = aiConfig.judgeModel?.trim() || DEFAULT_GEMINI_MODEL;
    const result = await sendGeminiGenerateContent({
      apiKey: aiConfig.apiKey,
      model,
      systemInstruction: judgeSystemPrompt,
      contents: [{ role: "user", parts: [{ text: userContent }] }],
      temperature: 0.2,
      maxOutputTokens: 1400,
      responseMimeType: "application/json",
    });
    const rawReport = parseJudgeJson(result.content);
    const report = normalizeJudgeReport(judgeReportSchema.parse(rawReport));

    return {
      report,
      model: result.model ?? model,
      usage: result.usage,
    };
  }

  if (aiConfig?.provider === "openrouter") {
    const model = aiConfig.judgeModel?.trim() || DEFAULT_OPENROUTER_MODEL;
    const result = await sendOpenRouterChat({
      apiKey: aiConfig.apiKey,
      model,
      messages: [
        { role: "system", content: judgeSystemPrompt },
        { role: "user", content: userContent },
      ],
      temperature: 0.2,
      maxCompletionTokens: 1400,
      responseFormat: {
        type: "json_schema",
        json_schema: judgeJsonSchema,
      },
    });
    const rawReport = parseJudgeJson(result.content);
    const report = normalizeJudgeReport(judgeReportSchema.parse(rawReport));

    return {
      report,
      model: result.model ?? model,
      usage: result.usage,
    };
  }

  const { apiKey, model } = getOpenRouterConfig("judge");
  const result = await sendOpenRouterChat({
    apiKey,
    model,
    messages: [
      { role: "system", content: judgeSystemPrompt },
      { role: "user", content: userContent },
    ],
    temperature: 0.2,
    maxCompletionTokens: 1400,
    responseFormat: {
      type: "json_schema",
      json_schema: judgeJsonSchema,
    },
    provider: {
      require_parameters: true,
    },
  });
  const rawReport = parseJudgeJson(result.content);
  const report = normalizeJudgeReport(judgeReportSchema.parse(rawReport));

  return {
    report,
    model: result.model ?? model,
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
      aiConfig: parsed.data.aiConfig,
    });
    return NextResponse.json(result);
  } catch (firstError) {
    if (firstError instanceof ConfigMissingError) {
      return apiError("CONFIG_MISSING", firstError.message, false, 500);
    }

    if (firstError instanceof OpenRouterTimeoutError) {
      return apiError(
        "OPENROUTER_TIMEOUT",
        "OpenRouter terlalu lama merespons penilaian.",
        true,
        504,
      );
    }

    if (firstError instanceof OpenRouterUpstreamError) {
      return apiError(
        "OPENROUTER_ERROR",
        "OpenRouter gagal mengembalikan penilaian.",
        true,
        502,
      );
    }

    if (firstError instanceof GeminiTimeoutError) {
      return apiError(
        "GEMINI_TIMEOUT",
        "Gemini terlalu lama merespons penilaian.",
        true,
        504,
      );
    }

    if (firstError instanceof GeminiUpstreamError) {
      return apiError(
        "GEMINI_ERROR",
        "Gemini gagal mengembalikan penilaian. Periksa API key dan model.",
        true,
        502,
      );
    }

    try {
      const retryResult = await requestJudgeReport({
        session,
        aiConfig: parsed.data.aiConfig,
        retryInstruction:
          "Return valid JSON only. No markdown fences. Follow the requested schema exactly.",
      });
      return NextResponse.json(retryResult);
    } catch (retryError) {
      if (retryError instanceof ConfigMissingError) {
        return apiError("CONFIG_MISSING", retryError.message, false, 500);
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
        return apiError(
          "OPENROUTER_ERROR",
          "OpenRouter gagal mengembalikan penilaian.",
          true,
          502,
        );
      }

      if (retryError instanceof GeminiTimeoutError) {
        return apiError(
          "GEMINI_TIMEOUT",
          "Gemini terlalu lama merespons penilaian.",
          true,
          504,
        );
      }

      if (retryError instanceof GeminiUpstreamError) {
        return apiError(
          "GEMINI_ERROR",
          "Gemini gagal mengembalikan penilaian. Periksa API key dan model.",
          true,
          502,
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
