# Stage-1 self-intersection scope conflict — 2026-09-08

**STOP: CLASS C findings conflict with the global zero-intersection gate.**
No geometry repair, final browser matrix, or human-review capture was performed
in this recovery. The stronger validator remains enabled and failing.

## Result and exact acceptance conflict

The stronger validator detects **18 visible staff-line occurrences** across its
four existing default-mode fixtures: **A=0, B=0, C=18, D=0**. They represent
**14 distinct geometric crossings**, with four repeated by static mode's
vertical-wide geometry. All 18 reproduce in both Stage 0 and frozen Phase 9.
There are **0 detected center-path intersections** at the retained 2,049 samples;
this is a sampled result, not a proof over every cubic parameter. Repairs: **0**.

The live acceptance requirement is global, not restricted to changed zones:

- Canonical specification §27, Stage 1, lines 2153–2164 requires
  “zero self-intersections” and “staff-line self-intersections zero”.
- `specs/continuous-dual-score/spec.md`, requirement “Geometry evidence is
  human-approved and refrozen separately”, requires Stage 1 to verify
  “zero path and staff intersections”, without a changed-zone exception.
- Task **2.7** requires “zero center and staff-line self-intersections”.
- Canonical §33 item 3 requires STOP if geometry outside the five registered
  deltas needs modification; its final clause prohibits silently weakening
  acceptance. The current owner's continuation request independently requires
  STOP when a CLASS C/D occurrence conflicts with the global gate.

These requirements cannot all be satisfied under the existing bounded repair
scope. Task 2.7 and Gate 1 cannot pass while these crossings remain. A failed
stronger check cannot be overridden by the older Projection diagnostic's zero.

**Minimum decision to resume:** explicitly authorize a bounded successor
correction exception for the listed pre-existing Home/branch-entry and
How/Benefits connector defects, with owner/architecture mapping to named
corrective scope, before any geometric repair. Preserve the global zero gate,
Composer semantics, approved glyphs/calibration, historical Phase-9 evidence,
and the Stage-2+ prohibition. This report grants no such exception and does not
reopen all Phase-9 geometry. Human Geometry Approval remains a later gate.

## Reproduction and provenance

- Active HEAD and primary baseline: `40e6ae1a8996c53ed2ec372c47f16bc073d6cee9`.
- Frozen Phase-9 baseline: `306ccb74da6c7bbf8f187e360c0776c571b5fc3d`.
- Closure record: `a20d52ac9f214d385ea7c210b2ab45aa84095fc8`.
- All 18 recovered modified/untracked paths were inspected before recording
  new artifacts. Their hashes and original status are in the JSON diagnostic.
  No recovered source, test, allocator, capture script, task checkbox, or
  authorization content was changed by this recovery.
- Predecessors were extracted through `git archive` into isolated temporary
  directories. No checkout/reset, active worktree replacement, commit, push,
  deployment, or broad cleanup occurred.
- Stage-0 and Phase-9 `src` Git trees are identical. Each checkpoint was also
  executed independently using the same standalone diagnostic harness.
- Current reproduction command:
  `pnpm exec vitest run --project=unit tests/unit/story/story-score-successor-geometry.test.ts`.
  Result: **9 passed / 4 failed / 13 total**. All four default-mode complete
  segment assertions fail. This is diagnostic verification, not final validation.
- The JSON embeds both executed diagnostic scripts and their snapshot/replay
  instructions. Temporary scripts, baseline snapshots, exact test log and initial
  worktree backup remain at
  `/tmp/wflyer-stage1-intersection-comparison-20260908/`; the original test log
  is `/tmp/wflyer-stage1-recovery-vitest.log`.

## Counting and visibility

All cases use the exact interrupted test inputs: default viewport **1440×900**,
no browser engine and no measured scene rectangles. `vertical-compact` is an
explicit projection-mode fixture, not a claim of a 1440px mobile browser.
Resolved branch geometry is horizontal **19843.2×900**, vertical-wide/static
**1280×15570**, and vertical-compact **414×16312**.

The diagnostic checks all 1,024 rendered edges of each of five staff lines in
both branches, including pairs separated by one intervening edge. It retains
the exact strict orientation products `< -1e-7` and bounding-box rejection.
Every reported edge maps to an actual output primitive with opacity **1**;
no hidden/split-primitive exemption applies. The full primitive and segment IDs,
four edge endpoints, intersection coordinates, normalized coordinates, spline
indices, zone intervals, and baseline reproduction are recorded per occurrence.

The older runtime metric downsamples staff points by four and starts candidate
pairs at an offset of four (`projection.ts`, `polylineSelfIntersections` and
`projectionEvidence`). It reports zero in all three states. That explains the
historical missed findings; it does not make the visible crossings acceptable.

