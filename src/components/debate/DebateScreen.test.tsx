// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { debateTopics } from "@/data/topics";
import { createDebateSession } from "@/lib/debate/session";
import {
  DEFAULT_PREFERENCES,
  SESSIONS_STORAGE_KEY,
  savePreferences,
  upsertLocalSession,
} from "@/lib/storage/localSessions";
import type { DebateMessage, DebateSession, JudgeReport, RoundId } from "@/types/debate";
import { DebateScreen } from "./DebateScreen";

const pushMock = vi.fn();

class MockSpeechSynthesisUtterance {
  lang = "";
  rate = 1;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(public text: string) {}
}

const judgeReport: JudgeReport = {
  playfulTitle: "Orator Data Naik Level",
  summary: "Argumen sudah runtut dan siap diberi latihan lanjutan.",
  strongestPoint: "Tesis utama konsisten di setiap ronde.",
  biggestImprovementArea: "Perlu menambah data pembanding yang lebih konkret.",
  strengths: ["Struktur jelas", "Nada debat tetap sportif"],
  improvements: ["Tambahkan angka pembanding", "Tajamkan rebuttal"],
  recommendedExercise: "Latih rebuttal 60 detik dengan satu data utama.",
  overallScore: 84,
  disclaimer: "Penilaian AI adalah alat latihan, bukan keputusan mutlak.",
  scores: {
    speakByData: {
      score: 82,
      explanation: "Ada contoh, tetapi data kuantitatif masih bisa ditambah.",
    },
    structure: {
      score: 88,
      explanation: "Pembuka, bantahan, dan penutup mudah diikuti.",
    },
    logic: {
      score: 84,
      explanation: "Alur sebab-akibat cukup konsisten.",
    },
    rebuttal: {
      score: 78,
      explanation: "Bantahan sudah ada, tetapi belum sepenuhnya mematahkan asumsi lawan.",
    },
    integrity: {
      score: 90,
      explanation: "Tidak menyerang pribadi dan menjaga batas klaim.",
    },
  },
};

function createAwaitingJudgeSession(): DebateSession {
  const session = createDebateSession(debateTopics[0], "PRO");
  const rounds: RoundId[] = ["OPENING", "REBUTTAL", "CLOSING"];
  const messages: DebateMessage[] = rounds.flatMap((round, index) => [
    {
      id: `message_user_${round}`,
      speaker: "USER",
      round,
      content: `Argumen pengguna ronde ${index + 1}.`,
      createdAt: new Date(`2026-06-09T01:0${index}:00.000Z`).toISOString(),
      inputSource: "TEXT",
    },
    {
      id: `message_opponent_${round}`,
      speaker: "OPPONENT",
      round,
      content: `Bantahan AI ronde ${index + 1}.`,
      createdAt: new Date(`2026-06-09T01:0${index}:30.000Z`).toISOString(),
    },
  ]);

  return {
    ...session,
    id: "judge-ready-session",
    status: "AWAITING_JUDGE",
    currentRound: "CLOSING",
    messages,
  };
}

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  usePathname: () => "/debate/test-session",
}));

vi.mock("next/image", () => ({
  default: () => null,
}));

