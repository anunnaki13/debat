# UI Sprint 3 Report

Date: 2026-06-09

## 1. Ringkasan Perubahan

UI Sprint 3 memoles `/debate/device-check` sesuai `REPUBLIK_ARGUMEN_UI_UX_STYLE_BLUEPRINT.md` tanpa mengubah kontrak route, local session, atau fallback debat.

Fokus yang selesai:

- permission explanation sebelum browser dialog;
- camera preview tile dengan video ref yang selalu tersedia;
- mic meter visual berbasis token;
- selector mikrofon dan kamera;
- speaker test cue singkat;
- status perangkat dengan ikon dan copy fallback;
- tombol `Masuk Arena`, `Lanjut Tanpa Kamera`, dan `Gunakan Teks`;
- screenshot QA desktop dan mobile.

## 2. File Dibuat

- `docs/visual-qa/device-check-desktop.png`
- `docs/visual-qa/device-check-mobile.png`

## 3. File Diubah

- `src/components/device/DeviceCheckScreen.tsx`
- `README.md`
- `MILESTONES.md`
- `CHANGELOG.md`

## 4. Screenshot Visual QA

- `docs/visual-qa/device-check-desktop.png` — 1440 x 1234 full-page screenshot.
- `docs/visual-qa/device-check-mobile.png` — 409 x 2006 full-page screenshot from a 360 x 800 mobile viewport.

## 5. State Yang Diuji

- Session lokal valid membuka device check.
- Kamera tidak aktif sebelum user menekan tombol cek perangkat.
- Permission explanation tampil sebelum browser permission dialog.
- Voice + Camera menjadi mode awal saat query `input=VOICE_CAMERA`.
- Toggle ke voice-only mematikan status kamera.
- Selector mikrofon dan kamera tetap aman saat label device belum tersedia.
- Speaker test memakai cue pendek dan timeout otomatis.
- Fallback voice-only dan text-only tetap langsung menuju arena.

## 6. Responsive Breakpoint Yang Diuji

- Desktop: 1440 x 900 viewport melalui Playwright.
- Mobile small: 360 x 800 viewport melalui Playwright.
- HTTP smoke: `/debate/device-check` returned `200 OK` on the existing server at port `3001`.

## 7. Accessibility Check

- Native select controls memakai label visible.
- Mic meter memakai `role="meter"` dan `aria-valuenow`.
- Status perangkat memakai ikon dan teks, bukan warna saja.
- CTA utama tetap berupa button dengan loading state.
- Fallback text-only tetap tersedia tanpa permission media.

## 8. Performance Notes

- Device enumeration memakai `navigator.mediaDevices.enumerateDevices()` dan listener `devicechange`.
- Tidak ada API call baru.
- Tidak ada upload video; preview tetap lokal dan muted.
- Camera stream cleanup tetap menghentikan tracks dan melepas `srcObject`.

## 9. Known Issues

- Selector speaker belum mengubah output device karena browser `speechSynthesis` tidak menyediakan sink selection portabel.
- Permission denied manual matrix belum dijalankan di perangkat fisik.
- Mobile full-page screenshot menampilkan bottom nav fixed pada viewport pertama, sama seperti app shell sprint sebelumnya.

## 10. Next Sprint Recommendation

Proceed to UI Sprint 4 only after user confirmation:

- arena base layout;
- speaking state surface;
- argument card redesign;
- transcript review polish;
- AI opponent voice state;
- debate round navigation polish.
