# HGA-001 — resolved local mechanism and bounded corrective design

Date: 2026-09-23. HEAD: `40e6ae1a8996c53ed2ec372c47f16bc073d6cee9`.
Branch: `develop/site-institucional`; dirty worktree preserved.
This is diagnosis and design, not an implemented repair or acceptance result.
The [structured record](stage-1-hga-001-causal-model.json) retains exact measured
inputs, local knots, cubic controls, staff samples, threshold observations and
an offline feasibility witness. The three previously rejected trials were not
repeated. HGA-002 measurements and historical evidence remain unchanged.

## Mechanism

The intersection is a **normal-offset fold at the origin/connector join**.
The center guide and its knots advance in x. They do not self-intersect.
The final uniform cubic B-spline bends too tightly for the staff at offset
`d=-24px`; that offset reverses direction, producing the 126/131 crossing.
`staff:0` is the semantic line identifier; with the implemented right normal
and negative offset it lies below the center guide here. The earlier report's
word “top” must not be interpreted as screen-space ordering.

All coordinates are projection/track-relative CSS pixels. Measurements subtract
the track's client rect and round to two decimals. Horizontal track coordinates
span multiple chapters; x≈1498 is not an out-of-viewport defect at a CSS width
of 1366. Later scrolling/track translation changes screen position, not this
intersection. No card, interaction envelope, stale frame or validator error
causes the Home-to-About crossing.

At 1366×768:

- Approved origin points are sampled at 33 positions and translated to
  `(785.45, 360.96)`. Its retained endpoint is `(1505.45, 412.8)`; the last
  source secant is `(24.298242, -4.792368)`, i.e. slightly upward on screen.
- Measured About content starts at x=1665.69. `originCutoffX=1521.69` retains
  all 33 origin points. `descentEndX=1617.69`; the complete About lower
  corridor is capped at `safeY=684`. The About target is `(1745.45,684)`.
- The measured-bridge eligibility checks pass: descent width112.24≥72,
  target-minus-descentEnd127.76>96, and safeY equals target.y.
- `horizontalProfessionalAboutBoundaryBridge` builds a provisional cubic
  from `(1505.45,412.8)` through `(1536.8772,412.8)` and
  `(1586.2628,684)` to `(1617.69,684)`. The vertical change is271.2px.
  Eight interior samples at i/9 become knots; sample2 gets the existing +6px
  x adjustment from ASM-SI-020/021. Three settling knots lead to the target.
- These are **control knots**, not interpolated final anchors.
  `ReviewCubicSplineScorePath` converts each four-knot neighborhood into a
  uniform cubic B-spline span. For knots P0..P3 its Bezier controls are
  `(P0+4P1+P2)/6`, `(4P1+2P2)/6`, `(2P1+4P2)/6`,
  `(P1+4P2+P3)/6`. The origin-to-first-descent neighborhood therefore matters
  even though the provisional bridge starts with a horizontal tangent.
- Around spline coordinate32.260, numerical curvature peaks at
  `+0.06333502 px^-1` (radius15.78905px); tangent≈`(0.928653,0.370951)`.
  This radius is smaller than the24px normal offset. C2 continuity holds;
  continuity by itself does not prevent offset folds.

For right normal `N=(T.y,-T.x)`, the parallel curve `Q=P+d*N` satisfies
`dQ/ds=(1+d*kappa)*T`. Here `1-24*kappa≈-0.52004`: the staff travels backwards
while the guide continues forward. Original staff samples127→130 move
`1500.174643 → 1499.574393 → 1497.727478 → 1497.029871` in x, then advance
again. The full1025-point replay reproduces exactly one crossing, segments126
and131, matching the previously recorded rendered248-point canonical run to
sub-micro-pixel precision. This is not a discretization-only artifact: the
continuous offset already loses regularity. The +6px adjustment affects the
final spline but is not an x-order reversal; all local input knots are ordered.

## Comparison and bounded threshold

| CSS viewport | Selected constructor | Local minimum radius estimate | Original staff intersections | Complete capacity |
| --- | --- | ---: | --- | --- |
| 1366×768 | measured About boundary | 15.78905px | 126/131 | INVALID |
| 1394×768 | measured About boundary | 21.33369px | 127/129 | INVALID |
| 1395×768 | generic Professional bridge | 34.27009px | none | INSUFFICIENT_CAPACITY |
| 1440×900 | generic Professional bridge | 33.27570px | none | PASS |

The fixed-height search isolates an existing constructor-selection boundary,
not a proposed breakpoint. At1394 the target-minus-descentEnd is96.27px; at1395
it is95.125px. The existing strict `>96` condition switches away from the narrow
measured descent. At1440×900 it is44.5px, so the generic connector advances240px
from origin endpoint to About target. Merely increasing width is not proof of
complete horizontal capacity:1395×768 remains a legitimate fallback.

The nearest bounded integer-width transition is1394/1395 for these measured
inputs. It is not a universal engine/font/height threshold. Curvature extrema
are dense numerical estimates, not certified analytic extrema; the original
visible-segment crossing checks are exact for the rendered polyline samples.

## Smallest corrective design

Keep the existing origin, measured end/safeY, About target, connector knot count,
settling knots, downstream shelves and generic B-spline implementation.
Change only the **unsafe measured bridge's horizontal control reach**, chosen
from its measured rise and rendered staff width. Leave already-safe connectors
unchanged. Do not change chapter spans, scene padding, origin cutoff, responsive
policy, Projects geometry or the existing Batch1/2 local repairs to obtain this.

