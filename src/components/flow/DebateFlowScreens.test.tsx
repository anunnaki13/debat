// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { debateTopics } from "@/data/topics";
import {
  DEBATE_FLOW_DRAFT_STORAGE_KEY,
  saveDebateFlowDraft,
} from "@/lib/flow/debateFlowDraft";
import { SESSIONS_STORAGE_KEY } from "@/lib/storage/localSessions";
import { CustomTopicRouteScreen } from "./CustomTopicRouteScreen";
import { PlaySetupScreen } from "./PlaySetupScreen";
import { TopicRouteScreen } from "./TopicRouteScreen";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  usePathname: () => "/play",
}));

vi.mock("next/image", () => ({
  default: () => null,
}));

describe("route-based debate flow", () => {
  beforeEach(() => {
    pushMock.mockClear();
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("persists play choices and continues to topics", () => {
    render(<PlaySetupScreen />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /VoiceGunakan mikrofon/i,
      }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Lanjut Pilih Topik/i }),
    );

    const draft = JSON.parse(
      window.localStorage.getItem(DEBATE_FLOW_DRAFT_STORAGE_KEY) ?? "{}",
    ) as { inputMode?: string; mode?: string };

    expect(draft).toMatchObject({
      inputMode: "VOICE",
      mode: "DUEL_WACANA_AI",
    });
    expect(pushMock).toHaveBeenCalledWith("/topics");
  });

  it("creates a session from the topic route draft and routes voice mode through device check", () => {
    saveDebateFlowDraft({
      inputMode: "VOICE",
      mode: "DUEL_WACANA_AI",
      sideSelection: "CONTRA",
      topic: debateTopics[1],
    });

    render(<TopicRouteScreen />);

    fireEvent.click(
      screen.getByRole("button", { name: /Lanjut Device Check/i }),
    );

    const sessions = JSON.parse(
      window.localStorage.getItem(SESSIONS_STORAGE_KEY) ?? "[]",
    ) as Array<{
      inputMode: string;
      userSide: string;
      opponentSide: string;
      topic: { id: string };
    }>;

    expect(sessions[0]).toMatchObject({
      inputMode: "VOICE",
      userSide: "CONTRA",
      opponentSide: "PRO",
      topic: { id: debateTopics[1].id },
    });
    expect(pushMock.mock.calls[0][0]).toContain("/device-check");
    expect(pushMock.mock.calls[0][0]).toContain("input=VOICE");
  });

  it("stores custom topics in the route draft before returning to topics", async () => {
    render(<CustomTopicRouteScreen />);

    fireEvent.change(await screen.findByLabelText(/Tesis utama/i), {
      target: {
        value:
          "Klub sepak bola lokal sebaiknya membatasi transfer mahal dan fokus ke akademi muda",
      },
    });
    fireEvent.click(screen.getByRole("button", { name: /Gunakan Langsung/i }));

    const draft = JSON.parse(
      window.localStorage.getItem(DEBATE_FLOW_DRAFT_STORAGE_KEY) ?? "{}",
    ) as { topic?: { custom?: boolean; title?: string }; mode?: string };

    expect(draft.topic?.custom).toBe(true);
    expect(draft.topic?.title).toMatch(/akademi muda/i);
    expect(draft.mode).toBe("PRIVATE_OPINION");
    expect(pushMock).toHaveBeenCalledWith("/topics");
  });

  it("offers a safe fallback when a custom topic is sensitive", async () => {
    render(<CustomTopicRouteScreen />);

    fireEvent.change(await screen.findByLabelText(/Tesis utama/i), {
      target: {
        value:
          "Pemilu dan partai tertentu sebaiknya dilarang tampil di media sosial",
      },
    });

    expect(screen.getByText(/Fallback aman tersedia/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Gunakan Langsung/i })).toBeDisabled();

    fireEvent.click(
      screen.getByRole("button", { name: /Gunakan Fallback Aman/i }),
    );
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Gunakan Langsung/i })).toBeEnabled();
    });
    fireEvent.click(screen.getByRole("button", { name: /Gunakan Langsung/i }));

    const draft = JSON.parse(
      window.localStorage.getItem(DEBATE_FLOW_DRAFT_STORAGE_KEY) ?? "{}",
    ) as { topic?: { custom?: boolean; title?: string; category?: string } };

    expect(draft.topic?.custom).toBe(true);
    expect(draft.topic?.category).toBe("Isu Publik Ringan");
    expect(draft.topic?.title).toMatch(/diskusi sehat|engagement/i);
    expect(draft.topic?.title).not.toMatch(/pemilu|partai/i);
    expect(pushMock).toHaveBeenCalledWith("/topics");
  });

  it("uses the refiner route to store a refined custom topic", async () => {
    render(<CustomTopicRouteScreen refined />);

    fireEvent.change(await screen.findByLabelText(/Tesis utama/i), {
      target: {
        value: "Sekolah sebaiknya membatasi penggunaan gawai pribadi",
      },
    });
    fireEvent.change(screen.getByLabelText(/Konteks opsional/i), {
      target: {
        value: "Fokus untuk siswa SMP dan jam belajar utama",
      },
    });
    fireEvent.click(screen.getByRole("button", { name: /Rapikan Topik/i }));

    expect(screen.getByText(/Versi yang Disarankan/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Gunakan Versi AI/i }));

    const draft = JSON.parse(
      window.localStorage.getItem(DEBATE_FLOW_DRAFT_STORAGE_KEY) ?? "{}",
    ) as { topic?: { custom?: boolean; title?: string }; mode?: string };

    expect(draft.mode).toBe("PRIVATE_OPINION");
    expect(draft.topic?.custom).toBe(true);
    expect(draft.topic?.title).toContain("Fokus pada kategori");
    expect(pushMock).toHaveBeenCalledWith("/topics");
  });

  it("filters the topic grid by search and difficulty", () => {
    render(<TopicRouteScreen />);

    fireEvent.change(screen.getByLabelText(/Cari topik/i), {
      target: { value: "perpustakaan" },
    });

    expect(screen.getByText(/perpustakaan publik/i)).toBeInTheDocument();
    expect(screen.queryByText(/kendaraan listrik/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^lanjutan$/i }));

    expect(screen.getByText(/Topik tidak ditemukan/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Reset Filter/i }));

    expect(screen.getByText(/kendaraan listrik/i)).toBeInTheDocument();
  });
});
