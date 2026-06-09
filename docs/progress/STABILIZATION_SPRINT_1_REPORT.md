# Stabilization Sprint 1 - OpenRouter Resilience

Tanggal: 2026-06-09

## Tujuan

Memperkuat reliability provider OpenRouter agar kegagalan API tidak lagi terasa generik bagi user dan model murah tetap punya jalur fallback untuk penilaian AI Judge.

## Hasil Implementasi

- OpenRouter client sekarang mengklasifikasikan kegagalan umum:
  - API key invalid/unauthorized;
  - rate limit;
  - model tidak tersedia;
  - kredit/kuota kurang;
  - structured response format tidak didukung;
  - respons kosong;
  - upstream failure umum.
- Route lawan AI mengembalikan pesan error yang lebih spesifik untuk OpenRouter.
- Route AI Judge mengembalikan pesan error spesifik dan mencoba fallback dari strict `json_schema` ke JSON plain text bila model murah tidak mendukung structured output.
- Route STT dan TTS memakai klasifikasi error yang sama agar fallback voice/text lebih jelas.
- Error code API diperluas tanpa mengubah bentuk response.

## Test Coverage

- `src/lib/openrouter/client.test.ts`
  - klasifikasi error;
  - upstream rejection;
  - empty assistant response.
- `src/app/api/debate/opponent/route.test.ts`
  - smoke test rate limit OpenRouter.
- `src/app/api/debate/judge/route.test.ts`
  - smoke test fallback dari `json_schema` ke plain JSON.

## Catatan

- Sprint ini belum melakukan uji manual memakai OpenRouter key nyata.
- STT/TTS sudah memakai error mapping baru, tetapi smoke test khusus route voice masih menjadi lanjutan stabilisasi berikutnya.
