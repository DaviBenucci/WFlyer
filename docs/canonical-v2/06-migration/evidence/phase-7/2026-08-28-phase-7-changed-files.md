# Phase 7 Changed-File Inventory

Closeout date: 2026-08-28

The intended checkpoint contains 58 files: 32 implementation, test, script,
planning, and status paths plus 26 sealed evidence paths.

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

## Runtime and component integration — 16

- `src/components/pages/contact/ContactForm.tsx`
- `src/components/pages/contact/contact-form.module.css`
- `src/components/persona/PersonaIntegrationSlot.tsx`
- `src/components/persona/index.ts`
- `src/components/persona/persona-integration-slot.module.css`
- `src/components/projects/ProjectCard.tsx`
- `src/components/projects/ProjectCardFan.tsx`
- `src/components/projects/index.ts`
- `src/components/projects/project-cards.module.css`
- `src/components/story/ProfessionalChapterScene.tsx`
- `src/components/story/StoryGlobalFooter.tsx`
- `src/components/story/index.ts`
- `src/components/story/professional-chapter-scene.module.css`
- `src/components/story/story-footer-data.ts`
- `src/components/story-motion/MotionStoryLab.tsx`
- `src/components/story-motion/motion-story-lab.module.css`

## Focused tests — 6

- `src/components/pages/contact/ContactForm.test.tsx`
- `src/components/persona/PersonaIntegrationSlot.test.tsx`
- `src/components/projects/ProjectCardFan.test.tsx`
- `src/components/story/ProfessionalChapterScene.test.tsx`
- `src/components/story-motion/MotionStoryLab.test.tsx`
- `tests/e2e/phase07-professional-scenes.spec.ts`

## Evidence capture script — 1

- `scripts/capture-phase7-evidence.mjs`

## Sealed evidence — 26

The entire `docs/canonical-v2/06-migration/evidence/phase-7/` directory is
checkpoint-owned: seven reviewed PNGs, 17 Markdown/JSON payload records,
`SHA256SUMS.txt`, and `SHA256SUMS.txt.sha256`.

## Explicit exclusions

The two modified `graphify-out` files, Phase-0 evidence, `repo-overlay`, and six
root/import artifacts are unrelated and are not staged, reset, cleaned, or
included.
