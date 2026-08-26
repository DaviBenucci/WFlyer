# W_Flyer Music System v0.1 — Implementation Contract

**Status:** NORMATIVE / APPROVED  
**Date:** 2026-08-14  
**Amended:** 2026-08-17 — external Gate-C review responsive projection and triplet-legibility clarification
**Scope:** isolated Music Renderer, Procedural Score Composer, and Music Visual Lab  
**Canonical language:** English

## 1. Objective

Implement an isolated, deterministic, testable musical rendering system that can later replace the legacy decorative score implementation without changing the main landing in this change.

The system SHALL make the score feel alive and newly written between sessions while remaining a controlled assembly of approved glyphs, whitelisted rhythmic motifs, deterministic geometry, and seeded pitch contours.

## 2. Hard scope boundary

### In scope

- normalized musical SVG assets from `docs/design-reference/visual-library` and `src/assets/visuals/musical`;
- pure TypeScript geometry primitives;
- glyph registry and metric/anchor model;
- straight and cubic-Bézier `ScorePath` implementations;
- note, stem, ledger-line, accidental, key-signature, beam, beam-hook, triplet, barline, and final-barline geometry;
- renderer model + SVG presentation components;
- deterministic versioned PRNG;
- whitelisted procedural motif composer;
- semantic composition slots and reserved zones;
- dev-only Music Visual Lab;
- unit, stress, accessibility, and deterministic visual evidence.

### Out of scope

- replacing `src/components/music/*` on the landing;
- changing the main Home or chapter layout;
- implementing final branch Score Path Layouts;
- GSAP story integration;
- header traversal;
- Persona;
- project cards;
- APP-04 tablet/video migration;
- changing public copy/routes;
- deploy/infrastructure changes.

## 3. Module architecture

```text
Approved SVG glyphs
        |
        v
Glyph Registry + calibrated metrics/anchors
        |
        v
Pure Geometry Core <---- ScorePath
        |
        v
Renderer Model
        |
        +--------------------+
        |                    |
        v                    v
React/SVG presentation   Visual Lab debug overlay
        ^
        |
Procedural Score Composer
        ^
        |
session seed + composer version + chapter profile + semantic slots
```

### Required code boundaries

```text
src/lib/music/geometry/    # pure TypeScript, no React/DOM
src/lib/music/glyphs/      # registry, metrics, anchors, validation types
src/lib/music/renderer/    # pure render models, no React
src/lib/music/composer/    # pure deterministic composition, no React/DOM
src/components/score/      # React/SVG presentation only
src/app/%5F_visual-lab/music # filesystem escape for /__visual-lab; development-only UI
```

Pure modules MUST NOT import React, `window`, `document`, GSAP, or browser SVG APIs.

## 4. Canonical units and pitch system

- `staffSpace`: distance between adjacent staff lines.
- `staffStep = 0.5 * staffSpace`: one diatonic line/space step.
- Regular treble-staff line steps are `[0, 2, 4, 6, 8]`.
- `E4 = 0`, `G4 = 2`, `B4 = 4`, `F5 = 8`.
- Landing composer range: `C4 (-2)` through `A5 (10)`.
- Preferred landing range: `E4 (0)` through `F5 (8)`.

Reference mapping:

```text
C4=-2 D4=-1 E4=0 F4=1 G4=2 A4=3 B4=4
C5=5 D5=6 E5=7 F5=8 G5=9 A5=10
```

No pitch SHALL be represented by a hard-coded pixel `y` value in the pure music model.

## 5. ScorePath and local frame

```ts
interface ScorePath {
  pointAt(t: number): Vec2;
  tangentAt(t: number): Vec2;
  normalAt(t: number): Vec2;
}
```

`0 <= t <= 1`.

v0.1 MUST provide:

- `StraightScorePath`;
- `CubicBezierScorePath`.

Every placed musical element derives from a local frame:

```text
P = pointAt(t)
T = normalized tangentAt(t)
N = normalized normalAt(t)
```

