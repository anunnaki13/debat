import {
  AlertTriangle,
  BarChart3,
  Bot,
  CheckCircle2,
  Flag,
  Hand,
  Mic,
  Pause,
  SearchCheck,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { AnimatedAvatarRing } from "@/components/arena/ArenaEffects";
import { Badge, Button, Chip } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  arenaReferenceAssets,
  personaCrop,
  type PersonaCropKey,
} from "@/lib/arena-reference-assets";
import type { DebateInputMode, DebateSide, RoundId } from "@/types/debate";

export type ArenaVisualState =
  | "ready"
  | "user_speaking"
  | "ai_thinking"
  | "ai_speaking"
  | "recoverable_error"
  | "judging"
  | "complete";

export type ArenaMomentum = {
  user: number;
  ai: number;
};

const stateMeta: Record<
  ArenaVisualState,
  {
    label: string;
    copy: string;
    tone: "neutral" | "user" | "ai" | "positive" | "warning" | "prestige";
  }
> = {
  ready: {
    label: "Siap",
    copy: "Silakan mulai argumen Anda.",
    tone: "user",
  },
  user_speaking: {
    label: "Mendengarkan",
    copy: "Mendengarkan Anda...",
    tone: "user",
  },
  ai_thinking: {
    label: "AI berpikir",
    copy: "AI menyiapkan bantahan...",
    tone: "warning",
  },
  ai_speaking: {
    label: "AI berbicara",
    copy: "AI sedang berbicara.",
    tone: "ai",
  },
  recoverable_error: {
    label: "Perlu ulang",
    copy: "Terjadi gangguan. Coba lagi.",
    tone: "warning",
  },
  judging: {
    label: "Dinilai",
    copy: "Majelis AI menilai debat Anda...",
    tone: "prestige",
  },
  complete: {
    label: "Sidang selesai",
    copy: "Debat siap dinilai.",
    tone: "positive",
  },
};

const inputModeLabels: Record<DebateInputMode, string> = {
  TEXT: "Text",
  VOICE: "Voice",
  VOICE_CAMERA: "Voice + Camera",
};

const roundLabels: Record<RoundId, string> = {
  OPENING: "Opening",
  REBUTTAL: "Rebuttal",
  CLOSING: "Closing",
};

const waveformBars = [24, 42, 30, 58, 36, 64, 46, 28, 52, 34, 60, 40];

const aiPersonaOptions: Array<{
  name: string;
  crop: PersonaCropKey;
  level: string;
  selected?: boolean;
}> = [
  { name: "Ekonom", crop: "fieldCommander", level: "Sulit", selected: true },
  { name: "Teknis", crop: "strategist", level: "Data" },
  { name: "Aktivis", crop: "publicVoice", level: "Mudah" },
  { name: "Kritis", crop: "investigator", level: "Acak" },
];

export function getArenaStateMeta(state: ArenaVisualState) {
  return stateMeta[state];
}

export function ArenaStatusBanner({
  state,
  notice,
}: {
  state: ArenaVisualState;
  notice?: string;
}) {
  const meta = getArenaStateMeta(state);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--ra-radius-xl)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-glass)] px-4 py-3 shadow-[var(--ra-shadow-card)]">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "grid h-10 w-10 place-items-center rounded-[var(--ra-radius-md)] border",
            state === "ai_speaking"
              ? "border-[var(--ra-coral)] bg-[var(--ra-coral-soft)] text-[var(--ra-coral-bright)]"
              : state === "recoverable_error"
                ? "border-[var(--ra-amber)] bg-[var(--ra-amber-soft)] text-[var(--ra-amber)]"
                : "border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] text-[var(--ra-cyan-bright)]",
          )}
        >
          {state === "recoverable_error" ? (
            <AlertTriangle size={18} aria-hidden="true" />
          ) : state === "ai_speaking" || state === "ai_thinking" ? (
            <Bot size={18} aria-hidden="true" />
          ) : (
            <Mic size={18} aria-hidden="true" />
          )}
        </span>
        <div>
          <p className="text-sm font-semibold text-[var(--ra-text-primary)]">
            {notice || meta.copy}
          </p>
          <p className="text-xs leading-5 text-[var(--ra-text-muted)]">
            Status arena: {meta.label}
          </p>
        </div>
      </div>
      <Badge tone={meta.tone}>{meta.label}</Badge>
    </div>
  );
}

