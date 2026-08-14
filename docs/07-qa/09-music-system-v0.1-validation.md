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
- key signatures `-7..+7` and `0`;
- final barline thin/gap/thick ordering;
- same seed + same inputs => deep-equal semantic composition;
- different seeds demonstrate nontrivial variation across a sample set;
- no immediate identical motif;
- no pitch outside allowed range;
- no more than two identical consecutive staffSteps;
- terminal profile rejects dense motifs;
- reserved zones remain empty.

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
