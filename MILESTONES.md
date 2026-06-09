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

## Milestone 8 - UI Sprint 4 Esports Arena Assets and Base

Status: implemented with esports overhaul.

Hasil utama:

- Dua mockup PNG terbaru disimpan sebagai design reference:
  - `docs/design-reference/mockup-arena-overview.png`
  - `docs/design-reference/mockup-product-system.png`
- SVG asset pack dibuat di `public/assets/arena/`.
- Asset manifest dibuat di `public/assets/arena/assets-manifest.md`.
- Asset abstrak sebelumnya diganti dengan arah esports arena/high-tech:
  - neon stage geometry;
  - cyan player helmet;
  - magenta AI mech helmet;
  - player pod dan AI opponent pod;
  - HUD broadcast panels;
  - laser sweep dan arena grid.
- Hero duel scene, compact mode art, boss battle card, dan popular challenge art dibuat ulang sebagai SVG repo-native.
- CSS animation utilities ditambahkan untuk neon border, waveform, orbit ring, scanline, particle rise, floating card, energy sweep, esports grid, HUD ping, dan laser sweep.
- Reusable arena effects dibuat di `src/components/arena/ArenaEffects.tsx`.
- `/dev/mock-arena` dibuat untuk simulasi state visual tanpa API call.
- Real debate arena memakai:
  - match HUD dengan timer tengah;
  - user podium;
  - AI opponent panel;
  - transcript center;
  - waveform;
  - momentum meter;
  - action bar;
  - game-style input dock.
- Lobby hero, desktop sidebar, mode cards, dan popular challenge feed dirombak agar lebih dekat ke mockup.
- Visual QA screenshots:
  - `docs/visual-qa/mock-arena-desktop.png`
  - `docs/visual-qa/mock-arena-mobile.png`
  - `docs/visual-qa/lobby-game-assets-desktop.png`
  - `docs/visual-qa/arena-real-desktop.png`
  - `docs/visual-qa/arena-real-mobile.png`
  - `docs/visual-qa/lobby-mockup-aligned-desktop.png`
  - `docs/visual-qa/lobby-mockup-aligned-mobile.png`
  - `docs/visual-qa/arena-mockup-aligned-desktop.png`
  - `docs/visual-qa/arena-mockup-aligned-mobile.png`
  - `docs/visual-qa/lobby-esports-overhaul-desktop.png`
  - `docs/visual-qa/lobby-esports-overhaul-mobile.png`
  - `docs/visual-qa/arena-esports-overhaul-desktop.png`
  - `docs/visual-qa/arena-esports-overhaul-mobile.png`
- Progress report di `docs/progress/UI_SPRINT_4_REPORT.md`.

Catatan:

- User menolak pass visual sebelumnya karena asset terasa abstrak/tidak relevan; pass terbaru merombak total surface utama ke arah esports arena, high-tech HUD, dan glow.
- Asset raster AI native tidak dibuat karena tool image generation tidak tersedia di sesi ini; pengganti yang dipakai adalah SVG/CSS repo-native agar ringan dan stabil.
- Mockup PNG dipakai sebagai reference, bukan sebagai background produk mentah.
- Sprint berikutnya harus menunggu konfirmasi user.

## Milestone 9 - UI Sprint 5 Voice Polish and Barge-In

Status: implemented.

Hasil utama:

- Browser TTS sekarang memiliki lifecycle callback (`onStart`, `onEnd`, `onError`).
- Real debate arena melacak state suara lawan AI: `idle`, `preparing`, dan `speaking`.
- State visual `ai_speaking` sekarang aktif di arena real saat auto-speak berjalan.
- Interupsi menghentikan browser TTS, audio OpenRouter, dan pending OpenRouter TTS synthesis.
- Event `ai_voice_interrupted` dicatat saat interupsi benar-benar memotong suara AI.
- Notice arena menjelaskan saat suara AI disiapkan, sedang berbicara, gagal, fallback, atau dihentikan.
- Test baru:
  - `src/lib/speech/speakText.test.ts`
  - tambahan coverage auto-speak/interupsi di `src/components/debate/DebateScreen.test.tsx`
