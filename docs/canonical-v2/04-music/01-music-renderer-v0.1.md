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

## Accidentals and key signatures

Accidental glyph aligns using `pitchCenter`. Key signatures are deterministic from clef + `fifths (-7..+7)` and explicit treble position tables. Spacing derives from glyph bounds and `staffSpace` tokens.

Each continuous branch has at most one key signature near origin; `fifths=0` means none.

## Barlines

Ordinary and final barlines are primitives aligned to local normal. Final barline is thin + configured gap + thick.

## Performance

Geometry calculates on composition/layout changes, not every scroll frame. SVG presentation renders precomputed models and is decorative/`aria-hidden` by default.
