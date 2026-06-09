import Image from "next/image";
import { ArrowDown, Crown, Flame, Sparkles, Swords, Trophy, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { ArenaParticleField, EnergyDivider } from "@/components/arena/ArenaEffects";
import { Button } from "@/components/ui";

export function LobbyHero({
  onPrimaryAction,
}: {
  onPrimaryAction: () => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-[var(--ra-radius-xl)] border border-[rgba(216,170,92,0.24)] bg-[linear-gradient(135deg,#071321_0%,#0a1430_48%,#10091d_100%)] shadow-[var(--ra-shadow-elevated)]">
      <Image
        src="/assets/arena/hero-duel-scene.svg"
        alt=""
        fill
        priority
        className="object-cover object-center opacity-90"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,11,19,0.96)_0%,rgba(7,11,19,0.8)_38%,rgba(7,11,19,0.34)_70%,rgba(7,11,19,0.76)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(50,212,209,0.14),transparent_28%),radial-gradient(circle_at_78%_28%,rgba(238,106,100,0.16),transparent_30%)]" />
      <ArenaParticleField density={24} />

      <div className="relative grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:p-7 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-h-[340px] flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="inline-flex min-h-8 items-center gap-2 rounded-[var(--ra-radius-pill)] border border-[var(--ra-gold)] bg-[rgba(216,170,92,0.16)] px-3 text-xs font-bold text-[var(--ra-gold-bright)]">
                <Sparkles size={14} aria-hidden="true" />
                Selamat datang kembali, Budi!
              </p>
              <span className="inline-flex min-h-8 items-center gap-2 rounded-[var(--ra-radius-pill)] border border-[var(--ra-cyan)] bg-[rgba(50,212,209,0.13)] px-3 text-xs font-bold text-[var(--ra-cyan-bright)]">
                <Flame size={14} aria-hidden="true" />
                Streak 12 hari
              </span>
            </div>
            <h1 className="mt-5 max-w-[760px] text-[2rem] font-extrabold leading-[1.08] text-[var(--ra-text-primary)] sm:text-[2.65rem] lg:text-[3rem]">
              Mau menguji argumen apa hari ini?
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-[var(--ra-text-secondary)] sm:text-base">
              Latih tesis, bicara di arena, lalu biarkan lawan AI dan wasit AI
              menguji logika, data, struktur, rebuttal, dan integritas argumen.
            </p>
            <EnergyDivider className="mt-5 max-w-xl" />
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={onPrimaryAction}
              trailingIcon={<ArrowDown size={18} aria-hidden="true" />}
            >
              Mulai Debat AI
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onPrimaryAction}
              leadingIcon={<Swords size={18} aria-hidden="true" />}
            >
              Pasang Pendapat
            </Button>
          </div>
        </div>

        <div className="relative hidden min-h-[330px] lg:block">
          <div className="absolute right-0 top-0 w-full rounded-[var(--ra-radius-xl)] border border-[rgba(216,170,92,0.24)] bg-[rgba(7,11,19,0.72)] p-4 shadow-[var(--ra-shadow-card)] backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <Image
                src="/assets/arena/user-orator-avatar.svg"
                alt=""
                width={58}
                height={58}
                className="rounded-[var(--ra-radius-pill)] border border-[var(--ra-cyan)] bg-[var(--ra-bg-deep)]"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-[var(--ra-text-primary)]">
                  Budi Hidayat
                </p>
                <p className="text-xs font-semibold text-[var(--ra-text-muted)]">
                  Menteri Klarifikasi
                </p>
                <span className="mt-2 inline-flex min-h-7 items-center gap-1 rounded-[var(--ra-radius-pill)] border border-[var(--ra-gold)] bg-[var(--ra-gold-soft)] px-2 text-[11px] font-bold text-[var(--ra-gold-bright)]">
                  <Crown size={12} aria-hidden="true" />
                  Orator Muda
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-[var(--ra-radius-lg)] border border-[var(--ra-border-subtle)] bg-[rgba(19,32,51,0.74)] p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-[var(--ra-text-muted)]">
                    Reputasi
                  </p>
                  <p className="mt-1 text-xl font-extrabold text-[var(--ra-text-primary)]">
                    2.450
                  </p>
                </div>
                <Image
                  src="/assets/arena/rank-orator-badge.svg"
                  alt=""
                  width={52}
                  height={52}
                  aria-hidden="true"
                />
              </div>
              <div className="mt-4 space-y-2">
                <RankMetric label="Logika" value={82} />
                <RankMetric label="Data" value={79} />
                <RankMetric label="Rebuttal" value={86} />
                <RankMetric label="Integritas" value={91} />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <HeroMiniMetric icon={<Zap size={15} aria-hidden="true" />} label="140 KA" copy="Kredit Arena" />
              <HeroMiniMetric icon={<Trophy size={15} aria-hidden="true" />} label="#128" copy="Peringkat" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RankMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid grid-cols-[74px_minmax(0,1fr)_28px] items-center gap-2">
      <span className="text-[11px] font-bold text-[var(--ra-text-secondary)]">
        {label}
      </span>
      <span className="h-1.5 overflow-hidden rounded-[var(--ra-radius-pill)] bg-[rgba(255,255,255,0.08)]">
        <span
          className="block h-full rounded-[var(--ra-radius-pill)] bg-[linear-gradient(90deg,var(--ra-cyan),var(--ra-gold))]"
          style={{ width: `${value}%` }}
        />
      </span>
      <span className="text-right text-[11px] font-bold text-[var(--ra-text-primary)]">
        {value}
      </span>
    </div>
  );
}

function HeroMiniMetric({
  icon,
  label,
  copy,
}: {
  icon: ReactNode;
  label: string;
  copy: string;
}) {
  return (
    <div className="rounded-[var(--ra-radius-lg)] border border-[var(--ra-border-subtle)] bg-[rgba(10,17,29,0.78)] p-3">
      <div className="flex items-center gap-2 text-[var(--ra-gold-bright)]">
        {icon}
        <span className="text-sm font-extrabold">{label}</span>
      </div>
      <p className="mt-1 text-[11px] font-semibold text-[var(--ra-text-muted)]">
        {copy}
      </p>
    </div>
  );
}