export function UserPodium({
  inputMode,
  side,
  state,
  compact = false,
  className,
}: {
  inputMode: DebateInputMode;
  side: DebateSide;
  state: ArenaVisualState;
  compact?: boolean;
  className?: string;
}) {
  const speaking = state === "user_speaking";
  const cameraOn = inputMode === "VOICE_CAMERA";

  return (
    <aside
      className={cn(
        "relative overflow-hidden rounded-[var(--ra-radius-xl)] border bg-[rgba(2,12,28,0.86)] shadow-[var(--ra-shadow-card)]",
        speaking
          ? "border-[var(--ra-electric-cyan)] shadow-[var(--ra-glow-esports-cyan)]"
          : "border-[rgba(21,248,255,0.22)]",
        compact ? "p-3" : "p-4",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_14%,rgba(21,248,255,0.22),transparent_46%)]" />
      <div
        className={cn(
          "relative overflow-hidden rounded-[var(--ra-radius-lg)] border bg-[linear-gradient(145deg,rgba(19,32,51,0.84),rgba(7,11,19,0.90))]",
          speaking ? "border-[var(--ra-electric-cyan)]" : "border-[rgba(21,248,255,0.20)]",
          compact ? "aspect-[4/3]" : "aspect-[4/3]",
        )}
      >
        <div className="absolute inset-0 grid place-items-center">
          <AnimatedAvatarRing
            tone="user"
            active={speaking}
            className={compact ? "h-16 w-16" : "h-24 w-24"}
          >
            <PersonaDisc crop="reformer" tone="blue" className={compact ? "h-14 w-14" : "h-20 w-20"} />
          </AnimatedAvatarRing>
        </div>
        <Badge
          tone={speaking ? "user" : "neutral"}
          className={cn("absolute left-3 top-3", compact && "min-h-6 px-2 text-[10px]")}
        >
          {compact
            ? "Anda"
            : speaking
              ? "Anda berbicara"
              : cameraOn
                ? "Preview lokal"
                : "Camera off"}
        </Badge>
      </div>

      {compact ? null : (
        <div className="relative mt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase text-[var(--ra-electric-cyan)]">
                Player Pod
              </p>
              <h2 className="mt-1 text-lg font-extrabold text-[var(--ra-text-primary)]">
                Budi Hidayat
              </h2>
              <p className="mt-1 text-xs font-semibold text-[var(--ra-text-muted)]">
                Posisi {side} · {inputModeLabels[inputMode]}
              </p>
            </div>
            <span className="rounded-[var(--ra-radius-pill)] border border-[var(--ra-electric-cyan)] bg-[var(--ra-electric-cyan-soft)] px-2 py-1 text-xs font-extrabold text-[var(--ra-electric-cyan)]">
              58%
            </span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-[var(--ra-radius-pill)] bg-[rgba(255,255,255,0.08)]">
            <div className="h-full w-[58%] rounded-[var(--ra-radius-pill)] bg-[var(--ra-electric-cyan)] shadow-[0_0_18px_rgba(21,248,255,0.8)]" />
          </div>
        </div>
      )}
    </aside>
  );
}

