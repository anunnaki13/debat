# Republik Argumen

Personal MVP untuk debat tiga ronde melawan AI Opponent, lalu dinilai oleh AI Judge. Blueprint aktif sekarang adalah Voice Arena: text-only tetap wajib jalan, sementara voice dan voice+camera masuk melalui device check dan fallback aman.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka `http://localhost:3000`.

Isi `OpenRouter API Key` di halaman awal lalu tekan `Simpan & Mulai Debat`. Default model paling hemat adalah `openrouter/free`. Jika kena limit, pilih model murah berbayar di dropdown seperti `inclusionai/ling-2.6-flash`, `meta-llama/llama-3.1-8b-instruct`, atau `mistralai/mistral-nemo`. Key disimpan lokal di browser dan tidak ikut diekspor dalam JSON session.

Mode input:

- `TEXT`: langsung masuk arena debat.
- `VOICE`: melewati `/debate/device-check` untuk izin mikrofon dan meter suara.
- `VOICE_CAMERA`: melewati `/debate/device-check` untuk preview kamera lokal dan meter suara. Video tidak dikirim ke AI dan tidak diunggah.

Jika ingin fallback konfigurasi server tanpa input UI, isi `.env.local`:

```bash
OPENROUTER_API_KEY=...
OPENROUTER_OPPONENT_MODEL=...
OPENROUTER_JUDGE_MODEL=...
OPENROUTER_STT_API_KEY=...
OPENROUTER_TTS_API_KEY=...
OPENROUTER_TTS_MODEL=...
```

Anda bisa memakai satu shared key lewat `OPENROUTER_API_KEY`, atau memisahkan `OPENROUTER_OPPONENT_API_KEY` dan `OPENROUTER_JUDGE_API_KEY`. Jangan memakai prefix `NEXT_PUBLIC_` untuk key OpenRouter karena nilai itu bisa ikut masuk ke bundle browser.

## Scripts

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run start
```

## Docker

```bash
docker compose up --build -d
docker compose logs -f
```

Konfigurasi OpenRouter tetap dibaca dari `.env.local` melalui `docker-compose.yml`.

## MVP Scope

- Pilih topik lokal dan posisi `PRO`, `CONTRA`, atau acak.
- Debat tiga ronde: opening, rebuttal, closing.
- AI Opponent dipanggil dari route server `/api/debate/opponent`.
- AI Judge/wasit dipanggil dari route server `/api/debate/judge`.
- Prompt menyertakan knowledge base pertandingan: topik, konteks, posisi user, posisi AI yang wajib berlawanan, dan wasit AI terpisah.
- Session tersimpan di `localStorage` browser.
- Report bisa dibuka dari history dan diekspor sebagai JSON.
- Text session masih bisa memakai voice input dan text-to-speech browser sebagai fallback.
- Device check untuk voice/voice+camera.
- Voice/voice+camera memakai `MediaRecorder` ke OpenRouter STT, dengan transcript review sebelum kirim.
- Auto-speak lawan di mode voice memakai OpenRouter TTS saat dikonfigurasi, lalu fallback ke TTS browser.
- Server route untuk OpenRouter STT dan TTS.
- Delivery Signals helper tanpa klaim deteksi emosi.

OpenRouter key yang diisi lewat UI tetap berada di browser lokal, dikirim hanya ke route server lokal saat request AI berjalan, dan tidak masuk ke export session.

## Active Blueprint

`REPUBLIK_ARGUMEN_MVP_VOICE_ARENA_BLUEPRINT.md` adalah source of truth aktif. Blueprint lama diarsipkan di `docs/archive/`.

## Milestones

Lihat `MILESTONES.md` dan `docs/progress/SPRINT_0_6_REPORT.md` untuk status MVP saat ini, rencana voice arena, dan milestone lanjutan.
