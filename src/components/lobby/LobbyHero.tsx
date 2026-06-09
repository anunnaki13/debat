import Image from "next/image";
import { ArrowDown, Flame, RadioTower, Swords, Trophy, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { ArenaParticleField, EnergyDivider } from "@/components/arena/ArenaEffects";
import { Button } from "@/components/ui";

export function LobbyHero({
  onPrimaryAction,
}: {
  onPrimaryAction: () => void;
}) {
  return (
    <section className="ra-esports-grid ra-laser-sweep relative overflow-hidden rounded-[var(--ra-radius-xl)] border border-[rgba(21,248,255,0.32)] bg-[image:var(--ra-gradient-esports-arena)] shadow-[var(--ra-shadow-elevated)]">
      <Image
        src="/assets/arena/hero-duel-scene.svg"
        alt=""
        fill
        priority
        className="object-cover object-center opacity-[0.92]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,8,23,0.95)_0%,rgba(2,8,23,0.78)_34%,rgba(2,8,23,0.20)_68%,rgba(2,8,23,0.76)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(21,248,255,0.20),transparent_28%),radial-gradient(circle_at_82%_28%,rgba(255,43,214,0.20),transparent_30%)]" />
      <ArenaParticleField density={24} />

      <div className="relative grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:p-7 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-h-[340px] flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="inline-flex min-h-8 items-center gap-2 rounded-[var(--ra-radius-pill)] border border-[var(--ra-electric-cyan)] bg-[rgba(21,248,255,0.14)] px-3 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--ra-electric-cyan)] shadow-[var(--ra-glow-esports-cyan)]">
                <RadioTower size={14} aria-hidden="true" />
                Live Debate Arena
              </p>
              <span className="inline-flex min-h-8 items-center gap-2 rounded-[var(--ra-radius-pill)] border border-[var(--ra-magenta)] bg-[var(--ra-magenta-soft)] px-3 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--ra-magenta-bright)]">
                <Flame size={14} aria-hidden="true" />
                High Tech Match
              </span>
            </div>
            <h1 className="mt-5 max-w-[780px] text-[2rem] font-black uppercase leading-[0.98] tracking-wide text-[var(--ra-text-primary)] drop-shadow-[0_0_24px_rgba(21,248,255,0.25)] sm:text-[2.7rem] lg:text-[3.15rem]">
              Masuk Arena. Adu Argumen Melawan AI.
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-[var(--ra-text-secondary)] sm:text-base">
              Pilih topik, nyalakan mode voice, lalu bertanding dalam HUD
              kompetitif dengan lawan AI, momentum meter, dan wasit objektif.
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
          <div className="ra-hud-panel absolute right-0 top-0 w-full rounded-[var(--ra-radius-xl)] border border-[rgba(21,248,255,0.32)] bg-[rgba(2,8,23,0.72)] p-4 shadow-[var(--ra-glow-esports-cyan)] backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--ra-electric-cyan)]">
              Arena Match HUD
            </p>
            <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <HeroFighter src="/assets/arena/user-orator-avatar.svg" tone="cyan" label="Player" />
              <div className="grid h-16 w-16 place-items-center rounded-[var(--ra-radius-pill)] border border-[var(--ra-gold)] bg-[rgba(216,170,92,0.15)] text-[var(--ra-gold-bright)] shadow-[var(--ra-glow-gold)]">
                <Swords size={30} aria-hidden="true" />
              </div>
              <HeroFighter src="/assets/arena/ai-opponent-avatar.svg" tone="magenta" label="AI" />
            </div>

            <div className="mt-5 rounded-[var(--ra-radius-lg)] border border-[rgba(255,255,255,0.10)] bg-[rgba(7,16,28,0.82)] p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-[var(--ra-electric-cyan)]">
                  Momentum
                </span>
                <span className="text-xs font-extrabold uppercase text-[var(--ra-magenta-bright)]">
                  AI Pressure
                </span>
              </div>
              <div className="mt-3 grid h-3 overflow-hidden rounded-[var(--ra-radius-pill)] bg-[rgba(255,255,255,0.08)]" style={{ gridTemplateColumns: "58fr 42fr" }}>
                <span className="bg-[var(--ra-electric-cyan)] shadow-[0_0_20px_rgba(21,248,255,0.85)]" />
                <span className="bg-[var(--ra-magenta)] shadow-[0_0_20px_rgba(255,43,214,0.75)]" />
              </div>
              <div className="mt-4 space-y-2">
                <RankMetric label="Logic" value={82} />
                <RankMetric label="Data" value={79} />
                <RankMetric label="Rebuttal" value={86} />
                <RankMetric label="Integrity" value={91} />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <HeroMiniMetric icon={<Zap size={15} aria-hidden="true" />} label="140 KA" copy="Arena Energy" />
              <HeroMiniMetric icon={<Trophy size={15} aria-hidden="true" />} label="#128" copy="Ranked Ladder" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroFighter({
  src,
  tone,
  label,
}: {
  src: string;
  tone: "cyan" | "magenta";
  label: string;
}) {
  return (
    <div className="text-center">
      <div
        className={`mx-auto grid h-24 w-24 place-items-center rounded-[var(--ra-radius-pill)] border bg-[rgba(7,16,28,0.82)] ${
          tone === "cyan"
            ? "border-[var(--ra-electric-cyan)] shadow-[var(--ra-glow-esports-cyan)]"
            : "border-[var(--ra-magenta)] shadow-[var(--ra-glow-esports-magenta)]"
        }`}
      >
        <Image src={src} alt="" width={78} height={78} aria-hidden="true" />
      </div>
      <p
        className={`mt-3 text-xs font-black uppercase tracking-[0.16em] ${
          tone === "cyan" ? "text-[var(--ra-electric-cyan)]" : "text-[var(--ra-magenta-bright)]"
        }`}
      >
        {label}
      </p>
    </div>
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
