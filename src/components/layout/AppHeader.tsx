import Link from "next/link";
import { History, Swords } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md border border-cyan-300/30 bg-cyan-300/10 text-cyan-200">
            <Swords size={20} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-semibold uppercase text-cyan-200">
              Republik
            </span>
            <span className="block text-lg font-bold text-white">Argumen</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-sm text-slate-300">
          <Link
            href="/history"
            className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-white"
          >
            <History size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Riwayat</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
