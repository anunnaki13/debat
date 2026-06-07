import { CheckCircle2 } from "lucide-react";
import type { DebateTopic } from "@/types/debate";

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
      className={`flex h-full min-h-48 flex-col rounded-lg border p-4 text-left transition ${
        selected
          ? "border-cyan-300/70 bg-cyan-300/15 shadow-lg shadow-cyan-950/30"
          : "border-white/10 bg-slate-900/75 hover:border-cyan-300/40 hover:bg-slate-900"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-md border border-amber-200/25 bg-amber-300/10 px-2 py-1 text-xs font-medium text-amber-100">
          {topic.category}
        </span>
        {selected ? (
          <CheckCircle2 className="text-cyan-200" size={18} aria-hidden="true" />
        ) : null}
      </div>
      <h3 className="mt-4 text-base font-semibold leading-6 text-white">
        {topic.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-300">
        {topic.shortContext}
      </p>
      <span className="mt-4 text-xs uppercase text-slate-400">
        {topic.difficulty}
      </span>
    </button>
  );
}
