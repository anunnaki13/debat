import { ArrowDown, Sparkles, Swords } from "lucide-react";
import { Button } from "@/components/ui";

export function LobbyHero({
  onPrimaryAction,
}: {
  onPrimaryAction: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-[var(--ra-radius-xl)] border border-[var(--ra-border-default)] bg-[image:var(--ra-gradient-hero)] shadow-[var(--ra-shadow-elevated)]">
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-8">
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
          className="relative min-h-[260px] overflow-hidden rounded-[var(--ra-radius-xl)] border border-[var(--ra-border-subtle)] bg-[var(--ra-bg-panel)] p-5"
          aria-label="Ilustrasi arena debat"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,var(--ra-cyan-soft),transparent_36%),radial-gradient(circle_at_80%_70%,var(--ra-gold-soft),transparent_38%)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="rounded-[var(--ra-radius-pill)] border border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] px-3 py-1 text-xs font-semibold text-[var(--ra-cyan-bright)]">
                USER PODIUM
              </span>
              <span className="rounded-[var(--ra-radius-pill)] border border-[var(--ra-coral)] bg-[var(--ra-coral-soft)] px-3 py-1 text-xs font-semibold text-[var(--ra-coral-bright)]">
                AI LAWAN
              </span>
            </div>

            <div className="mx-auto grid h-32 w-32 place-items-center rounded-[var(--ra-radius-pill)] border border-[var(--ra-gold)] bg-[var(--ra-gold-soft)] shadow-[var(--ra-glow-gold)]">
              <Swords size={42} aria-hidden="true" className="text-[var(--ra-gold-bright)]" />
            </div>

            <div>
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
