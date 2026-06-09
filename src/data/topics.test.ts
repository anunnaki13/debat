import { describe, expect, it } from "vitest";
import { debateTopics } from "./topics";
import { debateTopicSchema } from "@/lib/validation/apiSchemas";

describe("debateTopics", () => {
  it("contains a broader safe topic pool for MVP replayability", () => {
    expect(debateTopics.length).toBeGreaterThanOrEqual(20);
  });

  it("keeps topic IDs unique", () => {
    const ids = debateTopics.map((topic) => topic.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps every built-in topic compatible with the API schema", () => {
    for (const topic of debateTopics) {
      expect(() => debateTopicSchema.parse(topic)).not.toThrow();
    }
  });

  it("keeps all built-in topics in the MVP spice range", () => {
    for (const topic of debateTopics) {
      expect(topic.spiceLevel).toBeGreaterThanOrEqual(1);
      expect(topic.spiceLevel).toBeLessThanOrEqual(4);
    }
  });
});
