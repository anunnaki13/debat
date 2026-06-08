import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type BadgeTone = "neutral" | "user" | "ai" | "prestige" | "positive" | "warning" | "special";

const toneClasses: Record<BadgeTone, string> = {
  neutral:
    "border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] text-[var(--ra-text-secondary)]",
  user:
    "border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] text-[var(--ra-cyan-bright)]",
  ai:
    "border-[var(--ra-coral)] bg-[var(--ra-coral-soft)] text-[var(--ra-coral-bright)]",
  prestige:
    "border-[var(--ra-gold)] bg-[var(--ra-gold-soft)] text-[var(--ra-gold-bright)]",
  positive:
    "border-[var(--ra-emerald)] bg-[var(--ra-emerald-soft)] text-[var(--ra-emerald)]",
  warning:
    "border-[var(--ra-amber)] bg-[var(--ra-amber-soft)] text-[var(--ra-amber)]",
  special:
    "border-[var(--ra-violet)] bg-[var(--ra-violet-soft)] text-[var(--ra-violet)]",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({
  tone = "neutral",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-[var(--ra-radius-pill)] border px-2.5 text-xs font-semibold",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
