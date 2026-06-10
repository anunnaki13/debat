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
    <aside className="fixed inset-y-0 left-0 z-[var(--ra-z-sticky)] hidden w-[252px] border-r border-[var(--ra-border-chrome)] bg-[image:var(--ra-bg-sidebar)] px-3 py-4 backdrop-blur-xl lg:flex lg:flex-col">
      <Link href="/" className="relative flex min-h-[118px] flex-col justify-center rounded-[var(--ra-radius-lg)] border border-[var(--ra-border-brand)] bg-[var(--ra-bg-brand-panel)] p-3">
        <div className="absolute inset-0 rounded-[var(--ra-radius-lg)] bg-[image:var(--ra-bg-brand-aura)]" />
        <div className="relative">
          <p className="text-center text-[1.55rem] font-black uppercase leading-none tracking-tight text-[var(--ra-text-primary)] drop-shadow-[var(--ra-shadow-brand)]">
            Republik
          </p>
          <p className="mt-1 text-center text-[1.45rem] font-black uppercase leading-none tracking-wide text-[var(--ra-brand-mark)]">
            Argumen
          </p>
          <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--ra-brand-mark-muted)]">
            Panas pada gagasan.
          </p>
        </div>
      </Link>

      <div className="mt-4 rounded-[var(--ra-radius-xl)] border border-[var(--ra-border-nav-card)] bg-[var(--ra-bg-sidebar-card)] p-3 shadow-[var(--ra-shadow-nav-card)]">
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
                  ? "border-[var(--ra-border-nav-active)] bg-[image:var(--ra-bg-nav-active)] text-[var(--ra-text-primary)] shadow-[var(--ra-shadow-nav-active)]"
                  : "border-transparent text-[var(--ra-text-secondary)] hover:border-[var(--ra-border-nav-hover)] hover:bg-[var(--ra-bg-nav-hover)] hover:text-[var(--ra-text-primary)]",
              )}
            >
              <Icon size={18} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-[var(--ra-radius-xl)] border border-[var(--ra-border-chrome-soft)] bg-[var(--ra-bg-sidebar-card-muted)] p-3">
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
