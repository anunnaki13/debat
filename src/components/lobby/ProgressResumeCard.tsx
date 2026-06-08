import Link from "next/link";
import { ArrowRight, History, Trophy } from "lucide-react";
import { Badge, Button, Card, CardDescription, CardTitle } from "@/components/ui";

export function ProgressResumeCard({
  completedCount,
  activeCount,
}: {
  completedCount: number;
  activeCount: number;
}) {
  const hasProgress = completedCount > 0 || activeCount > 0;

  return (
    <Card variant="outline" className="bg-[var(--ra-bg-glass)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge tone={hasProgress ? "positive" : "neutral"}>
            {hasProgress ? "Progres lokal" : "Mulai pertama"}
          </Badge>
          <CardTitle className="mt-4">Lanjutkan Progres</CardTitle>
          <CardDescription className="mt-2 max-w-2xl">
            {hasProgress
              ? "Riwayat debatmu tersimpan lokal di browser ini. Gunakan hasil terakhir untuk latihan berikutnya."
              : "Belum ada sesi selesai. Mulai dari Duel Wacana AI dan kumpulkan satu laporan wasit pertama."}
          </CardDescription>
        </div>
        <div className="grid min-w-[170px] grid-cols-2 gap-3">
          <Metric label="Selesai" value={completedCount} />
          <Metric label="Aktif" value={activeCount} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/history"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] px-4 py-2 text-sm font-semibold text-[var(--ra-text-primary)] transition hover:bg-[var(--ra-bg-panel-strong)]"
        >
          <History size={17} aria-hidden="true" />
          Buka Riwayat
        </Link>
        <Button
          variant="ghost"
          leadingIcon={<Trophy size={17} aria-hidden="true" />}
          trailingIcon={<ArrowRight size={17} aria-hidden="true" />}
          disabled
        >
          Rekomendasi Latihan
        </Button>
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[var(--ra-radius-md)] border border-[var(--ra-border-subtle)] bg-[var(--ra-bg-panel)] p-3 text-center">
      <p className="font-serif text-2xl font-bold text-[var(--ra-text-primary)]">
        {value}
      </p>
      <p className="mt-1 text-xs font-semibold text-[var(--ra-text-muted)]">
        {label}
      </p>
    </div>
  );
}
