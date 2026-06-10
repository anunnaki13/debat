import { describe, expect, it } from "vitest";
import {
  boundTranscript,
  MAX_MESSAGE_CHARS,
  opponentRequestSchema,
} from "./apiSchemas";

describe("api schemas", () => {
  it("bounds transcript messages and trims content", () => {
    const messages = Array.from({ length: 14 }, (_, index) => ({
      content: `${"a".repeat(MAX_MESSAGE_CHARS + 10)} ${index}`,
      index,
    }));
    const bounded = boundTranscript(messages);

    expect(bounded).toHaveLength(12);
    expect(bounded[0].index).toBe(2);
    expect(bounded[0].content).toHaveLength(MAX_MESSAGE_CHARS);
  });

  it("rejects browser-supplied AI config in debate requests", () => {
    const parsed = opponentRequestSchema.safeParse({
      topic: {
        id: "topic",
        title: "Topik aman",
        category: "Teknologi",
        difficulty: "pemula",
        shortContext: "Konteks",
      },
      userSide: "PRO",
      opponentSide: "CONTRA",
      currentRound: "OPENING",
      messages: [
        {
          id: "message_1",
          speaker: "USER",
          round: "OPENING",
          content: "Argumen pembuka.",
          createdAt: "2026-06-10T00:00:00.000Z",
        },
      ],
      aiConfig: {
        apiKey: "browser-secret",
      },
    });

    expect(parsed.success).toBe(false);
  });
});
