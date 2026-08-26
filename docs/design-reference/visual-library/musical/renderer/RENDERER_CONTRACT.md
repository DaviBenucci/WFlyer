# W_Flyer Music Renderer v0.1 — Canonical Contract

## Responsibility boundary

Approved glyphs define **shape**. The renderer defines **placement and composition**.
The renderer may compose approved geometry; it may not redesign approved geometry.

## Coordinate system

- `1 staffSpace` = distance between adjacent visible staff lines.
- `1 staffStep` = `0.5 staffSpace`.
- Treble staff line steps are `0, 2, 4, 6, 8`.
- `E4=0`, `F4=1`, `G4=2`, `A4=3`, `B4=4`, `C5=5`, `D5=6`, `E5=7`, `F5=8`, `G5=9`, `A5=10`.
- Landing composer pitch range: `C4 (-2)` through `A5 (10)`.

## ScorePath

Straight and curved staffs use the same path abstraction. At a normalized path position the renderer derives:

- point `P`
- normalized tangent `T`
- local normal `N`

`P` is the logical staff master guide and coincides geometrically with the visible middle staff line, `B4 / staffStep 4`. The visible middle line remains one of the five rendered staff lines; the guide does not replace it.

`N` always points toward increasing pitch independently of path traversal direction. Reversing a branch path must preserve pitch placement at corresponding geometric points. The pitch offset is:

```text
pitchOffset = (staffStep - 4) * (staffSpace / 2)
```

Visible staff lines and pitch offsets are derived from this local frame. Curved score composition zones must use long, smooth curves with locally stable tangents.

## Ledger lines

Ledger lines are generated only when required.

Above the staff:
- step `9` -> none
- step `10` -> `[10]`
- step `11` -> `[10]`
- step `12` -> `[10, 12]`
- continue every two staffSteps.

Below the staff:
- step `-1` -> none
- step `-2` -> `[-2]`
- step `-3` -> `[-2]`
- step `-4` -> `[-2, -4]`
- continue every two staffSteps.

A ledger line is a short local segment centered on the notehead and aligned with local tangent `T`. Its width is derived from notehead nominal width plus a staffSpace-relative extension. Never use arbitrary pixel gaps.

## Note durations in v0.1

- whole: open notehead, no stem
- half: open notehead + stem
- quarter: filled notehead + stem
- eighth: filled notehead + stem + one flag or primary beam
- sixteenth: filled notehead + stem + double flag or primary+secondary beams

## Single-note stem direction

- below middle line (`staffStep < 4`) -> up
- middle line (`staffStep == 4`) -> down default
- above middle line (`staffStep > 4`) -> down

Explicit overrides require authored justification; they are not random decoration.

## Beamed-group stem direction — approved Option B

Determine direction from the group as a whole, relative to middle staff step `4`.

1. Compute the aggregate balance of member note positions relative to the middle line.
2. Balance below center -> stems up.
3. Balance above center -> stems down.
4. On aggregate tie, use the side containing the note furthest from the middle line.
5. If still perfectly symmetric, default to down.

All notes in the group share the resolved direction.

## Beams

Beams are renderer primitives. Primary/secondary beams and hooks must be computed deterministically. Beam groups must be authored only inside ScorePath regions with locally stable curvature.

## Triplets

`E8_TRIPLET_3` always contains exactly three eighth notes, one primary beam, one
visible bracket, and the numeral `3`. The numeral uses score
foreground/`currentColor`, is centered from the complete group bounding span,
and remains external to the primary beam. Split the horizontal bracket around
the numeral with this central gap:

```text
renderedNumeralWidth + 2 * tupletNumeralSideGapSp
```

The bracket must not pass behind or through the numeral. Final external human
Gate-C review on 2026-08-24 approved `tupletNumeralSizeSp=0.85`,
`tupletNumeralSideGapSp=0.18`, `bracketClearanceSp=0.65`,
`bracketEndCapSp=0.30`, and `bracketThicknessSp=0.07`.

## Accidentals

Individual accidental vertical position equals the note `staffStep`. Horizontal placement is computed from glyph bounds and staffSpace-relative gaps.

## Key signatures

Key signatures are deterministic and configured, never procedural-random.
Each continuous score/branch may contain **at most one** key signature, placed in its initial region after the clef and before the first relevant rhythmic material. It must not repeat by chapter.

Treble-clef sharp order and steps:

- F: `8`
- C: `5`
- G: `9`
- D: `6`
- A: `3`
- E: `7`
- B: `4`

Treble-clef flat order and steps:

- B: `4`
- E: `7`
- A: `3`
- D: `6`
- G: `2`
- C: `5`
- F: `1`

`fifths=0` renders no key signature. Horizontal spacing is computed from glyph bounds plus explicit staffSpace-relative tokens.

## Barlines

Ordinary and final barlines are primitives. Final barline is always `thin line + gap + thick line` and follows the local staff normal. The final barline ends the score narrative before the terminal/footer begins.

## Responsive ScorePath projection

Responsive presentation modes are `horizontal-enhanced`, `vertical-wide`,
`vertical-compact`, and `static`. Selection must be capable of considering
viewport width, viewport height, pointer/input capability, reduced-motion
preference, and effective layout capacity. Exact activation thresholds remain
Motion Lab calibration parameters.

Every physical projection distinguishes:

- **notation-safe composition zones**, which read left-to-right, are locally
  horizontal or gently inclined, and may contain musical events; and
- **connector zones**, which preserve continuity of all five lines and may
  descend, curve, become steep, or return across the viewport, but contain no
  musical events.

Vertical document progression does not rotate musical notation into a vertical
staff. A returning span is a connector rather than a reversed notation zone.
Correct the ScorePath zoning itself; never counter-rotate arbitrary glyphs
independently while leaving a vertical or steep staff underneath them. The
approved notation-safe limit is `maxNotationTangentAngleDeg=18`; responsive
activation thresholds remain Motion Lab calibration.

The current piecewise returning connector remains a validation-only
noncanonical fixture. Final public organic Score Paths require the separate
blocking Phase-9 human approval recorded in the canonical implementation plan.

The approved treble-clef path remains byte-identical, upright, unmirrored,
unflipped, and aligned through its approved `gLine` anchor in a notation-safe
origin zone. The final barline remains thin vertical bar + gap + thick vertical
bar inside a notation-safe terminal zone and is not rotated with document flow.
`normalAt()` continues to point toward increasing pitch independently of path
traversal.

Responsive projection preserves the semantic score—seed, motif IDs/order,
durations, staffSteps, contour IDs/translations, reserved slots, and key
signature. It may change only ScorePath geometry, physical slot ranges, spacing,
local-zone capacity, and scene arrangement; resize never recomposes.

## Runtime performance

Geometry is calculated on mount, resize or semantic score geometry change, not on every scroll frame. Scroll motion manipulates precomputed geometry through transforms, masks, opacity or stroke reveal.

## Required Visual Lab gate

Production score integration is prohibited until glyph metrics/anchors and renderer fixtures pass the Music Visual Lab and human visual review.
