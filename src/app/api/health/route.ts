import { NextResponse } from "next/server";
import { getOpenRouterConfig } from "@/lib/openrouter/config";

function isConfigured(readConfig: () => unknown): boolean {
  try {
    readConfig();
    return true;
  } catch {
    return false;
  }
}

function hasEnv(...names: string[]): boolean {
  return names.some((name) => Boolean(process.env[name]?.trim()));
}

export async function GET() {
  const openRouter = {
    opponentConfigured: isConfigured(() => getOpenRouterConfig("opponent")),
    judgeConfigured: isConfigured(() => getOpenRouterConfig("judge")),
    sttConfigured: hasEnv(
      "OPENROUTER_STT_API_KEY",
      "OPENROUTER_SHARED_API_KEY",
      "OPENROUTER_API_KEY",
    ),
    ttsConfigured:
      hasEnv(
        "OPENROUTER_TTS_API_KEY",
        "OPENROUTER_SHARED_API_KEY",
        "OPENROUTER_API_KEY",
      ) && hasEnv("OPENROUTER_TTS_MODEL"),
  };
  const ready = openRouter.opponentConfigured && openRouter.judgeConfigured;

  return NextResponse.json({
    status: ready ? "ok" : "degraded",
    openRouter,
    timestamp: new Date().toISOString(),
  });
}