Staff offsets and pitch offsets use `N`; ledger-line width and score progression use `T`. The five staff lines are coherent offsets of one master guide, not five independently authored curves.

`P` is the logical staff master guide and coincides with the visible middle staff line, `B4 / staffStep 4`. The guide does not replace or remove that visible line. `N` always points toward increasing pitch independently of path traversal direction, so reversing a branch path does not invert pitch placement.

```text
pitchOffset = (staffStep - 4) * (staffSpace / 2)
```

The visible staff-line offsets from the master guide are therefore `-2, -1, 0, +1, +2 staffSpaces` for staffSteps `0, 2, 4, 6, 8`.

## 6. Renderer-owned primitives

The renderer SHALL generate:

- five staff lines;
- stems;
- ledger lines;
- primary beams;
- secondary beams;
- forward/backward beam hooks;
- ordinary barlines;
- final barline: thin + configured gap + thick;
- deterministic key-signature positioning and spacing.

Legacy SVGs for staff, stem, beam, or master guide are not runtime authorities.

## 7. Designer-owned glyphs

The renderer SHALL consume, not redraw:

- `wf-music-treble-clef`;
- `wf-music-notehead-filled`;
- `wf-music-notehead-open`;
- `wf-music-accidental-sharp`;
- `wf-music-accidental-flat`;
- `wf-music-accidental-natural`;
- `wf-music-eighth-flag`;
- `wf-music-sixteenth-double-flag`.

Glyph paths are immutable unless explicit human reapproval occurs.

## 8. Required glyph calibration

### Treble clef
- `gLine` anchor.
- staff-space-relative nominal width/height.

### Filled/open noteheads
- `opticalCenter`;
- `stemUp` anchor;
- `stemDown` anchor;
- nominal width/height.

### Accidentals
- `pitchCenter`;
- nominal width/height.

### Flags
- `stemAttachment`;
- nominal width/height.

Codex MAY propose values as `draft-calibration`. Codex MUST NOT set `runtimeStatus=approved` without human review.

## 9. Ledger-line contract

Above staff:

```text
G5 9  -> []
A5 10 -> [10]
B5 11 -> [10]
C6 12 -> [10,12]
D6 13 -> [10,12]
E6 14 -> [10,12,14]
```

Below staff:

```text
D4 -1 -> []
C4 -2 -> [-2]
B3 -3 -> [-2]
A3 -4 -> [-2,-4]
```

Ledger width SHALL be `notehead.nominalWidth + 2 * ledgerLineExtension`. It is centered on the notehead and extends along local tangent `T`. Only required ledger lines are rendered.

## 10. Stem-direction contract

### Isolated notes

- `staffStep < 4` -> `UP`;
- `staffStep >= 4` -> `DOWN`;
- explicit override is allowed only through a documented model field, never ad-hoc component logic.

### Beamed groups — approved Option B

1. `balance = sum(staffStep - 4)`.
2. `balance < 0` -> `UP`.
3. `balance > 0` -> `DOWN`.
4. If zero, compare farthest absolute extreme below vs above B4.
5. Farthest below -> `UP`; farthest above -> `DOWN`.
6. If perfectly symmetric -> `DOWN`.

All stems in a beam group use one direction.

## 11. Rhythmic whitelist

### Simple motifs

- quarter-note groups: `Q1`, `Q2`, `Q3`, `Q4`;
- half-note groups: `H1`, `H2`;
- whole-note motif: `W1`.

Simple groups are un-beamed and may be absent from a chapter depending on the seeded profile.

### Beamed motifs

- `E8_E8`;
- `E8_TRIPLET_3`;
- `S16_S16_S16_S16`;
- `E8_S16_S16`;
- `S16_S16_E8`;
- `S16_E8_S16`.

No other automatic beamed grouping is permitted in v0.1.

### Triplet

`E8_TRIPLET_3` SHALL always contain exactly three eighth notes, one primary beam,
a visible tuplet bracket, and a centered `3`. Three linked eighth notes without
the triplet marker are invalid.

