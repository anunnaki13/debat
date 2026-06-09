import {
  Award,
  Clock,
  Dumbbell,
  Gauge,
  Lightbulb,
  Mic2,
  PauseCircle,
  RadioTower,
  Repeat,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Volume2,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";
import { ScoreBar } from "@/components/judge/ScoreBar";
import { Badge } from "@/components/ui";
import type { DeliveryReport, JudgeReport } from "@/types/debate";

const scoreLabels = {
  speakByData: "Speak by Data",
  structure: "Structure",
  logic: "Logic",
  rebuttal: "Rebuttal",
  integrity: "Integrity",
} as const;

export function JudgeReportPanel({
  report,
  deliveryReport,
}: {
  report: JudgeReport;
  deliveryReport?: DeliveryReport;
}) {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[var(--ra-radius-xl)] border border-[rgba(21,248,255,0.28)] bg-[rgba(2,8,23,0.84)] p-5 shadow-[var(--ra-shadow-elevated)] md:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(21,248,255,0.16),transparent_34%),radial-gradient(circle_at_88%_0%,rgba(255,43,214,0.13),transparent_34%)]" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <Badge tone="prestige" className="gap-2">
              <Sparkles size={14} aria-hidden="true" />
              AI Judge Report
            </Badge>
            <h2 className="mt-3 font-serif text-3xl font-black leading-tight text-[var(--ra-text-primary)]">
              {report.playfulTitle}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--ra-text-secondary)]">
              {report.summary}
            </p>
          </div>
          <div className="grid h-32 w-32 shrink-0 place-items-center rounded-[var(--ra-radius-xl)] border border-[var(--ra-electric-cyan)] bg-[var(--ra-electric-cyan-soft)] text-center shadow-[var(--ra-glow-esports-cyan)]">
            <div>
              <p className="text-5xl font-black leading-none text-[var(--ra-electric-cyan)]">
                {report.overallScore}
              </p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--ra-text-secondary)]">
                Overall
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        {Object.entries(report.scores).map(([key, detail]) => (
          <ScoreBar
            key={key}
            label={scoreLabels[key as keyof typeof scoreLabels]}
            score={detail.score}
            explanation={detail.explanation}
          />
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <InsightCard
          icon={Award}
          title="Strongest Point"
          tone="emerald"
          body={report.strongestPoint}
        />
        <InsightCard
          icon={TrendingUp}
          title="Biggest Improvement Area"
          tone="amber"
          body={report.biggestImprovementArea}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <ListCard
          icon={Lightbulb}
          title="Strengths"
          tone="cyan"
          items={report.strengths}
        />
        <ListCard
          icon={WandSparkles}
          title="Improvements"
          tone="coral"
          items={report.improvements}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
        <section className="rounded-[var(--ra-radius-xl)] border border-[var(--ra-gold)] bg-[var(--ra-gold-soft)] p-5 shadow-[var(--ra-glow-gold)]">
          <div className="flex items-center gap-2 text-[var(--ra-gold-bright)]">
            <Dumbbell size={18} aria-hidden="true" />
            <h2 className="text-base font-black uppercase tracking-wide">
              Recommended Exercise
            </h2>
          </div>
          <p className="mt-3 text-sm leading-7 text-[var(--ra-text-primary)]">
            {report.recommendedExercise}
          </p>
        </section>

        <DeliveryCoachPanel deliveryReport={deliveryReport} />
      </section>

      <p className="rounded-[var(--ra-radius-lg)] border border-[rgba(255,255,255,0.10)] bg-[rgba(5,12,28,0.74)] p-4 text-sm leading-6 text-[var(--ra-text-muted)]">
        {report.disclaimer}
      </p>
    </div>
  );
}

function InsightCard({
  icon: Icon,
  title,
  tone,
  body,
}: {
  icon: LucideIcon;
  title: string;
  tone: "emerald" | "amber";
  body: string;
}) {
  const toneClasses = {
    emerald:
      "border-[var(--ra-emerald)] bg-[var(--ra-emerald-soft)] text-[var(--ra-emerald)]",
    amber:
      "border-[var(--ra-amber)] bg-[var(--ra-amber-soft)] text-[var(--ra-amber)]",
  }[tone];

  return (
    <div className="rounded-[var(--ra-radius-xl)] border border-[rgba(255,255,255,0.12)] bg-[rgba(5,12,28,0.82)] p-5 shadow-[var(--ra-shadow-card)]">
      <div className="flex items-center gap-3">
        <span
          className={`grid h-10 w-10 place-items-center rounded-[var(--ra-radius-md)] border ${toneClasses}`}
        >
          <Icon size={18} aria-hidden="true" />
        </span>
        <h2 className="text-base font-black uppercase tracking-wide text-[var(--ra-text-primary)]">
          {title}
        </h2>
      </div>
      <p className="mt-4 text-sm leading-7 text-[var(--ra-text-secondary)]">
        {body}
      </p>
    </div>
  );
}

function ListCard({
  icon: Icon,
  title,
  tone,
  items,
}: {
  icon: LucideIcon;
  title: string;
  tone: "cyan" | "coral";
  items: string[];
}) {
  const toneClasses = {
    cyan:
      "border-[var(--ra-electric-cyan)] bg-[var(--ra-electric-cyan-soft)] text-[var(--ra-electric-cyan)]",
    coral:
      "border-[var(--ra-coral)] bg-[var(--ra-coral-soft)] text-[var(--ra-coral-bright)]",
  }[tone];

  return (
    <div className="rounded-[var(--ra-radius-xl)] border border-[rgba(255,255,255,0.12)] bg-[rgba(5,12,28,0.82)] p-5 shadow-[var(--ra-shadow-card)]">
      <div className="flex items-center gap-3">
        <span
          className={`grid h-10 w-10 place-items-center rounded-[var(--ra-radius-md)] border ${toneClasses}`}
        >
          <Icon size={18} aria-hidden="true" />
        </span>
        <h2 className="text-base font-black uppercase tracking-wide text-[var(--ra-text-primary)]">
          {title}
        </h2>
      </div>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--ra-text-secondary)]">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-[var(--ra-radius-pill)] bg-current" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DeliveryCoachPanel({
  deliveryReport,
}: {
  deliveryReport?: DeliveryReport;
}) {
  if (!deliveryReport) {
    return (
      <section className="rounded-[var(--ra-radius-xl)] border border-[rgba(123,93,255,0.28)] bg-[rgba(8,10,26,0.84)] p-5 shadow-[var(--ra-shadow-card)]">
        <div className="flex items-center gap-2 text-[var(--ra-violet)]">
          <RadioTower size={18} aria-hidden="true" />
          <h2 className="text-base font-black uppercase tracking-wide">
            Delivery Coach
          </h2>
        </div>
        <p className="mt-3 text-sm leading-7 text-[var(--ra-text-secondary)]">
          Aktifkan mode voice untuk melihat metrik tempo, jeda, filler, dan stabilitas suara.
        </p>
        <p className="mt-4 rounded-[var(--ra-radius-md)] border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.045)] p-3 text-xs leading-5 text-[var(--ra-text-muted)]">
          Delivery Coach tidak menilai emosi. Panel ini hanya membaca sinyal teknis dari pola bicara.
        </p>
      </section>
    );
  }

  const signals = deliveryReport.signals;
  const metrics = [
    {
      label: "Tempo",
      value: `${signals.wordsPerMinute} WPM`,
      detail: "Kata per menit",
      icon: Gauge,
    },
    {
      label: "Jeda",
      value: `${Math.round(signals.pauseRatio * 100)}%`,
      detail: "Rasio hening",
      icon: PauseCircle,
    },
    {
      label: "Filler",
      value: `${signals.fillerWordCount}`,
      detail: "Kata pengisi",
      icon: Mic2,
    },
    {
      label: "Latensi",
      value: `${Math.round(signals.responseLatencyMs / 100) / 10}s`,
      detail: "Respons awal",
      icon: Clock,
    },
    {
      label: "Volume",
      value: `${Math.round(signals.volumeStability * 100)}%`,
      detail: "Stabilitas",
      icon: Volume2,
    },
    {
      label: "Interupsi",
      value: `${signals.interruptionCount}`,
      detail: "Pemotongan AI",
      icon: Repeat,
    },
  ] as const;

  return (
    <section className="rounded-[var(--ra-radius-xl)] border border-[rgba(123,93,255,0.28)] bg-[rgba(8,10,26,0.84)] p-5 shadow-[var(--ra-shadow-card)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[var(--ra-violet)]">
          <RadioTower size={18} aria-hidden="true" />
          <h2 className="text-base font-black uppercase tracking-wide">
            Delivery Coach
          </h2>
        </div>
        <Badge tone="special">Voice</Badge>
      </div>
      <p className="mt-3 text-sm leading-7 text-[var(--ra-text-secondary)]">
        {deliveryReport.summary}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="rounded-[var(--ra-radius-md)] border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.045)] p-3"
            >
              <div className="flex items-center gap-2 text-[var(--ra-violet)]">
                <Icon size={15} aria-hidden="true" />
                <p className="text-[11px] font-black uppercase tracking-wide">
                  {metric.label}
                </p>
              </div>
              <p className="mt-2 text-lg font-black text-[var(--ra-text-primary)]">
                {metric.value}
              </p>
              <p className="text-[11px] font-semibold text-[var(--ra-text-muted)]">
                {metric.detail}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-[var(--ra-radius-md)] border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.045)] p-3">
        <div className="flex items-center gap-2 text-[var(--ra-emerald)]">
          <ShieldCheck size={16} aria-hidden="true" />
          <p className="text-xs font-black uppercase tracking-wide">
            Latihan Berikutnya
          </p>
        </div>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--ra-text-secondary)]">
          {deliveryReport.suggestions.map((suggestion) => (
            <li key={suggestion} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-[var(--ra-radius-pill)] bg-[var(--ra-emerald)]" />
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-3 text-xs leading-5 text-[var(--ra-text-muted)]">
        {deliveryReport.disclaimer}
      </p>
    </section>
  );
}
