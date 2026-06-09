import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/cn";

type Accent = "cyan" | "amber" | "violet" | "emerald";

const accentClasses: Record<Accent, { border: string; icon: string; badge: "user" | "warning" | "special" | "positive" }> = {
  cyan: {
    border: "border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] shadow-[var(--ra-glow-user)]",
    icon: "border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] text-[var(--ra-cyan-bright)]",
    badge: "user",
  },
  amber: {
    border: "border-[var(--ra-amber)] bg-[var(--ra-amber-soft)]",
    icon: "border-[var(--ra-amber)] bg-[var(--ra-amber-soft)] text-[var(--ra-amber)]",
    badge: "warning",
  },
  violet: {
    border: "border-[var(--ra-violet)] bg-[var(--ra-violet-soft)]",
    icon: "border-[var(--ra-violet)] bg-[var(--ra-violet-soft)] text-[var(--ra-violet)]",
    badge: "special",
  },
  emerald: {
    border: "border-[var(--ra-emerald)] bg-[var(--ra-emerald-soft)]",
    icon: "border-[var(--ra-emerald)] bg-[var(--ra-emerald-soft)] text-[var(--ra-emerald)]",
    badge: "positive",
  },
};

export interface ModeCardProps<TValue extends string> {
  value: TValue;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accent: Accent;
  estimatedDuration?: string;
  difficulty?: string;
  badge?: string;
  artSrc?: string;
  artAlt?: string;
  selected?: boolean;
  disabled?: boolean;
  comingSoon?: boolean;
  onSelect: (value: TValue) => void;
}

export function ModeCard<TValue extends string>({
  value,
  title,
  subtitle,
  icon: Icon,
  accent,
  estimatedDuration,
  difficulty,
  badge,
  artSrc,
  artAlt = "",
  selected = false,
  disabled = false,
  comingSoon = false,
  onSelect,
}: ModeCardProps<TValue>) {
  const tone = accentClasses[accent];

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      onClick={() => onSelect(value)}
      className={cn(
        "group relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-[var(--ra-radius-lg)] border p-4 text-left transition duration-150 disabled:cursor-not-allowed disabled:opacity-55",
        selected
          ? tone.border
          : "border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] hover:border-[var(--ra-border-strong)] hover:bg-[var(--ra-bg-panel-strong)]",
      )}
    >
      {artSrc ? (
        <Image
          src={artSrc}
          alt={artAlt}
          fill
          sizes="(min-width: 640px) 33vw, 260px"
          className="object-cover opacity-[0.78] transition duration-300 group-hover:scale-[1.03]"
          aria-hidden={artAlt ? undefined : true}
        />
      ) : null}
      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,19,0.12),rgba(7,11,19,0.78)_62%,rgba(7,11,19,0.95))]" />
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "relative z-[1] grid h-12 w-12 place-items-center rounded-[var(--ra-radius-md)] border backdrop-blur-md",
            tone.icon,
          )}
        >
          <Icon size={22} aria-hidden="true" />
        </span>
        <div className="relative z-[1] flex flex-col items-end gap-2">
          {selected ? (
            <CheckCircle2 size={18} aria-hidden="true" className="text-[var(--ra-cyan-bright)]" />
          ) : null}
          {badge || comingSoon ? (
            <Badge tone={comingSoon ? "neutral" : tone.badge}>
              {comingSoon ? "Coming soon" : badge}
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="relative z-[1] mt-auto pt-16">
        <h3 className="font-serif text-xl font-bold leading-tight text-[var(--ra-text-primary)]">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-[var(--ra-text-secondary)]">
          {subtitle}
        </p>
      </div>

      <div className="relative z-[1] mt-5 flex flex-wrap gap-2 text-xs font-semibold text-[var(--ra-text-muted)]">
        {estimatedDuration ? (
          <span className="inline-flex items-center gap-1 rounded-[var(--ra-radius-pill)] border border-[var(--ra-border-subtle)] px-2 py-1">
            <Clock size={13} aria-hidden="true" />
            {estimatedDuration}
          </span>
        ) : null}
        {difficulty ? (
          <span className="rounded-[var(--ra-radius-pill)] border border-[var(--ra-border-subtle)] px-2 py-1">
            {difficulty}
          </span>
        ) : null}
      </div>
    </button>
  );
}
