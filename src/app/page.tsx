"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowRight, History, KeyRound } from "lucide-react";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { PageShell } from "@/components/layout/PageShell";
import { SideSelector } from "@/components/topics/SideSelector";
import { TopicSelector } from "@/components/topics/TopicSelector";
import { debateTopics } from "@/data/topics";
import { createDebateSession } from "@/lib/debate/session";
import {
  CHEAP_OPENROUTER_MODELS,
  DEFAULT_OPENROUTER_MODEL,
} from "@/lib/openrouter/defaults";
import {
  getPreferences,
  savePreferences,
  upsertLocalSession,
} from "@/lib/storage/localSessions";
import type { DebateTopic, SideSelection } from "@/types/debate";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<DebateTopic>(debateTopics[0]);
  const [sideSelection, setSideSelection] = useState<SideSelection>("PRO");
  const [openRouterApiKey, setOpenRouterApiKey] = useState("");
  const [openRouterOpponentModel, setOpenRouterOpponentModel] =
    useState(DEFAULT_OPENROUTER_MODEL);
  const [openRouterJudgeModel, setOpenRouterJudgeModel] =
    useState(DEFAULT_OPENROUTER_MODEL);
  const [setupError, setSetupError] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      const preferences = getPreferences();
      setOpenRouterApiKey(preferences.openRouterApiKey);
      setOpenRouterOpponentModel(
        preferences.openRouterOpponentModel || DEFAULT_OPENROUTER_MODEL,
      );
      setOpenRouterJudgeModel(
        preferences.openRouterJudgeModel || DEFAULT_OPENROUTER_MODEL,
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

    const session = createDebateSession(selectedTopic, sideSelection);
    upsertLocalSession(session);
    router.push(`/debate/${session.id}`);
  }

  function focusSetup() {
    document.getElementById("setup-debat")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <PageShell>
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase text-amber-100">
            Personal MVP
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white sm:text-6xl">
            Republik Argumen
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
            Naik pangkat bukan karena paling berisik, tetapi karena paling bernas.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={focusSetup}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
            >
              Isi OpenRouter Key
              <ArrowDown size={18} aria-hidden="true" />
            </button>
            <Link
              href="/history"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/10 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
            >
              <History size={17} aria-hidden="true" />
              Riwayat Debat Lokal
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-400">
            Personal MVP - data tersimpan di browser ini.
          </p>
        </div>

        <div
          id="setup-debat"
          className="scroll-mt-6 rounded-lg border border-white/10 bg-slate-950/75 p-5"
        >
          <h2 className="text-lg font-semibold text-white">Setup Debat</h2>
          <div className="mt-5">
            <p className="mb-3 text-sm font-medium text-slate-300">Posisi</p>
            <SideSelector value={sideSelection} onChange={setSideSelection} />
          </div>
          <div className="mt-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300">
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
              className="min-h-12 w-full rounded-md border border-white/10 bg-slate-900/85 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-cyan-300/60"
            />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block text-sm text-slate-300">
                <span>Model lawan</span>
                <select
                  value={openRouterOpponentModel}
                  onChange={(event) =>
                    setOpenRouterOpponentModel(event.target.value)
                  }
                  className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-900/85 px-3 py-2 text-sm text-white placeholder:text-slate-500 transition focus:border-cyan-300/60"
                >
                  {CHEAP_OPENROUTER_MODELS.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm text-slate-300">
                <span>Model wasit</span>
                <select
                  value={openRouterJudgeModel}
                  onChange={(event) =>
                    setOpenRouterJudgeModel(event.target.value)
                  }
                  className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-900/85 px-3 py-2 text-sm text-white placeholder:text-slate-500 transition focus:border-cyan-300/60"
                >
                  {CHEAP_OPENROUTER_MODELS.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Default gratis: {DEFAULT_OPENROUTER_MODEL}. Jika kena limit,
              coba model murah berbayar di dropdown. Key tersimpan lokal di
              browser ini dan tidak ikut diekspor.
            </p>
            <div className="mt-3">
              <ErrorBanner message={setupError} />
            </div>
            <button
              type="button"
              onClick={startDebate}
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
            >
              Simpan & Mulai Debat
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 rounded-md border border-cyan-300/20 bg-cyan-300/10 p-4">
            <p className="text-sm font-semibold text-cyan-100">Topik Terpilih</p>
            <p className="mt-2 text-base font-semibold leading-6 text-white">
              {selectedTopic.title}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {selectedTopic.shortContext}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white">Pilih Topik</h2>
          <span className="rounded-md border border-white/10 px-3 py-1 text-xs uppercase text-slate-400">
            {debateTopics.length} topik
          </span>
        </div>
        <TopicSelector
          topics={debateTopics}
          selectedTopic={selectedTopic}
          onSelect={setSelectedTopic}
        />
      </section>
    </PageShell>
  );
}
