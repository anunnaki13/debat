// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./page";
import { SESSIONS_STORAGE_KEY } from "@/lib/storage/localSessions";

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

describe("Home setup flow", () => {
  beforeEach(() => {
    pushMock.mockClear();
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("starts a debate session from the setup button without user-facing AI config", () => {
    render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: /^Mulai Debat$/i }));

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock.mock.calls[0][0]).toMatch(/^\/debate\/debate-/);

    const sessions = JSON.parse(
      window.localStorage.getItem(SESSIONS_STORAGE_KEY) ?? "[]",
    ) as Array<{ status: string; userSide: string; opponentSide: string }>;

    expect(sessions).toHaveLength(1);
    expect(sessions[0]).toMatchObject({
      status: "IN_PROGRESS",
      userSide: "PRO",
      opponentSide: "CONTRA",
    });
  });

  it("hides API config, fake metrics, and future monetization clutter from the lobby", () => {
    render(<Home />);

    expect(
      screen.queryByLabelText("OpenRouter API Key"),
    ).not.toBeInTheDocument();
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

  it("routes voice mode through device check before the debate arena", () => {
    render(<Home />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /VoiceGunakan mikrofon/i,
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: /^Mulai Debat$/i }));

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock.mock.calls[0][0]).toContain("/debate/device-check");
    expect(pushMock.mock.calls[0][0]).toContain("input=VOICE");
  });

  it("uses a custom topic for the created debate session", async () => {
    render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: /Buat Topik Privat/i }));
    fireEvent.change(await screen.findByLabelText(/Tesis utama/i), {
      target: {
        value:
          "Klub sepak bola lokal sebaiknya membatasi transfer mahal dan fokus ke akademi muda",
      },
    });
    fireEvent.click(screen.getByRole("button", { name: /Gunakan Langsung/i }));
    fireEvent.click(screen.getByRole("button", { name: /^Mulai Debat$/i }));

    const sessions = JSON.parse(
      window.localStorage.getItem(SESSIONS_STORAGE_KEY) ?? "[]",
    ) as Array<{ topic: { custom?: boolean; title: string } }>;

    expect(sessions[0].topic.custom).toBe(true);
    expect(sessions[0].topic.title).toMatch(/akademi muda/i);
  }, 10_000);
});