The numeral SHALL:

- use score foreground/`currentColor`;
- be centered from the complete group bounding span;
- remain external to the primary beam;
- remain valid for UP/DOWN stems and straight/gentle-arc/gentle-S ScorePaths;
- overlap neither the primary beam nor bracket.

The horizontal bracket SHALL be split around the numeral. Its central gap is:

```text
renderedNumeralWidth + 2 * tupletNumeralSideGapSp
```

Final external human Gate-C review on 2026-08-24 approved
`tupletNumeralSizeSp=0.85`, `tupletNumeralSideGapSp=0.18`,
`bracketClearanceSp=0.65`, `bracketEndCapSp=0.30`, and
`bracketThicknessSp=0.07`. The `0.75` numeral-size candidate is superseded.

### Mixed sixteenth hooks

`S16_E8_S16` SHALL use a full primary beam plus two local secondary hooks. A secondary beam MUST NOT pass through the middle eighth note.

## 12. Key-signature contract

Key signatures are configured by the continuous score, never by the procedural composer.

```ts
type Fifths = -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
```

Treble-clef sharp steps:

```text
[8,5,9,6,3,7,4]
```

Treble-clef flat steps:

```text
[4,7,3,6,2,5,1]
```

Each continuous branch score SHALL contain at most one key-signature occurrence, near its origin after the clef and before first relevant rhythmic material. `fifths=0` renders no key signature. Key signatures never repeat per chapter/segment and never vary with session seed.

## 13. Procedural composer

The composer SHALL be deterministic and versioned.

```text
semanticScore = compose(
  composerVersion,
  sessionSeed,
  branchId,
  chapterId,
  semanticSlots,
  profile
)
```

### Seed rules

- initial production session seed uses `crypto.getRandomValues`;
- seed is retained in `sessionStorage` for the browser session;
- chapter sub-seeds are derived from session seed + composer version + stable chapter ID;
- explicit seed injection exists for tests/dev lab;
- `Math.random()` is prohibited in composition code;
- changing PRNG behavior requires a new composer version.

A small internal hash + PRNG is preferred over adding a dependency.

### Responsive stability

`horizontal-enhanced`, `vertical-wide`, `vertical-compact`, and `static` ScorePath
layouts share semantic slot IDs. For the same composer version, session seed,
branch, chapter, semantic slots, and configuration, every mode preserves motif
IDs/order, durations, staffSteps, contour IDs/translations, reserved slots, and
key-signature configuration. Geometry and physical grouping may change;
semantic composition may not.

## 14. Composer profiles

Profiles:

- `CALM`;
- `BALANCED`;
- `ACTIVE`;
- `TERMINAL`.

The exact v0.1 motif weights in the Gate-C configuration were accepted by the
2026-08-24 external human follow-up review. Any later change requires a new
explicit calibration decision and Composer version review.

Initial intended chapter character:

```text
professional/about      CALM
professional/services   BALANCED
professional/process    ACTIVE
professional/projects   ACTIVE
professional/contact    CALM

application/overview    BALANCED
application/how         ACTIVE
application/benefits    BALANCED
application/demo        ACTIVE
application/access      CALM
```

Terminal slots accept only controlled low-density simple motifs before the final barline.

## 15. Anti-repetition and pitch-contour rules

Hard requirements:

- identical motif IDs never occur consecutively;
- no motif outside the whitelist;
- pitch remains within configured range;
- maximum two consecutive notes at identical staffStep;
- terminal slots reject dense beamed motifs;
- reserved zones receive no motifs.

Pitch SHALL be selected through whitelisted contours rather than independent random notes. Initial contour set:

- `step-up`;
- `step-down`;
- `arch`;
- `valley`;
- `alternating`;
- `repeat-then-step`;
- `small-leap-up`;
- `small-leap-down`.

The version-1 per-length delta table is normative (`1 = one diatonic staffStep`; `— = unsupported`):

