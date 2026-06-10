import { describe, expect, it } from "vitest";
import {
  buildRefinedTopic,
  createSafeFallbackDraft,
  detectSensitiveTopic,
  difficultyForSpice,
  normalizeThesis,
} from "./topicSafety";

describe("topic safety helpers", () => {
  it("normalizes statements into debate questions", () => {
    expect(normalizeThesis("Klub lokal fokus akademi muda")).toBe(
      "Apakah klub lokal fokus akademi muda?",
    );
    expect(normalizeThesis("Apakah AI boleh dipakai di sekolah")).toBe(
      "Apakah AI boleh dipakai di sekolah?",
    );
  });

  it("detects sensitive terms and provides a safe fallback draft", () => {
    const result = detectSensitiveTopic("Debat soal partai dan pemilu");

    expect(result.matchedTerm).toBe("pemilu");
    expect(result.message).toMatch(/Topik mengandung kata/i);

    const fallback = createSafeFallbackDraft(result.matchedTerm ?? "");

    expect(fallback.thesis).toMatch(/diskusi sehat|engagement/i);
    expect(fallback.category).toBe("Isu Publik Ringan");
  });

  it("does not flag safe words that merely contain a short sensitive token", () => {
    expect(
      detectSensitiveTopic("Moderasi komunitas digital perlu lebih transparan")
        .matchedTerm,
    ).toBeNull();
  });

  it("builds local refiner copy without changing the selected spice model", () => {
    expect(
      buildRefinedTopic({
        thesis: "Sekolah membatasi gawai pribadi",
        category: "Pendidikan",
        context: "Untuk siswa SMP",
      }),
    ).toContain("Fokus pada kategori Pendidikan");
    expect(difficultyForSpice(1)).toBe("pemula");
    expect(difficultyForSpice(3)).toBe("menengah");
    expect(difficultyForSpice(4)).toBe("lanjutan");
  });
});
