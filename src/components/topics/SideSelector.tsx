import { Shuffle } from "lucide-react";
import { cn } from "@/lib/cn";
import type { SideSelection } from "@/types/debate";

const options: Array<{ value: SideSelection; label: string }> = [
  { value: "PRO", label: "PRO" },
  { value: "CONTRA", label: "CONTRA" },
  { value: "RANDOM", label: "ACAKKAN POSISI" },
];

export function SideSelector({
  value,
  onChange,
}: {
  value: SideSelection;
  onChange: (value: SideSelection) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={cn(
            "inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--ra-radius-md)] border px-4 py-3 text-sm font-semibold transition duration-150",
            value === option.value
              ? "border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] text-[var(--ra-cyan-bright)] shadow-[var(--ra-glow-user)]"
              : "border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] text-[var(--ra-text-secondary)] hover:border-[var(--ra-border-strong)] hover:bg-[var(--ra-bg-panel-strong)] hover:text-[var(--ra-text-primary)]",
          )}
        >
          {option.value === "RANDOM" ? <Shuffle size={16} aria-hidden="true" /> : null}
          {option.label}
        </button>
      ))}
    </div>
  );
}
