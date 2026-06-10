"use client";

import Link from "next/link";
import { CheckCircle2, Settings, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Badge, Card, CardDescription, CardTitle } from "@/components/ui";
import {
  DEFAULT_PREFERENCES,
  getPreferences,
  savePreferences,
} from "@/lib/storage/localSessions";
import type { UserPreferences } from "@/types/debate";

export function SettingsScreen() {
  const [preferences, setPreferences] =
    useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [savedMessage, setSavedMessage] = useState("");
  const showDevConfig = process.env.NODE_ENV !== "production";

  useEffect(() => {
    queueMicrotask(() => setPreferences(getPreferences()));
  }, []);

  function updatePreference(update: Partial<UserPreferences>) {
    const nextPreferences = {
      ...preferences,
      ...update,
    };

    setPreferences(nextPreferences);
    savePreferences(nextPreferences);
    setSavedMessage("Pengaturan tersimpan di browser ini.");
  }

  return (
    <PageShell className="space-y-6">
      <section className="rounded-[var(--ra-radius-xl)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-glass)] p-5 shadow-[var(--ra-shadow-elevated)] md:p-6">
        <Badge tone="user">Settings</Badge>
        <h1 className="mt-4 font-serif text-3xl font-black text-[var(--ra-text-primary)]">
          Pengaturan arena
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ra-text-secondary)]">
          Pengaturan user-facing hanya berisi preferensi pengalaman debat.
          Konfigurasi AI tetap berada di server atau route dev.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card variant="elevated">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--ra-radius-pill)] border border-[rgba(50,212,209,0.32)] bg-[rgba(50,212,209,0.10)] text-[var(--ra-cyan-bright)]">
              <Settings size={20} aria-hidden="true" />
            </span>
            <div>
              <CardTitle>Preferensi debat</CardTitle>
              <CardDescription className="mt-2">
                Preferensi ini tersimpan lokal dan bisa berubah kapan saja.
              </CardDescription>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <PreferenceToggle
              title="Voice input aktif"
              description="Izinkan mode voice menggunakan mikrofon dan STT saat user memilih voice."
              checked={preferences.voiceInputEnabled}
              onChange={(checked) =>
                updatePreference({ voiceInputEnabled: checked })
              }
            />
            <PreferenceToggle
              title="AI auto-speak"
              description="Putar suara AI otomatis setelah lawan AI membalas."
              checked={preferences.autoSpeakOpponent}
              onChange={(checked) =>
                updatePreference({ autoSpeakOpponent: checked })
              }
            />
          </div>

          {savedMessage ? (
            <div className="mt-5 flex items-start gap-3 rounded-[var(--ra-radius-md)] border border-[rgba(44,214,163,0.35)] bg-[rgba(44,214,163,0.10)] px-4 py-3 text-sm text-[var(--ra-emerald)]">
              <CheckCircle2
                className="mt-0.5 shrink-0"
                size={18}
                aria-hidden="true"
              />
              <p>{savedMessage}</p>
            </div>
          ) : null}
        </Card>

        {showDevConfig ? (
          <Card variant="outline">
            <Badge tone="neutral">Dev</Badge>
            <CardTitle className="mt-4 text-lg">AI config</CardTitle>
            <CardDescription className="mt-2">
              Konfigurasi AI tidak tampil di flow pemain. Saat development,
              gunakan route dev-only.
            </CardDescription>
            <Link
              href="/dev/ai-config"
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] px-4 text-sm font-semibold text-[var(--ra-text-primary)] transition hover:border-[var(--ra-cyan)] hover:bg-[var(--ra-cyan-soft)]"
            >
              <Volume2 size={16} aria-hidden="true" />
              Buka Dev AI Config
            </Link>
          </Card>
        ) : null}
      </div>
    </PageShell>
  );
}

function PreferenceToggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-[var(--ra-radius-lg)] border border-[var(--ra-border-subtle)] bg-[var(--ra-bg-panel)] p-4">
      <span>
        <span className="block text-sm font-black text-[var(--ra-text-primary)]">
          {title}
        </span>
        <span className="mt-1 block text-sm leading-6 text-[var(--ra-text-muted)]">
          {description}
        </span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-5 w-5 accent-[var(--ra-cyan)]"
      />
    </label>
  );
}
