import { Camera, Keyboard, Mic, Shield, Swords } from "lucide-react";
import { RoundStepper } from "@/components/debate/RoundStepper";
import { TurnTimer } from "@/components/debate/TurnTimer";
import { Badge } from "@/components/ui";
import type { DebateSession } from "@/types/debate";

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

  return (
    <section className="rounded-[var(--ra-radius-xl)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-glass)] p-4 shadow-[var(--ra-shadow-elevated)] md:p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
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
          <h1 className="mt-4 max-w-4xl font-serif text-2xl font-bold leading-tight text-[var(--ra-text-primary)] md:text-3xl">
            {session.topic.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ra-text-secondary)]">
            {session.topic.shortContext}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <TurnTimer remainingSeconds={remainingSeconds} />
          <label className="inline-flex min-h-10 items-center gap-2 rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] px-3 py-2 text-sm font-semibold text-[var(--ra-text-secondary)]">
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(event) => onAutoSpeakChange(event.target.checked)}
              className="h-4 w-4 accent-[var(--ra-cyan)]"
            />
            Suara otomatis
          </label>
        </div>
      </div>
      <div className="mt-5">
        <RoundStepper currentRound={session.currentRound} />
      </div>
    </section>
  );
}
