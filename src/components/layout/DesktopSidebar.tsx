"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CircleDollarSign,
  Compass,
  History,
  Home,
  Settings,
  ShieldCheck,
  Swords,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/cn";

const navItems = [
  { label: "Beranda", href: "/", icon: Home, match: "/" },
  { label: "Arena", href: "/#setup-debat", icon: Swords, match: "/debate" },
  { label: "Topik", href: "/#pilih-topik", icon: Compass, match: "/topics" },
  { label: "Tantangan Saya", href: "/history", icon: ShieldCheck, match: "/challenges" },
  { label: "Peringkat", href: "/history", icon: Trophy, match: "/ranking" },
  { label: "Kredit Arena", href: "/#setup-debat", icon: CircleDollarSign, match: "/credits" },
  { label: "Riwayat", href: "/history", icon: History, match: "/history" },
  { label: "Clan", href: "/#setup-debat", icon: Users, match: "/clan" },
  { label: "Pengaturan", href: "/#setup-debat", icon: Settings, match: "/settings" },
] as const;

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-[var(--ra-z-sticky)] hidden w-[252px] border-r border-[rgba(21,248,255,0.18)] bg-[rgba(2,8,23,0.94)] px-4 py-5 backdrop-blur-xl lg:flex lg:flex-col">
      <Link href="/" className="flex min-h-14 items-center gap-3 rounded-[var(--ra-radius-md)] px-2">
        <span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-[var(--ra-radius-md)] border border-[var(--ra-electric-cyan)] bg-[var(--ra-electric-cyan-soft)] shadow-[var(--ra-glow-esports-cyan)]">
          <Image
            src="/assets/arena/logo-mark.svg"
            alt=""
            width={34}
            height={34}
            aria-hidden="true"
          />
        </span>
        <span>
          <span className="block font-serif text-[1.42rem] font-bold leading-none text-[var(--ra-text-primary)]">
            REPUBLIK
          </span>
          <span className="block font-serif text-[1.34rem] font-bold leading-none text-[var(--ra-text-primary)]">
            ARGUMEN
          </span>
          <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--ra-text-muted)]">
            Debat - Fakta - Titik Temu
          </span>
        </span>
      </Link>

      <div className="ra-hud-panel mt-6 rounded-[var(--ra-radius-xl)] border border-[rgba(21,248,255,0.22)] bg-[rgba(7,16,28,0.74)] p-3">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/arena/user-orator-avatar.svg"
            alt=""
            width={48}
            height={48}
            className="rounded-[var(--ra-radius-pill)] border border-[var(--ra-electric-cyan)] bg-[var(--ra-bg-deep)] shadow-[var(--ra-glow-esports-cyan)]"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-[var(--ra-text-primary)]">
              Budi Hidayat
            </p>
            <p className="text-[11px] font-semibold text-[var(--ra-text-muted)]">
              Menteri Klarifikasi
            </p>
            <Badge tone="prestige" className="mt-1 gap-1">
              <Zap size={12} aria-hidden="true" />
              Orator Muda
            </Badge>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] font-bold text-[var(--ra-text-secondary)]">
            <span>Level 23</span>
            <span>3.450 XP</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-[var(--ra-radius-pill)] bg-[rgba(255,255,255,0.08)]">
            <div className="h-full w-[64%] rounded-[var(--ra-radius-pill)] bg-[linear-gradient(90deg,var(--ra-electric-cyan),var(--ra-magenta),var(--ra-gold))]" />
          </div>
        </div>
      </div>

      <nav className="mt-5 flex flex-1 flex-col gap-1.5" aria-label="Navigasi utama">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.match === "/"
              ? pathname === "/"
              : pathname.startsWith(item.match);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-[var(--ra-radius-md)] border px-3 text-sm font-semibold transition duration-150",
                active
                  ? "border-[var(--ra-electric-cyan)] bg-[var(--ra-electric-cyan-soft)] text-[var(--ra-electric-cyan)] shadow-[var(--ra-glow-esports-cyan)]"
                  : "border-transparent text-[var(--ra-text-secondary)] hover:border-[var(--ra-border-default)] hover:bg-[var(--ra-bg-panel)] hover:text-[var(--ra-text-primary)]",
              )}
            >
              <Icon size={18} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-[var(--ra-radius-xl)] border border-[rgba(216,170,92,0.28)] bg-[linear-gradient(135deg,rgba(21,248,255,0.14),rgba(255,43,214,0.10),rgba(216,170,92,0.13))] p-3 shadow-[var(--ra-shadow-card)]">
        <div className="rounded-[var(--ra-radius-lg)] border border-[var(--ra-electric-cyan)] bg-[rgba(2,8,23,0.62)] p-3">
          <p className="text-xs font-semibold text-[var(--ra-text-muted)]">
            Kredit Arena
          </p>
          <p className="mt-1 font-serif text-2xl font-bold text-[var(--ra-electric-cyan)]">
            140 KA
          </p>
        </div>
      </div>
    </aside>
  );
}
