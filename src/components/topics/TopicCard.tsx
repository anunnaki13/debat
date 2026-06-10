import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { SpiceMeter } from "@/components/topics/SpiceMeter";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { DebateTopic } from "@/types/debate";

const difficultyTone = {
  pemula: "positive",
  menengah: "prestige",
  lanjutan: "warning",
} as const;

const topicVisuals: Partial<Record<string, string>> = {
  "ai-jobs": "/assets/challenges/ai-jobs-unsplash.jpg",
  "remote-work": "/assets/challenges/remote-work-unsplash.jpg",
  cashless: "/assets/challenges/cashless-unsplash.jpg",
  "public-transport": "/assets/challenges/public-transport-unsplash.jpg",
  "ai-schoolwork": "/assets/challenges/education-tech-unsplash.jpg",
};

const categoryVisuals: Record<string, string> = {
  Pekerjaan: "/assets/challenges/remote-work-unsplash.jpg",
  "Ekonomi Digital": "/assets/challenges/cashless-unsplash.jpg",
  "Kebijakan Kota": "/assets/challenges/public-transport-unsplash.jpg",
  "Energi & Transportasi": "/assets/challenges/public-transport-unsplash.jpg",
  "Teknologi & Pekerjaan": "/assets/challenges/ai-jobs-unsplash.jpg",
  "Teknologi & Sosial": "/assets/challenges/cybersecurity-unsplash.jpg",
  Pendidikan: "/assets/challenges/education-tech-unsplash.jpg",
  "Pendidikan & Karier": "/assets/challenges/education-tech-unsplash.jpg",
  "Pendidikan & Teknologi": "/assets/challenges/education-tech-unsplash.jpg",
  "Pendidikan & Kota": "/assets/challenges/education-tech-unsplash.jpg",
  "Lingkungan & Kota": "/assets/challenges/city-park-unsplash.jpg",
  "Lingkungan & Konsumsi": "/assets/challenges/city-park-unsplash.jpg",
  "Lingkungan & Pariwisata": "/assets/challenges/city-park-unsplash.jpg",
  "Teknologi & Privasi": "/assets/challenges/cybersecurity-unsplash.jpg",
  "Olahraga & Manajemen": "/assets/challenges/arena-crowd-unsplash.jpg",
};

function getTopicVisual(topic: DebateTopic) {
  return (
    topicVisuals[topic.id] ??
    categoryVisuals[topic.category] ??
    "/assets/challenges/arena-crowd-unsplash.jpg"
  );
}

export function TopicCard({
  topic,
  selected,
  onSelect,
}: {
  topic: DebateTopic;
  selected: boolean;
  onSelect: (topic: DebateTopic) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(topic)}
      aria-pressed={selected}
      className={cn(
        "group ra-hud-panel relative flex h-full min-h-[250px] flex-col overflow-hidden rounded-[var(--ra-radius-lg)] border p-0 text-left transition duration-150",
        selected
          ? "border-[var(--ra-electric-cyan)] bg-[rgba(21,248,255,0.12)] shadow-[var(--ra-glow-esports-cyan)]"
          : "border-[rgba(255,255,255,0.12)] bg-[rgba(7,16,28,0.82)] hover:border-[var(--ra-electric-cyan)] hover:bg-[rgba(7,16,28,0.95)] hover:shadow-[var(--ra-glow-esports-cyan)]",
      )}
    >
      <div className="relative h-28 overflow-hidden">
        <Image
          src={getTopicVisual(topic)}
          alt=""
          fill
          sizes="(min-width: 1024px) 320px, 100vw"
          className="object-cover opacity-95 transition duration-300 group-hover:scale-[1.04]"
          aria-hidden="true"
        />
        <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,23,0.04),rgba(2,8,23,0.72))]" />
        <span className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--ra-electric-cyan),var(--ra-magenta),var(--ra-gold))]" />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-3">
          <Badge tone="prestige">{topic.category}</Badge>
          {selected ? (
            <CheckCircle2
              className="text-[var(--ra-cyan-bright)]"
              size={20}
              aria-hidden="true"
            />
          ) : null}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
          <span className="rounded-[var(--ra-radius-pill)] border border-[rgba(21,248,255,0.32)] bg-[rgba(7,11,19,0.72)] px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--ra-cyan-bright)]">
            Challenge
          </span>
          <SpiceMeter level={topic.spiceLevel ?? 2} compact />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-black uppercase leading-tight text-[var(--ra-text-primary)]">
          {topic.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-[var(--ra-text-secondary)]">
          {topic.shortContext}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <Badge tone={difficultyTone[topic.difficulty]}>
            {topic.difficulty}
          </Badge>
          <span
            className={cn(
              "text-xs font-black uppercase tracking-[0.14em]",
              selected
                ? "text-[var(--ra-cyan-bright)]"
                : "text-[var(--ra-text-muted)] group-hover:text-[var(--ra-cyan-bright)]",
            )}
          >
            {selected ? "Locked" : "Select"}
          </span>
        </div>
      </div>
    </button>
  );
}
