## Why

Phase 9 is formally closed at an accepted technical score-geometry baseline,
but the approved final Assembly/Motion experience requires five bounded layout
refinements and an explicit geometry refreeze before any scroll-driven motion
is layered onto it. This isolated successor change establishes that gate and
then implements the canonical Assembly, score presentation, responsive
navigation, lifecycle, and homologation contracts without reopening unrelated
Phase-9 geometry or changing Composer semantics.

## What Changes

- Pin the predecessor as Phase 9 `CLOSED`, with
  `PHASE_9_FINAL_GIT_SHA = 306ccb74da6c7bbf8f187e360c0776c571b5fc3d`,
  repository bootstrap HEAD
  `a20d52ac9f214d385ea7c210b2ab45aa84095fc8`, and canonical authority
  `docs/canonical-v2/05-architecture/WFlyer_Post_Phase9_ASM_Motion_Canonical_Spec.md`.
- Register `ASM-LAYOUT-DELTA-001..005` as the only authorized pre-motion
  refinements inherited from Phase-9 review, under `ASM-IMP-DEC-006`.
- Make `ASM-IMP-DEC-007` a hard dependency: implement and automatically
  validate the five deltas, stop for explicit human geometry approval, and
  seal/refreeze successor geometry before Stage 3 or any Assembly/draw/reveal/
  choreography/GSAP integration.
- After geometry refreeze, add Projection metadata, deterministic pure Assembly,
  staff-draw, event-reveal, scenic-handoff, traversal, responsive, and
  reduced-motion models; bind them to the existing GSAP master story timeline
  only at the canonical presentation stage.
- Implement the approved Home Scenic Assembly, bounded Services/How structural
  Assembly, Professional-first mobile serpentine, compact mobile header,
  accessible mobile navigation sheet, normal scrub, and staff-only Fast
  Traversal in the canonical Stage 0–18 order.
- Add scoped lifecycle, fail-open recovery, accessibility, performance counters,
  deterministic cross-browser evidence, a geometry human gate, and final human
  homologation.
- Preserve the canonical decision families by reference:
  `ASM-DEC-001..048`, `MOB-HDR-DEC-001..016`, `MOT-DEC-001..035`,
  `ASM-AC-001..025`, `ASM-IMP-DEC-001..007`,
  `ASM-LAYOUT-DELTA-001..005`, and `SCORE-LAYOUT-DEC-*`. The canonical authority
  controls whenever an OpenSpec summary is incomplete.

### Scope

This change covers only the staged successor architecture and behavior defined
by the canonical authority: bounded geometry stabilization/refreeze,
Projection metadata, pure motion models, GSAP presentation, Home and structural
Assembly, responsive score motion, mobile header/navigation, normal/fast/
reduced presentation policies, lifecycle/performance/accessibility hardening,
successor-only evidence, and the required human gates.

### Non-goals

- No Stage-1 or runtime implementation is part of this Stage-0 bootstrap.
- No geometry outside `ASM-LAYOUT-DELTA-001..005` may be reopened silently.
- No Composer change, presentation-only invented note, fingerprint mutation,
  approved glyph redesign, Projects Assembly, vertical mobile notation,
  second animation engine, Anime.js, smooth-scroll system, or scroll-jacking.
- No event may appear in `TRUE_CONNECTOR`, `EVENT_FREE_CURVED`, or
  `ASSEMBLY_TRANSITION`.
- No per-frame DOM measurement, Projection rebuild, Composer call, React
  frame-clock state, or per-frame telemetry.
- No weakening of Contact/launch-interest security, mutation of sealed Phase-9
  evidence, public cutover, commit, push, deployment, or production change.

## Capabilities

### New Capabilities

- `score-assembly-motion`: Deterministic Assembly, staff draw/erase,
  Composer-event reveal eligibility, scenic-to-canonical handoff, GSAP binding,
  Home/structural scene presentation, lifecycle diagnostics, successor evidence,
  and the geometry/final human gates.
- `continuous-dual-score`: Path-preserving continuation of the predecessor-added
  capability, which is not yet present under main `openspec/specs/`; register
  and stabilize only the five approved successor layout deltas, refreeze their
  evidence, and expose bounded Projection-owned zone/anchor/draw metadata
  without taking motion ownership.