export function AiOpponentPanel({
  side,
  state,
  latestCaption,
  inputMode,
  userSide,
}: {
  side: DebateSide;
  state: ArenaVisualState;
  latestCaption?: string;
  inputMode: DebateInputMode;
  userSide: DebateSide;
}) {
  const active = state === "ai_speaking" || state === "ai_thinking";
  const speaking = state === "ai_speaking";

  return (
    <aside
      className={cn(
        "relative overflow-hidden rounded-[var(--ra-radius-xl)] border bg-[rgba(20,4,26,0.82)] p-4 shadow-[var(--ra-shadow-card)]",
        active
          ? "border-[var(--ra-magenta)] shadow-[var(--ra-glow-esports-magenta)]"
          : "border-[rgba(255,43,214,0.22)]",
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,43,214,0.20),transparent_46%)]" />
      <div className="absolute right-3 top-3 xl:hidden">
        <UserPodium compact inputMode={inputMode} side={userSide} state={state} className="w-24 bg-[rgba(7,11,19,0.72)] backdrop-blur-lg" />
      </div>

      <div className="relative min-h-[300px] xl:min-h-[390px]">
        <div className="rounded-[var(--ra-radius-lg)] border border-[rgba(255,255,255,0.10)] bg-[rgba(6,9,22,0.72)] p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-black uppercase tracking-wide text-[var(--ra-text-primary)]">
              Pilih AI Lawan
            </p>
            <Badge tone="ai">Live</Badge>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {aiPersonaOptions.map((option) => (
              <div
                key={option.name}
                className={cn(
                  "overflow-hidden rounded-[var(--ra-radius-md)] border bg-[rgba(8,12,26,0.84)]",
                  option.selected
                    ? "border-[rgba(255,74,88,0.72)] shadow-[0_0_24px_rgba(255,55,70,0.18)]"
                    : "border-[rgba(255,255,255,0.10)]",
                )}
              >
                <PersonaPanel crop={option.crop} className="h-16" />
                <div className="p-2">
                  <p className="text-[11px] font-extrabold leading-tight text-[var(--ra-text-primary)]">
                    {option.name}
                  </p>
                  <p className="mt-0.5 text-[9px] font-black uppercase text-[var(--ra-amber)]">
                    {option.level}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center text-center">
          <Badge tone={speaking ? "ai" : active ? "warning" : "neutral"} className="mb-3">
            {getArenaStateMeta(state).label}
          </Badge>
          <div
            className={cn(
              "relative grid h-32 w-32 place-items-center rounded-[var(--ra-radius-pill)] border bg-[var(--ra-magenta-soft)]",
              active ? "border-[var(--ra-magenta)]" : "border-[rgba(255,43,214,0.24)]",
            )}
          >
            {active ? (
              <span
                className="absolute inset-3 rounded-[var(--ra-radius-pill)] border border-[var(--ra-magenta)]"
                style={{ animation: "ra-halo-pulse 1.8s ease-in-out infinite" }}
              />
            ) : null}
            <PersonaDisc crop="fieldCommander" tone="red" className="h-28 w-28" />
          </div>
          <h2 className="mt-3 text-xl font-extrabold text-[var(--ra-text-primary)]">
            Menteri Klarifikasi
          </h2>
          <p className="mt-1 text-xs font-semibold text-[var(--ra-text-muted)]">
            AI Opponent · Posisi {side}
          </p>
        </div>

        {speaking ? <VoiceWaveform tone="ai" className="mt-5" /> : null}

        <div className="mt-5 rounded-[var(--ra-radius-lg)] border border-[rgba(255,43,214,0.28)] bg-[rgba(7,11,19,0.62)] p-3">
          <p className="max-h-28 max-w-[34ch] overflow-y-auto text-sm leading-6 text-[var(--ra-text-secondary)]">
            {latestCaption || "AI akan menampilkan bantahan terbaru di sini."}
          </p>
        </div>

        <div className="mt-4 w-full rounded-[var(--ra-radius-lg)] border border-[var(--ra-border-subtle)] bg-[rgba(7,11,19,0.50)] p-3 text-left">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-[var(--ra-text-muted)]">
            AI Coach
          </p>
          <JudgeMetric label="Struktur" value="Baik" tone="positive" />
          <JudgeMetric label="Logika" value="Kuat" tone="positive" />
          <JudgeMetric label="Data" value="Perlu data" tone="warning" />
          <JudgeMetric label="Integritas" value="Sangat baik" tone="positive" />
        </div>
      </div>
    </aside>
  );
}

function PersonaDisc({
  crop,
  tone,
  className,
}: {
  crop: PersonaCropKey;
  tone: "blue" | "red";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative rounded-[var(--ra-radius-pill)] border bg-cover",
        tone === "blue"
          ? "border-[#55dfff] shadow-[0_0_24px_rgba(68,196,255,0.38)]"
          : "border-[#ff6475] shadow-[0_0_24px_rgba(255,65,83,0.34)]",
        className,
      )}
      style={{
        backgroundImage: `url(${arenaReferenceAssets.personaSheet.src})`,
        backgroundPosition: personaCrop[crop].backgroundPosition,
        backgroundSize: personaCrop[crop].backgroundSize,
      }}
      aria-hidden="true"
    />
  );
}

