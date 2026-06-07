// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { debateTopics } from "@/data/topics";
import { createDebateSession } from "@/lib/debate/session";
import {
  SESSIONS_STORAGE_KEY,
  upsertLocalSession,
} from "@/lib/storage/localSessions";
import { DebateScreen } from "./DebateScreen";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
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
      await screen.findByText("Balasan AI yang menantang argumen pengguna."),
    ).toBeInTheDocument();

    await waitFor(() => {
      const sessions = JSON.parse(
        window.localStorage.getItem(SESSIONS_STORAGE_KEY) ?? "[]",
      ) as Array<{ id: string; currentRound: string; messages: unknown[] }>;
      const updatedSession = sessions.find((item) => item.id === session.id);

      expect(updatedSession?.currentRound).toBe("REBUTTAL");
      expect(updatedSession?.messages).toHaveLength(2);
    });
  });
});
