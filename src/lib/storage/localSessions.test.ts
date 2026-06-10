// @vitest-environment jsdom

import { afterEach, describe, expect, it } from "vitest";
import {
  MAX_LOCAL_SESSIONS,
  PREFERENCES_STORAGE_KEY,
  createExportFilename,
  getPreferences,
  limitSessions,
  savePreferences,
} from "./localSessions";
import type { DebateSession } from "@/types/debate";

function session(index: number): DebateSession {
  return {
    id: `session-${index}`,
    version: 1,
    mode: "DUEL_WACANA_AI",
    inputMode: "TEXT",
    topic: {
      id: "topic",
      title: "Topik",
      category: "Kategori",
      difficulty: "pemula",
      shortContext: "Konteks",
    },
    userSide: "PRO",
    opponentSide: "CONTRA",
    startedAt: new Date(Date.UTC(2026, 0, index + 1)).toISOString(),
    status: "COMPLETED",
    currentRound: "CLOSING",
    messages: [],
  };
}

describe("local sessions", () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it("keeps only the most recent sessions", () => {
    const limited = limitSessions(Array.from({ length: 25 }, (_, index) => session(index)));

    expect(limited).toHaveLength(MAX_LOCAL_SESSIONS);
    expect(limited[0].id).toBe("session-24");
    expect(limited.at(-1)?.id).toBe("session-5");
  });

  it("creates a safe export filename", () => {
    const filename = createExportFilename({
      ...session(0),
      id: "debate/abc 123",
      startedAt: "2026-06-07T12:00:00.000Z",
    });

    expect(filename).toBe(
      "republik-argumen-session-2026-06-07-debate-abc-123.json",
    );
  });

  it("sanitizes legacy AI secrets out of local preferences storage", () => {
    window.localStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify({
        autoSpeakOpponent: true,
        voiceInputEnabled: false,
        openRouterApiKey: "secret-browser-key",
        openRouterOpponentModel: "browser-model",
        geminiApiKey: "gemini-secret",
      }),
    );

    expect(getPreferences()).toEqual({
      autoSpeakOpponent: true,
      voiceInputEnabled: false,
    });
    expect(window.localStorage.getItem(PREFERENCES_STORAGE_KEY)).not.toContain(
      "secret-browser-key",
    );
    expect(window.localStorage.getItem(PREFERENCES_STORAGE_KEY)).not.toContain(
      "browser-model",
    );
    expect(window.localStorage.getItem(PREFERENCES_STORAGE_KEY)).not.toContain(
      "gemini-secret",
    );
  });

  it("only persists user-facing preferences", () => {
    savePreferences({
      autoSpeakOpponent: true,
      voiceInputEnabled: true,
    });

    expect(window.localStorage.getItem(PREFERENCES_STORAGE_KEY)).toBe(
      JSON.stringify({
        autoSpeakOpponent: true,
        voiceInputEnabled: true,
      }),
    );
  });
});
