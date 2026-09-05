## Context

See `proposal.md` for motivation. Phase 9 is closed at immutable accepted
implementation/evidence baseline
`306ccb74da6c7bbf8f187e360c0776c571b5fc3d`; the repository HEAD used to
bootstrap this change is the later closure-record commit
`a20d52ac9f214d385ea7c210b2ab45aa84095fc8`. The former remains the Phase-9
baseline and the latter is provenance for this planning-only successor.

The technical authority is
`docs/canonical-v2/05-architecture/WFlyer_Post_Phase9_ASM_Motion_Canonical_Spec.md`.
Its `ASM-DEC-*`, `MOB-HDR-DEC-*`, `MOT-DEC-*`, `ASM-AC-*`,
`ASM-IMP-DEC-*`, `ASM-LAYOUT-DELTA-*`, state machines, stop rules, and staged
gates control whenever this summary is incomplete. Phase-9 evidence remains
historical and byte-immutable; successor geometry and final evidence use new
packages.

Stage 0 reconciles actual file owners in `stage-0-review.md`. Composer produces
semantic music; `src/lib/story/score/projection.ts` owns physical geometry and
imports allocation helpers from `organic-flowing.ts`. Actual measurement
normalization is `src/components/story-score/measurement.ts`; collection and
bounded rendering are in `StoryScoreLayer.tsx`. The conceptual canonical path
`src/lib/story/score/measurement.ts` does not exist. The existing story motion
runtime retains native-scroll/traversal ownership, and integrated Home geometry
lives in `MotionStoryLab.tsx`. Recheck these owners before Stage-1 editing.

## Goals / Non-Goals

**Goals:**

- Preserve Composer output and the accepted Phase-9 baseline while applying
  exactly `ASM-LAYOUT-DELTA-001..005` and no implicit geometry redesign.
- Make human approval and successor evidence refreeze a hard dependency before
  adding Projection metadata, pure motion models, or GSAP presentation.
- Keep geometry, temporal state, interpolation, and rendering in separate,
  testable owners, with deterministic forward/reverse behavior.
- Build the complete successor in Stages 0–18, ending at explicit final human
  homologation rather than treating automated PASS as visual approval.

**Non-Goals:**

- Stage 0 does not implement Stage 1, motion, Assembly, navigation, runtime,
  test, capture-script, or evidence-payload changes.
- This design does not authorize Composer semantic changes, layout changes
  outside the five deltas, Projects Assembly, final-asset invention, a second
  animation engine, vertical musical notation, scroll interception, security
  weakening, deployment, or mutation of any sealed predecessor evidence.
- This change does not replace native scroll, create a parallel mobile product,
  or move per-frame presentation state into React.

## Decisions

### 1. Canonical document remains the single detailed authority

OpenSpec records observable deltas, architecture, sequencing, and progress but
does not copy every canonical clause. Every implementation review traces back
to the canonical decision families and acceptance contracts listed in the
proposal.

This avoids two divergent normative documents. The alternative—rephrasing the
entire 2,800-line contract inside OpenSpec—was rejected because omissions or
future edits could silently create conflicting requirements.

### 2. Stage 1 has an exclusive geometry budget

Under `ASM-IMP-DEC-006`, Stage 1 may implement only:

1. remove the unnecessary Application terminal return/U-turn while retaining a
   locally left-to-right final event shelf and conventional barline;
2. classify and place Composer groups only on whole-footprint
   `EVENT_SAFE_STRAIGHT` shelves;
3. replace the compressed Benefits↔Demo routing with a broad event-free
   low-curvature corridor while preserving Demo↔Launch clearance;
4. improve Professional long-shelf utilization using existing semantic event
   groups only; and
5. prepare deterministic Home `CANONICAL_ENTRY_ANCHOR` geometry for the future
   Scenic handoff.

Delta 005 is deliberately split: Stage 1 establishes only the approved Home
entry geometry; final Home Scenic presentation is Stage 9 after refreeze. If
Professional density cannot be achieved without changing Composer semantics,
the stage stops for a separate Composer-version decision.

The alternative—opportunistically improving adjacent Phase-9 geometry—was
rejected because it would invalidate the bounded approval and evidence model.

### 3. The Human Geometry Gate and refreeze are hard dependencies

Stage 1 runs focused unit/geometry/responsive checks and deterministic captures
for Application terminal, Benefits↔Demo, Demo↔Launch, Professional shelves,
Home entry geometry, and representative responsive modes. Automated PASS does
not advance the change. Explicit human approval is required; only then may
Stage 2 create a successor-only manifest/digest and freeze geometry.

Stages 3–18 are dependency-blocked while that decision is absent. After
refreeze, a visual geometry change is allowed only for a proven defect with a
focused fix, regression, and refreshed affected successor evidence.

This implements `ASM-IMP-DEC-007`. A soft review checkpoint was rejected
because motion built over unsettled geometry would couple visual correction to
every later layer.

### 4. Ownership follows WHAT / WHERE / WHEN / HOW / bounded rendering

- Composer owns **what** ordered semantic music exists, including seed,
  fingerprints, groups, pitch, rhythm, keys, beams, tuplets, and ledger intent.
