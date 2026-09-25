# Projects candidate intersection: measurement-order classification

Classification **C — candidate/measurement pipeline regression**. Diagnosis only.
HEAD `40e6ae1a8996c53ed2ec372c47f16bc073d6cee9`, branch
`develop/site-institucional`; active change
`implement-scroll-driven-score-assembly-and-motion`, **7/92**.
Human Geometry Approval remains pending/blocking.

No geometry defect ID, canonical decision or repair authorization is created.
The bounded correction belongs to **ADR-048 / ASM-IMP-DEC-012(C–F)**.
The remaining task is bounded implementation for **GPT-5.6 Sol / High**.

## Cause and counterfactual

`measurement.ts:measureStoryScoreScenes` now calls
`measureProjectInteractionGeometry` before collecting `professionalProjectCards`.
The probe sets `transition:none`, forces the production selected transform,
reads computed styles, then restores the attributes and inline style. Restoring
the transition starts its return animation. The following rectangle read sees
the selected endpoint at time zero, rather than the pre-probe idle state.

For card 3 at Chromium 1536x900, the normalized pre-probe rectangle is
`{x:17353.81,y:151.41,width:313.21,height:610.43}`. The snapshot sent to
Projection instead contains
`{x:17350.08,y:117.65,width:297.14,height:614.5}`. All three cards are affected.
The post-probe transform is `matrix(1.025,0,0,1.025,0,-17.6)` for cards 1/3;
card 2 has y translation -24. Each has a running reverse transition at time zero.
Restored attributes therefore do not establish restored physical state.

This changes 90 authored knot entries (indices 141–230) relative to canonical
idle input, including visit 3 through its changed card rectangle. No source
control-point repair is responsible. Passing the correlated sweep alone cannot
change geometry: removing only that field preserves the entire bad staff model.

A scratch-only bundle moved just the card-rectangle read before the probes.
It retained the current sweep, evaluator, Projection and all acceptance checks:

| State at 1536x900 | Capacity | Global crossings | Visit clearances, CSS px |
| --- | --- | --- | --- |
| Current production measurement | INVALID | Professional staff 2; all centers/Application 0 | Short-circuited |
| Read-before-probe diagnostic | PASS | All centers/staff 0 | 17.2563630680 / 29.2447361482 / 12.0320729864 |

The diagnostic's normalized legacy inputs exactly equal the saved pre-sweep
classification input. Its knots, semantic slots, all 1,025-point staff sequences
and 2,049 center samples exactly equal the current constructor on that saved
input. The recovered pre-sweep Professional constructor also produces exactly
equal complete models on each of the same four tested input snapshots.
Thus correcting input ordering restores existing geometry, including 002/003;
it does not use 014 junction authority to move a connector.

## Exact crossing and validator validity

The requested current candidate pair reproduces:

- Line: `wf-phase-9-task-34:horizontal-enhanced:professional:staff:0`.
- Edge 889: `(17430.036475747067,798.6041494579283)` to
  `(17430.560606161755,798.175553032493)`.
- Edge 896: `(17429.09102278849,798.5671561093756)` to
  `(17430.521544950145,798.4757724982927)`.
- Strict intersection: `(17430.165666513683,798.4985064743905)`;
  segment parameters `u=0.24648591837995973`, `v=0.7512248002850668`.
- t ranges: `[0.8681640625,0.869140625]` and
  `[0.875,0.8759765625]`; visit 3 starts at 0.88.
- Both edges belong once to the same continuous, opacity-1 primitive
  `wf-phase-9-task-34:horizontal-enhanced:professional:staff:0:canonical:65`.
  They are nonadjacent and nondegenerate; no adjacency exemption applies.
- Width 0.72 CSS px (radius 0.36). The center segments already intersect;
  stroke inflation is not the cause. Six-decimal presentation is not involved.
- A second crossing in the same bad snapshot is staff 8, edges 841/852,
  at `(17344.10316508378,835.8917302987502)`.

