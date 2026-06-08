import type { AnalyticsEvent } from "@/types/debate";

export const ANALYTICS_STORAGE_KEY = "republik-argumen.analytics.v1";
const MAX_ANALYTICS_EVENTS = 100;

function isBrowser(): boolean {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function trackLocalEvent(
  name: AnalyticsEvent["name"],
  metadata: AnalyticsEvent["metadata"] = {},
  sessionId?: string,
): void {
  if (!isBrowser()) {
    return;
  }

  try {
    const raw = window.localStorage.getItem(ANALYTICS_STORAGE_KEY);
    const events = raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
    const nextEvents = [
      {
        name,
        metadata,
        sessionId,
        createdAt: new Date().toISOString(),
      },
      ...events,
    ].slice(0, MAX_ANALYTICS_EVENTS);

    window.localStorage.setItem(
      ANALYTICS_STORAGE_KEY,
      JSON.stringify(nextEvents),
    );
  } catch {
    // Analytics must never block the debate flow.
  }
}
