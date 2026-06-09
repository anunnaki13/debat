import Link from "next/link";
import { Bell, Crown, Flame, Gift, History, Search, Settings, Trophy } from "lucide-react";
import { Badge, IconButton } from "@/components/ui";

export function UserUtilityBar() {
  return (
    <div className="grid min-h-14 gap-2 rounded-[var(--ra-radius-xl)] border border-[rgba(90,142,255,0.22)] bg-[rgba(2,8,23,0.82)] px-3 py-3 shadow-[var(--ra-shadow-card)] backdrop-blur-xl sm:px-4 md:flex md:items-center md:justify-between md:gap-3">
      <label className="group flex w-full min-w-0 items-center gap-2 rounded-[var(--ra-radius-pill)] border border-[rgba(255,255,255,0.12)] bg-[rgba(2,8,23,0.76)] px-3 py-2 transition focus-within:border-[#55dfff] md:flex-1 md:gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[var(--ra-radius-pill)] bg-[var(--ra-bg-panel)] text-[var(--ra-text-muted)] group-focus-within:text-[var(--ra-electric-cyan)]">
          <Search size={17} aria-hidden="true" />
        </span>
        <span className="sr-only">Cari topik atau tantangan</span>
        <input
          type="search"
          disabled
          placeholder="Cari topik, lawan, atau tantangan..."
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[var(--ra-text-primary)] outline-none placeholder:text-[var(--ra-text-muted)] disabled:cursor-not-allowed"
        />
      </label>
      <div className="flex w-full min-w-0 items-center justify-between gap-1.5 sm:justify-end md:w-auto md:flex-none md:gap-2">
        <Badge tone="warning" className="!hidden gap-2 md:!inline-flex">
          <Flame size={14} aria-hidden="true" />
          12 hari
        </Badge>
        <Badge tone="user" className="!hidden gap-2 md:!inline-flex">
          <Trophy size={14} aria-hidden="true" />
          #128
        </Badge>
        <IconButton
          icon={<Bell size={17} aria-hidden="true" />}
          label="Notifikasi belum tersedia"
          className="h-10 w-10 shrink-0 sm:h-11 sm:w-11"
          disabled
        />
        <IconButton
          icon={<Gift size={17} aria-hidden="true" />}
          label="Hadiah belum tersedia"
          className="!hidden shrink-0 sm:!inline-flex"
          disabled
        />
        <Badge tone="prestige" className="!hidden gap-2 sm:!inline-flex">
          <Crown size={14} aria-hidden="true" />
          Premium Club
        </Badge>
        <Link
          href="/history"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] px-0 text-sm font-semibold text-[var(--ra-text-secondary)] transition hover:bg-[var(--ra-bg-panel)] hover:text-[var(--ra-text-primary)] sm:min-h-10 sm:w-auto sm:px-3"
        >
          <History size={16} aria-hidden="true" />
          <span className="hidden sm:inline">Riwayat</span>
        </Link>
        <IconButton
          icon={<Settings size={17} aria-hidden="true" />}
          label="Pengaturan belum tersedia"
          className="h-10 w-10 shrink-0 sm:h-11 sm:w-11"
          disabled
        />
      </div>
    </div>
  );
}
