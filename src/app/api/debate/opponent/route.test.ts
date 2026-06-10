import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

function createJsonRequest(body: unknown): Request {
  return new Request("http://localhost/api/debate/opponent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("/api/debate/opponent", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns a specific retryable error when OpenRouter rate limits", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "server_key_123456");
    vi.stubEnv("OPENROUTER_OPPONENT_MODEL", "openrouter/free");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("rate limit exceeded", { status: 429 })),
    );

    const response = await POST(
      createJsonRequest({
        topic: {
          id: "ai-jobs",
          title: "AI akan membuka lebih banyak pekerjaan baru",
          category: "Teknologi",
          difficulty: "pemula",
          shortContext: "Debat tentang dampak AI pada pekerjaan.",
        },
        userSide: "PRO",
        opponentSide: "CONTRA",
        currentRound: "OPENING",
        messages: [
          {
            id: "message_1",
            speaker: "USER",
            round: "OPENING",
            content: "AI membantu pekerjaan repetitif agar manusia fokus pada strategi.",
            createdAt: new Date("2026-06-09T01:00:00.000Z").toISOString(),
          },
        ],
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(payload.error).toMatchObject({
      code: "OPENROUTER_RATE_LIMIT",
      retryable: true,
    });
    expect(payload.error.message).toContain("rate limit");
  });

  it("rejects browser-supplied AI config before any upstream call", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      createJsonRequest({
        topic: {
          id: "ai-jobs",
          title: "AI akan membuka lebih banyak pekerjaan baru",
          category: "Teknologi",
          difficulty: "pemula",
          shortContext: "Debat tentang dampak AI pada pekerjaan.",
        },
        userSide: "PRO",
        opponentSide: "CONTRA",
        currentRound: "OPENING",
        messages: [
          {
            id: "message_1",
            speaker: "USER",
            round: "OPENING",
            content: "AI membantu pekerjaan repetitif.",
            createdAt: new Date("2026-06-09T01:00:00.000Z").toISOString(),
          },
        ],
        aiConfig: {
          provider: "openrouter",
          apiKey: "browser_secret_should_not_pass",
        },
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
});
