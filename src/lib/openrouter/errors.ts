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
          "Konfigurasi AI server belum valid. Hubungi pengelola atau coba lagi setelah konfigurasi diperbaiki.",
        retryable: false,
        status: error.status ?? 401,
      };
    case "RATE_LIMIT":
      return {
        code: "OPENROUTER_RATE_LIMIT",
        message:
          "AI server sedang rate limit. Tunggu sebentar lalu coba lagi.",
        retryable: true,
        status: error.status ?? 429,
      };
    case "MODEL_UNAVAILABLE":
      return {
        code: "OPENROUTER_MODEL_UNAVAILABLE",
        message:
          "Model AI server belum tersedia. Hubungi pengelola atau coba lagi nanti.",
        retryable: false,
        status: error.status ?? 400,
      };
    case "INSUFFICIENT_CREDITS":
      return {
        code: "OPENROUTER_CREDITS",
        message:
          "Kuota AI server belum cukup untuk memproses permintaan ini.",
        retryable: false,
        status: error.status ?? 402,
      };
    case "UNSUPPORTED_RESPONSE_FORMAT":
      if (context === "tts") {
        return {
          code: "OPENROUTER_UNSUPPORTED_RESPONSE_FORMAT",
          message:
            "Format suara AI belum didukung oleh konfigurasi server saat ini.",
          retryable: false,
          status: error.status ?? 400,
        };
      }

      if (context === "stt") {
        return {
          code: "OPENROUTER_UNSUPPORTED_RESPONSE_FORMAT",
          message:
            "Format transkripsi suara belum didukung. Coba ulangi atau gunakan ketikan.",
          retryable: true,
          status: error.status ?? 400,
        };
      }

      return {
        code: "OPENROUTER_UNSUPPORTED_RESPONSE_FORMAT",
        message:
          "AI Judge belum mendukung format penilaian yang dibutuhkan server.",
        retryable: false,
        status: error.status ?? 400,
      };
    case "EMPTY_RESPONSE":
      return {
        code: "OPENROUTER_EMPTY_RESPONSE",
        message: `AI server mengembalikan respons kosong untuk ${label}. Coba ulangi.`,
        retryable: true,
        status: 502,
      };
    case "UPSTREAM":
    default:
      return {
        code: "OPENROUTER_ERROR",
        message: `AI server gagal mengembalikan jawaban ${label}. Coba ulangi.`,
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
