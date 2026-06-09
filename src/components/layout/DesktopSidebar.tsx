"use client";

import Image from "next/image";
import Link from "next/link";
import { Compass, History, Home, Settings, Swords, Zap } from "lucide-react";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/cn";

const navItems = [
  { label: "Beranda", href: "/", icon: Home, match: "/" },
  { label: "Arena", href: "/#setup-debat", icon: Swords, match: "/debate" },
  { label: "Jelajah Topik", href: "/#pilih-topik", icon: Compass, match: "/topics" },
  { label: "Riwayat", href: "/history", icon: History, match: "/history" },
  { label: "Pengaturan", href: "/#setup-debat", icon: Settings, match: "/settings" },
] as const;

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-[var(--ra-z-sticky)] hidden w-60 border-r border-[var(--ra-border-subtle)] bg-[rgba(7,11,19,0.88)] px-4 py-5 backdrop-blur-xl lg:flex lg:flex-col">
      <Link href="/" className="flex min-h-12 items-center gap-3 rounded-[var(--ra-radius-md)] px-2">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[var(--ra-radius-md)] border border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] shadow-[var(--ra-glow-user)]">
          <Image
            src="/assets/arena/logo-mark.svg"
            alt=""
            width={34}
            height={34}
            aria-hidden="true"
          />
        </span>
        <span>
          <span className="block text-xs font-semibold uppercase tracking-wide text-[var(--ra-cyan-bright)]">
            Republik
          </span>
          <span className="block font-serif text-xl font-bold leading-none text-[var(--ra-text-primary)]">
            Argumen
          </span>
        </span>
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-2" aria-label="Navigasi utama">
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
                  ? "border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] text-[var(--ra-cyan-bright)]"
                  : "border-transparent text-[var(--ra-text-secondary)] hover:border-[var(--ra-border-default)] hover:bg-[var(--ra-bg-panel)] hover:text-[var(--ra-text-primary)]",
              )}
            >
              <Icon size={18} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="ra-animated-frame rounded-[var(--ra-radius-xl)] p-4">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/arena/user-orator-avatar.svg"
            alt=""
            width={48}
            height={48}
            className="rounded-[var(--ra-radius-pill)] border border-[var(--ra-cyan)]"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-semibold text-[var(--ra-text-primary)]">
              Budi Hidayat
            </p>
            <Badge tone="prestige" className="mt-1 gap-1">
              <Zap size={12} aria-hidden="true" />
              Orator Muda
            </Badge>
          </div>
        </div>
        <div className="mt-4 rounded-[var(--ra-radius-lg)] border border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] p-3">
          <p className="text-xs font-semibold text-[var(--ra-text-muted)]">
            Kredit Arena
          </p>
          <p className="mt-1 font-serif text-2xl font-bold text-[var(--ra-cyan-bright)]">
            140 KA
          </p>
        </div>
      </div>
    </aside>
  );
}