| contour | n=1 | n=2 | n=3 | n=4 |
| --- | --- | --- | --- | --- |
| `step-up` | `[0]` | `[0,1]` | `[0,1,2]` | `[0,1,2,3]` |
| `step-down` | `[0]` | `[0,-1]` | `[0,-1,-2]` | `[0,-1,-2,-3]` |
| `arch` | — | — | `[0,1,0]` | `[0,1,1,0]` |
| `valley` | — | — | `[0,-1,0]` | `[0,-1,-1,0]` |
| `alternating` | — | — | `[0,1,-1]` | `[0,1,-1,0]` |
| `repeat-then-step` | — | — | `[0,0,1]` | `[0,0,1,2]` |
| `small-leap-up` | — | `[0,2]` | `[0,2,3]` | `[0,2,3,4]` |
| `small-leap-down` | — | `[0,-2]` | `[0,-2,-3]` | `[0,-2,-3,-4]` |

A selected contour preserves its complete interval vector. Range correction may apply only one uniform integer translation to the complete contour. It chooses the minimum-absolute translation that places every note in `-2..10`; if zero is valid, it is selected. Individual notes are never clamped, reflected, reversed, truncated, or mutated. An unfit contour is rejected deterministically and the next valid seeded candidate is evaluated. Preferred-range weighting for `0..8` is soft and cannot override these invariants.

## 16. Semantic composition slots and reserved zones

The composer never chooses free screen coordinates.

```ts
interface ScoreCompositionSlot {
  id: string;
  start: number;
  end: number;
  density: "sparse" | "normal" | "dense";
  allowedMotifFamilies: readonly RhythmFamily[];
}
```

```ts
interface ReservedScoreZone {
  start: number;
  end: number;
  reason: "persona" | "project-cards" | "tablet" | "form" | "headline" | "transition";
}
```

Visual Lab uses synthetic slots. Final landing slots are out of scope until the later Score Path Layout integration.

### Responsive ScorePath projection

Responsive mode selection SHALL be capable of considering viewport width,
viewport height, pointer/input capability, `prefers-reduced-motion`, and
effective layout capacity. Width alone is insufficient. Exact activation
thresholds remain Motion Lab calibration parameters and are not part of Gate-C
approval.

Every projected path distinguishes:

1. **notation-safe composition zones**, locally horizontal or gently inclined
   spans that read left-to-right and may contain musical events; and
2. **connector zones**, continuous five-line spans that may descend, curve,
   become steep, or return across the viewport but contain no musical events.

Only notation-safe zones may contain clefs, key signatures, noteheads, stems,
flags, beams/hooks, accidentals, tuplets, ledger lines, or barlines. A
180-degree-returning span is a connector, not a reversed notation zone.

Correct the ScorePath zoning itself. Do not counter-rotate arbitrary glyphs
independently while leaving a vertical or steep staff underneath them.

The 2026-08-24 human follow-up decision approved
`maxNotationTangentAngleDeg=18` for notation-safe zoning. Responsive activation
thresholds remain noncanonical Motion Lab calibration.

The approved treble-clef path SHALL remain byte-identical, upright, unmirrored,
unflipped, and never sideways. Its approved `gLine` anchor aligns to G4 in a
notation-safe origin zone. `normalAt()` retains pitch-increasing orientation
independently of path traversal.

The final barline SHALL occupy a notation-safe terminal zone and retain
conventional orientation: thin vertical bar + gap + thick vertical bar across a
locally horizontal staff. Vertical document progression SHALL NOT rotate it by
90 degrees.

When mode changes, the implementation preserves the active semantic chapter,
seed, and complete semantic composition; destroys only old responsive projection
ownership; builds the new projection; maps the same slots into its notation
zones; and restores the same chapter. Resize never recomposes or returns the user
to Home.

The current piecewise returning connector is retained only as a validation
fixture. It is noncanonical and is not the final mobile Score Path aesthetic.
Final `Organic Soft`/`Organic Flowing` public layouts are deferred to the
blocking Phase-9 human Score Path subgate.

