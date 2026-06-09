# UI Sprint 4 Report

Date: 2026-06-09

## 1. Ringkasan Perubahan

UI Sprint 4 mengubah arah arena berdasarkan dua mockup PNG terbaru yang diunggah user. Fokus sprint ini adalah membuat Republik Argumen terasa lebih seperti game arena: neon frame, avatar, panel momentum, action bar, input dock, mode-card art, dan animasi ringan.

Fokus yang selesai:

- dua mockup PNG dipindahkan menjadi design reference;
- arena SVG asset pack dibuat di `public/assets/arena/`;
- animation utilities ditambahkan ke `src/styles/motion.css`;
- reusable animation components dibuat di `src/components/arena/ArenaEffects.tsx`;
- `/dev/mock-arena` dibuat untuk simulasi visual state tanpa API call;
- real debate arena memakai user podium, AI opponent panel, status banner, momentum meter, action bar, dan input dock baru;
- lobby hero, sidebar, dan mode cards mulai memakai asset game-style;
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
- `public/assets/arena/assets-manifest.md`
- `src/components/arena/ArenaEffects.tsx`
- `src/components/debate/ArenaVisuals.tsx`
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
- Lobby hero asset backdrop, avatar rings, waveform, and mode-card art.

## 6. Responsive Breakpoint Yang Diuji

- Desktop: 1440 x 900 via Playwright.
- Mobile small: 360 x 800 via Playwright.
- Existing server at port `3001` was used after checking occupied ports.

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
- Persona/avatar artwork is SVG placeholder art, not final brand illustration.

## 10. Next Sprint Recommendation

Proceed only after user confirmation:

- refine game-style lobby cards with more topic/challenge art;
- add result screen game-style trophy/social card polish;
- add small sound cues if browser-safe;
- tune arena micro-interactions after manual debate playthrough.
