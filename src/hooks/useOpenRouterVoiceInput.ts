"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { trackLocalEvent } from "@/lib/analytics/localAnalytics";
import type { ApiErrorResponse, DeliverySignals } from "@/types/debate";

interface OpenRouterVoiceTranscript {
  transcript: string;
  deliverySignals?: DeliverySignals;
}

interface TranscribeResponse {
  transcript?: string;
  deliverySignals?: DeliverySignals;
}

function selectMimeType(): string {
  if (typeof MediaRecorder === "undefined") {
    return "";
  }

  return (
    [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/wav",
    ].find((type) => MediaRecorder.isTypeSupported(type)) ?? ""
  );
}

function extensionForMimeType(mimeType: string): string {
  if (mimeType.includes("wav")) {
    return "wav";
  }

  if (mimeType.includes("mp4")) {
    return "m4a";
  }

  return "webm";
}

function readApiMessage(payload: unknown, fallback: string): string {
  const error = (payload as ApiErrorResponse | undefined)?.error;

  return typeof error?.message === "string" ? error.message : fallback;
}

export function useOpenRouterVoiceInput({
  enabled,
  onTranscript,
  sessionId,
}: {
  enabled: boolean;
  onTranscript: (result: OpenRouterVoiceTranscript) => void;
  sessionId?: string;
}) {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startedAtRef = useRef(0);
  const mountedRef = useRef(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
  }, []);

  const transcribe = useCallback(
    async (audio: Blob, durationMs: number) => {
      if (!mountedRef.current) {
        return;
      }

      setIsTranscribing(true);
      setStatus("Mentranskrip suara...");

      try {
        const formData = new FormData();
        formData.append(
          "audioBlob",
          audio,
          `argument.${extensionForMimeType(audio.type)}`,
        );
        formData.append("mimeType", audio.type || "audio/webm");
        formData.append("durationMs", String(Math.round(durationMs)));

        const response = await fetch("/api/voice/transcribe", {
          method: "POST",
          body: formData,
        });
        const payload = (await response.json()) as
          | TranscribeResponse
          | ApiErrorResponse;

        if (!response.ok || !("transcript" in payload) || !payload.transcript) {
          throw new Error(
            readApiMessage(
              payload,
              "Transkripsi suara gagal. Gunakan ketikan sebagai fallback.",
            ),
          );
        }

        onTranscript({
          transcript: payload.transcript.trim(),
          deliverySignals: payload.deliverySignals,
        });
        setStatus("Transkrip siap ditinjau.");
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Transkripsi suara gagal. Gunakan ketikan sebagai fallback.",
        );
      } finally {
        setIsTranscribing(false);
      }
    },
    [onTranscript],
  );

  useEffect(() => {
    mountedRef.current = true;

    if (typeof window !== "undefined") {
      queueMicrotask(() => {
        setIsSupported(
          Boolean(navigator.mediaDevices?.getUserMedia) &&
            typeof MediaRecorder !== "undefined",
        );
      });
    }

    return () => {
      mountedRef.current = false;
      if (recorderRef.current?.state === "recording") {
        recorderRef.current.stop();
      }
      cleanupStream();
    };
  }, [cleanupStream]);

  const startRecording = useCallback(async () => {
    if (!enabled) {
      setError("Mode suara belum aktif untuk sesi ini.");
      return;
    }

    if (!isSupported) {
      setError("Perekaman suara tidak tersedia di browser ini.");
      return;
    }

    try {
      setError("");
      setStatus("");
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      const mimeType = selectMimeType();
      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );

      streamRef.current = stream;
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onerror = () => {
        setError("Perekaman suara berhenti karena error browser.");
        setIsRecording(false);
        cleanupStream();
      };
      recorder.onstop = () => {
        const durationMs = performance.now() - startedAtRef.current;
        const type = recorder.mimeType || mimeType || "audio/webm";
        const audio = new Blob(chunksRef.current, { type });
        chunksRef.current = [];
        setIsRecording(false);
        cleanupStream();
        trackLocalEvent("voice_capture_ended", { durationMs }, sessionId);

        if (!audio.size) {
          setError("Audio kosong. Coba rekam ulang atau gunakan ketikan.");
          return;
        }

        void transcribe(audio, durationMs);
      };

      startedAtRef.current = performance.now();
      recorder.start();
      setIsRecording(true);
      setStatus("Merekam suara...");
      trackLocalEvent("voice_capture_started", undefined, sessionId);
    } catch {
      setError("Izin mikrofon belum tersedia. Gunakan ketikan sebagai fallback.");
      setIsRecording(false);
      cleanupStream();
    }
  }, [cleanupStream, enabled, isSupported, sessionId, transcribe]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  }, []);

  return {
    isSupported: isSupported && enabled,
    isRecording,
    isTranscribing,
    isBusy: isRecording || isTranscribing,
    status,
    error,
    startRecording,
    stopRecording,
  };
}
