import { Building2, Flame, Mic2, Skull, Swords } from "lucide-react";
import { ModeCard } from "@/components/lobby/ModeCard";
import { arenaReferenceAssets } from "@/lib/arena-reference-assets";
import type { DebateMode } from "@/types/debate";

const modes = [
  {
    id: "duel-ai",
    value: "DUEL_WACANA_AI",
    title: "Duel AI",
    subtitle: "1 lawan 1",
    icon: Swords,
    accent: "cyan",
    estimatedDuration: "8 KA",
    difficulty: "3 ronde",
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
    subtitle: "Bertahan dari banyak penantang",
    icon: Flame,
    accent: "amber",
    estimatedDuration: "12 KA",
    difficulty: "Sulit",
    badge: undefined,
    artSrc: arenaReferenceAssets.arenaStoryboard.src,
    artPosition: "19% 18%",
    enabled: false,
    comingSoon: true,
  },
  {
    id: "satu-lawan-tribun",
    value: "PRIVATE_OPINION",
    title: "Satu Lawan Tribun",
    subtitle: "Mode format khusus",
    icon: Mic2,
    accent: "emerald",
    estimatedDuration: "15 KA",
    difficulty: "Viral",
    badge: undefined,
    artSrc: arenaReferenceAssets.arenaStoryboard.src,
    artPosition: "84% 78%",
    enabled: false,
    comingSoon: true,
  },
  {
    id: "majelis-publik",
    value: "PRIVATE_OPINION",
    title: "Majelis Publik",
    subtitle: "Debat topik serius",
    icon: Building2,
    accent: "violet",
    estimatedDuration: "10 KA",
    difficulty: "Kebijakan",
    badge: undefined,
    artSrc: arenaReferenceAssets.arenaStageWide.src,
    artPosition: "center",
    enabled: false,
    comingSoon: true,
  },
  {
    id: "boss-battle",
    value: "PRIVATE_OPINION",
    title: "Boss Battle",
    subtitle: "AI Expert",
    icon: Skull,
    accent: "cyan",
    estimatedDuration: "20 KA",
    difficulty: "Expert",
    badge: undefined,
    artSrc: arenaReferenceAssets.verticalArenaFrame.src,
    artPosition: "center 70%",
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
    <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      {modes.map((mode) => (
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
