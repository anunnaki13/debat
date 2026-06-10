"use client";

import { CheckCircle2, KeyRound, RadioTower, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { Badge, Button, Card, CardDescription, CardTitle } from "@/components/ui";
import {
  CHEAP_OPENROUTER_MODELS,
  DEFAULT_OPENROUTER_MODEL,
} from "@/lib/openrouter/defaults";
import {
  getPreferences,
  savePreferences,
} from "@/lib/storage/localSessions";

type OpenRouterCheckState = "idle" | "checking" | "ready" | "error";

interface OpenRouterCheckResponse {
  message?: string;
  checkedModels?: string[];
  error?: {
    message?: string;
  };
}

export function DevAiConfig() {
  const [openRouterApiKey, setOpenRouterApiKey] = useState("");
  const [openRouterOpponentModel, setOpenRouterOpponentModel] =
    useState(DEFAULT_OPENROUTER_MODEL);
  const [openRouterJudgeModel, setOpenRouterJudgeModel] =
    useState(DEFAULT_OPENROUTER_MODEL);
  const [setupError, setSetupError] = useState("");
  const [openRouterCheckState, setOpenRouterCheckState] =
    useState<OpenRouterCheckState>("idle");
  const [openRouterCheckMessage, setOpenRouterCheckMessage] = useState("");

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

  function readOpenRouterSetup() {
    const trimmedKey = openRouterApiKey.trim();
    const opponentModel =
      openRouterOpponentModel.trim() || DEFAULT_OPENROUTER_MODEL;
    const judgeModel = openRouterJudgeModel.trim() || DEFAULT_OPENROUTER_MODEL;

    return { trimmedKey, opponentModel, judgeModel };
  }

  function persistOpenRouterPreferences() {
    const setup = readOpenRouterSetup();

    savePreferences({
      ...getPreferences(),
      aiProvider: "openrouter",
      openRouterApiKey: setup.trimmedKey,
      openRouterOpponentModel: setup.opponentModel,
      openRouterJudgeModel: setup.judgeModel,
    });

    setSetupError("");
    setOpenRouterCheckState("idle");
    setOpenRouterCheckMessage("Preferensi OpenRouter tersimpan untuk browser ini.");
  }

  function resetOpenRouterCheck() {
    setSetupError("");
    setOpenRouterCheckState("idle");
    setOpenRouterCheckMessage("");
  }

  async function testOpenRouterConnection() {
    const setup = readOpenRouterSetup();

    if (!setup.trimmedKey) {
      setOpenRouterCheckState("error");
      setOpenRouterCheckMessage("");
      setSetupError("Isi OpenRouter API key dulu sebelum tes koneksi.");
      return;
    }

    setSetupError("");
    setOpenRouterCheckState("checking");
    setOpenRouterCheckMessage("Mengetes koneksi OpenRouter...");

    try {
      const response = await fetch("/api/ai/openrouter-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: setup.trimmedKey,
          opponentModel: setup.opponentModel,
          judgeModel: setup.judgeModel,
        }),
      });
      const payload = (await response.json()) as OpenRouterCheckResponse;

      if (!response.ok) {
        throw new Error(
          payload.error?.message ?? "Tes OpenRouter belum berhasil.",
        );
      }

      savePreferences({
        ...getPreferences(),
        aiProvider: "openrouter",
        openRouterApiKey: setup.trimmedKey,
        openRouterOpponentModel: setup.opponentModel,
        openRouterJudgeModel: setup.judgeModel,
      });
      setOpenRouterCheckState("ready");
      setOpenRouterCheckMessage(
        payload.message ?? "OpenRouter siap untuk memulai debat.",
      );
    } catch (error) {
      setOpenRouterCheckState("error");
      setOpenRouterCheckMessage("");
      setSetupError(
        error instanceof Error
          ? error.message
          : "Tes OpenRouter belum berhasil.",
      );
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[var(--ra-radius-xl)] border border-[rgba(90,142,255,0.24)] bg-[rgba(5,12,28,0.82)] p-5 shadow-[var(--ra-shadow-card)] md:p-7">
        <Badge tone="warning">Dev Only</Badge>
        <h1 className="mt-4 font-serif text-3xl font-black text-[var(--ra-text-primary)]">
          AI Config
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ra-text-secondary)]">
          Panel ini hanya untuk development personal. Lobby pemain memakai
          konfigurasi server dan tidak menampilkan API key atau nama model.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card variant="elevated">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--ra-radius-pill)] border border-[rgba(50,212,209,0.32)] bg-[rgba(50,212,209,0.10)] text-[var(--ra-cyan-bright)]">
              <KeyRound size={20} aria-hidden="true" />
            </span>
            <div>
              <CardTitle>OpenRouter local key</CardTitle>
              <CardDescription className="mt-2">
                Gunakan model gratis atau murah untuk QA lokal sebelum server
                env production disiapkan.
              </CardDescription>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <label className="block text-sm font-semibold text-[var(--ra-text-secondary)]">
              <span>OpenRouter API Key</span>
              <input
                aria-label="OpenRouter API Key"
                type="password"
                value={openRouterApiKey}
                onChange={(event) => {
                  setOpenRouterApiKey(event.target.value);
                  resetOpenRouterCheck();
                }}
                autoComplete="off"
                spellCheck={false}
                placeholder="sk-or-..."
                className="mt-2 min-h-12 w-full rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] px-4 py-3 text-sm text-[var(--ra-text-primary)] placeholder:text-[var(--ra-text-muted)] transition focus-visible:border-[var(--ra-cyan)]"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-semibold text-[var(--ra-text-secondary)]">
                <span>Model lawan</span>
                <select
                  value={openRouterOpponentModel}
                  onChange={(event) => {
                    setOpenRouterOpponentModel(event.target.value);
                    resetOpenRouterCheck();
                  }}
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
                  onChange={(event) => {
                    setOpenRouterJudgeModel(event.target.value);
                    resetOpenRouterCheck();
                  }}
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

            <ErrorBanner message={setupError} />

            {openRouterCheckState === "ready" ? (
              <div className="flex items-start gap-3 rounded-[var(--ra-radius-md)] border border-[rgba(44,214,163,0.35)] bg-[rgba(44,214,163,0.10)] px-4 py-3 text-sm text-[var(--ra-emerald)]">
                <CheckCircle2
                  className="mt-0.5 shrink-0"
                  size={18}
                  aria-hidden="true"
                />
                <p>{openRouterCheckMessage}</p>
              </div>
            ) : openRouterCheckMessage ? (
              <p className="text-sm text-[var(--ra-text-secondary)]">
                {openRouterCheckMessage}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                size="lg"
                onClick={persistOpenRouterPreferences}
              >
                Simpan Config
              </Button>
              <Button
                size="lg"
                onClick={testOpenRouterConnection}
                isLoading={openRouterCheckState === "checking"}
                leadingIcon={<RadioTower size={18} aria-hidden="true" />}
              >
                Tes OpenRouter
              </Button>
            </div>
          </div>
        </Card>

        <Card variant="outline">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--ra-radius-pill)] border border-[rgba(216,170,92,0.42)] bg-[rgba(216,170,92,0.10)] text-[var(--ra-gold-bright)]">
              <ShieldAlert size={20} aria-hidden="true" />
            </span>
            <div>
              <CardTitle className="text-lg">Catatan keamanan</CardTitle>
              <CardDescription className="mt-2">
                Key ini hanya disimpan di localStorage browser development.
                Untuk production, pakai environment variable server-side.
              </CardDescription>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm leading-6 text-[var(--ra-text-secondary)]">
            <p>Default gratis: {DEFAULT_OPENROUTER_MODEL}.</p>
            <p>
              Jangan screenshot, commit, atau log nilai API key. Panel ini
              sengaja tidak tersedia pada build production.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
