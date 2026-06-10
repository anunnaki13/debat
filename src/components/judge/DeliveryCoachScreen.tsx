"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Gauge,
  Mic2,
  PauseCircle,
  Timer,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { PageShell } from "@/components/layout/PageShell";
import { Badge, Card, CardDescription, CardTitle } from "@/components/ui";
import { getLocalSession } from "@/lib/storage/localSessions";
import type { DebateSession, DeliveryReport } from "@/types/debate";

export function DeliveryCoachScreen({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<DebateSession | null>(null);

  useEffect(() => {
    queueMicrotask(() => setSession(getLocalSession(sessionId)));
  }, [sessionId]);

  if (!session) {
    return (
      <PageShell>
        <ErrorBanner message="Sesi debat tidak ditemukan di browser ini." />
      </PageShell>
    );
  }

  return (
    <PageShell className="space-y-6">
      <section className="rounded-[var(--ra-radius-xl)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-glass)] p-5 shadow-[var(--ra-shadow-elevated)] md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="special">Delivery Coach</Badge>
            <Badge tone={session.inputMode === "TEXT" ? "neutral" : "user"}>
              {session.inputMode}
            </Badge>
          </div>
          <Link
            href={`/results/${session.id}`}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] px-3 text-sm font-semibold text-[var(--ra-text-secondary)] transition hover:bg-[var(--ra-bg-panel)] hover:text-[var(--ra-text-primary)]"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Kembali ke Result
          </Link>
        </div>
        <h1 className="mt-5 font-serif text-3xl font-black leading-tight text-[var(--ra-text-primary)] sm:text-4xl">
          Latihan penyampaian
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ra-text-secondary)] sm:text-base sm:leading-7">
          Delivery Coach membaca sinyal teknis dari mode voice. Tidak ada face
          emotion recognition, lie detection, atau diagnosis psikologis.
        </p>
      </section>

      {session.deliveryReport ? (
        <DeliveryReportPanel report={session.deliveryReport} />
      ) : (
        <Card variant="outline">
          <Badge tone="warning">Belum tersedia</Badge>
          <CardTitle className="mt-4">Data delivery belum ada</CardTitle>
          <CardDescription className="mt-2">
            Mainkan sesi dengan mode voice untuk mengumpulkan sinyal delivery.
            Mode teks tetap bisa dinilai oleh AI Judge, tetapi tidak memiliki
            meter bicara.
          </CardDescription>
          <Link
            href="/play"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[var(--ra-radius-md)] bg-[var(--ra-action)] px-4 text-sm font-bold text-[var(--ra-text-inverse)]"
          >
            Mulai Sesi Voice
          </Link>
        </Card>
      )}
    </PageShell>
  );
}

function DeliveryReportPanel({ report }: { report: DeliveryReport }) {
  const signals = report.signals;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Card variant="elevated">
        <Badge tone="positive">Ringkasan</Badge>
        <CardTitle className="mt-4">Sinyal teknis bicara</CardTitle>
        <CardDescription className="mt-2">{report.summary}</CardDescription>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <MetricCard
            icon={Gauge}
            label="Kecepatan"
            value={`${signals.wordsPerMinute} WPM`}
            detail="Kata per menit"
          />
          <MetricCard
            icon={Timer}
            label="Durasi"
            value={`${Math.round(signals.durationMs / 1000)} detik`}
            detail="Total input voice"
          />
          <MetricCard
            icon={PauseCircle}
            label="Rasio jeda"
            value={`${Math.round(signals.pauseRatio * 100)}%`}
            detail="Estimasi hening"
          />
          <MetricCard
            icon={Volume2}
            label="Stabilitas volume"
            value={`${Math.round(signals.volumeStability * 100)}%`}
            detail="Konsistensi sinyal"
          />
          <MetricCard
            icon={Mic2}
            label="Filler words"
            value={`${signals.fillerWordCount}`}
            detail="Estimasi kata pengisi"
          />
          <MetricCard
            icon={Gauge}
            label="Interupsi"
            value={`${signals.interruptionCount}`}
            detail="Event interupsi"
          />
        </div>
      </Card>

      <aside className="space-y-4">
        <Card variant="outline">
          <Badge tone="special">Saran</Badge>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--ra-text-secondary)]">
            {report.suggestions.map((suggestion) => (
              <li
                key={suggestion}
                className="rounded-[var(--ra-radius-md)] border border-[var(--ra-border-subtle)] bg-[var(--ra-bg-panel)] p-3"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </Card>
        <Card variant="outline">
          <Badge tone="warning">Batasan</Badge>
          <p className="mt-4 text-sm leading-6 text-[var(--ra-text-secondary)]">
            {report.disclaimer}
          </p>
        </Card>
      </aside>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[var(--ra-radius-lg)] border border-[var(--ra-border-subtle)] bg-[var(--ra-bg-panel)] p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--ra-radius-md)] border border-[rgba(50,212,209,0.32)] bg-[rgba(50,212,209,0.10)] text-[var(--ra-cyan-bright)]">
          <Icon size={18} aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--ra-text-muted)]">
            {label}
          </p>
          <p className="mt-1 text-2xl font-black text-[var(--ra-text-primary)]">
            {value}
          </p>
          <p className="mt-1 text-xs text-[var(--ra-text-muted)]">{detail}</p>
        </div>
      </div>
    </div>
  );
}
