import { describe, expect, it } from "vitest";
import {
  canRequestJudge,
  getNextRound,
  getOpponentSide,
  getRoundLimit,
} from "./rules";
import type { DebateMessage } from "@/types/debate";

function message(
  speaker: DebateMessage["speaker"],
  round: DebateMessage["round"],
): DebateMessage {
  return {
    id: `${speaker}-${round}`,
    speaker,
    round,
    content: "Argumen singkat.",
    createdAt: "2026-06-07T00:00:00.000Z",
  };
}

describe("debate rules", () => {
  it("assigns the opposite debate side", () => {
    expect(getOpponentSide("PRO")).toBe("CONTRA");
    expect(getOpponentSide("CONTRA")).toBe("PRO");
  });

  it("progresses through three rounds", () => {
    expect(getNextRound("OPENING")).toBe("REBUTTAL");
    expect(getNextRound("REBUTTAL")).toBe("CLOSING");
    expect(getNextRound("CLOSING")).toBeNull();
  });

  it("uses the expected per-round character limits", () => {
    expect(getRoundLimit("OPENING")).toBe(1200);
    expect(getRoundLimit("REBUTTAL")).toBe(1200);
    expect(getRoundLimit("CLOSING")).toBe(1000);
  });

  it("only allows judge requests after all rounds have user and opponent messages", () => {
    expect(canRequestJudge([message("USER", "OPENING")])).toBe(false);
    expect(
      canRequestJudge([
        message("USER", "OPENING"),
        message("OPPONENT", "OPENING"),
        message("USER", "REBUTTAL"),
        message("OPPONENT", "REBUTTAL"),
        message("USER", "CLOSING"),
        message("OPPONENT", "CLOSING"),
      ]),
    ).toBe(true);
  });
});
