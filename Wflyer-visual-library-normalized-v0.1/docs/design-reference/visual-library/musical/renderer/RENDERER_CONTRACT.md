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

## Runtime performance

Geometry is calculated on mount, resize or semantic score geometry change, not on every scroll frame. Scroll motion manipulates precomputed geometry through transforms, masks, opacity or stroke reveal.

## Required Visual Lab gate

Production score integration is prohibited until glyph metrics/anchors and renderer fixtures pass the Music Visual Lab and human visual review.
