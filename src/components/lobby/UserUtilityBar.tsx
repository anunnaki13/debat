import Link from "next/link";
import { Bell, Crown, Gift, History, Search, Settings } from "lucide-react";
import { Badge, IconButton } from "@/components/ui";

export function UserUtilityBar() {
  return (
    <div className="ra-hud-panel flex min-h-14 flex-wrap items-center justify-between gap-3 rounded-[var(--ra-radius-xl)] border border-[rgba(21,248,255,0.18)] bg-[rgba(2,8,23,0.78)] px-4 py-3 shadow-[var(--ra-shadow-card)] backdrop-blur-xl">
      <label className="group flex min-w-0 flex-1 items-center gap-3 rounded-[var(--ra-radius-pill)] border border-[rgba(255,255,255,0.12)] bg-[rgba(2,8,23,0.76)] px-3 py-2 transition focus-within:border-[var(--ra-electric-cyan)]">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[var(--ra-radius-pill)] bg-[var(--ra-bg-panel)] text-[var(--ra-text-muted)] group-focus-within:text-[var(--ra-electric-cyan)]">
          <Search size={17} aria-hidden="true" />
        </span>
        <span className="sr-only">Cari topik atau tantangan</span>
        <input
          type="search"
          disabled
          placeholder="Cari topik atau tantangan..."
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[var(--ra-text-primary)] outline-none placeholder:text-[var(--ra-text-muted)] disabled:cursor-not-allowed"
        />
        <span className="hidden rounded-[var(--ra-radius-pill)] bg-[var(--ra-bg-panel)] px-2 py-1 text-[11px] font-bold text-[var(--ra-text-muted)] sm:inline">
          Ctrl K
        </span>
      </label>
      <div className="flex items-center gap-2">
        <IconButton
          icon={<Bell size={17} aria-hidden="true" />}
          label="Notifikasi belum tersedia"
          disabled
        />
        <IconButton
          icon={<Gift size={17} aria-hidden="true" />}
          label="Hadiah belum tersedia"
          disabled
        />
        <Badge tone="prestige" className="hidden gap-2 sm:inline-flex">
          <Crown size={14} aria-hidden="true" />
          Premium Club
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
