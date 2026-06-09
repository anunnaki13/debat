# UI Sprint 1 Report

Date: 2026-06-09

## 1. Ringkasan Perubahan

UI Sprint 1 mengimplementasikan App Shell dan Lobby berbasis `REPUBLIK_ARGUMEN_UI_UX_STYLE_BLUEPRINT.md` tanpa mengubah flow utama debat.

Fokus yang selesai:

- desktop sidebar;
- mobile bottom navigation;
- lobby utility bar;
- lobby hero;
- mode carousel/cards;
- topic card visual refresh;
- sticky setup arena panel;
- progress resume card;
- responsive lobby screenshots.

## 2. File Dibuat

- `src/components/layout/AppShell.tsx`
- `src/components/layout/DesktopSidebar.tsx`
- `src/components/layout/MobileBottomNav.tsx`
- `src/components/lobby/UserUtilityBar.tsx`
- `src/components/lobby/LobbyHero.tsx`
- `src/components/lobby/ModeCard.tsx`
- `src/components/lobby/ModeCarousel.tsx`
- `src/components/lobby/ProgressResumeCard.tsx`
- `docs/visual-qa/lobby-desktop.png`
- `docs/visual-qa/lobby-mobile.png`

## 3. File Diubah

- `src/app/page.tsx`
- `src/app/page.test.tsx`
- `src/components/layout/PageShell.tsx`
- `src/components/topics/TopicCard.tsx`
- `src/components/topics/InputModeSelector.tsx`
- `src/components/topics/SideSelector.tsx`
- `README.md`
- `MILESTONES.md`
- `CHANGELOG.md`

## 4. Screenshot Visual QA

- `docs/visual-qa/lobby-desktop.png` — 1440 x 900
- `docs/visual-qa/lobby-mobile.png` — 360 x 800

## 5. State Yang Diuji

- Lobby shell desktop with active sidebar item.
- Mobile bottom nav with primary `Topik` action.
- Lobby hero primary and secondary CTA.
- Mode card selected state and coming-soon disabled state.
- Topic card selected/unselected states.
- Setup panel with text, voice, and voice+camera input mode buttons.
- OpenRouter API key empty validation.
- Voice mode routing to device check.
- Progress resume empty/local-history state.

## 6. Responsive Breakpoint Yang Diuji

- Desktop: 1440 x 900 via Playwright screenshot.
- Mobile small: 360 x 800 via Playwright screenshot.
- HTTP smoke: `/` returned `200 OK` on the existing dev server at port `3001`.

## 7. Accessibility Check

- Sidebar and bottom nav use labelled `nav` landmarks.
- Active selectable cards use `aria-pressed`.
- Icon-only settings control has label/title and disabled state.
- Bottom navigation touch targets are at least 56 px high.
- Primary action remains visible on mobile.
- Existing setup flow test covers API key input label and start button.

## 8. Performance Notes

- Lobby redesign uses CSS variables and lightweight lucide icons.
- No new API calls were added to the lobby.
- No video or heavy image assets were introduced.
- Mobile mode carousel uses native horizontal scroll.

## 9. Known Issues

- App shell links for Arena, Jelajah Topik, and Pengaturan currently route to existing sections instead of dedicated `/arena`, `/topics`, or `/settings` pages.
- Existing arena, device check, result, and history screens still need later visual migration to the style blueprint.
- Mobile bottom nav is functional, but the dedicated profile/settings experience is not built yet.

## 10. Next Sprint Recommendation

Proceed to UI Sprint 2 only after user confirmation:

- topic picker filters;
- category chips;
- custom topic form;
- spice meter refinements;
- AI topic refiner comparison;
- validation copy for sensitive topics.
