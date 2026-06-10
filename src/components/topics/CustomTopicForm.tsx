"use client";

import { AlertTriangle, ShieldCheck, WandSparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { RefinerComparisonCard } from "@/components/topics/RefinerComparisonCard";
import { SpiceMeter } from "@/components/topics/SpiceMeter";
import { Badge, Button, Card, CardDescription, CardTitle, Chip, Textarea } from "@/components/ui";
import {
  buildRefinedTopic,
  createSafeFallbackDraft,
  customTopicCategories,
  detectSensitiveTopic,
  difficultyForSpice,
  normalizeThesis,
  type CustomTopicCategory,
} from "@/lib/topics/topicSafety";
import { createId } from "@/lib/utils/ids";
import type { DebateTopic, SideSelection } from "@/types/debate";

export function CustomTopicForm({
  onUseTopic,
  onSideChange,
  refinerFirst = false,
}: {
  onUseTopic: (topic: DebateTopic) => void;
  onSideChange: (side: SideSelection) => void;
  refinerFirst?: boolean;
}) {
  const [thesis, setThesis] = useState("");
  const [category, setCategory] = useState<CustomTopicCategory>("Olahraga");
  const [spiceLevel, setSpiceLevel] = useState<1 | 2 | 3 | 4>(2);
  const [side, setSide] = useState<SideSelection>("PRO");
  const [context, setContext] = useState("");
  const [showRefiner, setShowRefiner] = useState(refinerFirst);
  const safety = useMemo(
    () => detectSensitiveTopic(`${thesis} ${context}`),
    [context, thesis],
  );
  const thesisTooShort = thesis.trim().length > 0 && thesis.trim().length < 18;
  const canUseTopic = thesis.trim().length >= 18 && !safety.message;
  const refined = buildRefinedTopic({ thesis, category, context });

  function buildTopic(title: string): DebateTopic {
    return {
      id: createId("topic"),
      title,
      category,
      difficulty: difficultyForSpice(spiceLevel),
      shortContext:
        context.trim() ||
        "Topik privat dari user. Lawan AI wajib menyerang gagasan secara sportif dan spesifik.",
      spiceLevel,
      custom: true,
    };
  }

  function useDirectTopic() {
    if (!canUseTopic) {
      return;
    }

    onSideChange(side);
    onUseTopic(buildTopic(normalizeThesis(thesis)));
  }

  function useRefinedTopic() {
    if (!canUseTopic) {
      return;
    }

    onSideChange(side);
    onUseTopic(buildTopic(refined));
    setShowRefiner(false);
  }

  function useSafeFallback() {
    const fallback = createSafeFallbackDraft(safety.matchedTerm ?? "");

    setThesis(fallback.thesis);
    setCategory(fallback.category);
    setContext(fallback.context);
    setSpiceLevel(2);
    setShowRefiner(false);
  }

  return (
    <Card variant="outline" className="border-[var(--ra-violet)] bg-[var(--ra-violet-soft)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge tone="special">Topik Privat</Badge>
          <CardTitle className="mt-4">Buat topik sendiri</CardTitle>
          <CardDescription className="mt-2 max-w-2xl">
            Tulis tesis yang spesifik. MVP ini menolak topik sensitif agar arena
            tetap aman dan fokus pada gagasan.
          </CardDescription>
        </div>
        <SpiceMeter level={spiceLevel} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_260px]">
        <Textarea
          label="Tesis utama"
          name="custom-thesis"
          value={thesis}
          onChange={(event) => {
            setThesis(event.target.value);
            setShowRefiner(false);
          }}
          maxLength={260}
          placeholder="Contoh: klub sepak bola lokal sebaiknya membatasi transfer mahal dan fokus ke akademi muda"
          helperText={`${thesis.length}/260 karakter`}
        />

        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[var(--ra-text-secondary)]">
              Kategori
            </span>
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as CustomTopicCategory)
              }
              className="min-h-11 w-full rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] px-3 py-2 text-sm text-[var(--ra-text-primary)]"
            >
              {customTopicCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <div>
            <p className="text-sm font-semibold text-[var(--ra-text-secondary)]">
              Tingkat kepedasan
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((level) => (
                <Chip
                  key={level}
                  tone={spiceLevel === level ? "amber" : "neutral"}
                  selected={spiceLevel === level}
                  onClick={() => setSpiceLevel(level as 1 | 2 | 3 | 4)}
                >
                  {level}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-[var(--ra-text-secondary)]">
              Posisi user
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["PRO", "CONTRA", "RANDOM"] as SideSelection[]).map((option) => (
                <Chip
                  key={option}
                  tone={side === option ? "cyan" : "neutral"}
                  selected={side === option}
                  onClick={() => setSide(option)}
                >
                  {option === "RANDOM" ? "Acak" : option}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Textarea
          label="Konteks opsional"
          name="custom-context"
          value={context}
          onChange={(event) => {
            setContext(event.target.value);
            setShowRefiner(false);
          }}
          maxLength={420}
          placeholder="Tambahkan konteks singkat agar lawan AI tidak melebar..."
          helperText={`${context.length}/420 karakter`}
          className="min-h-24"
        />
      </div>

      {safety.message || thesisTooShort ? (
        <div className="mt-4 flex items-start gap-3 rounded-[var(--ra-radius-md)] border border-[var(--ra-amber)] bg-[var(--ra-amber-soft)] p-3 text-sm leading-6 text-[var(--ra-text-secondary)]">
          <AlertTriangle
            size={17}
            aria-hidden="true"
            className="mt-1 shrink-0 text-[var(--ra-amber)]"
          />
          <p>
            {safety.message ||
              "Tesis masih terlalu pendek. Buat klaim minimal 18 karakter agar mudah diperdebatkan."}
          </p>
        </div>
      ) : null}

      {safety.message ? (
        <div className="mt-4 rounded-[var(--ra-radius-lg)] border border-[var(--ra-emerald)] bg-[var(--ra-emerald-soft)] p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={18}
              aria-hidden="true"
              className="mt-1 shrink-0 text-[var(--ra-emerald)]"
            />
            <div className="min-w-0">
              <p className="text-sm font-bold text-[var(--ra-text-primary)]">
                Fallback aman tersedia
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--ra-text-secondary)]">
                Gunakan versi aman yang tetap bisa diperdebatkan tanpa menyerang
                identitas atau kelompok tertentu.
              </p>
              <Button
                variant="secondary"
                className="mt-3 w-full sm:w-auto"
                onClick={useSafeFallback}
              >
                Gunakan Fallback Aman
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 sm:flex sm:flex-wrap">
        <Button
          variant="prestige"
          leadingIcon={<WandSparkles size={17} aria-hidden="true" />}
          disabled={!canUseTopic}
          onClick={() => setShowRefiner(true)}
          className="w-full sm:w-auto"
        >
          Rapikan Topik
        </Button>
        <Button
          variant="secondary"
          disabled={!canUseTopic}
          onClick={useDirectTopic}
          className="w-full sm:w-auto"
        >
          Gunakan Langsung
        </Button>
      </div>

      {showRefiner && canUseTopic ? (
        <div className="mt-5">
          <RefinerComparisonCard
            original={thesis}
            refined={refined}
            reasons={[
              "Menyerang gagasan, bukan kelompok atau identitas.",
              "Lebih spesifik sehingga lawan AI punya posisi yang jelas.",
              "Lebih layak diperdebatkan dalam tiga ronde singkat.",
            ]}
            onUseRefined={useRefinedTopic}
            onEditAgain={() => setShowRefiner(false)}
          />
        </div>
      ) : null}
    </Card>
  );
}
