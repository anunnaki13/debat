"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Medal,
  RotateCcw,
  Share2,
  Swords,
  Trophy,
} from "lucide-react";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { JudgeReportPanel } from "@/components/judge/JudgeReportPanel";
import { TranscriptAccordion } from "@/components/judge/TranscriptAccordion";
import { PageShell } from "@/components/layout/PageShell";
import { Badge, Button } from "@/components/ui";
import { arenaReferenceAssets, personaPortraits } from "@/lib/arena-reference-assets";
import { createDebateSession } from "@/lib/debate/session";
import {
  createExportFilename,
  getLocalSession,
  upsertLocalSession,
} from "@/lib/storage/localSessions";
import { downloadJson } from "@/lib/utils/downloadJson";
import type { DebateSession } from "@/types/debate";
import { useEffect, useState } from "react";

function getGrade(score: number) {
  if (score >= 90) {
    return {
      code: "S",
      label: "Orator Elite",
      copy: "Argumen tajam, stabil, dan sulit digoyang.",
    };
  }

  if (score >= 80) {
    return {
      code: "A",
      label: "Kandidat Kuat",
      copy: "Fondasi debat kuat dengan ruang polish yang jelas.",
    };
  }

  if (score >= 70) {
    return {
      code: "B",
      label: "Penantang Serius",
      copy: "Sudah kompetitif, tinggal perkuat bukti dan rebuttal.",
    };
  }

  if (score >= 60) {
    return {
      code: "C",
      label: "Fondasi Naik",
      copy: "Arah argumen sudah ada, latihan berikutnya akan terasa signifikan.",
    };
  }

  return {
    code: "D",
    label: "Ronde Latihan",
    copy: "Belum final. Ini bahan sparring untuk comeback yang lebih rapi.",
  };
}

export function ResultScreen({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [session, setSession] = useState<DebateSession | null>(null);

  useEffect(() => {
    queueMicrotask(() => setSession(getLocalSession(sessionId)));
  }, [sessionId]);

  if (!session) {
    return (
      <PageShell>
        <ErrorBanner message="Laporan debat tidak ditemukan di browser ini." />
      </PageShell>
    );
  }

  if (!session.report) {
    return (
      <PageShell className="space-y-4">
        <ErrorBanner message="Sesi ini belum memiliki laporan AI Judge." />
        <Link
          href={`/debate/${session.id}`}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] px-4 py-2 text-sm font-semibold text-[var(--ra-text-primary)] transition hover:bg-[var(--ra-bg-panel)]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Kembali ke Debat
        </Link>
      </PageShell>
    );
  }

  const grade = getGrade(session.report.overallScore);

  function debateAgain() {
    if (!session) {
      return;
    }

    const nextSession = createDebateSession(session.topic, session.userSide);
    upsertLocalSession(nextSession);
    router.push(`/debate/${nextSession.id}`);
  }

  return (
    <PageShell className="space-y-6">
      <section className="relative overflow-hidden rounded-[var(--ra-radius-xl)] border border-[rgba(90,142,255,0.34)] bg-[#050914] p-4 shadow-[var(--ra-shadow-elevated)] md:p-6">
        <Image
          src={arenaReferenceAssets.arenaStageWide}
          alt=""
          fill
          sizes="(min-width: 1024px) calc(100vw - 280px), 100vw"
          className="object-cover object-center opacity-[0.42]"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(21,248,255,0.22),transparent_34%),radial-gradient(circle_at_82%_8%,rgba(255,43,214,0.18),transparent_34%),linear-gradient(180deg,rgba(2,8,23,0.50),rgba(2,8,23,0.95))]" />

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-stretch">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="prestige" className="gap-2">
                <Trophy size={14} aria-hidden="true" />
                Result Reveal
              </Badge>
              <Badge tone="user">{session.topic.category}</Badge>
              <Badge tone="ai">{session.userSide} vs {session.opponentSide}</Badge>
            </div>

            <h1 className="mt-5 max-w-4xl font-serif text-2xl font-black leading-tight text-[var(--ra-text-primary)] sm:text-3xl md:text-5xl">
              {session.topic.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--ra-text-secondary)]">
              {session.topic.shortContext}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <ResultStat label="Grade" value={grade.code} detail={grade.label} />
              <ResultStat
                label="Skor"
                value={`${session.report.overallScore}`}
                detail="Overall"
              />
              <ResultStat
                label="Sesi"
                value={`${session.messages.length}`}
                detail="Pesan debat"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={debateAgain}
                leadingIcon={<RotateCcw size={18} aria-hidden="true" />}
              >
                Debat Lagi
              </Button>
              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] bg-[rgba(7,11,19,0.62)] px-5 py-3 text-base font-semibold text-[var(--ra-text-primary)] transition hover:bg-[var(--ra-bg-panel)]"
              >
                <Swords size={18} aria-hidden="true" />
                Pilih Topik Baru
              </Link>
              <button
                type="button"
                onClick={() => downloadJson(createExportFilename(session), session)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--ra-radius-md)] border border-[var(--ra-gold)] bg-[var(--ra-gold-soft)] px-5 py-3 text-base font-semibold text-[var(--ra-gold-bright)] transition hover:brightness-110"
              >
                <Download size={18} aria-hidden="true" />
                Export JSON
              </button>
            </div>
          </div>

          <SharePreviewCard session={session} grade={grade} />
        </div>
      </section>

      <JudgeReportPanel
        report={session.report}
        deliveryReport={session.deliveryReport}
      />
      <TranscriptAccordion messages={session.messages} />
    </PageShell>
  );
}

