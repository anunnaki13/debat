# R5 Sprint Report - Topic And Custom Topic Flow

Date: 2026-06-10  
Branch: `recovery/voice-first-mvp`  
Fixed QA port: `3001`

## Goal

Execute Sprint R5 from `REPUBLIK_ARGUMEN_UI_UX_RECOVERY_AND_CONTINUATION_BLUEPRINT.md`:

- strengthen topic categories, grid, search, filters, custom topic, spice meter, refiner screen, validation, and safe copy;
- keep the topic flow broad and safe for the MVP;
- make custom-topic creation comfortable on mobile.

## Implemented

- Added `src/lib/topics/topicSafety.ts` for testable custom-topic safety helpers.
- Moved thesis normalization, local refiner text, spice difficulty mapping, sensitive detection, and safe fallback generation into that helper.
- Replaced naive sensitive-term matching with word-boundary matching to avoid false positives like `moderasi` matching `ras`.
- Added safe fallback card in the custom-topic form when a sensitive topic is detected.
- Updated custom-topic actions to be full-width on mobile and clearer: `Rapikan Topik` and `Gunakan Langsung`.
- Made `/topics/refine` start in refiner-first mode without showing an empty comparison.
- Added tests for:
  - custom topic creation;
  - sensitive topic fallback;
  - refiner route saving a refined topic;
  - topic search and difficulty filters;
  - broad non-politics-only built-in topic pool;
  - safety helper behavior.

## Acceptance Check

| Criteria | Status | Evidence |
|---|---:|---|
| Topik luas, tidak politik-only | Pass | 20+ topics, 8+ categories, data test rejects politics-only terms. |
| Custom topic dapat dibuat | Pass | Route test creates a private topic and stores it in flow draft. |
| Topic refiner bekerja | Pass | `/topics/refine` test refines and stores a custom topic. |
| Sensitive topic fallback tersedia | Pass | Sensitive topic test shows fallback and stores a safe alternative. |
| Mobile form nyaman | Pass | 360px custom-topic screenshot captured; actions are full-width on mobile. |

## Screenshots

- Desktop topic grid: `docs/recovery/screenshots/R5_topics_desktop.png`
- Mobile custom topic form: `docs/recovery/screenshots/R5_custom_topic_mobile_360.png`

## Validation

Passed:

- `npm run typecheck`
- `npm run lint`
- `npm run test` - 20 files, 62 tests
- `npm run build` - 20 app routes generated
- `git diff --check`
- `curl -I http://localhost:3001/topics` - HTTP 200
- `curl -I http://localhost:3001/topics/new` - HTTP 200
- `curl -I http://localhost:3001/topics/refine` - HTTP 200

## Notes

- The refiner remains local/deterministic for MVP recovery; no API dependency is added.
- Production server is running on fixed port `3001`.
- R6 should focus on OpenRouter security: server-side adapter, no user-facing key/model UI, endpoint validation, and safe error mapping.
