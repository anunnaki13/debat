import { ROUND_DEFINITIONS, ROUND_SEQUENCE } from "@/lib/debate/rules";
import { cn } from "@/lib/cn";
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
            className={cn(
              "rounded-[var(--ra-radius-md)] border px-3 py-3 transition duration-150",
              active &&
                "border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] text-[var(--ra-cyan-bright)] shadow-[var(--ra-glow-user)]",
              complete &&
                !active &&
                "border-[var(--ra-emerald)] bg-[var(--ra-emerald-soft)] text-[var(--ra-emerald)]",
              !active &&
                !complete &&
                "border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] text-[var(--ra-text-muted)]",
            )}
          >
            <p className="text-xs text-[var(--ra-text-muted)]">
              Ronde {index + 1}
            </p>
            <p className="mt-1 text-sm font-semibold leading-5">
              {ROUND_DEFINITIONS[round].label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