function ResultStat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[var(--ra-radius-lg)] border border-[rgba(90,142,255,0.22)] bg-[rgba(2,8,23,0.72)] p-4 shadow-[var(--ra-shadow-card)]">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--ra-text-muted)]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-[var(--ra-text-primary)]">
        {value}
      </p>
      <p className="mt-1 text-sm font-semibold text-[var(--ra-electric-cyan)]">
        {detail}
      </p>
    </div>
  );
}

function SharePreviewCard({
  session,
  grade,
}: {
  session: DebateSession;
  grade: ReturnType<typeof getGrade>;
}) {
  const score = session.report?.overallScore ?? 0;

  return (
    <aside className="relative overflow-hidden rounded-[var(--ra-radius-xl)] border border-[rgba(123,93,255,0.36)] bg-[rgba(8,10,26,0.88)] p-5 shadow-[var(--ra-shadow-card)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(123,93,255,0.24),transparent_44%)]" />
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <Badge tone="special" className="gap-2">
            <Share2 size={14} aria-hidden="true" />
            Kartu Hasil
          </Badge>
          <Medal size={22} className="text-[var(--ra-gold-bright)]" aria-hidden="true" />
        </div>

        <div className="mt-5 flex items-center gap-4">
          <span
            className="h-20 w-20 shrink-0 rounded-[var(--ra-radius-pill)] border border-[var(--ra-electric-cyan)] bg-cover shadow-[var(--ra-glow-esports-cyan)]"
            style={{
              backgroundImage: `url(${personaPortraits.livePlayer})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-[var(--ra-text-primary)]">
              Arena Politika
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--ra-text-secondary)]">
              {grade.copy}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-[var(--ra-radius-lg)] border border-[rgba(255,255,255,0.12)] bg-[rgba(2,8,23,0.70)] p-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--ra-text-muted)]">
                Grade
              </p>
              <p className="mt-1 text-5xl font-black text-[var(--ra-violet)]">
                {grade.code}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--ra-text-muted)]">
                Score
              </p>
              <p className="mt-1 text-4xl font-black text-[var(--ra-electric-cyan)]">
                {score}
              </p>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-[var(--ra-radius-pill)] bg-[rgba(255,255,255,0.08)]">
            <div
              className="h-full rounded-[var(--ra-radius-pill)] bg-[linear-gradient(90deg,var(--ra-electric-cyan),var(--ra-magenta),var(--ra-gold))]"
              style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
            />
          </div>
        </div>

        <p className="mt-5 line-clamp-4 font-serif text-xl font-black leading-tight text-[var(--ra-text-primary)]">
          {session.topic.title}
        </p>
        <Link
          href="/history"
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--ra-radius-md)] border border-[rgba(123,93,255,0.40)] bg-[rgba(123,93,255,0.16)] px-4 text-sm font-bold text-[var(--ra-text-primary)] transition hover:bg-[rgba(123,93,255,0.24)]"
        >
          Lihat Riwayat
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