- `responsive-story-mode`: Path-preserving continuation of the
  predecessor-added capability, which is not yet present under main
  `openspec/specs/`; preserve the same semantic composition and state through
  Professional-first mobile serpentine motion, responsive adaptation, and
  reduced-motion settlement without replay.

### Modified Capabilities

- `music-renderer`: Strengthen event placement from broad `NOTATION_SAFE` to
  whole-footprint `EVENT_SAFE_STRAIGHT`, with curved/turning/Assembly regions
  explicitly event-free.
- `brand-opening-motion`: Add the approved dual-progress Home Scenic Assembly
  and geometry-matched canonical handoff while preserving readiness, deep-link
  settlement, back-scroll, and fail-open behavior.
- `accessible-navigation-lifecycle`: Replace the narrow header presentation
  with the compact semantic mobile header and accessible navigation sheet,
  including scoped focus/scroll-lock/teardown ownership.
- `score-transition-navigation`: Add deterministic normal scrub, staff-only
  Fast Traversal, arrival/cancellation/target-replacement recovery, and settled
  restoration over the existing native-scroll/history controller.

## Impact

### Verified facts and bootstrap provenance

- Phase 9, parent Task 35, and Gate 9 are complete; the frozen technical SHA is
  `306ccb74da6c7bbf8f187e360c0776c571b5fc3d`.
- Repository HEAD at successor bootstrap is
  `a20d52ac9f214d385ea7c210b2ab45aa84095fc8`; this newer documentation commit
  does not replace the frozen Phase-9 implementation/evidence SHA.
- Corrective Phase-9 evidence remains sealed at digest
  `807a15b57e1a5bbc88011d546e69d4a4b281c552344876cddfc3a17042392923`.
- Live file owners have been reconciled in `stage-0-review.md`: score
  `composition.ts` owns the two module/session compositions; `projection.ts`
  owns geometry with imported `organic-flowing.ts` allocation helpers;
  `src/components/story-score/measurement.ts` normalizes measurements collected
  by `StoryScoreLayer`; the existing story motion runtime owns native scroll
  and traversal. The canonical candidate `src/lib/story/score/measurement.ts`
  does not exist. Stage 1 rechecks this map before its authorized edits.

### Architectural impact after later authorization

- Composer continues to decide **what** semantic music exists.
- Projection decides **where** physical geometry, score zones,
  `EVENT_SAFE_STRAIGHT` regions, and canonical entry anchors exist.
- Motion Model decides **when** precomputed presentation state is active.
- GSAP decides **how** that state interpolates on the existing master timeline.
- UI/`StoryScoreLayer` performs bounded rendering/orchestration.

Likely affected later areas include score Projection/measurement, new pure
story-motion models, `StoryScoreLayer`, Home and branch story presentation,
responsive header/navigation components, focused unit/property/browser/a11y
tests, Visual Lab diagnostics, and new successor-only evidence. No runtime,
test, script, or evidence payload is changed by Stage 0.

### Pending work and human decisions

- Stage 1 ends at a mandatory Human Geometry Gate covering Application terminal,
  Benefits↔Demo, Demo↔Launch, representative Professional shelves, Home
  entry geometry, and responsive modes.
- If adequate Professional density requires Composer semantic changes, work
  stops for an explicitly separate Composer-version decision.
- Stage 18 ends at final explicit human homologation; automated PASS alone is
  insufficient, and deployment remains separately unauthorized.

### Affected normative/operational documents

- `docs/canonical-v2/05-architecture/WFlyer_Post_Phase9_ASM_Motion_Canonical_Spec.md`
- `WFLYER_IMPLEMENTATION_PLAN.md`
- `docs/canonical-v2/06-migration/CURRENT_HANDOFF.md`
- current canonical status/index/bootstrap documents that otherwise claim the
  successor OpenSpec does not exist
- the parent OpenSpec hold note, without reopening completed Phase 9

### Rollback

Stage 0 is documentation-only. Rollback removes this isolated change directory
and restores the small current-status edits; it never alters the frozen
Phase-9 baseline, runtime,
tests, scripts, Composer output, or sealed Phase-9 evidence. Later stage rollback
must remain file-scoped and use separate successor evidence rather than rewriting
the accepted predecessor baseline.
