// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./page";
import {
  PREFERENCES_STORAGE_KEY,
  SESSIONS_STORAGE_KEY,
} from "@/lib/storage/localSessions";

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
  });

  it("saves the OpenRouter key and starts a debate session from the setup button", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByLabelText("OpenRouter API Key")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("OpenRouter API Key"), {
      target: { value: "sk-or-dummy-free-router-key-123456" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Simpan & Mulai Debat/i }),
    );

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock.mock.calls[0][0]).toMatch(/^\/debate\/debate-/);

    const sessions = JSON.parse(
      window.localStorage.getItem(SESSIONS_STORAGE_KEY) ?? "[]",
    ) as Array<{ status: string; userSide: string; opponentSide: string }>;
    const preferences = JSON.parse(
      window.localStorage.getItem(PREFERENCES_STORAGE_KEY) ?? "{}",
    ) as {
      aiProvider?: string;
      openRouterApiKey?: string;
      openRouterOpponentModel?: string;
      openRouterJudgeModel?: string;
    };

    expect(sessions).toHaveLength(1);
    expect(sessions[0]).toMatchObject({
      status: "IN_PROGRESS",
      userSide: "PRO",
      opponentSide: "CONTRA",
    });
    expect(preferences).toMatchObject({
      aiProvider: "openrouter",
      openRouterApiKey: "sk-or-dummy-free-router-key-123456",
      openRouterOpponentModel: "openrouter/free",
      openRouterJudgeModel: "openrouter/free",
    });
  });

  it("does not start without an OpenRouter key", async () => {
    render(<Home />);

    fireEvent.click(
      screen.getByRole("button", { name: /Simpan & Mulai Debat/i }),
    );

    expect(pushMock).not.toHaveBeenCalled();
    expect(
      await screen.findByText("Isi OpenRouter API key dulu sebelum mulai debat."),
    ).toBeInTheDocument();
  });

  it("routes voice mode through device check before the debate arena", async () => {
    render(<Home />);

    fireEvent.change(screen.getByLabelText("OpenRouter API Key"), {
      target: { value: "sk-or-dummy-free-router-key-123456" },
    });
    fireEvent.click(
      screen.getByRole("button", {
        name: /VoiceGunakan mikrofon/i,
      }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Simpan & Mulai Debat/i }),
    );

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
    fireEvent.change(screen.getByLabelText("OpenRouter API Key"), {
      target: { value: "sk-or-dummy-free-router-key-123456" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Simpan & Mulai Debat/i }),
    );

    const sessions = JSON.parse(
      window.localStorage.getItem(SESSIONS_STORAGE_KEY) ?? "[]",
    ) as Array<{ topic: { custom?: boolean; title: string } }>;

    expect(sessions[0].topic.custom).toBe(true);
    expect(sessions[0].topic.title).toMatch(/akademi muda/i);
  }, 10_000);
});
