import { afterEach, describe, expect, it, vi } from "vitest";
import { ConfigMissingError, getOpenRouterConfig } from "./config";

describe("OpenRouter config", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses the shared key as fallback", () => {
    vi.stubEnv("OPENROUTER_API_KEY", "shared-key");
    vi.stubEnv("OPENROUTER_OPPONENT_MODEL", "model-a");

    expect(getOpenRouterConfig("opponent")).toEqual({
      apiKey: "shared-key",
      model: "model-a",
    });
  });

  it("uses the explicit shared OpenRouter key as secondary fallback", () => {
    vi.stubEnv("OPENROUTER_SHARED_API_KEY", "shared-openrouter-key");
    vi.stubEnv("OPENROUTER_JUDGE_MODEL", "judge-model");

    expect(getOpenRouterConfig("judge")).toEqual({
      apiKey: "shared-openrouter-key",
      model: "judge-model",
    });
  });

  it("throws when the role model is missing", () => {
    vi.stubEnv("OPENROUTER_API_KEY", "shared-key");

    expect(() => getOpenRouterConfig("judge")).toThrow(ConfigMissingError);
  });
});
