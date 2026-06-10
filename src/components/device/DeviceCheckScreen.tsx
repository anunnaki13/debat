"use client";

import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Headphones,
  Keyboard,
  Mic,
  Play,
  ShieldCheck,
  SlidersHorizontal,
  Volume2,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { PageShell } from "@/components/layout/PageShell";
import { Badge, Button, Chip } from "@/components/ui";
import { cn } from "@/lib/cn";
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

const speakerCue = "Suara AI siap.";

type DeviceOption = {
  deviceId: string;
  label: string;
};

type DeviceStatusTone = "idle" | "ready" | "warning" | "blocked";

function stopStream(stream: MediaStream | null): void {
  stream?.getTracks().forEach((track) => track.stop());
}

function toDeviceOptions(
  devices: MediaDeviceInfo[],
  kind: MediaDeviceKind,
  fallbackLabel: string,
): DeviceOption[] {
  return devices
    .filter((device) => device.kind === kind)
    .map((device, index) => ({
      deviceId: device.deviceId,
      label: device.label || `${fallbackLabel} ${index + 1}`,
    }));
}

function withDeviceId(
  constraints: MediaTrackConstraints,
  deviceId: string,
): MediaTrackConstraints {
  return deviceId
    ? { ...constraints, deviceId: { exact: deviceId } }
    : constraints;
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
  const speakerTimerRef = useRef<number | null>(null);
  const [session, setSession] = useState<DebateSession | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(
    requestedInputMode === "VOICE_CAMERA",
  );
  const [hasRequestedPermissions, setHasRequestedPermissions] = useState(false);
  const [mediaSupported, setMediaSupported] = useState(true);
  const [isSecureContext, setIsSecureContext] = useState(true);
  const [micGranted, setMicGranted] = useState(false);
  const [cameraGranted, setCameraGranted] = useState(false);
  const [micDenied, setMicDenied] = useState(false);
  const [cameraDenied, setCameraDenied] = useState(false);
  const [microphones, setMicrophones] = useState<DeviceOption[]>([]);
  const [cameras, setCameras] = useState<DeviceOption[]>([]);
  const [selectedMicId, setSelectedMicId] = useState("");
  const [selectedCameraId, setSelectedCameraId] = useState("");
  const [level, setLevel] = useState(0);
  const [speakerTested, setSpeakerTested] = useState(false);
  const [isSpeakerTesting, setIsSpeakerTesting] = useState(false);
  const [error, setError] = useState("");

  const refreshDevices = useCallback(async () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.enumerateDevices
    ) {
      return;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const nextMicrophones = toDeviceOptions(
        devices,
        "audioinput",
        "Mikrofon",
      );
      const nextCameras = toDeviceOptions(devices, "videoinput", "Kamera");

      setMicrophones(nextMicrophones);
      setCameras(nextCameras);
      setSelectedMicId((current) =>
        current && nextMicrophones.some((device) => device.deviceId === current)
          ? current
          : nextMicrophones[0]?.deviceId ?? "",
      );
      setSelectedCameraId((current) =>
        current && nextCameras.some((device) => device.deviceId === current)
          ? current
          : nextCameras[0]?.deviceId ?? "",
      );
    } catch {
      setMicrophones([]);
      setCameras([]);
    }
  }, []);

  const cleanupMedia = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    audioContextRef.current?.close().catch(() => undefined);
    audioContextRef.current = null;
    stopStream(streamRef.current);
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const clearSpeakerTimer = useCallback(() => {
    if (speakerTimerRef.current) {
      window.clearTimeout(speakerTimerRef.current);
      speakerTimerRef.current = null;
    }
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

  useEffect(() => {
    queueMicrotask(() => {
      setMediaSupported(Boolean(navigator.mediaDevices?.getUserMedia));
      setIsSecureContext(window.isSecureContext);
      void refreshDevices();
    });

    navigator.mediaDevices?.addEventListener?.("devicechange", refreshDevices);

    return () => {
      navigator.mediaDevices?.removeEventListener?.(
        "devicechange",
        refreshDevices,
      );
    };
  }, [refreshDevices]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = cameraGranted ? streamRef.current : null;
    }
  }, [cameraGranted]);

  useEffect(
    () => () => {
      cleanupMedia();
      clearSpeakerTimer();
      stopSpeaking();
    },
    [cleanupMedia, clearSpeakerTimer],
  );

  async function startDeviceCheck(forceCamera = cameraEnabled) {
    setError("");
    setIsChecking(true);
    setHasRequestedPermissions(true);
    setMicGranted(false);
    setCameraGranted(false);
    setMicDenied(false);
    setCameraDenied(false);
    setLevel(0);
    cleanupMedia();

    if (!mediaSupported || !navigator.mediaDevices?.getUserMedia) {
      setMicDenied(true);
      setError(
        "Browser ini belum menyediakan akses mikrofon. Anda tetap dapat bermain melalui teks.",
      );
      setIsChecking(false);
      return;
    }

    if (!isSecureContext) {
      setMicDenied(true);
      setCameraDenied(forceCamera);
      setError(
        "Akses kamera dan mikrofon memerlukan koneksi aman HTTPS.",
      );
      setIsChecking(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: withDeviceId(audioConstraints, selectedMicId),
        video: forceCamera
          ? withDeviceId(videoConstraints, selectedCameraId)
          : false,
      });
      streamRef.current = stream;

      const hasMic = stream.getAudioTracks().length > 0;
      const hasCamera = stream.getVideoTracks().length > 0;
      setMicGranted(hasMic);
      setCameraGranted(hasCamera);
      setMicDenied(!hasMic);
      setCameraDenied(forceCamera && !hasCamera);

      if (hasMic) {
        trackLocalEvent("mic_permission_granted", {}, session?.id);
      }

      if (hasCamera) {
        trackLocalEvent("camera_permission_granted", {}, session?.id);
      }

      const AudioContextCtor =
        window.AudioContext ??
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

      if (AudioContextCtor && hasMic) {
        const context = new AudioContextCtor();
        const analyser = context.createAnalyser();
        analyser.fftSize = 512;
        const source = context.createMediaStreamSource(stream);
        const data = new Uint8Array(analyser.fftSize);

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

      await refreshDevices();
    } catch (deviceError) {
      const wantsCamera = forceCamera;
      const message = wantsCamera
        ? "Kamera atau mikrofon belum diizinkan. Anda tetap dapat melanjutkan dengan suara saja atau teks."
        : "Mikrofon belum diizinkan. Anda tetap dapat bermain melalui teks.";

      setError(message);
      setMicDenied(true);
      setCameraDenied(wantsCamera);
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

  function handleCameraToggle(enabled: boolean) {
    setCameraEnabled(enabled);

    if (!enabled) {
      streamRef.current?.getVideoTracks().forEach((track) => track.stop());
      setCameraGranted(false);
      setCameraDenied(false);

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }

  function testSpeaker() {
    clearSpeakerTimer();
    setSpeakerTested(true);
    setIsSpeakerTesting(true);
    speakText(speakerCue);
    speakerTimerRef.current = window.setTimeout(() => {
      stopSpeaking();
      setIsSpeakerTesting(false);
      speakerTimerRef.current = null;
    }, 1800);
  }

  function continueWith(inputMode: DebateInputMode) {
    if (!session) {
      return;
    }

    const nextSession = { ...session, inputMode };
    upsertLocalSession(nextSession);
    cleanupMedia();
    clearSpeakerTimer();
    stopSpeaking();
    trackLocalEvent(
      inputMode === "TEXT" ? "text_fallback_used" : "voice_mode_started",
      { inputMode },
      session.id,
    );
    router.push(`/arena/${session.id}`);
  }

  if (!session) {
    return (
      <PageShell>
        <ErrorBanner message="Sesi debat tidak ditemukan di browser ini." />
      </PageShell>
    );
  }

  const micStatus = getMicStatus({
    hasRequestedPermissions,
    mediaSupported,
    isSecureContext,
    micGranted,
    micDenied,
  });
  const cameraStatus = getCameraStatus({
    cameraEnabled,
    hasRequestedPermissions,
    mediaSupported,
    isSecureContext,
    cameraGranted,
    cameraDenied,
  });
  const speakerStatus = getSpeakerStatus({
    isSpeakerTesting,
    speakerTested,
  });
  const arenaMode: DebateInputMode = cameraEnabled ? "VOICE_CAMERA" : "VOICE";

  return (
    <PageShell className="space-y-6">
      <header className="flex flex-col gap-4 rounded-[var(--ra-radius-xl)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-glass)] p-5 shadow-[var(--ra-shadow-elevated)] md:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="prestige">Device Check</Badge>
          <Badge tone={cameraEnabled ? "user" : "neutral"}>
            {cameraEnabled ? "Voice + Camera" : "Voice Only"}
          </Badge>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_340px] lg:items-end">
          <div>
            <h1 className="font-serif text-3xl font-bold leading-tight text-[var(--ra-text-primary)] sm:text-4xl">
              Persiapkan Arena
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ra-text-secondary)] sm:text-base sm:leading-7">
              Kamera hanya digunakan sebagai preview lokal pada MVP. Video tidak
              dikirim ke AI dan tidak diunggah. Mikrofon digunakan untuk
              mengubah suara Anda menjadi teks agar AI dapat membalas.
            </p>
          </div>
          <PermissionNotice
            hasRequestedPermissions={hasRequestedPermissions}
            mediaSupported={mediaSupported}
            isSecureContext={isSecureContext}
            error={error}
          />
        </div>
      </header>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
        <div className="space-y-5">
          <CameraPreviewTile
            videoRef={videoRef}
            cameraEnabled={cameraEnabled}
            cameraGranted={cameraGranted}
          />

          <MicLevelMeter level={level} isActive={micGranted} />
        </div>

        <aside className="space-y-4 rounded-[var(--ra-radius-xl)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-glass)] p-4 shadow-[var(--ra-shadow-card)] md:p-5">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ra-text-primary)]">
              <SlidersHorizontal size={17} aria-hidden="true" />
              Perangkat
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--ra-text-muted)]">
              Pilih perangkat sebelum memunculkan dialog izin browser.
            </p>
          </div>

          <div className="grid gap-3">
            <DeviceSelect
              label="Mikrofon"
              value={selectedMicId}
              options={microphones}
              fallback="Mikrofon akan muncul setelah izin browser."
              onChange={setSelectedMicId}
            />
            <DeviceSelect
              label="Kamera"
              value={selectedCameraId}
              options={cameras}
              fallback="Kamera akan muncul setelah izin browser."
              onChange={setSelectedCameraId}
              disabled={!cameraEnabled}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Chip
              tone={cameraEnabled ? "cyan" : "neutral"}
              selected={cameraEnabled}
              onClick={() => handleCameraToggle(true)}
            >
              <Camera size={15} aria-hidden="true" />
              Kamera aktif
            </Chip>
            <Chip
              tone={!cameraEnabled ? "gold" : "neutral"}
              selected={!cameraEnabled}
              onClick={() => handleCameraToggle(false)}
            >
              Voice only
            </Chip>
          </div>

          <div className="grid gap-3">
            <DeviceStatusCard
              icon={Mic}
              label={micStatus.label}
              description={micStatus.description}
              tone={micStatus.tone}
            />
            <DeviceStatusCard
              icon={Camera}
              label={cameraStatus.label}
              description={cameraStatus.description}
              tone={cameraStatus.tone}
            />
            <DeviceStatusCard
              icon={Headphones}
              label={speakerStatus.label}
              description={speakerStatus.description}
              tone={speakerStatus.tone}
            />
          </div>

          <div className="grid gap-3">
            <Button
              size="lg"
              className="w-full"
              leadingIcon={<Play size={17} aria-hidden="true" />}
              isLoading={isChecking}
              onClick={() => void startDeviceCheck(cameraEnabled)}
            >
              {isChecking ? "Mengecek perangkat" : "Aktifkan & Cek Perangkat"}
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              leadingIcon={<Volume2 size={17} aria-hidden="true" />}
              onClick={testSpeaker}
            >
              {isSpeakerTesting ? "Memutar Cue" : "Tes Suara AI"}
            </Button>
            <Button
              variant="prestige"
              size="lg"
              className="w-full"
              onClick={() => continueWith(arenaMode)}
            >
              Masuk Arena
            </Button>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  handleCameraToggle(false);
                  continueWith("VOICE");
                }}
              >
                Lanjut Tanpa Kamera
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                leadingIcon={<Keyboard size={17} aria-hidden="true" />}
                onClick={() => continueWith("TEXT")}
              >
                Gunakan Teks
              </Button>
            </div>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}

