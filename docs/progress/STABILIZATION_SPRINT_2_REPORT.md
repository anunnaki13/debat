# Stabilization Sprint 2 - Voice API Smoke Tests

Tanggal: 2026-06-09

## Tujuan

Menutup gap test route voice agar STT/TTS dapat diverifikasi tanpa memanggil OpenRouter asli.

## Hasil Implementasi

- Menambahkan smoke test `/api/voice/transcribe` untuk:
  - sukses STT;
  - request tanpa audio;
  - API key invalid;
  - transcript kosong.
- Menambahkan smoke test `/api/voice/synthesize` untuk:
  - sukses TTS;
  - input teks kosong;
  - konfigurasi TTS hilang;
  - model TTS tidak tersedia.
- Test STT memastikan response membawa transcript, usage, dan Delivery Signals.
- Test TTS memastikan response audio dikembalikan dan payload OpenRouter dibentuk dengan benar.

## Catatan

- Semua test memakai mock `fetch`; tidak ada panggilan network ke OpenRouter.
- Uji manual dengan OpenRouter key nyata masih menjadi item stabilisasi lanjutan.
