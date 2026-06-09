import { NextResponse } from "next/server";
import {
  classifyOpenRouterFailure,
  OpenRouterUpstreamError,
} from "@/lib/openrouter/client";
import { toOpenRouterApiError } from "@/lib/openrouter/errors";
import { calculateDeliverySignals } from "@/lib/voice/deliverySignals";
import { apiError } from "@/lib/utils/apiError";

const MAX_AUDIO_BYTES = 8 * 1024 * 1024;

function getSttConfig() {
  const apiKey =
    process.env.OPENROUTER_STT_API_KEY?.trim() ||
    process.env.OPENROUTER_SHARED_API_KEY?.trim() ||
    process.env.OPENROUTER_API_KEY?.trim();
  const model =
    process.env.OPENROUTER_STT_MODEL?.trim() || "openai/whisper-large-v3";

  if (!apiKey) {
    throw new Error("CONFIG_MISSING");
  }

  return {
    apiKey,
    model,
    language: process.env.OPENROUTER_STT_LANGUAGE?.trim() || "id",
  };
}

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return apiError("INVALID_REQUEST", "Form audio tidak valid.", false, 400);
  }

  const audio = formData.get("audioBlob");
  const mimeType = String(formData.get("mimeType") ?? "audio/webm");
  const durationMs = Number(formData.get("durationMs") ?? 0);

  if (!(audio instanceof File)) {
    return apiError("INVALID_REQUEST", "Audio belum ditemukan.", false, 400);
  }

  if (audio.size > MAX_AUDIO_BYTES) {
    return apiError("INVALID_REQUEST", "Audio terlalu besar untuk MVP.", false, 413);
  }

  try {
    const { apiKey, model, language } = getSttConfig();
    const bytes = Buffer.from(await audio.arrayBuffer());
    const startedAt = performance.now();
    const response = await fetch(
      "https://openrouter.ai/api/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          ...(process.env.OPENROUTER_APP_URL
            ? { "HTTP-Referer": process.env.OPENROUTER_APP_URL }
            : {}),
          ...(process.env.OPENROUTER_APP_NAME
            ? { "X-OpenRouter-Title": process.env.OPENROUTER_APP_NAME }
            : {}),
        },
        body: JSON.stringify({
          input_audio: {
            data: bytes.toString("base64"),
            format: mimeType.includes("wav") ? "wav" : "webm",
          },
          model,
          language,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      const openRouterError = toOpenRouterApiError(
        new OpenRouterUpstreamError(
          `OpenRouter STT gagal dengan HTTP ${response.status}.`,
          classifyOpenRouterFailure(response.status, errorText),
          response.status,
          errorText,
        ),
        "stt",
      );

      return apiError(
        openRouterError.code,
        openRouterError.message,
        openRouterError.retryable,
        openRouterError.status,
      );
    }

    const payload = (await response.json()) as {
      text?: string;
      transcript?: string;
      usage?: { cost?: number; seconds?: number };
    };
    const transcript = (payload.text ?? payload.transcript ?? "").trim();

    if (!transcript) {
      return apiError(
        "OPENROUTER_EMPTY_RESPONSE",
        "Transkrip kosong. Coba ulangi atau gunakan ketikan.",
        true,
        502,
      );
    }

    return NextResponse.json({
      transcript,
      usage: {
        seconds: payload.usage?.seconds,
        costUsd: payload.usage?.cost,
      },
      deliverySignals: calculateDeliverySignals({
        transcript,
        durationMs: durationMs || Math.round(performance.now() - startedAt),
      }),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "CONFIG_MISSING") {
      return apiError(
        "CONFIG_MISSING",
        "OpenRouter STT key belum dikonfigurasi di server.",
        false,
        500,
      );
    }

    return apiError(
      "INTERNAL_ERROR",
      "STT gagal diproses. Gunakan ketikan sebagai fallback.",
      true,
      500,
    );
  }
}
