"use client";

import { CheckCircle2, RadioTower, ShieldAlert, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { Badge, Button, Card, CardDescription, CardTitle } from "@/components/ui";

type CheckState = "idle" | "checking" | "ready" | "error";

interface HealthResponse {
  status?: "ok" | "degraded";
  openRouter?: {
    opponentConfigured?: boolean;
    judgeConfigured?: boolean;
    sttConfigured?: boolean;
    ttsConfigured?: boolean;
  };
}

interface OpenRouterCheckResponse {
  message?: string;
  checkedRoles?: string[];
  error?: {
    message?: string;
  };
}

export function DevAiConfig() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [setupError, setSetupError] = useState("");
  const [checkState, setCheckState] = useState<CheckState>("idle");
  const [checkMessage, setCheckMessage] = useState("");

  async function loadHealth() {
    setSetupError("");

    try {
      const response = await fetch("/api/health");
      const payload = (await response.json()) as HealthResponse;

      setHealth(payload);
    } catch {
      setSetupError("Status server AI belum bisa dibaca.");
    }
  }

  async function testOpenRouterConnection() {
    setSetupError("");
    setCheckState("checking");
    setCheckMessage("Mengetes konfigurasi OpenRouter server...");

    try {
      const response = await fetch("/api/ai/openrouter-check", {
        method: "POST",
      });
      const payload = (await response.json()) as OpenRouterCheckResponse;

      if (!response.ok) {
        throw new Error(
          payload.error?.message ?? "Tes OpenRouter server belum berhasil.",
        );
      }

      setCheckState("ready");
      setCheckMessage(
        payload.message ?? "OpenRouter server siap untuk memulai debat.",
      );
      await loadHealth();
    } catch (error) {
      setCheckState("error");
      setCheckMessage("");
      setSetupError(
        error instanceof Error
          ? error.message
          : "Tes OpenRouter server belum berhasil.",
      );
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadHealth();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-[var(--ra-radius-xl)] border border-[var(--ra-border-chrome-soft)] bg-[var(--ra-bg-glass)] p-5 shadow-[var(--ra-shadow-card)] md:p-7">
        <Badge tone="warning">Dev Only</Badge>
        <h1 className="mt-4 font-serif text-3xl font-black text-[var(--ra-text-primary)]">
          AI Config
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ra-text-secondary)]">
          Panel ini hanya membaca konfigurasi server. Rahasia dan model AI
          tidak pernah disimpan di browser atau ditampilkan di respons.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card variant="elevated">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--ra-radius-pill)] border border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] text-[var(--ra-cyan-bright)]">
              <RadioTower size={20} aria-hidden="true" />
            </span>
            <div>
              <CardTitle>OpenRouter server</CardTitle>
              <CardDescription className="mt-2">
                Debat pemain memakai env server untuk role lawan dan wasit.
              </CardDescription>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <StatusRow
              label="Opponent"
              ready={Boolean(health?.openRouter?.opponentConfigured)}
            />
            <StatusRow
              label="Judge"
              ready={Boolean(health?.openRouter?.judgeConfigured)}
            />
            <StatusRow
              label="STT"
              ready={Boolean(health?.openRouter?.sttConfigured)}
            />
            <StatusRow
              label="TTS"
              ready={Boolean(health?.openRouter?.ttsConfigured)}
            />
          </div>

          <ErrorBanner message={setupError} />

          {checkState === "ready" ? (
            <div className="mt-5 flex items-start gap-3 rounded-[var(--ra-radius-md)] border border-[var(--ra-emerald)] bg-[var(--ra-emerald-soft)] px-4 py-3 text-sm text-[var(--ra-emerald)]">
              <CheckCircle2
                className="mt-0.5 shrink-0"
                size={18}
                aria-hidden="true"
              />
              <p>{checkMessage}</p>
            </div>
          ) : checkMessage ? (
            <p className="mt-5 text-sm text-[var(--ra-text-secondary)]">
              {checkMessage}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="secondary" size="lg" onClick={loadHealth}>
              Refresh Health
            </Button>
            <Button
              size="lg"
              onClick={testOpenRouterConnection}
              isLoading={checkState === "checking"}
              leadingIcon={<RadioTower size={18} aria-hidden="true" />}
            >
              Tes OpenRouter Server
            </Button>
          </div>
        </Card>

        <Card variant="outline">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--ra-radius-pill)] border border-[var(--ra-gold)] bg-[var(--ra-gold-soft)] text-[var(--ra-gold-bright)]">
              <ShieldAlert size={20} aria-hidden="true" />
            </span>
            <div>
              <CardTitle className="text-lg">Kontrak keamanan</CardTitle>
              <CardDescription className="mt-2">
                Simpan rahasia hanya di environment server.
              </CardDescription>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm leading-6 text-[var(--ra-text-secondary)]">
            <p>Konfigurasi lawan dan wasit dipisahkan dari sisi server.</p>
            <p>Gunakan rahasia bersama atau rahasia per role sesuai deployment.</p>
            <p>Panel ini tidak menulis rahasia, model, atau provider ke localStorage.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatusRow({ label, ready }: { label: string; ready: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[var(--ra-radius-md)] border border-[var(--ra-border-subtle)] bg-[var(--ra-bg-panel)] p-3">
      <span className="text-sm font-bold text-[var(--ra-text-primary)]">
        {label}
      </span>
      <span
        className={`inline-flex items-center gap-1 text-xs font-bold ${
          ready ? "text-[var(--ra-emerald)]" : "text-[var(--ra-amber)]"
        }`}
      >
        {ready ? (
          <CheckCircle2 size={15} aria-hidden="true" />
        ) : (
          <XCircle size={15} aria-hidden="true" />
        )}
        {ready ? "Configured" : "Missing"}
      </span>
    </div>
  );
}
