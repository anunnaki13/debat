"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  Crown,
  History,
  Home,
  Settings,
  Swords,
  Zap,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const navItems = [
  { label: "Beranda", href: "/", icon: Home, matches: ["/"] },
  { label: "Main", href: "/play", icon: Swords, matches: ["/play", "/device-check", "/arena"] },
  { label: "Topik", href: "/topics", icon: Compass, matches: ["/topics"] },
  { label: "Riwayat", href: "/history", icon: History, matches: ["/history", "/results"] },
  { label: "Pengaturan", href: "/settings", icon: Settings, matches: ["/settings"] },
] as const;

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-[var(--ra-z-sticky)] hidden w-[252px] border-r border-[rgba(21,248,255,0.24)] bg-[image:var(--ra-bg-sidebar)] px-3 py-4 shadow-[18px_0_70px_rgba(0,0,0,0.34)] backdrop-blur-xl lg:flex lg:flex-col">
      <Link
        href="/"
        className="ra-hud-panel relative flex min-h-[118px] items-center gap-3 overflow-hidden rounded-[var(--ra-radius-lg)] border border-[rgba(21,248,255,0.30)] bg-[rgba(0,0,0,0.46)] p-3"
      >
        <div className="absolute inset-0 rounded-[var(--ra-radius-lg)] bg-[image:var(--ra-bg-brand-aura)]" />
        <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-[var(--ra-radius-lg)] border border-[var(--ra-electric-cyan)] bg-[rgba(21,248,255,0.10)] shadow-[var(--ra-glow-esports-cyan)]">
          <Image
            src="/assets/arena/logo-mark.svg"
            alt=""
            width={42}
            height={42}
            aria-hidden="true"
          />
        </div>
        <div className="relative">
          <p className="text-[1.34rem] font-black uppercase leading-none tracking-tight text-[var(--ra-text-primary)] drop-shadow-[var(--ra-shadow-brand)]">
            Republik
          </p>
          <p className="mt-1 text-[1.24rem] font-black uppercase leading-none tracking-wide text-[var(--ra-brand-mark)]">
            Argumen
          </p>
          <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--ra-brand-mark-muted)]">
            Debate Arena AI
          </p>
        </div>
      </Link>

      <div className="mt-4 overflow-hidden rounded-[var(--ra-radius-xl)] border border-[rgba(21,248,255,0.26)] bg-[rgba(7,13,30,0.88)] p-3 shadow-[var(--ra-shadow-nav-card)]">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/arena/personas/field-commander.png"
            alt=""
            width={58}
            height={58}
            className="h-[58px] w-[58px] rounded-[var(--ra-radius-pill)] object-cover"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-[var(--ra-text-primary)]">
              Budi Hidayat
            </p>
            <p className="mt-1 text-xs font-bold text-[var(--ra-cyan-bright)]">
              Orator Muda
            </p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-[var(--ra-radius-pill)] border border-[rgba(216,170,92,0.42)] bg-[rgba(216,170,92,0.10)] px-2 py-0.5 text-[10px] font-black uppercase text-[var(--ra-gold-bright)]">
              <Crown size={11} aria-hidden="true" />
              Local Rank
            </span>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.14em] text-[var(--ra-text-muted)]">
            <span>Progress</span>
            <span>Level 01</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-[var(--ra-radius-pill)] bg-[rgba(255,255,255,0.08)]">
            <div className="h-full w-[42%] rounded-[var(--ra-radius-pill)] bg-[linear-gradient(90deg,var(--ra-electric-cyan),var(--ra-magenta),var(--ra-gold))] shadow-[0_0_18px_rgba(21,248,255,0.58)]" />
          </div>
        </div>
      </div>

      <nav className="mt-4 flex flex-1 flex-col gap-1.5" aria-label="Navigasi utama">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.matches.some((match) =>
            match === "/" ? pathname === "/" : pathname.startsWith(match),
          );

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-[var(--ra-radius-md)] border px-3 text-sm font-bold transition duration-150",
                active
                  ? "border-[var(--ra-electric-cyan)] bg-[rgba(21,248,255,0.16)] text-[var(--ra-text-primary)] shadow-[var(--ra-glow-esports-cyan)]"
                  : "border-transparent text-[var(--ra-text-secondary)] hover:border-[rgba(21,248,255,0.24)] hover:bg-[rgba(12,24,50,0.78)] hover:text-[var(--ra-text-primary)]",
              )}
            >
              <Icon size={18} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="ra-hud-panel rounded-[var(--ra-radius-xl)] border border-[rgba(255,43,214,0.24)] bg-[rgba(7,13,30,0.82)] p-3">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[var(--ra-magenta-bright)]">
          <Zap size={13} aria-hidden="true" />
          Arena Core
        </p>
        <p className="mt-2 text-sm font-bold text-[var(--ra-text-primary)]">
          Personal MVP Mode
        </p>
        <p className="mt-1 text-xs leading-5 text-[var(--ra-text-muted)]">
          Fokus: lawan AI, wasit AI, voice arena, dan riwayat lokal.
        </p>
      </div>
    </aside>
  );
}
