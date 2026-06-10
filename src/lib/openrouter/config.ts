export type OpenRouterRole = "opponent" | "judge";

export interface OpenRouterRoleConfig {
  apiKey: string;
  model: string;
}

export class ConfigMissingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigMissingError";
  }
}

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

export function getOpenRouterConfig(role: OpenRouterRole): OpenRouterRoleConfig {
  const fallbackKey =
    readEnv("OPENROUTER_API_KEY") ?? readEnv("OPENROUTER_SHARED_API_KEY");
  const apiKey =
    role === "opponent"
      ? readEnv("OPENROUTER_OPPONENT_API_KEY") ?? fallbackKey
      : readEnv("OPENROUTER_JUDGE_API_KEY") ?? fallbackKey;
  const model =
    role === "opponent"
      ? readEnv("OPENROUTER_OPPONENT_MODEL")
      : readEnv("OPENROUTER_JUDGE_MODEL");

  if (!apiKey) {
    throw new ConfigMissingError(
      `OpenRouter API key untuk ${role} belum dikonfigurasi.`,
    );
  }

  if (!model) {
    throw new ConfigMissingError(
      `OpenRouter model untuk ${role} belum dikonfigurasi.`,
    );
  }

  return { apiKey, model };
}