The companion JSON persists all endpoints, t ranges, owning primitives and the
physical-coordinate mapping. The observed forced-live SVG matrix is
`[0.9999999077238207,0,0,0.9999999077238207,0,199.17191652428065]`;
mapping the first intersection gives
`(17430.164058124592,997.6703493162798)` physical CSS px. This is a mapping of
the model through the measured live layout, not a claim that a hidden candidate
painted an SVG. Candidate tracks contain **zero score layers and zero SVGs**;
their score is a pure Projection model. The original live track has one layer
and two branch SVGs. There is no duplicate candidate score or path concatenation.

The independent complete-segment oracle agrees with the unchanged runtime
validator. Both use full 1,025-point staff input and the retained 1e-7 guards.
Clipping edges are not inputs. Neither double transforms, zero-length edges,
sampling-index drift nor mixed path generations explain the crossing. It is
real in the geometry produced from bad layout inputs; the validator must keep
rejecting that snapshot.

## Candidate/live equivalence and limits

Production remains **vertical-wide**, because the candidate is INVALID. There
is no normally enabled live horizontal presentation to label PASS. After
destroying the runtime, diagnosis synchronously forced the original DOM into
horizontal layout and measured it with the current shared function. Candidate
and forced-live snapshots are exactly equal, including sweeps; their controls,
semantic slots, complete staff/center sequences and intersection results agree.
Both track transforms are `none`; their different vertical viewport offsets
(122.171875 and 199.171875) cancel in normalization. Both stages use overflow
clip. This rules out candidate-only coordinate conversion as this root cause.

The later React-owned horizontal SVG can undergo another measurement transaction
and is not certified as the same snapshot generation. Its captured CTM supplies
the physical mapping only. Repeated-read and active-interaction stability are
required implementation regressions, not resolved merely by sharing a function.

Only 1536x900 was causally tested here. Earlier reports at 1440x900, 1920x917 and
1100x640 remain reported failures until the implementation run verifies them.
No complete pre-current-Sol source snapshot or fresh historical browser was
recovered. Stage-0/Phase-9 reproduction is unnecessary for this proven pipeline
regression; prior lineage records remain unchanged. No final matrix/capture ran.

## Bounded implementation handoff

First add a production-style regression proving that the returned layout-card
rectangles equal the pre-probe snapshot and that probing leaves no synthetic
transition affecting a subsequent read or the visible live cards. Then correct
`measurement.ts:measureStoryScoreScenes` / `measureProjectInteractionGeometry`.
Preserve the correlated contours and continuous safety bound. All geometry
inputs must describe one consistent pre-probe layout; restore effective
interaction state as well as attributes. A read-order-only patch demonstrates
causality but does not finish cleanup/repeated-read requirements.

`projects-capacity-candidate.ts:measureProjectsHorizontalCandidate` and
`StoryScoreLayer.tsx` remain consumers of the shared semantics. Do not change
Projection or use an offset on the visit-2-to-3 junction. The bad input changes
geometry outside 014's named minimum junction boundary, so proximity supplies
no geometry repair authority. No new owner decision is needed for the 012
measurement correction.

Required focused regressions: exact bad input remains globally INVALID;
pre-probe input retains canonical controls and zero crossings; candidate/live
equivalence; probe attributes/style/animations and host cleanup on success/error;
repeat measurements; hover/focus during measurement; all three capable candidate
sizes plus 1100x640; same-viewport content-capacity changes; missing/inconsistent
interaction data cannot PASS. Preserve the existing 20 tests and immutable
12.024253229068329px witness. Then continue the previously authorized 001
lifecycle/semantic-resize/vertical-three-visit work and its ordered validation.

## Validation and exact worktree scope

