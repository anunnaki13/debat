import Image from "next/image";
import {
  ArrowDown,
  BarChart3,
  Bot,
  Brain,
  Flame,
  Mic2,
  RadioTower,
  Swords,
  Users,
} from "lucide-react";
import { ArenaParticleField } from "@/components/arena/ArenaEffects";
import { Button } from "@/components/ui";
import {
  arenaReferenceAssets,
  personaCrop,
  type PersonaCropKey,
} from "@/lib/arena-reference-assets";

const reactionStats = [
  { label: "Setuju", value: "512", tone: "text-[var(--ra-emerald)]", icon: Users },
  { label: "Butuh data", value: "218", tone: "text-[var(--ra-amber)]", icon: BarChart3 },
  { label: "Interupsi", value: "143", tone: "text-[var(--ra-coral-bright)]", icon: Flame },
  { label: "Menarik", value: "89", tone: "text-[var(--ra-violet)]", icon: Brain },
] as const;

const aiChoices = [
  { label: "Ekonom Teknis", crop: "strategist", level: "Sulit" },
  { label: "Politisi Senior", crop: "fieldCommander", level: "Menengah" },
  { label: "Aktivis Muda", crop: "publicVoice", level: "Mudah" },
  { label: "Netizen Kritis", crop: "investigator", level: "Acak" },
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
        className="object-cover object-center opacity-75"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_24%,rgba(34,148,255,0.24),transparent_34%),radial-gradient(circle_at_78%_24%,rgba(255,65,87,0.20),transparent_32%),linear-gradient(90deg,rgba(2,6,18,0.92),rgba(2,8,23,0.58)_48%,rgba(2,6,18,0.92))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#47b7ff,#ff4d63,transparent)]" />
      <ArenaParticleField density={20} />

      <div className="relative grid gap-5 p-4 sm:p-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="min-w-0 rounded-[var(--ra-radius-lg)] border border-[rgba(90,142,255,0.22)] bg-[rgba(3,8,22,0.48)] p-4 backdrop-blur-sm sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex min-h-8 items-center gap-2 rounded-[var(--ra-radius-pill)] border border-[rgba(86,178,255,0.45)] bg-[rgba(21,111,255,0.16)] px-3 text-xs font-black uppercase tracking-[0.12em] text-[#76c8ff]">
                <RadioTower size={14} aria-hidden="true" />
                Debat Langsung
              </span>
              <span className="inline-flex min-h-8 items-center gap-2 rounded-[var(--ra-radius-pill)] border border-[rgba(255,72,88,0.45)] bg-[rgba(255,43,54,0.14)] px-3 text-xs font-black uppercase tracking-[0.12em] text-[#ff7680]">
                <span className="h-2 w-2 rounded-[var(--ra-radius-pill)] bg-[#ff3248] shadow-[0_0_12px_rgba(255,50,72,0.9)]" />
                Live
              </span>
            </div>
            <span className="rounded-[var(--ra-radius-pill)] border border-[rgba(255,255,255,0.15)] bg-[rgba(8,14,28,0.78)] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[var(--ra-text-secondary)]">
              Arena Politika
            </span>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <HeroPersona
              crop="reformer"
              label="Anda"
              role="Orator Muda"
              side="PRO"
              tone="blue"
            />

            <div className="mx-auto w-full max-w-[280px] text-center">
              <div className="rounded-[var(--ra-radius-lg)] border border-[rgba(123,152,255,0.28)] bg-[rgba(6,13,31,0.82)] px-4 py-3 shadow-[0_0_36px_rgba(56,130,255,0.16)]">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--ra-text-muted)]">
                  Topik Hari Ini
                </p>
                <h1 className="mt-1 text-xl font-black leading-tight text-[var(--ra-text-primary)] sm:text-2xl">
                  Subsidi BBM Harus Dihapus?
                </h1>
                <p className="mt-2 text-xs font-bold text-[var(--ra-text-secondary)]">
                  Posisi Anda: <span className="text-[var(--ra-emerald)]">PRO</span>
                </p>
              </div>

              <div className="mx-auto mt-5 grid h-32 w-32 place-items-center rounded-[var(--ra-radius-pill)] border border-[rgba(115,153,255,0.48)] bg-[radial-gradient(circle,rgba(91,128,255,0.28),rgba(6,9,20,0.96)_64%)] shadow-[0_0_44px_rgba(91,128,255,0.42)]">
                <div className="grid h-24 w-24 place-items-center rounded-[var(--ra-radius-pill)] border border-[rgba(255,80,98,0.46)] bg-[rgba(2,6,18,0.86)]">
                  <p className="text-3xl font-black tabular-nums text-[var(--ra-text-primary)]">
                    00:45
                  </p>
                  <p className="-mt-2 text-[10px] font-black uppercase tracking-wide text-[var(--ra-text-muted)]">
                    waktu
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm font-semibold text-[var(--ra-text-secondary)]">
                Berikan argumen terbaikmu sekarang.
              </p>
            </div>

            <HeroPersona
              crop="fieldCommander"
              label="AI Lawan"
              role="Ekonom Konservatif"
              side="CONTRA"
              tone="red"
            />
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_1.4fr]">
            <div className="rounded-[var(--ra-radius-lg)] border border-[rgba(90,142,255,0.22)] bg-[rgba(4,10,24,0.76)] p-3">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#8fb7ff]">
                Reaksi Audiens
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {reactionStats.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-[var(--ra-radius-md)] border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.045)] px-3 py-2"
                    >
                      <Icon size={15} aria-hidden="true" className={item.tone} />
                      <p className={`mt-1 text-lg font-black ${item.tone}`}>
                        {item.value}
                      </p>
                      <p className="text-[11px] font-bold text-[var(--ra-text-muted)]">
                        {item.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[var(--ra-radius-lg)] border border-[rgba(90,142,255,0.24)] bg-[rgba(4,10,24,0.76)] p-3">
              <p className="text-center text-xs font-black uppercase tracking-[0.18em] text-[#8fb7ff]">
                Bicara Sekarang
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[var(--ra-radius-pill)] border border-[#42d7ff] bg-[rgba(29,173,255,0.14)] text-[#57e2ff] shadow-[0_0_26px_rgba(37,200,255,0.35)]">
                  <Mic2 size={24} aria-hidden="true" />
                </span>
                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                  {Array.from({ length: 22 }).map((_, index) => (
                    <span
                      key={index}
                      className="w-1.5 rounded-[var(--ra-radius-pill)] bg-[linear-gradient(180deg,#55e6ff,#2878ff)]"
                      style={{
                        height: `${18 + ((index * 17) % 42)}px`,
                        animation: "ra-halo-pulse 1.4s ease-in-out infinite",
                        animationDelay: `${index * 38}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={onPrimaryAction}
                  trailingIcon={<ArrowDown size={18} aria-hidden="true" />}
                >
                  Mulai Debat
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={onPrimaryAction}
                  leadingIcon={<Swords size={18} aria-hidden="true" />}
                >
                  Pilih Lawan AI
                </Button>
              </div>
            </div>
          </div>
        </div>

        <aside className="grid gap-4">
          <div className="rounded-[var(--ra-radius-lg)] border border-[rgba(123,93,255,0.36)] bg-[rgba(5,8,22,0.82)] p-4 shadow-[0_0_34px_rgba(87,70,255,0.16)] backdrop-blur-md">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-black uppercase tracking-wide text-[var(--ra-text-primary)]">
                Pilih AI Lawan
              </h2>
              <Bot size={18} aria-hidden="true" className="text-[var(--ra-violet)]" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {aiChoices.map((choice, index) => (
                <button
                  key={choice.label}
                  type="button"
                  onClick={onPrimaryAction}
                  className={`group overflow-hidden rounded-[var(--ra-radius-md)] border bg-[rgba(9,14,30,0.86)] text-left transition hover:-translate-y-0.5 ${
                    index === 0
                      ? "border-[rgba(255,83,93,0.64)] shadow-[0_0_28px_rgba(255,56,72,0.18)]"
                      : "border-[rgba(255,255,255,0.11)] hover:border-[rgba(117,170,255,0.46)]"
                  }`}
                >
                  <PersonaArt crop={choice.crop} className="h-24" />
                  <div className="p-2">
                    <p className="text-xs font-extrabold leading-tight text-[var(--ra-text-primary)]">
                      {choice.label}
                    </p>
                    <p className="mt-1 text-[10px] font-black uppercase text-[var(--ra-amber)]">
                      {choice.level}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[var(--ra-radius-lg)] border border-[rgba(90,142,255,0.32)] bg-[rgba(5,12,28,0.82)] p-4 backdrop-blur-md">
            <p className="text-sm font-black uppercase tracking-wide text-[var(--ra-text-primary)]">
              AI Coach
            </p>
            <div className="mt-4 grid grid-cols-[86px_minmax(0,1fr)] gap-3">
              <PersonaArt crop="strategist" className="h-28 rounded-[var(--ra-radius-lg)]" />
              <div>
                <p className="text-sm font-extrabold text-[var(--ra-text-primary)]">
                  Analisis Performa
                </p>
                <p className="mt-1 text-xs leading-5 text-[var(--ra-text-secondary)]">
                  Skor awal kuat, tetapi data pendukung masih perlu dipertegas.
                </p>
                <div className="mt-3 grid h-20 w-20 place-items-center rounded-[var(--ra-radius-pill)] border border-[rgba(123,128,255,0.54)] bg-[radial-gradient(circle,rgba(115,126,255,0.34),rgba(10,14,32,0.96)_70%)]">
                  <span className="text-2xl font-black text-[#9fa7ff]">78</span>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <CoachMetric label="Logika" value={82} />
              <CoachMetric label="Data" value={45} />
              <CoachMetric label="Emosi" value={85} />
              <CoachMetric label="Karisma" value={80} />
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
      className={`relative min-h-[250px] overflow-hidden rounded-[var(--ra-radius-lg)] border bg-[rgba(3,8,22,0.66)] ${
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
          Posisi {side}
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
        backgroundImage: `url(${arenaReferenceAssets.personaSheet.src})`,
        backgroundPosition: personaCrop[crop].backgroundPosition,
        backgroundSize: personaCrop[crop].backgroundSize,
      }}
      aria-hidden="true"
    />
  );
}

function CoachMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid grid-cols-[72px_minmax(0,1fr)_30px] items-center gap-2 text-[11px] font-bold">
      <span className="text-[var(--ra-text-secondary)]">{label}</span>
      <span className="h-1.5 overflow-hidden rounded-[var(--ra-radius-pill)] bg-[rgba(255,255,255,0.09)]">
        <span
          className="block h-full rounded-[var(--ra-radius-pill)] bg-[linear-gradient(90deg,#3ecbff,#8b72ff,#ff4dd6)]"
          style={{ width: `${value}%` }}
        />
      </span>
      <span className="text-right text-[var(--ra-text-primary)]">{value}</span>
    </div>
  );
}
