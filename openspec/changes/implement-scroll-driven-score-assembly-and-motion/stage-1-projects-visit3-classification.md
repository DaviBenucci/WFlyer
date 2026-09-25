# Projects visit-3 classification and bounded implementation handoff

Recorded 2026-09-12. Diagnosis only; no runtime/test/geometry repair in this run.
HEAD `40e6ae1a8996c53ed2ec372c47f16bc073d6cee9`, branch
`develop/site-institucional`, dirty worktree preserved. Active change:
`implement-scroll-driven-score-assembly-and-motion`; progress **7/92**;
Human Geometry Approval remains pending/blocking.

## Classification

**E — loss of spatial correlation in the enclosing interaction rectangle.**
The reported 8.475144370079207px is a real rejection by the current conservative
rectangle predicate, but is **not a measurement of the actual focus contour's
clearance**. It does not establish an inherited physical visit-3 shelf defect
or justify moving that shelf. No new canonical diagnostic/ADR/decision ID is
allocated. The prior STOP, JSON and model handoff remain immutable diagnostic
history; their inference that a shelf-3 repair necessarily follows is superseded
by this review, not by a changed acceptance contract.

At 1536x900, the current candidate still returns INSUFFICIENT_CAPACITY:

| Measurement | CSS pixels |
| --- | ---: |
| Visit 1, existing full rectangle/ink predicate | 12.008125281333946 |
| Visit 2, existing full rectangle/ink predicate | 29.246151033756192 |
| Visit 3, rectangle predicate, all staff | 8.372450414027085 |
| Visit 3, rectangle predicate, wholly internal shelf segments | 8.475144370079207 |
| Visit 3, minimum sampled distance to transformed outer-outline rectangles | 12.171123612715384 |
| Visit 3, conservative continuous-transition lower bound after inflation | 12.024253229068329 |

The last two rows are focused staff/interaction diagnostics, **not a complete
capacity PASS**, final browser evidence, or authorization to make an old fixture
positive. The production evaluator is unchanged and still rejects this candidate.

## Evidence and lineage limits

The paired `stage-1-projects-visit3-classification-diagnostics.json` retains saved
browser inputs, source hashes, reproducible scratch harness sources, local
constructor output, transformed focus polygons and validation results.

1. **Current Chromium:** at 1536x900, observe the first production measurement
   transaction without remeasuring its candidate. Compare it to the original
   production DOM synchronously forced into horizontal layout after driver
   destruction for diagnosis only. All normalized scene measurements are exactly
   equal, including card sizes and interaction envelopes. This rules out
   candidate/live coordinate inequivalence for this witness, not every lifecycle
   state or browser. Production eligibility is not bypassed in repository code.
2. **Actual focus styles:** an isolated visible copy of the production DOM,
   translated horizontally into view, has real `:focus-visible` on link 3. Its
   transform transition is paused at 0/1/90/180/360ms. The initial transform is
   `matrix(0.999229,0.0392598,-0.0392598,0.999229,0,6.4)`; the final transform is
   `matrix(1.025,0,0,1.025,0,-17.6)`. Outline width/offset are 4/6px, border inset
   1px. The hidden production candidate is never focused. This is a diagnostic
   DOM copy, not an approved live horizontal score presentation or final capture.
3. **Current constructor / repair-disabled ablation:** visit-3 shelf controls and
   101 corresponding local path samples are identical with and without the current
   002/003 minimum-Y application. The shared valley changes the 2-to-3 connector,
   ending at changed knot 218; own-shelf support is unchanged. Thus there is a
   shared junction dependency, but it does not cause the internal rejection.
4. **Pre-Sol evidence:** the exact full pre-Sol dirty source snapshot is unavailable;
   no exact pre-Sol worktree replay is claimed. The persisted pre-Sol visit-3
   range/anchor/first/last control records match the repair-disabled constructor
   on all three original saved fixtures. Ablation is explicitly not a checkout.
