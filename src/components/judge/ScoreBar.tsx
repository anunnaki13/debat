export function ScoreBar({
  label,
  score,
  explanation,
}: {
  label: string;
  score: number;
  explanation: string;
}) {
  const normalizedScore = Math.min(100, Math.max(0, score));

  return (
    <div className="rounded-[var(--ra-radius-lg)] border border-[rgba(90,142,255,0.22)] bg-[rgba(5,12,28,0.82)] p-4 shadow-[var(--ra-shadow-card)]">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-black uppercase tracking-wide text-[var(--ra-text-primary)]">
          {label}
        </h3>
        <span className="rounded-[var(--ra-radius-md)] border border-[var(--ra-electric-cyan)] bg-[var(--ra-electric-cyan-soft)] px-2.5 py-1 text-sm font-black text-[var(--ra-electric-cyan)]">
          {normalizedScore}
        </span>
      </div>
      <div
        className="mt-3 h-3 overflow-hidden rounded-[var(--ra-radius-pill)] border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.06)]"
        role="meter"
        aria-label={`${label} score`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={normalizedScore}
      >
        <div
          className="h-full rounded-[var(--ra-radius-pill)] bg-[linear-gradient(90deg,var(--ra-electric-cyan),var(--ra-magenta),var(--ra-gold))] shadow-[0_0_18px_rgba(21,248,255,0.42)]"
          style={{ width: `${normalizedScore}%` }}
        />
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--ra-text-secondary)]">
        {explanation}
      </p>
    </div>
  );
}
