import { NextResponse } from "next/server";
import { getNextRound } from "@/lib/debate/rules";
import { DEFAULT_GEMINI_MODEL } from "@/lib/gemini/defaults";
import {
  GeminiTimeoutError,
  GeminiUpstreamError,
  sendGeminiGenerateContent,
  type GeminiContent,
} from "@/lib/gemini/client";
import { getOpenRouterConfig, ConfigMissingError } from "@/lib/openrouter/config";
import { DEFAULT_OPENROUTER_MODEL } from "@/lib/openrouter/defaults";
import {
  OpenRouterTimeoutError,
  OpenRouterUpstreamError,
  sendOpenRouterChat,
  type OpenRouterMessage,
} from "@/lib/openrouter/client";
import { toOpenRouterApiError } from "@/lib/openrouter/errors";
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
  const geminiMessages: GeminiContent[] = messages.map((message) => ({
    role: message.speaker === "USER" ? "user" : "model",
    parts: [{ text: `[${message.round}] ${message.content}` }],
  }));

  try {
    if (parsed.data.aiConfig?.provider === "openrouter") {
      const model =
        parsed.data.aiConfig.opponentModel?.trim() ||
        DEFAULT_OPENROUTER_MODEL;
      const result = await sendOpenRouterChat({
        apiKey: parsed.data.aiConfig.apiKey,
        model,
        messages: [{ role: "system", content: systemPrompt }, ...transcriptMessages],
        temperature: 0.7,
        maxCompletionTokens: 500,
      });

      return NextResponse.json({
        content: result.content,
        model: result.model ?? model,
        usage: result.usage,
        nextRound: getNextRound(currentRound),
      });
    }

    if (parsed.data.aiConfig?.provider === "gemini") {
      const model =
        parsed.data.aiConfig.opponentModel?.trim() || DEFAULT_GEMINI_MODEL;
      const result = await sendGeminiGenerateContent({
        apiKey: parsed.data.aiConfig.apiKey,
        model,
        systemInstruction: systemPrompt,
        contents: geminiMessages,
        temperature: 0.7,
        maxOutputTokens: 500,
      });

      return NextResponse.json({
        content: result.content,
        model: result.model ?? model,
        usage: result.usage,
        nextRound: getNextRound(currentRound),
      });
    }

    const { apiKey, model } = getOpenRouterConfig("opponent");
    const result = await sendOpenRouterChat({
      apiKey,
      model,
      messages: [{ role: "system", content: systemPrompt }, ...transcriptMessages],
      temperature: 0.7,
      maxCompletionTokens: 500,
    });

    return NextResponse.json({
      content: result.content,
      model: result.model ?? model,
      usage: result.usage,
      nextRound: getNextRound(currentRound),
    });
  } catch (error) {
    if (error instanceof ConfigMissingError) {
      return apiError("CONFIG_MISSING", error.message, false, 500);
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

    if (error instanceof GeminiTimeoutError) {
      return apiError(
        "GEMINI_TIMEOUT",
        "Gemini terlalu lama merespons. Coba ulangi panggilan lawan AI.",
        true,
        504,
      );
    }

    if (error instanceof GeminiUpstreamError) {
      return apiError(
        "GEMINI_ERROR",
        "Gemini gagal mengembalikan jawaban lawan AI. Periksa API key dan model.",
        true,
        502,
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
