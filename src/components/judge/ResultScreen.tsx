"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, RotateCcw } from "lucide-react";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { JudgeReportPanel } from "@/components/judge/JudgeReportPanel";
import { TranscriptAccordion } from "@/components/judge/TranscriptAccordion";
import { PageShell } from "@/components/layout/PageShell";
import { createDebateSession } from "@/lib/debate/session";
import {
  createExportFilename,
  getLocalSession,
  upsertLocalSession,
} from "@/lib/storage/localSessions";
import { downloadJson } from "@/lib/utils/downloadJson";
import type { DebateSession } from "@/types/debate";
import { useEffect, useState } from "react";

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
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Kembali ke Debat
        </Link>
      </PageShell>
    );
  }

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{session.topic.category}</p>
          <h1 className="mt-1 text-2xl font-bold text-white">
            {session.topic.title}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={debateAgain}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
          >
            <RotateCcw size={16} aria-hidden="true" />
            Debat Lagi
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
          >
            Pilih Topik Baru
          </Link>
          <button
            type="button"
            onClick={() => downloadJson(createExportFilename(session), session)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-amber-300/30 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/10"
          >
            <Download size={16} aria-hidden="true" />
            Export JSON
          </button>
        </div>
      </div>

      <JudgeReportPanel report={session.report} />
      <TranscriptAccordion messages={session.messages} />
    </PageShell>
  );
}
