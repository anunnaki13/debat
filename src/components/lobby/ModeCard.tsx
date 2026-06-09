import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/cn";

type Accent = "cyan" | "amber" | "violet" | "emerald";

const accentClasses: Record<
  Accent,
  {
    border: string;
    icon: string;
    badge: "user" | "warning" | "special" | "positive";
    price: string;
  }
> = {
  cyan: {
    border:
      "border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] shadow-[var(--ra-glow-user)]",
    icon: "border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] text-[var(--ra-cyan-bright)]",
    badge: "user",
    price: "text-[var(--ra-cyan-bright)]",
  },
  amber: {
    border: "border-[var(--ra-amber)] bg-[var(--ra-amber-soft)]",
    icon: "border-[var(--ra-amber)] bg-[var(--ra-amber-soft)] text-[var(--ra-amber)]",
    badge: "warning",
    price: "text-[var(--ra-amber)]",
  },
  violet: {
    border: "border-[var(--ra-violet)] bg-[var(--ra-violet-soft)]",
    icon: "border-[var(--ra-violet)] bg-[var(--ra-violet-soft)] text-[var(--ra-violet)]",
    badge: "special",
    price: "text-[var(--ra-violet)]",
  },
  emerald: {
    border: "border-[var(--ra-emerald)] bg-[var(--ra-emerald-soft)]",
    icon: "border-[var(--ra-emerald)] bg-[var(--ra-emerald-soft)] text-[var(--ra-emerald)]",
    badge: "positive",
    price: "text-[var(--ra-emerald)]",
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
        "group relative flex h-full min-h-[164px] flex-col overflow-hidden rounded-[var(--ra-radius-md)] border p-3 text-left transition duration-150 disabled:cursor-not-allowed disabled:opacity-70",
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
          sizes="190px"
          className="object-cover opacity-[0.94] transition duration-300 group-hover:scale-[1.04]"
          aria-hidden={artAlt ? undefined : true}
        />
      ) : null}
      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,19,0.02),rgba(7,11,19,0.36)_48%,rgba(7,11,19,0.95))]" />
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "relative z-[1] grid h-9 w-9 place-items-center rounded-[var(--ra-radius-sm)] border backdrop-blur-md",
            tone.icon,
          )}
        >
          <Icon size={18} aria-hidden="true" />
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

      <div className="relative z-[1] mt-auto pt-12">
        <h3 className="text-[15px] font-extrabold leading-tight text-[var(--ra-text-primary)]">
          {title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--ra-text-secondary)]">
          {subtitle}
        </p>
      </div>

      <div className="relative z-[1] mt-3 flex items-center justify-between gap-2 text-[11px] font-bold">
        {estimatedDuration ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-[var(--ra-radius-pill)] bg-[rgba(7,11,19,0.72)] px-2 py-1",
              tone.price,
            )}
          >
            <Clock size={13} aria-hidden="true" />
            {estimatedDuration}
          </span>
        ) : null}
        {difficulty ? (
          <span className="rounded-[var(--ra-radius-pill)] bg-[rgba(7,11,19,0.62)] px-2 py-1 text-[var(--ra-text-secondary)]">
            {difficulty}
          </span>
        ) : null}
      </div>
    </button>
  );
}