function DeviceSelect({
  label,
  value,
  options,
  fallback,
  disabled = false,
  onChange,
}: {
  label: string;
  value: string;
  options: DeviceOption[];
  fallback: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const hasOptions = options.length > 0;

  return (
    <label className="block">
      <span className="text-sm font-semibold text-[var(--ra-text-secondary)]">
        {label}
      </span>
      <select
        value={value}
        disabled={disabled || !hasOptions}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-11 w-full rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] px-3 py-2 text-sm text-[var(--ra-text-primary)] transition focus-visible:border-[var(--ra-cyan)] disabled:bg-[var(--ra-bg-surface)] disabled:text-[var(--ra-text-disabled)]"
      >
        {hasOptions ? (
          options.map((option) => (
            <option
              key={`${option.deviceId}-${option.label}`}
              value={option.deviceId}
            >
              {option.label}
            </option>
          ))
        ) : (
          <option value="">{fallback}</option>
        )}
      </select>
    </label>
  );
}

function CameraPreviewTile({
  videoRef,
  cameraEnabled,
  cameraGranted,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  cameraEnabled: boolean;
  cameraGranted: boolean;
}) {
  const statusLabel = cameraGranted
    ? "Live preview"
    : cameraEnabled
      ? "Menunggu izin"
      : "Kamera mati";

  return (
    <div className="overflow-hidden rounded-[var(--ra-radius-xl)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-surface)] shadow-[var(--ra-shadow-elevated)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--ra-border-subtle)] px-4 py-3 md:px-5">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-[var(--ra-radius-md)] border border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] text-[var(--ra-cyan-bright)]">
            <Camera size={18} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--ra-text-primary)]">
              Camera Preview
            </p>
            <p className="text-xs text-[var(--ra-text-muted)]">
              Preview lokal, muted, dan tidak diunggah.
            </p>
          </div>
        </div>
        <Badge tone={cameraGranted ? "positive" : "neutral"}>{statusLabel}</Badge>
      </div>

      <div className="relative aspect-video min-h-[220px] overflow-hidden bg-[linear-gradient(135deg,var(--ra-bg-panel),var(--ra-bg-deep))]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={cn(
            "h-full w-full object-cover transition-opacity duration-200",
            cameraGranted ? "opacity-100" : "opacity-0",
          )}
        />
        {!cameraGranted ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-[var(--ra-radius-pill)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-glass)] text-[var(--ra-text-muted)]">
              <Camera size={30} aria-hidden="true" />
            </span>
            <div>
              <p className="text-base font-semibold text-[var(--ra-text-primary)]">
                {cameraEnabled
                  ? "Preview kamera belum aktif"
                  : "Mode kamera sedang dimatikan"}
              </p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--ra-text-muted)]">
                {cameraEnabled
                  ? "Tekan tombol cek perangkat untuk memunculkan izin browser."
                  : "Anda tetap bisa berdebat dengan mikrofon atau teks."}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MicLevelMeter({ level, isActive }: { level: number; isActive: boolean }) {
  const activeBars = Math.round(level * 18);

  return (
    <div className="rounded-[var(--ra-radius-xl)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-glass)] p-4 shadow-[var(--ra-shadow-card)] md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-[var(--ra-radius-md)] border border-[var(--ra-emerald)] bg-[var(--ra-emerald-soft)] text-[var(--ra-emerald)]">
            <Mic size={18} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--ra-text-primary)]">
              Meter Mikrofon
            </p>
            <p className="text-xs text-[var(--ra-text-muted)]">
              {isActive
                ? "Coba bicara singkat untuk melihat respons meter."
                : "Meter bergerak setelah mikrofon diizinkan."}
            </p>
          </div>
        </div>
        <Badge tone={isActive ? "positive" : "neutral"}>
          {isActive ? "Aktif" : "Belum aktif"}
        </Badge>
      </div>

      <div
        role="meter"
        aria-label="Level mikrofon"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(level * 100)}
        className="mt-5 grid h-14 grid-cols-[repeat(18,minmax(0,1fr))] items-end gap-1 rounded-[var(--ra-radius-md)] border border-[var(--ra-border-subtle)] bg-[var(--ra-bg-panel)] p-2"
      >
        {Array.from({ length: 18 }, (_, index) => (
          <span
            key={index}
            className={cn(
              "rounded-[var(--ra-radius-pill)] transition-[height,background-color,opacity] duration-100",
              index < activeBars && isActive
                ? "bg-[var(--ra-cyan)] opacity-100"
                : "bg-[var(--ra-border-strong)] opacity-45",
            )}
            style={{
              height: `${28 + ((index % 6) + 1) * 10}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function PermissionNotice({
  hasRequestedPermissions,
  mediaSupported,
  isSecureContext,
  error,
}: {
  hasRequestedPermissions: boolean;
  mediaSupported: boolean;
  isSecureContext: boolean;
  error: string;
}) {
  const isBlocked = !mediaSupported || !isSecureContext || Boolean(error);
  const Icon = isBlocked ? AlertTriangle : ShieldCheck;
  const copy = !mediaSupported
    ? "Browser ini belum menyediakan akses media. Mode teks tetap tersedia."
    : !isSecureContext
      ? "Akses kamera dan mikrofon memerlukan koneksi aman HTTPS."
      : error
        ? error
        : hasRequestedPermissions
          ? "Perangkat yang diizinkan akan dipakai hanya untuk sesi lokal ini."
          : "Aktifkan kamera dan mikrofon untuk pengalaman arena penuh.";

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-[var(--ra-radius-lg)] border p-4",
        isBlocked
          ? "border-[var(--ra-amber)] bg-[var(--ra-amber-soft)]"
          : "border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)]",
      )}
    >
      <Icon
        size={20}
        aria-hidden="true"
        className={cn(
          "mt-0.5 shrink-0",
          isBlocked ? "text-[var(--ra-amber)]" : "text-[var(--ra-cyan-bright)]",
        )}
      />
      <p className="text-sm leading-6 text-[var(--ra-text-secondary)]">
        {copy}
      </p>
    </div>
  );
}

function DeviceStatusCard({
  icon: Icon,
  label,
  description,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  description: string;
  tone: DeviceStatusTone;
}) {
  const StatusIcon =
    tone === "ready" ? CheckCircle2 : tone === "blocked" ? XCircle : AlertTriangle;

  return (
    <div
      className={cn(
        "rounded-[var(--ra-radius-lg)] border p-3",
        tone === "ready" &&
          "border-[var(--ra-emerald)] bg-[var(--ra-emerald-soft)]",
        tone === "warning" &&
          "border-[var(--ra-amber)] bg-[var(--ra-amber-soft)]",
        tone === "blocked" &&
          "border-[var(--ra-coral)] bg-[var(--ra-coral-soft)]",
        tone === "idle" &&
          "border-[var(--ra-border-subtle)] bg-[var(--ra-bg-panel)]",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[var(--ra-radius-md)] border border-[var(--ra-border-subtle)] bg-[var(--ra-bg-glass)] text-[var(--ra-text-primary)]">
          <Icon size={17} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <StatusIcon
              size={15}
              aria-hidden="true"
              className={cn(
                tone === "ready" && "text-[var(--ra-emerald)]",
                tone === "warning" && "text-[var(--ra-amber)]",
                tone === "blocked" && "text-[var(--ra-coral-bright)]",
                tone === "idle" && "text-[var(--ra-text-muted)]",
              )}
            />
            <p className="text-sm font-semibold text-[var(--ra-text-primary)]">
              {label}
            </p>
          </div>
          <p className="mt-1 text-xs leading-5 text-[var(--ra-text-muted)]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function getMicStatus({
  hasRequestedPermissions,
  mediaSupported,
  isSecureContext,
  micGranted,
  micDenied,
}: {
  hasRequestedPermissions: boolean;
  mediaSupported: boolean;
  isSecureContext: boolean;
  micGranted: boolean;
  micDenied: boolean;
}): { label: string; description: string; tone: DeviceStatusTone } {
  if (!mediaSupported || !isSecureContext) {
    return {
      label: "Teks tersedia",
      description: "Akses mikrofon tidak tersedia di konteks browser ini.",
      tone: "blocked",
    };
  }

  if (micGranted) {
    return {
      label: "Mikrofon siap",
      description: "Mikrofon menangkap suara Anda.",
      tone: "ready",
    };
  }

  if (micDenied) {
    return {
      label: "Mikrofon belum diizinkan",
      description: "Anda tetap dapat bermain melalui teks.",
      tone: "blocked",
    };
  }

  return {
    label: hasRequestedPermissions ? "Mikrofon menunggu" : "Belum meminta izin",
    description: "Aktifkan mikrofon untuk pengalaman voice arena.",
    tone: hasRequestedPermissions ? "warning" : "idle",
  };
}

function getCameraStatus({
  cameraEnabled,
  hasRequestedPermissions,
  mediaSupported,
  isSecureContext,
  cameraGranted,
  cameraDenied,
}: {
  cameraEnabled: boolean;
  hasRequestedPermissions: boolean;
  mediaSupported: boolean;
  isSecureContext: boolean;
  cameraGranted: boolean;
  cameraDenied: boolean;
}): { label: string; description: string; tone: DeviceStatusTone } {
  if (!cameraEnabled) {
    return {
      label: "Kamera dimatikan",
      description: "Anda memilih mode voice-only.",
      tone: "idle",
    };
  }

  if (!mediaSupported || !isSecureContext) {
    return {
      label: "Kamera tidak tersedia",
      description: "Gunakan voice-only atau teks untuk melanjutkan.",
      tone: "blocked",
    };
  }

  if (cameraGranted) {
    return {
      label: "Kamera siap",
      description: "Kamera siap digunakan sebagai preview lokal.",
      tone: "ready",
    };
  }

  if (cameraDenied) {
    return {
      label: "Kamera belum diizinkan",
      description: "Anda tetap dapat melanjutkan dengan suara atau teks.",
      tone: "blocked",
    };
  }

  return {
    label: hasRequestedPermissions ? "Kamera menunggu" : "Belum meminta izin",
    description: "Preview tidak aktif sebelum Anda memberi consent.",
    tone: hasRequestedPermissions ? "warning" : "idle",
  };
}

function getSpeakerStatus({
  isSpeakerTesting,
  speakerTested,
}: {
  isSpeakerTesting: boolean;
  speakerTested: boolean;
}): { label: string; description: string; tone: DeviceStatusTone } {
  if (isSpeakerTesting) {
    return {
      label: "Speaker dites",
      description: "Cue suara AI diputar singkat.",
      tone: "warning",
    };
  }

  if (speakerTested) {
    return {
      label: "Speaker dicoba",
      description: "Jika tidak terdengar, lanjutkan dengan teks tetap aman.",
      tone: "ready",
    };
  }

  return {
    label: "Speaker belum dites",
    description: "Gunakan cue singkat untuk mengecek output suara AI.",
    tone: "idle",
  };
}
