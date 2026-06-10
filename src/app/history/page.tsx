"use client";

import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { LocalHistoryList } from "@/components/history/LocalHistoryList";
import { PageShell } from "@/components/layout/PageShell";
import {
  clearLocalSessions,
  deleteLocalSession,
  getLocalSessions,
} from "@/lib/storage/localSessions";
import type { DebateSession } from "@/types/debate";

export default function HistoryPage() {
  const [sessions, setSessions] = useState<DebateSession[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setSessions(getLocalSessions()));
  }, []);

  const completedSessions = useMemo(
    () => sessions.filter((session) => session.status === "COMPLETED"),
    [sessions],
  );

  function deleteSession(sessionId: string) {
    setSessions(deleteLocalSession(sessionId));
    setDeleteTarget(null);
  }

  function clearAll() {
    clearLocalSessions();
    setSessions([]);
    setConfirmClearAll(false);
  }

  return (
    <PageShell className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">Local History</p>
          <h1 className="mt-1 text-3xl font-black text-white">
            Riwayat Debat Lokal
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/topics"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Pilih Topik
          </Link>
          <button
            type="button"
            onClick={() => setConfirmClearAll(true)}
            disabled={sessions.length === 0}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-red-300/30 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-300/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} aria-hidden="true" />
            Hapus Semua
          </button>
        </div>
      </div>

      <LocalHistoryList
        sessions={completedSessions}
        onDelete={(sessionId) => setDeleteTarget(sessionId)}
      />

      {deleteTarget ? (
        <ConfirmDialog
          title="Hapus sesi?"
          message="Laporan ini akan dihapus dari localStorage browser."
          confirmLabel="Hapus"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => deleteSession(deleteTarget)}
        />
      ) : null}

      {confirmClearAll ? (
        <ConfirmDialog
          title="Hapus semua data lokal?"
          message="Semua sesi debat lokal di browser ini akan dihapus."
          confirmLabel="Hapus Semua"
          onCancel={() => setConfirmClearAll(false)}
          onConfirm={clearAll}
        />
      ) : null}
    </PageShell>
  );
}
