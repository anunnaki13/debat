import type { DebateSession, UserPreferences } from "@/types/debate";

export const SESSIONS_STORAGE_KEY = "republik-argumen.sessions.v1";
export const PREFERENCES_STORAGE_KEY = "republik-argumen.preferences.v1";
export const MAX_LOCAL_SESSIONS = 20;

export const DEFAULT_PREFERENCES: UserPreferences = {
  autoSpeakOpponent: false,
  voiceInputEnabled: true,
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
    const parsed = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    const preferences = sanitizePreferences(parsed);

    if (raw && JSON.stringify(parsed) !== JSON.stringify(preferences)) {
      savePreferences(preferences);
    }

    return preferences;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(preferences: UserPreferences): void {
  if (isBrowser()) {
    window.localStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify(sanitizePreferences(preferences)),
    );
  }
}

export function sanitizePreferences(value: Partial<UserPreferences>): UserPreferences {
  return {
    autoSpeakOpponent:
      typeof value.autoSpeakOpponent === "boolean"
        ? value.autoSpeakOpponent
        : DEFAULT_PREFERENCES.autoSpeakOpponent,
    voiceInputEnabled:
      typeof value.voiceInputEnabled === "boolean"
        ? value.voiceInputEnabled
        : DEFAULT_PREFERENCES.voiceInputEnabled,
  };
}

export function createExportFilename(session: DebateSession): string {
  const date = new Date(session.startedAt).toISOString().slice(0, 10);
  const safeId = session.id.replace(/[^a-zA-Z0-9-]/g, "-");
  return `republik-argumen-session-${date}-${safeId}.json`;
}
