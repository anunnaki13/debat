"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound } from "lucide-react";
import { ErrorBanner } from "@/components/common/ErrorBanner";
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
  CHEAP_OPENROUTER_MODELS,
  DEFAULT_OPENROUTER_MODEL,
} from "@/lib/openrouter/defaults";
import {
  getPreferences,
  getLocalSessions,
  savePreferences,
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
  const [openRouterApiKey, setOpenRouterApiKey] = useState("");
  const [openRouterOpponentModel, setOpenRouterOpponentModel] =
    useState(DEFAULT_OPENROUTER_MODEL);
  const [openRouterJudgeModel, setOpenRouterJudgeModel] =
    useState(DEFAULT_OPENROUTER_MODEL);
  const [setupError, setSetupError] = useState("");
  const [completedCount, setCompletedCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    queueMicrotask(() => {
      const preferences = getPreferences();
      const sessions = getLocalSessions();
      setOpenRouterApiKey(preferences.openRouterApiKey);
      setOpenRouterOpponentModel(
        preferences.openRouterOpponentModel || DEFAULT_OPENROUTER_MODEL,
      );
      setOpenRouterJudgeModel(
        preferences.openRouterJudgeModel || DEFAULT_OPENROUTER_MODEL,
      );
      setCompletedCount(
        sessions.filter((session) => session.status === "COMPLETED").length,
      );
      setActiveCount(
        sessions.filter((session) => session.status !== "COMPLETED").length,
      );
    });
  }, []);

  function startDebate() {
    const trimmedKey = openRouterApiKey.trim();
    const opponentModel =
      openRouterOpponentModel.trim() || DEFAULT_OPENROUTER_MODEL;
    const judgeModel = openRouterJudgeModel.trim() || DEFAULT_OPENROUTER_MODEL;

    if (!trimmedKey) {
      setSetupError("Isi OpenRouter API key dulu sebelum mulai debat.");
      return;
    }

    savePreferences({
      ...getPreferences(),
      aiProvider: "openrouter",
      openRouterApiKey: trimmedKey,
      openRouterOpponentModel: opponentModel,
      openRouterJudgeModel: judgeModel,
    });

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
            Simpan key OpenRouter, pilih posisi, lalu mulai ronde pertama.
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
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--ra-text-secondary)]">
                <KeyRound size={16} aria-hidden="true" />
                OpenRouter API Key
              </div>
              <input
                aria-label="OpenRouter API Key"
                type="password"
                value={openRouterApiKey}
                onChange={(event) => {
                  setOpenRouterApiKey(event.target.value);
                  setSetupError("");
                }}
                autoComplete="off"
                spellCheck={false}
                placeholder="sk-or-..."
                className="min-h-12 w-full rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] px-4 py-3 text-sm text-[var(--ra-text-primary)] placeholder:text-[var(--ra-text-muted)] transition focus-visible:border-[var(--ra-cyan)]"
              />
              <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <label className="block text-sm font-semibold text-[var(--ra-text-secondary)]">
                  <span>Model lawan</span>
                  <select
                    value={openRouterOpponentModel}
                    onChange={(event) =>
                      setOpenRouterOpponentModel(event.target.value)
                    }
                    className="mt-2 min-h-11 w-full rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] px-3 py-2 text-sm text-[var(--ra-text-primary)] transition focus-visible:border-[var(--ra-cyan)]"
                  >
                    {CHEAP_OPENROUTER_MODELS.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-semibold text-[var(--ra-text-secondary)]">
                  <span>Model wasit</span>
                  <select
                    value={openRouterJudgeModel}
                    onChange={(event) =>
                      setOpenRouterJudgeModel(event.target.value)
                    }
                    className="mt-2 min-h-11 w-full rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] px-3 py-2 text-sm text-[var(--ra-text-primary)] transition focus-visible:border-[var(--ra-cyan)]"
                  >
                    {CHEAP_OPENROUTER_MODELS.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="mt-2 text-xs leading-5 text-[var(--ra-text-muted)]">
                Default gratis: {DEFAULT_OPENROUTER_MODEL}. Key tersimpan lokal
                di browser ini dan tidak ikut diekspor.
              </p>
              <div className="mt-3">
                <ErrorBanner message={setupError} />
              </div>
              <Button
                size="lg"
                onClick={startDebate}
                className="mt-4 w-full"
                trailingIcon={<ArrowRight size={18} aria-hidden="true" />}
              >
                Simpan & Mulai Debat
              </Button>
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