The acceptance invariant for the final local spline, including both joins, is:

1. Guide x derivative stays positive.
2. Every required normal offset remains forward: `1+d*kappa > epsilon`.
   A conservative sufficient condition is `abs(kappa)*R < 1`, with
   `R=2*staffSpace+halfStroke` (24.36px in this witness).
3. Original rendered offset points must advance in x throughout the repaired
   neighborhood; unchanged complete visible-segment/center validators still
   check the whole story. Keep original sampling, full ink and content checks.

A bounded seed for control reach is
`h=max(0.28*W, sqrt(2*R*abs(deltaY)/3))`, with x controls `start.x+h` and
`end.x-h`. The square-root relation comes from the provisional cubic's endpoint
curvature `2*abs(deltaY)/(3*h*h)`. **It is a seed, not proof for the final
B-spline**. Verify that spline's joins and rendered samples; fail closed if
constraints cannot be satisfied without widening this envelope. Avoid a
viewport table, a generic layout solver, or unbounded parameter searching.

An offline mathematical witness using unchanged knots except those bridge
samples gives h/W≈0.59127593, local radius≈30.76115px, positive guide progression
and ordered knots. A second reach h/W=.5 also demonstrates a feasible local
shape (radius25.78374px). Neither value is a prescribed new magic constant.
No source patch, production acceptance or browser screenshot of a repair was
performed. Sol must add the regression witness, implement and validate it.

Minimal implementation surface: `projection.ts`'s
`horizontalProfessionalAboutBoundaryBridge` and, only for join-aware guarding,
its `prependApprovedOrigin` call site; focused tests in
`tests/unit/story/story-score-successor-geometry.test.ts` or the existing
projection test. Reuse the existing spline and full intersection checks.
Do not alter `organic-flowing.ts`, approved origin/glyphs or Composer.

## Mandatory residual-capacity boundary

Removing this fold does **not** establish native1366 horizontal support.
An offline witness changes only the local bridge controls/affected staff
samples while retaining downstream points, event primitives and zone parameters.
The complete existing capacity evaluator changes from `INVALID` to
`INSUFFICIENT_CAPACITY`, with `projects-protected-clearance-or-clip`:

- Visit1: -37.10077px, own-shelf notehead envelope.
- Visit2: 11.91535px, incoming staff; own shelf12.15071px.
- Visit3: -20.26345px, incoming staff; own shelf -20.15423px.

These are diagnostics of an unaccepted candidate, not evidence of a regression
in the selected vertical runtime and not a new repair authorization. The
structured record includes exact primitive owners, edges and protected bounds.
A Home-only change cannot alter those retained Projects quantities. Do not
silently widen HGA-001 to repair Projects or force horizontal selection. Sol may
complete the bounded local intersection repair, but if full capacity reproduces
this residual, STOP before further geometry changes and report the precise
contract/envelope that needs owner review. Do not claim HGA-001's broader
native-desktop acceptance complete. ADR-048/049/050 and ASM-IMP-DEC-012/013/014
remain unchanged, including whole-story fallback, three NON-ASSEMBLY visits,
12px, full interaction ink and no universal-horizontal guarantee.

## Supplemental telemetry classification

`NONBLOCKING_DIAGNOSTIC_TELEMETRY_DEFECT`; not a substitute for validation and
not a prerequisite repair for Geometry Refreeze under the current Stage-1 gate.
At1366, every-fourth-point thinning alone removes the crossing, even when the
pair loop starts at i+2. At1394, the i+4 neighbor skip independently misses the
127/129 pair, even on unthinned data. Both mechanisms are recorded separately.

`projects-capacity.ts:evaluateProjectsCapacity` checks original staff points
and2049 center samples. The active manifest's GEO observations use
`assembly-stage1-geometry.spec.ts`, which independently checks all rendered
staff segments (including cross-run pairs) and2049 replay points **before**
asserting supplemental attributes. Its comment explicitly limits telemetry to
that supplemental role. Older Phase9 and some unit assertions using telemetry
alone do not supply the current Stage-1 global guarantee. Preserve the full
gate and record the false negative; do not relabel the attribute as authoritative
or weaken those tests. No telemetry implementation belongs to this diagnosis.

## Handoff and preservation

HGA-002 is causally separate: preserve all previously recorded gaps/gutters.
No density changes were made. Composer semantics and semantic fingerprints must
remain identical; a geometry-derived capacity signature is expected to change
after a real repair and must not be confused with a Composer fingerprint.
No canonical decision was changed and no architecture permission was invented.
The63-observation PASS remains its previous checkpoint, not acceptance evidence
for a future repair or for the new1366 state. Task5.6 stays unapproved.

Continue with [the bounded Sol High handoff](stage-1-hga-model-handoff.md).

## Closure verification

- Active OpenSpec strict validation: PASS; no checkbox changed (30/51).
- Structured causal/diagnostic JSON and handoff YAML: PASS.
- Saved crossing/boundary witness consistency: PASS.
- SHA-256 comparison of every existing `src/` and `tests/` file against the
  start-of-diagnosis manifest: unchanged. No production or test repair occurred.
- Scoped changed/new artifact whitespace checks: PASS.
- Whole-worktree diff check retains the pre-existing unrelated `.env.example:9`
  trailing whitespace/new blank line; deliberately not repaired here.
- Own temporary diagnostic server stopped. No full matrix or final captures.
