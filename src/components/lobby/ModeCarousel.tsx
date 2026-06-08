import { Flame, Mic2, Swords } from "lucide-react";
import { ModeCard } from "@/components/lobby/ModeCard";
import type { DebateMode } from "@/types/debate";

const modes = [
  {
    value: "DUEL_WACANA_AI",
    title: "Duel Wacana AI",
    subtitle: "Latihan debat 1 lawan 1 dengan AI dalam tiga ronde.",
    icon: Swords,
    accent: "cyan",
    estimatedDuration: "12-18 menit",
    difficulty: "Pemula",
    badge: "Aktif",
    enabled: true,
    comingSoon: false,
  },
  {
    value: "KURSI_PANAS_AI",
    title: "Kursi Panas AI",
    subtitle: "Hadapi beberapa persona AI secara bergiliran.",
    icon: Flame,
    accent: "amber",
    estimatedDuration: "Sprint lanjut",
    difficulty: "Menantang",
    badge: undefined,
    enabled: false,
    comingSoon: true,
  },
  {
    value: "PRIVATE_OPINION",
    title: "Pasang Pendapat Privat",
    subtitle: "Uji pendapat buatanmu sendiri dengan struktur yang lebih rapi.",
    icon: Mic2,
    accent: "violet",
    estimatedDuration: "Sprint lanjut",
    difficulty: "Menengah",
    badge: undefined,
    enabled: false,
    comingSoon: true,
  },
] as const;

export function ModeCarousel({
  value,
  onChange,
}: {
  value: DebateMode;
  onChange: (value: DebateMode) => void;
}) {
  return (
    <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
      {modes.map((mode) => (
        <div key={mode.value} className="min-w-[260px] snap-start sm:min-w-0">
          <ModeCard
            value={mode.value}
            title={mode.title}
            subtitle={mode.subtitle}
            icon={mode.icon}
            accent={mode.accent}
            estimatedDuration={mode.estimatedDuration}
            difficulty={mode.difficulty}
            badge={mode.badge}
            selected={value === mode.value}
            disabled={!mode.enabled}
            comingSoon={mode.comingSoon}
            onSelect={onChange}
          />
        </div>
      ))}
    </div>
  );
}
