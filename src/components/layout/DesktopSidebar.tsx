"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CircleDollarSign,
  Compass,
  History,
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
import { arenaReferenceAssets, personaCrop } from "@/lib/arena-reference-assets";

const navItems = [
  { label: "Debat Cepat", href: "/", icon: Zap, match: "/" },
  { label: "Arena", href: "/#setup-debat", icon: Swords, match: "/debate" },
  { label: "Topik", href: "/#pilih-topik", icon: Compass, match: "/topics" },
  { label: "Karir Politik", href: "/#setup-debat", icon: ShieldCheck, match: "/challenges" },
  { label: "Ranking", href: "/history", icon: Trophy, match: "/ranking" },
  { label: "AI Coach", href: "/#setup-debat", icon: CircleDollarSign, match: "/credits" },
  { label: "Riwayat", href: "/history", icon: History, match: "/history" },
  { label: "Misi Harian", href: "/#setup-debat", icon: Users, match: "/clan" },
  { label: "Pengaturan", href: "/#setup-debat", icon: Settings, match: "/settings" },
] as const;

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-[var(--ra-z-sticky)] hidden w-[252px] border-r border-[rgba(72,118,206,0.24)] bg-[linear-gradient(180deg,rgba(2,6,17,0.98),rgba(4,9,25,0.96))] px-3 py-4 backdrop-blur-xl lg:flex lg:flex-col">
      <Link href="/" className="relative block overflow-hidden rounded-[var(--ra-radius-lg)] border border-[rgba(94,140,255,0.18)] bg-black/40 p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(84,136,255,0.18),transparent_52%)]" />
        <div className="relative">
          <p className="text-center text-[2.1rem] font-black uppercase leading-[0.82] tracking-tight text-[var(--ra-text-primary)] drop-shadow-[0_0_18px_rgba(70,148,255,0.34)]">
            Arena
          </p>
          <p className="mt-1 text-center text-xl font-black uppercase leading-none tracking-wide text-[#ff5f72]">
            Politika
          </p>
          <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-[#7fcaff]">
            Debat. Pikir. Pimpin.
          </p>
        </div>
      </Link>

      <div className="mt-4 rounded-[var(--ra-radius-xl)] border border-[rgba(87,125,255,0.26)] bg-[rgba(7,13,30,0.82)] p-3 shadow-[0_0_28px_rgba(60,116,255,0.12)]">
        <div className="flex items-center gap-3">
          <span
            className="h-14 w-14 shrink-0 rounded-[var(--ra-radius-pill)] border border-[#54caff] bg-cover shadow-[0_0_24px_rgba(68,190,255,0.35)]"
            style={{
              backgroundImage: `url(${arenaReferenceAssets.personaSheet.src})`,
              backgroundPosition: personaCrop.reformer.backgroundPosition,
              backgroundSize: personaCrop.reformer.backgroundSize,
            }}
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

      <nav className="mt-4 flex flex-1 flex-col gap-1.5" aria-label="Navigasi utama">
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
                "flex min-h-11 items-center gap-3 rounded-[var(--ra-radius-md)] border px-3 text-sm font-bold transition duration-150",
                active
                  ? "border-[rgba(111,76,255,0.62)] bg-[linear-gradient(135deg,rgba(93,57,255,0.36),rgba(42,113,255,0.18))] text-[var(--ra-text-primary)] shadow-[0_0_28px_rgba(93,57,255,0.24)]"
                  : "border-transparent text-[var(--ra-text-secondary)] hover:border-[rgba(90,142,255,0.26)] hover:bg-[rgba(12,24,50,0.78)] hover:text-[var(--ra-text-primary)]",
              )}
            >
              <Icon size={18} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-[var(--ra-radius-xl)] border border-[rgba(255,74,86,0.38)] bg-[rgba(23,6,16,0.82)] p-3 shadow-[0_0_28px_rgba(255,63,74,0.16)]">
          <Image
            src={arenaReferenceAssets.arenaPoliticsLive}
            alt=""
            fill
            sizes="220px"
            className="object-cover opacity-[0.38]"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,20,0.28),rgba(5,8,20,0.92))]" />
          <div className="relative">
            <p className="text-[11px] font-black uppercase tracking-wide text-[var(--ra-amber)]">
              Top Issue Hari Ini
            </p>
            <h2 className="mt-3 text-base font-black leading-tight text-[var(--ra-text-primary)]">
              Subsidi BBM Harus Dihapus?
            </h2>
            <p className="mt-3 text-[11px] font-bold text-[var(--ra-text-secondary)]">
              156.230 pemain sedang online
            </p>
          </div>
        </div>

        <div className="rounded-[var(--ra-radius-xl)] border border-[rgba(216,170,92,0.28)] bg-[linear-gradient(135deg,rgba(21,118,255,0.18),rgba(139,72,255,0.12),rgba(216,170,92,0.15))] p-3 shadow-[var(--ra-shadow-card)]">
          <div className="rounded-[var(--ra-radius-lg)] border border-[rgba(84,202,255,0.58)] bg-[rgba(2,8,23,0.62)] p-3">
            <p className="text-xs font-semibold text-[var(--ra-text-muted)]">
              Kredit Arena
            </p>
            <p className="mt-1 font-serif text-2xl font-bold text-[#45d8ff]">
              140 KA
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
