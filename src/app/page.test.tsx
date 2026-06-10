// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEBATE_FLOW_DRAFT_STORAGE_KEY } from "@/lib/flow/debateFlowDraft";
import { SESSIONS_STORAGE_KEY } from "@/lib/storage/localSessions";
import type { DebateSession } from "@/types/debate";
import Home from "./page";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  usePathname: () => "/",
}));

vi.mock("next/image", () => ({
  default: () => null,
}));

function makeSession(overrides: Partial<DebateSession> = {}): DebateSession {
  return {
    id: "session-latest",
    version: 1,
    mode: "DUEL_WACANA_AI",
    inputMode: "TEXT",
    topic: {
      id: "ai-jobs",
      title:
        "Apakah AI akan lebih banyak menciptakan pekerjaan baru daripada menggantikan pekerjaan manusia?",
      category: "Teknologi & Pekerjaan",
      difficulty: "menengah",
      shortContext: "Bahas dampak otomatisasi dan reskilling.",
      spiceLevel: 3,
    },
    userSide: "PRO",
    opponentSide: "CONTRA",
    startedAt: "2026-06-09T10:00:00.000Z",
    completedAt: "2026-06-09T10:20:00.000Z",
    status: "COMPLETED",
    currentRound: "CLOSING",
    messages: [],
    report: {
      summary: "Debat selesai.",
      strongestPoint: "Klaim utama jelas.",
      biggestImprovementArea: "Tambahkan data pembanding yang lebih spesifik.",
      scores: {
        speakByData: { score: 70, explanation: "Cukup." },
        structure: { score: 75, explanation: "Rapi." },
        logic: { score: 72, explanation: "Masuk akal." },
        rebuttal: { score: 68, explanation: "Perlu tajam." },
        integrity: { score: 80, explanation: "Fair." },
      },
      strengths: ["Struktur jelas"],
      improvements: ["Tambah data"],
      recommendedExercise: "Latih satu sanggahan berbasis data sebelum ronde kedua.",
      playfulTitle: "Orator Data",
      overallScore: 73,
      disclaimer: "Evaluasi AI.",
    },
    ...overrides,
  };
}

describe("Home lobby reconstruction", () => {
  beforeEach(() => {
    pushMock.mockClear();
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("routes the primary CTA to the play flow and seeds a safe text draft", () => {
    render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: /^Mulai Debat AI$/i }));

    const draft = JSON.parse(
      window.localStorage.getItem(DEBATE_FLOW_DRAFT_STORAGE_KEY) ?? "{}",
    ) as { mode?: string; inputMode?: string };

    expect(draft).toMatchObject({
      mode: "DUEL_WACANA_AI",
      inputMode: "TEXT",
    });
    expect(pushMock).toHaveBeenCalledWith("/play");
  });

  it("shows two active mode entries and routes private topic mode correctly", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: /Duel Wacana AI/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Topik Privat/i })).toBeInTheDocument();
    expect(screen.queryByText(/Kursi Panas/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Topik Privat/i }));

    const draft = JSON.parse(
      window.localStorage.getItem(DEBATE_FLOW_DRAFT_STORAGE_KEY) ?? "{}",
    ) as { mode?: string; inputMode?: string };

    expect(draft).toMatchObject({
      mode: "PRIVATE_OPINION",
      inputMode: "TEXT",
    });
    expect(pushMock).toHaveBeenCalledWith("/topics/new");
  });

  it("lets a recommended topic prefill the topic route draft", () => {
    render(<Home />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /Apakah transaksi non-tunai sebaiknya menjadi pilihan utama/i,
      }),
    );

    const draft = JSON.parse(
      window.localStorage.getItem(DEBATE_FLOW_DRAFT_STORAGE_KEY) ?? "{}",
    ) as { topic?: { id?: string }; mode?: string; sideSelection?: string };

    expect(draft).toMatchObject({
      mode: "DUEL_WACANA_AI",
      sideSelection: "RANDOM",
      topic: { id: "cashless" },
    });
    expect(pushMock).toHaveBeenCalledWith("/topics");
  });

  it("renders the latest real local history when present", async () => {
    window.localStorage.setItem(
      SESSIONS_STORAGE_KEY,
      JSON.stringify([makeSession()]),
    );

    render(<Home />);

    expect(await screen.findByText(/Selamat datang kembali/i)).toBeInTheDocument();
    expect(screen.getByText(/Riwayat terakhir/i)).toBeInTheDocument();
    expect(screen.getByText(/Tambahkan data pembanding/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Buka sesi/i })).toHaveAttribute(
      "href",
      "/results/session-latest",
    );
    expect(screen.getByRole("link", { name: /Coach/i })).toHaveAttribute(
      "href",
      "/results/session-latest/coach",
    );
  });

  it("hides API config, fake metrics, and future monetization clutter from the lobby", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/Belum ada sesi lokal/i)).toBeInTheDocument();
    });

    expect(screen.queryByLabelText("OpenRouter API Key")).not.toBeInTheDocument();
    expect(screen.queryByText(/Model lawan/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Tes OpenRouter/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Premium Club/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Live Arena Feed/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Karir Politik/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Profil Ideologi/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Arena Politika/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/menunggu/i)).not.toBeInTheDocument();
  });
});
