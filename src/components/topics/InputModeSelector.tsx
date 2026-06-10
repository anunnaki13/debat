import { Camera, Keyboard, Mic, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import type { DebateInputMode } from "@/types/debate";

const inputModes: Array<{
  value: DebateInputMode;
  label: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    value: "TEXT",
    label: "Text",
    description: "Ketik argumen. Fallback utama yang selalu tersedia.",
    icon: Keyboard,
  },
  {
    value: "VOICE",
    label: "Voice",
    description: "Gunakan mikrofon, lalu koreksi transkrip sebelum kirim.",
    icon: Mic,
  },
  {
    value: "VOICE_CAMERA",
    label: "Voice + Camera",
    description: "Preview kamera lokal untuk rasa podium. Video tidak dikirim.",
    icon: Camera,
  },
];

export function InputModeSelector({
  value,
  onChange,
}: {
  value: DebateInputMode;
  onChange: (value: DebateInputMode) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {inputModes.map((mode) => {
        const Icon = mode.icon;
        const selected = value === mode.value;

        return (
          <button
            key={mode.value}
            type="button"
            onClick={() => onChange(mode.value)}
            aria-pressed={selected}
            className={cn(
              "ra-hud-panel relative flex min-h-32 flex-col items-start justify-between overflow-hidden rounded-[var(--ra-radius-md)] border p-3 text-left transition duration-150",
              selected
                ? "border-[var(--ra-electric-cyan)] bg-[rgba(21,248,255,0.14)] text-[var(--ra-cyan-bright)] shadow-[var(--ra-glow-esports-cyan)]"
                : "border-[rgba(255,255,255,0.12)] bg-[rgba(7,16,28,0.76)] text-[var(--ra-text-secondary)] hover:border-[var(--ra-electric-cyan)] hover:bg-[rgba(7,16,28,0.92)] hover:text-[var(--ra-text-primary)]",
            )}
          >
            <span className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--ra-electric-cyan),var(--ra-magenta))] opacity-60" />
            <span
              className={cn(
                "grid h-10 w-10 place-items-center rounded-[var(--ra-radius-md)] border",
                selected
                  ? "border-[var(--ra-electric-cyan)] bg-[rgba(21,248,255,0.18)]"
                  : "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)]",
              )}
            >
              <Icon size={18} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-black uppercase tracking-[0.08em]">
                {mode.label}
              </span>
              <span className="mt-1 block text-xs leading-5 text-[var(--ra-text-muted)]">
                {mode.description}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
