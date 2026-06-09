# UI Sprint 4 Report

Date: 2026-06-09

## 1. Ringkasan Perubahan

UI Sprint 4 mengubah arah arena berdasarkan dua mockup PNG terbaru yang diunggah user. Setelah review visual pertama, implementasi dirombak lagi agar lebih literal mengikuti mockup: sidebar/profile lebih padat, hero duel besar, mode cards horizontal, challenge feed, dan arena debate berbentuk match screen dengan panel peserta kiri/tengah/kanan.

Fokus yang selesai:

- dua mockup PNG dipindahkan menjadi design reference;
- arena SVG asset pack dibuat di `public/assets/arena/`;
- hero duel, challenge card, dan boss battle art ditambahkan agar lobby lebih dekat dengan mockup;
- animation utilities ditambahkan ke `src/styles/motion.css`;
- reusable animation components dibuat di `src/components/arena/ArenaEffects.tsx`;
- `/dev/mock-arena` dibuat untuk simulasi visual state tanpa API call;
- real debate arena memakai match HUD, user podium, AI opponent panel, transcript tengah, waveform, momentum meter, action bar, dan input dock baru;
- lobby hero, sidebar, mode cards, dan challenge feed mengikuti komposisi mockup lebih dekat;
- visual QA screenshots untuk mock arena, real arena, dan lobby asset pass.

## 2. File Dibuat

- `docs/design-reference/mockup-arena-overview.png`
- `docs/design-reference/mockup-product-system.png`
- `public/assets/arena/logo-mark.svg`
- `public/assets/arena/rank-orator-badge.svg`
- `public/assets/arena/user-orator-avatar.svg`
- `public/assets/arena/ai-opponent-avatar.svg`
- `public/assets/arena/arena-backdrop.svg`
- `public/assets/arena/mode-duel-ai.svg`
- `public/assets/arena/mode-kursi-panas.svg`
- `public/assets/arena/mode-majelis-publik.svg`
- `public/assets/arena/mode-satu-lawan-tribun.svg`
- `public/assets/arena/hero-duel-scene.svg`
- `public/assets/arena/mode-boss-battle.svg`
- `public/assets/arena/challenge-ai-jobs.svg`
- `public/assets/arena/challenge-remote-work.svg`
- `public/assets/arena/challenge-cashless.svg`
- `public/assets/arena/challenge-public-transport.svg`
- `public/assets/arena/assets-manifest.md`
- `src/components/arena/ArenaEffects.tsx`
- `src/components/debate/ArenaVisuals.tsx`
- `src/components/lobby/PopularChallengeStrip.tsx`
- `src/components/dev/MockArena.tsx`
- `src/app/dev/mock-arena/page.tsx`
- `docs/visual-qa/mock-arena-desktop.png`
- `docs/visual-qa/mock-arena-mobile.png`
- `docs/visual-qa/lobby-game-assets-desktop.png`
- `docs/visual-qa/arena-real-desktop.png`
- `docs/visual-qa/arena-real-mobile.png`

## 3. File Diubah

- `src/components/debate/DebateScreen.tsx`
- `src/components/debate/DebateHeader.tsx`
- `src/components/debate/DebateComposer.tsx`
- `src/components/debate/DebateTranscript.tsx`
- `src/components/debate/MessageBubble.tsx`
- `src/components/debate/RoundStepper.tsx`
- `src/components/debate/TurnTimer.tsx`
- `src/components/debate/VoiceInputButton.tsx`
- `src/components/layout/DesktopSidebar.tsx`
- `src/components/lobby/LobbyHero.tsx`
- `src/components/lobby/ModeCard.tsx`
- `src/components/lobby/ModeCarousel.tsx`
- `src/styles/motion.css`
- `src/styles/tokens.css`
- `README.md`
- `MILESTONES.md`
- `CHANGELOG.md`

## 4. Screenshot Visual QA

- `docs/visual-qa/mock-arena-desktop.png` — `/dev/mock-arena`, 1440 x 900 viewport.
- `docs/visual-qa/mock-arena-mobile.png` — `/dev/mock-arena`, 360 x 800 viewport.
- `docs/visual-qa/lobby-game-assets-desktop.png` — `/`, 1440 x 900 viewport.
- `docs/visual-qa/arena-real-desktop.png` — seeded real debate arena, 1440 x 900 viewport.
- `docs/visual-qa/arena-real-mobile.png` — seeded real debate arena, 360 x 800 viewport.
- `docs/visual-qa/lobby-mockup-aligned-desktop.png` — revised `/` lobby after mockup-aligned overhaul.
- `docs/visual-qa/lobby-mockup-aligned-mobile.png` — revised mobile lobby after mockup-aligned overhaul.
- `docs/visual-qa/arena-mockup-aligned-desktop.png` — revised seeded arena after mockup-aligned overhaul.
- `docs/visual-qa/arena-mockup-aligned-mobile.png` — revised mobile arena after mockup-aligned overhaul.

## 5. State Yang Diuji

- Mock state `ready`.
- Mock state `user_speaking`.
- Mock state `ai_thinking`.
- Mock state `ai_speaking`.
- Mock state `recoverable_error`.
- Real arena with local session and existing messages.
- Real input dock empty/disabled send state.
- Real voice+camera input mode display.
- Desktop sidebar game profile/card.
- Lobby hero duel backdrop, profile card, compact mode cards, and popular challenge feed.
- Arena match HUD, participant panels, waveform, action bar, and composer dock.

## 6. Responsive Breakpoint Yang Diuji

- Desktop: 1440 x 900 via Playwright.
- Mobile small: 360 x 800 via Playwright.
- Existing server at port `3001` was used after checking occupied ports.
- Follow-up QA also used existing port `3001`; no new dev server was launched.

## 7. Accessibility Check

- Generated decorative SVGs are rendered with empty `alt` and `aria-hidden` where appropriate.
- Mock state chips use accessible button semantics through `Chip`.
- Mic input control keeps `aria-label` in `/dev/mock-arena`.
- Real composer keeps textarea placeholder and submit button text.
- Status changes use visible text and icons, not color alone.

## 8. Performance Notes

- Generated assets are SVG, not heavy raster images.
- Animations are CSS-based and covered by existing reduced-motion override.
- `/dev/mock-arena` is development-only and returns `notFound()` in production.
- No AI/API calls were added to the playground or visual asset system.

## 9. Known Issues

- The two uploaded PNG mockups are reference images only and are not used as full-screen UI backgrounds.
- The mobile bottom nav remains fixed, so full-page screenshots show it in the viewport while content scrolls behind it.
- Persona/avatar and challenge artwork are SVG placeholder art, not final brand illustration.
- Full-page mobile screenshots include the fixed bottom navigation at the viewport position; this is a capture artifact of fixed-position UI.

## 10. Next Sprint Recommendation

Proceed only after user confirmation:

- refine game-style lobby cards with more topic/challenge art;
- add result screen game-style trophy/social card polish;
- add small sound cues if browser-safe;
- tune arena micro-interactions after manual debate playthrough.
