# Music System v0.1 Gate C — candidate renderer/composer review

**Prepared:** 2026-08-17  
**Branch:** `develop/site-institucional`  
**HEAD at preflight:** `784856b5b34ef87c8be24ab666d5d37756573ded`  
**Review status:** `pending-human-gate-c-review`  
**OpenSpec human gate:** task `7.7` remains incomplete  
**Public integration:** none

OpenSpec tasks `7.1` through `7.6` are complete on automated implementation,
test, and evidence grounds. Task `7.7` deliberately remains incomplete because
candidate artifacts are not human approval.

This bundle presents the current Gate-C renderer and Composer candidates for
external human review. It is not an approval record, does not promote any Gate-C
value into an approved canonical register, and does not create visual goldens.
The recommended candidate below remains a draft until the reviewer explicitly
approves it or requests changes.

## Decision boundary

| Classification | Status in this bundle |
|---|---|
| Gate-B glyph metrics and anchors | Externally approved on 2026-08-15; immutable here |
| Gate-B down-flag transform | Externally approved on 2026-08-15; inherited unchanged |
| Eight source and eight runtime SVG files | Immutable; no path edits authorized |
| Existing 84 committed visual snapshots | Immutable; no snapshot update authorized |
| Renderer engraving/spacing tokens below | Draft; human Gate-C decision required |
| Composer weights and penalties below | Draft; human Gate-C decision required |
| Nine PNGs in this directory | Candidate review evidence, not approved goldens |
| Automated assertions and JSON projections | Test facts, not optical approval |
| Public landing and legacy score | Outside this change; unchanged and not integrated |

The approved Gate-B values remain recorded in
[`../gate-b/2026-08-15-gate-b-calibration-review.md`](../gate-b/2026-08-15-gate-b-calibration-review.md).
The exact draft payload reviewed here is
[`gate-c-draft-configuration.json`](gate-c-draft-configuration.json).

## Requested human decision

Review the candidate images and exact numeric proposals below, then record one of:

1. **Approve exactly as proposed** — authorizes a later, separate promotion of the
   listed Gate-C values and candidate selection according to the canonical workflow.
2. **Approve with named changes** — identify every replacement value or visual
   adjustment; new deterministic evidence must be captured before promotion.
3. **Changes required** — keep task `7.7` incomplete and repeat the affected
   Gate-C review surfaces.

**Recommendation (not approval):** accept the current renderer-token and Composer
weight sets as the v0.1 isolated-system candidate. They keep a visible hierarchy
between staff/stem/beam strokes, make ledgers occasional without forbidding them,
and give the four profiles visibly different but still whitelisted material. This
recommendation does not include final landing ScorePath coordinates or cross-host
golden selection.

## Candidate visual evidence

| Artifact | Review surface | Size | Status |
|---|---|---:|---|
| [`01-motif-matrix-light.png`](01-motif-matrix-light.png) | 13 motifs × straight/arc/S, light | `1448×2229` | candidate |
| [`02-motif-matrix-dark.png`](02-motif-matrix-dark.png) | 13 motifs × straight/arc/S, dark | `1448×2229` | candidate |
| [`03-key-signatures-light.png`](03-key-signatures-light.png) | fifths `-7..+7`, barlines, light | `1456×1723` | candidate |
| [`04-key-signatures-dark.png`](04-key-signatures-dark.png) | fifths `-7..+7`, barlines, dark | `1456×1723` | candidate |
| [`05-composer-fixed-seeds-light.png`](05-composer-fixed-seeds-light.png) | 3 seeds × 4 profiles, light | `1448×784` | candidate |
| [`06-composer-fixed-seeds-dark.png`](06-composer-fixed-seeds-dark.png) | 3 seeds × 4 profiles, dark | `1448×784` | candidate |
| [`07-responsive-horizontal-desktop.png`](07-responsive-horizontal-desktop.png) | explicit horizontal geometry | `1448×413` | candidate |
| [`08-responsive-vertical-mobile.png`](08-responsive-vertical-mobile.png) | same semantics, vertical mobile geometry | `350×2618` | candidate |
| [`09-reduced-motion-static.png`](09-reduced-motion-static.png) | same semantics, dark/reduced/static | `350×2698` | candidate |