function PersonaPanel({
  crop,
  className,
}: {
  crop: PersonaCropKey;
  className?: string;
}) {
  return (
    <div
      className={cn("bg-cover", className)}
      style={{
        backgroundImage: `url(${arenaReferenceAssets.personaSheet.src})`,
        backgroundPosition: personaCrop[crop].backgroundPosition,
        backgroundSize: personaCrop[crop].backgroundSize,
      }}
      aria-hidden="true"
    />
  );
}

function JudgeMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "positive" | "warning";
}) {
  return (
    <div className="flex min-h-7 items-center justify-between gap-3 text-[11px] font-bold">
      <span className="text-[var(--ra-text-secondary)]">{label}</span>
      <span
        className={cn(
          tone === "positive" ? "text-[var(--ra-emerald)]" : "text-[var(--ra-amber)]",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function MomentumMeter({ momentum }: { momentum: ArenaMomentum }) {
  return (
    <section className="ra-hud-panel rounded-[var(--ra-radius-xl)] border border-[rgba(21,248,255,0.22)] bg-[rgba(2,8,23,0.78)] p-4 shadow-[var(--ra-shadow-card)]">
      <div className="flex items-center justify-between gap-3 text-sm font-semibold">
        <span className="text-[var(--ra-electric-cyan)]">Anda {momentum.user}%</span>
        <span className="text-[var(--ra-text-muted)]" title="Momentum adalah indikator dinamika debat, bukan penilaian akhir.">
          Momentum
        </span>
        <span className="text-[var(--ra-magenta-bright)]">AI {momentum.ai}%</span>
      </div>
      <div
        className="mt-3 grid h-3 overflow-hidden rounded-[var(--ra-radius-pill)] border border-[var(--ra-border-subtle)] bg-[var(--ra-bg-panel)]"
        style={{ gridTemplateColumns: `${momentum.user}fr ${momentum.ai}fr` }}
      >
        <span
          className="bg-[var(--ra-electric-cyan)] shadow-[0_0_18px_rgba(21,248,255,0.8)] transition-[width] duration-300"
          style={{ gridColumn: "1 / 2" }}
        />
        <span
          className="bg-[var(--ra-magenta)] shadow-[0_0_18px_rgba(255,43,214,0.72)] transition-[width] duration-300"
          style={{ gridColumn: "2 / 3" }}
        />
      </div>
    </section>
  );
}

export function ArenaActionBar({
  state,
  onInterrupt,
  onMarkData,
  onMarkFactCheck,
  onMarkCommonGround,
}: {
  state: ArenaVisualState;
  onInterrupt: () => void;
  onMarkData: () => void;
  onMarkFactCheck: () => void;
  onMarkCommonGround: () => void;
}) {
  const interruptActive = state === "ai_speaking" || state === "ai_thinking";

  return (
    <section className="ra-hud-panel grid grid-cols-2 gap-2 rounded-[var(--ra-radius-xl)] border border-[rgba(255,255,255,0.14)] bg-[rgba(2,8,23,0.78)] p-2 shadow-[var(--ra-shadow-card)] md:flex md:overflow-x-visible">
      <ArenaActionButton
        icon={Pause}
        label="Interupsi"
        tone={interruptActive ? "coral" : "neutral"}
        onClick={onInterrupt}
      />
      <ArenaActionButton
        icon={BarChart3}
        label="Kartu Data"
        tone="cyan"
        onClick={onMarkData}
      />
      <ArenaActionButton
        icon={SearchCheck}
        label="Cek Fakta"
        tone="amber"
        onClick={onMarkFactCheck}
      />
      <ArenaActionButton
        icon={Hand}
        label="Titik Temu"
        tone="emerald"
        onClick={onMarkCommonGround}
      />
    </section>
  );
}

function ArenaActionButton({
  icon: Icon,
  label,
  tone,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  tone: "neutral" | "cyan" | "coral" | "amber" | "emerald";
  onClick: () => void;
}) {
  const toneClasses = {
    neutral: "border-[var(--ra-border-default)] text-[var(--ra-text-secondary)] hover:bg-[var(--ra-bg-panel)]",
    cyan: "border-[var(--ra-electric-cyan)] text-[var(--ra-electric-cyan)] hover:bg-[var(--ra-electric-cyan-soft)]",
    coral: "border-[var(--ra-magenta)] text-[var(--ra-magenta-bright)] hover:bg-[var(--ra-magenta-soft)]",
    amber: "border-[var(--ra-amber)] text-[var(--ra-amber)] hover:bg-[var(--ra-amber-soft)]",
    emerald: "border-[var(--ra-emerald)] text-[var(--ra-emerald)] hover:bg-[var(--ra-emerald-soft)]",
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 w-full min-w-0 items-center justify-center gap-2 rounded-[var(--ra-radius-md)] border bg-[var(--ra-bg-panel)] px-3 text-sm font-semibold transition active:translate-y-px md:w-auto md:shrink-0 md:px-4",
        toneClasses,
      )}
    >
      <Icon size={16} aria-hidden="true" />
      {label}
    </button>
  );
}

export function VoiceWaveform({
  tone,
  className,
}: {
  tone: "user" | "ai";
  className?: string;
}) {
  return (
    <div className={cn("flex h-12 items-center justify-center gap-1.5", className)}>
      {waveformBars.map((height, index) => (
        <span
          key={`${height}-${index}`}
          className={cn(
            "w-2 rounded-[var(--ra-radius-pill)]",
            tone === "user" ? "bg-[var(--ra-electric-cyan)]" : "bg-[var(--ra-magenta)]",
          )}
          style={{
            height: `${height}%`,
            animation: "ra-halo-pulse 1.2s ease-in-out infinite",
            animationDelay: `${index * 45}ms`,
          }}
        />
      ))}
    </div>
  );
}

export function RoundTransitionCard({
  round,
  state,
}: {
  round: RoundId;
  state: ArenaVisualState;
}) {
  const meta = getArenaStateMeta(state);

  return (
    <div className="rounded-[var(--ra-radius-xl)] border border-[var(--ra-gold)] bg-[var(--ra-gold-soft)] p-4 shadow-[var(--ra-glow-gold)]">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--ra-radius-md)] border border-[var(--ra-gold)] text-[var(--ra-gold-bright)]">
          {state === "complete" ? (
            <CheckCircle2 size={18} aria-hidden="true" />
          ) : state === "judging" ? (
            <Sparkles size={18} aria-hidden="true" />
          ) : (
            <Flag size={18} aria-hidden="true" />
          )}
        </span>
        <div>
          <p className="text-sm font-semibold text-[var(--ra-gold-bright)]">
            {roundLabels[round]}
          </p>
          <p className="mt-1 text-sm leading-6 text-[var(--ra-text-secondary)]">
            {meta.copy}
          </p>
        </div>
      </div>
    </div>
  );
}

