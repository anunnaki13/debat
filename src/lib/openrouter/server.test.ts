import { afterEach, describe, expect, it, vi } from "vitest";
import { sendServerOpenRouterChat } from "./server";

describe("server OpenRouter adapter", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("uses role-specific server config and retries transient failures", async () => {
    vi.stubEnv("OPENROUTER_OPPONENT_API_KEY", "opponent-key");
    vi.stubEnv("OPENROUTER_OPPONENT_MODEL", "opponent-model");
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("rate limit exceeded", { status: 429 }))
      .mockResolvedValueOnce(
        Response.json({
          model: "opponent-model",
          usage: {
            prompt_tokens: 10,
            completion_tokens: 12,
            total_tokens: 22,
          },
          choices: [{ message: { content: "Jawaban AI" } }],
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendServerOpenRouterChat({
      role: "opponent",
      messages: [{ role: "user", content: "Argumen" }],
      temperature: 0.2,
      maxCompletionTokens: 120,
    });
    const requestHeaders = (fetchMock.mock.calls[0]![1] as RequestInit)
      .headers as Record<string, string>;
    const requestBody = JSON.parse(
      (fetchMock.mock.calls[0]![1] as RequestInit).body as string,
    );

    expect(result.content).toBe("Jawaban AI");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(requestHeaders.Authorization).toBe("Bearer opponent-key");
    expect(requestBody.model).toBe("opponent-model");
  });
});
