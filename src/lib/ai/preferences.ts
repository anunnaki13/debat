import { DEFAULT_GEMINI_MODEL } from "@/lib/gemini/defaults";
import { DEFAULT_OPENROUTER_MODEL } from "@/lib/openrouter/defaults";
import type { UserPreferences } from "@/types/debate";

export function buildClientAiConfig(preferences: UserPreferences) {
  if (process.env.NODE_ENV === "production") {
    return undefined;
  }

  if (preferences.aiProvider === "openrouter") {
    const apiKey = preferences.openRouterApiKey.trim();

    if (!apiKey) {
      return undefined;
    }

    return {
      provider: "openrouter" as const,
      apiKey,
      opponentModel:
        preferences.openRouterOpponentModel.trim() || DEFAULT_OPENROUTER_MODEL,
      judgeModel:
        preferences.openRouterJudgeModel.trim() || DEFAULT_OPENROUTER_MODEL,
    };
  }

  const apiKey = preferences.geminiApiKey.trim();

  if (!apiKey) {
    return undefined;
  }

  return {
    provider: "gemini" as const,
    apiKey,
    opponentModel: preferences.geminiOpponentModel.trim() || DEFAULT_GEMINI_MODEL,
    judgeModel: preferences.geminiJudgeModel.trim() || DEFAULT_GEMINI_MODEL,
  };
}
