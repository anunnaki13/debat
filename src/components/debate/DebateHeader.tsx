import Image from "next/image";
import { Camera, Keyboard, LogOut, Mic, Shield, Swords, Volume2 } from "lucide-react";
import { RoundStepper } from "@/components/debate/RoundStepper";
import { TurnTimer } from "@/components/debate/TurnTimer";
import { Badge } from "@/components/ui";
import type { DebateSession } from "@/types/debate";

const roundOrder = ["OPENING", "REBUTTAL", "CLOSING"] as const;

export function DebateHeader({
  session,
  remainingSeconds,
  autoSpeak,
  onAutoSpeakChange,
}: {
  session: DebateSession;
  remainingSeconds: number;
  autoSpeak: boolean;
  onAutoSpeakChange: (value: boolean) => void;
}) {
  const inputIcon =
    session.inputMode === "VOICE_CAMERA" ? (
      <Camera size={14} aria-hidden="true" />
    ) : session.inputMode === "VOICE" ? (
      <Mic size={14} aria-hidden="true" />
    ) : (
      <Keyboard size={14} aria-hidden="true" />
    );
  const roundNumber = Math.max(1, roundOrder.indexOf(session.currentRound) + 1);
  const roundLabel = session.currentRound.replace("_", " ");

  return (
    <section className="relative overflow-hidden rounded-[var(--ra-radius-xl)] border border-[rgba(85,137,255,0.34)] bg-[#050914] p-4 shadow-[var(--ra-shadow-elevated)] md:p-5">
      <Image
        src="/assets/arena/arena-backdrop.svg"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) calc(100vw - 280px), 100vw"
        className="object-cover object-center opacity-[0.58]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(40,145,255,0.24),transparent_32%),radial-gradient(circle_at_80%_22%,rgba(255,67,82,0.18),transparent_30%),linear-gradient(90deg,rgba(2,6,18,0.92),rgba(2,8,23,0.52)_50%,rgba(2,6,18,0.92))]" />
      <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px_minmax(0,1fr)] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="special" className="gap-2">
              <span className="h-2 w-2 rounded-[var(--ra-radius-pill)] bg-[#ff3348] shadow-[0_0_12px_rgba(255,51,72,0.9)]" />
              Debat Langsung
            </Badge>
            <Badge tone="user" className="gap-2">
              {inputIcon}
              {session.inputMode.replace("_", " + ")}
            </Badge>
            <Badge tone="prestige" className="gap-2">
              <Shield size={14} aria-hidden="true" />
              {session.userSide}
            </Badge>
            <Badge tone="ai" className="gap-2">
              <Swords size={14} aria-hidden="true" />
              AI {session.opponentSide}
            </Badge>
          </div>
          <h1 className="mt-4 max-w-3xl text-xl font-black leading-tight text-[var(--ra-text-primary)] md:text-2xl">
            {session.topic.title}
          </h1>
          <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-[var(--ra-text-secondary)]">
            {session.topic.shortContext}
          </p>
        </div>

        <div className="rounded-b-[var(--ra-radius-xl)] border border-t-0 border-[rgba(93,151,255,0.42)] bg-[rgba(2,8,23,0.82)] px-5 pb-4 pt-2 text-center shadow-[0_0_36px_rgba(55,137,255,0.26)]">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--ra-text-secondary)]">
            Ronde {roundNumber} / {roundOrder.length}
          </p>
          <p className="mt-1 text-xs font-bold uppercase text-[#4bd7ff]">
            {roundLabel}
          </p>
          <TurnTimer remainingSeconds={remainingSeconds} />
        </div>

        <div className="flex flex-wrap items-center justify-start gap-3 lg:justify-end">
          <label className="inline-flex min-h-10 items-center gap-2 rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] px-3 py-2 text-sm font-semibold text-[var(--ra-text-secondary)]">
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(event) => onAutoSpeakChange(event.target.checked)}
              className="h-4 w-4 accent-[var(--ra-cyan)]"
            />
            <Volume2 size={15} aria-hidden="true" />
            Suara otomatis
          </label>
          <span className="inline-flex min-h-10 items-center gap-2 rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] px-3 py-2 text-sm font-semibold text-[var(--ra-text-secondary)]">
            <LogOut size={15} aria-hidden="true" />
            Keluar
          </span>
        </div>
      </div>
      <div className="relative mt-5">
        <RoundStepper currentRound={session.currentRound} />
      </div>
    </section>
  );
}
