// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";
import { speakText, stopSpeaking } from "./speakText";

class MockSpeechSynthesisUtterance {
  lang = "";
  rate = 1;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(public text: string) {}
}

describe("speakText", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("queues Indonesian speech and wires lifecycle callbacks", () => {
    const onStart = vi.fn();
    const onEnd = vi.fn();
    const cancel = vi.fn();
    const speak = vi.fn((utterance: MockSpeechSynthesisUtterance) => {
      utterance.onstart?.();
      utterance.onend?.();
    });

    vi.stubGlobal("SpeechSynthesisUtterance", MockSpeechSynthesisUtterance);
    vi.stubGlobal("speechSynthesis", { cancel, speak });

    expect(speakText("AI sedang membalas.", { onStart, onEnd })).toBe(true);

    expect(cancel).toHaveBeenCalledTimes(1);
    expect(speak).toHaveBeenCalledTimes(1);
    expect(speak.mock.calls[0][0]).toMatchObject({
      lang: "id-ID",
      rate: 1,
      text: "AI sedang membalas.",
    });
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it("reports an error when browser speech synthesis is unavailable", () => {
    const onError = vi.fn();

    expect(speakText("Tidak tersedia.", { onError })).toBe(false);

    expect(onError).toHaveBeenCalledTimes(1);
  });
});

describe("stopSpeaking", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("cancels queued browser speech", () => {
    const cancel = vi.fn();

    vi.stubGlobal("speechSynthesis", { cancel });
    stopSpeaking();

    expect(cancel).toHaveBeenCalledTimes(1);
  });
});
