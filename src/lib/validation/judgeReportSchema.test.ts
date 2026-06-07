import { describe, expect, it } from "vitest";
import {
  calculateOverallScore,
  judgeReportSchema,
  normalizeJudgeReport,
} from "./judgeReportSchema";
import type { JudgeReport } from "@/types/debate";

const report: JudgeReport = {
  summary: "Ringkasan",
  strongestPoint: "Poin kuat",
  biggestImprovementArea: "Area perbaikan",
  scores: {
    speakByData: { score: 60, explanation: "Cukup" },
    structure: { score: 70, explanation: "Rapi" },
    logic: { score: 80, explanation: "Logis" },
    rebuttal: { score: 90, explanation: "Tanggap" },
    integrity: { score: 100, explanation: "Santun" },
  },
  strengths: ["Jelas"],
  improvements: ["Tambah contoh"],
  recommendedExercise: "Latih rebuttal satu menit.",
  playfulTitle: "Orator Fokus",
  overallScore: 1,
  disclaimer: "Penilaian AI.",
};

describe("judge report schema", () => {
  it("validates the judge report shape", () => {
    expect(judgeReportSchema.parse(report).summary).toBe("Ringkasan");
  });

  it("calculates and normalizes the average score", () => {
    expect(calculateOverallScore(report)).toBe(80);
    expect(normalizeJudgeReport(report).overallScore).toBe(80);
  });
});
