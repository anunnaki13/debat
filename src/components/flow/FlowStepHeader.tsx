import Link from "next/link";
import { ArrowLeft, RadioTower, Swords } from "lucide-react";
import { Badge } from "@/components/ui";

const steps = [
  { label: "Mode", href: "/play" },
  { label: "Topik", href: "/topics" },
  { label: "Arena", href: "/device-check" },
] as const;

export function FlowStepHeader({
  eyebrow,
  title,
  description,
  activeStep,
  backHref = "/",
}: {
  eyebrow: string;
  title: string;
  description: string;
  activeStep: "Mode" | "Topik" | "Arena";
  backHref?: string;
}) {
  return (
    <header className="ra-hud-panel ra-esports-grid relative overflow-hidden rounded-[var(--ra-radius-xl)] border border-[rgba(21,248,255,0.30)] bg-[rgba(3,8,20,0.84)] p-5 shadow-[var(--ra-shadow-elevated)] md:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(21,248,255,0.16),transparent_34%),radial-gradient(circle_at_86%_0%,rgba(255,43,214,0.12),transparent_30%)]" />

      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="user" className="uppercase tracking-[0.18em]">
            {eyebrow}
          </Badge>
          <span className="inline-flex min-h-7 items-center gap-1.5 rounded-[var(--ra-radius-pill)] border border-[rgba(255,43,214,0.36)] bg-[rgba(255,43,214,0.10)] px-2.5 text-xs font-black uppercase tracking-[0.16em] text-[var(--ra-magenta-bright)]">
            <RadioTower size={12} aria-hidden="true" />
            Match Briefing
          </span>
        </div>
        <Link
          href={backHref}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--ra-radius-md)] border border-[rgba(255,255,255,0.14)] bg-[rgba(7,11,19,0.62)] px-3 text-sm font-semibold text-[var(--ra-text-secondary)] transition hover:border-[var(--ra-cyan)] hover:bg-[var(--ra-cyan-soft)] hover:text-[var(--ra-text-primary)]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Kembali
        </Link>
      </div>

      <div className="relative mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
        <div>
          <h1 className="text-3xl font-black uppercase leading-tight text-[var(--ra-text-primary)] drop-shadow-[0_0_26px_rgba(21,248,255,0.18)] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ra-text-secondary)] sm:text-base sm:leading-7">
            {description}
          </p>
        </div>

        <div className="rounded-[var(--ra-radius-lg)] border border-[rgba(21,248,255,0.22)] bg-[rgba(7,11,19,0.66)] p-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--ra-cyan-bright)]">
            <Swords size={14} aria-hidden="true" />
            Arena Route
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {steps.map((step, index) => (
              <Link
                key={step.label}
                href={step.href}
                className={`relative min-h-12 rounded-[var(--ra-radius-md)] border px-2 py-2 text-center text-[11px] font-black uppercase tracking-[0.08em] ${
                  step.label === activeStep
                    ? "border-[var(--ra-electric-cyan)] bg-[rgba(21,248,255,0.16)] text-[var(--ra-cyan-bright)] shadow-[var(--ra-glow-esports-cyan)]"
                    : "border-[rgba(255,255,255,0.10)] bg-[rgba(19,32,51,0.58)] text-[var(--ra-text-muted)]"
                }`}
              >
                <span className="block text-[10px] opacity-70">0{index + 1}</span>
                {step.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
