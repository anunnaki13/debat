"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Gavel, RotateCcw, Trash2 } from "lucide-react";
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
import { buildClientAiConfig } from "@/lib/ai/preferences";
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
  isListening,
  status,
}: {
  error: string;
  isLoadingJudge: boolean;
  awaitingOpponent: boolean;
  isLoadingOpponent: boolean;
  isListening: boolean;
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

  if (awaitingOpponent || isLoadingOpponent) {
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

export function DebateScreen({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [session, setSession] = useState<DebateSession | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isLoadingOpponent, setIsLoadingOpponent] = useState(false);
  const [isLoadingJudge, setIsLoadingJudge] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(TURN_SECONDS);
  const [preferences, setPreferences] =
    useState<UserPreferences>(getPreferences);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [inputSource, setInputSource] = useState<InputSource>("TEXT");
  const [arenaNotice, setArenaNotice] = useState("");
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const activeAudioUrlRef = useRef<string | null>(null);

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
    activeAudioRef.current?.pause();
    activeAudioRef.current = null;

    if (activeAudioUrlRef.current) {
      URL.revokeObjectURL(activeAudioUrlRef.current);
      activeAudioUrlRef.current = null;
    }
  }, []);

  const speakOpponentVoice = useCallback(
    async (text: string, targetSessionId: string) => {
      stopOpenRouterAudio();
      trackLocalEvent("tts_started", undefined, targetSessionId);

      try {
        const response = await fetch("/api/voice/synthesize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        audio.onended = stopOpenRouterAudio;
        audio.onerror = stopOpenRouterAudio;
        await audio.play();
      } catch {
        stopOpenRouterAudio();
        trackLocalEvent("tts_failed", undefined, targetSessionId);
        trackLocalEvent("browser_tts_fallback_used", undefined, targetSessionId);
        speakText(text);
      }
    },
    [stopOpenRouterAudio],
  );

  useEffect(() => stopOpenRouterAudio, [stopOpenRouterAudio]);

  async function callOpponent(nextSession: DebateSession) {
    setError("");
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
          aiConfig: buildClientAiConfig(preferences),
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
      const nextRound = getNextRound(nextSession.currentRound);
      const updatedSession: DebateSession = {
        ...nextSession,
        messages: [...nextSession.messages, opponentMessage],
        currentRound: nextRound ?? nextSession.currentRound,
        status: nextRound ? "IN_PROGRESS" : "AWAITING_JUDGE",
      };

      persistSession(updatedSession);
      trackLocalEvent(
        nextRound ? "round_completed" : "debate_completed",
        { round: nextSession.currentRound },
        nextSession.id,
      );

      if (preferences.autoSpeakOpponent) {
        if (nextSession.inputMode === "TEXT") {
          speakText(opponentMessage.content);
        } else {
          void speakOpponentVoice(opponentMessage.content, nextSession.id);
        }
      }
    } catch (requestError) {
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
    stopOpenRouterAudio();
    stopSpeaking();

    try {
      const response = await fetch("/api/debate/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session,
          aiConfig: buildClientAiConfig(preferences),
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
      router.push(`/result/${completedSession.id}`);
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
    isListening: voiceInput.isListening,
    status: session.status,
  });
  const momentum = getMomentum(session.messages);

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

      <section className="relative overflow-hidden rounded-[var(--ra-radius-xl)] border border-[rgba(216,170,92,0.24)] bg-[rgba(7,11,19,0.88)] p-3 shadow-[var(--ra-shadow-elevated)] md:p-4">
        <Image
          src="/assets/arena/arena-backdrop.svg"
          alt=""
          fill
          className="object-cover opacity-[0.18]"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(50,212,209,0.16),transparent_34%),radial-gradient(circle_at_84%_26%,rgba(238,106,100,0.16),transparent_32%),linear-gradient(180deg,rgba(7,11,19,0.12),rgba(7,11,19,0.88))]" />

        <div className="relative grid gap-4 xl:grid-cols-[220px_minmax(420px,1fr)_280px]">
          <div className="hidden xl:block">
            <UserPodium
              inputMode={session.inputMode}
              side={session.userSide}
              state={arenaState}
            />
          </div>

          <div className="min-w-0 space-y-3">
            <div className="rounded-[var(--ra-radius-xl)] border border-[var(--ra-border-default)] bg-[rgba(10,17,29,0.74)] p-4 shadow-[var(--ra-shadow-card)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-extrabold uppercase text-[var(--ra-cyan-bright)]">
                    Live Transcript
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

              <div className="mt-4">
                <DebateTranscript messages={session.messages} />
              </div>
              {isLoadingOpponent ? (
                <div className="mt-4">
                  <RoundTransitionCard round={session.currentRound} state="ai_thinking" />
                </div>
              ) : null}
            </div>

            <div className="rounded-[var(--ra-radius-xl)] border border-[var(--ra-border-default)] bg-[rgba(7,11,19,0.58)] p-3 shadow-[var(--ra-shadow-card)]">
              <VoiceWaveform
                tone={arenaState === "ai_speaking" || arenaState === "ai_thinking" ? "ai" : "user"}
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
            latestCaption={latestOpponentMessage?.content}
          />
        </div>

        <div className="relative mt-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto]">
          <MomentumMeter momentum={momentum} />

          <ArenaActionBar
            state={arenaState}
            onInterrupt={() => {
              stopOpenRouterAudio();
              stopSpeaking();
              setArenaNotice("AI dihentikan. Silakan sampaikan interupsi Anda.");
              setError("");
            }}
            onMarkData={() => setArenaNotice("Kartu Data ditandai untuk laporan akhir.")}
            onMarkFactCheck={() => setArenaNotice("Cek Fakta ditandai untuk laporan akhir.")}
            onMarkCommonGround={() => setArenaNotice("Titik Temu ditandai untuk laporan akhir.")}
          />
        </div>

        <div className="relative mt-4 space-y-3 rounded-[var(--ra-radius-xl)] border border-[var(--ra-cyan)] bg-[rgba(7,11,19,0.82)] p-3 shadow-[var(--ra-glow-user)] backdrop-blur-xl">
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
            {awaitingOpponent && !isLoadingOpponent ? (
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
            stopOpenRouterAudio();
            stopSpeaking();
            router.push("/");
          }}
        />
      ) : null}
    </PageShell>
  );
}
