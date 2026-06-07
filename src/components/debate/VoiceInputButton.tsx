"use client";

import { Mic, MicOff } from "lucide-react";

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
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
        isListening
          ? "border-red-300/40 bg-red-300/10 text-red-100 hover:bg-red-300/15"
          : "border-white/10 bg-slate-900/80 text-slate-200 hover:border-cyan-300/40 hover:bg-cyan-300/10"
      }`}
    >
      {isListening ? <MicOff size={16} aria-hidden="true" /> : <Mic size={16} aria-hidden="true" />}
      {isListening ? "Stop" : "Mikrofon"}
    </button>
  );
}
