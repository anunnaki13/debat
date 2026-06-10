# R2 Sprint Report - Route-Based Flow

Date: 2026-06-10  
Branch: `recovery/voice-first-mvp`  
Fixed QA port: `3001`

## Goal

Execute Sprint R2 from `REPUBLIK_ARGUMEN_UI_UX_RECOVERY_AND_CONTINUATION_BLUEPRINT.md`:

- Break the long lobby/dashboard setup into route-based steps.
- Persist user choices across routes and refresh.
- Add blueprint routes while preserving old URLs as redirects.
- Keep the game playable after the route split.

## Implemented Routes

New canonical routes:

```text
/play
/topics
/topics/new
/topics/refine
/device-check
/arena/[sessionId]
/results/[sessionId]
/results/[sessionId]/coach
/settings
```

Kept legacy redirects:

```text
/debate/[sessionId]        -> /arena/[sessionId]
/debate/device-check       -> /device-check
/result/[sessionId]        -> /results/[sessionId]
```

## Implemented Flow

1. `/`
   - Home is now a compact lobby entry, not a full setup dashboard.
   - Primary CTA routes to `/play`.
   - Secondary route cards link to `/play`, `/topics`, and `/topics/new`.

2. `/play`
   - Dedicated mode and input selection.
   - Saves draft state to localStorage.
   - Continues to `/topics` or `/topics/new` for private-topic mode.

3. `/topics`
   - Dedicated topic and side selection page.
   - Starts a session from draft state.
   - Routes text mode to `/arena/[sessionId]`.
   - Routes voice modes to `/device-check?sessionId=...&input=...`.

4. `/topics/new` and `/topics/refine`
   - Dedicated private topic and refiner routes.
   - Save custom/refined topics into the flow draft before returning to `/topics`.

5. `/settings`
   - User-facing preferences only.
   - Dev AI config link is hidden in production.

6. `/results/[sessionId]/coach`
   - Dedicated Delivery Coach route.
   - Shows voice delivery signals when present and clear fallback copy when missing.

## State Persistence

Added `src/lib/flow/debateFlowDraft.ts` with:

```text
republik-argumen.flow-draft.v1
```

Persisted fields:

- mode
- inputMode
- sideSelection
- topic
- updatedAt

This lets `/play`, `/topics`, `/topics/new`, and `/topics/refine` survive refresh/back navigation without losing draft choices.

## Navigation Updates

- Desktop sidebar now links to `/play`, `/topics`, `/history`, and `/settings`.
- Mobile nav now links to `/play`, `/topics/new`, `/topics`, and `/history`.
- History reports open `/results/[sessionId]`.
- Debate completion routes to `/results/[sessionId]`.
- Device check continues to `/arena/[sessionId]`.

## Acceptance Check

| Criteria | Status | Evidence |
|---|---:|---|
| User can complete navigation flow without long dashboard scroll | Pass | `/` routes into `/play` -> `/topics` -> `/arena` or `/device-check`. |
| State across steps is saved | Pass | Flow draft localStorage added and covered by tests. |
| Back button works | Pass | Routes are real pages with direct links and legacy redirects. |
| Refresh does not fatally break flow | Pass | `/play` and `/topics` reload draft; missing session pages show recoverable local-session errors. |
| Build passes | Pass | `npm run build` passed with 20 app routes. |

## Screenshots

- Desktop play flow: `docs/recovery/screenshots/R2_play_desktop.png`
- Mobile topics flow: `docs/recovery/screenshots/R2_topics_mobile.png`

## Validation

Passed:

- `npm run typecheck`
- `npm run lint`
- `npm run test` - 18 files, 47 tests
- `npm run build` - 20 app routes generated
- `git diff --check`
- `curl -I http://127.0.0.1:3001/play` - HTTP 200
- `curl -I http://127.0.0.1:3001/topics/new` - HTTP 200
- `curl -I http://127.0.0.1:3001/debate/test-session` - HTTP 307 to `/arena/test-session`
- `curl -I http://127.0.0.1:3001/result/test-session` - HTTP 307 to `/results/test-session`
- `curl -I 'http://127.0.0.1:3001/debate/device-check?sessionId=abc&input=VOICE'` - HTTP 307 to `/device-check?sessionId=abc&input=VOICE`

Forbidden-pattern scan against `/play` returned no matches for:

```text
OpenRouter API Key
Premium Club
Live Arena Feed
Arena Politika
Karir Politik
Profil Ideologi
[number] menunggu
Model lawan
Tes OpenRouter
```

## Notes

- Existing `/api/debate/*` endpoints remain unchanged; route recovery only changes app navigation.
- Old app routes are kept as redirects so existing local sessions or links do not break.
- R3 should focus on design-system recovery, density polish, and token/component cleanup.
