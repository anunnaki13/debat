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
              "flex min-h-28 flex-col items-start justify-between rounded-[var(--ra-radius-md)] border p-3 text-left transition duration-150",
              selected
                ? "border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] text-[var(--ra-cyan-bright)] shadow-[var(--ra-glow-user)]"
                : "border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] text-[var(--ra-text-secondary)] hover:border-[var(--ra-border-strong)] hover:bg-[var(--ra-bg-panel-strong)] hover:text-[var(--ra-text-primary)]",
            )}
          >
            <Icon size={18} aria-hidden="true" />
            <span>
              <span className="block text-sm font-semibold">{mode.label}</span>
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
