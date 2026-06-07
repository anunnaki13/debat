import { TopicCard } from "@/components/topics/TopicCard";
import type { DebateTopic } from "@/types/debate";

export function TopicSelector({
  topics,
  selectedTopic,
  onSelect,
}: {
  topics: DebateTopic[];
  selectedTopic: DebateTopic;
  onSelect: (topic: DebateTopic) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {topics.map((topic) => (
        <TopicCard
          key={topic.id}
          topic={topic}
          selected={topic.id === selectedTopic.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
