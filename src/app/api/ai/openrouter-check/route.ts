import { NextResponse } from "next/server";
import {
  OpenRouterTimeoutError,
  OpenRouterUpstreamError,
  sendOpenRouterChat,
} from "@/lib/openrouter/client";
import { DEFAULT_OPENROUTER_MODEL } from "@/lib/openrouter/defaults";
import { toOpenRouterApiError } from "@/lib/openrouter/errors";
import { apiError } from "@/lib/utils/apiError";

function readModel(value: unknown): string {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : DEFAULT_OPENROUTER_MODEL;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return apiError("INVALID_REQUEST", "Body JSON tidak valid.", false, 400);
  }

  const apiKey =
    typeof body === "object" && body !== null && "apiKey" in body
      ? String((body as { apiKey: unknown }).apiKey).trim()
      : "";
  const opponentModel =
    typeof body === "object" && body !== null && "opponentModel" in body
      ? readModel((body as { opponentModel: unknown }).opponentModel)
      : DEFAULT_OPENROUTER_MODEL;
  const judgeModel =
    typeof body === "object" && body !== null && "judgeModel" in body
      ? readModel((body as { judgeModel: unknown }).judgeModel)
      : DEFAULT_OPENROUTER_MODEL;

  if (!apiKey || apiKey.length < 10) {
    return apiError(
      "INVALID_REQUEST",
      "Isi OpenRouter API key dulu sebelum tes koneksi.",
      false,
      400,
    );
  }

  const models = [...new Set([opponentModel, judgeModel])];
  let failedModel = models[0] ?? DEFAULT_OPENROUTER_MODEL;

  try {
    for (const model of models) {
      failedModel = model;
      await sendOpenRouterChat({
        apiKey,
        model,
        messages: [
          {
            role: "system",
            content:
              "Anda adalah health check singkat. Jangan beri penjelasan panjang.",
          },
          { role: "user", content: "Balas hanya: OK" },
        ],
        temperature: 0,
        maxCompletionTokens: 12,
      });
    }

    return NextResponse.json({
      status: "ready",
      checkedModels: models,
      message:
        models.length === 1
          ? `OpenRouter siap. Model ${models[0]} bisa merespons.`
          : `OpenRouter siap. ${models.length} model bisa merespons.`,
    });
  } catch (error) {
    if (error instanceof OpenRouterTimeoutError) {
      return apiError(
        "OPENROUTER_TIMEOUT",
        `Tes koneksi OpenRouter terlalu lama untuk model ${failedModel}.`,
        true,
        504,
      );
    }

    if (error instanceof OpenRouterUpstreamError) {
      const openRouterError = toOpenRouterApiError(error, "opponent");

      return apiError(
        openRouterError.code,
        `${openRouterError.message} Model yang dites: ${failedModel}.`,
        openRouterError.retryable,
        openRouterError.status,
      );
    }

    return apiError(
      "INTERNAL_ERROR",
      "Tes koneksi OpenRouter gagal diproses.",
      true,
      500,
    );
  }
}
