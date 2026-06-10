import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

function createJsonRequest(body: unknown): Request {
  return new Request("http://localhost/api/debate/judge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const judgeReport = {
  summary: "User menyusun argumen dengan struktur jelas dan contoh praktis.",
  strongestPoint: "Mampu mengaitkan reskilling dengan perubahan pasar kerja.",
  biggestImprovementArea: "Perlu menambah data pembanding yang lebih konkret.",
  scores: {
    speakByData: {
      score: 80,
      explanation: "Ada contoh, tetapi belum memakai angka pembanding.",
    },
    structure: {
      score: 82,
      explanation: "Pembuka, bantahan, dan penutup mudah diikuti.",
    },
    logic: {
      score: 78,
      explanation: "Alur sebab-akibat cukup konsisten.",
    },
    rebuttal: {
      score: 76,
      explanation: "Menjawab sebagian argumen lawan.",
    },
    integrity: {
      score: 84,
      explanation: "Bahasa tetap sportif dan tidak menyerang personal.",
    },
  },
  strengths: ["Struktur argumen rapi", "Nada debat tetap tenang"],
  improvements: ["Tambahkan data pembanding", "Tanggapi klaim lawan lebih langsung"],
  recommendedExercise: "Latih satu rebuttal berbasis angka dalam 60 detik.",
  playfulTitle: "Orator Data Setengah Matang",
  overallScore: 1,
  disclaimer:
    "Penilaian ini adalah bantuan coaching AI, bukan ukuran objektif kecerdasan.",
};

const completedSession = {
  id: "debate_test",
  version: 1,
  mode: "DUEL_WACANA_AI",
  inputMode: "TEXT",
  topic: {
    id: "ai-jobs",
    title: "AI akan membuka lebih banyak pekerjaan baru",
    category: "Teknologi",
    difficulty: "pemula",
    shortContext: "Debat tentang dampak AI pada pekerjaan.",
  },
  userSide: "PRO",
  opponentSide: "CONTRA",
  startedAt: new Date("2026-06-09T01:00:00.000Z").toISOString(),
  status: "AWAITING_JUDGE",
  currentRound: "CLOSING",
  messages: [
    {
      id: "message_1",
      speaker: "USER",
      round: "OPENING",
      content: "AI membuka pekerjaan baru lewat otomatisasi pekerjaan repetitif.",
      createdAt: new Date("2026-06-09T01:00:01.000Z").toISOString(),
    },
    {
      id: "message_2",
      speaker: "OPPONENT",
      round: "OPENING",
      content: "Otomatisasi juga bisa menghapus pekerjaan lebih cepat dari reskilling.",
      createdAt: new Date("2026-06-09T01:00:02.000Z").toISOString(),
    },
    {
      id: "message_3",
      speaker: "USER",
      round: "REBUTTAL",
      content: "Risiko itu benar, tetapi kebijakan pelatihan bisa mengurangi dampaknya.",
      createdAt: new Date("2026-06-09T01:00:03.000Z").toISOString(),
    },
    {
      id: "message_4",
      speaker: "OPPONENT",
      round: "REBUTTAL",
      content: "Tidak semua pekerja punya akses pelatihan tepat waktu.",
      createdAt: new Date("2026-06-09T01:00:04.000Z").toISOString(),
    },
    {
      id: "message_5",
      speaker: "USER",
      round: "CLOSING",
      content: "Karena itu AI perlu diiringi pelatihan dan transisi kerja yang serius.",
      createdAt: new Date("2026-06-09T01:00:05.000Z").toISOString(),
    },
    {
      id: "message_6",
      speaker: "OPPONENT",
      round: "CLOSING",
      content: "Tanpa bukti implementasi, janji transisi kerja masih terlalu optimistis.",
      createdAt: new Date("2026-06-09T01:00:06.000Z").toISOString(),
    },
  ],
};

describe("/api/debate/judge", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("falls back to plain JSON when a cheap OpenRouter model rejects json_schema", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "server_key_123456");
    vi.stubEnv("OPENROUTER_JUDGE_MODEL", "cheap-json-model");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response("response_format json_schema unsupported", { status: 400 }),
      )
      .mockResolvedValueOnce(
        Response.json({
          model: "cheap-json-model",
          choices: [{ message: { content: JSON.stringify(judgeReport) } }],
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      createJsonRequest({
        session: completedSession,
      }),
    );
    const payload = await response.json();
    const firstBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    const secondBody = JSON.parse(fetchMock.mock.calls[1][1].body as string);

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(firstBody.response_format).toBeDefined();
    expect(secondBody.response_format).toBeUndefined();
    expect(payload.report).toMatchObject({
      summary: judgeReport.summary,
      overallScore: 80,
    });
    expect(payload.model).toBeUndefined();
  });

  it("rejects browser-supplied AI config before judging", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      createJsonRequest({
        session: completedSession,
        aiConfig: {
          provider: "openrouter",
          apiKey: "browser_secret_should_not_pass",
        },
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(payload.error).toMatchObject({
      code: "INVALID_REQUEST",
      retryable: false,
    });
  });
});
