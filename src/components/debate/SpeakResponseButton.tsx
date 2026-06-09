"use client";

import { Square, Volume2 } from "lucide-react";
import { speakText, stopSpeaking } from "@/lib/speech/speakText";

export function SpeakResponseButton({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => speakText(text)}
        className="rounded-md p-2 text-slate-300 transition hover:bg-white/10 hover:text-cyan-100"
        aria-label="Bacakan jawaban AI"
        title="Bacakan jawaban AI"
      >
        <Volume2 size={16} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={stopSpeaking}
        className="rounded-md p-2 text-slate-300 transition hover:bg-white/10 hover:text-amber-100"
        aria-label="Stop suara"
        title="Stop suara"
      >
        <Square size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
