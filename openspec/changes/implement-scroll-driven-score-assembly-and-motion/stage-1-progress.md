# Stage 1 progress — portfolio-only rebaseline

> **SUPERSEDED OPERATIONAL PLAN — 2026-09-24:** ADR-057 / ASM-IMP-DEC-020
> replaces the viewport-contained target and pauses/supersedes HGA-002 margin
> remediation. All earlier instructions and status text below are historical.
> Use the [continuous-story implementation package](continuous-story-implementation-package.md)
> and current tasks (25/55); Human Geometry Approval remains pending against the
> unimplemented new target. HGA-001A–D evidence remains preserved.

## Retained pre-continuous-story checkpoint

## Current checkpoint

- Branch: `develop/site-institucional`
- HEAD: `40e6ae1a8996c53ed2ec372c47f16bc073d6cee9`
- Active change: `implement-scroll-driven-score-assembly-and-motion`
- Authority: ADR-053/055 / `ASM-IMP-DEC-017/018`
- OpenSpec progress before rebaseline: `7/92`
- Current task graph: `30/51`; automated Stage-1 portfolio geometry tasks 5.1
  through 5.5 are complete
- Human Geometry Approval: `PENDING / BLOCKING`
- First Human Geometry review: `CHANGES_REQUESTED` (`HGA-001`, `HGA-002`)
- HGA-001A: RESOLVED; implemented offset correction and passing regression retained
- HGA-001B: EXPECTED_CAPACITY_REJECTION / NOT_A_PRODUCT_DEFECT under preserved
  ADR-048/049/050; 1366 horizontal mode is not required
- HGA-001C: BLOCKED_OWNER_PROFILE; the 1366×768 desktop Motion Lab result
  remains valid, but 1366×611 Firefox and 1366×639 Chromium verification
  found stable Projects focus/header clipping; see the six owner-profile captures
- HGA-002: OPEN; separate measured non-Projects macro-spacing correction
- Architecture review: RESOLVED; owner-corrected Motion Lab scope implemented
  under `ASM-IMP-DEC-018`; public immersive integration remains later-stage

## Completed in the rebaseline

- recorded the portfolio-only canonical topology;
- classified Application-only, shared, Professional-only, historical, and
  unrelated references;
- preserved the dirty worktree and frozen Phase-9/audit evidence;
- recorded `ASM-AUDIT-001` as `SUPERSEDED_SCOPE` without completion;
- recorded `ASM-CR-001` outside active repair scope without repair or deferral;
- removed institutional Application pages, access/demo/form owners, branch
  scenes, navigation, content, CSS, runtime geometry, and app-only tests;
- reduced Home, manifests, composition, Projection, origin, responsive order,
  header/footer, transitions, and review surfaces to one portfolio narrative;
- retained the five deltas, all registered Batch-1/Batch-2 history and surviving
  repairs, ADR-046 determinism, Projects NON-ASSEMBLY/three visits, Composer
  fingerprint `fnv1a32:039bce10`, approved glyphs, 12px clearance, complete ink,
  and the global self-intersection validator;
- reconciled unit/component tests and translated frozen Professional
  measurements only inside an explicitly historical focused-test adapter.

## Audit supersession

`stage-1-inherited-audit-supersession.json` is the structured authority for the
old execution: 3,192 terminal observations, 500 pending, `auditComplete=false`,
`repairAuthorizedFromInventory=false`. Raw audit and frozen evidence remain in
place. Shared/Professional observations are supporting history, not a current
portfolio-only PASS.

## Rebaseline validation closure

- TypeScript, lint, production build, strict OpenSpec, changed YAML/JSON,
  frozen Phase-9 checksums, scoped diff hygiene, Storybook, and all focused
  portfolio browser/a11y/reduced-motion suites pass.
- The full unit run has 701 passing tests and three unrelated pre-existing
  release-workflow pin failures: the repository uses pnpm 11.26.0 and
  Playwright 1.63.0 while those assertions still require 11.24.0 and 1.62.1.
- The only full `git diff --check` finding is pre-existing trailing whitespace
  in unrelated `.env.example`; the scoped check excluding that file passes.
- Graphify was regenerated from the final code sources. The final semantic
  search found no active institutional Application constructor or route.

## Remaining successor work

Automated portfolio geometry work is complete through task 5.5. Do not revive
the superseded audit or removed branch. Task 5.6, Human Geometry Approval,
remains the mandatory stop. Its bounded 11-item owner-review package is ready
at `stage-1-human-geometry-approval-evidence.md`; readiness does not constitute
approval. The owner requested supported native-1366 desktop presentation and
desktop-density corrections before another review. ADR-055 selects existing
desktop-quality fallback, not forced horizontal qualification. See
`stage-1-hga-model-handoff.md`; do not redo HGA-001A or modify Projects.
HGA-001C is now implemented and validated on the owner-corrected Motion Lab
surface at 1366×768; see `stage-1-hga-001c-result.md` and its 11-capture
manifest. The later physical-owner layout profiles fail the bounded focus
verification; see `stage-1-hga-001c-owner-profile-verification.md`. HGA-002
and explicit Human Geometry Approval remain pending. No public immersive-story
integration or Geometry Refreeze has started.

## Automated portfolio geometry validation stop

The retained owner-authorized current-topology matrix checkpoint is recorded in
`stage-1-portfolio-geometry-validation-report.md`. It is `PASS`: all 63
observations completed across Chromium, Firefox and WebKit, with zero pending or
infrastructure-blocked observations and no product regression at that checkpoint. VP-001 through
VP-004 are resolved and nonblocking. Tasks 5.1 through 5.5 are complete.

This checkpoint alone did not validate HGA-001C. The later focused result
validated 1366×768, while the owner-height verification above fails.
Neither checkpoint automatically approves a selected fallback. The current
work stops at task 5.6 for the owner. Do not resume
the superseded audit or repeat the matrix as diagnosis. Do not begin Geometry
Refreeze, Stage 2+, Assembly, GSAP work, commit, push, deployment, or mark human
approval.
