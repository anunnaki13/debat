# Sprint R7 Text Debate Engine Report

Date: 2026-06-11

## Scope

Sprint R7 implements the text-first debate engine refinements from `REPUBLIK_ARGUMEN_UI_UX_RECOVERY_AND_CONTINUATION_BLUEPRINT.md`.

Blueprint acceptance target:

- Duel Wacana AI text-only can complete end-to-end.
- Refresh and recoverable error handling remain safe enough for MVP.
- AI opponent stays in the opposing position.
- AI Judge is triggered after the session completes.

## Implemented

- Added an `ai_streaming_text` arena visual state so the arena distinguishes AI thinking from AI writing.
- Added an in-transcript streaming draft for opponent responses.
- Final AI messages are persisted only after the visible streaming draft completes.
- AI opponent caption panel now mirrors the streaming response while it is being written.
- Retry remains available only after a failed opponent call, not during an active stream.
- Added tests for:
  - local session submit + AI response + round advancement;
  - visible opponent streaming draft before final persistence;
  - AI Judge request and result navigation when all rounds are complete;
  - auto-speak interrupt flow after the streamed response completes.
- Updated `/dev/mock-arena` state coverage for the new streaming visual state.

## Notes

The OpenRouter call still returns a full response from the server API. The MVP now renders that response as a client-side live transcript stream. This keeps the UI aligned with the blueprint without changing the server API contract yet. A future R7.x or R8 task can replace this with true upstream token streaming if needed.

## Verification

- `npm run typecheck`
- `npx vitest run src/components/debate/DebateScreen.test.tsx`
- `npm test`
- `npm run lint`
- `npm run build`

All commands passed locally.

Runtime check:

- Production server restarted on port `3001`.
- `/` returned `200 OK`.
- `/api/health` returned `degraded` because local `.env.local` currently has empty OpenRouter key/model values. Fill `OPENROUTER_API_KEY` or role-specific keys plus `OPENROUTER_OPPONENT_MODEL` and `OPENROUTER_JUDGE_MODEL`, then restart port `3001`.
