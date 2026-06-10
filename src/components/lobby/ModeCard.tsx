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
      "border-[var(--ra-electric-cyan)] bg-[var(--ra-electric-cyan-soft)] shadow-[var(--ra-glow-esports-cyan)]",
    icon: "border-[var(--ra-electric-cyan)] bg-[var(--ra-electric-cyan-soft)] text-[var(--ra-electric-cyan)]",
    badge: "user",
    price: "text-[var(--ra-electric-cyan)]",
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
  artPosition?: string;
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
  artPosition = "center",
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
        "group ra-hud-panel relative flex h-full min-h-[174px] flex-col overflow-hidden rounded-[var(--ra-radius-md)] border p-3 text-left transition duration-150 disabled:cursor-not-allowed disabled:opacity-70",
        selected
          ? tone.border
          : "border-[rgba(255,255,255,0.12)] bg-[rgba(7,16,28,0.82)] hover:border-[var(--ra-electric-cyan)] hover:bg-[rgba(7,16,28,0.95)] hover:shadow-[var(--ra-glow-esports-cyan)]",
      )}
    >
      {artSrc ? (
        <Image
          src={artSrc}
          alt={artAlt}
          fill
          sizes="190px"
          className="object-cover opacity-[0.94] transition duration-300 group-hover:scale-[1.04]"
          style={{ objectPosition: artPosition }}
          aria-hidden={artAlt ? undefined : true}
        />
      ) : null}
      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,23,0.02),rgba(2,8,23,0.32)_45%,rgba(2,8,23,0.98))]" />
      <span className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,var(--ra-electric-cyan),var(--ra-magenta),transparent)] opacity-70" />
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
        <h3 className="text-[15px] font-black uppercase leading-tight tracking-wide text-[var(--ra-text-primary)]">
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
