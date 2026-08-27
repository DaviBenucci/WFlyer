# Phase 6 Changed-File Inventory

Date: 2026-08-27

The checkpoint contains 52 files: 27 implementation, test, planning, and status
paths plus 25 sealed evidence paths.

## Canonical status and planning — 9

- `PRE-CODE-STATUS.md`
- `WFLYER_CANONICAL_DOCUMENTATION_MANIFEST.md`
- `WFLYER_CODEX_START_HERE.md`
- `WFLYER_IMPLEMENTATION_PLAN.md`
- `docs/canonical-v2/README.md`
- `docs/canonical-v2/00-governance/02-scope-status-and-terminology.md`
- `docs/canonical-v2/06-migration/02-file-by-file-migration-map.md`
- `docs/canonical-v2/manifests/implementation-phases.v2.yaml`
- `openspec/changes/rebuild-scroll-driven-wflyer-v2/tasks.md`

## Runtime and component integration — 11

- `src/components/experience/RouteAwareExperienceBoundary.tsx`
- `src/components/story-motion/MotionStoryLab.tsx`
- `src/components/story/StoryNavigationContext.tsx`
- `src/components/story/StoryV2Header.tsx`
- `src/components/story/index.ts`
- `src/components/story/story.module.css`
- `src/lib/story/index.ts`
- `src/lib/story/manifest.ts`
- `src/lib/story/motion/index.ts`
- `src/lib/story/motion/runtime.ts`
- `src/lib/story/motion/traversal.ts`

## Focused tests — 7

- `src/components/story/StoryV2Header.test.tsx`
- `tests/a11y/phase06-story-header.a11y.spec.ts`
- `tests/e2e/phase05-master-story.spec.ts`
- `tests/e2e/phase06-story-header.spec.ts`
- `tests/unit/story/header-traversal.test.ts`
- `tests/unit/story/manifest.test.ts`
- `tests/unit/story/motion-positioning.test.ts`

The Phase-5 regression assertion now waits for completed traversal before
expecting Phase-6 successful-navigation history. It is stronger than the old
closest-chapter-only assertion and retains Phase-4 Back/Forward coverage.

## Sealed evidence — 25

The entire `docs/canonical-v2/06-migration/evidence/phase-6/` directory is
checkpoint-owned: five reviewed PNG captures, 18 Markdown/JSON records,
`SHA256SUMS.txt`, and `SHA256SUMS.txt.sha256`.

## Explicit exclusions

The two modified `graphify-out` files, Phase-0 evidence, `repo-overlay`, and
six root/import artifacts are unrelated and are not staged, reset, cleaned, or
included.
