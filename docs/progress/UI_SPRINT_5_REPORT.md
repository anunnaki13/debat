# UI Sprint 5 Report

Date: 2026-06-09

## 1. Ringkasan Perubahan

UI Sprint 5 memoles voice arena tanpa mengubah kontrak sesi debat, endpoint AI, atau fallback text-only. Fokusnya adalah membuat state suara AI nyata di arena: ketika auto-speak aktif, UI berubah ke `AI berbicara`, waveform dan panel lawan menyala, tombol Interupsi menjadi relevan, dan audio bisa dihentikan.

Fokus yang selesai:

- lifecycle callback untuk browser TTS;
- state playback lawan AI: `idle`, `preparing`, dan `speaking`;
- state visual real arena sekarang dapat masuk ke `ai_speaking`;
- interupsi menghentikan browser TTS dan audio OpenRouter;
- request TTS OpenRouter yang masih pending dapat di-abort;
- fallback browser TTS memberi notice yang jelas;
- test unit untuk speech helper;
- test integrasi DebateScreen untuk auto-speak dan interupsi;
- screenshot QA desktop dan mobile dari state AI speaking.

## 2. File Dibuat

- `src/lib/speech/speakText.test.ts`
- `docs/visual-qa/arena-voice-polish-desktop.png`
- `docs/visual-qa/arena-voice-polish-mobile.png`

## 3. File Diubah

- `src/components/debate/DebateScreen.tsx`
- `src/components/debate/DebateScreen.test.tsx`
- `src/lib/speech/speakText.ts`
- `CHANGELOG.md`
- `MILESTONES.md`

## 4. Screenshot Visual QA

- `docs/visual-qa/arena-voice-polish-desktop.png` — arena real dengan auto-speak browser mock, 1440 x 1100 viewport.
- `docs/visual-qa/arena-voice-polish-mobile.png` — arena real dengan auto-speak browser mock, 360 x 900 viewport.

## 5. State Yang Diuji

- Auto-speak browser masuk ke state `AI berbicara`.
- Notice arena menampilkan instruksi Interupsi.
- Panel AI lawan menyala magenta dan menampilkan waveform.
- Tombol Interupsi menghentikan speech synthesis.
- Browser tanpa `speechSynthesis` masuk callback error dan tidak menggantung di preparing state.
- Pending OpenRouter TTS memiliki abort controller.

## 6. Responsive Breakpoint Yang Diuji

- Desktop: 1440 x 1100 viewport melalui Playwright.
- Mobile small: 360 x 900 viewport melalui Playwright.
- Desktop visual QA: `document.scrollWidth = 1440`.
- Mobile visual QA: `document.scrollWidth = 360`.

## 7. Accessibility Check

- Interupsi tetap berupa button visible dengan label teks.
- Status AI speaking muncul sebagai teks, bukan hanya warna/waveform.
- Fallback audio tetap menjaga transcript tertulis sebagai sumber utama.
- Text-only flow tetap tersedia dan tidak bergantung pada permission media.

## 8. Performance Notes

- Tidak ada audio processing baru di render loop.
- Browser TTS memakai event native `onstart`, `onend`, dan `onerror`.
- OpenRouter TTS pending dapat dibatalkan melalui `AbortController`.
- Cleanup unmount menghentikan audio tanpa memanggil setState setelah unmount.

## 9. Known Issues

- Interupsi saat AI masih menghasilkan teks lawan belum membatalkan request `/api/debate/opponent`; fokus sprint ini hanya playback audio/TTS queue.
- Mobile full-page screenshot tetap memperlihatkan bottom nav fixed pada posisi viewport capture.
- Browser TTS event timing bergantung implementasi browser; fallback tetap menampilkan transcript.

## 10. Next Sprint Recommendation

Proceed after user confirmation:

- result screen game-style trophy/reveal polish;
- delivery coach result tab;
- provider error messages yang lebih spesifik;
- optional manual QA dengan OpenRouter key nyata.
