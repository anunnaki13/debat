# Changelog

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
