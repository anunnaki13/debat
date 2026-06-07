# Republik Argumen Milestones

Dokumen ini menjelaskan status implementasi saat ini dan arah milestone berikutnya. Blueprint rinci tetap menjadi sumber utama keputusan produk; dokumen ini dipakai sebagai ringkasan eksekusi agar perubahan di repo mudah ditinjau.

## Milestone 0 - Blueprint

Status: tersedia.

Artefak:

- `REPUBLIK_ARGUMEN_MVP_AI_DEBATE_BLUEPRINT.md`

Tujuan:

- Mendefinisikan MVP personal untuk debat tiga ronde.
- Menetapkan batasan fitur: tanpa login, database, pembayaran, multiplayer, atau social layer.
- Menetapkan kontrak AI Opponent, AI Judge, localStorage, voice browser, dan export JSON.

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
- Voice input dan text-to-speech memakai API browser saat tersedia.
- Dockerfile dan `docker-compose.yml` tersedia untuk deployment sederhana.

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

## Milestone 2 - Blueprint Detail Integration

Status: planned.

Trigger:

- User mengunggah blueprint detail baru.

Rencana kerja:

- Bandingkan blueprint detail dengan MVP yang sudah berjalan.
- Pisahkan perubahan menjadi kategori:
  - must-have untuk personal MVP;
  - follow-up setelah MVP stabil;
  - fitur yang tetap ditunda.
- Update README dan milestone ini sesuai keputusan baru.
- Tambahkan atau revisi acceptance checklist.
- Implementasi perubahan dalam branch terpisah agar mudah direview.

## Milestone 3 - Stabilization

Status: planned.

Fokus:

- Uji manual dengan OpenRouter key nyata.
- Pastikan model gratis dan murah memberi respons yang cukup baik untuk debat Indonesia.
- Perbaiki error message provider agar lebih spesifik: invalid key, rate limit, unsupported structured output, dan timeout.
- Tambah mode fallback untuk AI Judge bila model murah tidak patuh JSON schema.
- Tambah smoke test untuk route API dengan mock provider.

## Milestone 4 - Product Refinement

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
