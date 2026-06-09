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
    <section className="relative overflow-hidden rounded-[var(--ra-radius-xl)] border border-[rgba(216,170,92,0.22)] bg-[rgba(7,11,19,0.88)] p-4 shadow-[var(--ra-shadow-elevated)] md:p-5">
      <Image
        src="/assets/arena/arena-backdrop.svg"
        alt=""
        fill
        priority
        className="object-cover opacity-20"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(50,212,209,0.10),transparent_32%,rgba(238,106,100,0.10))]" />
      <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px_minmax(0,1fr)] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
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
          <h1 className="mt-4 max-w-3xl text-xl font-extrabold leading-tight text-[var(--ra-text-primary)] md:text-2xl">
            {session.topic.title}
          </h1>
          <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-[var(--ra-text-secondary)]">
            {session.topic.shortContext}
          </p>
        </div>

        <div className="rounded-b-[var(--ra-radius-xl)] border border-t-0 border-[rgba(50,212,209,0.22)] bg-[rgba(7,11,19,0.70)] px-5 pb-4 pt-2 text-center shadow-[0_18px_42px_rgba(0,0,0,0.24)]">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--ra-text-secondary)]">
            Ronde {roundNumber} / {roundOrder.length}
          </p>
          <p className="mt-1 text-xs font-bold uppercase text-[var(--ra-cyan-bright)]">
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
