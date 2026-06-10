import { NextResponse } from "next/server";
import {
  OpenRouterTimeoutError,
  OpenRouterUpstreamError,
} from "@/lib/openrouter/client";
import { ConfigMissingError } from "@/lib/openrouter/config";
import { toOpenRouterApiError } from "@/lib/openrouter/errors";
import { sendServerOpenRouterChat } from "@/lib/openrouter/server";
import { apiError } from "@/lib/utils/apiError";

const roles = ["opponent", "judge"] as const;

export async function POST() {
  const checkedRoles: string[] = [];
  let failedRole: (typeof roles)[number] = "opponent";

  try {
    for (const role of roles) {
      failedRole = role;
      await sendServerOpenRouterChat({
        role,
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
        maxAttempts: 1,
      });
      checkedRoles.push(role);
    }

    return NextResponse.json({
      status: "ready",
      checkedRoles,
      message: "OpenRouter server siap untuk lawan AI dan AI Judge.",
    });
  } catch (error) {
    if (error instanceof ConfigMissingError) {
      return apiError(
        "CONFIG_MISSING",
        `Konfigurasi server untuk ${failedRole} belum lengkap.`,
        false,
        500,
      );
    }

    if (error instanceof OpenRouterTimeoutError) {
      return apiError(
        "OPENROUTER_TIMEOUT",
        `Tes koneksi OpenRouter terlalu lama untuk ${failedRole}.`,
        true,
        504,
      );
    }

    if (error instanceof OpenRouterUpstreamError) {
      const openRouterError = toOpenRouterApiError(error, failedRole);

      return apiError(
        openRouterError.code,
        `${openRouterError.message} Role yang dites: ${failedRole}.`,
        openRouterError.retryable,
        openRouterError.status,
      );
    }

    return apiError(
      "INTERNAL_ERROR",
      "Tes koneksi OpenRouter server gagal diproses.",
      true,
      500,
    );
  }
}
