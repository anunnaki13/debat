# R6 Sprint Report - OpenRouter Server Security

Date: 2026-06-10  
Branch: `recovery/voice-first-mvp`  
Fixed QA port: `3001`

## Goal

Execute Sprint R6 from `REPUBLIK_ARGUMEN_UI_UX_RECOVERY_AND_CONTINUATION_BLUEPRINT.md`:

- move OpenRouter setup out of browser UI;
- keep AI opponent and AI judge configured from the server;
- reject browser-supplied AI config;
- add safe health and OpenRouter check endpoints;
- add timeout/retry/error mapping plus latency and cost logs.

## Implemented

- Added server-only OpenRouter adapter in `src/lib/openrouter/server.ts`.
- Added role-based server config for opponent and judge with shared-key fallback.
- Removed user-facing API key and model preferences from types, storage, settings, and debate requests.
- Sanitized legacy localStorage preferences so old key/model fields are removed when loaded or saved.
- Rebuilt `/api/debate/opponent` and `/api/debate/judge` to use only server-side OpenRouter config.
- Kept opponent and judge roles separate through role-specific config lookup.
- Added `/api/health` with boolean readiness only; no secret or model names are returned.
- Replaced `/api/ai/openrouter-check` so it ignores browser body and checks server-configured roles only.
- Hardened validation schemas with `.strict()` so injected `aiConfig` is rejected.
- Updated OpenRouter, voice STT, and voice TTS error messages to avoid asking users to inspect keys/models.
- Added request metrics for role, attempt, latency, token usage, estimated cost, success, and error name.

## Acceptance Check

| Criteria | Status | Evidence |
|---|---:|---|
| Key tidak ada pada browser bundle | Pass | `.next/static` scan found no legacy key fields, env names, or sample secrets. |
| Key tidak ada di localStorage | Pass | Storage sanitizer tests remove legacy API/model fields and persist only user-facing voice preferences. |
| Key tidak tampil di network response | Pass | `/api/health` and invalid opponent request responses contain no secret/model/env strings. |
| Opponent dan judge terpisah | Pass | Server adapter resolves role-specific config for `opponent` and `judge`; tests cover role config. |
| Error aman | Pass | API error mapping uses safe server-oriented messages. |
| Smoke test lolos | Pass | Production server on `3001`, `/api/health` 200, `/settings` 200, injected `aiConfig` rejected 400. |

## Screenshots

- Settings security smoke: `docs/recovery/screenshots/R6_settings_security.png`

## Validation

Passed:

- `npm run typecheck`
- `npm run lint`
- `npm run test` - 22 files, 68 tests
- `npm run build` - 21 static pages generated
- `git diff --check`
- Bundle scan: no `openRouterApiKey`, `geminiApiKey`, `OPENROUTER_API_KEY`, `OPENROUTER_SHARED_API_KEY`, `GEMINI_API_KEY`, or sample secret strings in `.next/static`
- Source scan: no legacy browser key fields in non-test `src`
- `curl http://localhost:3001/api/health` - HTTP 200 with boolean readiness only
- `curl http://localhost:3001/settings` - HTTP 200
- Browser-supplied `aiConfig` to `/api/debate/opponent` - HTTP 400 safe validation error

## Notes

- `/dev/ai-config` remains dev-only; production returns 404 for that route.
- The local production server is running on fixed port `3001`.
- R7 should continue from the recovery blueprint after this server-side AI security baseline.