5. **Stage 0 / Phase 9:** original Professional branch constructors and their
   source dependencies are read from `40e6ae1…` and `306ccb74…` into scratch
   bundles. On the same newly saved browser input, own-shelf controls equal the
   current controls; corresponding path samples differ by at most 3.64e-12px.
   Their internal rectangle clearance is 8.474462000781955px (different global
   sample phase), while the correlated continuous-transition diagnostic lower
   bound is 12.025581697073182px. Historical constructors reproduce the
   conservative predicate rejection, **not a proven physical focus failure**.
   No historical browser run or historical aggregate PASS is claimed.

Only **one current occurrence, 1536x900**, was classified. Comparisons of saved
1440x900 and 1920x917 controls are lineage checks, not new physical-clearance
occurrences or capable-layout results.

## Why the rectangle rejects

`measurement.ts:measureProjectInteractionEnvelope` collapses rotated focus
rectangles across the entire transform transition into one axis-aligned union.
`projects-capacity.ts:evaluateProjectsCapacity` treats that entire rectangle as
occupied. Its bottom (771.33px) extends the low rotated corner horizontally
over staff locations where the actual outline is higher. Candidate and original
DOM can therefore agree perfectly and still produce this false rejection.

The focused countercheck keeps each transformed rectangular outline intact
(including its square corners, conservatively enclosing the rounded outline).
It tests all relevant rendered staff segments against 257 transform-parameter
samples. A nearest-sample derivative bound inflates distance by
0.146870383647055px, including a separate 0.02px numerical reserve. The bound
covers continuous interpolation, not just sampled animation frames. Horizontal
distance excludes only segments already farther than 12px plus that reserve;
all retained segments lie below the outer union, so polygon containment or
crossing cannot invalidate the segment-distance calculation. The entire
outline is retained throughout the sweep, also conservatively covering idle,
hover and reverse transition states. No shelf control or CSS parameter changes.

This focused certificate is intentionally narrow: production integration must
derive its parameters from measurement, handle general segment/polygon
intersection and containment, validate malformed input, and retain all other
capacity checks. It must not copy the diagnostic's observed dimensions or
viewport constants into runtime.

## Authority and exact next action

Existing **ADR-048 / ASM-IMP-DEC-012(C–F)** is sufficient for a bounded
measurement/evaluator correction: production styles and immutable snapshots,
physical distances and conservative whole-transition coverage are already its
contract. It does not mandate treating the empty corners of a single enclosing
rectangle as painted content. Preserve raw rectangles for normalization,
clipping and conservative rejection/legacy inputs; add a conservative correlated
shape certificate for precise clearance where a broad rectangle alone rejects.
This changes representation accuracy, not the 12px requirement or repair scope.

The exact first implementation action is to add a focused regression using the
saved 1536x900 input and full transformed-outline certificate, then extend the
component measurement snapshot and pure evaluator together to consume that
certificate. Keep uncertified/legacy rectangle inputs conservative. Missing or
invalid required measurements must never produce PASS. Do not shrink an AABB,
subtract a constant, omit transition states, change sample phase to pass, or
alter `projection.ts` to compensate. Preserve the 002/003 repair output; the
first and second shelf reservation logic need not consume a new shape format
for this correction. Test candidate/live equivalence and probe cleanup after
integration; the current equivalence proof covers the first transaction only.

No new owner decision or Ultra review is needed **for this measurement-only
correction**. Any actual remaining physical failure, new defect, or need to move
visit 3 still triggers STOP under 014(E) and the user's scope-escalation rule.
Do not infer that all three viewport candidates are capable from this diagnosis.

Preserve ADR-048/049/050, decisions 012/013/014, 001 fallback/support authority,
002/003 repairs, five approved deltas, 14 Batch-1 and six Batch-2 repairs,
ADR-046 determinism, Composer seed/semantics/fingerprints, approved glyphs,
three Projects visits, NON-ASSEMBLY, card dimensions/content/fan/focus behavior,
complete staff/event ink, >=12px and zero global intersections. Retain all
historical evidence and validators. The earlier generated `.next/types` versus
`.next/dev/types` conflict is separate; typecheck was not rerun here and no
generated-state deletion was performed.

## Validation and preserved state

