# Changelog

## 2026-06-09 - UI Sprint 5 Voice Polish and Barge-In

- Added lifecycle callbacks to browser speech synthesis so the real arena can show `AI berbicara` while auto-speak is active.
- Added opponent voice playback state in the debate arena: preparing, speaking, and idle.
- Added interrupt handling that stops browser TTS, aborts pending OpenRouter TTS synthesis, clears active audio, and tracks `ai_voice_interrupted`.
- Retuned arena notice copy so users see when AI speech is being prepared, spoken, interrupted, or downgraded to browser fallback.
- Added unit coverage for `speakText` lifecycle callbacks and integration coverage for the DebateScreen interrupt flow.
- Added visual QA screenshots:
  - `docs/visual-qa/arena-voice-polish-desktop.png`;
  - `docs/visual-qa/arena-voice-polish-mobile.png`.
- Added `docs/progress/UI_SPRINT_5_REPORT.md`.

## 2026-06-09 - Arena Politika Asset Reference Pass

- Imported the newly uploaded `asset/` folder from GitHub into the working branch as active visual reference material.
- Reworked the lobby and arena direction toward the `ChatGPT Image May 6, 2026, 12_13_33 AM.png` reference: political debate dashboard, live arena panels, AI opponent selector, AI coach, audience reactions, career/ideology/share panels, and darker blue-red cinematic lighting.
- Replaced the "Pilih match yang sedang panas" card images with topic-relevant Unsplash photos instead of reusing the uploaded mockup/arena assets.
- Added local challenge images under `public/assets/challenges/` plus source notes.
- Added visual QA screenshot:
  - `docs/visual-qa/lobby-arena-politika-unsplash-match-feed-desktop.png`.

## 2026-06-09 - UI Sprint 4 Esports Arena Overhaul

- Replaced the previous abstract/civic-leaning asset direction with an esports arena visual pass.
- Rebuilt the arena SVG pack around high-tech stage geometry, cyan/magenta neon glow, helmet avatars, player/AI pods, HUD frames, laser sweeps, and broadcast panels.
- Retuned design tokens with electric cyan, neon blue, magenta accents, esports gradients, and glow shadows.
- Added esports HUD/grid/laser motion utilities in `src/styles/motion.css`.
- Reworked the lobby hero into a match-entry scene with player-vs-AI composition and live match HUD.
- Reworked mode cards and popular challenge cards into neon broadcast tiles instead of abstract illustrations.
- Reworked the real debate arena with esports match header, player pod, AI opponent pod, momentum HUD, action bar, voice control, and cockpit-style input dock.
- Updated sidebar, top utility bar, and app shell backgrounds to match the esports arena direction.
- Added visual QA screenshots for the new direction:
  - `docs/visual-qa/lobby-esports-overhaul-desktop.png`;
  - `docs/visual-qa/lobby-esports-overhaul-mobile.png`;
  - `docs/visual-qa/arena-esports-overhaul-desktop.png`;
  - `docs/visual-qa/arena-esports-overhaul-mobile.png`.

## 2026-06-09 — UI Sprint 4 Game Arena Assets

- Added the two uploaded PNG mockups as design references under `docs/design-reference/`.
- Added SVG game-arena asset pack under `public/assets/arena/`:
  - logo mark;
  - rank badge;
  - user orator avatar;
  - AI opponent avatar;
  - arena backdrop;
  - mode card art;
  - hero duel scene;
  - popular challenge art.
- Added CSS animation utilities for neon frames, waveforms, scanlines, particles, card float, and energy sweeps.
- Added reusable arena animation components in `src/components/arena/ArenaEffects.tsx`.
- Added development-only `/dev/mock-arena` for simulated arena visual states without API calls.
- Redesigned the real debate arena base with match HUD, user podium, AI panel, transcript center, waveform, momentum meter, action bar, and game-style input dock.
- Reworked the lobby toward the uploaded mockups with a hero duel scene, profile/rank card, compact mode strip, and popular challenge feed.
- Updated desktop sidebar to match the product/game profile structure from the mockups.
- Added visual QA screenshots:
  - `docs/visual-qa/mock-arena-desktop.png`;
  - `docs/visual-qa/mock-arena-mobile.png`;
  - `docs/visual-qa/lobby-game-assets-desktop.png`;
  - `docs/visual-qa/arena-real-desktop.png`;
  - `docs/visual-qa/arena-real-mobile.png`;
  - `docs/visual-qa/lobby-mockup-aligned-desktop.png`;
  - `docs/visual-qa/lobby-mockup-aligned-mobile.png`;
  - `docs/visual-qa/arena-mockup-aligned-desktop.png`;
  - `docs/visual-qa/arena-mockup-aligned-mobile.png`.
