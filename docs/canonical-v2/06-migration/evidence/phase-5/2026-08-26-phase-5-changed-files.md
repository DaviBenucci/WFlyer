# Phase-5 Changed-File Inventory

Date: 2026-08-26

The Phase-5 checkpoint contains 55 files: 30 implementation, test, planning,
and status paths plus 25 sealed evidence paths.

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

## Runtime and bootstrap integration — 15

- `scripts/smoke-standalone.mjs`
- `src/app/%5F_visual-lab/story/motion/page.tsx`
- `src/components/story-bootstrap/StoryBootstrapExperience.test.tsx`
- `src/components/story-bootstrap/StoryBootstrapExperience.tsx`
- `src/components/story-motion/MotionStoryLab.test.tsx`
- `src/components/story-motion/MotionStoryLab.tsx`
- `src/components/story-motion/index.ts`
- `src/components/story-motion/motion-story-lab.module.css`
- `src/lib/story/bootstrap/positioning.ts`
- `src/lib/story/motion/eligibility.ts`
- `src/lib/story/motion/geometry.ts`
- `src/lib/story/motion/index.ts`
- `src/lib/story/motion/lab.ts`
- `src/lib/story/motion/positioning.ts`
- `src/lib/story/motion/runtime.ts`

The checkpoint total uses nine status, 15 runtime/bootstrap, six focused test,
and 25 evidence paths.

## Focused browser and unit tests — 6

- `tests/a11y/phase05-master-story.a11y.spec.ts`
- `tests/e2e/phase05-master-story.spec.ts`
- `tests/motion/phase05-master-story.motion.spec.ts`
- `tests/unit/story/motion-eligibility.test.ts`
- `tests/unit/story/motion-geometry.test.ts`
- `tests/unit/story/motion-positioning.test.ts`

## Sealed evidence — 25

The complete `docs/canonical-v2/06-migration/evidence/phase-5/` directory is
owned by this checkpoint: five PNG captures, 18 Markdown/JSON evidence records,
`SHA256SUMS.txt`, and its detached `.sha256` digest.

## Explicit exclusions

The two modified `graphify-out` files, Phase-0 evidence, `repo-overlay`, and six
root import artifacts are not checkpoint dependencies and are not included.
