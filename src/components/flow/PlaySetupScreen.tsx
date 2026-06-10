"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Keyboard, Mic2 } from "lucide-react";
import { useEffect, useState } from "react";
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
          <Card variant="outline">
            <Badge tone="user">Mode</Badge>
            <CardTitle className="mt-4">Format arena</CardTitle>
            <CardDescription className="mt-2">
              MVP saat ini memprioritaskan duel AI dan topik privat. Mode lain
              tetap disiapkan di balik feature flag.
            </CardDescription>
            <div className="mt-5">
              <ModeCarousel value={draft.mode} onChange={updateMode} />
            </div>
          </Card>

          <Card variant="outline">
            <Badge tone="positive">Input</Badge>
            <CardTitle className="mt-4">Cara masuk arena</CardTitle>
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

        <aside className="space-y-4 rounded-[var(--ra-radius-xl)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-glass)] p-4 shadow-[var(--ra-shadow-card)] md:p-5 xl:sticky xl:top-7">
          <Badge tone="special">Draft Flow</Badge>
          <CardTitle className="mt-4 text-lg">Ringkasan pilihan</CardTitle>
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
    <div className="rounded-[var(--ra-radius-md)] border border-[var(--ra-border-subtle)] bg-[var(--ra-bg-panel)] p-3">
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
