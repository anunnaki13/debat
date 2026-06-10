import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

describe("/api/health", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("reports server-side OpenRouter readiness without exposing secrets or model names", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "secret-key");
    vi.stubEnv("OPENROUTER_OPPONENT_MODEL", "opponent-model");
    vi.stubEnv("OPENROUTER_JUDGE_MODEL", "judge-model");
    vi.stubEnv("OPENROUTER_TTS_MODEL", "tts-model");

    const response = await GET();
    const payload = await response.json();
    const serialized = JSON.stringify(payload);

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      status: "ok",
      openRouter: {
        opponentConfigured: true,
        judgeConfigured: true,
        sttConfigured: true,
        ttsConfigured: true,
      },
    });
    expect(serialized).not.toContain("secret-key");
    expect(serialized).not.toContain("opponent-model");
    expect(serialized).not.toContain("judge-model");
  });
});
