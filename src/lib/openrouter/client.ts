import type { AiUsage } from "@/types/debate";

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenRouterChatOptions {
  apiKey: string;
  model: string;
  messages: OpenRouterMessage[];
  temperature: number;
  maxCompletionTokens: number;
  responseFormat?: unknown;
  provider?: unknown;
  extraUserInstruction?: string;
}

export interface OpenRouterChatResult {
  content: string;
  model?: string;
  usage?: AiUsage;
}

export type OpenRouterFailureCode =
  | "AUTHENTICATION"
  | "RATE_LIMIT"
  | "MODEL_UNAVAILABLE"
  | "INSUFFICIENT_CREDITS"
  | "UNSUPPORTED_RESPONSE_FORMAT"
  | "EMPTY_RESPONSE"
  | "UPSTREAM";

export class OpenRouterTimeoutError extends Error {
  constructor() {
    super("OpenRouter request timed out");
    this.name = "OpenRouterTimeoutError";
  }
}

export class OpenRouterUpstreamError extends Error {
  constructor(
    message: string,
    public readonly failureCode: OpenRouterFailureCode = "UPSTREAM",
    public readonly status?: number,
    public readonly responseText?: string,
  ) {
    super(message);
    this.name = "OpenRouterUpstreamError";
  }
}

export function classifyOpenRouterFailure(
  status: number,
  responseText: string,
): OpenRouterFailureCode {
  const normalized = responseText.toLowerCase();

  if (status === 401 || status === 403) {
    return "AUTHENTICATION";
  }

  if (status === 402 || normalized.includes("insufficient credits")) {
    return "INSUFFICIENT_CREDITS";
  }

  if (status === 404 || normalized.includes("model not found")) {
    return "MODEL_UNAVAILABLE";
  }

  if (status === 429 || normalized.includes("rate limit")) {
    return "RATE_LIMIT";
  }

  if (
    (status === 400 || status === 422) &&
    /(response_format|json_schema|structured|require_parameters|unsupported parameter|schema)/i.test(
      responseText,
    )
  ) {
    return "UNSUPPORTED_RESPONSE_FORMAT";
  }

  return "UPSTREAM";
}

export async function sendOpenRouterChat({
  apiKey,
  model,
  messages,
  temperature,
  maxCompletionTokens,
  responseFormat,
  provider,
}: OpenRouterChatOptions): Promise<OpenRouterChatResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45_000);

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          ...(process.env.OPENROUTER_SITE_URL
            ? { "HTTP-Referer": process.env.OPENROUTER_SITE_URL }
            : {}),
          ...(process.env.OPENROUTER_APP_NAME
            ? { "X-OpenRouter-Title": process.env.OPENROUTER_APP_NAME }
            : {}),
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_completion_tokens: maxCompletionTokens,
          ...(responseFormat ? { response_format: responseFormat } : {}),
          ...(provider ? { provider } : {}),
        }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      const failureCode = classifyOpenRouterFailure(response.status, errorText);

      throw new OpenRouterUpstreamError(
        `OpenRouter gagal dengan HTTP ${response.status}: ${errorText.slice(0, 240)}`,
        failureCode,
        response.status,
        errorText,
      );
    }

    const data = (await response.json()) as {
      model?: string;
      usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
      };
      choices?: Array<{
        message?: {
          content?: unknown;
        };
      }>;
    };
    const content = data.choices?.[0]?.message?.content;

    if (typeof content !== "string" || !content.trim()) {
      throw new OpenRouterUpstreamError(
        "OpenRouter mengembalikan konten kosong.",
        "EMPTY_RESPONSE",
      );
    }

    return {
      content,
      model: data.model,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new OpenRouterTimeoutError();
    }

    throw error;
  } finally {
    clearTimeout(timer);
  }
}
