"use client";

import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/cn";

export function VoiceInputButton({
  isSupported,
  isListening,
  onStart,
  onStop,
  disabled,
}: {
  isSupported: boolean;
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}) {
  if (!isSupported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={isListening ? onStop : onStart}
      disabled={disabled}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--ra-radius-pill)] border px-5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        isListening
          ? "border-[var(--ra-coral)] bg-[var(--ra-coral-soft)] text-[var(--ra-coral-bright)] shadow-[var(--ra-glow-ai)] hover:bg-[var(--ra-coral-soft)]"
          : "border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] text-[var(--ra-cyan-bright)] shadow-[var(--ra-glow-user)] hover:bg-[var(--ra-blue-soft)]",
      )}
    >
      {isListening ? <MicOff size={17} aria-hidden="true" /> : <Mic size={17} aria-hidden="true" />}
      {isListening ? "Stop" : "Mikrofon"}
    </button>
  );
}
