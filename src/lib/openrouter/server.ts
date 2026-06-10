import type { AiUsage } from "@/types/debate";
import {
  OpenRouterTimeoutError,
  OpenRouterUpstreamError,
  sendOpenRouterChat,
  type OpenRouterChatResult,
  type OpenRouterMessage,
} from "./client";
import { getOpenRouterConfig, type OpenRouterRole } from "./config";

export interface ServerOpenRouterChatOptions {
  role: OpenRouterRole;
  messages: OpenRouterMessage[];
  temperature: number;
  maxCompletionTokens: number;
  responseFormat?: unknown;
  provider?: unknown;
  maxAttempts?: number;
}

function shouldRetry(error: unknown): boolean {
  if (error instanceof OpenRouterTimeoutError) {
    return true;
  }

  if (!(error instanceof OpenRouterUpstreamError)) {
    return false;
  }

  return ["RATE_LIMIT", "UPSTREAM", "EMPTY_RESPONSE"].includes(
    error.failureCode,
  );
}

function estimateCostUsd(usage?: AiUsage): number | null {
  const totalTokens = usage?.totalTokens;
  const pricePerMillion = Number(
    process.env.OPENROUTER_ESTIMATED_USD_PER_1M_TOKENS ?? "",
  );

  if (!totalTokens || !Number.isFinite(pricePerMillion) || pricePerMillion <= 0) {
    return null;
  }

  return Number(((totalTokens / 1_000_000) * pricePerMillion).toFixed(8));
}

function logRequestMetric({
  role,
  attempt,
  latencyMs,
  usage,
  success,
  errorName,
}: {
  role: OpenRouterRole;
  attempt: number;
  latencyMs: number;
  usage?: AiUsage;
  success: boolean;
  errorName?: string;
}) {
  console.info(
    JSON.stringify({
      event: "openrouter_request",
      role,
      attempt,
      latencyMs,
      promptTokens: usage?.promptTokens ?? null,
      completionTokens: usage?.completionTokens ?? null,
      totalTokens: usage?.totalTokens ?? null,
      estimatedCostUsd: estimateCostUsd(usage),
      success,
      errorName: errorName ?? null,
    }),
  );
}

export async function sendServerOpenRouterChat({
  role,
  messages,
  temperature,
  maxCompletionTokens,
  responseFormat,
  provider,
  maxAttempts = 2,
}: ServerOpenRouterChatOptions): Promise<OpenRouterChatResult> {
  const { apiKey, model } = getOpenRouterConfig(role);
  let lastError: unknown;
  const attempts = Math.max(1, maxAttempts);

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const startedAt = performance.now();

    try {
      const result = await sendOpenRouterChat({
        apiKey,
        model,
        messages,
        temperature,
        maxCompletionTokens,
        responseFormat,
        provider,
      });

      logRequestMetric({
        role,
        attempt,
        latencyMs: Math.round(performance.now() - startedAt),
        usage: result.usage,
        success: true,
      });

      return result;
    } catch (error) {
      lastError = error;
      logRequestMetric({
        role,
        attempt,
        latencyMs: Math.round(performance.now() - startedAt),
        success: false,
        errorName: error instanceof Error ? error.name : "UnknownError",
      });

      if (attempt >= attempts || !shouldRetry(error)) {
        throw error;
      }
    }
  }

  throw lastError;
}
