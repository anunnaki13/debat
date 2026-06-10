"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, PenLine, ShieldCheck, WandSparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { FlowStepHeader } from "@/components/flow/FlowStepHeader";
import { PageShell } from "@/components/layout/PageShell";
import { SideSelector } from "@/components/topics/SideSelector";
import { TopicExplorer } from "@/components/topics/TopicExplorer";
import { Badge, Button, Card, CardDescription, CardTitle } from "@/components/ui";
import { debateTopics } from "@/data/topics";
import { createDebateSession } from "@/lib/debate/session";
import {
  getDebateFlowDraft,
  saveDebateFlowDraft,
  type DebateFlowDraft,
} from "@/lib/flow/debateFlowDraft";
import { upsertLocalSession } from "@/lib/storage/localSessions";
import type { DebateTopic, SideSelection } from "@/types/debate";

export function TopicRouteScreen() {
  const router = useRouter();
  const [draft, setDraft] = useState<DebateFlowDraft>(getDebateFlowDraft);

  useEffect(() => {
    queueMicrotask(() => setDraft(getDebateFlowDraft()));
  }, []);

  function updateTopic(topic: DebateTopic) {
    setDraft(saveDebateFlowDraft({ topic }));
  }

  function updateSide(sideSelection: SideSelection) {
    setDraft(saveDebateFlowDraft({ sideSelection }));
  }

  function startFromDraft() {
    const nextDraft = saveDebateFlowDraft({
      topic: draft.topic,
      sideSelection: draft.sideSelection,
      mode: draft.mode,
      inputMode: draft.inputMode,
    });
    const session = createDebateSession(
      nextDraft.topic,
      nextDraft.sideSelection,
      {
        mode: nextDraft.mode,
        inputMode: nextDraft.inputMode,
      },
    );

    upsertLocalSession(session);

    if (nextDraft.inputMode === "TEXT") {
      router.push(`/arena/${session.id}`);
      return;
    }

    router.push(
      `/device-check?sessionId=${encodeURIComponent(session.id)}&input=${nextDraft.inputMode}`,
    );
  }

  return (
    <PageShell className="space-y-6">
      <FlowStepHeader
        eyebrow="Step 2"
        title="Pilih topik dan posisi"
        description="Topik sekarang punya halaman sendiri. Pilih gagasan, tentukan sisi, lalu lanjut ke arena tanpa kembali ke dashboard panjang."
        activeStep="Topik"
        backHref="/play"
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/topics/new"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] px-4 text-sm font-semibold text-[var(--ra-text-primary)] transition hover:border-[var(--ra-cyan)] hover:bg-[var(--ra-cyan-soft)]"
            >
              <PenLine size={17} aria-hidden="true" />
              Buat Topik Privat
            </Link>
            <Link
              href="/topics/refine"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--ra-radius-md)] border border-[rgba(156,124,255,0.42)] bg-[rgba(156,124,255,0.12)] px-4 text-sm font-semibold text-[var(--ra-text-primary)] transition hover:bg-[rgba(156,124,255,0.20)]"
            >
              <WandSparkles size={17} aria-hidden="true" />
              AI Topic Refiner
            </Link>
          </div>

          <TopicExplorer
            topics={debateTopics}
            selectedTopic={draft.topic}
            onSelect={updateTopic}
            onSideChange={updateSide}
          />
        </div>

        <aside className="ra-hud-panel relative space-y-4 overflow-hidden rounded-[var(--ra-radius-xl)] border border-[rgba(21,248,255,0.28)] bg-[rgba(7,11,19,0.84)] p-4 shadow-[var(--ra-shadow-elevated)] backdrop-blur-xl md:p-5 xl:sticky xl:top-7">
          <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--ra-electric-cyan),var(--ra-magenta),var(--ra-gold))]" />
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge tone="user" className="uppercase tracking-[0.16em]">
                Launch Panel
              </Badge>
              <CardTitle className="mt-4 text-lg uppercase">Setup debat</CardTitle>
            </div>
            <Image
              src="/assets/arena/rank-orator-badge.svg"
              alt=""
              width={58}
              height={58}
              className="rounded-[var(--ra-radius-pill)] shadow-[var(--ra-glow-gold)]"
              aria-hidden="true"
            />
          </div>
          <CardDescription className="mt-2">
            Draft tersimpan lokal. Refresh halaman tidak menghapus pilihan ini.
          </CardDescription>

          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold text-[var(--ra-text-secondary)]">
              Posisi
            </p>
            <SideSelector
              value={draft.sideSelection}
              onChange={updateSide}
            />
          </div>

          <Card
            variant="selected"
            className="mt-5 border-[rgba(21,248,255,0.42)] bg-[rgba(21,248,255,0.10)]"
          >
            <Badge tone={draft.topic.custom ? "special" : "positive"}>
              {draft.topic.custom ? "Topik Privat" : draft.topic.category}
            </Badge>
            <h2 className="mt-3 text-base font-black leading-6 text-[var(--ra-text-primary)]">
              {draft.topic.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--ra-text-secondary)]">
              {draft.topic.shortContext}
            </p>
          </Card>

          <div className="grid gap-3 rounded-[var(--ra-radius-lg)] border border-[rgba(255,255,255,0.10)] bg-[rgba(19,32,51,0.62)] p-4">
            <SummaryRow label="Mode" value={draft.mode} />
            <SummaryRow label="Input" value={draft.inputMode} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[var(--ra-radius-md)] border border-[rgba(98,212,156,0.22)] bg-[rgba(98,212,156,0.08)] p-3">
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--ra-emerald)]">
                <ShieldCheck size={13} aria-hidden="true" />
                Safe
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--ra-text-muted)]">
                Privasi lokal
              </p>
            </div>
            <div className="rounded-[var(--ra-radius-md)] border border-[rgba(255,43,214,0.22)] bg-[rgba(255,43,214,0.08)] p-3">
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--ra-magenta-bright)]">
                <Zap size={13} aria-hidden="true" />
                AI
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--ra-text-muted)]">
                Lawan aktif
              </p>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={startFromDraft}
            trailingIcon={<ArrowRight size={18} aria-hidden="true" />}
          >
            {draft.inputMode === "TEXT" ? "Masuk Arena" : "Lanjut Device Check"}
          </Button>
        </aside>
      </section>
    </PageShell>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--ra-text-muted)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-[var(--ra-text-primary)]">
        {value}
      </p>
    </div>
  );
}
