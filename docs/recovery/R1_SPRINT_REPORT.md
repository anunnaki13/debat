# R1 Sprint Report - Remove Misleading MVP Clutter

Date: 2026-06-10  
Branch: `recovery/voice-first-mvp`  
Fixed QA port: `3001`

## Goal

Execute Sprint R1 from `REPUBLIK_ARGUMEN_UI_UX_RECOVERY_AND_CONTINUATION_BLUEPRINT.md`:

- Remove or hide MVP clutter that makes the app feel like a fake politics dashboard.
- Restore product branding to `Republik Argumen`.
- Keep the lobby playable: user can choose a topic, side, input mode, and start debate.
- Move AI provider/model/key configuration out of the user-facing lobby.

## Implemented

1. Simplified user-facing lobby
   - Removed the user-facing OpenRouter API key input, model selectors, and lobby connection test.
   - Start button now creates a debate session without requiring a browser-stored key.
   - Added a concise `Aturan AI` panel explaining that the opponent AI takes the opposite side and the AI judge evaluates the debate.

2. Reduced misleading feature clutter
   - Removed `Premium Club`, fake streak, fake ranking, gift/notification placeholders, fake audience metrics, and fake waiting counts from the lobby.
   - Removed `ArenaProgressShowcase` from the lobby so `Karir Politik`, `Profil Ideologi`, and share-result demo cards no longer appear.
   - Trimmed mode cards to MVP-safe options and hid Hot Seat behind `featureFlags.enableHotSeatAi`.

3. Branding cleanup
   - Reworked the hero around `Republik Argumen`.
   - Replaced result share card brand text from `Arena Politika` to `Republik Argumen`.
   - Sidebar remains max 5 menu items: `Beranda`, `Main`, `Topik`, `Riwayat`, `Pengaturan`.
   - Mobile nav now matches the recovery blueprint shape: `Beranda`, `Main`, `Buat`, `Topik`, `Riwayat`.

4. Dev-only AI config
   - Added `/dev/ai-config` with OpenRouter key/model/save/test controls for development.
   - Route returns `404` under production build, matching existing dev route behavior.
   - Production client code ignores local browser AI config and falls back to server-side AI config.

5. Feature flags
   - Added `src/lib/features/flags.ts`.
   - Hid spectator/audience panel behind `featureFlags.enableSpectator`.
   - Hid Hot Seat mode until the real flow is implemented.

## Acceptance Check

| Criteria | Status | Evidence |
|---|---:|---|
| Lobby no longer reads as politics dashboard | Pass | Hero and sidebar use `Republik Argumen`; politics career/ideology panels removed from `/`. |
| Sidebar max 5 menu items | Pass | Desktop sidebar has exactly 5 main nav entries. |
| Fake metrics do not display | Pass | HTML forbidden-pattern scan returned empty for fake live/feed/premium/API-key strings. |
| Branding consistent | Pass | User-facing hero/result/sidebar use `Republik Argumen`. |
| Build passes | Pass | `npm run build` passed. |
| Fixed port respected | Pass | QA server restarted on `3001`; no alternate QA port used. |

## Screenshots

- Desktop: `docs/recovery/screenshots/R1_lobby_desktop.png`
- Mobile: `docs/recovery/screenshots/R1_lobby_mobile.png`

## Validation

Passed:

- `npm run test -- src/app/page.test.tsx` - 4 tests
- `npm run typecheck`
- `npm run lint`
- `npm run test` - 17 files, 45 tests
- `npm run build` - 14 app routes generated
- `git diff --check`
- `curl -I http://127.0.0.1:3001` - HTTP 200
- `curl -I http://127.0.0.1:3001/dev/ai-config` - HTTP 404 in production server

Forbidden-pattern scan against home HTML returned no matches for:

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

## Remaining Notes

- `ArenaProgressShowcase` is no longer rendered but remains in source for possible archive/refactor in a later sprint.
- Hot Seat is hidden until it has a distinct game flow.
- `/dev/ai-config` is available in development only; production must use server-side environment variables for OpenRouter.
