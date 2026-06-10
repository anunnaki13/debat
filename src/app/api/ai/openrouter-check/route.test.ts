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
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("checks server-configured opponent and judge roles without browser secrets", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "server-secret");
    vi.stubEnv("OPENROUTER_OPPONENT_MODEL", "model-a");
    vi.stubEnv("OPENROUTER_JUDGE_MODEL", "model-b");
    vi.spyOn(console, "info").mockImplementation(() => undefined);
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

    const response = await POST();
    const payload = await response.json();
    const firstHeaders = (fetchMock.mock.calls[0]![1] as RequestInit)
      .headers as Record<string, string>;
    const serialized = JSON.stringify(payload);

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(firstHeaders.Authorization).toBe("Bearer server-secret");
    expect(payload).toMatchObject({
      status: "ready",
      checkedRoles: ["opponent", "judge"],
    });
    expect(serialized).not.toContain("server-secret");
    expect(serialized).not.toContain("model-a");
    expect(serialized).not.toContain("model-b");
  });

  it("ignores browser-supplied API key/model body and reports missing server config", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const request = createJsonRequest({
      apiKey: "browser_secret_should_not_be_used",
      opponentModel: "browser-model",
    });
    const response = await POST();
    const payload = await response.json();
    const serialized = JSON.stringify(payload);

    expect(await request.text()).toContain("browser_secret_should_not_be_used");
    expect(response.status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(payload.error).toMatchObject({
      code: "CONFIG_MISSING",
      retryable: false,
    });
    expect(serialized).not.toContain("browser_secret_should_not_be_used");
    expect(serialized).not.toContain("browser-model");
  });
});
