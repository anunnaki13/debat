import { Clock } from "lucide-react";

function formatSeconds(seconds: number): string {
  const positive = Math.max(0, seconds);
  const minutes = Math.floor(positive / 60)
    .toString()
    .padStart(2, "0");
  const remainder = (positive % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

export function TurnTimer({ remainingSeconds }: { remainingSeconds: number }) {
  const expired = remainingSeconds <= 0;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
        expired
          ? "border-amber-300/40 bg-amber-300/10 text-amber-100"
          : "border-white/10 bg-slate-900/80 text-slate-200"
      }`}
    >
      <Clock size={16} aria-hidden="true" />
      <span>{expired ? "Waktu lewat" : formatSeconds(remainingSeconds)}</span>
    </div>
  );
}
