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
import type { DebateSession } from "@/types/debate";
import { DeviceCheckScreen } from "./DeviceCheckScreen";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  usePathname: () => "/device-check",
}));

vi.mock("@/lib/speech/speakText", () => ({
  speakText: vi.fn(),
  stopSpeaking: vi.fn(),
}));

type FakeTrack = MediaStreamTrack & {
  stop: ReturnType<typeof vi.fn>;
};

function createTrack(kind: "audio" | "video"): FakeTrack {
  return {
    kind,
    stop: vi.fn(),
  } as unknown as FakeTrack;
}

function createStream({
  audio = true,
  video = false,
}: {
  audio?: boolean;
  video?: boolean;
}) {
  const audioTracks = audio ? [createTrack("audio")] : [];
  const videoTracks = video ? [createTrack("video")] : [];
  const tracks = [...audioTracks, ...videoTracks];
  const stream = {
    getTracks: () => tracks,
    getAudioTracks: () => audioTracks,
    getVideoTracks: () => videoTracks,
  } as unknown as MediaStream;

  return { stream, audioTracks, videoTracks, tracks };
}

function createDevice(
  kind: MediaDeviceKind,
  deviceId: string,
  label: string,
): MediaDeviceInfo {
  return {
    kind,
    deviceId,
    label,
    groupId: `${deviceId}-group`,
    toJSON: () => ({}),
  } as MediaDeviceInfo;
}

function setupMediaDevices(getUserMedia = vi.fn()) {
  Object.defineProperty(window, "isSecureContext", {
    configurable: true,
    value: true,
  });
  Object.defineProperty(window.navigator, "mediaDevices", {
    configurable: true,
    value: {
      getUserMedia,
      enumerateDevices: vi.fn(async () => [
        createDevice("audioinput", "mic-1", "Studio Mic"),
        createDevice("videoinput", "cam-1", "Arena Cam"),
      ]),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
  });

  return getUserMedia;
}

function getStoredSession(session: DebateSession) {
  const sessions = JSON.parse(
    window.localStorage.getItem(SESSIONS_STORAGE_KEY) ?? "[]",
  ) as DebateSession[];

  return sessions.find((item) => item.id === session.id);
}

describe("DeviceCheckScreen", () => {
  beforeEach(() => {
    pushMock.mockClear();
    window.localStorage.clear();
    setupMediaDevices();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("does not activate camera or mic before consent and allows text-only continuation", async () => {
    const getUserMedia = setupMediaDevices();
    const session = createDebateSession(debateTopics[0], "PRO", {
      inputMode: "VOICE_CAMERA",
    });
    upsertLocalSession(session);

    render(
      <DeviceCheckScreen
        sessionId={session.id}
        requestedInputMode="VOICE_CAMERA"
      />,
    );

    expect(await screen.findByText("Persiapkan Arena")).toBeInTheDocument();
    expect(screen.getByText(/Preview kamera belum aktif/i)).toBeInTheDocument();
    expect(screen.getByText(/Catatan HTTPS/i)).toBeInTheDocument();
    expect(getUserMedia).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /Gunakan Teks/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(`/arena/${session.id}`);
    });
    expect(getStoredSession(session)?.inputMode).toBe("TEXT");
  });

  it("activates camera preview, saves voice-camera mode, and stops tracks on arena entry", async () => {
    const granted = createStream({ audio: true, video: true });
    const getUserMedia = setupMediaDevices(
      vi.fn(async () => granted.stream),
    );
    const session = createDebateSession(debateTopics[0], "PRO", {
      inputMode: "VOICE_CAMERA",
    });
    upsertLocalSession(session);

    render(
      <DeviceCheckScreen
        sessionId={session.id}
        requestedInputMode="VOICE_CAMERA"
      />,
    );

    expect(await screen.findByText("Persiapkan Arena")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /Aktifkan & Cek Perangkat/i }),
    );

    expect(await screen.findByText("Mikrofon siap")).toBeInTheDocument();
    expect(screen.getByText("Kamera siap")).toBeInTheDocument();
    expect(screen.getByText("Live preview")).toBeInTheDocument();
    expect(getUserMedia).toHaveBeenCalledWith(
      expect.objectContaining({
        audio: expect.any(Object),
        video: expect.any(Object),
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: /^Masuk Arena$/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(`/arena/${session.id}`);
    });
    expect(getStoredSession(session)?.inputMode).toBe("VOICE_CAMERA");
    expect(granted.audioTracks[0].stop).toHaveBeenCalled();
    expect(granted.videoTracks[0].stop).toHaveBeenCalled();
  });

  it("falls back to voice-only when camera permission fails but microphone succeeds", async () => {
    const voiceOnly = createStream({ audio: true, video: false });
    const getUserMedia = setupMediaDevices(
      vi
        .fn()
        .mockRejectedValueOnce(new DOMException("Camera blocked", "NotAllowedError"))
        .mockResolvedValueOnce(voiceOnly.stream),
    );
    const session = createDebateSession(debateTopics[0], "PRO", {
      inputMode: "VOICE_CAMERA",
    });
    upsertLocalSession(session);

    render(
      <DeviceCheckScreen
        sessionId={session.id}
        requestedInputMode="VOICE_CAMERA"
      />,
    );

    expect(await screen.findByText("Persiapkan Arena")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /Aktifkan & Cek Perangkat/i }),
    );

    expect(await screen.findByText("Mikrofon siap")).toBeInTheDocument();
    expect(screen.getByText("Kamera belum diizinkan")).toBeInTheDocument();
    expect(
      screen.getByText(/Mode suara saja aktif/i),
    ).toBeInTheDocument();
    expect(getUserMedia).toHaveBeenCalledTimes(2);
    expect(getUserMedia).toHaveBeenLastCalledWith(
      expect.objectContaining({ video: false }),
    );

    fireEvent.click(screen.getByRole("button", { name: /^Masuk Arena$/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(`/arena/${session.id}`);
    });
    expect(getStoredSession(session)?.inputMode).toBe("VOICE");
    expect(voiceOnly.audioTracks[0].stop).toHaveBeenCalled();
  });

  it("shows a denied mic state and keeps text fallback available", async () => {
    const getUserMedia = setupMediaDevices(
      vi.fn(async () => {
        throw new DOMException("Mic blocked", "NotAllowedError");
      }),
    );
    const session = createDebateSession(debateTopics[0], "PRO", {
      inputMode: "VOICE",
    });
    upsertLocalSession(session);

    render(
      <DeviceCheckScreen sessionId={session.id} requestedInputMode="VOICE" />,
    );

    expect(await screen.findByText("Persiapkan Arena")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /Aktifkan & Cek Perangkat/i }),
    );

    expect(
      await screen.findByText("Mikrofon belum diizinkan"),
    ).toBeInTheDocument();
    expect(getUserMedia).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: /Gunakan Teks/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(`/arena/${session.id}`);
    });
    expect(getStoredSession(session)?.inputMode).toBe("TEXT");
  });
});
