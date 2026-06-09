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

## Milestone 5 - UI Sprint 1 App Shell and Lobby

Status: implemented.

Hasil utama:

- Desktop sidebar di `src/components/layout/DesktopSidebar.tsx`.
- Mobile bottom nav di `src/components/layout/MobileBottomNav.tsx`.
- Shared AppShell melalui `PageShell`.
- Lobby hero, mode carousel/card, progress resume card, dan utility bar.
- Topic card, side selector, dan input mode selector mulai mengikuti design tokens.
- Visual QA screenshots:
  - `docs/visual-qa/lobby-desktop.png`
  - `docs/visual-qa/lobby-mobile.png`
- Progress report di `docs/progress/UI_SPRINT_1_REPORT.md`.

Catatan:

- Dedicated `/topics`, `/settings`, dan full arena visual migration belum dibangun.
- Sprint berikutnya harus menunggu konfirmasi user, sesuai UI/UX Style Blueprint.

## Milestone 6 - UI Sprint 2 Topic Flow

Status: implemented.

Hasil utama:

- Topic explorer dengan search, category chips, level filter, dan spice filter.
- Spice meter reusable di `src/components/topics/SpiceMeter.tsx`.
- Custom topic form dengan tesis, kategori, kepedasan, posisi user, dan konteks opsional.
- Local refiner comparison tanpa API call.
- Conservative sensitive topic validation state.
- Custom topic dapat dipakai dalam session debat.
- Visual QA screenshots:
  - `docs/visual-qa/topic-flow-desktop.png`
  - `docs/visual-qa/topic-flow-mobile.png`
- Progress report di `docs/progress/UI_SPRINT_2_REPORT.md`.

Catatan:

- Dedicated `/topics`, `/topics/new`, dan `/topics/refine` belum dibuat sebagai route terpisah.
- Sprint berikutnya harus menunggu konfirmasi user, sesuai UI/UX Style Blueprint.

## Milestone 7 - UI Sprint 3 Device Check

Status: implemented.

Hasil utama:

- `/debate/device-check` mengikuti direction Device Check dari UI/UX Style Blueprint.
- Permission explanation tampil sebelum user memanggil browser permission dialog.
- Camera preview tile tidak menyalakan kamera sebelum consent.
- Video ref selalu tersedia agar stream kamera dapat terpasang setelah permission granted.
- Selector mikrofon dan kamera memakai `navigator.mediaDevices.enumerateDevices()`.
- Mic meter memakai visual bar token-based dan `role="meter"`.
- Status mic, kamera, dan speaker memakai ikon dan copy fallback.
- Speaker test memakai cue browser TTS singkat dengan timeout otomatis.
- Fallback `Lanjut Tanpa Kamera` dan `Gunakan Teks` tetap langsung menuju arena.
- Visual QA screenshots:
  - `docs/visual-qa/device-check-desktop.png`
  - `docs/visual-qa/device-check-mobile.png`
- Progress report di `docs/progress/UI_SPRINT_3_REPORT.md`.

Catatan:

- Selector speaker belum mengubah output device karena `speechSynthesis` tidak menyediakan sink selection portabel.
- Permission denied matrix perangkat fisik masih masuk fase stabilisasi.
- Sprint berikutnya harus menunggu konfirmasi user, sesuai UI/UX Style Blueprint.

## Milestone 8 - UI Sprint 4 Game Arena Assets and Base

Status: implemented.

Hasil utama:

- Dua mockup PNG terbaru disimpan sebagai design reference:
  - `docs/design-reference/mockup-arena-overview.png`
  - `docs/design-reference/mockup-product-system.png`
- SVG asset pack dibuat di `public/assets/arena/`.
- Asset manifest dibuat di `public/assets/arena/assets-manifest.md`.
- CSS animation utilities ditambahkan untuk neon border, waveform, orbit ring, scanline, particle rise, floating card, dan energy sweep.
- Reusable arena effects dibuat di `src/components/arena/ArenaEffects.tsx`.
- `/dev/mock-arena` dibuat untuk simulasi state visual tanpa API call.
- Real debate arena memakai:
  - user podium;
  - AI opponent panel;
  - arena status banner;
  - momentum meter;
  - action bar;
  - game-style input dock.
- Lobby hero, desktop sidebar, dan mode cards mulai memakai asset game-style.
- Visual QA screenshots:
  - `docs/visual-qa/mock-arena-desktop.png`
  - `docs/visual-qa/mock-arena-mobile.png`
  - `docs/visual-qa/lobby-game-assets-desktop.png`
  - `docs/visual-qa/arena-real-desktop.png`
  - `docs/visual-qa/arena-real-mobile.png`
- Progress report di `docs/progress/UI_SPRINT_4_REPORT.md`.

Catatan:

- Asset raster AI native tidak dibuat karena tool image generation tidak tersedia di sesi ini; pengganti yang dipakai adalah SVG/CSS repo-native agar ringan dan stabil.
- Mockup PNG dipakai sebagai reference, bukan sebagai background produk mentah.
- Sprint berikutnya harus menunggu konfirmasi user.

## Milestone 9 - Stabilization

Status: planned.

Fokus:

- Uji manual dengan OpenRouter key nyata.
- Pastikan model gratis dan murah memberi respons yang cukup baik untuk debat Indonesia.
- Perbaiki error message provider agar lebih spesifik: invalid key, rate limit, unsupported structured output, dan timeout.
- Tambah mode fallback untuk AI Judge bila model murah tidak patuh JSON schema.
- Tambah smoke test untuk route API dengan mock provider.

## Milestone 10 - Product Refinement

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
