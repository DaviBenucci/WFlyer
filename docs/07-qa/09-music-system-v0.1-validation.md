# Music System v0.1 — QA and Evidence Contract

**Status:** NORMATIVE  
**Applies to:** Geometry Core, Renderer, Procedural Composer, Music Visual Lab

## 1. Unit-test matrix

At minimum, cover:

- `staffStepToOffset` for negative, staff, and above-staff steps;
- straight-path point/tangent/normal;
- cubic Bézier point/tangent/normal normalization;
- five staff-line offsets remain coherent around curves;
- ledger steps: `-4,-3,-2,-1,9,10,11,12,13,14`;
- isolated stem direction around B4;
- beam group Option B balance and both tie-break stages;
- primary/secondary beam topology for every whitelisted motif;
- left/right secondary hooks for `S16_E8_S16`;
- triplet always emits `3` + bracket metadata;
- triplet numeral uses the approved `0.85` size and `0.18`
  side-gap token, remains centered from the full group span, and splits the bracket by
  `renderedNumeralWidth + 2 * tupletNumeralSideGapSp`;
- triplet beam/bracket/numeral non-overlap for UP/DOWN stems on straight,
  gentle-arc, and gentle-S ScorePaths;
- key signatures `-7..+7` and `0`;
- final barline thin/gap/thick ordering;
- same seed + same inputs => deep-equal semantic composition;
- different seeds demonstrate nontrivial variation across a sample set;
- no immediate identical motif;
- no pitch outside allowed range;
- no more than two identical consecutive staffSteps;
- terminal profile rejects dense motifs;
- reserved zones remain empty.
- a vertical viewport never implies vertical musical engraving;
- clef-bearing and event-bearing zones are notation-safe and read left-to-right;
- the treble clef is neither mirrored nor sideways;
- connector zones contain no musical events, including while their tangent is
  outside the active notation-safe limit;
- horizontal/vertical/static projection preserves semantic slots and score
  equality for the same seed;
- responsive remapping changes geometry only and does not recompose;
- the final barline remains conventionally oriented in a notation-safe terminal
  zone;
- pitch-increasing `normalAt()` semantics remain unchanged across projected path
  direction changes.

## 2. Stress tests

Generate at least 10,000 semantic segments with sequential explicit seeds without rendering React.

The run SHALL produce:

- zero unknown motif IDs;
- zero illegal rhythmic groupings;
- zero missing triplet metadata;
- zero unseeded random calls;
- zero out-of-range landing pitches;
- zero immediate identical motifs;
- zero key-signature mutation by the composer;
- deterministic repeat hashes for repeated identical inputs.

The exact 10,000 count is a minimum validation fixture, not a production runtime operation.

## 3. Visual evidence

Use fixed explicit seeds and deterministic viewport/theme settings. Required fixtures:

- glyph gallery;
- pitch ladder;
- extended ledgers;
- stems;
- flags;
- all beamed motifs;
- triplet;
- all key signatures;
- straight staff;
- gentle arc;
- gentle S-curve;
- final barline;
- CALM/BALANCED/ACTIVE/TERMINAL composer outputs.

After the 2026-08-17 Gate-C `approve-with-two-named-changes` review, recapture:

- `01-motif-matrix-light.png`;
- `02-motif-matrix-dark.png`;
- `08-responsive-vertical-mobile.png`.

Also capture dedicated triplet-detail and mobile-score-orientation evidence. The
mobile evidence must show an upright clef, at least two left-to-right
notation-safe zones separated by a steep/vertical connector containing no
events, quarter/half notes, a beamed motif, a triplet, a conventional final
barline, and all five staff lines continuously through the transition. Capture
both themes unless one artifact demonstrates both unambiguously.

After the 2026-08-24 follow-up review, preserve all historical and responsive
evidence and recapture only these four files in a new evidence directory:

- `01-motif-matrix-light.png`;
- `02-motif-matrix-dark.png`;
- `10-triplet-detail-light.png`;
- `11-triplet-detail-dark.png`.

Where the repository's governed production-like Playwright environment cannot expose the dev-only Visual Lab, capture Visual Lab evidence only in the explicit development harness and separately assert that `/__visual-lab/*` returns 404 in the production build. Do not weaken the production 404 requirement to make screenshots easier.

## 4. Human calibration evidence

For each glyph record:

- source asset ID + SHA-256;
- proposed staff-space scale;
- all required anchors;
- screenshot at 25%, 50%, 100%, and 200%;
- light/dark evidence;
- contextual staff placement;
- reviewer decision: `approved` / `changes-required`;
- approval date.

The repository manifest MUST NOT change an asset to runtime-approved without this recorded review.

## 5. Accessibility

Narrative scores are decorative:

- outer score SVG/container is `aria-hidden=true`;
- no glyph receives focus;
- debug/calibration controls are ordinary labeled form controls in the dev lab;
- forced-colors must retain sufficient visibility for the dev lab controls; decorative music does not carry user-facing information;
- reduced motion displays the same semantic composition statically.

## 6. Performance

Instrument the lab to verify:

- no composer execution caused by scroll;
- no geometry recomputation caused by scroll;
- no React render loop tied to animation frames;
- a responsive geometry rebuild does not generate a new semantic composition;
- repeated theme changes do not generate a new semantic composition.

## 7. Regression boundary

Before Gate C, compare the main landing before/after this change and prove that public layout, navigation, current legacy score, contact behavior, and application demo behavior are unchanged.

## 8. Gate-C review status

Final external human review on 2026-08-24 approved the automated evidence,
immutable baselines, corrected responsive semantics, reviewed renderer and
Composer values, `maxNotationTangentAngleDeg=18`, and the final `0.85` triplet
result. Responsive activation thresholds remain noncanonical, and current
connector geometry remains validation-only/noncanonical. The final authority
record and approved-evidence manifest are under
`gate-c/approval-2026-08-24/`.

## 9. Gate-C corrective delta evidence status

The corrective automated run is complete and retained under
`docs/canonical-v2/06-migration/evidence/music-system-v0.1/gate-c/delta-2026-08-17/`.
Its runner completed all 20 capture/source/browser/production/post steps with
recorded zero exit statuses. The final public regression passed 153 tests across
Chromium, Firefox, and WebKit; the three-engine Visual Lab run passed 64 checks
with five contract-approved skips; the accessibility subset passed 37 checks
with two forced-colors skips; and the production guard returned 404 for every
one of the eight lab routes in all three engines.

The post-run pinned checks prove 16/16 approved SVGs and 84/84 committed visual
snapshots unchanged. A 2026-08-24 structural Graphify refresh and isolation
query found no path from the new renderer/composer/projection nodes into the
public experience shell or legacy score components. The complete command,
timestamp, count, reuse, and evidence ledger is in
`2026-08-24-gate-c-delta-review.md` inside that directory.

This is historical automated candidate evidence. At that checkpoint task `7.7`,
Gate C, the final `0.85` optical result, landing integration, and change archival
remained human-gated; the later final approval record supersedes that status.

## 10. Final triplet correction evidence

The new evidence lives under
`docs/canonical-v2/06-migration/evidence/music-system-v0.1/gate-c/final-triplet-2026-08-24/`.
It retains the historical and responsive evidence byte-for-byte, records the
`0.75 -> 0.85` comparison, and includes only the four authorized recaptured PNGs.
Those four images passed final external human optical review on 2026-08-24. The
separate approval bundle records authority, exact canonical values,
supersession, closeout validation, and the final seal.
