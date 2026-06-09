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
    <section className="rounded-[var(--ra-radius-lg)] border border-[var(--ra-border-subtle)] bg-[var(--ra-bg-glass)] p-3">
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
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={limit + 200}
        disabled={disabled}
        className="mt-3 min-h-24 w-full resize-y rounded-[var(--ra-radius-lg)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] p-4 text-sm leading-7 text-[var(--ra-text-primary)] placeholder:text-[var(--ra-text-muted)] transition focus-visible:border-[var(--ra-cyan)] disabled:cursor-not-allowed disabled:opacity-70 md:min-h-20"
        placeholder="Tulis argumen Anda..."
      />
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
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <VoiceInputButton
          isSupported={isVoiceSupported}
          isListening={isListening}
          onStart={onStartVoice}
          onStop={onStopVoice}
          disabled={disabled || Boolean(isVoiceBusy && !isListening)}
        />
        <Button
          onClick={onSubmit}
          disabled={disabled || !value.trim() || overLimit}
          trailingIcon={<Send size={16} aria-hidden="true" />}
        >
          Kirim Argumen
        </Button>
      </div>
    </section>
  );
}
