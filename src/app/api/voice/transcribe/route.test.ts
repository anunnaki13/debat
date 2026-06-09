import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

function createTranscribeRequest({
  file = new File(["voice-bytes"], "argument.webm", { type: "audio/webm" }),
  mimeType = "audio/webm",
  durationMs = 3_000,
}: {
  file?: File | null;
  mimeType?: string;
  durationMs?: number;
} = {}): Request {
  const formData = new FormData();

  if (file) {
    formData.append("audioBlob", file);
  }

  formData.append("mimeType", mimeType);
  formData.append("durationMs", String(durationMs));

  return new Request("http://localhost/api/voice/transcribe", {
    method: "POST",
    body: formData,
  });
}

describe("/api/voice/transcribe", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("returns transcript, usage, and delivery signals for OpenRouter STT success", async () => {
    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        void input;
        void init;

        return Response.json({
          text: "Eee saya punya argumen utama",
          usage: { cost: 0.001, seconds: 3 },
        });
      },
    );

    vi.stubEnv("OPENROUTER_STT_API_KEY", "or_stt_test_key_123456");
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(createTranscribeRequest());
    const payload = await response.json();
    const firstCall = fetchMock.mock.calls[0]!;
    const requestBody = JSON.parse((firstCall[1] as RequestInit).body as string);

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      transcript: "Eee saya punya argumen utama",
      usage: {
        seconds: 3,
        costUsd: 0.001,
      },
      deliverySignals: {
        durationMs: 3_000,
        fillerWordCount: 1,
      },
    });
    expect(requestBody).toMatchObject({
      model: "openai/whisper-large-v3",
      language: "id",
      input_audio: {
        format: "webm",
      },
    });
    expect(requestBody.input_audio.data).toEqual(expect.any(String));
  });

  it("rejects a request without an audio file", async () => {
    const response = await POST(createTranscribeRequest({ file: null }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toMatchObject({
      code: "INVALID_REQUEST",
      retryable: false,
    });
  });

  it("maps OpenRouter authentication failure to a specific voice fallback error", async () => {
    vi.stubEnv("OPENROUTER_STT_API_KEY", "or_stt_test_key_123456");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("invalid api key", { status: 401 })),
    );

    const response = await POST(createTranscribeRequest());
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error).toMatchObject({
      code: "OPENROUTER_AUTH",
      retryable: false,
    });
    expect(payload.error.message).toContain("API key");
  });

  it("returns an empty-response error when STT returns no transcript", async () => {
    vi.stubEnv("OPENROUTER_STT_API_KEY", "or_stt_test_key_123456");
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ text: "" })));

    const response = await POST(createTranscribeRequest());
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.error).toMatchObject({
      code: "OPENROUTER_EMPTY_RESPONSE",
      retryable: true,
    });
  });
});
