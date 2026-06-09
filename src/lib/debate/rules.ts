import type { DebateMessage, DebateSide, RoundId } from "@/types/debate";

export const ROUND_SEQUENCE: RoundId[] = ["OPENING", "REBUTTAL", "CLOSING"];

export const ROUND_DEFINITIONS: Record<
  RoundId,
  {
    label: string;
    purpose: string;
    userLimit: number;
  }
> = {
  OPENING: {
    label: "Opening Statement",
    purpose: "Bangun posisi utama.",
    userLimit: 1200,
  },
  REBUTTAL: {
    label: "Rebuttal",
    purpose: "Tanggapi alasan lawan.",
    userLimit: 1200,
  },
  CLOSING: {
    label: "Closing Statement",
    purpose: "Ringkas dan perkuat posisi akhir.",
    userLimit: 1000,
  },
};

export function getOpponentSide(userSide: DebateSide): DebateSide {
  return userSide === "PRO" ? "CONTRA" : "PRO";
}

export function getRoundIndex(round: RoundId): number {
  return ROUND_SEQUENCE.indexOf(round);
}

export function getNextRound(round: RoundId): RoundId | null {
  const nextIndex = getRoundIndex(round) + 1;
  return ROUND_SEQUENCE[nextIndex] ?? null;
}

export function getRoundLimit(round: RoundId): number {
  return ROUND_DEFINITIONS[round].userLimit;
}

export function isFinalRound(round: RoundId): boolean {
  return round === ROUND_SEQUENCE[ROUND_SEQUENCE.length - 1];
}

export function roundHasOpponentResponse(
  messages: DebateMessage[],
  round: RoundId,
): boolean {
  return messages.some(
    (message) => message.round === round && message.speaker === "OPPONENT",
  );
}

export function roundHasUserSubmission(
  messages: DebateMessage[],
  round: RoundId,
): boolean {
  return messages.some(
    (message) => message.round === round && message.speaker === "USER",
  );
}

export function isAwaitingOpponent(
  messages: DebateMessage[],
  round: RoundId,
): boolean {
  return (
    roundHasUserSubmission(messages, round) &&
    !roundHasOpponentResponse(messages, round)
  );
}

export function canRequestJudge(messages: DebateMessage[]): boolean {
  return ROUND_SEQUENCE.every((round) => {
    const hasUser = roundHasUserSubmission(messages, round);
    const hasOpponent = roundHasOpponentResponse(messages, round);
    return hasUser && hasOpponent;
  });
}

export function trimArgument(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}
