# W_Flyer Visual Library — Musical Geometry Kit v0.1

## Purpose

This package is the normalized canonical input for the W_Flyer Music Renderer and Music Visual Lab.
It intentionally separates **designer-owned glyph geometry** from **renderer-generated primitives**.

## Canonical status

The eight glyphs in `docs/design-reference/visual-library/musical/glyphs/source/` are **visual-reference approved**.
Their runtime copies in `src/assets/visuals/musical/` are **runtime candidates only** until metrics, anchors and Music Visual Lab acceptance are completed.

Do **not** integrate these runtime candidates into the production landing before the Music Visual Lab gate passes.

## Designer-owned glyphs

- Treble clef
- Filled notehead
- Open notehead
- Sharp accidental
- Flat accidental
- Natural accidental
- Eighth flag (up master)
- Sixteenth double flag (up master)

The approved path geometry must not be redesigned, approximated, regenerated or creatively altered by Codex without explicit human re-approval.

## Renderer-generated primitives

The following are **not SVG assets** and must be generated deterministically by the renderer:

- five staff lines
- master guide / ScorePath
- stems
- ledger lines
- primary and secondary beams
- beam hooks
- ordinary barlines
- final barline (thin + gap + thick)

Legacy SVGs for these primitives were intentionally excluded from this normalized package.

## Color

Source masters use neutral black. Runtime candidates use `currentColor` and contain no hard-coded W_Flyer palette values.
Theme colors must be applied by CSS/design tokens.

## SVG identifiers

Every runtime/master SVG uses stable IDs:

- root: `wf-music-<asset>`
- shape: `wf-music-<asset>-shape`

Animation and rendering code must not depend on DOM child order such as `path:first-child`.

## Required metrics and anchors

Metrics are deliberately left `null` in the manifest until calibrated in the Music Visual Lab.
Do not invent them from arbitrary pixel offsets.

Required anchors:

- treble clef: `gLine`
- noteheads: `opticalCenter`, `stemUp`, `stemDown`
- accidentals: `pitchCenter`
- flags: `stemAttachment`

All runtime dimensions must ultimately be expressed relative to `staffSpace`.

## Source of truth

1. `manifest.json`
2. source master SVG geometry
3. renderer/composer contracts in this package
4. Music Visual Lab acceptance evidence

If legacy filenames or previous generated references conflict with this package, this normalized package wins for the Musical Geometry Kit v0.1 workstream.
