import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

function createSynthesizeRequest(body: unknown): Request {
  return new Request("http://localhost/api/voice/synthesize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("/api/voice/synthesize", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("returns audio when OpenRouter TTS succeeds", async () => {
    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        void input;
        void init;

        return new Response(new Uint8Array([1, 2, 3]), {
          status: 200,
          headers: { "Content-Type": "audio/mpeg" },
        });
      },
    );

    vi.stubEnv("OPENROUTER_TTS_API_KEY", "or_tts_test_key_123456");
    vi.stubEnv("OPENROUTER_TTS_MODEL", "openai/tts-1");
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      createSynthesizeRequest({ text: "AI sedang membalas argumen." }),
    );
    const body = new Uint8Array(await response.arrayBuffer());
    const firstCall = fetchMock.mock.calls[0]!;
    const requestBody = JSON.parse((firstCall[1] as RequestInit).body as string);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("audio/mpeg");
    expect([...body]).toEqual([1, 2, 3]);
    expect(requestBody).toMatchObject({
      input: "AI sedang membalas argumen.",
      model: "openai/tts-1",
      voice: "alloy",
      response_format: "mp3",
      speed: 1,
    });
  });

  it("rejects empty or too-long text before calling OpenRouter", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(createSynthesizeRequest({ text: "   " }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toMatchObject({
      code: "INVALID_REQUEST",
      retryable: false,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports missing TTS configuration without calling OpenRouter", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      createSynthesizeRequest({ text: "AI sedang membalas argumen." }),
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.error).toMatchObject({
      code: "CONFIG_MISSING",
      retryable: false,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("maps unavailable TTS model to a specific OpenRouter error", async () => {
    vi.stubEnv("OPENROUTER_TTS_API_KEY", "or_tts_test_key_123456");
    vi.stubEnv("OPENROUTER_TTS_MODEL", "missing-tts-model");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("model not found", { status: 404 })),
    );

    const response = await POST(
      createSynthesizeRequest({ text: "AI sedang membalas argumen." }),
    );
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.error).toMatchObject({
      code: "OPENROUTER_MODEL_UNAVAILABLE",
      retryable: false,
    });
    expect(payload.error.message).toContain("Model OpenRouter");
  });
});
