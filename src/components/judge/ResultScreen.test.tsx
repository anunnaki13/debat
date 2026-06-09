// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { debateTopics } from "@/data/topics";
import { createDebateSession } from "@/lib/debate/session";
import { upsertLocalSession } from "@/lib/storage/localSessions";
import type { DebateSession, JudgeReport } from "@/types/debate";
import { ResultScreen } from "./ResultScreen";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => "/result/test-result",
}));

vi.mock("next/image", () => ({
  default: () => null,
}));

const report: JudgeReport = {
  playfulTitle: "Orator Data Naik Level",
  summary:
    "Argumen sudah punya struktur jelas dan mulai memakai data sebagai fondasi.",
  strongestPoint: "Pembukaan langsung menyatakan tesis dan batas bahasan.",
  biggestImprovementArea: "Rebuttal perlu membandingkan dampak jangka pendek dan panjang.",
  strengths: [
    "Tesis mudah dipahami.",
    "Contoh relevan dengan topik.",
  ],
  improvements: [
    "Tambahkan angka pembanding.",
    "Akhiri dengan sintesis yang lebih tegas.",
  ],
  recommendedExercise: "Latih rebuttal 60 detik dengan satu data dan satu analogi.",
  overallScore: 84,
  disclaimer: "Penilaian AI adalah alat latihan, bukan keputusan mutlak.",
  scores: {
    speakByData: {
      score: 82,
      explanation: "Sudah mengarah ke data, tetapi bukti kuantitatif masih bisa ditambah.",
    },
    structure: {
      score: 88,
      explanation: "Alur pembukaan, alasan, dan penutup mudah diikuti.",
    },
    logic: {
      score: 84,
      explanation: "Kausalitas cukup jelas.",
    },
    rebuttal: {
      score: 78,
      explanation: "Bantahan perlu lebih tajam pada asumsi lawan.",
    },
    integrity: {
      score: 90,
      explanation: "Tidak menyerang pribadi dan menjaga batas klaim.",
    },
  },
};

function createCompletedSession(): DebateSession {
  return {
    ...createDebateSession(debateTopics[0], "PRO", {
      inputMode: "VOICE",
    }),
    id: "test-result",
    status: "COMPLETED",
    completedAt: "2026-06-09T10:00:00.000Z",
    report,
    deliveryReport: {
      summary: "Sinyal penyampaian dihitung dari pola teknis bicara, bukan emosi.",
      disclaimer:
        "Sinyal penyampaian adalah estimasi teknis dari pola bicara, bukan diagnosis emosi.",
      suggestions: ["Pertahankan tempo dan beri jeda sebelum data utama."],
      signals: {
        durationMs: 92_000,
        wordsPerMinute: 128,
        pauseRatio: 0.18,
        fillerWordCount: 1,
        responseLatencyMs: 1_400,
        volumeStability: 0.86,
        interruptionCount: 2,
      },
    },
    messages: [
      {
        id: "message-user",
        speaker: "USER",
        round: "OPENING",
        content: "AI dapat menciptakan pekerjaan baru jika reskilling berjalan.",
        createdAt: "2026-06-09T09:55:00.000Z",
      },
      {
        id: "message-opponent",
        speaker: "OPPONENT",
        round: "OPENING",
        content: "Tanpa kebijakan transisi, otomatisasi tetap berisiko.",
        createdAt: "2026-06-09T09:56:00.000Z",
      },
    ],
  };
}

describe("ResultScreen", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders arena result reveal, grade, delivery coach, and transcript", async () => {
    const session = createCompletedSession();
    upsertLocalSession(session);

    render(<ResultScreen sessionId={session.id} />);

    expect(await screen.findByText("Result Reveal")).toBeInTheDocument();
    expect(screen.getByText("Kandidat Kuat")).toBeInTheDocument();
    expect(screen.getAllByText("84").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Delivery Coach").length).toBeGreaterThan(0);
    expect(screen.getByText("128 WPM")).toBeInTheDocument();
    expect(screen.getByText("Transcript Arena")).toBeInTheDocument();
  });
});