- Projection and bounded measurement own **where** paths, zones, physical
  anchors, entry geometry, draw metrics, clearances, and Assembly intervals
  exist.
- DOM-independent Motion Models own **when** precomputed Assembly, draw,
  reveal, traversal, responsive, and reduced-motion state is active.
- GSAP/ScrollTrigger own **how** those states interpolate on the existing
  native-scroll master timeline.
- UI and `StoryScoreLayer` own bounded rendering, semantic content, and scoped
  orchestration.

Projection may expose metadata but never GSAP or navigation state. Motion
models never compose notes or measure the DOM. GSAP callbacks never rebuild
Projection, call Composer, query layout, or drive a React frame clock.

A single mixed component was rejected because it would make reversibility,
cleanup, and the zero-per-frame invariants hard to prove.

### 5. Pure deterministic models precede presentation binding

Stages 4–7 build pure Assembly, unified staff-front, atomic event-reveal, and
scenic-handoff models. Each consumes semantic progress plus frozen metadata and
emits serializable presentation state. Forward and reverse evaluation at the
same semantic progress must agree within documented tolerances.

GSAP binding begins only in Stage 8, within scoped context and the existing
master timeline. This order makes model behavior testable without timing,
layout, or browser animation noise. Directly authoring scene timelines first
was rejected because it would make GSAP callbacks the de facto domain model.

### 6. Event eligibility is a whole-group geometric contract

Projection classifies deterministic `EVENT_SAFE_STRAIGHT`,
`EVENT_FREE_CURVED`, `TRUE_CONNECTOR`, and `ASSEMBLY_TRANSITION` intervals. An
entire Composer event group and its `1.5 × staffSpace` margins must fit a
locally left-to-right safe shelf whose tangent magnitude is at most 18 degrees
and variation at most 6 degrees, with no reversal. The margin is a human-review
calibration value, not a threshold to weaken to hide a collision.

The unified five-line staff front may traverse forbidden zones, but events are
atomic and absent there and during Fast Traversal. Center-point-only placement
was rejected because accidentals, beams, tuplets, and ledger lines can reach a
turn even when the notehead center does not.

### 7. Scene integration reuses shared models and bounded configuration

Stage 9 integrates Home incrementally: scenic clef/atmosphere, desktop
center-out header, latent edge scores, branch formation, exact handoff, and
branch docking. Stage 10 configures Structural Assembly for Professional
Services and Application How It Works plus only an explicitly approved complex
directional transition. Projects stays as three canonical event shelves with
event-free valleys.

Scene data should select shared model behavior; widespread scene-specific
imperative branches are rejected because they obscure event-free and reverse
invariants.

### 8. Responsive behavior changes geometry, not semantics

Stage 11 uses Professional-first mobile serpentine scores whose event shelves
read locally left-to-right and whose side connectors are event-free. Each
branch ends at its own final barline before one global footer. Responsive
rebuild preserves seed, composition, active chapter, logical progress, and
Assembly state. Vertical-wide and vertical-compact must reduce Scenic and
Structural geometric complexity without replaying Home or chapter Assembly.

Stage 16 applies reduced motion to the same model: it shortens or removes
decorative/cinematic interpolation while preserving all content, navigation,
score semantics, state, focus, forms, and final destinations. Separate mobile
or reduced-motion story architectures were rejected because they would drift
semantically.

### 9. Header and navigation share canonical semantic state

Stages 12–13 provide one compact mobile row and a Professional-first modal
sheet. Header labels derive from stable chapter ownership rather than raw
pixels. The sheet owns its focus trap, Escape handling, background isolation,
temporary body scroll lock, and teardown, but opening it cannot change story
progress, Composer output, or Projection. Destination selection reuses the
canonical navigation controller.

A mobile-only teleport controller and permanently locked document scroll were
rejected because they would split navigation semantics and violate native
scroll ownership.

### 10. Traversal is a presentation policy over real canonical progress

Normal user scrolling remains `NORMAL_SCRUB`. Only explicit programmatic story
navigation may use `FAST_TRAVERSAL`, in which continuous staff/path/required
Assembly state remains visible but Composer events are fully suppressed.
Arrival returns to normal presentation only after semantic ownership settles.
Cancellation or target replacement starts from actual current progress; the
abandoned target cannot complete. Restoration settles directly and cross-branch
travel never replays Home entry.

A time-only overlay and velocity-triggered fast mode were rejected because
they would diverge from native scroll/history and could expose false state.

### 11. Lifecycle and performance are explicit stateful resources

The story root owns initialization, readiness, coalesced material rebuild,
responsive invalidation, traversal, observers, listeners, timers, focus/scroll
locks, GSAP contexts, and idempotent disposal. Failure or timeout is fail-open:
content, native scrolling, navigation, forms, and focus remain usable.

Development instrumentation proves ordinary scrub performs zero per-frame
Composer calls, Projection builds, DOM measurements, React frame-clock writes,
or telemetry emissions. Counters and diagnostic logging run outside the frame
hot path. Global `killAll()` and unscoped cleanup are rejected because they may
destroy resources owned elsewhere.

