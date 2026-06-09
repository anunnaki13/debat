import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

function createJsonRequest(body: unknown): Request {
  return new Request("http://localhost/api/ai/openrouter-check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("/api/ai/openrouter-check", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("checks unique OpenRouter models with a tiny chat request", async () => {
    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        void input;
        void init;

        return Response.json({
          model: "openrouter/free",
          choices: [{ message: { content: "OK" } }],
        });
      },
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      createJsonRequest({
        apiKey: "or_test_key_123456",
        opponentModel: "openrouter/free",
        judgeModel: "openrouter/free",
      }),
    );
    const payload = await response.json();
    const firstBody = JSON.parse(
      (fetchMock.mock.calls[0]![1] as RequestInit).body as string,
    );

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(firstBody).toMatchObject({
      model: "openrouter/free",
      temperature: 0,
      max_completion_tokens: 12,
    });
    expect(payload).toMatchObject({
      status: "ready",
      checkedModels: ["openrouter/free"],
    });
  });

  it("checks opponent and judge separately when models differ", async () => {
    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        void input;
        void init;

        return Response.json({
          choices: [{ message: { content: "OK" } }],
        });
      },
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      createJsonRequest({
        apiKey: "or_test_key_123456",
        opponentModel: "model-a",
        judgeModel: "model-b",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(payload.checkedModels).toEqual(["model-a", "model-b"]);
  });

  it("rejects missing API key before calling OpenRouter", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      createJsonRequest({
        apiKey: "",
        opponentModel: "openrouter/free",
        judgeModel: "openrouter/free",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(payload.error).toMatchObject({
      code: "INVALID_REQUEST",
      retryable: false,
    });
  });

  it("returns the failed model in a specific OpenRouter error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("rate limit exceeded", { status: 429 })),
    );

    const response = await POST(
      createJsonRequest({
        apiKey: "or_test_key_123456",
        opponentModel: "busy-model",
        judgeModel: "openrouter/free",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(payload.error).toMatchObject({
      code: "OPENROUTER_RATE_LIMIT",
      retryable: true,
    });
    expect(payload.error.message).toContain("busy-model");
  });
});