The screenshots were captured by
`node scripts/capture-music-gate-c-evidence.mjs` against the loopback development
harness. The capture environment is the local, noncanonical Ubuntu host recorded in
[`validation/2026-08-17-environment.log`](validation/2026-08-17-environment.log):
Linux/Ubuntu x86_64, Node `24.18.0`, pnpm `11.18.0`, Playwright `1.62.0`, and
Next.js `16.2.12`. These files are deliberately separate from `tests/visual` and
must not be treated as cross-host approved goldens.

[`SHA256SUMS.txt`](SHA256SUMS.txt) seals every other file in this Gate-C
evidence directory (including nested validation logs); the checksum file itself
is intentionally excluded from its own manifest.

## Automated coverage facts

### Motif and ScorePath matrix

- The matrix contains exactly `39` cases: all `13` automatic motif IDs on each
  of `straight`, `gentle-arc`, and `gentle-s` ScorePaths.
- Motifs covered: `Q1`, `Q2`, `Q3`, `Q4`, `H1`, `H2`, `W1`, `E8_E8`,
  `E8_TRIPLET_3`, `S16_S16_S16_S16`, `E8_S16_S16`, `S16_S16_E8`, and
  `S16_E8_S16`.
- All `18` beamed cases (six beamed topologies × three paths) materialize the
  required primary/secondary/hook roles. Both curved `S16_E8_S16` cases contain
  left and right secondary hooks.
- All three triplet cases contain exactly three eighth notes, a bracket, and a
  centered `3`; both curved triplets satisfy the configured clearance.
- Each motif preserves the same durations, staffSteps, normalized `t` positions,
  contour ID, and uniform contour translation across all three geometries.
