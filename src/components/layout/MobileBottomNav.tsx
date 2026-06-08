"use client";

import Link from "next/link";
import { Compass, Home, Plus, Swords, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const navItems = [
  { label: "Beranda", href: "/", icon: Home, match: "/", primary: false },
  { label: "Arena", href: "/#setup-debat", icon: Swords, match: "/debate", primary: false },
  { label: "Topik", href: "/#setup-debat", icon: Plus, match: "/topics/new", primary: true },
  { label: "Jelajah", href: "/#pilih-topik", icon: Compass, match: "/topics", primary: false },
  { label: "Profil", href: "/history", icon: UserCircle, match: "/history", primary: false },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi mobile"
      className="fixed inset-x-0 bottom-0 z-[var(--ra-z-sticky)] border-t border-[var(--ra-border-default)] bg-[rgba(7,11,19,0.92)] px-2 pb-[calc(8px+env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
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
                "flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-[var(--ra-radius-md)] px-1 text-[11px] font-semibold transition",
                item.primary
                  ? "bg-[var(--ra-cyan)] text-[var(--ra-text-inverse)] shadow-[var(--ra-glow-user)]"
                  : active
                    ? "bg-[var(--ra-cyan-soft)] text-[var(--ra-cyan-bright)]"
                    : "text-[var(--ra-text-muted)] hover:bg-[var(--ra-bg-panel)] hover:text-[var(--ra-text-primary)]",
              )}
            >
              <Icon size={item.primary ? 22 : 20} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
