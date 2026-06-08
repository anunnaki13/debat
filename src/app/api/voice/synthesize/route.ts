import { apiError } from "@/lib/utils/apiError";

function getTtsConfig() {
  const apiKey =
    process.env.OPENROUTER_TTS_API_KEY?.trim() ||
    process.env.OPENROUTER_SHARED_API_KEY?.trim() ||
    process.env.OPENROUTER_API_KEY?.trim();
  const model = process.env.OPENROUTER_TTS_MODEL?.trim();
  const voice = process.env.OPENROUTER_TTS_VOICE?.trim() || "alloy";

  if (!apiKey || !model) {
    throw new Error("CONFIG_MISSING");
  }

  return {
    apiKey,
    model,
    voice,
    format: process.env.OPENROUTER_TTS_FORMAT?.trim() || "mp3",
    speed: Number(process.env.OPENROUTER_TTS_SPEED ?? 1),
  };
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return apiError("INVALID_REQUEST", "Body JSON tidak valid.", false, 400);
  }

  const text =
    typeof body === "object" && body !== null && "text" in body
      ? String((body as { text: unknown }).text).trim()
      : "";

  if (!text || text.length > 1200) {
    return apiError(
      "INVALID_REQUEST",
      "Teks suara AI kosong atau terlalu panjang.",
      false,
      400,
    );
  }

  try {
    const config = getTtsConfig();
    const response = await fetch("https://openrouter.ai/api/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        ...(process.env.OPENROUTER_APP_URL
          ? { "HTTP-Referer": process.env.OPENROUTER_APP_URL }
          : {}),
        ...(process.env.OPENROUTER_APP_NAME
          ? { "X-OpenRouter-Title": process.env.OPENROUTER_APP_NAME }
          : {}),
      },
      body: JSON.stringify({
        input: text,
        model: config.model,
        voice: config.voice,
        response_format: config.format,
        speed: config.speed,
      }),
    });

    if (!response.ok) {
      return apiError(
        "OPENROUTER_ERROR",
        "Suara AI belum dapat diputar. Respons teks tetap tersedia.",
        true,
        502,
      );
    }

    return new Response(await response.arrayBuffer(), {
      headers: {
        "Content-Type":
          config.format === "mp3" ? "audio/mpeg" : "application/octet-stream",
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "CONFIG_MISSING") {
      return apiError(
        "CONFIG_MISSING",
        "OpenRouter TTS key atau model belum dikonfigurasi di server.",
        false,
        500,
      );
    }

    return apiError(
      "INTERNAL_ERROR",
      "TTS gagal diproses. Respons teks tetap tersedia.",
      true,
      500,
    );
  }
}
