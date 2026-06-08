# Sprint 0-6 Progress Report

Date: 2026-06-09

## Scope Covered

This report covers the initial integration of the new Voice Arena blueprint and the first working voice pipeline slice in the existing Republik Argumen MVP branch.

## Completed

- Adopted `REPUBLIK_ARGUMEN_MVP_VOICE_ARENA_BLUEPRINT.md` as the active source of truth.
- Moved the old AI debate blueprint to `docs/archive/`.
- Added mode and input-mode domain types:
  - `DUEL_WACANA_AI`;
  - `KURSI_PANAS_AI` placeholder;
  - `PRIVATE_OPINION` placeholder;
  - `TEXT`;
  - `VOICE`;
  - `VOICE_CAMERA`.
- Added lobby selection UI for mode and input mode.
- Added routing through `/debate/device-check` for voice and voice+camera sessions.
- Added device check screen with:
  - local camera preview;
  - mic level meter using Web Audio;
  - camera toggle;
  - AI voice test;
  - fallback to voice-only;
  - fallback to text-only;
  - media track cleanup on route exit.
- Added OpenRouter STT and TTS server routes.
- Connected browser `MediaRecorder` audio capture to `/api/voice/transcribe` for `VOICE` and `VOICE_CAMERA` sessions.
- Added editable transcript review through the existing composer before argument submit.
- Connected voice-mode auto-speak to `/api/voice/synthesize`, with browser TTS fallback.
- Added Delivery Signals calculation helper with unit tests.
- Added local analytics event scaffold.
- Added `Permissions-Policy: camera=(self), microphone=(self)`.
- Updated `.env.example`, README, and changelog.

## Deferred

- OpenRouter TTS is not yet connected to an audio queue or sentence chunker.
- AI voice interruption is not yet a dedicated state/button.
- Streaming opponent response remains a future sprint item.
- Delivery report tab is scaffolded at data/helper level, not yet fully wired into result UI.
- PostgreSQL/Redis from the target monorepo architecture are not introduced yet to avoid overbuilding before the current MVP loop stabilizes.

## Validation

- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run test` passed.
- `npm run build` passed.
- Smoke test: `/`, `/debate/device-check`, and invalid `/api/voice/transcribe` validation route responded as expected.

## Notes

The MVP remains playable text-only. Voice and voice+camera now have a real device-check gate, OpenRouter STT path, TTS path for auto-speak, and safe fallbacks, matching the blueprint principle that text-only must always work.
