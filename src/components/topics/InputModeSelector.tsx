import { Camera, Keyboard, Mic, type LucideIcon } from "lucide-react";
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
            className={`flex min-h-28 flex-col items-start justify-between rounded-md border p-3 text-left transition ${
              selected
                ? "border-cyan-300/70 bg-cyan-300/15 text-cyan-100"
                : "border-white/10 bg-slate-900/75 text-slate-200 hover:border-cyan-300/40 hover:bg-slate-900"
            }`}
          >
            <Icon size={18} aria-hidden="true" />
            <span>
              <span className="block text-sm font-semibold">{mode.label}</span>
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
