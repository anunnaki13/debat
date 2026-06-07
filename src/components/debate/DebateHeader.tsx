import { Shield, Swords } from "lucide-react";
import { RoundStepper } from "@/components/debate/RoundStepper";
import { TurnTimer } from "@/components/debate/TurnTimer";
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
  return (
    <section className="rounded-lg border border-white/10 bg-slate-950/75 p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-md border border-amber-200/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-100">
              <Shield size={14} aria-hidden="true" />
              {session.userSide}
            </span>
            <span className="inline-flex items-center gap-2 rounded-md border border-red-200/25 bg-red-300/10 px-3 py-1 text-xs font-semibold text-red-100">
              <Swords size={14} aria-hidden="true" />
              AI {session.opponentSide}
            </span>
          </div>
          <h1 className="mt-4 max-w-4xl text-2xl font-bold leading-9 text-white">
            {session.topic.title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            {session.topic.shortContext}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <TurnTimer remainingSeconds={remainingSeconds} />
          <label className="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/10 bg-slate-900/75 px-3 py-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(event) => onAutoSpeakChange(event.target.checked)}
              className="h-4 w-4 accent-cyan-300"
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
