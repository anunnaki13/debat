import { describe, expect, it } from "vitest";
import { boundTranscript, MAX_MESSAGE_CHARS } from "./apiSchemas";

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
});
