import type { ApiErrorResponse } from "@/types/debate";
import { OpenRouterUpstreamError } from "./client";

export interface OpenRouterApiErrorDetails {
  code: ApiErrorResponse["error"]["code"];
  message: string;
  retryable: boolean;
  status: number;
}

type OpenRouterErrorContext = "opponent" | "judge" | "stt" | "tts";

function contextLabel(context: OpenRouterErrorContext): string {
  if (context === "judge") {
    return "AI Judge";
  }

  if (context === "stt") {
    return "transkripsi suara";
  }

  if (context === "tts") {
    return "suara AI";
  }

  return "lawan AI";
}

export function toOpenRouterApiError(
  error: OpenRouterUpstreamError,
  context: OpenRouterErrorContext,
): OpenRouterApiErrorDetails {
  const label = contextLabel(context);

  switch (error.failureCode) {
    case "AUTHENTICATION":
      return {
        code: "OPENROUTER_AUTH",
        message:
          "OpenRouter API key tidak valid atau tidak punya akses. Periksa key yang Anda isi.",
        retryable: false,
        status: error.status ?? 401,
      };
    case "RATE_LIMIT":
      return {
        code: "OPENROUTER_RATE_LIMIT",
        message:
          "OpenRouter sedang rate limit. Tunggu sebentar atau pilih model lain.",
        retryable: true,
        status: error.status ?? 429,
      };
    case "MODEL_UNAVAILABLE":
      return {
        code: "OPENROUTER_MODEL_UNAVAILABLE",
        message:
          "Model OpenRouter tidak tersedia atau ID model salah. Pilih model gratis/murah lain.",
        retryable: false,
        status: error.status ?? 400,
      };
    case "INSUFFICIENT_CREDITS":
      return {
        code: "OPENROUTER_CREDITS",
        message:
          "Kuota atau kredit OpenRouter tidak cukup untuk model ini. Pilih model gratis atau isi kredit.",
        retryable: false,
        status: error.status ?? 402,
      };
    case "UNSUPPORTED_RESPONSE_FORMAT":
      if (context === "tts") {
        return {
          code: "OPENROUTER_UNSUPPORTED_RESPONSE_FORMAT",
          message:
            "Model atau format suara OpenRouter tidak didukung. Periksa model TTS dan format audio.",
          retryable: false,
          status: error.status ?? 400,
        };
      }

      if (context === "stt") {
        return {
          code: "OPENROUTER_UNSUPPORTED_RESPONSE_FORMAT",
          message:
            "Model transkripsi OpenRouter tidak mendukung format audio ini. Coba ulangi atau gunakan ketikan.",
          retryable: true,
          status: error.status ?? 400,
        };
      }

      return {
        code: "OPENROUTER_UNSUPPORTED_RESPONSE_FORMAT",
        message:
          "Model OpenRouter ini belum mendukung format JSON ketat yang dibutuhkan penilaian. Pilih model judge lain.",
        retryable: false,
        status: error.status ?? 400,
      };
    case "EMPTY_RESPONSE":
      return {
        code: "OPENROUTER_EMPTY_RESPONSE",
        message: `OpenRouter mengembalikan respons kosong untuk ${label}. Coba ulangi atau pilih model lain.`,
        retryable: true,
        status: 502,
      };
    case "UPSTREAM":
    default:
      return {
        code: "OPENROUTER_ERROR",
        message: `OpenRouter gagal mengembalikan jawaban ${label}. Coba ulangi atau pilih model lain.`,
        retryable: true,
        status: error.status && error.status >= 400 ? error.status : 502,
      };
  }
}

export function isUnsupportedStructuredOutputError(error: unknown): boolean {
  return (
    error instanceof OpenRouterUpstreamError &&
    error.failureCode === "UNSUPPORTED_RESPONSE_FORMAT"
  );
}
