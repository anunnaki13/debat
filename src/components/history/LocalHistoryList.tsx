"use client";

import Link from "next/link";
import { ExternalLink, Trash2 } from "lucide-react";
import type { DebateSession } from "@/types/debate";

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function LocalHistoryList({
  sessions,
  onDelete,
}: {
  sessions: DebateSession[];
  onDelete: (sessionId: string) => void;
}) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-white/15 bg-slate-950/60 p-8 text-center text-sm text-slate-400">
        Belum ada debat selesai di browser ini.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <article
          key={session.id}
          className="rounded-lg border border-white/10 bg-slate-950/75 p-4"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs text-slate-400">
                {formatDate(session.completedAt ?? session.startedAt)} -{" "}
                {session.userSide}
              </p>
              <h2 className="mt-2 text-base font-semibold leading-6 text-white">
                {session.topic.title}
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                {session.report
                  ? `${session.report.playfulTitle} - ${session.report.overallScore}`
                  : "Belum ada skor"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/result/${session.id}`}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
              >
                <ExternalLink size={16} aria-hidden="true" />
                Buka Report
              </Link>
              <button
                type="button"
                onClick={() => onDelete(session.id)}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-red-300/30 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-300/10"
              >
                <Trash2 size={16} aria-hidden="true" />
                Hapus
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
