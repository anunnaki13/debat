import { Flame } from "lucide-react";
import { cn } from "@/lib/cn";

export function SpiceMeter({
  level,
  compact = false,
}: {
  level: 1 | 2 | 3 | 4;
  compact?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--ra-text-muted)]"
      aria-label={`Tingkat kepedasan ${level} dari 4`}
    >
      {!compact ? <span>Kepedasan</span> : null}
      {[1, 2, 3, 4].map((index) => (
        <Flame
          key={index}
          size={13}
          aria-hidden="true"
          className={cn(
            index <= level
              ? "text-[var(--ra-amber)]"
              : "text-[var(--ra-text-disabled)]",
          )}
        />
      ))}
    </span>
  );
}
