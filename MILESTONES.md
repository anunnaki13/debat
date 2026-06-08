# Republik Argumen Milestones

Dokumen ini menjelaskan status implementasi saat ini dan arah milestone berikutnya. Blueprint rinci tetap menjadi sumber utama keputusan produk; dokumen ini dipakai sebagai ringkasan eksekusi agar perubahan di repo mudah ditinjau.

## Milestone 0 - Blueprint

Status: updated.

Artefak:

- `REPUBLIK_ARGUMEN_MVP_VOICE_ARENA_BLUEPRINT.md`
- `REPUBLIK_ARGUMEN_UI_UX_STYLE_BLUEPRINT.md`
- `docs/archive/REPUBLIK_ARGUMEN_MVP_AI_DEBATE_BLUEPRINT.md`

Tujuan:

- Menjadikan Voice Arena sebagai source of truth fase aktif.
- Menjadikan UI/UX Style Blueprint sebagai source of truth khusus visual implementation.
- Menetapkan text-only sebagai fallback wajib.
- Menetapkan device check, camera preview lokal, STT/TTS server-side, Delivery Signals, dan fallback ladder.

## Milestone 1 - Personal MVP Web App

Status: implemented.

Hasil utama:

- Next.js App Router dengan TypeScript dan Tailwind CSS.
- Halaman setup untuk memilih topik, posisi, OpenRouter API key, model lawan, dan model wasit.
- Arena debat tiga ronde: opening, rebuttal, closing.
- AI Opponent dipanggil dari server route `/api/debate/opponent`.
- AI Judge/wasit dipanggil dari server route `/api/debate/judge`.
- Prompt AI Opponent memiliki knowledge base pertandingan: topik, konteks, posisi user, posisi AI yang wajib melawan, dan wasit AI terpisah.
- Report AI Judge menampilkan overall score, lima dimensi skor, strengths, improvements, exercise, disclaimer, dan transcript.
- Riwayat debat lokal memakai `localStorage`.
- Export satu session sebagai JSON tanpa API key.
- Text session masih bisa memakai voice input dan text-to-speech browser sebagai fallback.
- Dockerfile dan `docker-compose.yml` tersedia untuk deployment sederhana.

Voice Arena additions:

- Mode/input selector di lobby.
- `/debate/device-check` untuk `VOICE` dan `VOICE_CAMERA`.
- Local camera preview tanpa upload video.
- Mic level meter berbasis Web Audio.
- Fallback ke voice-only dan text-only.
- OpenRouter STT route tersambung ke `MediaRecorder` untuk mode voice.
- OpenRouter TTS route dipakai untuk auto-speak lawan di mode voice, dengan browser TTS fallback.
- Delivery Signals helper tanpa klaim emosi.
- Local analytics event scaffold.

Provider AI saat ini:

- Default UI: OpenRouter.
- Default model: `openrouter/free`.
- Opsi murah di UI:
  - `inclusionai/ling-2.6-flash`
  - `meta-llama/llama-3.1-8b-instruct`
  - `mistralai/mistral-nemo`
- Gemini client masih ada sebagai eksperimen/fallback teknis, tetapi bukan default UI.

Validasi:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

## Milestone 2 - Voice Pipeline Integration

Status: partially implemented.

Rencana kerja:

- Done: hubungkan `MediaRecorder` audio-only ke `/api/voice/transcribe`.
- Done: tambahkan transcript review lewat composer sebelum argumen dikirim.
- Done: auto-speak lawan di mode voice memakai `/api/voice/synthesize` saat model TTS tersedia.
- Remaining: tambahkan sentence chunker dan audio queue untuk `/api/voice/synthesize`.
- Remaining: tambahkan tombol interupsi yang menghentikan audio queue dan kembali ke state listening.
- Remaining: tampilkan Delivery Coach tab di result screen.

## Milestone 3 - Blueprint Detail Integration

Status: planned.

Trigger:

- User mengunggah tambahan blueprint detail setelah Voice Arena source of truth.

## Milestone 4 - UI Sprint 0 Design Foundation

Status: implemented.

Hasil utama:

- Design tokens terpusat di `src/styles/tokens.css`.
- Motion dan reduced-motion base di `src/styles/motion.css`.
- Mode theme variables di `src/styles/themes.css`.
- Typed token exports di `src/lib/design-tokens.ts`.
- Core UI primitives di `src/components/ui/`.
- Development-only UI playground di `/dev/ui-playground`.
- Progress report di `docs/progress/UI_SPRINT_0_REPORT.md`.

Catatan:

- Sprint ini tidak mengubah seluruh layar produk lama sekaligus.
- Sprint berikutnya harus menunggu konfirmasi user, sesuai UI/UX Style Blueprint.

## Milestone 5 - Stabilization

Status: planned.

Fokus:

- Uji manual dengan OpenRouter key nyata.
- Pastikan model gratis dan murah memberi respons yang cukup baik untuk debat Indonesia.
- Perbaiki error message provider agar lebih spesifik: invalid key, rate limit, unsupported structured output, dan timeout.
- Tambah mode fallback untuk AI Judge bila model murah tidak patuh JSON schema.
- Tambah smoke test untuk route API dengan mock provider.

## Milestone 6 - Product Refinement

Status: planned.

Fokus:

- Memperluas daftar topik aman.
- Menambah preset model/provider jika perlu.
- Memperbaiki visual polish berdasarkan sesi pemakaian nyata.
- Menambah dokumentasi deployment VPS.
- Menilai apakah voice input/output layak dipertahankan sebagai fitur utama.

## Non-Goals Saat Ini

Fitur berikut tetap belum menjadi target sampai blueprint detail menyatakan sebaliknya:

- Login atau registrasi.
- Database eksternal.
- Payment atau membership.
- Human-vs-human.
- Public spectator.
- Ranking, clan, partai, atau social layer.
- News crawling.
- RAG/fact-checking lanjutan.
- Moderation dashboard.
- Native mobile app.
