import { debateTopics } from "@/data/topics";
import type {
  DebateInputMode,
  DebateMode,
  DebateTopic,
  SideSelection,
} from "@/types/debate";

export const DEBATE_FLOW_DRAFT_STORAGE_KEY =
  "republik-argumen.flow-draft.v1";

export interface DebateFlowDraft {
  mode: DebateMode;
  inputMode: DebateInputMode;
  sideSelection: SideSelection;
  topic: DebateTopic;
  updatedAt: string;
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function createDefaultDraft(): DebateFlowDraft {
  return {
    mode: "DUEL_WACANA_AI",
    inputMode: "TEXT",
    sideSelection: "PRO",
    topic: debateTopics[0],
    updatedAt: new Date(0).toISOString(),
  };
}

function normalizeDraft(value: Partial<DebateFlowDraft>): DebateFlowDraft {
  const fallback = createDefaultDraft();
  const topic =
    value.topic && typeof value.topic.id === "string" ? value.topic : fallback.topic;

  return {
    mode: value.mode ?? fallback.mode,
    inputMode: value.inputMode ?? fallback.inputMode,
    sideSelection: value.sideSelection ?? fallback.sideSelection,
    topic,
    updatedAt: value.updatedAt ?? fallback.updatedAt,
  };
}

export function getDebateFlowDraft(): DebateFlowDraft {
  if (!isBrowser()) {
    return createDefaultDraft();
  }

  try {
    const raw = window.localStorage.getItem(DEBATE_FLOW_DRAFT_STORAGE_KEY);

    return raw
      ? normalizeDraft(JSON.parse(raw) as Partial<DebateFlowDraft>)
      : createDefaultDraft();
  } catch {
    return createDefaultDraft();
  }
}

export function saveDebateFlowDraft(
  update: Partial<Omit<DebateFlowDraft, "updatedAt">>,
): DebateFlowDraft {
  const nextDraft = normalizeDraft({
    ...getDebateFlowDraft(),
    ...update,
    updatedAt: new Date().toISOString(),
  });

  if (isBrowser()) {
    window.localStorage.setItem(
      DEBATE_FLOW_DRAFT_STORAGE_KEY,
      JSON.stringify(nextDraft),
    );
  }

  return nextDraft;
}

export function clearDebateFlowDraft(): void {
  if (isBrowser()) {
    window.localStorage.removeItem(DEBATE_FLOW_DRAFT_STORAGE_KEY);
  }
}