## Per-occurrence classification

Every row is **individual staff-line only**, reproduces in **current / Stage 0 /
Phase 9**, and has disposition **STOP, no repair under current authorization**.
`staff` is the existing line ID suffix (staff step 0/2/4/6/8), and edge numbers
are zero-based in that line's 1,025-point array. The full line ID is
`wf-phase-9-task-34:<resolved-mode>:<branch>:staff:<staff>`.
Static resolves to `vertical-wide`. Phase-9 coordinates/edge pairs equal Stage 0.

| ID | Mode | Branch | Chapter / transition destination | Staff | Current edges | Stage-0 edges | Current crossing (px) | Stage-0 / Phase-9 crossing (px) | Class |
|---|---|---|---|---:|---|---|---|---|---|
| ASM-SI-001 | horizontal-enhanced | application | application-benefits | 0 | 713 / 720 | 714 / 721 | (3838.551904, 647.586557) | (3838.551701, 647.586621) | C |
| ASM-SI-002 | horizontal-enhanced | application | application-how-it-works | 8 | 693 / 695 | 694 / 696 | (3787.446175, 690.444840) | (3787.446631, 690.444974) | C |
| ASM-SI-003 | horizontal-enhanced | application | application-benefits | 8 | 724 / 727 | 725 / 727 | (3860.979721, 690.607106) | (3861.072931, 690.578159) | C |
| ASM-SI-004 | vertical-wide | application | home | 0 | 189 / 194 | 189 / 194 | (61.582447, 247.747837) | (61.582447, 247.747837) | C |
| ASM-SI-005 | vertical-wide | application | home | 2 | 191 / 193 | 191 / 193 | (54.909897, 250.021741) | (54.909897, 250.021741) | C |
| ASM-SI-006 | vertical-wide | professional | professional-about | 6 | 214 / 218 | 214 / 218 | (89.723884, 814.258545) | (89.723884, 814.258545) | C |
| ASM-SI-007 | vertical-wide | professional | professional-about | 8 | 214 / 218 | 214 / 218 | (87.907237, 819.467633) | (87.907237, 819.467633) | C |
| ASM-SI-008 | vertical-compact | application | home | 0 | 156 / 158 | 156 / 158 | (134.785516, 83.781893) | (134.785516, 83.781893) | C |
| ASM-SI-009 | vertical-compact | application | home | 0 | 190 / 194 | 190 / 194 | (20.482334, 165.804399) | (20.482334, 165.804399) | C |
| ASM-SI-010 | vertical-compact | professional | professional-about | 0 | 177 / 180 | 177 / 180 | (279.039354, 83.826244) | (279.039354, 83.826244) | C |
| ASM-SI-011 | vertical-compact | professional | professional-about | 0 | 210 / 217 | 210 / 217 | (36.645474, 726.365032) | (36.645474, 726.365032) | C |
| ASM-SI-012 | vertical-compact | professional | professional-about | 2 | 211 / 214 | 211 / 214 | (29.058887, 727.800077) | (29.058887, 727.800077) | C |
| ASM-SI-013 | vertical-compact | professional | professional-about | 6 | 213 / 223 | 213 / 223 | (23.080224, 727.228615) | (23.080224, 727.228615) | C |
| ASM-SI-014 | vertical-compact | professional | professional-about | 8 | 212 / 226 | 212 / 226 | (20.550931, 731.210531) | (20.550931, 731.210531) | C |
| ASM-SI-015 | static | application | home | 0 | 189 / 194 | 189 / 194 | (61.582447, 247.747837) | (61.582447, 247.747837) | C |
| ASM-SI-016 | static | application | home | 2 | 191 / 193 | 191 / 193 | (54.909897, 250.021741) | (54.909897, 250.021741) | C |
| ASM-SI-017 | static | professional | professional-about | 6 | 214 / 218 | 214 / 218 | (89.723884, 814.258545) | (89.723884, 814.258545) | C |
| ASM-SI-018 | static | professional | professional-about | 8 | 214 / 218 | 214 / 218 | (87.907237, 819.467633) | (87.907237, 819.467633) | C |

## Ownership and material-change assessment

- **ASM-SI-001..003:** frozen Application How arrival / How→Benefits
  connectors. No owning Stage-1 defect delta. They are adjacent to DELTA-003,
  but this unmeasured fallback geometry is unchanged. The Stage-1 Home cut
  (DELTA-005) changes the total Application spline segment count from 327 to
  326, so uniform renderer samples move slightly along the unchanged curves.
  Baseline crossings differ by 0.000213, 0.000475 and 0.097601 px respectively.
  A separate comparison of current spline segments 217..234 against baseline
  segments 218..235 at 65 parameters per segment finds maximum position drift
  **5.47e-12 px** and tangent/normal drift **4.88e-14**. This proves the local
  geometry was not materially redesigned and the existing defect was not
  introduced by Stage 1. The sampling shift is recorded, not used as a tolerance
  exemption or a reason to ignore any crossing.