## 17. React/SVG presentation contract

React components receive precomputed render models. They MUST NOT perform music-theory decisions or seeded composition. Narrative score SVGs default to `aria-hidden="true"` and `focusable="false"` because textual chapter content carries the semantic information.

Suggested presentation layer:

```text
src/components/score/ScoreSvg.tsx
src/components/score/ScoreGlyph.tsx
src/components/score/ScoreDebugOverlay.tsx
src/components/score/score.module.css
```

No React state update may occur per scroll frame. Scroll integration is not part of this change.

## 18. Music Visual Lab

Required dev-only routes:

```text
/__visual-lab/music
/__visual-lab/music/glyphs
/__visual-lab/music/calibration
/__visual-lab/music/pitches
/__visual-lab/music/beams
/__visual-lab/music/key-signatures
/__visual-lab/music/curved-score
/__visual-lab/music/composer
```

The parent lab layout MUST call `notFound()` when running as a production deployment. The lab MUST NOT appear in sitemap, public navigation, or analytics.

Next.js treats literal underscore-prefixed App Router directories as private and
non-routable. The filesystem segment therefore uses `%5F_visual-lab`, the
framework-supported escape that normalizes to the required URL segment
`__visual-lab`. This is an implementation-path exception only; the development
pathname remains exactly `/__visual-lab/music/*`.

Next.js 16 may retain the escaped `/%5F_visual-lab` spelling in generated
`.next/dev/types` while production `next typegen` correctly emits
`/__visual-lab`. The repository excludes only `.next/dev/types/**/*.ts` from the
standalone `tsc` program, matching the framework's own production-build stale-dev
type filtering; `.next/types/**/*.ts` remains authoritative and included.

Calibration controls may change metrics/anchors only in local lab state and export a proposed calibration payload. They MUST NOT silently rewrite approved source SVG paths.

## 19. Required visual fixtures

- glyph gallery at multiple scales and both themes;
- pitch ladder `C4..A5`;
- extended ledger cases `A3,B3,C4,D4,G5,A5,B5,C6,D6,E6`;
- isolated stem direction;
- eighth/sixteenth flags up/down validation;
- every whitelisted beamed motif, including `S16_E8_S16` hooks;
- triplet up/down with bracket + `3`;
- key signatures `-7..+7`;
- ordinary/final barline on straight and curved staff;
- straight score;
- gentle arc score;
- gentle S-curve score;
- Composer `CALM`, `BALANCED`, `ACTIVE`, `TERMINAL` with explicit seeds.
- triplet detail with split bracket and legible centered `3` for both stem
  directions, all three ScorePaths, and both themes;
- responsive mobile orientation showing an upright clef, a left-to-right
  notation-safe zone, an event-free steep connector, a subsequent notation-safe
  zone, quarter/half notes, a beamed motif, a triplet, a conventional final
  barline, and five continuous staff lines.

## 20. Performance/lifecycle contract

- composition: once per semantic score generation;
- geometry: once per relevant score/layout recalculation;
- no composition during scroll;
- no geometry recomputation per scroll frame;
- resize may recompute geometry but MUST reuse semantic composition;
- theme and reduced-motion changes MUST reuse semantic composition;
- no runtime network calls are required by renderer/composer;
- no new runtime dependency is required for PRNG or music geometry.

## 21. Security and robustness

- SVG sources are repository-controlled and MUST remain free of scripts, event handlers, `foreignObject`, external references, embedded remote content, and runtime HTML injection;
- do not use `dangerouslySetInnerHTML` to inject SVG source;
- use imported/local approved assets or safe component rendering;
- session seed contains no personal data and MUST NOT be logged as user identity;
- no external service is called by the music system.

## 22. Gates

### Gate A — Geometry

Required before calibration work can be considered stable:

