import { CheckCircle2, Flame } from "lucide-react";
import { Badge } from "@/components/ui";
import type { DebateTopic } from "@/types/debate";

const difficultyTone = {
  pemula: "positive",
  menengah: "prestige",
  lanjutan: "warning",
} as const;

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
      className={`flex h-full min-h-52 flex-col rounded-[var(--ra-radius-lg)] border p-4 text-left transition duration-150 ${
        selected
          ? "border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] shadow-[var(--ra-glow-user)]"
          : "border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] hover:border-[var(--ra-border-strong)] hover:bg-[var(--ra-bg-panel-strong)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <Badge tone="prestige">{topic.category}</Badge>
        {selected ? (
          <CheckCircle2
            className="text-[var(--ra-cyan-bright)]"
            size={18}
            aria-hidden="true"
          />
        ) : null}
      </div>
      <h3 className="mt-4 font-serif text-xl font-bold leading-tight text-[var(--ra-text-primary)]">
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
          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--ra-text-muted)]"
          aria-label="Spice level dua dari empat"
        >
          {[0, 1, 2, 3].map((index) => (
            <Flame
              key={index}
              size={13}
              aria-hidden="true"
              className={
                index < 2
                  ? "text-[var(--ra-amber)]"
                  : "text-[var(--ra-text-disabled)]"
              }
            />
          ))}
        </span>
      </div>
    </button>
  );
}