describe("DebateScreen", () => {
  beforeEach(() => {
    pushMock.mockClear();
    window.localStorage.clear();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          content: "Balasan AI yang menantang argumen pengguna.",
        }),
      ),
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("loads a local session, submits an opening argument, and advances after AI response", async () => {
    const session = createDebateSession(debateTopics[0], "PRO");
    upsertLocalSession(session);

    render(<DebateScreen sessionId={session.id} />);

    expect(await screen.findByText(session.topic.title)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Tulis argumen Anda..."), {
      target: {
        value:
          "AI sebaiknya dilihat sebagai alat produktivitas yang membuka pekerjaan baru.",
      },
    });
    fireEvent.click(screen.getByRole("button", { name: /Kirim Argumen/i }));

    expect(
      await screen.findAllByText("Balasan AI yang menantang argumen pengguna."),
    ).not.toHaveLength(0);

    await waitFor(() => {
      const sessions = JSON.parse(
        window.localStorage.getItem(SESSIONS_STORAGE_KEY) ?? "[]",
      ) as Array<{ id: string; currentRound: string; messages: unknown[] }>;
      const updatedSession = sessions.find((item) => item.id === session.id);

      expect(updatedSession?.currentRound).toBe("REBUTTAL");
      expect(updatedSession?.messages).toHaveLength(2);
    });
  });

  it("shows a streaming opponent draft before saving the final AI response", async () => {
    const session = createDebateSession(debateTopics[0], "PRO");
    const longAiResponse =
      "Balasan AI sedang dirender bertahap agar arena debat terasa live, " +
      "bukan sekadar halaman web yang memunculkan teks secara mendadak. " +
      "Argumen ini tetap kontra terhadap posisi pengguna dan mengajukan pertanyaan penutup.";
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      Response.json({ content: longAiResponse }),
    );
    upsertLocalSession(session);

    render(<DebateScreen sessionId={session.id} />);

    expect(await screen.findByText(session.topic.title)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Tulis argumen Anda..."), {
      target: {
        value: "AI perlu dibatasi agar tidak menggantikan keputusan manusia.",
      },
    });
    fireEvent.click(screen.getByRole("button", { name: /Kirim Argumen/i }));

    expect(await screen.findByText("Streaming")).toBeInTheDocument();
    expect(
      await screen.findAllByText(/AI menulis bantahan ke transcript/i),
    ).not.toHaveLength(0);

    await waitFor(
      () => {
        expect(screen.queryByText("Streaming")).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );
    expect(await screen.findAllByText(longAiResponse)).not.toHaveLength(0);
  });

  it("requests AI Judge and navigates to results when a debate is complete", async () => {
    const session = createAwaitingJudgeSession();
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      Response.json({ report: judgeReport }),
    );
    upsertLocalSession(session);

    render(<DebateScreen sessionId={session.id} />);

    expect(await screen.findByText(session.topic.title)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Minta Penilaian/i }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/debate/judge",
        expect.objectContaining({ method: "POST" }),
      );
    });
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(`/results/${session.id}`);
    });

    const sessions = JSON.parse(
      window.localStorage.getItem(SESSIONS_STORAGE_KEY) ?? "[]",
    ) as Array<{ id: string; status: string; report?: JudgeReport }>;
    const updatedSession = sessions.find((item) => item.id === session.id);

    expect(updatedSession?.status).toBe("COMPLETED");
    expect(updatedSession?.report?.overallScore).toBe(judgeReport.overallScore);
  });

  it("shows AI speech as interruptible when browser auto-speak is enabled", async () => {
    const cancelSpeech = vi.fn();
    const speak = vi.fn((utterance: MockSpeechSynthesisUtterance) => {
      utterance.onstart?.();
    });
    const session = createDebateSession(debateTopics[0], "PRO");

    vi.stubGlobal("SpeechSynthesisUtterance", MockSpeechSynthesisUtterance);
    vi.stubGlobal("speechSynthesis", {
      cancel: cancelSpeech,
      speak,
    });
    savePreferences({
      ...DEFAULT_PREFERENCES,
      autoSpeakOpponent: true,
    });
    upsertLocalSession(session);

    render(<DebateScreen sessionId={session.id} />);

    expect(await screen.findByText(session.topic.title)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Tulis argumen Anda..."), {
      target: {
        value:
          "AI bisa menciptakan pekerjaan baru kalau reskilling disiapkan sejak awal.",
      },
    });
    fireEvent.click(screen.getByRole("button", { name: /Kirim Argumen/i }));

    expect(
      await screen.findByText(/AI sedang berbicara\. Tekan Interupsi/i),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Interupsi/i }));

    expect(
      await screen.findByText(/AI dihentikan\. Silakan sampaikan interupsi/i),
    ).toBeInTheDocument();
    expect(cancelSpeech).toHaveBeenCalled();
  });
});
