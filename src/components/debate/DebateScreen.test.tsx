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
