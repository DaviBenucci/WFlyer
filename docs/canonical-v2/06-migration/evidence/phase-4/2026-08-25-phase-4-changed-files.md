# Phase-4 Changed-File Inventory

Date: 2026-08-25

This inventory attributes only Phase-4 work. The live working tree also contains
authorized, uncommitted Phase-0–3 and Music System work, which was preserved.
Shared cumulative files are identified explicitly.

## Bootstrap implementation

- `src/lib/story/bootstrap/destination.ts`
- `src/lib/story/bootstrap/history.ts`
- `src/lib/story/bootstrap/index.ts`
- `src/lib/story/bootstrap/positioning.ts`
- `src/lib/story/bootstrap/readiness.ts`
- `src/lib/story/bootstrap/session.ts`
- `src/lib/story/bootstrap/timing.ts`
- `src/components/story-bootstrap/StoryBootstrapExperience.tsx`
- `src/components/story-bootstrap/index.ts`
- `src/components/story-bootstrap/story-bootstrap.module.css`
- `src/app/%5F_visual-lab/story/bootstrap/page.tsx`

## Focused tests and tooling

- `src/components/story-bootstrap/StoryBootstrapExperience.test.tsx`
- `tests/unit/story/bootstrap-destination-history.test.ts`
- `tests/unit/story/bootstrap-positioning.test.ts`
- `tests/unit/story/bootstrap-readiness.test.ts`
- `tests/e2e/phase04-bootstrap.spec.ts`
- `tests/a11y/phase04-bootstrap.a11y.spec.ts`
- `scripts/capture-phase-4-bootstrap-evidence.mjs`

## Canonical contract normalization

- `docs/canonical-v2/02-experience/03-desktop-scroll-header-history.md`
- `docs/canonical-v2/02-experience/05-intro-bootstrap-deep-links-and-recovery.md`
- `docs/canonical-v2/05-architecture/01-target-frontend-architecture.md`
- `docs/canonical-v2/05-architecture/04-state-machines.md`
- `docs/canonical-v2/06-migration/05-target-file-and-module-map.md`
- `docs/canonical-v2/manifests/acceptance-contracts.v2.yaml`

## Shared or mixed files touched by Phase 4

These paths contain a truthful Phase-4 delta but their live whole-file blobs
also contain earlier accepted work. They are not safe whole-file members of a
Phase-4-only commit:

- `src/lib/story/index.ts` — Phase-2 manifest/type exports plus the Phase-4
  bootstrap export;
- `tests/e2e/static-routes.spec.ts` — Phase-3 route regression plus the
  Phase-4 retained-intro release;
- `scripts/smoke-standalone.mjs` — Phase-3 public-route smoke plus Phase-4
  development-route isolation;
- `docs/canonical-v2/02-experience/04-mobile-responsive-reduced-motion.md` —
  Music and Phase-4 normalization;
- `docs/canonical-v2/06-migration/02-file-by-file-migration-map.md` — Phase-3
  and Phase-4 migration state;
- `docs/canonical-v2/manifests/calibration-register.v2.yaml` — approved Music
  calibration plus Phase-4 timings.

## Status and closure records

These are cumulative cross-phase records; Phase 4 updated only its checkpoint,
gate, evidence, and next-permitted-phase fields.

- `PRE-CODE-STATUS.md`
- `WFLYER_CANONICAL_DOCUMENTATION_MANIFEST.md`
- `WFLYER_CODEX_START_HERE.md`
- `WFLYER_IMPLEMENTATION_PLAN.md`
- `docs/canonical-v2/README.md`
- `docs/canonical-v2/00-governance/02-scope-status-and-terminology.md`
- `docs/canonical-v2/manifests/implementation-phases.v2.yaml`
- `openspec/changes/rebuild-scroll-driven-wflyer-v2/tasks.md`

## Pre-existing dependencies required by the live Phase-4 surface

These remain owned by accepted Phase 2/3 work and are not attributed to Phase
4. They explain why a Phase-4-only commit cannot be reproduced atop the
current HEAD:

- Phase-2 story domain: `src/lib/story/manifest.ts` and
  `src/lib/story/types.ts`;
- Phase-2 story surface: `src/components/story/**` and
  `src/app/%5F_visual-lab/story/layout.tsx`;
- Phase-2 route-aware shell:
  `src/components/experience/RouteAwareExperienceBoundary.tsx` and its root
  layout wiring;
- Phase-3 typed content: `src/content/story-v2.ts` and
  `src/content/public/**`;
- Phase-3 detailed-route/configuration dependencies consumed by that content.

Music renderer/composer/score/Visual-Lab runtime is pre-existing unrelated
work: Phase-4 source has no runtime import edge to it.

## Gate evidence

All regular files under this `phase-4/` directory, including four review PNGs,
the contract and validation records, this inventory, and the final
`SHA256SUMS.txt`, are Phase-4 outputs. The checksum manifest is the
authoritative final enumeration.

## Explicitly untouched by Phase 4

- `src/app/page.tsx` and retained public-root behavior;
- Music renderer, composer, score components, and Music Visual Lab sources;
- Phase-2 and Phase-3 sealed evidence;
- approved Music Gate B/C geometry and sealed evidence;
- `tests/visual/**` visual goldens.

Generated `.next/**`, `next-env.d.ts` timestamp refreshes, Playwright output,
and ignored Graphify memory are validation artifacts, not shipped Phase-4
source changes.
