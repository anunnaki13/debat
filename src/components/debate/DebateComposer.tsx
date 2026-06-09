"use client";

import { Send } from "lucide-react";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { VoiceInputButton } from "@/components/debate/VoiceInputButton";
import { Button } from "@/components/ui";
import { ROUND_DEFINITIONS } from "@/lib/debate/rules";
import { cn } from "@/lib/cn";
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
    <section className="rounded-[var(--ra-radius-lg)] border border-[var(--ra-border-subtle)] bg-[rgba(10,17,29,0.70)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[var(--ra-text-primary)]">
            {ROUND_DEFINITIONS[round].label}
          </h2>
          <p className="mt-1 text-xs leading-5 text-[var(--ra-text-muted)]">
            {ROUND_DEFINITIONS[round].purpose}
          </p>
        </div>
        <span
          className={cn(
            "rounded-[var(--ra-radius-pill)] border px-3 py-1 text-xs font-semibold",
            overLimit
              ? "border-[var(--ra-coral)] bg-[var(--ra-coral-soft)] text-[var(--ra-coral-bright)]"
              : "border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] text-[var(--ra-text-secondary)]",
          )}
        >
          {value.length}/{limit}
        </span>
      </div>
      <div className="mt-3 grid gap-3 rounded-[var(--ra-radius-xl)] border border-[rgba(50,212,209,0.28)] bg-[rgba(7,11,19,0.76)] p-3 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-end">
        <VoiceInputButton
          isSupported={isVoiceSupported}
          isListening={isListening}
          onStart={onStartVoice}
          onStop={onStopVoice}
          disabled={disabled || Boolean(isVoiceBusy && !isListening)}
        />
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          maxLength={limit + 200}
          disabled={disabled}
          className="min-h-20 w-full resize-y rounded-[var(--ra-radius-lg)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] p-4 text-sm leading-7 text-[var(--ra-text-primary)] placeholder:text-[var(--ra-text-muted)] transition focus-visible:border-[var(--ra-cyan)] disabled:cursor-not-allowed disabled:opacity-70 md:min-h-16"
          placeholder="Tulis argumen Anda..."
        />
        <Button
          onClick={onSubmit}
          disabled={disabled || !value.trim() || overLimit}
          trailingIcon={<Send size={16} aria-hidden="true" />}
          className="md:min-h-12"
        >
          Kirim Argumen
        </Button>
      </div>
      {voiceInterim ? (
        <p className="mt-2 rounded-[var(--ra-radius-md)] border border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] px-3 py-2 text-sm text-[var(--ra-cyan-bright)]">
          {voiceInterim}
        </p>
      ) : null}
      {voiceStatus ? (
        <p className="mt-2 rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] px-3 py-2 text-sm text-[var(--ra-text-secondary)]">
          {voiceStatus}
        </p>
      ) : null}
      {voiceError ? (
        <div className="mt-3">
          <ErrorBanner message={voiceError} />
        </div>
      ) : null}
    </section>
  );
}
