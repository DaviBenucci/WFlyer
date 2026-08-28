# Phase 8 Changed-File Inventory

Closeout date: 2026-08-28

The intended checkpoint contains 61 files: 32 implementation, test, script,
planning, and status paths plus 29 sealed evidence paths.

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

## Runtime, scene, content, and route integration — 15

- `src/app/%5F_visual-lab/story/motion/page.tsx`
- `src/app/aplicacao-wflyer/page.tsx`
- `src/components/pages/application-demo/ApplicationDemoDevice.tsx`
- `src/components/pages/application-demo/application-demo-device.module.css`
- `src/components/pages/application-demo/application-demo-state.ts`
- `src/components/pages/application-demo/index.ts`
- `src/components/pages/index.ts`
- `src/components/story/ApplicationChapterScene.tsx`
- `src/components/story/application-chapter-scene.module.css`
- `src/components/story/index.ts`
- `src/components/story-motion/MotionStoryLab.tsx`
- `src/components/story-motion/index.ts`
- `src/components/story-motion/motion-story-lab.module.css`
- `src/content/public/domain.ts`
- `src/lib/story/motion/runtime.ts`

## Focused tests and test configuration — 7

- `src/components/pages/application-demo/ApplicationDemoDevice.test.tsx`
- `src/components/pages/application-demo/application-demo-state.test.ts`
- `src/components/story/ApplicationChapterScene.test.tsx`
- `src/components/story-motion/MotionStoryLab.test.tsx`
- `tests/e2e/phase08-v2-application-scenes.spec.ts`
- `tests/unit/public-content.test.ts`
- `vitest.config.ts`

## Evidence capture script — 1

- `scripts/capture-phase8-evidence.mjs`

## Sealed evidence — 29

The entire `docs/canonical-v2/06-migration/evidence/phase-8/` directory is
checkpoint-owned: eight reviewed PNGs, 19 Markdown/JSON payload records,
`SHA256SUMS.txt`, and `SHA256SUMS.txt.sha256`.

## Explicit exclusions

The two modified `graphify-out` files, Phase-0 evidence, `repo-overlay`, the
Gate-B archive, and five root/import artifacts are unrelated and are not
staged, reset, cleaned, or included. Public `/`, Music/ScorePath sources,
public media assets, task 33, and all Phase-9 implementation remain unchanged.