- **ASM-SI-004..018:** frozen vertical Application Home departure and
  Professional Home→About connector geometry. No owning Stage-1 defect delta.
  They are near Home/Professional entry review areas, but the entire staff point
  arrays and the 2,049-point center-path samples are byte-identical between the
  worktree and both predecessors. No vertical curve edit caused these defects;
  exposing Home metadata and changing event placement does not own a new
  connector redesign. Static 015..018 duplicate 004..007 at the same coordinates.

## Stop-state ledger

- OpenSpec remains **7/92** complete; Stage 1 remains **1/10**, with only **2.1**
  complete. No new task was marked complete. **2.2..2.10** remain unchecked.
- DELTA-001 terminal, DELTA-002 allocator, DELTA-003 separated corridor,
  DELTA-004 Professional allocation, and DELTA-005 static Home work were
  preserved. Their final acceptance remains unclaimed because of this stop.
- Event placement and all source→destination allocations are unchanged by this
  recovery. No notes were moved, duplicated, invented, or recomposed to fix a
  crossing. This diagnostic is not a new full event-safety gate.
- Composer fingerprints reproduce in all three states and four fixtures:
  Professional `fnv1a32:039bce10`, Application `fnv1a32:1fe3356b`.
- Final responsive gate and Chromium/Firefox/WebKit matrix: **NOT RUN**.
  Successor human-review captures and capture digest: **NOT CREATED**.
- Historical integrity: **64/64 payloads PASS**, four manifest digests match
  frozen Phase 9, closure and Stage 0; the tracked Phase-9 evidence subtree is
  byte-identical to those checkpoints. Full checks are in the JSON.
- No new motion, GSAP binding, Assembly model/runtime, or Scenic runtime was
  implemented. The existing `story-motion` diff remains static Home composition.
- **Stage 2+ remains unstarted and unauthorized.** Geometry approval/refreeze
  is pending. The required immediate human decision is the bounded correction
  scope above, not approval of the present intersecting candidate.

## Diagnostic artifact

[Machine-readable comparison](stage-1-self-intersection-diagnostics.json)
contains every occurrence and both predecessor reproductions, exact inputs,
visibility proof, local geometric comparison, hashes of the recovered files,
replay scripts, and historical checksum verification.

Diagnostic JSON SHA-256: `5e7eb0d1966ff6b1a6a3020e54125c788354c3437528f2ebf1db5205fb46580d`.
This is a diagnostic digest, not a Stage-1 visual evidence approval or Stage-2 seal.

## Recovery-only document changes and checks

This recovery changed only `stage-1-progress.md` and
`docs/canonical-v2/06-migration/CURRENT_HANDOFF.md`, and added this review and
`stage-1-self-intersection-diagnostics.json`. All 16 other recovered file
hashes are unchanged, including every source, test, capture script, task and
authorization file. No code was edited in this recovery; Graphify update and
implementation lint/typecheck were not rerun at this scope stop.

`openspec validate implement-scroll-driven-score-assembly-and-motion --strict`
passes. `git diff --check` passes. Diagnostic consistency checks verify all
18 IDs, baseline matches, visible edges, fingerprint records and JSON digest.

Exact final `git status --short`:

```text
 M docs/canonical-v2/06-migration/CURRENT_HANDOFF.md
 M openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-authorization.md
 M openspec/changes/implement-scroll-driven-score-assembly-and-motion/tasks.md
 M src/app/%5F_visual-lab/story/score-paths/ScorePathReview.test.tsx
 M src/components/story-motion/MotionStoryLab.test.tsx
 M src/components/story-motion/MotionStoryLab.tsx
 M src/components/story-motion/motion-story-lab.module.css
 M src/components/story-score/StoryScoreLayer.tsx
 M src/lib/story/score/organic-flowing.ts
 M src/lib/story/score/projection.ts
 M tests/e2e/phase09-score-path-review.spec.ts
 M tests/unit/story/story-score-projection.test.ts
?? openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-progress.md
?? openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-self-intersection-diagnostics.json
?? openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-self-intersection-review.md
?? scripts/capture-assembly-stage1-evidence.mjs
?? src/lib/story/score/event-safe-placement.ts
?? tests/e2e/assembly-stage1-geometry.spec.ts
?? tests/unit/story/story-score-event-safety.test.ts
?? tests/unit/story/story-score-successor-geometry.test.ts
```