- Added `docs/progress/UI_SPRINT_4_REPORT.md`.

## 2026-06-09 — UI Sprint 3 Device Check

- Redesigned `/debate/device-check` around the UI/UX Style Blueprint device-check rules.
- Added permission explanation before media activation.
- Added microphone and camera selectors backed by `enumerateDevices()`.
- Reworked camera preview so the video ref exists before permission is granted while preview remains inactive before consent.
- Added token-based mic meter, status cards, speaker cue test, and clearer fallback actions.
- Preserved voice-only and text-only escape paths.
- Added device check visual QA screenshots:
  - `docs/visual-qa/device-check-desktop.png`;
  - `docs/visual-qa/device-check-mobile.png`.
- Added `docs/progress/UI_SPRINT_3_REPORT.md`.

## 2026-06-09 — UI Sprint 2 Topic Flow

- Added topic explorer with search, category chips, difficulty filter, and spice filter.
- Added spice level metadata to built-in topics.
- Added custom topic form with thesis, category, spice level, side selection, and optional context.
- Added local refiner comparison for custom topics without API calls.
- Added conservative sensitive topic validation copy.
- Added selected custom topic state and custom topic session coverage test.
- Added topic flow visual QA screenshots:
  - `docs/visual-qa/topic-flow-desktop.png`;
  - `docs/visual-qa/topic-flow-mobile.png`.
- Added `docs/progress/UI_SPRINT_2_REPORT.md`.

## 2026-06-09 — UI Sprint 1 App Shell and Lobby

- Added desktop sidebar and mobile bottom navigation.
- Added shared `AppShell` through `PageShell`.
- Redesigned the lobby around the Modern Civic Arena direction:
  - top utility bar;
  - lobby hero;
  - mode carousel/cards;
  - sticky setup arena panel;
  - progress resume card.
- Refreshed topic cards, side selector, and input mode selector with design tokens.
- Added lobby visual QA screenshots:
  - `docs/visual-qa/lobby-desktop.png`;
  - `docs/visual-qa/lobby-mobile.png`.
- Added `docs/progress/UI_SPRINT_1_REPORT.md`.

## 2026-06-09 — UI/UX Style Blueprint Foundation

- Added `REPUBLIK_ARGUMEN_UI_UX_STYLE_BLUEPRINT.md` as the source of truth for visual implementation.
- Added centralized design tokens:
  - `src/styles/tokens.css`;
  - `src/styles/motion.css`;
  - `src/styles/themes.css`;
  - `src/lib/design-tokens.ts`.
- Swapped global app typography to the blueprint direction: `Plus Jakarta Sans` for UI and `Fraunces` for editorial headings.
- Added core UI primitives under `src/components/ui/`.
- Added development-only `/dev/ui-playground` with button, chip, badge, card, form, overlay, toast, skeleton, error, voice halo, waveform, and momentum states.
- Added `docs/progress/UI_SPRINT_0_REPORT.md`.

## 2026-06-09 — Voice Arena Blueprint Integration

- Added `REPUBLIK_ARGUMEN_MVP_VOICE_ARENA_BLUEPRINT.md` as the active source of truth.
- Archived the previous blueprint under `docs/archive/`.
- Added active mode/input selection for the lobby:
  - `Duel Wacana AI`;
  - `TEXT`;
  - `VOICE`;
  - `VOICE_CAMERA`.
- Added `/debate/device-check` with local camera preview, mic permission flow, mic level meter, AI voice test, and fallback buttons.
- Added server-side OpenRouter STT and TTS routes:
  - `/api/voice/transcribe`;
  - `/api/voice/synthesize`.
- Connected voice arena recording through `MediaRecorder` to OpenRouter STT, with editable transcript review before argument submit.
- Connected voice-mode auto-speak to OpenRouter TTS, with browser TTS fallback when server audio is unavailable.
- Added Delivery Signals helpers and tests without emotion or biometric claims.
- Added local analytics event scaffolding.
- Added `Permissions-Policy` header for camera and microphone.
- Expanded `.env.example` with voice, camera, STT, TTS, and feature flag settings.

Validation:

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
