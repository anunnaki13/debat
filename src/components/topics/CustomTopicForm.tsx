"use client";

import { AlertTriangle, WandSparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { RefinerComparisonCard } from "@/components/topics/RefinerComparisonCard";
import { SpiceMeter } from "@/components/topics/SpiceMeter";
import { Badge, Button, Card, CardDescription, CardTitle, Chip, Textarea } from "@/components/ui";
import { createId } from "@/lib/utils/ids";
import type { DebateTopic, SideSelection } from "@/types/debate";

const categories = [
  "Olahraga",
  "Teknologi",
  "Bisnis",
  "Pendidikan",
  "Lifestyle",
  "Hiburan",
  "Isu Publik Ringan",
  "Absurd dan Santai",
] as const;

const sensitiveTerms = [
  "pemilu",
  "pilpres",
  "capres",
  "caleg",
  "partai",
  "agama",
  "suku",
  "ras",
  "etnis",
  "kebencian",
  "kekerasan",
];

function detectSensitiveTopic(text: string): string | null {
  const normalized = text.toLowerCase();
  const matchedTerm = sensitiveTerms.find((term) => normalized.includes(term));

  if (matchedTerm) {
    return `Topik mengandung kata "${matchedTerm}". Untuk MVP, pilih isu yang lebih ringan dan tidak menyerang kelompok tertentu.`;
  }

  return null;
}

function normalizeThesis(thesis: string): string {
  const cleaned = thesis.trim().replace(/\s+/g, " ");

  if (/^(apakah|haruskah|perlukah)\b/i.test(cleaned)) {
    return cleaned.endsWith("?") ? cleaned : `${cleaned}?`;
  }

  return `Apakah ${cleaned.charAt(0).toLowerCase()}${cleaned.slice(1)}?`;
}

function buildRefinedTopic({
  thesis,
  category,
  context,
}: {
  thesis: string;
  category: string;
  context: string;
}): string {
  const normalized = normalizeThesis(thesis);
  const contextHint = context.trim()
    ? ` Bahas dengan mempertimbangkan konteks: ${context.trim().replace(/\s+/g, " ")}`
    : "";

  return `${normalized} Fokus pada kategori ${category}.${contextHint}`;
}

function difficultyForSpice(spiceLevel: 1 | 2 | 3 | 4): DebateTopic["difficulty"] {
  if (spiceLevel <= 2) {
    return "pemula";
  }

  if (spiceLevel === 3) {
    return "menengah";
  }

  return "lanjutan";
}

export function CustomTopicForm({
  onUseTopic,
  onSideChange,
}: {
  onUseTopic: (topic: DebateTopic) => void;
  onSideChange: (side: SideSelection) => void;
}) {
  const [thesis, setThesis] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("Olahraga");
  const [spiceLevel, setSpiceLevel] = useState<1 | 2 | 3 | 4>(2);
  const [side, setSide] = useState<SideSelection>("PRO");
  const [context, setContext] = useState("");
  const [showRefiner, setShowRefiner] = useState(false);
  const sensitiveMessage = useMemo(
    () => detectSensitiveTopic(`${thesis} ${context}`),
    [context, thesis],
  );
  const thesisTooShort = thesis.trim().length > 0 && thesis.trim().length < 18;
  const canUseTopic = thesis.trim().length >= 18 && !sensitiveMessage;
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
                setCategory(event.target.value as (typeof categories)[number])
              }
              className="min-h-11 w-full rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] px-3 py-2 text-sm text-[var(--ra-text-primary)]"
            >
              {categories.map((item) => (
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

      {sensitiveMessage || thesisTooShort ? (
        <div className="mt-4 flex items-start gap-3 rounded-[var(--ra-radius-md)] border border-[var(--ra-amber)] bg-[var(--ra-amber-soft)] p-3 text-sm leading-6 text-[var(--ra-text-secondary)]">
          <AlertTriangle
            size={17}
            aria-hidden="true"
            className="mt-1 shrink-0 text-[var(--ra-amber)]"
          />
          <p>
            {sensitiveMessage ||
              "Tesis masih terlalu pendek. Buat klaim minimal 18 karakter agar mudah diperdebatkan."}
          </p>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <Button
          variant="prestige"
          leadingIcon={<WandSparkles size={17} aria-hidden="true" />}
          disabled={!canUseTopic}
          onClick={() => setShowRefiner(true)}
        >
          Rapikan dengan AI
        </Button>
        <Button variant="secondary" disabled={!canUseTopic} onClick={useDirectTopic}>
          Gunakan Langsung
        </Button>
      </div>

      {showRefiner ? (
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
