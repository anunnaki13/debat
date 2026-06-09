# R0 Route Inventory

Tanggal: 2026-06-10

## App Routes Aktual

| Route | File | Status | Catatan Recovery |
|---|---|---|---|
| `/` | `src/app/page.tsx` | Aktif | Lobby terlalu padat, masih menampilkan API key/model selector, fake metrics, dan brand politik. |
| `/history` | `src/app/history/page.tsx` | Aktif | Riwayat lokal berbasis `localStorage`. |
| `/debate/[sessionId]` | `src/app/debate/[sessionId]/page.tsx` | Aktif | Arena debat aktual. Blueprint target memakai `/arena/[sessionId]`. |
| `/debate/device-check` | `src/app/debate/device-check/page.tsx` | Aktif | Device check aktual. Blueprint target memakai `/device-check`. |
| `/result/[sessionId]` | `src/app/result/[sessionId]/page.tsx` | Aktif | Result reveal dan Delivery Coach aktual. Blueprint target memakai `/results/[sessionId]` dan `/results/[sessionId]/coach`. |
| `/dev/ui-playground` | `src/app/dev/ui-playground/page.tsx` | Aktif dev | Sesuai kebutuhan dev playground. |
| `/dev/mock-arena` | `src/app/dev/mock-arena/page.tsx` | Aktif dev | Berguna untuk visual state mock. |

## API Routes Aktual

| Route | File | Status | Catatan Recovery |
|---|---|---|---|
| `POST /api/ai/openrouter-check` | `src/app/api/ai/openrouter-check/route.ts` | Aktif | Saat ini dipakai dari lobby user-facing; blueprint meminta config teknis dev-only. |
| `POST /api/debate/opponent` | `src/app/api/debate/opponent/route.ts` | Aktif | Memanggil OpenRouter/Gemini sesuai config client/server. |
| `POST /api/debate/judge` | `src/app/api/debate/judge/route.ts` | Aktif | Structured JSON + fallback plain JSON. |
| `POST /api/voice/transcribe` | `src/app/api/voice/transcribe/route.ts` | Aktif | OpenRouter STT dengan Delivery Signals. |
| `POST /api/voice/synthesize` | `src/app/api/voice/synthesize/route.ts` | Aktif | OpenRouter TTS + browser fallback di client. |

## Route Target Recovery Yang Belum Ada

| Target Route | Status |
|---|---|
| `/play` | Belum ada |
| `/topics` | Belum ada |
| `/topics/new` | Belum ada |
| `/topics/refine` | Belum ada |
| `/device-check` | Belum ada, saat ini `/debate/device-check` |
| `/arena/[sessionId]` | Belum ada, saat ini `/debate/[sessionId]` |
| `/results/[sessionId]` | Belum ada, saat ini `/result/[sessionId]` |
| `/results/[sessionId]/coach` | Belum ada |
| `/settings` | Belum ada |
| `/dev/ai-config` | Belum ada |
| `GET /api/health` | Belum ada |
| `POST /api/topics/refine` | Belum ada |

## Navigation Aktual

- Desktop sidebar ada, tetapi masih membawa label dan fitur yang recovery blueprint minta disembunyikan.
- Mobile bottom nav ada, tetapi label masih `Beranda`, `Arena`, `Topik`, `Jelajah`, `Profil`; blueprint target meminta `[Beranda] [Main] [+] [Topik] [Riwayat]`.
- Lobby masih menjadi dashboard panjang, bukan flow route-based.

## Rekomendasi R1/R2

- R1: bersihkan navigation labels dan sembunyikan route-link/future feature yang misleading.
- R2: baru pecah flow ke route target, dengan redirect kompatibel dari route lama bila perlu.
