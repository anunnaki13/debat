"use client";

import { Send } from "lucide-react";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { VoiceInputButton } from "@/components/debate/VoiceInputButton";
import { ROUND_DEFINITIONS } from "@/lib/debate/rules";
import type { RoundId } from "@/types/debate";

export function DebateComposer({
  round,
  value,
  onChange,
  onSubmit,
  disabled,
  isVoiceSupported,
  isListening,
  isVoiceBusy,
  voiceInterim,
  voiceError,
  voiceStatus,
  onStartVoice,
  onStopVoice,
}: {
  round: RoundId;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  isVoiceSupported: boolean;
  isListening: boolean;
  isVoiceBusy?: boolean;
  voiceInterim: string;
  voiceError: string;
  voiceStatus?: string;
  onStartVoice: () => void;
  onStopVoice: () => void;
}) {
  const limit = ROUND_DEFINITIONS[round].userLimit;
  const overLimit = value.length > limit;

  return (
    <section className="rounded-lg border border-white/10 bg-slate-950/75 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">
            {ROUND_DEFINITIONS[round].label}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {ROUND_DEFINITIONS[round].purpose}
          </p>
        </div>
        <span
          className={`rounded-md border px-3 py-1 text-xs font-semibold ${
            overLimit
              ? "border-red-300/40 bg-red-300/10 text-red-100"
              : "border-white/10 bg-slate-900 text-slate-300"
          }`}
        >
          {value.length}/{limit}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={limit + 200}
        disabled={disabled}
        className="mt-4 min-h-40 w-full resize-y rounded-md border border-white/10 bg-slate-900/85 p-4 text-sm leading-7 text-white placeholder:text-slate-500 transition focus:border-cyan-300/60 disabled:cursor-not-allowed disabled:opacity-70"
        placeholder="Tulis argumen Anda..."
      />
      {voiceInterim ? (
        <p className="mt-2 rounded-md border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100">
          {voiceInterim}
        </p>
      ) : null}
      {voiceStatus ? (
        <p className="mt-2 rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300">
          {voiceStatus}
        </p>
      ) : null}
      {voiceError ? (
        <div className="mt-3">
          <ErrorBanner message={voiceError} />
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <VoiceInputButton
          isSupported={isVoiceSupported}
          isListening={isListening}
          onStart={onStartVoice}
          onStop={onStopVoice}
          disabled={disabled || Boolean(isVoiceBusy && !isListening)}
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || !value.trim() || overLimit}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-cyan-300 px-5 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          <Send size={16} aria-hidden="true" />
          Kirim Argumen
        </button>
      </div>
    </section>
  );
}
