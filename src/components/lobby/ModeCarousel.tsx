import { Flame, PenLine, Swords } from "lucide-react";
import { ModeCard } from "@/components/lobby/ModeCard";
import { arenaReferenceAssets } from "@/lib/arena-reference-assets";
import { featureFlags } from "@/lib/features/flags";
import type { DebateMode } from "@/types/debate";

const modes = [
  {
    id: "duel-ai",
    value: "DUEL_WACANA_AI",
    title: "Duel Wacana AI",
    subtitle: "1 lawan 1 dengan AI oposisi",
    icon: Swords,
    accent: "cyan",
    estimatedDuration: "3 ronde",
    difficulty: "Text atau voice",
    badge: "Aktif",
    artSrc: arenaReferenceAssets.arenaPoliticsLive.src,
    artPosition: "center 28%",
    enabled: true,
    comingSoon: false,
  },
  {
    id: "kursi-panas",
    value: "KURSI_PANAS_AI",
    title: "Kursi Panas AI",
    subtitle: "Hadapi beberapa persona AI",
    icon: Flame,
    accent: "amber",
    estimatedDuration: "Multi ronde",
    difficulty: "Eksperimen",
    badge: "Beta",
    artSrc: arenaReferenceAssets.arenaStoryboard.src,
    artPosition: "19% 18%",
    enabled: featureFlags.enableHotSeatAi,
    comingSoon: false,
  },
  {
    id: "topik-privat",
    value: "PRIVATE_OPINION",
    title: "Topik Privat",
    subtitle: "Uji tesis buatan sendiri",
    icon: PenLine,
    accent: "violet",
    estimatedDuration: "3 ronde",
    difficulty: "Custom",
    badge: "Aktif",
    artSrc: arenaReferenceAssets.arenaStageWide.src,
    artPosition: "center",
    enabled: true,
    comingSoon: false,
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
    <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      {modes.filter((mode) => mode.enabled).map((mode) => (
        <div key={mode.id} className="min-w-[168px] snap-start sm:min-w-[182px] lg:min-w-[174px] xl:min-w-[178px]">
          <ModeCard
            value={mode.value}
            title={mode.title}
            subtitle={mode.subtitle}
            icon={mode.icon}
            accent={mode.accent}
            estimatedDuration={mode.estimatedDuration}
            difficulty={mode.difficulty}
            badge={mode.badge}
            artSrc={mode.artSrc}
            artAlt=""
            artPosition={mode.artPosition}
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
