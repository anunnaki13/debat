import type { DebateTopic } from "@/types/debate";

export const customTopicCategories = [
  "Olahraga",
  "Teknologi",
  "Bisnis",
  "Pendidikan",
  "Lifestyle",
  "Hiburan",
  "Isu Publik Ringan",
  "Absurd dan Santai",
] as const;

export type CustomTopicCategory = (typeof customTopicCategories)[number];

export const sensitiveTerms = [
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
] as const;

export interface TopicSafetyResult {
  matchedTerm: string | null;
  message: string | null;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function detectSensitiveTopic(text: string): TopicSafetyResult {
  const normalized = text.toLowerCase();
  const matchedTerm =
    sensitiveTerms.find((term) =>
      new RegExp(`(^|\\W)${escapeRegExp(term)}(\\W|$)`, "i").test(normalized),
    ) ?? null;

  if (!matchedTerm) {
    return {
      matchedTerm: null,
      message: null,
    };
  }

  return {
    matchedTerm,
    message: `Topik mengandung kata "${matchedTerm}". Untuk MVP, pilih isu yang lebih ringan dan tidak menyerang kelompok tertentu.`,
  };
}

export function normalizeThesis(thesis: string): string {
  const cleaned = thesis.trim().replace(/\s+/g, " ");

  if (!cleaned) {
    return "";
  }

  if (/^(apakah|haruskah|perlukah)\b/i.test(cleaned)) {
    return cleaned.endsWith("?") ? cleaned : `${cleaned}?`;
  }

  return `Apakah ${cleaned.charAt(0).toLowerCase()}${cleaned.slice(1)}?`;
}

export function buildRefinedTopic({
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

export function difficultyForSpice(
  spiceLevel: 1 | 2 | 3 | 4,
): DebateTopic["difficulty"] {
  if (spiceLevel <= 2) {
    return "pemula";
  }

  if (spiceLevel === 3) {
    return "menengah";
  }

  return "lanjutan";
}

export function createSafeFallbackDraft(matchedTerm: string): {
  thesis: string;
  category: CustomTopicCategory;
  context: string;
} {
  const subject =
    matchedTerm === "kekerasan" || matchedTerm === "kebencian"
      ? "komunitas digital"
      : "ruang publik";

  return {
    thesis: `Platform ${subject} sebaiknya memprioritaskan aturan diskusi sehat daripada mengejar engagement semata`,
    category: "Isu Publik Ringan",
    context:
      "Fokuskan debat pada desain kebijakan, moderasi, literasi, dan dampak praktis tanpa menyerang identitas atau kelompok.",
  };
}
