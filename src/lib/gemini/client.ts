import type { AiUsage } from "@/types/debate";

export interface GeminiContent {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

export interface GeminiGenerateOptions {
  apiKey: string;
  model: string;
  systemInstruction: string;
  contents: GeminiContent[];
  temperature: number;
  maxOutputTokens: number;
  responseMimeType?: "application/json" | "text/plain";
}

export interface GeminiGenerateResult {
  content: string;
  model?: string;
  usage?: AiUsage;
}

export class GeminiTimeoutError extends Error {
  constructor() {
    super("Gemini request timed out");
    this.name = "GeminiTimeoutError";
  }
}

export class GeminiUpstreamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiUpstreamError";
  }
}

function normalizeModelPath(model: string): string {
  const trimmed = model.trim();
  return trimmed.startsWith("models/") ? trimmed : `models/${trimmed}`;
}

function extractCandidateText(data: {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: unknown }>;
    };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
}): string {
  const candidate = data.candidates?.[0];
  const text = candidate?.content?.parts
    ?.map((part) => (typeof part.text === "string" ? part.text : ""))
    .join("")
    .trim();

  if (text) {
    return text;
  }

  if (data.promptFeedback?.blockReason) {
    throw new GeminiUpstreamError(
      `Gemini memblokir prompt: ${data.promptFeedback.blockReason}`,
    );
  }

  if (candidate?.finishReason) {
    throw new GeminiUpstreamError(
      `Gemini tidak mengembalikan teks. Finish reason: ${candidate.finishReason}`,
    );
  }

  throw new GeminiUpstreamError("Gemini mengembalikan konten kosong.");
}

export async function sendGeminiGenerateContent({
  apiKey,
  model,
  systemInstruction,
  contents,
  temperature,
  maxOutputTokens,
  responseMimeType,
}: GeminiGenerateOptions): Promise<GeminiGenerateResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45_000);
  const modelPath = normalizeModelPath(model);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents,
          generationConfig: {
            temperature,
            maxOutputTokens,
            ...(responseMimeType ? { responseMimeType } : {}),
          },
        }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new GeminiUpstreamError(
        `Gemini gagal dengan HTTP ${response.status}: ${errorText.slice(0, 240)}`,
      );
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: unknown }>;
        };
        finishReason?: string;
      }>;
      promptFeedback?: { blockReason?: string };
      usageMetadata?: {
        promptTokenCount?: number;
        candidatesTokenCount?: number;
        totalTokenCount?: number;
      };
      modelVersion?: string;
    };
    const content = extractCandidateText(data);

    return {
      content,
      model: data.modelVersion ?? model,
      usage: data.usageMetadata
        ? {
            promptTokens: data.usageMetadata.promptTokenCount,
            completionTokens: data.usageMetadata.candidatesTokenCount,
            totalTokens: data.usageMetadata.totalTokenCount,
          }
        : undefined,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new GeminiTimeoutError();
    }

    throw error;
  } finally {
    clearTimeout(timer);
  }
}
