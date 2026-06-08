import { CheckCircle2 } from "lucide-react";
import { Button, Card, CardDescription, CardTitle } from "@/components/ui";

export function RefinerComparisonCard({
  original,
  refined,
  reasons,
  onUseRefined,
  onEditAgain,
}: {
  original: string;
  refined: string;
  reasons: string[];
  onUseRefined: () => void;
  onEditAgain: () => void;
}) {
  return (
    <Card variant="outline" className="border-[var(--ra-violet)] bg-[var(--ra-violet-soft)]">
      <CardTitle>Rapikan Pendapat</CardTitle>
      <CardDescription className="mt-2">
        Preview refiner lokal untuk menjaga topik spesifik, aman, dan layak
        diperdebatkan.
      </CardDescription>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <ComparisonBlock title="Versi Anda" text={original} />
        <ComparisonBlock title="Versi yang Disarankan" text={refined} strong />
      </div>

      <div className="mt-5 rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] p-4">
        <p className="text-sm font-bold text-[var(--ra-text-primary)]">
          Kenapa dirapikan?
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--ra-text-secondary)]">
          {reasons.map((reason) => (
            <li key={reason} className="flex gap-2">
              <CheckCircle2
                size={16}
                aria-hidden="true"
                className="mt-1 shrink-0 text-[var(--ra-emerald)]"
              />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={onUseRefined}>
          Gunakan Versi AI
        </Button>
        <Button variant="ghost" onClick={onEditAgain}>
          Edit Lagi
        </Button>
      </div>
    </Card>
  );
}

function ComparisonBlock({
  title,
  text,
  strong = false,
}: {
  title: string;
  text: string;
  strong?: boolean;
}) {
  return (
    <div className="rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ra-text-muted)]">
        {title}
      </p>
      <p
        className={`mt-2 text-sm leading-6 ${
          strong ? "font-semibold text-[var(--ra-text-primary)]" : "text-[var(--ra-text-secondary)]"
        }`}
      >
        {text}
      </p>
    </div>
  );
}
