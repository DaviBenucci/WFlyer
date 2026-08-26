# W_Flyer Music Renderer v0.1

## Responsibility boundary

Approved SVGs define glyph appearance. Code defines deterministic composition/engraving geometry.

## Coordinate system

```text
1 staffSpace = distance between adjacent staff lines
1 staffStep  = 0.5 staffSpace
```

Treble staff reference:

```text
C4=-2, D4=-1, E4=0, F4=1, G4=2, A4=3, B4=4,
C5=5, D5=6, E5=7, F5=8, G5=9, A5=10
```

## ScorePath

Pure TypeScript abstraction:

```ts
interface ScorePath {
  pointAt(t: number): Vec2;
  tangentAt(t: number): Vec2;
  normalAt(t: number): Vec2;
}
```

v0.1 supports straight and cubic Bézier paths. Staff lines are coherent normal offsets of one master guide.

The master guide coincides geometrically with the middle staff line, B4 / `staffStep 4`. `pointAt(t)` therefore represents that middle-line guide. `normalAt(t)` is the normalized pitch-increasing normal, independent of path traversal direction; reversing a branch must not invert pitch placement.

```text
pitchOffset = (staffStep - 4) * (staffSpace / 2)
placement   = pointAt(t) + normalAt(t) * pitchOffset
```

The five visible staff-line offsets from the guide are `[-2,-1,0,1,2] * staffSpace`, corresponding to staffSteps `[0,2,4,6,8]`. The logical guide never replaces or removes the visible middle line.

## Ledger lines

Regular staff lines occupy steps `0,2,4,6,8`.

Above:

- 9 → none
- 10 → [10]
- 11 → [10]
- 12 → [10,12]

Below:

- -1 → none
- -2 → [-2]
- -3 → [-2]
- -4 → [-2,-4]

Every required intermediate line is emitted. Each ledger line is centered on the notehead, extends along local tangent, and uses notehead nominal width + configured extension.

## Notes and durations

- whole: open notehead, no stem;
- half: open notehead + stem;
- quarter: filled notehead + stem;
- eighth: filled + stem + flag or primary beam;
- sixteenth: filled + stem + double flag or primary/secondary beams.

## Stems

Single note: step < 4 → up; step ≥ 4 → down (`B4` default down).

Beamed group Option B:

1. sum each `staffStep - 4`;
2. negative → up, positive → down;
3. zero → side of farthest extreme;
4. perfect symmetry → down.

Approved notehead anchors control stem attachment.

## Beams

Renderer supports only approved motif topology. Primary/secondary beams and hooks are primitives. `S16_E8_S16` requires left/right secondary hooks, never a continuous secondary beam through the central eighth.

## Triplets

`E8_TRIPLET_3` contains exactly three eighth notes, one primary beam, one visible
bracket, and the numeral `3`. The numeral is centered from the complete group
bounding span, uses score foreground/`currentColor`, and remains outside the
primary beam. The horizontal bracket is split around the numeral; its central
gap is the rendered numeral width plus two explicit staff-space-relative side
gaps, so no bracket stroke passes behind or through `3`.

External human Gate-C review on 2026-08-24 approved
`tupletNumeralSizeSp=0.85`, `tupletNumeralSideGapSp=0.18`,
`bracketClearanceSp=0.65`, `bracketEndCapSp=0.30`, and
`bracketThicknessSp=0.07` as the canonical v0.1 triplet tokens.

## Accidentals and key signatures

Accidental glyph aligns using `pitchCenter`. Key signatures are deterministic from clef + `fifths (-7..+7)` and explicit treble position tables. Spacing derives from glyph bounds and `staffSpace` tokens.

Each continuous branch has at most one key signature near origin; `fifths=0` means none.

## Barlines

Ordinary and final barlines are primitives aligned to local normal. Final barline is thin + configured gap + thick.

## Responsive ScorePath projection

Responsive presentation separates semantic composition from physical
projection. The supported conceptual modes are `horizontal-enhanced`,
`vertical-wide`, `vertical-compact`, and `static`; every mode projects the same
semantic slot sequence.

A projected path distinguishes:

- **notation-safe composition zones:** locally horizontal or gently inclined,
  left-to-right spans where musical events may be placed;
- **connector zones:** continuous five-line spans that may descend, curve,
  become steep, or return across the viewport, but contain no musical events.

Vertical document progression never means rotating conventional engraving into
a vertical staff. Returning path spans are connectors rather than
180-degree-reversed notation zones. Correct the ScorePath zoning itself; never
counter-rotate arbitrary glyphs independently while leaving a vertical or steep
staff underneath them. The approved notation-safe limit is
`maxNotationTangentAngleDeg=18`; exact responsive activation thresholds remain
Motion Lab calibration.

The current piecewise returning connector is a validation-only noncanonical
fixture. It proves zoning, continuity, orientation, and semantic equivalence but
does not define the final public Score Path aesthetic. Final organic layouts are
deferred to the blocking Phase-9 Score Path human subgate.

The treble clef remains upright, unmirrored, unflipped, and never sideways. Its
approved geometry and `gLine` anchor remain unchanged inside a notation-safe
origin span. A final barline occurs inside a notation-safe terminal span and
retains the conventional thin vertical bar + gap + thick vertical bar
orientation across the locally horizontal staff.

Responsive remapping may change ScorePath geometry, physical slot ranges,
spacing, local-zone capacity, and scene arrangement only. It never changes the
seed, motif IDs/order, durations, staffSteps, contour IDs/translations, reserved
slots, or key-signature configuration, and resize never recomposes the score.

## Performance

Geometry calculates on composition/layout changes, not every scroll frame. SVG presentation renders precomputed models and is decorative/`aria-hidden` by default.
