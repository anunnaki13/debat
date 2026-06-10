import Image from "next/image";
import { ArrowDown, Bot, Gavel, Mic2, PenLine, Swords } from "lucide-react";
import { ArenaParticleField } from "@/components/arena/ArenaEffects";
import { Button } from "@/components/ui";
import {
  arenaReferenceAssets,
  personaPortraits,
  type PersonaCropKey,
} from "@/lib/arena-reference-assets";

const arenaSteps = [
  "Pilih topik",
  "Ambil posisi",
  "Lawan AI",
  "Dinilai wasit",
] as const;

export function LobbyHero({
  onPrimaryAction,
}: {
  onPrimaryAction: () => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-[var(--ra-radius-xl)] border border-[rgba(90,142,255,0.34)] bg-[#050914] shadow-[var(--ra-shadow-elevated)]">
      <Image
        src={arenaReferenceAssets.arenaStageWide}
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) calc(100vw - 280px), 100vw"
        className="object-cover object-center opacity-70"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(34,148,255,0.24),transparent_32%),radial-gradient(circle_at_82%_12%,rgba(255,65,87,0.18),transparent_30%),linear-gradient(90deg,rgba(2,6,18,0.94),rgba(2,8,23,0.68)_52%,rgba(2,6,18,0.94))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#47b7ff,#ff4d63,transparent)]" />
      <ArenaParticleField density={18} />

      <div className="relative grid gap-5 p-4 sm:p-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-stretch">
        <div className="flex min-h-[420px] flex-col justify-between rounded-[var(--ra-radius-lg)] border border-[rgba(90,142,255,0.22)] bg-[rgba(3,8,22,0.54)] p-4 backdrop-blur-sm sm:p-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex min-h-8 items-center gap-2 rounded-[var(--ra-radius-pill)] border border-[rgba(86,178,255,0.45)] bg-[rgba(21,111,255,0.16)] px-3 text-xs font-black uppercase tracking-[0.12em] text-[#76c8ff]">
                <Swords size={14} aria-hidden="true" />
                Voice-first MVP
              </span>
              <span className="inline-flex min-h-8 items-center gap-2 rounded-[var(--ra-radius-pill)] border border-[rgba(238,106,100,0.45)] bg-[rgba(238,106,100,0.14)] px-3 text-xs font-black uppercase tracking-[0.12em] text-[#ff8a84]">
                <Bot size={14} aria-hidden="true" />
                AI melawan posisi Anda
              </span>
            </div>

            <div className="mt-8 max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[var(--ra-cyan-bright)]">
                Republik Argumen
              </p>
              <h1 className="mt-3 font-serif text-4xl font-black leading-tight text-[var(--ra-text-primary)] sm:text-5xl lg:text-6xl">
                Panas pada gagasan. Tenang pada pembuktian.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--ra-text-secondary)] sm:text-lg">
                Masuk ke arena debat pribadi, uji posisi Anda melawan AI, lalu
                biarkan wasit AI membedah logika, bukti, dan cara penyampaian.
              </p>
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
                onClick={() => {
                  window.location.hash = "custom-topic";
                  document.getElementById("pilih-topik")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                leadingIcon={<PenLine size={18} aria-hidden="true" />}
              >
                Buat Topik Sendiri
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-4">
            {arenaSteps.map((step, index) => (
              <div
                key={step}
                className="rounded-[var(--ra-radius-md)] border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.045)] px-3 py-3"
              >
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--ra-text-muted)]">
                  Step {index + 1}
                </p>
                <p className="mt-1 text-sm font-bold text-[var(--ra-text-primary)]">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        <aside className="grid gap-4 rounded-[var(--ra-radius-lg)] border border-[rgba(90,142,255,0.22)] bg-[rgba(3,8,22,0.64)] p-4 backdrop-blur-sm">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <HeroPersona
              crop="livePlayer"
              label="Anda"
              role="Penantang"
              side="Argumen utama"
              tone="blue"
            />
            <HeroPersona
              crop="liveOpponent"
              label="AI Lawan"
              role="Oposisi aktif"
              side="Membantah posisi Anda"
              tone="red"
            />
          </div>

          <div className="rounded-[var(--ra-radius-lg)] border border-[rgba(216,170,92,0.34)] bg-[rgba(216,170,92,0.10)] p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--ra-radius-pill)] border border-[rgba(216,170,92,0.52)] bg-[rgba(2,8,23,0.72)] text-[var(--ra-gold-bright)]">
                <Gavel size={20} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-[var(--ra-text-primary)]">
                  Wasit AI
                </p>
                <p className="mt-1 text-xs leading-5 text-[var(--ra-text-secondary)]">
                  Menilai struktur, bukti, relevansi, dan respons antar ronde.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[var(--ra-radius-lg)] border border-[rgba(66,215,255,0.32)] bg-[rgba(29,173,255,0.12)] p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--ra-radius-pill)] border border-[#42d7ff] bg-[rgba(29,173,255,0.14)] text-[#57e2ff] shadow-[0_0_26px_rgba(37,200,255,0.28)]">
                <Mic2 size={21} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black uppercase tracking-wide text-[var(--ra-text-primary)]">
                  Voice arena
                </p>
                <div className="mt-2 flex h-8 items-end gap-1.5">
                  {Array.from({ length: 18 }).map((_, index) => (
                    <span
                      key={index}
                      className="w-1.5 rounded-[var(--ra-radius-pill)] bg-[linear-gradient(180deg,#55e6ff,#2878ff)]"
                      style={{
                        height: `${10 + ((index * 13) % 24)}px`,
                        animation: "ra-halo-pulse 1.5s ease-in-out infinite",
                        animationDelay: `${index * 42}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function HeroPersona({
  crop,
  label,
  role,
  side,
  tone,
}: {
  crop: PersonaCropKey;
  label: string;
  role: string;
  side: string;
  tone: "blue" | "red";
}) {
  return (
    <div
      className={`relative min-h-[210px] overflow-hidden rounded-[var(--ra-radius-lg)] border bg-[rgba(3,8,22,0.66)] ${
        tone === "blue"
          ? "border-[rgba(64,182,255,0.34)] shadow-[0_0_36px_rgba(39,155,255,0.18)]"
          : "border-[rgba(255,75,88,0.34)] shadow-[0_0_36px_rgba(255,55,70,0.18)]"
      }`}
    >
      <PersonaArt crop={crop} className="absolute inset-0" />
      <div
        className={`absolute inset-0 ${
          tone === "blue"
            ? "bg-[linear-gradient(90deg,rgba(5,15,35,0.12),rgba(5,15,35,0.90))]"
            : "bg-[linear-gradient(270deg,rgba(35,5,12,0.10),rgba(35,5,12,0.90))]"
        }`}
      />
      <div className="absolute inset-x-3 bottom-3 rounded-[var(--ra-radius-md)] border border-[rgba(255,255,255,0.12)] bg-[rgba(5,9,20,0.80)] p-3 backdrop-blur-md">
        <p
          className={`text-xs font-black uppercase tracking-[0.14em] ${
            tone === "blue" ? "text-[#55dfff]" : "text-[#ff7582]"
          }`}
        >
          {label}
        </p>
        <h2 className="mt-1 text-lg font-black text-[var(--ra-text-primary)]">
          {role}
        </h2>
        <p className="mt-1 text-xs font-bold text-[var(--ra-text-muted)]">
          {side}
        </p>
      </div>
    </div>
  );
}

function PersonaArt({
  crop,
  className,
}: {
  crop: PersonaCropKey;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        backgroundImage: `url(${personaPortraits[crop]})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      aria-hidden="true"
    />
  );
}
