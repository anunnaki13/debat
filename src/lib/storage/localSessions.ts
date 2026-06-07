import type { DebateSession, UserPreferences } from "@/types/debate";
import { DEFAULT_GEMINI_MODEL } from "@/lib/gemini/defaults";
import { DEFAULT_OPENROUTER_MODEL } from "@/lib/openrouter/defaults";

export const SESSIONS_STORAGE_KEY = "republik-argumen.sessions.v1";
export const PREFERENCES_STORAGE_KEY = "republik-argumen.preferences.v1";
export const MAX_LOCAL_SESSIONS = 20;

export const DEFAULT_PREFERENCES: UserPreferences = {
  autoSpeakOpponent: false,
  voiceInputEnabled: true,
  aiProvider: "openrouter",
  openRouterApiKey: "",
  openRouterOpponentModel: DEFAULT_OPENROUTER_MODEL,
  openRouterJudgeModel: DEFAULT_OPENROUTER_MODEL,
  geminiApiKey: "",
  geminiOpponentModel: DEFAULT_GEMINI_MODEL,
  geminiJudgeModel: DEFAULT_GEMINI_MODEL,
};

function isBrowser(): boolean {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function limitSessions(sessions: DebateSession[]): DebateSession[] {
  return [...sessions]
    .sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    )
    .slice(0, MAX_LOCAL_SESSIONS);
}

export function getLocalSessions(): DebateSession[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(SESSIONS_STORAGE_KEY);
    return raw ? limitSessions(JSON.parse(raw) as DebateSession[]) : [];
  } catch {
    return [];
  }
}

export function saveLocalSessions(sessions: DebateSession[]): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(
    SESSIONS_STORAGE_KEY,
    JSON.stringify(limitSessions(sessions)),
  );
}

export function getLocalSession(sessionId: string): DebateSession | null {
  return getLocalSessions().find((session) => session.id === sessionId) ?? null;
}

export function upsertLocalSession(session: DebateSession): DebateSession[] {
  const existing = getLocalSessions().filter((item) => item.id !== session.id);
  const nextSessions = limitSessions([session, ...existing]);
  saveLocalSessions(nextSessions);
  return nextSessions;
}

export function deleteLocalSession(sessionId: string): DebateSession[] {
  const nextSessions = getLocalSessions().filter(
    (session) => session.id !== sessionId,
  );
  saveLocalSessions(nextSessions);
  return nextSessions;
}

export function clearLocalSessions(): void {
  if (isBrowser()) {
    window.localStorage.removeItem(SESSIONS_STORAGE_KEY);
  }
}

export function getPreferences(): UserPreferences {
  if (!isBrowser()) {
    return DEFAULT_PREFERENCES;
  }

  try {
    const raw = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
    return raw
      ? { ...DEFAULT_PREFERENCES, ...(JSON.parse(raw) as Partial<UserPreferences>) }
      : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(preferences: UserPreferences): void {
  if (isBrowser()) {
    window.localStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify(preferences),
    );
  }
}

export function createExportFilename(session: DebateSession): string {
  const date = new Date(session.startedAt).toISOString().slice(0, 10);
  const safeId = session.id.replace(/[^a-zA-Z0-9-]/g, "-");
  return `republik-argumen-session-${date}-${safeId}.json`;
}
