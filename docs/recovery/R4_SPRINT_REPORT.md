# R4 Sprint Report - Lobby Reconstruction

Date: 2026-06-10  
Branch: `recovery/voice-first-mvp`  
Fixed QA port: `3001`

## Goal

Execute Sprint R4 from `REPUBLIK_ARGUMEN_UI_UX_RECOVERY_AND_CONTINUATION_BLUEPRINT.md`:

- rebuild the lobby around a clear first impression;
- add greeting, primary CTA, two active modes, topic recommendations, latest local history, and a recommendation card;
- keep the lobby free from fake social proof and API config.

## Implemented

- Rebuilt `/` as a compact arena lobby instead of a route menu.
- Added greeting state for first-time and returning local users.
- Added clear primary CTA: `Mulai Debat AI`.
- Added exactly two active lobby modes:
  - `Duel Wacana AI`;
  - `Topik Privat`.
- Added topic recommendation cards using existing challenge assets and `debateTopics`.
- Topic recommendation clicks now prefill the route draft and move to `/topics`.
- Added latest real local-history panel from `localStorage`.
- Added recommendation card that uses the latest judge exercise when available, otherwise a deterministic starter exercise.
- Updated home tests for R4 behavior and clutter guards.

## Acceptance Check

| Criteria | Status | Evidence |
|---|---:|---|
| Lobby can be understood quickly | Pass | Hero explains the loop: choose topic, debate text/voice, read report. |
| No fake social proof | Pass | Counts are local-only completed/active sessions; no public waitlists or fake live feed. |
| No API config | Pass | No OpenRouter/Gemini fields, model selector, or API test controls on `/`. |
| CTA clear | Pass | Primary CTA is `Mulai Debat AI`; secondary links are topic/mode specific. |
| Responsive | Pass | Captured desktop and 360px mobile screenshots. |

## Screenshots

- Desktop lobby: `docs/recovery/screenshots/R4_lobby_desktop.png`
- Mobile 360px lobby: `docs/recovery/screenshots/R4_lobby_mobile_360.png`

## Validation

Passed:

- `npm run typecheck`
- `npm run lint`
- `npm run test` - 19 files, 54 tests
- `npm run build` - 20 app routes generated
- `git diff --check`
- `curl -I http://localhost:3001/` - HTTP 200
- `curl -I http://localhost:3001/play` - HTTP 200
- `curl -I http://localhost:3001/topics` - HTTP 200
- `curl -I http://localhost:3001/topics/new` - HTTP 200

## Notes

- Production server is running on fixed port `3001`.
- R5 should continue into topic/custom-topic flow polish: categories, search/filter, custom topic comfort, refiner, and safe-copy fallbacks.
