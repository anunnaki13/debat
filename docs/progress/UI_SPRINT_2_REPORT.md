# UI Sprint 2 Report

Date: 2026-06-09

## 1. Ringkasan Perubahan

UI Sprint 2 membangun topic flow sesuai `REPUBLIK_ARGUMEN_UI_UX_STYLE_BLUEPRINT.md` tanpa menambah backend atau API call baru.

Fokus yang selesai:

- topic picker dengan search;
- category chips;
- difficulty filter;
- spice meter;
- custom topic form;
- local refiner comparison;
- sensitive topic validation state;
- selected custom topic state;
- visual QA screenshots.

## 2. File Dibuat

- `src/components/topics/TopicExplorer.tsx`
- `src/components/topics/CustomTopicForm.tsx`
- `src/components/topics/RefinerComparisonCard.tsx`
- `src/components/topics/SpiceMeter.tsx`
- `docs/visual-qa/topic-flow-desktop.png`
- `docs/visual-qa/topic-flow-mobile.png`

## 3. File Diubah

- `src/app/page.tsx`
- `src/app/page.test.tsx`
- `src/components/layout/MobileBottomNav.tsx`
- `src/components/topics/TopicCard.tsx`
- `src/data/topics.ts`
- `src/lib/validation/apiSchemas.ts`
- `src/types/debate.ts`
- `README.md`
- `MILESTONES.md`
- `CHANGELOG.md`

## 4. Screenshot Visual QA

- `docs/visual-qa/topic-flow-desktop.png` — 1440 x 3154 full page
- `docs/visual-qa/topic-flow-mobile.png` — 360 x 7173 full page with custom topic form opened through `#custom-topic`

## 5. State Yang Diuji

- Topic search.
- Category chip selection.
- Difficulty filter.
- Spice filter.
- Topic card selected/unselected state.
- Custom topic form open/close.
- Custom topic direct-use flow.
- Local refiner comparison display.
- Sensitive topic warning copy.
- Short thesis validation.
- Custom topic stored in debate session.

## 6. Responsive Breakpoint Yang Diuji

- Desktop: 1440 x 1200 full-page screenshot.
- Mobile small: 360 x 900 full-page screenshot.
- HTTP smoke: `/` returned `200 OK` on the existing dev server at port `3001`.

## 7. Accessibility Check

- Search input has an `sr-only` label.
- Filter chips use `aria-pressed`.
- Topic cards use `aria-pressed`.
- Spice meter has an accessible label.
- Custom topic form fields use labels and helper text.
- Validation warning includes icon and text, not color only.
- Mobile bottom nav `Topik` action opens `#custom-topic`.

## 8. Performance Notes

- Filtering is local and memoized with `useMemo`.
- No OpenRouter or AI provider call is made by the topic refiner.
- Custom topic refinement is deterministic/local for MVP safety.
- No large media assets were added.

## 9. Known Issues

- Dedicated `/topics`, `/topics/new`, and `/topics/refine` routes are still not created; Sprint 2 is integrated into the lobby.
- Refiner comparison is local/deterministic and labelled as a preview, not a real AI call.
- Topic sensitivity validation is keyword-based and conservative for MVP.

## 10. Next Sprint Recommendation

Proceed to UI Sprint 3 only after user confirmation:

- device check permission explanation polish;
- device selector UI;
- speaker test styling;
- permission denied responsive states;
- stronger visual alignment for camera preview and mic meter.
