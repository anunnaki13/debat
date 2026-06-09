import Image from "next/image";
import { ArrowDown, Sparkles, Swords } from "lucide-react";
import {
  AnimatedAvatarRing,
  AnimatedWaveform,
  ArenaParticleField,
  EnergyDivider,
} from "@/components/arena/ArenaEffects";
import { Button } from "@/components/ui";

export function LobbyHero({
  onPrimaryAction,
}: {
  onPrimaryAction: () => void;
}) {
  return (
    <section className="ra-arena-scanline relative overflow-hidden rounded-[var(--ra-radius-xl)] border border-[var(--ra-border-default)] bg-[image:var(--ra-gradient-game-arena)] shadow-[var(--ra-shadow-elevated)]">
      <Image
        src="/assets/arena/arena-backdrop.svg"
        alt=""
        fill
        priority
        className="object-cover opacity-[0.42]"
        aria-hidden="true"
      />
      <ArenaParticleField />
      <div className="relative grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:p-8">
        <div className="flex flex-col justify-between">
          <div>
            <p className="inline-flex min-h-8 items-center gap-2 rounded-[var(--ra-radius-pill)] border border-[var(--ra-gold)] bg-[var(--ra-gold-soft)] px-3 text-xs font-semibold text-[var(--ra-gold-bright)]">
              <Sparkles size={14} aria-hidden="true" />
              Siap menguji argumen hari ini?
            </p>
            <h1 className="mt-5 max-w-3xl font-serif text-[2rem] font-bold leading-[1.08] text-[var(--ra-text-primary)] sm:text-5xl">
              Republik Argumen
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--ra-text-secondary)] sm:text-lg">
              Panas pada gagasan. Tenang pada pembuktian.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ra-text-muted)] sm:text-base">
              Latih argumenmu melawan AI, koreksi transkrip suara, lalu biarkan
              wasit AI memberi umpan balik yang sportif.
            </p>
            <EnergyDivider className="mt-5 max-w-xl" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
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

        <div
          className="ra-animated-frame relative min-h-[300px] overflow-hidden rounded-[var(--ra-radius-xl)] p-5"
          aria-label="Ilustrasi arena debat"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,var(--ra-cyan-soft),transparent_34%),radial-gradient(circle_at_82%_35%,var(--ra-coral-soft),transparent_34%)]" />
          <div className="relative flex h-full flex-col justify-between gap-5">
            <div className="flex items-center justify-between">
              <span className="rounded-[var(--ra-radius-pill)] border border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] px-3 py-1 text-xs font-semibold text-[var(--ra-cyan-bright)]">
                USER PODIUM
              </span>
              <span className="rounded-[var(--ra-radius-pill)] border border-[var(--ra-coral)] bg-[var(--ra-coral-soft)] px-3 py-1 text-xs font-semibold text-[var(--ra-coral-bright)]">
                AI LAWAN
              </span>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <AnimatedAvatarRing tone="user" active className="mx-auto h-28 w-28">
                <Image
                  src="/assets/arena/user-orator-avatar.svg"
                  alt=""
                  width={88}
                  height={88}
                  className="rounded-[var(--ra-radius-pill)]"
                  aria-hidden="true"
                />
              </AnimatedAvatarRing>
              <div className="grid h-16 w-16 place-items-center rounded-[var(--ra-radius-pill)] border border-[var(--ra-gold)] bg-[var(--ra-gold-soft)] shadow-[var(--ra-glow-gold)]">
                <Swords size={30} aria-hidden="true" className="text-[var(--ra-gold-bright)]" />
              </div>
              <AnimatedAvatarRing tone="ai" active className="mx-auto h-28 w-28">
                <Image
                  src="/assets/arena/ai-opponent-avatar.svg"
                  alt=""
                  width={88}
                  height={88}
                  className="rounded-[var(--ra-radius-pill)]"
                  aria-hidden="true"
                />
              </AnimatedAvatarRing>
            </div>

            <div>
              <AnimatedWaveform tone="user" className="mb-3" />
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--ra-text-secondary)]">
                <span>Anda 58%</span>
                <span>42% AI</span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-[var(--ra-radius-pill)] bg-[var(--ra-bg-deep)]">
                <div className="h-full w-[58%] rounded-[var(--ra-radius-pill)] bg-[var(--ra-cyan)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
