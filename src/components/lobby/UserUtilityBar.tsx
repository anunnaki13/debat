import Link from "next/link";
import { History, Search, Settings } from "lucide-react";
import { Badge, IconButton } from "@/components/ui";

export function UserUtilityBar() {
  return (
    <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 rounded-[var(--ra-radius-lg)] border border-[var(--ra-border-subtle)] bg-[var(--ra-bg-glass)] px-4 py-3 shadow-[var(--ra-shadow-card)]">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[var(--ra-radius-md)] bg-[var(--ra-bg-panel)] text-[var(--ra-text-muted)]">
          <Search size={17} aria-hidden="true" />
        </span>
        <p className="truncate text-sm text-[var(--ra-text-secondary)]">
          <span className="sm:hidden">Arena siap</span>
          <span className="hidden sm:inline">
            Cari topik, pilih mode, lalu masuk arena.
          </span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge tone="prestige" className="hidden sm:inline-flex">
          Lokal MVP
        </Badge>
        <Link
          href="/history"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] px-3 text-sm font-semibold text-[var(--ra-text-secondary)] transition hover:bg-[var(--ra-bg-panel)] hover:text-[var(--ra-text-primary)]"
        >
          <History size={16} aria-hidden="true" />
          <span className="hidden sm:inline">Riwayat</span>
        </Link>
        <IconButton
          icon={<Settings size={17} aria-hidden="true" />}
          label="Pengaturan belum tersedia"
          disabled
        />
      </div>
    </div>
  );
}
