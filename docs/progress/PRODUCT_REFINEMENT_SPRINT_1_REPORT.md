# Product Refinement Sprint 1 - Safe Topic Expansion

Tanggal: 2026-06-10

## Tujuan

Meningkatkan replayability MVP tanpa menambah fitur sosial, login, database, atau dependensi eksternal.

## Hasil Implementasi

- Memperluas topik bawaan dari 10 menjadi 22 topik.
- Topik baru mencakup:
  - AI di tugas sekolah;
  - Wi-Fi ruang publik;
  - pengurangan food waste;
  - hunian vertikal;
  - privasi aplikasi layanan publik;
  - micro-credentials;
  - akademi muda klub olahraga;
  - batas kapasitas destinasi wisata;
  - tanggung jawab sampah kemasan;
  - promosi produk UMKM lokal;
  - kebijakan gawai di sekolah;
  - perpustakaan publik.
- Semua topik tetap lokal, aman untuk MVP, dan tidak membutuhkan public feed atau social layer.

## Test Coverage

- `src/data/topics.test.ts`
  - minimal 20 topik;
  - ID topik unik;
  - semua topik kompatibel dengan schema API;
  - spice level tetap di range 1-4.

## Catatan

- Uji manual dengan OpenRouter key nyata belum dilakukan karena `.env.local` tidak berisi key OpenRouter server-side.
- Port QA tetap `3001`.
