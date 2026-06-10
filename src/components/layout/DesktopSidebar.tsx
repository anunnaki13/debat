"use client";

import Link from "next/link";
import {
  Compass,
  History,
  Home,
  Settings,
  Swords,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui";
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
    <aside className="fixed inset-y-0 left-0 z-[var(--ra-z-sticky)] hidden w-[252px] border-r border-[rgba(72,118,206,0.24)] bg-[linear-gradient(180deg,rgba(2,6,17,0.98),rgba(4,9,25,0.96))] px-3 py-4 backdrop-blur-xl lg:flex lg:flex-col">
      <Link href="/" className="relative flex min-h-[118px] flex-col justify-center rounded-[var(--ra-radius-lg)] border border-[rgba(94,140,255,0.18)] bg-black/40 p-3">
        <div className="absolute inset-0 rounded-[var(--ra-radius-lg)] bg-[radial-gradient(circle_at_50%_0%,rgba(84,136,255,0.18),transparent_52%)]" />
        <div className="relative">
          <p className="text-center text-[1.55rem] font-black uppercase leading-none tracking-tight text-[var(--ra-text-primary)] drop-shadow-[0_0_18px_rgba(70,148,255,0.34)]">
            Republik
          </p>
          <p className="mt-1 text-center text-[1.45rem] font-black uppercase leading-none tracking-wide text-[#55dfff]">
            Argumen
          </p>
          <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-[#7fcaff]">
            Panas pada gagasan.
          </p>
        </div>
      </Link>

      <div className="mt-4 rounded-[var(--ra-radius-xl)] border border-[rgba(87,125,255,0.26)] bg-[rgba(7,13,30,0.82)] p-3 shadow-[0_0_28px_rgba(60,116,255,0.12)]">
        <Badge tone="user">MVP Voice Arena</Badge>
        <p className="mt-3 text-sm font-extrabold text-[var(--ra-text-primary)]">
          Latih argumen melawan AI.
        </p>
        <p className="mt-2 text-xs leading-5 text-[var(--ra-text-muted)]">
          Pilih topik, tentukan posisi, lalu masuk ke arena debat.
        </p>
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

      <div className="rounded-[var(--ra-radius-xl)] border border-[rgba(90,142,255,0.24)] bg-[rgba(7,13,30,0.70)] p-3">
        <p className="text-xs font-black uppercase tracking-wide text-[var(--ra-text-muted)]">
          Status
        </p>
        <p className="mt-2 text-sm font-bold text-[var(--ra-text-primary)]">
          Personal MVP
        </p>
        <p className="mt-1 text-xs leading-5 text-[var(--ra-text-muted)]">
          Fitur sosial dan monetisasi disembunyikan selama recovery.
        </p>
      </div>
    </aside>
  );
}