Successor OpenSpec strict: PASS. Workspace OpenSpec strict: 17 passed, 0 failed.
The affected handoff YAML and diagnostic JSON parse successfully; git diff
--check passes. All 1,007 files in the initial protected inventory are byte
unchanged, including runtime, tests, scripts, public assets and prior successor
records. Four Phase-9 manifest/seal pairs and 64 payloads verify by SHA256 and
byte equality against both historical references. Exact final git status is in
the paired diagnostic JSON. This run adds only this review and its diagnostic
JSON, and updates the derived CURRENT_HANDOFF.md; no canonical contract changes.
No runtime suites, final browser matrix or captures were run/generated. The
controlled diagnostic server was stopped. The production candidate remains
INSUFFICIENT_CAPACITY until the subsequent bounded measurement correction.

## Ready-to-paste continuation

```text
MODEL: GPT-5.6 SOL
REASONING: HIGH

Resume the exact WFlyer dirty worktree; do not restart Stage 1.
Follow AGENTS.md and docs/.ai/AI_MODEL_ROUTING_POLICY_v1.1.0.md.
Expected branch: develop/site-institucional
Expected HEAD: 40e6ae1a8996c53ed2ec372c47f16bc073d6cee9
Active OpenSpec: implement-scroll-driven-score-assembly-and-motion
Progress: 7/92. Human Geometry Approval is pending/blocking.

Read CURRENT_HANDOFF.md and active-change stage-1-projects-visit3-classification.md
plus its diagnostics JSON; then only ASM-IMP-DEC-012(C-F), 013 and 014(B-E).
The previous visit-3 STOP is immutable evidence, not proof that shelf 3 must move.
Classification: a single AABB loses spatial correlation in the rotated focus
sweep. Candidate/live first-transaction inputs are equal. Current and historical
own-shelf controls agree. At 1536x900 the AABB gap is 8.475px, while the focused
conservative correlated staff/transition lower bound is 12.024px. This is not a
full candidate PASS. No visit3 geometry repair or new canonical ID is authorized.

First action: turn the saved 1536x900 input and transformed-outline certificate
into a focused regression; correct only the ASM-PC-001 measurement/evaluator
representation to retain conservative spatially correlated transition shapes.
Keep raw rectangles for normalization/clipping and legacy conservative inputs.
Use measured production transform/outline parameters and a continuous bound,
including stroke, polygon intersection/containment and numeric safety. Missing
or invalid required inputs must never PASS. Do not hardcode the diagnostic
viewport, dimensions, offsets or a clearance correction. Keep projection.ts and
the successful 002/003 geometry unchanged for this measurement correction.

Prove candidate/live equivalence and measurement-host/probe cleanup with focused
tests. Keep the old negative fixture and incomplete measurements conservative.
Preserve all Sol work, 002/003 repairs, Batch 1/2, ADR-046 hydration/numeric
determinism, Composer fingerprints/seed/semantics, glyphs, card sizes/content/fan,
focus, three visits, NON-ASSEMBLY, full ink, 12px and global zero intersections.
Do not repeat prior inheritance audits or the rejected junction-offset attempt.

After measurement correction, continue only approved 012 fallback/vertical/
lifecycle work. Run focused validation during repair; deterministic geometry
and the complete capacity predicate must be clean before the final serial
Chromium/Firefox/WebKit matrix and successor Stage 1 evidence. Old viewport
fixtures become positive only after full actual-contract PASS. At least one
appropriate 1440x900/1536x900/1920x917 candidate must pass within named scope.

STOP for an actual unregistered defect, a needed shelf 3/other scope expansion,
unresolved authority, or the routing policy's repeated-root-cause/cross-engine
triggers. Never hide a defect through universal fallback. Keep the generated
.next/types versus .next/dev/types conflict separate; do not delete generated
state merely to force typecheck green. STOP at Human Geometry Approval.
Forbidden: unauthorized geometry repair, acceptance weakening, resets/clean,
Stage 2+, refreeze, motion, commit, push, deploy or marking human approval.
If the live state differs, preserve and reconcile newer valid work.
```