- Visual QA screenshots:
  - `docs/visual-qa/arena-voice-polish-desktop.png`
  - `docs/visual-qa/arena-voice-polish-mobile.png`
- Progress report di `docs/progress/UI_SPRINT_5_REPORT.md`.

Catatan:

- Sprint ini tidak membatalkan request teks lawan AI saat `ai_thinking`; fokusnya playback audio/TTS queue.
- QA visual memakai server production lokal di port kosong `3002` karena dev server lama di `3001` sedang aktif.
- Sprint berikutnya harus menunggu konfirmasi user.

## Milestone 10 - UI Sprint 6 Result and Delivery Coach

Status: implemented.

Hasil utama:

- Result screen dirombak menjadi Arena Politika result reveal.
- Hero hasil menampilkan kategori topik, matchup posisi, grade, overall score, jumlah pesan, dan CTA.
- Kartu share preview lokal dibuat untuk hasil debat.
- AI Judge report panel diubah ke style HUD: score bars, strongest point, improvement area, strengths, improvements, dan exercise.
- Delivery Coach ditampilkan untuk sesi voice dengan metrik:
  - WPM;
  - pause ratio;
  - filler count;
  - response latency;
  - volume stability;
  - interruption count.
- Delivery Coach fallback menjelaskan bahwa mode text-only belum punya sinyal voice.
- Transcript accordion direstyle menjadi `Transcript Arena`.
- Test baru:
  - `src/components/judge/ResultScreen.test.tsx`
- Visual QA screenshots:
  - `docs/visual-qa/result-delivery-coach-desktop.png`
  - `docs/visual-qa/result-delivery-coach-mobile.png`
- Progress report di `docs/progress/UI_SPRINT_6_REPORT.md`.

Catatan:

- Delivery Coach tetap memakai sinyal teknis pola bicara dan tidak membuat klaim emosi.
- Share preview masih lokal, belum ekspor gambar.
- Sprint berikutnya harus menunggu konfirmasi user.

## Milestone 11 - Stabilization

Status: partially implemented.

Fokus:

- Done: perbaiki error message provider agar lebih spesifik: invalid key, rate limit, model tidak tersedia, kredit kurang, unsupported structured output, respons kosong, dan timeout.
- Done: tambah mode fallback untuk AI Judge bila model murah menolak `json_schema`, lalu minta JSON plain text dengan instruksi ketat.
- Done: tambah smoke test route API dengan mock provider untuk lawan AI dan AI Judge.
- Done: perluas smoke test untuk STT/TTS success dan failure path.
- Done: tambah test klasifikasi error OpenRouter client.
- Done: tambah tombol `Tes OpenRouter` di lobby agar API key/model bisa dicek sebelum debat dimulai.
- Remaining: uji manual dengan OpenRouter key nyata.
- Remaining: pastikan model gratis dan murah memberi respons yang cukup baik untuk debat Indonesia.

Artefak:

- `src/lib/openrouter/errors.ts`
- `src/lib/openrouter/client.test.ts`
- `src/app/api/debate/opponent/route.test.ts`
- `src/app/api/debate/judge/route.test.ts`
- `src/app/api/voice/transcribe/route.test.ts`
- `src/app/api/voice/synthesize/route.test.ts`
- `src/app/api/ai/openrouter-check/route.ts`
- `src/app/api/ai/openrouter-check/route.test.ts`
- `docs/progress/STABILIZATION_SPRINT_1_REPORT.md`
- `docs/progress/STABILIZATION_SPRINT_2_REPORT.md`
- `docs/progress/STABILIZATION_SPRINT_3_REPORT.md`

## Milestone 12 - Product Refinement

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
