"use client";

import { ArrowUpRight, Mic, RotateCcw } from "lucide-react";
import { useState } from "react";
import {
  AnimatedWaveform,
  ArenaParticleField,
  EnergyDivider,
  NeonFrame,
} from "@/components/arena/ArenaEffects";
import {
  AiOpponentPanel,
  ArenaActionBar,
  ArenaStatusBanner,
  MockArenaStateControls,
  MomentumMeter,
  RoundTransitionCard,
  UserPodium,
  type ArenaVisualState,
} from "@/components/debate/ArenaVisuals";
import { DebateTranscript } from "@/components/debate/DebateTranscript";
import { RoundStepper } from "@/components/debate/RoundStepper";
import { TurnTimer } from "@/components/debate/TurnTimer";
import { Badge, Button } from "@/components/ui";
import type { DebateMessage } from "@/types/debate";

const mockMessages: DebateMessage[] = [
  {
    id: "mock-ai-1",
    speaker: "OPPONENT",
    round: "REBUTTAL",
    content:
      "Naturalisasi memang bisa memberi hasil cepat, tetapi tidak membangun fondasi jangka panjang untuk pembinaan pemain lokal.",
    createdAt: "2026-06-09T00:00:00.000Z",
  },
  {
    id: "mock-user-1",
    speaker: "USER",
    round: "REBUTTAL",
    content:
      "Namun data menunjukkan pemain naturalisasi meningkatkan performa di turnamen terakhir dan memberi standar baru untuk skuad muda.",
    createdAt: "2026-06-09T00:01:00.000Z",
  },
];

const stateNotice: Record<ArenaVisualState, string> = {
  ready: "Tahan mikrofon atau ketik argumen pembuka Anda.",
  user_speaking: "Mikrofon menangkap argumen Anda.",
  ai_thinking: "AI sedang menyiapkan bantahan yang relevan.",
  ai_speaking: "AI sedang berbicara. Interupsi tersedia.",
  recoverable_error: "Respons AI sempat gagal. Flow tetap bisa dicoba ulang.",
  judging: "Majelis AI sedang menilai debat.",
  complete: "Debat selesai dan siap dilihat hasilnya.",
};

export function MockArena() {
  const [state, setState] = useState<ArenaVisualState>("ai_speaking");
  const [notice, setNotice] = useState("");

  function mark(action: string) {
    setNotice(`${action} ditandai untuk panel hasil.`);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[image:var(--ra-gradient-game-arena)] px-4 py-6 text-[var(--ra-text-primary)] sm:px-6 lg:px-8">
      <ArenaParticleField />
      <div className="mx-auto flex max-w-[1480px] flex-col gap-5">
        <header className="relative overflow-hidden rounded-[var(--ra-radius-xl)] border border-[var(--ra-border-default)] bg-[rgba(7,11,19,0.72)] p-4 shadow-[var(--ra-shadow-elevated)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Badge tone="prestige">/dev/mock-arena</Badge>
              <h1 className="mt-3 font-serif text-3xl font-bold leading-tight md:text-4xl">
                Arena Debate Visual States
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--ra-text-secondary)]">
                Simulasi style game dari mockup: avatar, neon frame, momentum,
                action bar, waveform, dan input dock tanpa API call.
              </p>
            </div>
            <div className="min-w-48 rounded-[var(--ra-radius-lg)] border border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] p-3 text-center">
              <p className="text-xs font-semibold text-[var(--ra-text-muted)]">
                RONDE 2 / 5
              </p>
              <p className="font-serif text-4xl font-bold text-[var(--ra-cyan-bright)]">
                01:48
              </p>
            </div>
          </div>
          <div className="mt-4">
            <MockArenaStateControls value={state} onChange={setState} />
          </div>
        </header>

        <ArenaStatusBanner state={state} notice={notice || stateNotice[state]} />

        <section className="grid gap-4 xl:grid-cols-[240px_minmax(460px,1fr)_300px]">
          <div className="hidden xl:block">
            <UserPodium inputMode="VOICE_CAMERA" side="PRO" state={state} />
          </div>

          <NeonFrame className="relative overflow-hidden rounded-[var(--ra-radius-xl)] p-4">
            <div className="relative z-[1]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--ra-cyan-bright)]">
                    Live Transcript
                  </p>
                  <h2 className="font-serif text-2xl font-bold">
                    Naturalisasi bukan solusi utama Timnas.
                  </h2>
                </div>
                <TurnTimer remainingSeconds={108} />
              </div>
              <div className="mt-4">
                <RoundStepper currentRound="REBUTTAL" />
              </div>
              <EnergyDivider className="my-4" />
              <DebateTranscript messages={mockMessages} />
              {state === "ai_thinking" ? (
                <RoundTransitionCard round="REBUTTAL" state={state} />
              ) : null}
            </div>
          </NeonFrame>

          <AiOpponentPanel
            side="CONTRA"
            userSide="PRO"
            inputMode="VOICE_CAMERA"
            state={state}
            latestCaption={mockMessages[0].content}
          />
        </section>

        <MomentumMeter momentum={{ user: state === "recoverable_error" ? 52 : 58, ai: state === "recoverable_error" ? 48 : 42 }} />

        <ArenaActionBar
          state={state}
          onInterrupt={() => {
            setState("user_speaking");
            setNotice("AI dihentikan. Silakan sampaikan interupsi Anda.");
          }}
          onMarkData={() => mark("Kartu Data")}
          onMarkFactCheck={() => mark("Cek Fakta")}
          onMarkCommonGround={() => mark("Titik Temu")}
        />

        <section className="sticky bottom-3 z-[var(--ra-z-sticky)] rounded-[var(--ra-radius-xl)] border border-[var(--ra-cyan)] bg-[rgba(7,11,19,0.88)] p-3 shadow-[var(--ra-glow-user)] backdrop-blur-xl">
          <div className="grid gap-3 md:grid-cols-[auto_1fr_auto] md:items-center">
            <button
              type="button"
              onClick={() => setState(state === "user_speaking" ? "ready" : "user_speaking")}
              className="grid h-16 w-16 place-items-center rounded-[var(--ra-radius-pill)] border border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] text-[var(--ra-cyan-bright)] shadow-[var(--ra-glow-user)]"
              aria-label="Toggle mikrofon mock"
            >
              <Mic size={28} aria-hidden="true" />
            </button>
            <div>
              <p className="text-sm font-semibold">
                {state === "user_speaking"
                  ? "Mendengarkan argumen Anda..."
                  : "Tahan untuk bicara atau ketik argumen Anda..."}
              </p>
              <AnimatedWaveform
                tone={state === "ai_speaking" ? "ai" : "user"}
                active={state === "user_speaking" || state === "ai_speaking"}
                className="mt-2 justify-start"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
              <Button
                variant="outline"
                leadingIcon={<RotateCcw size={16} aria-hidden="true" />}
                onClick={() => setState("recoverable_error")}
              >
                Simulasi Error
              </Button>
              <Button
                trailingIcon={<ArrowUpRight size={16} aria-hidden="true" />}
                onClick={() => setState("ai_thinking")}
              >
                Kirim
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
