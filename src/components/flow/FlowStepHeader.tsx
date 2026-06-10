import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
    <header className="rounded-[var(--ra-radius-xl)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-glass)] p-5 shadow-[var(--ra-shadow-elevated)] md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="user">{eyebrow}</Badge>
          {steps.map((step) => (
            <Link
              key={step.label}
              href={step.href}
              className={`inline-flex min-h-7 items-center rounded-[var(--ra-radius-pill)] border px-2.5 text-xs font-semibold ${
                step.label === activeStep
                  ? "border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] text-[var(--ra-cyan-bright)]"
                  : "border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] text-[var(--ra-text-secondary)]"
              }`}
            >
              {step.label}
            </Link>
          ))}
        </div>
        <Link
          href={backHref}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] px-3 text-sm font-semibold text-[var(--ra-text-secondary)] transition hover:bg-[var(--ra-bg-panel)] hover:text-[var(--ra-text-primary)]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Kembali
        </Link>
      </div>
      <h1 className="mt-5 font-serif text-3xl font-black leading-tight text-[var(--ra-text-primary)] sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ra-text-secondary)] sm:text-base sm:leading-7">
        {description}
      </p>
    </header>
  );
}