export function MockArenaStateControls({
  value,
  onChange,
}: {
  value: ArenaVisualState;
  onChange: (value: ArenaVisualState) => void;
}) {
  const states: ArenaVisualState[] = [
    "ready",
    "user_speaking",
    "ai_thinking",
    "ai_speaking",
    "recoverable_error",
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {states.map((state) => (
        <Chip
          key={state}
          selected={value === state}
          tone={value === state ? "cyan" : "neutral"}
          onClick={() => onChange(state)}
        >
          <Zap size={14} aria-hidden="true" />
          {getArenaStateMeta(state).label}
        </Chip>
      ))}
    </div>
  );
}

export function ArenaPrimaryAction({
  state,
  onRetry,
  onJudge,
}: {
  state: ArenaVisualState;
  onRetry?: () => void;
  onJudge?: () => void;
}) {
  if (state === "recoverable_error" && onRetry) {
    return (
      <Button
        variant="outline"
        className="w-full"
        leadingIcon={<AlertTriangle size={17} aria-hidden="true" />}
        onClick={onRetry}
      >
        Coba Lagi
      </Button>
    );
  }

  if (state === "complete" && onJudge) {
    return (
      <Button variant="prestige" className="w-full" onClick={onJudge}>
        Minta Penilaian
      </Button>
    );
  }

  return null;
}
