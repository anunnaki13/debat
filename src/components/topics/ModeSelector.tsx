import { Flame, Mic2, Swords, type LucideIcon } from "lucide-react";
import type { DebateMode } from "@/types/debate";

const modes: Array<{
  value: DebateMode;
  label: string;
  description: string;
  enabled: boolean;
  icon: LucideIcon;
}> = [
  {
    value: "DUEL_WACANA_AI",
    label: "Duel Wacana AI",
    description: "Mode utama: Anda melawan satu AI dalam tiga ronde.",
    enabled: true,
    icon: Swords,
  },
  {
    value: "KURSI_PANAS_AI",
    label: "Kursi Panas AI",
    description: "Satu lawan beberapa persona AI. Disiapkan untuk sprint lanjut.",
    enabled: false,
    icon: Flame,
  },
  {
    value: "PRIVATE_OPINION",
    label: "Pasang Pendapat Privat",
    description: "Buat tesis sendiri lalu debat privat. Disiapkan sebagai placeholder.",
    enabled: false,
    icon: Mic2,
  },
];

export function ModeSelector({
  value,
  onChange,
}: {
  value: DebateMode;
  onChange: (value: DebateMode) => void;
}) {
  return (
    <div className="grid gap-3">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const selected = value === mode.value;

        return (
          <button
            key={mode.value}
            type="button"
            disabled={!mode.enabled}
            onClick={() => onChange(mode.value)}
            className={`flex min-h-20 items-start gap-3 rounded-md border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-55 ${
              selected
                ? "border-cyan-300/70 bg-cyan-300/15"
                : "border-white/10 bg-slate-900/75 hover:border-cyan-300/40 hover:bg-slate-900"
            }`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-cyan-300/25 text-cyan-100">
              <Icon size={18} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-white">
                {mode.label}
              </span>
              <span className="mt-1 block text-xs leading-5 text-slate-400">
                {mode.description}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
