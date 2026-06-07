import { Shuffle } from "lucide-react";
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
          className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-semibold transition ${
            value === option.value
              ? "border-cyan-300/70 bg-cyan-300/15 text-cyan-100"
              : "border-white/10 bg-slate-900/75 text-slate-200 hover:border-cyan-300/40 hover:bg-slate-900"
          }`}
        >
          {option.value === "RANDOM" ? <Shuffle size={16} aria-hidden="true" /> : null}
          {option.label}
        </button>
      ))}
    </div>
  );
}
