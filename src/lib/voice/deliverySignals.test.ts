import { describe, expect, it } from "vitest";
import {
  buildDeliveryReport,
  calculateDeliverySignals,
  countFillerWords,
} from "./deliverySignals";

describe("delivery signals", () => {
  it("counts Indonesian filler words", () => {
    expect(countFillerWords("Eee maksudnya argumen saya anu lebih kuat.")).toBe(3);
  });

  it("calculates explainable delivery metrics", () => {
    const signals = calculateDeliverySignals({
      transcript: "Saya punya tiga alasan utama untuk mendukung posisi ini",
      durationMs: 30_000,
      silenceMs: 4_500,
      responseLatencyMs: 800,
      rmsSamples: [0.4, 0.5, 0.45],
      interruptionCount: 1,
    });

    expect(signals.wordsPerMinute).toBe(18);
    expect(signals.pauseRatio).toBe(0.15);
    expect(signals.volumeStability).toBeGreaterThan(0.9);
    expect(signals.interruptionCount).toBe(1);
  });

  it("builds a report without emotion claims", () => {
    const report = buildDeliveryReport(
      calculateDeliverySignals({
        transcript: "eee saya setuju",
        durationMs: 1_000,
      }),
    );

    expect(report.disclaimer).toContain("bukan diagnosis emosi");
    expect(report.suggestions.length).toBeGreaterThan(0);
  });
});
