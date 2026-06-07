import { ROUND_DEFINITIONS, ROUND_SEQUENCE } from "@/lib/debate/rules";
import type { RoundId } from "@/types/debate";

export function RoundStepper({
  currentRound,
}: {
  currentRound: RoundId;
}) {
  const currentIndex = ROUND_SEQUENCE.indexOf(currentRound);

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {ROUND_SEQUENCE.map((round, index) => {
        const active = round === currentRound;
        const complete = index < currentIndex;

        return (
          <div
            key={round}
            className={`rounded-md border px-3 py-3 ${
              active
                ? "border-cyan-300/70 bg-cyan-300/15 text-cyan-100"
                : complete
                  ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-100"
                  : "border-white/10 bg-slate-900/75 text-slate-300"
            }`}
          >
            <p className="text-xs text-slate-400">Ronde {index + 1}</p>
            <p className="mt-1 text-sm font-semibold">
              {ROUND_DEFINITIONS[round].label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
