"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Flame, Gavel, HelpCircle, Lightbulb, RotateCcw, ThumbsUp, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import {
  AiOpponentPanel,
  ArenaActionBar,
  MomentumMeter,
  RoundTransitionCard,
  UserPodium,
  VoiceWaveform,
  getArenaStateMeta,
  type ArenaMomentum,
  type ArenaVisualState,
} from "@/components/debate/ArenaVisuals";
import { DebateComposer } from "@/components/debate/DebateComposer";
import { DebateHeader } from "@/components/debate/DebateHeader";
import { DebateTranscript } from "@/components/debate/DebateTranscript";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui";
import { useOpenRouterVoiceInput } from "@/hooks/useOpenRouterVoiceInput";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { trackLocalEvent } from "@/lib/analytics/localAnalytics";
import {
  canRequestJudge,
  getNextRound,
  getRoundLimit,
  isAwaitingOpponent,
  trimArgument,
} from "@/lib/debate/rules";
import { createId } from "@/lib/utils/ids";
import { featureFlags } from "@/lib/features/flags";
import { speakText, stopSpeaking } from "@/lib/speech/speakText";
import {
  deleteLocalSession,
  getLocalSession,
  getPreferences,
  savePreferences,
  upsertLocalSession,
} from "@/lib/storage/localSessions";
import { buildDeliveryReport } from "@/lib/voice/deliverySignals";
import type {
  ApiErrorResponse,
  DebateMessage,
  DebateSession,
  DeliverySignals,
  InputSource,
  JudgeReport,
  UserPreferences,
} from "@/types/debate";

const TURN_SECONDS = 180;
const OPPONENT_STREAM_INTERVAL_MS = process.env.NODE_ENV === "test" ? 1 : 18;
const OPPONENT_STREAM_STEPS = 30;

const audienceSignals = [
  { label: "Setuju", value: "512", icon: ThumbsUp, tone: "text-[var(--ra-emerald)]" },
  { label: "Butuh Data", value: "218", icon: HelpCircle, tone: "text-[var(--ra-amber)]" },
  { label: "Tidak Masuk Akal", value: "143", icon: Flame, tone: "text-[var(--ra-coral-bright)]" },
  { label: "Menarik", value: "89", icon: Lightbulb, tone: "text-[var(--ra-violet)]" },
] as const;

type OpponentVoiceState = "idle" | "preparing" | "speaking";

function readApiError(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    typeof (error as ApiErrorResponse).error?.message === "string"
  ) {
    return (error as ApiErrorResponse).error.message;
  }

  return fallback;
}

function getArenaVisualState({
  error,
  isLoadingJudge,
  awaitingOpponent,
  isLoadingOpponent,
  isStreamingOpponent,
  isListening,
  opponentVoiceState,
  status,
}: {
  error: string;
  isLoadingJudge: boolean;
  awaitingOpponent: boolean;
  isLoadingOpponent: boolean;
  isStreamingOpponent: boolean;
  isListening: boolean;
  opponentVoiceState: OpponentVoiceState;
  status: DebateSession["status"];
}): ArenaVisualState {
  if (error) {
    return "recoverable_error";
  }

  if (isLoadingJudge) {
    return "judging";
  }

  if (status === "AWAITING_JUDGE" || status === "COMPLETED") {
    return "complete";
  }

  if (opponentVoiceState === "speaking") {
    return "ai_speaking";
  }

  if (isStreamingOpponent) {
    return "ai_streaming_text";
  }

  if (awaitingOpponent || isLoadingOpponent || opponentVoiceState === "preparing") {
    return "ai_thinking";
  }

  if (isListening) {
    return "user_speaking";
  }

  return "ready";
}

function getMomentum(messages: DebateMessage[]): ArenaMomentum {
  if (messages.length === 0) {
    return { user: 50, ai: 50 };
  }

  const userCharacters = messages
    .filter((message) => message.speaker === "USER")
    .reduce((total, message) => total + message.content.length, 0);
  const aiCharacters = messages
    .filter((message) => message.speaker === "OPPONENT")
    .reduce((total, message) => total + message.content.length, 0);
  const totalCharacters = Math.max(1, userCharacters + aiCharacters);
  const tilt = ((userCharacters - aiCharacters) / totalCharacters) * 16;
  const user = Math.min(66, Math.max(34, Math.round(50 + tilt)));

  return { user, ai: 100 - user };
}

