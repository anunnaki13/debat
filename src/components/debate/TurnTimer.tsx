import { Clock } from "lucide-react";
import { cn } from "@/lib/cn";

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
      className={cn(
        "inline-flex min-h-10 items-center gap-2 rounded-[var(--ra-radius-md)] border px-3 py-2 text-sm font-semibold",
        expired
          ? "border-[var(--ra-amber)] bg-[var(--ra-amber-soft)] text-[var(--ra-amber)]"
          : "border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] text-[var(--ra-text-primary)]",
      )}
    >
      <Clock size={16} aria-hidden="true" />
      <span>{expired ? "Waktu lewat" : formatSeconds(remainingSeconds)}</span>
    </div>
  );
}
