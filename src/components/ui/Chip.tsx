import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ChipTone = "neutral" | "cyan" | "gold" | "coral" | "emerald" | "violet" | "amber";

const toneClasses: Record<ChipTone, string> = {
  neutral:
    "border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] text-[var(--ra-text-secondary)] hover:bg-[var(--ra-bg-panel-strong)]",
  cyan:
    "border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] text-[var(--ra-cyan-bright)] hover:bg-[var(--ra-blue-soft)]",
  gold:
    "border-[var(--ra-gold)] bg-[var(--ra-gold-soft)] text-[var(--ra-gold-bright)] hover:brightness-110",
  coral:
    "border-[var(--ra-coral)] bg-[var(--ra-coral-soft)] text-[var(--ra-coral-bright)] hover:brightness-110",
  emerald:
    "border-[var(--ra-emerald)] bg-[var(--ra-emerald-soft)] text-[var(--ra-emerald)] hover:brightness-110",
  violet:
    "border-[var(--ra-violet)] bg-[var(--ra-violet-soft)] text-[var(--ra-violet)] hover:brightness-110",
  amber:
    "border-[var(--ra-amber)] bg-[var(--ra-amber-soft)] text-[var(--ra-amber)] hover:brightness-110",
};

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: ChipTone;
  selected?: boolean;
}

export function Chip({
  tone = "neutral",
  selected = false,
  className,
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "inline-flex min-h-9 items-center rounded-[var(--ra-radius-pill)] border px-3 text-sm font-semibold transition duration-150 disabled:border-[var(--ra-border-subtle)] disabled:bg-[var(--ra-bg-panel)] disabled:text-[var(--ra-text-disabled)]",
        toneClasses[tone],
        selected && "shadow-[var(--ra-theme-glow,var(--ra-glow-user))]",
        className,
      )}
      {...props}
    />
  );
}
