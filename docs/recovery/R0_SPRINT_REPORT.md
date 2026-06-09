# R0 Sprint Report - Freeze, Inventory, And Audit

Tanggal: 2026-06-10

## 1. Tujuan Sprint

Mendokumentasikan kondisi repository aktual sebelum recovery UI/UX dimulai, tanpa mengubah behavior atau UI.

## 2. Perubahan Dibuat

- Membuat branch `recovery/voice-first-mvp`.
- Membuat tag baseline `v0.0.0-before-ui-recovery`.
- Mengambil dokumen `REPUBLIK_ARGUMEN_UI_UX_RECOVERY_AND_CONTINUATION_BLUEPRINT.md` dari `origin/main`.
- Membuat audit current state.
- Membuat inventory route, component, dan environment.
- Membuat screenshot current state desktop dan mobile.

## 3. File Dibuat

- `REPUBLIK_ARGUMEN_UI_UX_RECOVERY_AND_CONTINUATION_BLUEPRINT.md`
- `docs/recovery/R0_CURRENT_STATE_AUDIT.md`
- `docs/recovery/R0_ROUTE_INVENTORY.md`
- `docs/recovery/R0_COMPONENT_INVENTORY.md`
- `docs/recovery/R0_ENV_INVENTORY.md`
- `docs/recovery/R0_SPRINT_REPORT.md`
- `docs/recovery/screenshots/R0_current_lobby_desktop.png`
- `docs/recovery/screenshots/R0_current_lobby_mobile.png`

## 4. File Diubah

Tidak ada file source code diubah pada R0.

## 5. Feature Flag Diubah

Tidak ada.

## 6. Command Dijalankan

- `git fetch origin --prune`
- `git checkout -b recovery/voice-first-mvp`
- `git tag v0.0.0-before-ui-recovery`
- `git checkout origin/main -- REPUBLIK_ARGUMEN_UI_UX_RECOVERY_AND_CONTINUATION_BLUEPRINT.md`
- `npx --yes playwright@1.56.1 install chromium`
- `npx --yes playwright@1.56.1 screenshot --viewport-size=1440,1200 http://127.0.0.1:3001 docs/recovery/screenshots/R0_current_lobby_desktop.png`
- `npx --yes playwright@1.56.1 screenshot --viewport-size=390,1200 http://127.0.0.1:3001 docs/recovery/screenshots/R0_current_lobby_mobile.png`
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- `git diff --check`

## 7. Hasil Lint

Lulus.

## 8. Hasil Type-Check

Lulus.

## 9. Hasil Test

Lulus: 17 test file, 46 test.

## 10. Hasil Production Build

Lulus. Next.js build menghasilkan 13 route:

- `/`
- `/_not-found`
- `/api/ai/openrouter-check`
- `/api/debate/judge`
- `/api/debate/opponent`
- `/api/voice/synthesize`
- `/api/voice/transcribe`
- `/debate/[sessionId]`
- `/debate/device-check`
- `/dev/mock-arena`
- `/dev/ui-playground`
- `/history`
- `/result/[sessionId]`

## 11. Screenshot QA

- `docs/recovery/screenshots/R0_current_lobby_desktop.png`
- `docs/recovery/screenshots/R0_current_lobby_mobile.png`

## 12. Known Issues

- UI masih memakai brand `Arena Politika`.
- Lobby masih terasa seperti dashboard showcase, bukan flow game.
- Fake metrics/social proof masih tampil.
- Sidebar masih memuat label politik, ranking, kredit, dan misi yang belum MVP-safe.
- API key/model selector masih user-facing.
- Route target recovery belum tersedia penuh.
- Manual OpenRouter real-key validation belum bisa dilakukan karena `.env.local` tidak berisi OpenRouter key server-side.

## 13. Risiko

- Jika R1 dilakukan terlalu agresif, domain logic yang sudah bekerja bisa ikut terhapus.
- API key browser preference perlu dipindahkan hati-hati agar personal development tetap bisa dites, tetapi production tidak mengekspos secret.
- Route rename perlu kompatibilitas atau redirect agar existing local sessions tidak langsung rusak.

## 14. Rekomendasi Sprint Selanjutnya

Kerjakan hanya Sprint R1:

1. Ganti brand `Arena Politika` menjadi `Republik Argumen`.
2. Sederhanakan sidebar menjadi maksimal `Beranda`, `Main`, `Topik`, `Riwayat`, `Pengaturan`.
3. Sembunyikan fake audience/live/waiting counts.
4. Sembunyikan Premium Club, Kredit Arena, ranking, karir politik, profil ideologi, dan coming-soon cards berlebihan.
5. Pindahkan AI config dari user-facing UI menuju dev-only path pada sprint security/refactor berikutnya.

## 15. STOP

Sprint R0 selesai. Sesuai recovery blueprint, berhenti dan tunggu instruksi sebelum Sprint R1.