### 12. Validation and evidence are gate-local and successor-only

Each stage runs the smallest semantic, property, geometry, browser,
accessibility, or lifecycle suite that proves its own invariants before the
next family is introduced. Stage 18 then runs the complete deterministic
Chromium/Firefox/WebKit, accessibility, performance, lifecycle, and visual
evidence gates. Successor captures receive their own manifest and digest;
Phase-9 artifacts are never regenerated to describe successor geometry.

Final automated PASS stops at explicit human homologation. Commit, push,
deployment, and production cutover remain separately authorized actions.

## Risks / Trade-offs

- **[A geometry delta leaks beyond the approved five]** → snapshot unaffected
  zones, review Projection diffs, and stop on any unregistered visual change.
- **[Professional density appears to require new music]** → preserve current
  Composer fingerprints and request a separate explicit Composer decision.
- **[Motion reveals an approved geometry defect after refreeze]** → require a
  reproducible defect, focused fix/regression, and refresh only affected
  successor evidence before continuing.
- **[Responsive rebuild replays or changes semantics]** → resolve from stable
  chapter/progress/Assembly state and property-test repeated mode changes.
- **[Scenic/canonical overlap doubles opacity or jumps]** → consume the one
  Projection-owned entry geometry, bound overlap opacity, and snapshot both
  directions around ownership transfer.
- **[Per-frame work regresses performance]** → instrument domain calls,
  measurements, React writes, timelines, listeners, and memory across long
  scrub/resize/traversal runs.
- **[Modal cleanup leaves focus or body lock stranded]** → make disposal
  idempotent and test Escape, navigation, responsive teardown, failure, and
  unmount paths.
- **[OpenSpec summaries drift from the detailed contract]** → treat the named
  canonical specification and decision families as controlling authority.

## Migration Plan

1. **Stage 0 — Bootstrap:** verify Phase-9 closure and both SHAs, create this
   isolated spec-driven change, register the canonical authority, decisions,
   five deltas, owners, stop rules, and update current-status surfaces. No
   runtime edit.
2. **Stage 1 — Bounded geometry:** implement only the five deltas, preserve all
   listed Phase-9 semantics/clearances, run focused geometry and responsive
   tests/captures, then stop at the Human Geometry Gate.
3. **Stage 2 — Refreeze:** after explicit approval, create and seal separate
   successor geometry evidence and record its digest.
4. **Stage 3 — Projection metadata:** add stable zone, entry, Assembly, draw,
   and reveal metadata with no GSAP and no visual change.
5. **Stage 4 — Assembly model:** implement and property-test the pure reversible
   state machine.
6. **Stage 5 — Staff draw:** implement one logical reversible five-line front.
7. **Stage 6 — Event reveal:** bind atomic Composer groups only to safe anchors
   without semantic mutation.
8. **Stage 7 — Scenic handoff:** model exact entry ownership transfer, lead-in,
   settled bypass, and reverse equality.
9. **Stage 8 — GSAP binding:** connect pure state to scoped GSAP/master timeline
   and prove zero per-frame structural work.
10. **Stage 9 — Home Scenic Assembly:** integrate 9A–9F incrementally, with
    review after materially distinct visual families.
11. **Stage 10 — Structural Assembly:** integrate Services and How It Works and
    prove event-free, responsive, reduced, clearance, and reverse contracts.
12. **Stage 11 — Mobile serpentine:** bind accepted mobile score geometry while
    preserving branch order, local LTR shelves, terminals, and resize state.
13. **Stage 12 — Compact mobile header:** establish one row, semantic label,
    sticky reservation, 44-pixel targets, and collision safety.
14. **Stage 13 — Navigation sheet:** implement modal behavior, canonical order,
    story isolation, focus restoration, theme stability, and teardown.
15. **Stage 14 — Normal scrub:** enable staff draw/erase, safe event reveal,
    and bounded content reveal over present semantic DOM.
16. **Stage 15 — Fast Traversal:** implement staff-only explicit navigation and
    actual-progress arrival/cancel/replacement recovery.
17. **Stage 16 — Reduced motion:** settle the same semantic architecture with
    direct/minimal presentation.
18. **Stage 17 — Hardening:** exercise mount/unmount/remount, resize/orientation,
    navigation interruption, drawer/theme changes, readiness timeouts, GSAP
    failure, and disposal/memory stability.
19. **Stage 18 — Regression/homologation:** run the full deterministic quality
    matrix, seal successor evidence, and stop for explicit final human approval.

Stage-local rollback reverts only the affected successor implementation and
its unsealed evidence. A post-refreeze geometry rollback follows the proven
defect workflow; no rollback alters the frozen Phase-9 baseline or sealed
Phase-9 artifacts.

## Open Questions

- The authority defines `MOT-DEC-001..009` and `MOT-DEC-025..035`; identifiers
  `MOT-DEC-010..024` are absent repository-wide although the requested family
  shorthand is `MOT-DEC-001..035`. This is a non-blocking numbering gap: the
  change references the umbrella family as requested, treats only actually
  defined clauses as normative, and does not invent missing decisions.
