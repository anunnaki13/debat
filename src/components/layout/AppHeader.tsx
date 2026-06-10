import Link from "next/link";
import { History, Swords } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b border-[var(--ra-border-default)] bg-[var(--ra-bg-header)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-[var(--ra-radius-md)] border border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] text-[var(--ra-cyan-bright)]">
            <Swords size={20} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-semibold uppercase text-[var(--ra-cyan-bright)]">
              Republik
            </span>
            <span className="block text-lg font-bold text-[var(--ra-text-primary)]">Argumen</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-sm text-[var(--ra-text-secondary)]">
          <Link
            href="/history"
            className="inline-flex items-center gap-2 rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] px-3 py-2 transition hover:border-[var(--ra-cyan)] hover:bg-[var(--ra-cyan-soft)] hover:text-[var(--ra-text-primary)]"
          >
            <History size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Riwayat</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
