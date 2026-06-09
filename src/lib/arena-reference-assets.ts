import type { StaticImageData } from "next/image";
import arenaPoliticsDashboard from "../../asset/ChatGPT Image May 6, 2026, 12_13_33 AM.png";
import arenaPoliticsLive from "../../asset/ChatGPT Image May 6, 2026, 11_08_21 AM.png";
import arenaLogoLarge from "../../asset/ChatGPT Image May 6, 2026, 11_10_32 AM.png";
import fullProductBoard from "../../asset/ChatGPT Image Jun 9, 2026, 08_39_22 AM.png";
import arenaStageWide from "../../asset/ChatGPT Image Jun 9, 2026, 11_28_21 AM (4).png";
import arenaStagePodium from "../../asset/ChatGPT Image Jun 9, 2026, 11_28_16 AM (1).png";
import personaSheet from "../../asset/ChatGPT Image Jun 9, 2026, 11_28_17 AM (2).png";
import arenaStoryboard from "../../asset/ChatGPT Image Jun 9, 2026, 11_28_20 AM (3).png";
import badgeSheet from "../../asset/ChatGPT Image Jun 9, 2026, 11_28_22 AM (5).png";
import verticalArenaFrame from "../../asset/ChatGPT Image Jun 9, 2026, 11_28_24 AM (6).png";

export const arenaReferenceAssets = {
  arenaPoliticsDashboard,
  arenaPoliticsLive,
  arenaLogoLarge,
  fullProductBoard,
  arenaStageWide,
  arenaStagePodium,
  personaSheet,
  arenaStoryboard,
  badgeSheet,
  verticalArenaFrame,
} satisfies Record<string, StaticImageData>;

export const personaCrop = {
  reformer: {
    backgroundPosition: "0% 0%",
    backgroundSize: "300% 200%",
  },
  strategist: {
    backgroundPosition: "50% 0%",
    backgroundSize: "300% 200%",
  },
  investigator: {
    backgroundPosition: "100% 0%",
    backgroundSize: "300% 200%",
  },
  fieldCommander: {
    backgroundPosition: "25% 100%",
    backgroundSize: "300% 200%",
  },
  publicVoice: {
    backgroundPosition: "75% 100%",
    backgroundSize: "300% 200%",
  },
} as const;

export type PersonaCropKey = keyof typeof personaCrop;
