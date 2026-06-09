import { z } from "zod";
import type { JudgeReport } from "@/types/debate";

const scoreDetailSchema = z.object({
  score: z.number().int().min(0).max(100),
  explanation: z.string().min(1).max(1000),
});

export const judgeReportSchema = z.object({
  summary: z.string().min(1).max(1600),
  strongestPoint: z.string().min(1).max(1000),
  biggestImprovementArea: z.string().min(1).max(1000),
  scores: z.object({
    speakByData: scoreDetailSchema,
    structure: scoreDetailSchema,
    logic: scoreDetailSchema,
    rebuttal: scoreDetailSchema,
    integrity: scoreDetailSchema,
  }),
  strengths: z.array(z.string().min(1).max(400)).min(1).max(4),
  improvements: z.array(z.string().min(1).max(400)).min(1).max(4),
  recommendedExercise: z.string().min(1).max(1000),
  playfulTitle: z.string().min(1).max(140),
  overallScore: z.number().int().min(0).max(100),
  disclaimer: z.string().min(1).max(1000),
}) satisfies z.ZodType<JudgeReport>;

export function calculateOverallScore(report: JudgeReport): number {
  const scores = Object.values(report.scores).map((detail) => detail.score);
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return Math.round(average);
}

export function normalizeJudgeReport(report: JudgeReport): JudgeReport {
  return {
    ...report,
    overallScore: calculateOverallScore(report),
  };
}
