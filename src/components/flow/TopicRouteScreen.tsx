"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, PenLine, WandSparkles } from "lucide-react";
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

        <aside className="space-y-4 rounded-[var(--ra-radius-xl)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-glass)] p-4 shadow-[var(--ra-shadow-card)] md:p-5 xl:sticky xl:top-7">
          <Badge tone="user">Ready Check</Badge>
          <CardTitle className="mt-4 text-lg">Setup debat</CardTitle>
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

          <Card variant="selected" className="mt-5">
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

          <div className="grid gap-3 rounded-[var(--ra-radius-lg)] border border-[var(--ra-border-subtle)] bg-[var(--ra-bg-panel)] p-4">
            <SummaryRow label="Mode" value={draft.mode} />
            <SummaryRow label="Input" value={draft.inputMode} />
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