function AudiencePulsePanel() {
  return (
    <div className="rounded-[var(--ra-radius-lg)] border border-[rgba(89,137,255,0.24)] bg-[rgba(7,12,27,0.74)] p-3">
      <p className="text-center text-xs font-black uppercase tracking-[0.18em] text-[#91b8ff]">
        Reaksi Audiens Real-Time
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {audienceSignals.map((signal) => {
          const Icon = signal.icon;

          return (
            <div
              key={signal.label}
              className="rounded-[var(--ra-radius-md)] border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.045)] px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <Icon size={15} aria-hidden="true" className={signal.tone} />
                <span className={`text-base font-black ${signal.tone}`}>
                  {signal.value}
                </span>
              </div>
              <p className="mt-1 text-[11px] font-bold text-[var(--ra-text-muted)]">
                {signal.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DebateScreen({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [session, setSession] = useState<DebateSession | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isLoadingOpponent, setIsLoadingOpponent] = useState(false);
  const [streamingOpponentMessage, setStreamingOpponentMessage] =
    useState<DebateMessage | null>(null);
  const [isLoadingJudge, setIsLoadingJudge] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(TURN_SECONDS);
  const [preferences, setPreferences] =
    useState<UserPreferences>(getPreferences);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [inputSource, setInputSource] = useState<InputSource>("TEXT");
  const [arenaNotice, setArenaNotice] = useState("");
  const [opponentVoiceState, setOpponentVoiceState] =
    useState<OpponentVoiceState>("idle");
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const activeAudioUrlRef = useRef<string | null>(null);
  const ttsAbortRef = useRef<AbortController | null>(null);
  const streamTokenRef = useRef(0);

  const appendBrowserTranscript = useCallback((text: string) => {
    setInput((current) => [current, text].filter(Boolean).join(" ").trimStart());
    setInputSource("BROWSER_STT");
  }, []);

  const updateDeliverySignals = useCallback((signals: DeliverySignals) => {
    setSession((currentSession) => {
      if (!currentSession) {
        return currentSession;
      }

      const updatedSession: DebateSession = {
        ...currentSession,
        deliveryReport: buildDeliveryReport(signals),
      };
      upsertLocalSession(updatedSession);

      return updatedSession;
    });
  }, []);

  const appendOpenRouterTranscript = useCallback(
    ({
      transcript,
      deliverySignals,
    }: {
      transcript: string;
      deliverySignals?: DeliverySignals;
    }) => {
      setInput((current) =>
        [current, transcript].filter(Boolean).join(" ").trimStart(),
      );
      setInputSource("OPENROUTER_STT");

      if (deliverySignals) {
        updateDeliverySignals(deliverySignals);
      }
    },
    [updateDeliverySignals],
  );
  const speech = useSpeechRecognition({
    onFinalTranscript: appendBrowserTranscript,
    enabled:
      preferences.voiceInputEnabled &&
      Boolean(session) &&
      session?.inputMode === "TEXT",
  });
  const openRouterVoice = useOpenRouterVoiceInput({
    enabled:
      preferences.voiceInputEnabled &&
      Boolean(session) &&
      session?.inputMode !== "TEXT",
    onTranscript: appendOpenRouterTranscript,
    sessionId: session?.id,
  });

  const streamOpponentText = useCallback(async (message: DebateMessage) => {
    const content = message.content.trim();
    const token = streamTokenRef.current + 1;
    streamTokenRef.current = token;

    if (!content) {
      setStreamingOpponentMessage({ ...message, content: "" });
      return true;
    }

    const chunkSize = Math.max(
      8,
      Math.ceil(content.length / OPPONENT_STREAM_STEPS),
    );
    setStreamingOpponentMessage({
      ...message,
      content: content.slice(0, chunkSize),
    });

    for (let visible = chunkSize; visible < content.length; visible += chunkSize) {
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, OPPONENT_STREAM_INTERVAL_MS);
      });

      if (streamTokenRef.current !== token) {
        return false;
      }

      setStreamingOpponentMessage({
        ...message,
        content: content.slice(0, Math.min(visible + chunkSize, content.length)),
      });
    }

    return true;
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      setSession(getLocalSession(sessionId));
      setPreferences(getPreferences());
    });
  }, [sessionId]);

  const awaitingOpponent = useMemo(
    () =>
      session
        ? isAwaitingOpponent(session.messages, session.currentRound) ||
          isLoadingOpponent
        : false,
    [isLoadingOpponent, session],
  );

  const latestOpponentMessage = useMemo(
    () =>
      session
        ? [...session.messages].reverse().find((message) => message.speaker === "OPPONENT")
        : undefined,
    [session],
  );

  useEffect(() => {
    if (!session || session.status !== "IN_PROGRESS" || awaitingOpponent) {
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((current) => current - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [awaitingOpponent, session]);

  function persistSession(nextSession: DebateSession) {
    if (
      session?.currentRound !== nextSession.currentRound &&
      nextSession.status === "IN_PROGRESS"
    ) {
      setRemainingSeconds(TURN_SECONDS);
    }

    setSession(nextSession);
    upsertLocalSession(nextSession);
  }

  function updatePreferences(nextPreferences: UserPreferences) {
    setPreferences(nextPreferences);
    savePreferences(nextPreferences);
  }

  const stopOpenRouterAudio = useCallback(() => {
    ttsAbortRef.current?.abort();
    ttsAbortRef.current = null;
    activeAudioRef.current?.pause();
    activeAudioRef.current = null;

    if (activeAudioUrlRef.current) {
      URL.revokeObjectURL(activeAudioUrlRef.current);
      activeAudioUrlRef.current = null;
    }
  }, []);

  const stopOpponentVoice = useCallback(() => {
    stopOpenRouterAudio();
    stopSpeaking();
    setOpponentVoiceState("idle");
  }, [stopOpenRouterAudio]);

  const finishOpponentVoice = useCallback((notice?: string) => {
    setOpponentVoiceState("idle");

    if (notice) {
      setArenaNotice(notice);
    }
  }, []);

  const speakOpponentWithBrowserVoice = useCallback(
    (text: string, targetSessionId: string, isFallback = false) => {
      stopSpeaking();
      setOpponentVoiceState("preparing");
      setArenaNotice(
        isFallback
          ? "TTS OpenRouter gagal. Suara browser disiapkan sebagai fallback."
          : "Menyiapkan suara AI dari browser...",
      );
      trackLocalEvent("tts_started", { mode: "browser" }, targetSessionId);

      speakText(text, {
        onStart: () => {
          setOpponentVoiceState("speaking");
          setArenaNotice("AI sedang berbicara. Tekan Interupsi untuk memotong.");
        },
        onEnd: () => {
          finishOpponentVoice("Giliran Anda. Susun balasan berikutnya.");
        },
        onError: () => {
          trackLocalEvent("tts_failed", { mode: "browser" }, targetSessionId);
          finishOpponentVoice("Suara AI gagal. Teks tetap tersedia di transcript.");
        },
      });
    },
    [finishOpponentVoice],
  );

  const speakOpponentVoice = useCallback(
    async (text: string, targetSessionId: string) => {
      stopOpenRouterAudio();
      stopSpeaking();
      setOpponentVoiceState("preparing");
      setArenaNotice("Menyiapkan suara AI OpenRouter...");
      trackLocalEvent("tts_started", undefined, targetSessionId);
      const controller = new AbortController();
      ttsAbortRef.current = controller;

      try {
        const response = await fetch("/api/voice/synthesize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({ text }),
        });

        if (!response.ok) {
          throw new Error("TTS server gagal.");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);

        activeAudioRef.current = audio;
        activeAudioUrlRef.current = url;
        ttsAbortRef.current = null;
        audio.onended = () => {
          stopOpenRouterAudio();
          finishOpponentVoice("Giliran Anda. Susun balasan berikutnya.");
        };
        audio.onerror = () => {
          stopOpenRouterAudio();
          trackLocalEvent("tts_failed", { mode: "openrouter" }, targetSessionId);
          finishOpponentVoice("Suara AI gagal. Teks tetap tersedia di transcript.");
        };
        setOpponentVoiceState("speaking");
        setArenaNotice("AI sedang berbicara. Tekan Interupsi untuk memotong.");
        await audio.play();
      } catch {
        if (controller.signal.aborted) {
          return;
        }

        stopOpenRouterAudio();
        trackLocalEvent("tts_failed", undefined, targetSessionId);
        trackLocalEvent("browser_tts_fallback_used", undefined, targetSessionId);
        speakOpponentWithBrowserVoice(text, targetSessionId, true);
      }
    },
    [finishOpponentVoice, speakOpponentWithBrowserVoice, stopOpenRouterAudio],
  );

  useEffect(
    () => () => {
      streamTokenRef.current += 1;
      stopOpenRouterAudio();
      stopSpeaking();
    },
    [stopOpenRouterAudio],
  );

  async function callOpponent(nextSession: DebateSession) {
    setError("");
    setArenaNotice("");
    setStreamingOpponentMessage(null);
    setIsLoadingOpponent(true);

    try {
      const response = await fetch("/api/debate/opponent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: nextSession.topic,
          userSide: nextSession.userSide,
          opponentSide: nextSession.opponentSide,
          currentRound: nextSession.currentRound,
          messages: nextSession.messages,
        }),
      });
      const payload = (await response.json()) as
        | { content: string }
        | ApiErrorResponse;

      if (!response.ok || !("content" in payload)) {
        throw payload;
      }

      const opponentMessage: DebateMessage = {
        id: createId("message"),
        speaker: "OPPONENT",
        round: nextSession.currentRound,
        content: payload.content.trim(),
        createdAt: new Date().toISOString(),
      };

      setIsLoadingOpponent(false);
      setArenaNotice("AI menulis bantahan ke transcript...");
      const streamCompleted = await streamOpponentText(opponentMessage);

      if (!streamCompleted) {
        return;
      }

      const nextRound = getNextRound(nextSession.currentRound);
      const updatedSession: DebateSession = {
        ...nextSession,
        messages: [...nextSession.messages, opponentMessage],
        currentRound: nextRound ?? nextSession.currentRound,
        status: nextRound ? "IN_PROGRESS" : "AWAITING_JUDGE",
      };

      setStreamingOpponentMessage(null);
      persistSession(updatedSession);
      trackLocalEvent(
        nextRound ? "round_completed" : "debate_completed",
        { round: nextSession.currentRound },
        nextSession.id,
      );
      setArenaNotice(
        nextRound
          ? "Giliran Anda. Susun balasan berikutnya."
          : "Semua ronde selesai. Minta penilaian dari AI Judge.",
      );

      if (preferences.autoSpeakOpponent) {
        if (nextSession.inputMode === "TEXT") {
          speakOpponentWithBrowserVoice(opponentMessage.content, nextSession.id);
        } else {
          void speakOpponentVoice(opponentMessage.content, nextSession.id);
        }
      }
    } catch (requestError) {
      streamTokenRef.current += 1;
      setStreamingOpponentMessage(null);
      setError(
        readApiError(
          requestError,
          "Lawan AI belum bisa merespons. Coba ulangi panggilan.",
        ),
      );
    } finally {
      setIsLoadingOpponent(false);
    }
  }

  async function submitArgument() {
    if (!session || awaitingOpponent) {
      return;
    }

    const content = trimArgument(input);
    const limit = getRoundLimit(session.currentRound);

    if (!content) {
      setError("Argumen tidak boleh kosong.");
      return;
    }

    if (content.length > limit) {
      setError(`Argumen melebihi batas ${limit} karakter.`);
      return;
    }

    const userMessage: DebateMessage = {
      id: createId("message"),
      speaker: "USER",
      round: session.currentRound,
      content,
      inputSource,
      createdAt: new Date().toISOString(),
    };
    const nextSession = {
      ...session,
      messages: [...session.messages, userMessage],
    };

    persistSession(nextSession);
    trackLocalEvent(
      "argument_submitted",
      { round: session.currentRound, inputMode: session.inputMode },
      session.id,
    );
    setInput("");
    setArenaNotice("");
    setInputSource(session.inputMode === "TEXT" ? "TEXT" : "TRANSCRIPT_EDIT");
    await callOpponent(nextSession);
  }

  async function retryOpponent() {
    if (!session) {
      return;
    }

    await callOpponent(session);
  }

  function handleInputChange(value: string) {
    setInput(value);

    if (!session || session.inputMode === "TEXT") {
      setInputSource("TEXT");
      return;
    }

    setInputSource((currentSource) =>
      currentSource === "OPENROUTER_STT" ||
      currentSource === "BROWSER_STT" ||
      currentSource === "TEXT"
        ? "TRANSCRIPT_EDIT"
        : currentSource,
    );
  }

  async function requestJudge() {
    if (!session || !canRequestJudge(session.messages)) {
      setError("Debat belum lengkap untuk dinilai.");
      return;
    }

    setError("");
    setIsLoadingJudge(true);
    stopOpponentVoice();

    try {
      const response = await fetch("/api/debate/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session,
        }),
      });
      const payload = (await response.json()) as
        | { report: JudgeReport }
        | ApiErrorResponse;

      if (!response.ok || !("report" in payload)) {
        throw payload;
      }

      const completedSession: DebateSession = {
        ...session,
        status: "COMPLETED",
        completedAt: new Date().toISOString(),
        report: payload.report,
      };
      persistSession(completedSession);
      router.push(`/results/${completedSession.id}`);
    } catch (requestError) {
      setError(
        readApiError(
          requestError,
          "AI Judge belum bisa menilai debat. Coba ulangi penilaian.",
        ),
      );
    } finally {
      setIsLoadingJudge(false);
    }
  }

  if (!session) {
    return (
      <PageShell>
        <ErrorBanner message="Sesi debat tidak ditemukan di browser ini." />
      </PageShell>
    );
  }

  const canJudge = session.status === "AWAITING_JUDGE" && canRequestJudge(session.messages);
  const isStreamingOpponent = Boolean(streamingOpponentMessage);
  const transcriptMessages = streamingOpponentMessage
    ? [...session.messages, streamingOpponentMessage]
    : session.messages;
  const latestOpponentCaption =
    streamingOpponentMessage?.content || latestOpponentMessage?.content;
  const useOpenRouterVoice = session.inputMode !== "TEXT";
  const voiceInput = useOpenRouterVoice
    ? {
        isSupported: openRouterVoice.isSupported,
        isListening: openRouterVoice.isRecording,
        isBusy: openRouterVoice.isBusy,
        interim: "",
        error: openRouterVoice.error,
        status: openRouterVoice.status,
        start: openRouterVoice.startRecording,
        stop: openRouterVoice.stopRecording,
      }
    : {
        isSupported: speech.isSupported,
        isListening: speech.isListening,
        isBusy: false,
        interim: speech.interimTranscript,
        error: speech.error,
        status: "",
        start: speech.startListening,
        stop: speech.stopListening,
      };
  const arenaState = getArenaVisualState({
    error,
    isLoadingJudge,
    awaitingOpponent,
    isLoadingOpponent,
    isStreamingOpponent,
    isListening: voiceInput.isListening,
    opponentVoiceState,
    status: session.status,
  });
  const momentum = getMomentum(transcriptMessages);

  return (
    <PageShell className="space-y-5">
      <DebateHeader
        session={session}
        remainingSeconds={remainingSeconds}
        autoSpeak={preferences.autoSpeakOpponent}
        onAutoSpeakChange={(autoSpeakOpponent) =>
          updatePreferences({ ...preferences, autoSpeakOpponent })
        }
      />

      <ErrorBanner message={error} />

      <section className="relative overflow-hidden rounded-[var(--ra-radius-xl)] border border-[rgba(85,137,255,0.34)] bg-[#050914] p-3 shadow-[var(--ra-shadow-elevated)] md:p-4">
        <Image
          src="/assets/arena/arena-backdrop.svg"
          alt=""
          fill
          sizes="(min-width: 1024px) calc(100vw - 280px), 100vw"
          className="object-cover object-center opacity-[0.50]"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(40,145,255,0.22),transparent_34%),radial-gradient(circle_at_84%_22%,rgba(255,67,82,0.18),transparent_32%),linear-gradient(180deg,rgba(2,8,23,0.22),rgba(2,8,23,0.94))]" />

        <div className="relative grid gap-4 xl:grid-cols-[220px_minmax(420px,1fr)_330px]">
          <div className="hidden xl:block">
            <UserPodium
              inputMode={session.inputMode}
              side={session.userSide}
              state={arenaState}
            />
          </div>

          <div className="min-w-0 space-y-3">
            <div className="rounded-[var(--ra-radius-xl)] border border-[rgba(89,137,255,0.26)] bg-[rgba(2,8,23,0.78)] p-4 shadow-[var(--ra-shadow-card)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-extrabold uppercase text-[var(--ra-cyan-bright)]">
                    Live Transcript Feed
                  </p>
                  <h2 className="text-xl font-extrabold text-[var(--ra-text-primary)]">
                    Ronde {session.currentRound.toLowerCase()}
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-[var(--ra-radius-pill)] border border-[var(--ra-border-default)] bg-[rgba(7,11,19,0.62)] px-3 py-1 text-xs font-bold text-[var(--ra-text-secondary)]">
                    {arenaNotice ||
                      (useOpenRouterVoice
                        ? "Voice aktif. Kamera lokal."
                        : getArenaStateMeta(arenaState).copy)}
                  </span>
                  {canJudge ? (
                    <Button
                      variant="prestige"
                      onClick={requestJudge}
                      disabled={isLoadingJudge}
                      leadingIcon={<Gavel size={17} aria-hidden="true" />}
                    >
                      {isLoadingJudge ? "Menilai..." : "Minta Penilaian"}
                    </Button>
                  ) : null}
                </div>
              </div>

              {featureFlags.enableSpectator ? (
                <div className="mt-4">
                  <AudiencePulsePanel />
                </div>
              ) : null}

              <div className="mt-4">
                <DebateTranscript
                  messages={transcriptMessages}
                  streamingMessageId={streamingOpponentMessage?.id}
                />
              </div>
              {isLoadingOpponent || isStreamingOpponent ? (
                <div className="mt-4">
                  <RoundTransitionCard
                    round={session.currentRound}
                    state={isStreamingOpponent ? "ai_streaming_text" : "ai_thinking"}
                  />
                </div>
              ) : null}
            </div>

            <div className="rounded-[var(--ra-radius-xl)] border border-[rgba(89,137,255,0.22)] bg-[rgba(2,8,23,0.72)] p-3 shadow-[var(--ra-shadow-card)]">
              <VoiceWaveform
                tone={
                  arenaState === "ai_speaking" ||
                  arenaState === "ai_thinking" ||
                  arenaState === "ai_streaming_text"
                    ? "ai"
                    : "user"
                }
              />
              <div className="mt-2 flex items-center justify-between text-xs font-bold text-[var(--ra-text-muted)]">
                <span>Input ketik atau voice</span>
                <span>Lawan AI siap menanggapi</span>
              </div>
            </div>
          </div>

          <AiOpponentPanel
            side={session.opponentSide}
            userSide={session.userSide}
            inputMode={session.inputMode}
            state={arenaState}
            latestCaption={latestOpponentCaption}
          />
        </div>

        <div className="relative mt-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto]">
          <MomentumMeter momentum={momentum} />

          <ArenaActionBar
            state={arenaState}
            onInterrupt={() => {
              if (opponentVoiceState === "idle") {
                setArenaNotice("Interupsi aktif saat suara AI sedang berjalan.");
                return;
              }

              stopOpponentVoice();
              trackLocalEvent(
                "ai_voice_interrupted",
                { voiceState: opponentVoiceState },
                session.id,
              );
              setArenaNotice("AI dihentikan. Silakan sampaikan interupsi Anda.");
              setError("");
            }}
            onMarkData={() => setArenaNotice("Kartu Data ditandai untuk laporan akhir.")}
            onMarkFactCheck={() => setArenaNotice("Cek Fakta ditandai untuk laporan akhir.")}
            onMarkCommonGround={() => setArenaNotice("Titik Temu ditandai untuk laporan akhir.")}
          />
        </div>

        <div className="ra-hud-panel relative mt-4 space-y-3 rounded-[var(--ra-radius-xl)] border border-[var(--ra-electric-cyan)] bg-[rgba(2,8,23,0.84)] p-3 shadow-[var(--ra-glow-esports-cyan)] backdrop-blur-xl">
          {session.status === "IN_PROGRESS" ? (
            <DebateComposer
              round={session.currentRound}
              value={input}
              onChange={handleInputChange}
              onSubmit={submitArgument}
              disabled={awaitingOpponent || isLoadingJudge}
              isVoiceSupported={voiceInput.isSupported}
              isListening={voiceInput.isListening}
              isVoiceBusy={voiceInput.isBusy}
              voiceInterim={voiceInput.interim}
              voiceError={voiceInput.error}
              voiceStatus={voiceInput.status}
              onStartVoice={voiceInput.start}
              onStopVoice={voiceInput.stop}
            />
          ) : null}

          <div className="flex flex-wrap gap-2">
            {awaitingOpponent && !isLoadingOpponent && !isStreamingOpponent ? (
              <Button
                variant="outline"
                leadingIcon={<RotateCcw size={16} aria-hidden="true" />}
                onClick={retryOpponent}
              >
                Coba Lagi Lawan AI
              </Button>
            ) : null}
            <Button
              variant="danger"
              leadingIcon={<Trash2 size={16} aria-hidden="true" />}
              onClick={() => setShowCancelDialog(true)}
            >
              Batalkan Debat
            </Button>
          </div>
        </div>
      </section>

      {showCancelDialog ? (
        <ConfirmDialog
          title="Batalkan debat?"
          message="Sesi ini akan dihapus dari riwayat lokal browser."
          confirmLabel="Hapus Sesi"
          onCancel={() => setShowCancelDialog(false)}
          onConfirm={() => {
            deleteLocalSession(session.id);
            stopOpponentVoice();
            router.push("/play");
          }}
        />
      ) : null}
    </PageShell>
  );
}
