"use client";

import { Plus, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CustomTopicForm } from "@/components/topics/CustomTopicForm";
import { TopicCard } from "@/components/topics/TopicCard";
import { Badge, Button, Card, Chip, ErrorState } from "@/components/ui";
import type { DebateTopic, SideSelection } from "@/types/debate";

const difficulties: Array<DebateTopic["difficulty"]> = [
  "pemula",
  "menengah",
  "lanjutan",
];

export function TopicExplorer({
  topics,
  selectedTopic,
  onSelect,
  onSideChange,
}: {
  topics: DebateTopic[];
  selectedTopic: DebateTopic;
  onSelect: (topic: DebateTopic) => void;
  onSideChange: (side: SideSelection) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [difficulty, setDifficulty] =
    useState<DebateTopic["difficulty"] | "semua">("semua");
  const [spice, setSpice] = useState<1 | 2 | 3 | 4 | "semua">("semua");
  const [showCustomTopic, setShowCustomTopic] = useState(false);
  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set(topics.map((topic) => topic.category)))],
    [topics],
  );
  const filteredTopics = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return topics.filter((topic) => {
      const matchesQuery =
        !normalizedQuery ||
        `${topic.title} ${topic.shortContext} ${topic.category}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory = category === "Semua" || topic.category === category;
      const matchesDifficulty =
        difficulty === "semua" || topic.difficulty === difficulty;
      const matchesSpice = spice === "semua" || topic.spiceLevel === spice;

      return matchesQuery && matchesCategory && matchesDifficulty && matchesSpice;
    });
  }, [category, difficulty, query, spice, topics]);

  useEffect(() => {
    function openCustomTopicFromHash() {
      if (window.location.hash === "#custom-topic") {
        setShowCustomTopic(true);
      }
    }

    const timer = window.setTimeout(openCustomTopicFromHash, 0);
    window.addEventListener("hashchange", openCustomTopicFromHash);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", openCustomTopicFromHash);
    };
  }, []);

  function resetFilters() {
    setQuery("");
    setCategory("Semua");
    setDifficulty("semua");
    setSpice("semua");
  }

  return (
    <div className="space-y-4">
      <Card variant="outline" className="bg-[var(--ra-bg-glass)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge tone="prestige">Tantangan Pilihan</Badge>
            <h2 className="mt-3 font-serif text-2xl font-bold text-[var(--ra-text-primary)]">
              Topik untuk diuji
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--ra-text-secondary)]">
              Filter topik, buat tesis privat, lalu pilih gagasan yang siap
              diserang secara sportif oleh AI.
            </p>
          </div>
          <Button
            variant={showCustomTopic ? "secondary" : "outline"}
            leadingIcon={
              showCustomTopic ? (
                <X size={17} aria-hidden="true" />
              ) : (
                <Plus size={17} aria-hidden="true" />
              )
            }
            onClick={() => setShowCustomTopic((current) => !current)}
          >
            {showCustomTopic ? "Tutup Form" : "Buat Topik Privat"}
          </Button>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <label className="relative block">
            <span className="sr-only">Cari topik</span>
            <Search
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ra-text-muted)]"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari topik, kategori, atau konteks..."
              className="min-h-12 w-full rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] pl-11 pr-4 text-sm text-[var(--ra-text-primary)] placeholder:text-[var(--ra-text-muted)]"
            />
          </label>
          <div className="flex items-center gap-2 rounded-[var(--ra-radius-pill)] border border-[var(--ra-border-default)] px-3 py-2 text-xs font-semibold text-[var(--ra-text-muted)]">
            <span>{filteredTopics.length}</span>
            <span>dari</span>
            <span>{topics.length}</span>
            <span>topik</span>
          </div>
        </div>

        <FilterGroup label="Kategori">
          {categories.map((item) => (
            <Chip
              key={item}
              tone={category === item ? "gold" : "neutral"}
              selected={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </Chip>
          ))}
        </FilterGroup>

        <div className="grid gap-4 lg:grid-cols-2">
          <FilterGroup label="Level">
            <Chip
              tone={difficulty === "semua" ? "cyan" : "neutral"}
              selected={difficulty === "semua"}
              onClick={() => setDifficulty("semua")}
            >
              Semua
            </Chip>
            {difficulties.map((item) => (
              <Chip
                key={item}
                tone={difficulty === item ? "cyan" : "neutral"}
                selected={difficulty === item}
                onClick={() => setDifficulty(item)}
              >
                {item}
              </Chip>
            ))}
          </FilterGroup>

          <FilterGroup label="Kepedasan">
            <Chip
              tone={spice === "semua" ? "amber" : "neutral"}
              selected={spice === "semua"}
              onClick={() => setSpice("semua")}
            >
              Semua
            </Chip>
            {([1, 2, 3, 4] as const).map((level) => (
              <Chip
                key={level}
                tone={spice === level ? "amber" : "neutral"}
                selected={spice === level}
                onClick={() => setSpice(level)}
              >
                {level}
              </Chip>
            ))}
          </FilterGroup>
        </div>
      </Card>

      {showCustomTopic ? (
        <div id="custom-topic" className="scroll-mt-6">
          <CustomTopicForm
            onUseTopic={(topic) => {
              onSelect(topic);
              setShowCustomTopic(false);
              resetFilters();
            }}
            onSideChange={onSideChange}
          />
        </div>
      ) : null}

      {selectedTopic.custom ? (
        <Card variant="selected">
          <Badge tone="special">Topik Privat Terpilih</Badge>
          <h3 className="mt-3 font-serif text-xl font-bold text-[var(--ra-text-primary)]">
            {selectedTopic.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[var(--ra-text-secondary)]">
            {selectedTopic.shortContext}
          </p>
        </Card>
      ) : null}

      {filteredTopics.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filteredTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              selected={topic.id === selectedTopic.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : (
        <ErrorState
          title="Topik tidak ditemukan"
          description="Coba kosongkan pencarian atau pilih kategori lain. Anda juga bisa membuat topik privat."
          actionLabel="Reset Filter"
          onAction={resetFilters}
        />
      )}
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <p className="mb-2 text-sm font-semibold text-[var(--ra-text-secondary)]">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