- unit tests pass for staffStep mapping, local frames, ledger lines, stems, beams/hooks, key signatures, and barlines;
- same pure input produces exact same pure output;
- no React/DOM dependency in pure modules.

### Gate B — Human asset calibration

Required before runtime approval:

- treble-clef `gLine` approved;
- notehead optical centers + stem anchors approved;
- accidental pitch centers approved;
- flag attachment anchors approved;
- relative scales/nominal metrics approved;
- manifest updated by an explicit reviewed change.

Codex MUST STOP and request human review if this gate is reached without approved values.

### Gate C — Visual Composer

Current status: **approved by final external human review on 2026-08-24**.
The earlier 2026-08-17 `approve-with-two-named-changes` and first 2026-08-24
follow-up decisions remain historical checkpoints. Both corrections were
implemented, tested, and recaptured; the final review approved the reviewed
renderer values, Composer weights, responsive functional semantics,
`maxNotationTangentAngleDeg=18`, and the `0.85` triplet result. The connector
fixture remains validation-only and noncanonical, activation thresholds remain
noncanonical calibration, and final organic paths remain deferred to Phase 9.

Required before landing integration can be planned:

- all motifs visually approved on straight and curved staff;
- key signatures correct;
- multiple seeds demonstrate controlled variation without illegal motifs;
- responsive semantic stability verified;
- reduced motion preserves same semantic score;
- accessibility checks pass;
- performance instrumentation shows no per-frame React recomposition;
- deterministic screenshots/evidence recorded.

## 23. Definition of Done

This implementation change is complete only when:

1. all eight glyph candidates are registered and checksum-traceable;
2. pure geometry passes Gate A;
3. draft calibration tooling exists;
4. human-approved metrics/anchors complete Gate B;
5. all v0.1 motifs render correctly;
6. the composer is seeded, versioned, deterministic, and stress-tested;
7. the development Visual Lab is functional and inaccessible in production;
8. Gate C evidence is approved;
9. OpenSpec tasks/spec validation pass;
10. Graphify is updated after structural changes;
11. landing/public behavior remains unchanged;
12. no landing integration work has begun.

## 24. Gate-C corrective delta automated closeout

The two corrections requested by the external 2026-08-17 Gate-C review are
implemented, tested, and captured as deterministic candidate evidence. The
automated delta workflow completed on the local noncanonical visual host and was
sealed on 2026-08-24 after repository-state rehydration.

Verified automated facts:

- the split triplet bracket protects a `0.75 staffSpace` numeral with a
  `0.18 staffSpace` side gap on each side;
- responsive projections preserve one semantic composition across
  `horizontal-enhanced`, `vertical-wide`, `vertical-compact`, and `static`;
- notation-bearing zones read left-to-right and satisfied the then-active draft
  `18 degree` tangent limit;
- steep/returning connectors contain zero musical events;
- the approved clef remains upright and byte-identical;
- the terminal final barline remains conventionally oriented;
- public landing behavior remains isolated and unchanged;
- all 16 approved SVG files and all 84 committed visual snapshots remain
  byte-identical to their pinned baselines.

The sealed evidence index is
`docs/canonical-v2/06-migration/evidence/music-system-v0.1/gate-c/delta-2026-08-17/2026-08-24-gate-c-delta-review.md`.

At this historical checkpoint these facts did not approve the optical
candidates, and Gate C/task `7.7` still awaited renewed human review. The later
2026-08-24 final approval record supersedes that status without rewriting this
sealed evidence. No landing integration, deployment, or production action was
performed.

## 25. Final Gate-C triplet correction

The final named correction changes only `tupletNumeralSizeSp` from `0.75` to
`0.85`. The historical `0.75` evidence remains sealed. Only the two motif
matrices and two triplet-detail images were recaptured in
`gate-c/final-triplet-2026-08-24/`. Final external human optical review on
2026-08-24 approved those four images and the exact five-value triplet contract.
The canonical authority record and evidence manifest are in
`gate-c/approval-2026-08-24/`; public landing integration remains future work.
