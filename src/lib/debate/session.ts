import { getOpponentSide } from "@/lib/debate/rules";
import { createId } from "@/lib/utils/ids";
import type {
  DebateSession,
  DebateSide,
  DebateTopic,
  SideSelection,
} from "@/types/debate";

export function resolveSide(selection: SideSelection): DebateSide {
  if (selection !== "RANDOM") {
    return selection;
  }

  return Math.random() >= 0.5 ? "PRO" : "CONTRA";
}

export function createDebateSession(
  topic: DebateTopic,
  selection: SideSelection,
): DebateSession {
  const userSide = resolveSide(selection);

  return {
    id: createId("debate"),
    version: 1,
    topic,
    userSide,
    opponentSide: getOpponentSide(userSide),
    startedAt: new Date().toISOString(),
    status: "IN_PROGRESS",
    currentRound: "OPENING",
    messages: [],
  };
}
