"use client";

import { useRouter } from "next/navigation";
import { Gavel, RotateCcw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { LoadingDots } from "@/components/common/LoadingDots";
import { DebateComposer } from "@/components/debate/DebateComposer";
import { DebateHeader } from "@/components/debate/DebateHeader";
import { DebateTranscript } from "@/components/debate/DebateTranscript";
import { PageShell } from "@/components/layout/PageShell";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
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
import type {
  ApiErrorResponse,
  DebateMessage,
  DebateSession,
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

  const appendFinalTranscript = useCallback((text: string) => {
    setInput((current) => [current, text].filter(Boolean).join(" ").trimStart());
  }, []);
  const speech = useSpeechRecognition({
    onFinalTranscript: appendFinalTranscript,
    enabled: preferences.voiceInputEnabled,
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

      if (preferences.autoSpeakOpponent) {
        speakText(opponentMessage.content);
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
      createdAt: new Date().toISOString(),
    };
    const nextSession = {
      ...session,
      messages: [...session.messages, userMessage],
    };

    persistSession(nextSession);
    setInput("");
    await callOpponent(nextSession);
  }

  async function retryOpponent() {
    if (!session) {
      return;
    }

    await callOpponent(session);
  }

  async function requestJudge() {
    if (!session || !canRequestJudge(session.messages)) {
      setError("Debat belum lengkap untuk dinilai.");
      return;
    }

    setError("");
    setIsLoadingJudge(true);
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

  return (
    <PageShell className="space-y-6">
      <DebateHeader
        session={session}
        remainingSeconds={remainingSeconds}
        autoSpeak={preferences.autoSpeakOpponent}
        onAutoSpeakChange={(autoSpeakOpponent) =>
          updatePreferences({ ...preferences, autoSpeakOpponent })
        }
      />

      <ErrorBanner message={error} />

      <section className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
        <div className="rounded-lg border border-white/10 bg-slate-950/65 p-4">
          <DebateTranscript messages={session.messages} />
          {isLoadingOpponent ? (
            <div className="mt-4 rounded-md border border-cyan-300/20 bg-cyan-300/10 px-4 py-3">
              <LoadingDots label="AI menyusun balasan" />
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          {session.status === "IN_PROGRESS" ? (
            <DebateComposer
              round={session.currentRound}
              value={input}
              onChange={setInput}
              onSubmit={submitArgument}
              disabled={awaitingOpponent || isLoadingJudge}
              isVoiceSupported={speech.isSupported}
              isListening={speech.isListening}
              voiceInterim={speech.interimTranscript}
              voiceError={speech.error}
              onStartVoice={speech.startListening}
              onStopVoice={speech.stopListening}
            />
          ) : null}

          {awaitingOpponent && !isLoadingOpponent ? (
            <button
              type="button"
              onClick={retryOpponent}
              className="inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-md border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/15"
            >
              <RotateCcw size={16} aria-hidden="true" />
              Coba Lagi Lawan AI
            </button>
          ) : null}

          {canJudge ? (
            <button
              type="button"
              onClick={requestJudge}
              disabled={isLoadingJudge}
              className="inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-md bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              <Gavel size={17} aria-hidden="true" />
              {isLoadingJudge ? "Meminta Penilaian..." : "Akhiri dan Minta Penilaian"}
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => setShowCancelDialog(true)}
            className="inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-md border border-red-300/30 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-300/10"
          >
            <Trash2 size={16} aria-hidden="true" />
            Batalkan Debat
          </button>

          <div className="rounded-lg border border-white/10 bg-slate-950/75 p-4 text-sm leading-6 text-slate-400">
            Fitur mikrofon bergantung pada dukungan browser. Bila tidak tersedia,
            gunakan input ketik. Pada sebagian browser, pengenalan suara dapat
            diproses oleh layanan milik platform browser.
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
            stopSpeaking();
            router.push("/");
          }}
        />
      ) : null}
    </PageShell>
  );
}
