"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { SpiceMeter } from "@/components/topics/SpiceMeter";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { DebateTopic } from "@/types/debate";

const challengeArt: Record<string, { src: string; position: string; tone: "blue" | "green" | "gold" | "red" }> = {
  "ai-jobs": {
    src: "/assets/challenges/ai-jobs-unsplash.jpg",
    position: "center",
    tone: "blue",
  },
  "remote-work": {
    src: "/assets/challenges/remote-work-unsplash.jpg",
    position: "center",
    tone: "green",
  },
  cashless: {
    src: "/assets/challenges/cashless-unsplash.jpg",
    position: "center",
    tone: "gold",
  },
  "public-transport": {
    src: "/assets/challenges/public-transport-unsplash.jpg",
    position: "center",
    tone: "red",
  },
};

export function PopularChallengeStrip({
  topics,
  selectedTopic,
  onSelect,
}: {
  topics: DebateTopic[];
  selectedTopic: DebateTopic;
  onSelect: (topic: DebateTopic) => void;
}) {
  const featured = topics.filter((topic) => challengeArt[topic.id]).slice(0, 4);

  return (
    <section aria-labelledby="popular-challenge-title" className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Badge tone="user">Topik Pilihan</Badge>
          <h2
            id="popular-challenge-title"
            className="mt-3 text-xl font-black uppercase tracking-wide text-[var(--ra-text-primary)]"
          >
            Pilih arena yang ingin dipanasi
          </h2>
        </div>
      </div>
      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {featured.map((topic) => {
          const selected = topic.id === selectedTopic.id;

          return (
            <button
              key={topic.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(topic)}
              className={cn(
                "ra-hud-panel group relative min-h-[170px] min-w-[260px] snap-start overflow-hidden rounded-[var(--ra-radius-lg)] border p-4 text-left shadow-[var(--ra-shadow-card)] transition duration-150 sm:min-w-[280px] lg:min-w-0 lg:flex-1",
                selected
                  ? "border-[rgba(89,171,255,0.74)] shadow-[0_0_34px_rgba(55,137,255,0.28)]"
                  : "border-[rgba(255,255,255,0.13)] hover:border-[rgba(89,171,255,0.54)] hover:shadow-[0_0_34px_rgba(55,137,255,0.20)]",
              )}
            >
              <Image
                src={challengeArt[topic.id].src}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, 280px"
                className="object-cover opacity-95 transition duration-300 group-hover:scale-[1.04]"
                style={{ objectPosition: challengeArt[topic.id].position }}
                aria-hidden="true"
              />
              <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,23,0.08),rgba(2,8,23,0.34)_44%,rgba(2,8,23,0.98))]" />
              <span
                className={cn(
                  "absolute inset-x-0 top-0 h-1",
                  challengeArt[topic.id].tone === "green"
                    ? "bg-[var(--ra-emerald)]"
                    : challengeArt[topic.id].tone === "gold"
                      ? "bg-[var(--ra-gold)]"
                      : challengeArt[topic.id].tone === "red"
                        ? "bg-[var(--ra-coral)]"
                        : "bg-[#48caff]",
                )}
              />
              <div className="relative z-[1] flex items-start justify-between gap-3">
                <Badge tone={topic.difficulty === "lanjutan" ? "warning" : "positive"}>
                  {topic.category.split(" ")[0]}
                </Badge>
                {selected ? (
                  <CheckCircle2
                    size={18}
                    aria-hidden="true"
                    className="text-[var(--ra-cyan-bright)]"
                  />
                ) : null}
              </div>

              <div className="relative z-[1] mt-14">
                <h3 className="line-clamp-2 text-[15px] font-black leading-snug text-[var(--ra-text-primary)]">
                  {topic.title}
                </h3>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-bold text-[var(--ra-text-secondary)]">
                  <span className="inline-flex items-center gap-1 rounded-[var(--ra-radius-pill)] bg-[rgba(7,11,19,0.70)] px-2 py-1">
                    {topic.difficulty === "lanjutan" ? "Lanjutan" : "Pemula"}
                  </span>
                  <SpiceMeter level={topic.spiceLevel ?? 2} compact />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
