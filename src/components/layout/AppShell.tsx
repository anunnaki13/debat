import type { ReactNode } from "react";
import Link from "next/link";
import { History, Search, Settings, Zap } from "lucide-react";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { cn } from "@/lib/cn";

export function AppShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-ra-theme="default"
      className="relative min-h-screen overflow-hidden bg-[image:var(--ra-bg-app-shell)] text-[var(--ra-text-primary)]"
    >
      <div className="pointer-events-none fixed inset-0 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_0%,rgba(21,248,255,0.14),transparent_30%),radial-gradient(circle_at_86%_12%,rgba(255,43,214,0.12),transparent_28%),linear-gradient(180deg,rgba(2,5,13,0.12),rgba(2,5,13,0.58))]" />
        <div className="ra-esports-grid absolute inset-0 opacity-50" />
      </div>
      <DesktopSidebar />
      <div className="relative min-h-screen lg:pl-[252px]">
        <main
          className={cn(
            "mx-auto w-full max-w-[1440px] px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-7",
            className,
          )}
        >
          <GameCommandBar />
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}

function GameCommandBar() {
  return (
    <header className="ra-hud-panel hidden min-h-[76px] items-center gap-4 rounded-[var(--ra-radius-xl)] border border-[rgba(21,248,255,0.30)] bg-[rgba(3,8,20,0.82)] px-4 shadow-[var(--ra-shadow-elevated)] backdrop-blur-xl lg:flex">
      <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[var(--ra-radius-lg)] border border-[rgba(21,248,255,0.22)] bg-[rgba(7,11,19,0.78)] px-4 py-3">
        <Search
          size={19}
          aria-hidden="true"
          className="shrink-0 text-[var(--ra-cyan-bright)]"
        />
        <p className="truncate text-sm font-semibold text-[var(--ra-text-secondary)]">
          Cari topik, mode latihan, atau lanjutkan sesi arena...
        </p>
        <span className="ml-auto rounded-[var(--ra-radius-pill)] border border-[var(--ra-border-default)] bg-[rgba(255,255,255,0.06)] px-2 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--ra-text-muted)]">
          Ctrl K
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/history"
          className="inline-flex min-h-11 items-center gap-2 rounded-[var(--ra-radius-md)] border border-[rgba(216,170,92,0.42)] bg-[rgba(216,170,92,0.10)] px-3 text-sm font-bold text-[var(--ra-gold-bright)] transition hover:bg-[rgba(216,170,92,0.18)]"
        >
          <History size={17} aria-hidden="true" />
          Riwayat
        </Link>
        <Link
          href="/settings"
          className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--ra-radius-md)] border border-[rgba(255,255,255,0.12)] bg-[rgba(19,32,51,0.72)] text-[var(--ra-text-secondary)] transition hover:border-[var(--ra-cyan)] hover:text-[var(--ra-text-primary)]"
          aria-label="Pengaturan"
        >
          <Settings size={18} aria-hidden="true" />
        </Link>
        <div className="inline-flex min-h-11 items-center gap-2 rounded-[var(--ra-radius-md)] border border-[rgba(21,248,255,0.26)] bg-[rgba(21,248,255,0.10)] px-3 text-sm font-black text-[var(--ra-cyan-bright)]">
          <Zap size={16} aria-hidden="true" />
          Arena Ready
        </div>
      </div>
    </header>
  );
}
