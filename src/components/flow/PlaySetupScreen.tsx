"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Bot, Crosshair, Keyboard, Mic2, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatedWaveform, EnergyDivider } from "@/components/arena/ArenaEffects";
import { FlowStepHeader } from "@/components/flow/FlowStepHeader";
import { PageShell } from "@/components/layout/PageShell";
import { ModeCarousel } from "@/components/lobby/ModeCarousel";
import { InputModeSelector } from "@/components/topics/InputModeSelector";
import { Badge, Button, Card, CardDescription, CardTitle } from "@/components/ui";
import {
  getDebateFlowDraft,
  saveDebateFlowDraft,
  type DebateFlowDraft,
} from "@/lib/flow/debateFlowDraft";
import type { DebateInputMode, DebateMode } from "@/types/debate";

export function PlaySetupScreen() {
  const router = useRouter();
  const [draft, setDraft] = useState<DebateFlowDraft>(getDebateFlowDraft);

  useEffect(() => {
    queueMicrotask(() => setDraft(getDebateFlowDraft()));
  }, []);

  function updateMode(mode: DebateMode) {
    setDraft(saveDebateFlowDraft({ mode }));
  }

  function updateInputMode(inputMode: DebateInputMode) {
    setDraft(saveDebateFlowDraft({ inputMode }));
  }

  function continueFlow() {
    saveDebateFlowDraft({
      mode: draft.mode,
      inputMode: draft.inputMode,
    });
    router.push(draft.mode === "PRIVATE_OPINION" ? "/topics/new" : "/topics");
  }

  return (
    <PageShell className="space-y-6">
      <FlowStepHeader
        eyebrow="Step 1"
        title="Pilih format debat"
        description="Tentukan mode dan cara input sebelum memilih topik. Pilihan ini disimpan sebagai draft lokal agar aman saat pindah route atau refresh."
        activeStep="Mode"
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card
            variant="outline"
            className="ra-hud-panel overflow-hidden border-[rgba(21,248,255,0.24)] bg-[rgba(3,8,20,0.82)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge tone="user" className="uppercase tracking-[0.16em]">
                Mode
              </Badge>
              <span className="inline-flex items-center gap-2 rounded-[var(--ra-radius-pill)] border border-[rgba(255,43,214,0.32)] bg-[rgba(255,43,214,0.10)] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[var(--ra-magenta-bright)]">
                <Crosshair size={13} aria-hidden="true" />
                Match Type
              </span>
            </div>
            <CardTitle className="mt-4 uppercase">Format arena</CardTitle>
            <CardDescription className="mt-2">
              MVP saat ini memprioritaskan duel AI dan topik privat. Mode lain
              tetap disiapkan di balik feature flag.
            </CardDescription>
            <div className="mt-5">
              <ModeCarousel value={draft.mode} onChange={updateMode} />
            </div>
          </Card>

          <Card
            variant="outline"
            className="ra-hud-panel border-[rgba(21,248,255,0.20)] bg-[rgba(3,8,20,0.78)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge tone="positive" className="uppercase tracking-[0.16em]">
                Input
              </Badge>
              <AnimatedWaveform
                tone="user"
                className="h-9 w-full max-w-[210px] bg-[rgba(2,8,23,0.72)]"
              />
            </div>
            <CardTitle className="mt-4 uppercase">Cara masuk arena</CardTitle>
            <CardDescription className="mt-2">
              Text selalu tersedia. Voice dan Voice + Camera akan melewati
              device check sebelum arena.
            </CardDescription>
            <div className="mt-5">
              <InputModeSelector
                value={draft.inputMode}
                onChange={updateInputMode}
              />
            </div>
          </Card>
        </div>

        <aside className="ra-hud-panel relative space-y-4 overflow-hidden rounded-[var(--ra-radius-xl)] border border-[rgba(255,43,214,0.28)] bg-[rgba(7,11,19,0.82)] p-4 shadow-[var(--ra-shadow-elevated)] backdrop-blur-xl md:p-5 xl:sticky xl:top-7">
          <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--ra-electric-cyan),var(--ra-magenta),var(--ra-gold))]" />
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge tone="special" className="uppercase tracking-[0.16em]">
                Loadout
              </Badge>
              <CardTitle className="mt-4 text-lg uppercase">
                Ringkasan pilihan
              </CardTitle>
            </div>
            <Image
              src="/assets/arena/ai-opponent-avatar.svg"
              alt=""
              width={58}
              height={58}
              className="rounded-[var(--ra-radius-pill)] shadow-[var(--ra-glow-esports-magenta)]"
              aria-hidden="true"
            />
          </div>

          <EnergyDivider />

          <div className="mt-4 grid gap-3">
            <SummaryRow label="Mode" value={readModeLabel(draft.mode)} />
            <SummaryRow label="Input" value={readInputLabel(draft.inputMode)} />
            <SummaryRow label="Topik" value={draft.topic.title} />
          </div>
          <div className="mt-5 rounded-[var(--ra-radius-lg)] border border-[rgba(50,212,209,0.24)] bg-[rgba(50,212,209,0.08)] p-4">
            <div className="flex items-start gap-3">
              {draft.inputMode === "TEXT" ? (
                <Keyboard
                  size={18}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[var(--ra-cyan-bright)]"
                />
              ) : (
                <Mic2
                  size={18}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[var(--ra-cyan-bright)]"
                />
              )}
              <p className="text-sm leading-6 text-[var(--ra-text-secondary)]">
                {draft.inputMode === "TEXT"
                  ? "Setelah topik dipilih, Anda bisa langsung masuk arena teks."
                  : "Setelah topik dipilih, Anda akan masuk device check untuk izin mikrofon/kamera."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[var(--ra-radius-md)] border border-[rgba(21,248,255,0.18)] bg-[rgba(21,248,255,0.08)] p-3">
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--ra-cyan-bright)]">
                <Zap size={13} aria-hidden="true" />
                Player
              </p>
              <p className="mt-1 text-sm font-bold text-[var(--ra-text-primary)]">
                Anda
              </p>
            </div>
            <div className="rounded-[var(--ra-radius-md)] border border-[rgba(255,43,214,0.18)] bg-[rgba(255,43,214,0.08)] p-3">
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--ra-magenta-bright)]">
                <Bot size={13} aria-hidden="true" />
                Opponent
              </p>
              <p className="mt-1 text-sm font-bold text-[var(--ra-text-primary)]">
                AI Lawan
              </p>
            </div>
          </div>

          <Button
            size="lg"
            className="mt-5 w-full"
            onClick={continueFlow}
            trailingIcon={<ArrowRight size={18} aria-hidden="true" />}
          >
            Lanjut Pilih Topik
          </Button>
        </aside>
      </section>
    </PageShell>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--ra-radius-md)] border border-[rgba(255,255,255,0.10)] bg-[rgba(19,32,51,0.62)] p-3">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--ra-text-muted)]">
        {label}
      </p>
      <p className="mt-1 line-clamp-2 text-sm font-bold text-[var(--ra-text-primary)]">
        {value}
      </p>
    </div>
  );
}

function readModeLabel(mode: DebateMode): string {
  if (mode === "PRIVATE_OPINION") {
    return "Topik Privat";
  }

  if (mode === "KURSI_PANAS_AI") {
    return "Kursi Panas AI";
  }

  return "Duel Wacana AI";
}

function readInputLabel(inputMode: DebateInputMode): string {
  if (inputMode === "VOICE_CAMERA") {
    return "Voice + Camera";
  }

  if (inputMode === "VOICE") {
    return "Voice";
  }

  return "Text";
}