- The fixture-only numeric guard for exact curved-tuplet boundary comparison is
  `1e-9 staffSpace` (`1.6e-8 px` at the lab's 16 px staffSpace). It is not an
  engraving proposal and produces no visible offset.

The visual matrix uses a `16 px` development-only staffSpace. Its ScorePath fixtures
are evidence shapes, not proposed landing layout coordinates:

| Shape | Exact fixture guide |
|---|---|
| Straight | `P0=(40,140)`, `P1=(1240,140)` |
| Gentle arc | `P0=(40,150)`, `C1=(360,82)`, `C2=(920,82)`, `P1=(1240,150)` |
| Gentle S | `P0=(40,140)`, `C1=(360,72)`, `C2=(920,208)`, `P1=(1240,140)` |

All use an explicit pitch-increasing orientation reference. The beam axis follows
the local ScorePath tangent at the motif midpoint and intersects each note-local
normal; there is no separate numeric slope-limit token in this candidate.
Horizontal-only beams were considered, but would visually detach curved groups from
their staff. A different final landing slope policy remains possible, but would need
new fixtures and visual review.

### Key signatures and barlines

- All `15` fifths values from `-7` through `+7` are present.
- Nonzero fifths configure exactly one renderer-owned key signature; `fifths=0`
  configures none. The complete matrix renders `56` accidental glyph instances.
- Every case renders an ordinary barline followed by ordered final-barline primitives
  `thin`, `gap`, `thick`.
- In this isolated review fixture the clef is at `t=0.05`, a nonzero key signature
  is at `t=0.14`, and the first note is at `t=0.32`. These structural positions
  demonstrate order and single occurrence; they are not final landing coordinates.
- Twelve fixed Composer cases were recursively inspected and contained zero
  `keySignature` or `fifths` fields. Ownership remains renderer-authored outside
  the Composer.

### Fixed-seed Composer matrix

The machine-readable record is
[`gate-c-composer-fixed-seeds.json`](gate-c-composer-fixed-seeds.json). Each case
contains six populated semantic slots plus the unchanged empty reserved-transition
slot. Hashes are versioned FNV-1a hashes of the canonical semantic projection.

| Seed | CALM | BALANCED | ACTIVE | TERMINAL |
|---|---|---|---|---|
| `origin` | `fnv1a32-v1-a3b59d21` | `fnv1a32-v1-57efa235` | `fnv1a32-v1-ba51ae4c` | `fnv1a32-v1-b639ebff` |
| `flight` | `fnv1a32-v1-9afa76b2` | `fnv1a32-v1-92ebd37e` | `fnv1a32-v1-46d3d40c` | `fnv1a32-v1-b8706c1e` |
| `return` | `fnv1a32-v1-6ea83d8b` | `fnv1a32-v1-95b7e08d` | `fnv1a32-v1-0dec3074` | `fnv1a32-v1-d5b5a09a` |

All `12/12` hashes are distinct. Each profile has three distinct hashes and at
least two distinct motif/pitch signatures, demonstrating controlled seeded variation
without changing the whitelist or deterministic contract.

### Semantic stability

[`gate-c-semantic-stability.json`](gate-c-semantic-stability.json) records the
baseline projection hash
`sha256-v1-bfa4670f53bec3038417ea3159b9e74f176e0892062b78062421b8ba9e4f6340`.
That exact hash remains equal in all six contexts:

- horizontal desktop;
- vertical desktop;
- actual `390×844` mobile resize with vertical geometry;
- dark theme;
- reduced motion;
- reload with the same semantic inputs.

This proves semantic equality in the isolated Visual Lab's explicit geometry
mapping. It does not claim that the new system is wired to public landing
breakpoints; that integration is forbidden in this change.

### Performance instrumentation

[`gate-c-performance.json`](gate-c-performance.json) uses instrumentation schema
`memo-result-commit-v1`. Counters and matching Performance API marks measure
**committed memo-result identities and React commits**, not speculative render-phase
invocations.

| Action | Composition delta | Geometry delta | React-commit delta | Result |
|---|---:|---:|---:|---|
| Scroll + five animation frames | `0` | `0` | `0` | no scroll-bound work |
| Theme control change | `0` | `0` | `1` | presentation only |
| Reduced-motion media change | `0` | `0` | `0` in captured step | semantics/geometry unchanged |
| Explicit viewport geometry control | `0` | `1` | `1` | remap only |
| Semantic seed input change | `1` | `1` | `1` | expected recompose/remap |

Actual window resize in the isolated harness also preserves semantic composition.
The instrumentation is proof of the stated commit boundaries, not a browser profiler
claim about all incidental engine work.

### Accessibility

The Gate-C accessibility suite covers all eight development routes with axe WCAG
2 A/AA, 2.1 A/AA, and 2.2 AA rules, including critical/serious violations and the
`aria-hidden-focus` incomplete check. It also covers:

- ordinary accessible labels on calibration and Composer controls;
- keyboard focus order for seed, chapter, profile, theme, viewport, and debug;
- decorative ScoreSvg defaults and unfocusable debug overlays;
- forced-colors control visibility/focus;
- `390×844` dark, vertical, reduced-motion presentation.

The final accessibility-only execution passed `37/37` applicable checks across
Chromium, Firefox, and WebKit, with two expected skips because forced-colors evidence
is Chromium-only. The combined final Visual Lab E2E/accessibility execution passed
`61` checks with five expected skips and zero failures. The retained initial
three-engine log records `57` passed, `5` skipped, and four Firefox/WebKit contrast
failures; those findings led to decorative composer SVG semantics, explicit inherited
semantic-JSON color, and contrast-safe debug colors (`#9f1239` on light and
`#fda4af` on dark). Axe remained strict and no finding was suppressed.

### Composer stress test

[`validation/2026-08-17-composer-stress.log`](validation/2026-08-17-composer-stress.log)
records `10,000` generated segments and the following exact counters:

| Counter | Result |
|---|---:|
| generated segments | `10000` |
| illegal motifs | `0` |
| illegal rhythmic groupings | `0` |
| invalid triplets | `0` |
| unseeded `Math.random()` calls | `0` |
| out-of-range pitches | `0` |
| immediate motif repetitions | `0` |
| nondeterminism | `0` |
| reserved-zone violations | `0` |
| key-signature mutations | `0` |
| contour mutations | `0` |
| terminal-grammar violations | `0` |
| pitch-run violations | `0` |
| identity violations | `0` |

## Exact draft renderer proposal

All dimensions below are in `staffSpace` (`Sp`) units. Every row is
`draft-human-review-pending` unless explicitly identified as inherited Gate B.

### Notes, accidentals, ledgers, stems, and flags

| Token | Proposed value | Rationale | Alternatives and consequences |
|---|---:|---|---|
| `accidentalGapSp` | `0.25` | Gives accidentals a clear quarter-space separation while keeping a compact note cluster. | Smaller risks optical contact; larger improves air but expands signatures and isolated clusters. |
| `ledgerLineExtensionSp` | `0.25` | Extends each ledger visibly past both notehead sides without turning it into a miniature staff line. | Smaller can disappear at low scale; larger adds visual weight and crowding. |
| `ledgerLineThicknessSp` | `0.08` | Slightly stronger than the staff line while remaining subordinate to stems/beams. | `0.06` would match the staff but be fragile; a heavier line competes with the notehead. |
| `stemLengthSp` | `3.5` | Provides sufficient flag/beam reach across line and space cases. | Shorter is compact but cramps beams; longer creates excessive vertical dominance. |
| `stemThicknessSp` | `0.10` | Keeps stems legible at the tested scales without matching beam mass. | Thinner is fragile; thicker intrudes into approved noteheads and flags. |

The flag transforms are not new Gate-C proposals. They inherit the Gate-B-approved
geometry unchanged:

```json
{
  "up": { "mirrorX": false, "mirrorY": false, "rotationRadians": 0 },
  "down": { "mirrorX": false, "mirrorY": true, "rotationRadians": 0 }
}
```

The down transform was explicitly externally approved at Gate B. Gate C may review
its use in complete compositions but must not alter it without reopening the asset
approval boundary.

### Beams and hooks

| Token | Proposed value | Rationale | Alternatives and consequences |
|---|---:|---|---|
| `thicknessSp` | `0.45` | Makes the primary beam the strongest linear rhythmic primitive. | Thinner weakens grouping; thicker overwhelms noteheads on curved fixtures. |
| `secondaryThicknessSp` | `0.38` | Preserves a visible hierarchy below the primary beam. | Equal thickness is more uniform but loses hierarchy; thinner is more delicate but fragile. |
| `secondaryGapSp` | `0.65` | Separates beam levels clearly while keeping sixteenth groups cohesive. | Smaller can merge levels; larger makes one group read as disconnected lines. |
| `hookLengthSp` | `0.80` | Makes both `S16_E8_S16` hooks unmistakable without resembling a complete secondary beam. | Shorter risks ambiguity; longer falsely implies continuity through the middle eighth. |

The current beam-axis policy follows the midpoint local tangent. Alternatives
considered were a globally horizontal axis (stable but disconnected from curved
staffs) and independently local axes (path-coherent per note but not a coherent beam
group). The midpoint policy is recommended for this isolated v0.1 candidate; final
landing path tuning is not included.

### Triplets

| Token | Proposed value | Rationale | Alternatives and consequences |
|---|---:|---|---|
| `bracketClearanceSp` | `0.65` | Keeps the bracket/`3` visibly separate from the primary beam in both stem directions and curved cases. | Smaller crowds the beam; larger disconnects the label from its group. |
| `bracketEndCapSp` | `0.30` | Gives the bracket ends enough shape to be recognizable without enclosing the motif. | Shorter is faint; longer becomes box-like. |
| `bracketThicknessSp` | `0.07` | Keeps the bracket close to staff-line weight and below beam weight. | Thinner is fragile; thicker competes with the beam and numeral. |

The label position is deterministically the bracket midpoint; there is no separate
numeral-offset token in this candidate. Introducing one would increase tuning freedom
but also add a new approval dimension and more curved-path failure cases.

### Staff, key signatures, and barlines

| Token | Proposed value | Rationale | Alternatives and consequences |
|---|---:|---|---|
| `staffLineThicknessSp` | `0.06` | Keeps all five lines present but visually behind notes and beams. | Thinner is fragile at reduced scale; thicker makes dense groups muddy. |
| `barlineThicknessSp` | `0.11` | Gives an ordinary barline clear structural weight above staff lines. | Matching the staff is too weak; heavier competes with the final barline. |
| `finalBarlineThinThicknessSp` | `0.11` | Matches the ordinary structural stroke. | A different thin stroke adds an unnecessary third hierarchy. |
| `finalBarlineGapSp` | `0.30` | Separates thin and thick strokes without visually splitting the terminator. | Smaller can merge; larger reads as two unrelated barlines. |
| `finalBarlineThickThicknessSp` | `0.28` | Creates an unambiguous terminal accent while remaining below notehead mass. | Thinner weakens closure; thicker dominates the score endpoint. |
| `keySignatureGapSp` | `0.18` | Maintains deterministic breathing room between adjacent accidental bounds. | Smaller risks collision, especially flats; larger makes high-fifths signatures too wide. |
| `keySignatureStartOffsetSp` | `0.50` | Separates the first key accidental from the configured origin point/preceding clef region. | Smaller compresses clef/key spacing; larger delays rhythmic material and consumes the origin zone. |

The alternative of fixed pixel spacing was rejected because it would not scale with
staffSpace. The fixture `t` positions prove order and cardinality only; clef-to-key
and key-to-first-note landing distances still require a later landing-specific
layout decision.

## Exact draft Composer proposal

All values in this section are `draft-human-review-pending`. Zero motif weights in
`TERMINAL` implement the already-governed terminal whitelist; the exact nonzero
weight magnitudes remain part of this Gate-C decision.

### Motif weights

| Motif | CALM | BALANCED | ACTIVE | TERMINAL |
|---|---:|---:|---:|---:|
| `Q1` | `4` | `2` | `0.8` | `4` |
| `Q2` | `4` | `3` | `1.2` | `4` |
| `Q3` | `1.8` | `2.5` | `1.4` | `0` |
| `Q4` | `0.8` | `1.5` | `1.8` | `0` |
| `H1` | `4` | `2` | `0.5` | `4` |
| `H2` | `3` | `1.8` | `0.5` | `4` |
| `W1` | `3` | `1` | `0.2` | `4` |
| `E8_E8` | `1.5` | `3` | `3` | `0` |
| `E8_TRIPLET_3` | `0.35` | `1.5` | `3` | `0` |
| `S16_S16_S16_S16` | `0.15` | `1` | `3` | `0` |
| `E8_S16_S16` | `0.20` | `1.5` | `3` | `0` |
| `S16_S16_E8` | `0.20` | `1.5` | `3` | `0` |
| `S16_E8_S16` | `0.20` | `1.5` | `3` | `0` |

Rationale by profile:

- **CALM:** strongly favors one/two-note quarter, half, and whole motifs; keeps an
  occasional eighth pair while making triplet/sixteenth/mixed density rare.
- **BALANCED:** distributes weight across simple and linked material, with `Q2` and
  `E8_E8` as stable anchors rather than making every topology equally frequent.
- **ACTIVE:** assigns all linked/dense forms weight `3`, retains some quarter motion,
  and makes long values uncommon but still possible outside terminal slots.
- **TERMINAL:** gives equal nonzero weight only to `Q1`, `Q2`, `H1`, `H2`, and `W1`;
  every forbidden terminal motif has exact weight `0`.

Alternatives considered were equal weights (simpler but profiles become visually
indistinct), stronger profile polarization (clearer contrast but repetitive and less
natural), and forbidding long values in ACTIVE (more energetic but removes useful
breathing space). The displayed weights are the recommended middle candidate.

### Pitch-contour weights (all four profiles)

| Contour | Weight |
|---|---:|
| `alternating` | `1` |
| `arch` | `1.2` |
| `repeat-then-step` | `0.8` |
| `small-leap-down` | `0.65` |
| `small-leap-up` | `0.65` |
| `step-down` | `1.2` |
| `step-up` | `1.2` |
| `valley` | `1.2` |

Steps and simple arches/valleys are mildly favored; repetition and leaps remain
available but less common. Equal weights would increase leap/repeat incidence and
flatten the contour character. Lower leap weights would be calmer but reduce visible
variation. The contour tables, complete-shape preservation, and uniform-translation
boundary rule remain versioned hard semantics and are not modified by these weights.

### Pitch-anchor weights (all four profiles)

| staffSteps | Weight per position |
|---|---:|
| `-2`, `-1`, `9`, `10` | `1` |
| `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8` | `4` |

This favors the optical `E4..F5` range by four to one per candidate anchor while
retaining occasional `C4`, `D4`, `G5`, and `A5`. Zeroing the outer weights would
eliminate governed ledger variety; using equal weights would make edge/ledger
positions substantially more frequent. Actual selection also depends on contour
fit and deterministic candidate filtering.

### Note-count weights by slot density (all four profiles)

| Density | 1 note | 2 notes | 3 notes | 4 notes |
|---|---:|---:|---:|---:|
| `sparse` | `1.5` | `0.9` | `0.45` | `0.25` |
| `normal` | `1` | `1` | `1` | `1` |
| `dense` | `0.5` | `0.9` | `1.25` | `1.5` |

The weights make slot density semantically meaningful without prohibiting any count
that the whitelist permits. Equal weights would erase the density signal; stronger
extremes would improve immediate differentiation but make sparse/dense slots more
predictable and repetitive.

### Anti-repetition multipliers

| Profile | Dense-after-dense multiplier | Third-same-family multiplier |
|---|---:|---:|
| `CALM` | `0.35` | `0.25` |
| `BALANCED` | `0.35` | `0.25` |
| `ACTIVE` | `0.55` | `0.25` |
| `TERMINAL` | `0.35` | `0.25` |

These values multiply candidate weights when the soft condition applies; therefore a
smaller number is a stronger suppression. ACTIVE's `0.55` permits more consecutive
density while still discounting it. Removing the penalties (`1`) increases rhythmic
clumping; stronger penalties near zero improve alternation but make the seeded output
more mechanically patterned.

## Validation ledger

| Check | Current result | Evidence |
|---|---|---|
| Locked dependency validation | PASS; all dependencies exact | [`validation/2026-08-17-dependency-validation.log`](validation/2026-08-17-dependency-validation.log) |
| Lint | PASS; zero warnings | [`validation/2026-08-17-lint.log`](validation/2026-08-17-lint.log) |
| TypeScript | PASS; route type generation + `tsc --noEmit` | [`validation/2026-08-17-typecheck.log`](validation/2026-08-17-typecheck.log) |
| Unit tests | PASS; `59` files, `500` tests | [`validation/2026-08-17-unit-tests.log`](validation/2026-08-17-unit-tests.log) |
| Import/public boundaries | PASS; `2` files, `3` tests; legacy isolation pass | [`validation/2026-08-17-boundary-tests.log`](validation/2026-08-17-boundary-tests.log), [`validation/2026-08-17-public-source-isolation.log`](validation/2026-08-17-public-source-isolation.log) |
| Composer stress | PASS; `1` file, `11` tests; `10,000` segments, every violation counter zero | [`validation/2026-08-17-composer-stress.log`](validation/2026-08-17-composer-stress.log) |
| Storybook static build | PASS | [`validation/2026-08-17-storybook-build.log`](validation/2026-08-17-storybook-build.log) |
| Storybook test project | PASS; `13` files, `63` tests. The unchanged command required `CHOKIDAR_USEPOLLING=1` after two retained host watcher-limit diagnostics | [`validation/2026-08-17-storybook-tests.log`](validation/2026-08-17-storybook-tests.log), [`validation/2026-08-17-storybook-tests-initial-enospc.log`](validation/2026-08-17-storybook-tests-initial-enospc.log), [`validation/2026-08-17-storybook-tests-second-enospc.log`](validation/2026-08-17-storybook-tests-second-enospc.log) |
| Development Visual Lab browser + accessibility | PASS across Chromium/Firefox/WebKit; `61` passed, `5` expected skips, zero failures | [`validation/2026-08-17-dev-lab-browser.log`](validation/2026-08-17-dev-lab-browser.log) |
| Accessibility, three engines | PASS; `37` applicable tests, `2` expected non-Chromium forced-colors skips; axe remained unsuppressed | [`validation/2026-08-17-dev-lab-browser.log`](validation/2026-08-17-dev-lab-browser.log), [`validation/2026-08-17-dev-lab-browser-initial-failure.log`](validation/2026-08-17-dev-lab-browser-initial-failure.log) |
| Production Next.js build | PASS with documented transition and Turnstile test-harness compile-time inputs; standalone prepared | [`validation/2026-08-17-production-build.log`](validation/2026-08-17-production-build.log), [`validation/2026-08-17-prepare-standalone.log`](validation/2026-08-17-prepare-standalone.log) |
| Production Visual Lab 404 guard | PASS; every one of eight routes returned 404 in Chromium, Firefox, and WebKit (`3/3` tests) | [`validation/2026-08-17-production-lab-404.log`](validation/2026-08-17-production-lab-404.log) |
| Public functional regression | PASS; `153/153` tests across Chromium, Firefox, and WebKit for Home, navigation, legacy score continuity, contact, and application demo | [`validation/2026-08-17-public-regression.log`](validation/2026-08-17-public-regression.log) |
| Existing visual-snapshot diagnostic | Noncanonical-host diagnostic: `7` passed and the same five known comparisons differed by `8..26` pixels; no snapshot was updated | [`validation/2026-08-17-visual-diagnostic.log`](validation/2026-08-17-visual-diagnostic.log) |
| Strict focused OpenSpec validation | PASS; `1/1`, zero issues | [`validation/2026-08-17-openspec-strict-validation.log`](validation/2026-08-17-openspec-strict-validation.log) |
| Graphify structural update/query | PASS; refreshed to `4,263` nodes, `6,866` edges, `427` communities. No path exists from `SiteExperienceShell()` to `ScoreSvg()` or from `composeSegment()` to `SiteExperienceShell()` | [`validation/2026-08-17-graphify-update.log`](validation/2026-08-17-graphify-update.log), [`validation/2026-08-17-graphify-isolation-paths.log`](validation/2026-08-17-graphify-isolation-paths.log) |

The empty capture-script syntax and format-diff logs represent successful zero-output
checks. Initial failure logs are preserved as diagnostic history; they are not being
misrepresented as final passes. The failed production-regression diagnostics record
missing compile-time test-harness inputs; the same unchanged regression suite passed
after rebuilding with the documented transition and public Turnstile test values.

## Immutable-baseline comparison

| Baseline | Pre-Gate-C aggregate | Pre count | Post-Gate-C aggregate | Post count |
|---|---|---:|---|---:|
| Approved source/runtime SVG files | `38ad23abbd642bac57bae9781f66124a46efde90b2921de2c0811966d93bab65` | `16/16` | `38ad23abbd642bac57bae9781f66124a46efde90b2921de2c0811966d93bab65` | `16/16` |
| Existing committed visual snapshots | `ba4f23c08613c1c1c9a1481fa6d8466dd7bfa0641cf3b6ae898424966ccc6b63` | `84/84` | `ba4f23c08613c1c1c9a1481fa6d8466dd7bfa0641cf3b6ae898424966ccc6b63` | `84/84` |

Preflight files:

- [`2026-08-17-gate-c-preflight.md`](2026-08-17-gate-c-preflight.md)
- [`2026-08-17-pre-gate-c-approved-svg-files.sha256`](2026-08-17-pre-gate-c-approved-svg-files.sha256)
- [`2026-08-17-pre-gate-c-committed-snapshots.sha256`](2026-08-17-pre-gate-c-committed-snapshots.sha256)
- [`2026-08-17-post-gate-c-approved-svg-files.sha256`](2026-08-17-post-gate-c-approved-svg-files.sha256)
- [`2026-08-17-post-gate-c-committed-snapshots.sha256`](2026-08-17-post-gate-c-committed-snapshots.sha256)
- [`validation/2026-08-17-immutable-post-check.log`](validation/2026-08-17-immutable-post-check.log)

The capture process and the independent final comparison both assert that all 16 SVG
files and all 84 pinned snapshots are byte-identical. `git diff --exit-code --
tests/visual` also returned zero. The five host-specific visual comparison failures
therefore did not alter or authorize alteration of any committed snapshot.

## Pending human decisions

The external reviewer must explicitly decide:

1. every draft renderer token in the four tables above;
2. the midpoint-local-tangent beam-axis policy and its appearance on straight,
   gentle-arc, and gentle-S evidence;
3. primary/secondary beam hierarchy, spacing, and mixed-hook readability;
4. triplet clearance/end caps/thickness and centered numeral presentation;
5. key-signature accidental spacing and origin offset in the isolated fixture;
6. ordinary/final barline hierarchy and terminal spacing;
7. all four motif-weight profiles;
8. common contour, pitch-anchor, density, and anti-repetition weights;
9. whether the nine PNGs are sufficient candidate evidence for this isolated v0.1
   decision (they are not automatically cross-host goldens).

Not requested for approval here: public landing integration, final landing
ScorePath control points, legacy-score removal, canonical cross-host snapshots, or
any later-phase motion/layout behavior.

## Stop condition

Gate C remains pending. Automated work and evidence for tasks `7.1` through `7.6`
are complete. OpenSpec task `7.7` must stay unchecked until an external human
decision is recorded. No canonical tuning promotion, landing integration, later
phase, snapshot update, push, merge, or deployment is authorized by this bundle.
