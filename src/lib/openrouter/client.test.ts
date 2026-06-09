import { afterEach, describe, expect, it, vi } from "vitest";
import {
  classifyOpenRouterFailure,
  OpenRouterUpstreamError,
  sendOpenRouterChat,
} from "./client";

describe("OpenRouter client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("classifies common OpenRouter failures", () => {
    expect(classifyOpenRouterFailure(401, "invalid api key")).toBe(
      "AUTHENTICATION",
    );
    expect(classifyOpenRouterFailure(429, "rate limit exceeded")).toBe(
      "RATE_LIMIT",
    );
    expect(classifyOpenRouterFailure(404, "model not found")).toBe(
      "MODEL_UNAVAILABLE",
    );
    expect(classifyOpenRouterFailure(400, "response_format json_schema unsupported")).toBe(
      "UNSUPPORTED_RESPONSE_FORMAT",
    );
  });

  it("throws a classified upstream error when OpenRouter rejects a request", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("rate limit exceeded", { status: 429 })),
    );

    await expect(
      sendOpenRouterChat({
        apiKey: "or_test_key_123456",
        model: "openrouter/free",
        messages: [{ role: "user", content: "Halo" }],
        temperature: 0.2,
        maxCompletionTokens: 100,
      }),
    ).rejects.toMatchObject({
      failureCode: "RATE_LIMIT",
      status: 429,
    });
  });

  it("treats blank assistant content as an empty response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          choices: [{ message: { content: "   " } }],
        }),
      ),
    );

    await expect(
      sendOpenRouterChat({
        apiKey: "or_test_key_123456",
        model: "openrouter/free",
        messages: [{ role: "user", content: "Halo" }],
        temperature: 0.2,
        maxCompletionTokens: 100,
      }),
    ).rejects.toEqual(expect.any(OpenRouterUpstreamError));

    await expect(
      sendOpenRouterChat({
        apiKey: "or_test_key_123456",
        model: "openrouter/free",
        messages: [{ role: "user", content: "Halo" }],
        temperature: 0.2,
        maxCompletionTokens: 100,
      }),
    ).rejects.toMatchObject({
      failureCode: "EMPTY_RESPONSE",
    });
  });
});