Focused measurement/capacity/eligibility suites: **20/20 PASS**, three files.
Successor OpenSpec strict: PASS; workspace strict: **17 passed, 0 failed**.
The handoff YAML and diagnostic JSON parse; `git diff --check` passes.
All four Phase-9 manifest/seal pairs and 64 payloads pass SHA256 and byte
comparison with both Stage 0 and frozen Phase 9. All initial product/test/prior
evidence files are unchanged. Of the 1,540 initial protected files, only the
derived `CURRENT_HANDOFF.md` changed; this run adds this review and its companion
JSON. Exact initial/final `git status --short` is retained in that JSON.
The diagnostic server was stopped. No task checkbox, runtime, geometry,
canonical contract, acceptance rule or historical evidence was modified.
TypeScript/ESLint prior passes remain prior evidence; no source edit required
their repetition in this diagnosis. No final matrix or captures were generated.

## Ready-to-paste continuation

```text
MODEL: GPT-5.6 SOL
REASONING: HIGH

Resume the exact dirty WFlyer worktree at
/home/davi-benucci/Área de trabalho/WFlyer.
Expected HEAD: 40e6ae1a8996c53ed2ec372c47f16bc073d6cee9
Branch: develop/site-institucional
Active OpenSpec: implement-scroll-driven-score-assembly-and-motion
Progress: 7/92. Human Geometry Approval pending/blocking.

Read AGENTS.md, AI-MRP-001 v1.1.0, CURRENT_HANDOFF.md and active-change
stage-1-projects-intersection-classification.md plus its diagnostic JSON.
Use ADR-048/049/050 and ASM-IMP-DEC-012/013/014; no authority expansion.

Astra High classified the 889/896 crossing as C, a measurement pipeline
regression. measureStoryScoreScenes reads idle card bounds after interaction
probes start reverse CSS transitions. The selected endpoint enters Projection
as idle layout. The validator correctly rejects two resulting staff crossings.
Candidate/live input equality does not fix this shared error. Reading layout
cards before probes in a scratch bundle restores exactly the saved canonical
controls, full staff/center points and zero global intersections. Complete
diagnostic capacity passes at 1536x900. Production is still INVALID and unpatched.

FIRST ACTION: add the production-style pre-probe/post-probe regression, then
correct only shared measurement transaction ordering and effective state
restoration under 012(C-F). Preserve correlated 257-sample contours, complete
focus ink, continuous bound, full precision and the 12.024253px witness.
Prove repeat/live interaction stability and error/host cleanup; restoring
attributes alone starts a reverse transition and is insufficient. Do not change
Projection geometry, visit 3 controls, or compensate with connector offsets.
Persist the bad-input INVALID case and correct-input canonical geometry equality.

Preserve all Sol work, 002/003 repairs, Batch 1/2, five visual deltas, ADR-046,
Composer seed/semantics/fingerprints, glyphs, cards/content/fan/focus, three
Projects visits, NON-ASSEMBLY, full visible ink, >=12px and global zero crossings.
Do not repeat completed lineage or force old negative fixtures to PASS.

Verify focused measurement/capacity then component/lifecycle tests. Prove
1440x900/1536x900/1920x917 actual candidate classifications, 1100x640 fallback,
same-viewport content changes, missing-data NOT_READY/INVALID, candidate/live
equivalence and unchanged 002/003/visit3 geometry. Continue only approved 001
eligibility/readiness/latest-generation/cleanup/semantic-resize and vertical
three-visit support. Complete deterministic global geometry, lint and pnpm
typecheck before focused hydration/resize browsers. Only after stability run a
fresh full serial Chromium/Firefox/WebKit matrix, workers=1/retries=0, preserving
the prior scope plus required capacity/interaction/lifecycle cases. Then complete
successor Stage-1 evidence and historical integrity verification; mark tasks
only with complete evidence, and STOP at Human Geometry Approval.

Escalate per AI-MRP-001 for two bounded attempts without material progress,
unresolved cross-engine/candidate equivalence, new unregistered physical defect
or scope expansion. Do not hide defects through universal fallback.
Forbidden: Stage 2+, motion/Assembly, refreeze, commit, push, deploy, historical
evidence mutation, acceptance weakening or marking human approval.
```
