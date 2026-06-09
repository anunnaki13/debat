import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

const particleSeeds = [
  { left: "8%", delay: "0ms", x: "-18px", size: "3px" },
  { left: "17%", delay: "520ms", x: "16px", size: "2px" },
  { left: "29%", delay: "980ms", x: "-12px", size: "3px" },
  { left: "43%", delay: "240ms", x: "20px", size: "2px" },
  { left: "58%", delay: "760ms", x: "-16px", size: "3px" },
  { left: "71%", delay: "1220ms", x: "12px", size: "2px" },
  { left: "84%", delay: "420ms", x: "-22px", size: "3px" },
  { left: "93%", delay: "1480ms", x: "14px", size: "2px" },
];

const waveHeights = [22, 46, 30, 64, 38, 78, 52, 34, 70, 44, 58, 26, 62, 36];

export function NeonFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("ra-animated-frame", className)}>{children}</div>;
}

export function ArenaParticleField({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {particleSeeds.map((particle, index) => (
        <span
          key={index}
          className="absolute bottom-8 rounded-[var(--ra-radius-pill)] bg-[var(--ra-cyan-bright)] shadow-[0_0_18px_rgba(91,231,225,0.75)]"
          style={
            {
              left: particle.left,
              width: particle.size,
              height: particle.size,
              "--ra-particle-x": particle.x,
              animation: "ra-particle-rise 4.8s ease-in-out infinite",
              animationDelay: particle.delay,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function AnimatedAvatarRing({
  children,
  tone = "user",
  active = false,
  className,
}: {
  children: ReactNode;
  tone?: "user" | "ai" | "gold";
  active?: boolean;
  className?: string;
}) {
  const toneColor =
    tone === "ai"
      ? "var(--ra-coral)"
      : tone === "gold"
        ? "var(--ra-gold)"
        : "var(--ra-cyan)";

  return (
    <div
      className={cn(
        "relative grid place-items-center rounded-[var(--ra-radius-pill)]",
        className,
      )}
      style={{ "--ring-color": toneColor } as CSSProperties}
    >
      <span
        className="absolute inset-0 rounded-[var(--ra-radius-pill)] border border-[color:var(--ring-color)] opacity-70"
        style={{
          boxShadow: "0 0 30px color-mix(in srgb, var(--ring-color), transparent 58%)",
          animation: active ? "ra-halo-pulse 1.8s ease-in-out infinite" : undefined,
        }}
      />
      <span
        className="absolute inset-2 rounded-[var(--ra-radius-pill)] border border-dashed border-[color:var(--ring-color)] opacity-60"
        style={{
          animation: active ? "ra-orbit-spin 12s linear infinite" : undefined,
        }}
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

export function AnimatedWaveform({
  tone = "user",
  active = true,
  className,
}: {
  tone?: "user" | "ai" | "gold";
  active?: boolean;
  className?: string;
}) {
  const color =
    tone === "ai"
      ? "var(--ra-coral)"
      : tone === "gold"
        ? "var(--ra-gold)"
        : "var(--ra-cyan)";

  return (
    <div
      className={cn(
        "flex h-12 items-center justify-center gap-1.5 rounded-[var(--ra-radius-pill)] border border-[var(--ra-border-subtle)] bg-[var(--ra-bg-panel)] px-3",
        className,
      )}
      aria-hidden="true"
    >
      {waveHeights.map((height, index) => (
        <span
          key={`${height}-${index}`}
          className="w-1.5 origin-center rounded-[var(--ra-radius-pill)]"
          style={{
            height: `${height}%`,
            background: color,
            boxShadow: `0 0 16px ${color}`,
            animation: active ? "ra-wave-dance 1.2s ease-in-out infinite" : undefined,
            animationDelay: `${index * 55}ms`,
          }}
        />
      ))}
    </div>
  );
}

export function EnergyDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "ra-energy-line h-px rounded-[var(--ra-radius-pill)] bg-[linear-gradient(90deg,transparent,var(--ra-cyan),var(--ra-coral),transparent)]",
        className,
      )}
    />
  );
}
