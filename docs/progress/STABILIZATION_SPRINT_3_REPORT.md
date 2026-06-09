# Stabilization Sprint 3 - OpenRouter Setup Check

Tanggal: 2026-06-09

## Tujuan

Mengurangi kegagalan pertama di arena dengan memberi user cara mengecek OpenRouter API key dan model sebelum debat dimulai.

## Hasil Implementasi

- Menambahkan endpoint `/api/ai/openrouter-check`.
- Endpoint mengecek model lawan dan model wasit yang unik dengan request chat minimal.
- Endpoint memakai error mapping OpenRouter yang sudah ada:
  - key invalid;
  - rate limit;
  - model tidak tersedia;
  - kredit kurang;
  - respons kosong;
  - timeout.
- Menambahkan tombol `Tes OpenRouter` di setup lobby.
- Tombol memiliki state loading, success, dan error.
- Preference OpenRouter disimpan setelah tes berhasil.

## Test Coverage

- `src/app/api/ai/openrouter-check/route.test.ts`
  - model sama dicek satu kali;
  - model lawan/wasit berbeda dicek dua kali;
  - API key kosong ditolak sebelum fetch;
  - rate limit mengembalikan model yang gagal.
- `src/app/page.test.tsx`
  - tombol `Tes OpenRouter` menampilkan status siap saat endpoint sukses.

## Catatan Port

Tidak ada port baru yang dipakai untuk sprint ini. Port utama yang akan dipakai untuk QA adalah `3001`.
