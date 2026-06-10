"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { LobbyHero } from "@/components/lobby/LobbyHero";
import { ModeCarousel } from "@/components/lobby/ModeCarousel";
import { PopularChallengeStrip } from "@/components/lobby/PopularChallengeStrip";
import { ProgressResumeCard } from "@/components/lobby/ProgressResumeCard";
import { UserUtilityBar } from "@/components/lobby/UserUtilityBar";
import { InputModeSelector } from "@/components/topics/InputModeSelector";
import { SideSelector } from "@/components/topics/SideSelector";
import { TopicExplorer } from "@/components/topics/TopicExplorer";
import { Badge, Button, Card, CardDescription, CardTitle } from "@/components/ui";
import { debateTopics } from "@/data/topics";
import { createDebateSession } from "@/lib/debate/session";
import {
  getLocalSessions,
  upsertLocalSession,
} from "@/lib/storage/localSessions";
import type {
  DebateInputMode,
  DebateMode,
  DebateTopic,
  SideSelection,
} from "@/types/debate";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<DebateTopic>(debateTopics[0]);
  const [debateMode, setDebateMode] =
    useState<DebateMode>("DUEL_WACANA_AI");
  const [inputMode, setInputMode] = useState<DebateInputMode>("TEXT");
  const [sideSelection, setSideSelection] = useState<SideSelection>("PRO");
  const [completedCount, setCompletedCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    queueMicrotask(() => {
      const sessions = getLocalSessions();
      setCompletedCount(
        sessions.filter((session) => session.status === "COMPLETED").length,
      );
      setActiveCount(
        sessions.filter((session) => session.status !== "COMPLETED").length,
      );
    });
  }, []);

  function startDebate() {
    const session = createDebateSession(selectedTopic, sideSelection, {
      mode: debateMode,
      inputMode,
    });
    upsertLocalSession(session);

    if (inputMode === "TEXT") {
      router.push(`/debate/${session.id}`);
    } else {
      router.push(
        `/debate/device-check?sessionId=${encodeURIComponent(session.id)}&input=${inputMode}`,
      );
    }
  }

  function focusSetup() {
    document.getElementById("setup-debat")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <PageShell className="space-y-6">
      <UserUtilityBar />
      <LobbyHero onPrimaryAction={focusSetup} />

      <section aria-labelledby="mode-title" className="space-y-4">
        <div>
          <Badge tone="user">Pilih Mode Permainan</Badge>
          <h2
            id="mode-title"
            className="mt-3 font-serif text-2xl font-bold text-[var(--ra-text-primary)]"
          >
            Format arena hari ini
          </h2>
        </div>
        <ModeCarousel value={debateMode} onChange={setDebateMode} />
      </section>

      <PopularChallengeStrip
        topics={debateTopics}
        selectedTopic={selectedTopic}
        onSelect={setSelectedTopic}
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
        <div id="pilih-topik" className="scroll-mt-6 space-y-4">
          <TopicExplorer
            topics={debateTopics}
            selectedTopic={selectedTopic}
            onSelect={setSelectedTopic}
            onSideChange={setSideSelection}
          />
        </div>

        <Card
          id="setup-debat"
          variant="elevated"
          className="scroll-mt-6 xl:sticky xl:top-7"
        >
          <Badge tone="user">Setup Arena</Badge>
          <CardTitle className="mt-4">Masuk ke debat</CardTitle>
          <CardDescription className="mt-2">
            Pilih posisi dan cara input, lalu mulai ronde pertama.
          </CardDescription>

          <div className="mt-6 space-y-5">
            <div>
              <p className="mb-3 text-sm font-semibold text-[var(--ra-text-secondary)]">
                Posisi
              </p>
              <SideSelector value={sideSelection} onChange={setSideSelection} />
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-[var(--ra-text-secondary)]">
                Input Arena
              </p>
              <InputModeSelector value={inputMode} onChange={setInputMode} />
            </div>

            <div>
              <div className="rounded-[var(--ra-radius-lg)] border border-[rgba(50,212,209,0.28)] bg-[rgba(50,212,209,0.09)] p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={18}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-[var(--ra-cyan-bright)]"
                  />
                  <div>
                    <p className="text-sm font-black uppercase tracking-wide text-[var(--ra-text-primary)]">
                      Aturan AI
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--ra-text-secondary)]">
                      Lawan AI akan mengambil posisi berseberangan dengan Anda.
                      Wasit AI menilai ketajaman argumen, bukti, logika, dan
                      respons terhadap topik terpilih.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  size="lg"
                  onClick={startDebate}
                  trailingIcon={<ArrowRight size={18} aria-hidden="true" />}
                  className="w-full"
                >
                  Mulai Debat
                </Button>
              </div>
              <p className="mt-2 text-xs leading-5 text-[var(--ra-text-muted)]">
                Konfigurasi model disiapkan di lingkungan dev/server, bukan di
                lobby pemain.
              </p>
            </div>

            <div className="rounded-[var(--ra-radius-lg)] border border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] p-4">
              <p className="text-sm font-semibold text-[var(--ra-cyan-bright)]">
                Topik Terpilih
              </p>
              <p className="mt-2 text-base font-bold leading-6 text-[var(--ra-text-primary)]">
                {selectedTopic.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--ra-text-secondary)]">
                {selectedTopic.shortContext}
              </p>
            </div>
          </div>
        </Card>
      </section>

      <ProgressResumeCard
        completedCount={completedCount}
        activeCount={activeCount}
      />
    </PageShell>
  );
}
