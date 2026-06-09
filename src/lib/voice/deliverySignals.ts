import type { DeliveryReport, DeliverySignals } from "@/types/debate";

const FILLER_WORDS = ["eee", "eh", "anu", "maksudnya", "hmm", "emm"];

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function countFillerWords(text: string): number {
  const normalized = text.toLowerCase();

  return FILLER_WORDS.reduce((count, word) => {
    const matches = normalized.match(new RegExp(`\\b${word}\\b`, "g"));
    return count + (matches?.length ?? 0);
  }, 0);
}

export function calculateDeliverySignals({
  transcript,
  durationMs,
  silenceMs = 0,
  responseLatencyMs = 0,
  rmsSamples = [],
  interruptionCount = 0,
}: {
  transcript: string;
  durationMs: number;
  silenceMs?: number;
  responseLatencyMs?: number;
  rmsSamples?: number[];
  interruptionCount?: number;
}): DeliverySignals {
  const durationMinutes = Math.max(durationMs, 1) / 60_000;
  const wordsPerMinute = Math.round(countWords(transcript) / durationMinutes);
  const pauseRatio = Number(
    Math.min(1, Math.max(0, silenceMs / Math.max(durationMs, 1))).toFixed(2),
  );
  const averageRms =
    rmsSamples.length > 0
      ? rmsSamples.reduce((sum, value) => sum + value, 0) / rmsSamples.length
      : 0.75;
  const variance =
    rmsSamples.length > 0
      ? rmsSamples.reduce(
          (sum, value) => sum + Math.pow(value - averageRms, 2),
          0,
        ) / rmsSamples.length
      : 0.05;
  const volumeStability = Number(
    Math.min(1, Math.max(0, 1 - Math.sqrt(variance))).toFixed(2),
  );

  return {
    durationMs,
    wordsPerMinute,
    pauseRatio,
    fillerWordCount: countFillerWords(transcript),
    responseLatencyMs,
    volumeStability,
    interruptionCount,
  };
}

export function buildDeliveryReport(signals: DeliverySignals): DeliveryReport {
  const suggestions: string[] = [];

  if (signals.wordsPerMinute > 170) {
    suggestions.push("Perlambat sedikit tempo agar data utama lebih mudah ditangkap.");
  } else if (signals.wordsPerMinute < 90) {
    suggestions.push("Coba tingkatkan tempo agar argumen terasa lebih tegas.");
  }

  if (signals.fillerWordCount > 2) {
    suggestions.push("Kurangi filler words sebelum menyampaikan poin utama.");
  }

  if (signals.pauseRatio > 0.35) {
    suggestions.push("Latih transisi antar poin agar jeda tidak terlalu panjang.");
  }

  if (suggestions.length === 0) {
    suggestions.push("Pertahankan ritme bicara dan tambah penekanan pada klaim utama.");
  }

  return {
    signals,
    summary: "Sinyal penyampaian dihitung dari pola teknis bicara, bukan emosi.",
    suggestions,
    disclaimer:
      "Sinyal penyampaian adalah estimasi teknis dari pola bicara, bukan diagnosis emosi atau kondisi psikologis.",
  };
}
