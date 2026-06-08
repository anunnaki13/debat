"use client";

import { useRouter } from "next/navigation";
import { Camera, Keyboard, Mic, Play, Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { LoadingDots } from "@/components/common/LoadingDots";
import { PageShell } from "@/components/layout/PageShell";
import { trackLocalEvent } from "@/lib/analytics/localAnalytics";
import { speakText, stopSpeaking } from "@/lib/speech/speakText";
import {
  getLocalSession,
  upsertLocalSession,
} from "@/lib/storage/localSessions";
import type { DebateInputMode, DebateSession } from "@/types/debate";

const audioConstraints: MediaTrackConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  channelCount: 1,
};

const videoConstraints: MediaTrackConstraints = {
  facingMode: "user",
  width: { ideal: 1280, max: 1280 },
  height: { ideal: 720, max: 720 },
  frameRate: { ideal: 24, max: 30 },
};

function stopStream(stream: MediaStream | null): void {
  stream?.getTracks().forEach((track) => track.stop());
}

export function DeviceCheckScreen({
  sessionId,
  requestedInputMode,
}: {
  sessionId: string;
  requestedInputMode: DebateInputMode;
}) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [session, setSession] = useState<DebateSession | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(
    requestedInputMode === "VOICE_CAMERA",
  );
  const [micGranted, setMicGranted] = useState(false);
  const [cameraGranted, setCameraGranted] = useState(false);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState("");

  const cleanupMedia = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    audioContextRef.current?.close().catch(() => undefined);
    audioContextRef.current = null;
    stopStream(streamRef.current);
    streamRef.current = null;
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      const localSession = getLocalSession(sessionId);
      setSession(localSession);

      if (localSession) {
        trackLocalEvent(
          "device_check_opened",
          { inputMode: requestedInputMode },
          localSession.id,
        );
      }
    });
  }, [requestedInputMode, sessionId]);

  useEffect(() => cleanupMedia, [cleanupMedia]);

  async function startDeviceCheck(forceCamera = cameraEnabled) {
    setError("");
    setIsChecking(true);
    cleanupMedia();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
        video: forceCamera ? videoConstraints : false,
      });
      streamRef.current = stream;
      setMicGranted(stream.getAudioTracks().length > 0);
      setCameraGranted(stream.getVideoTracks().length > 0);

      if (stream.getAudioTracks().length > 0) {
        trackLocalEvent("mic_permission_granted", {}, session?.id);
      }

      if (stream.getVideoTracks().length > 0) {
        trackLocalEvent("camera_permission_granted", {}, session?.id);
      }

      if (videoRef.current && stream.getVideoTracks().length > 0) {
        videoRef.current.srcObject = stream;
      }

      const AudioContextCtor =
        window.AudioContext ??
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

      if (AudioContextCtor && stream.getAudioTracks().length > 0) {
        const context = new AudioContextCtor();
        const analyser = context.createAnalyser();
        const source = context.createMediaStreamSource(stream);
        const data = new Uint8Array(analyser.fftSize);

        analyser.fftSize = 512;
        source.connect(analyser);
        audioContextRef.current = context;

        const tick = () => {
          analyser.getByteTimeDomainData(data);
          const rms = Math.sqrt(
            data.reduce((sum, value) => {
              const normalized = (value - 128) / 128;
              return sum + normalized * normalized;
            }, 0) / data.length,
          );
          setLevel(Math.min(1, rms * 3.5));
          animationRef.current = requestAnimationFrame(tick);
        };

        tick();
      }
    } catch (deviceError) {
      const wantsCamera = forceCamera;
      const message = wantsCamera
        ? "Kamera tidak aktif. Anda masih dapat berdebat menggunakan suara atau ketikan."
        : "Mikrofon belum diizinkan. Anda tetap dapat melanjutkan melalui ketikan.";

      setError(message);
      trackLocalEvent(
        wantsCamera ? "camera_permission_denied" : "mic_permission_denied",
        {
          reason:
            deviceError instanceof Error ? deviceError.name : "unknown_error",
        },
        session?.id,
      );
    } finally {
      setIsChecking(false);
    }
  }

  function continueWith(inputMode: DebateInputMode) {
    if (!session) {
      return;
    }

    const nextSession = { ...session, inputMode };
    upsertLocalSession(nextSession);
    cleanupMedia();
    trackLocalEvent(
      inputMode === "TEXT" ? "text_fallback_used" : "voice_mode_started",
      { inputMode },
      session.id,
    );
    router.push(`/debate/${session.id}`);
  }

  if (!session) {
    return (
      <PageShell>
        <ErrorBanner message="Sesi debat tidak ditemukan di browser ini." />
      </PageShell>
    );
  }

  return (
    <PageShell className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
        <div className="rounded-lg border border-white/10 bg-slate-950/75 p-5">
          <p className="text-sm font-semibold text-cyan-100">Device Check</p>
          <h1 className="mt-2 text-2xl font-black text-white">
            Siapkan Arena Suara
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Kamera hanya digunakan sebagai preview lokal pada MVP. Video tidak
            dikirim ke AI dan tidak diunggah. Mikrofon digunakan untuk mengubah
            suara Anda menjadi teks agar AI dapat membalas.
          </p>

          <div className="mt-5 overflow-hidden rounded-lg border border-white/10 bg-slate-900">
            {cameraGranted ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="aspect-video w-full object-cover"
              />
            ) : (
              <div className="flex aspect-video flex-col items-center justify-center gap-3 text-slate-400">
                <Camera size={32} aria-hidden="true" />
                <p className="text-sm">Preview kamera lokal belum aktif.</p>
              </div>
            )}
          </div>

          <div className="mt-5 rounded-lg border border-white/10 bg-slate-900/75 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Mic size={17} aria-hidden="true" />
                Meter Mikrofon
              </div>
              <span className="text-xs text-slate-400">
                {micGranted ? "aktif" : "belum aktif"}
              </span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-md bg-slate-800">
              <div
                className="h-full rounded-md bg-cyan-300 transition-[width]"
                style={{ width: `${Math.round(level * 100)}%` }}
              />
            </div>
          </div>

          <div className="mt-5">
            <ErrorBanner message={error} />
          </div>
        </div>

        <div className="space-y-3 rounded-lg border border-white/10 bg-slate-950/75 p-5">
          <label className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-slate-900/75 px-3 py-3 text-sm text-slate-200">
            Kamera lokal
            <input
              type="checkbox"
              checked={cameraEnabled}
              onChange={(event) => setCameraEnabled(event.target.checked)}
              className="h-4 w-4 accent-cyan-300"
            />
          </label>

          <button
            type="button"
            onClick={() => startDeviceCheck(cameraEnabled)}
            disabled={isChecking}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {isChecking ? (
              <LoadingDots label="Mengecek perangkat" />
            ) : (
              <>
                <Play size={16} aria-hidden="true" />
                Tes Kamera & Mikrofon
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              speakText(
                "Suara AI siap. Mari masuk ke arena dan jaga argumen tetap bernas.",
              )
            }
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
          >
            <Volume2 size={16} aria-hidden="true" />
            Tes Suara AI
          </button>

          <button
            type="button"
            onClick={() =>
              continueWith(cameraEnabled ? "VOICE_CAMERA" : "VOICE")
            }
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-amber-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200"
          >
            Mulai Debat
          </button>

          <button
            type="button"
            onClick={() => {
              setCameraEnabled(false);
              continueWith("VOICE");
            }}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
          >
            Lanjut Tanpa Kamera
          </button>

          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              continueWith("TEXT");
            }}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/10"
          >
            <Keyboard size={16} aria-hidden="true" />
            Gunakan Ketikan Saja
          </button>
        </div>
      </section>
    </PageShell>
  );
}
