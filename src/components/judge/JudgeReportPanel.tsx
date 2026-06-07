import { Award, Dumbbell, Lightbulb, TrendingUp } from "lucide-react";
import { ScoreBar } from "@/components/judge/ScoreBar";
import type { JudgeReport } from "@/types/debate";

const scoreLabels = {
  speakByData: "Speak by Data",
  structure: "Structure",
  logic: "Logic",
  rebuttal: "Rebuttal",
  integrity: "Integrity",
} as const;

export function JudgeReportPanel({ report }: { report: JudgeReport }) {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-cyan-300/25 bg-cyan-300/10 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-cyan-100">AI Judge Report</p>
            <h1 className="mt-2 text-3xl font-black text-white">
              {report.playfulTitle}
            </h1>
          </div>
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-lg border border-cyan-300/30 bg-slate-950/75 text-4xl font-black text-cyan-100">
            {report.overallScore}
          </div>
        </div>
        <p className="mt-5 text-base leading-8 text-slate-100">{report.summary}</p>
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
        <div className="rounded-lg border border-white/10 bg-slate-950/75 p-5">
          <div className="flex items-center gap-2 text-emerald-100">
            <Award size={18} aria-hidden="true" />
            <h2 className="text-base font-semibold">Strongest Point</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {report.strongestPoint}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-slate-950/75 p-5">
          <div className="flex items-center gap-2 text-amber-100">
            <TrendingUp size={18} aria-hidden="true" />
            <h2 className="text-base font-semibold">Biggest Improvement Area</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {report.biggestImprovementArea}
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-slate-950/75 p-5">
          <div className="flex items-center gap-2 text-cyan-100">
            <Lightbulb size={18} aria-hidden="true" />
            <h2 className="text-base font-semibold">Strengths</h2>
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
            {report.strengths.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-white/10 bg-slate-950/75 p-5">
          <div className="flex items-center gap-2 text-red-100">
            <TrendingUp size={18} aria-hidden="true" />
            <h2 className="text-base font-semibold">Improvements</h2>
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
            {report.improvements.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-lg border border-amber-300/25 bg-amber-300/10 p-5">
        <div className="flex items-center gap-2 text-amber-100">
          <Dumbbell size={18} aria-hidden="true" />
          <h2 className="text-base font-semibold">Recommended Exercise</h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-100">
          {report.recommendedExercise}
        </p>
      </section>

      <p className="rounded-lg border border-white/10 bg-slate-950/75 p-4 text-sm leading-6 text-slate-400">
        {report.disclaimer}
      </p>
    </div>
  );
}
