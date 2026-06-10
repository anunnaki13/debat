import { NextResponse } from "next/server";
import { getNextRound } from "@/lib/debate/rules";
import { ConfigMissingError } from "@/lib/openrouter/config";
import {
  OpenRouterTimeoutError,
  OpenRouterUpstreamError,
  type OpenRouterMessage,
} from "@/lib/openrouter/client";
import { toOpenRouterApiError } from "@/lib/openrouter/errors";
import { sendServerOpenRouterChat } from "@/lib/openrouter/server";
import { buildOpponentSystemPrompt } from "@/lib/prompts/opponent";
import { apiError } from "@/lib/utils/apiError";
import {
  boundTranscript,
  isBodyTooLarge,
  opponentRequestSchema,
} from "@/lib/validation/apiSchemas";

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

  const parsed = opponentRequestSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(
      "INVALID_REQUEST",
      "Request lawan AI tidak sesuai kontrak.",
      false,
      400,
    );
  }

  const { topic, userSide, opponentSide, currentRound } = parsed.data;

  if (userSide === opponentSide) {
    return apiError(
      "INVALID_REQUEST",
      "Posisi pengguna dan AI harus berlawanan.",
      false,
      400,
    );
  }

  const messages = boundTranscript(parsed.data.messages);
  const hasCurrentUserMessage = messages.some(
    (message) => message.round === currentRound && message.speaker === "USER",
  );

  if (!hasCurrentUserMessage) {
    return apiError(
      "INVALID_REQUEST",
      "Argumen pengguna untuk ronde saat ini belum ditemukan.",
      false,
      400,
    );
  }

  const systemPrompt = buildOpponentSystemPrompt({
    topic,
    userSide,
    opponentSide,
    currentRound,
  });
  const transcriptMessages: OpenRouterMessage[] = messages.map((message) => ({
    role: message.speaker === "USER" ? "user" : "assistant",
    content: `[${message.round}] ${message.content}`,
  }));

  try {
    const result = await sendServerOpenRouterChat({
      role: "opponent",
      messages: [{ role: "system", content: systemPrompt }, ...transcriptMessages],
      temperature: 0.7,
      maxCompletionTokens: 500,
    });

    return NextResponse.json({
      content: result.content,
      usage: result.usage,
      nextRound: getNextRound(currentRound),
    });
  } catch (error) {
    if (error instanceof ConfigMissingError) {
      return apiError(
        "CONFIG_MISSING",
        "AI server belum dikonfigurasi untuk lawan AI.",
        false,
        500,
      );
    }

    if (error instanceof OpenRouterTimeoutError) {
      return apiError(
        "OPENROUTER_TIMEOUT",
        "OpenRouter terlalu lama merespons. Coba ulangi panggilan lawan AI.",
        true,
        504,
      );
    }

    if (error instanceof OpenRouterUpstreamError) {
      const openRouterError = toOpenRouterApiError(error, "opponent");

      return apiError(
        openRouterError.code,
        openRouterError.message,
        openRouterError.retryable,
        openRouterError.status,
      );
    }

    return apiError(
      "INTERNAL_ERROR",
      "Terjadi kesalahan internal saat memanggil lawan AI.",
      true,
      500,
    );
  }
}
