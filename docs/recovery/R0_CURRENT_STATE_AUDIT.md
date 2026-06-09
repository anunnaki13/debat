# R0 Current State Audit

Tanggal: 2026-06-10

## Baseline

- Branch recovery: `recovery/voice-first-mvp`
- Baseline tag: `v0.0.0-before-ui-recovery`
- Source commit sebelum recovery docs: `4463d58 Expand safe debate topics`
- Recovery blueprint added from `origin/main`: `REPUBLIK_ARGUMEN_UI_UX_RECOVERY_AND_CONTINUATION_BLUEPRINT.md`
- Port QA aktif: `3001`

## Stack Aktual

- Framework: Next.js App Router `16.2.7`
- Runtime UI: React `19.2.4`
- Styling: Tailwind CSS v4 via `@tailwindcss/postcss`
- Language: TypeScript
- Validation: Zod
- Test runner: Vitest
- UI test utilities: Testing Library + jsdom
- Icons: `lucide-react`
- Persistence: browser `localStorage`
- Database: belum ada
- Auth/login: belum ada
- Payment/social/public leaderboard: belum ada backend

## Screenshot Current State

- `docs/recovery/screenshots/R0_current_lobby_desktop.png`
- `docs/recovery/screenshots/R0_current_lobby_mobile.png`

## Yang Benar-Benar Bekerja

- Lobby dapat dibuka di `http://localhost:3001`.
- Topik bawaan tersedia dan sudah diperluas menjadi 22 topik aman.
- Custom topic lokal dapat dibuat dan dipakai untuk session.
- Text-only debate session dapat dibuat dari browser.
- AI opponent route tersedia di `/api/debate/opponent`.
- AI judge route tersedia di `/api/debate/judge`.
- Voice input route tersedia di `/api/voice/transcribe`.
- TTS route tersedia di `/api/voice/synthesize`.
- Device check route tersedia di `/debate/device-check`.
- Result screen dan Delivery Coach tersedia di `/result/[sessionId]`.
- History lokal tersedia di `/history`.
- Dev UI playground tersedia di `/dev/ui-playground`.
- Dev mock arena tersedia di `/dev/mock-arena`.
- Error mapping OpenRouter sudah mencakup auth, rate limit, model unavailable, credits, unsupported response format, empty response, timeout, dan upstream error.
- Smoke tests API sudah ada untuk opponent, judge fallback, STT, TTS, dan OpenRouter setup check.

## Mock, Placeholder, atau Berisiko Menyesatkan

- Brand UI masih menampilkan `Arena Politika`, bukan `Republik Argumen`.
- Sidebar masih menampilkan `Karir Politik`, `Ranking`, `AI Coach`, `Misi Harian`, dan `Kredit Arena`.
- Lobby masih menampilkan fake/social-like metrics:
  - `156.230 pemain sedang online`
  - `512 Setuju`
  - `218 Butuh data`
  - `143 Interupsi`
  - `89 Menarik`
  - `612 menunggu`, `428 menunggu`, dan sejenisnya.
- `Premium Club` tampil di top utility bar walau tidak ada payment/membership.
- `Live Arena Feed` tampil walau tidak ada backend public feed.
- `AI Coach` tampil sebagai panel lobby/arena, tetapi belum merupakan coach aktif yang berbasis hasil sesi nyata.
- API key dan model selector OpenRouter masih tampil pada halaman user-facing lobby.
- `Tes OpenRouter` berada pada lobby user-facing, sedangkan recovery blueprint meminta config teknis dipindah ke dev-only route.
- Mode cards masih menampilkan beberapa future/coming-soon mode di lobby panjang.
- Top-level flow masih dashboard panjang, belum route-based step flow.

## Perbedaan Dengan Recovery Blueprint

- Blueprint target memakai `/device-check`, sedangkan repo aktual memakai `/debate/device-check`.
- Blueprint target memakai `/arena/[sessionId]`, sedangkan repo aktual memakai `/debate/[sessionId]`.
- Blueprint target memakai `/results/[sessionId]`, sedangkan repo aktual memakai `/result/[sessionId]`.
- Blueprint target meminta `/play`, `/topics`, `/topics/new`, `/topics/refine`, `/settings`, dan `/dev/ai-config`; route ini belum ada.
- Blueprint target meminta API key server-side only; repo aktual masih mendukung local browser API key preference.
- Blueprint target meminta fake metrics dihapus; repo aktual masih menampilkannya.

## Validasi R0

- `npm run typecheck`: lulus
- `npm run lint`: lulus
- `npm run test`: lulus, 17 file dan 46 test
- `npm run build`: lulus, 13 route berhasil digenerate
- `git diff --check`: lulus
- Smoke `curl -I http://127.0.0.1:3001`: lulus sebelum audit, HTTP 200

## Rekomendasi Setelah R0

Sprint berikutnya harus mengikuti recovery blueprint:

1. Jalankan Sprint R1 saja.
2. Ganti brand `Arena Politika` menjadi `Republik Argumen`.
3. Sederhanakan sidebar.
4. Sembunyikan fake metrics dan future features.
5. Pindahkan API/model config dari user-facing UI ke dev-only path.
6. Jangan membangun fitur baru sebelum clutter MVP dibersihkan.
