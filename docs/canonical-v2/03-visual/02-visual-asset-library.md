# Visual Asset Library

## Asset lifecycle

```text
SOURCE MASTER → REVIEWED/APPROVED ASSET → RUNTIME REPRESENTATION
```

Source masters live under `docs/design-reference/visual-library`. Runtime assets live under `src/assets/visuals`. The transformation is one-way; runtime files are not edited as new masters.

## Asset types

- `GLYPH`
- `SCORE_SEGMENT`
- `CHARACTER`
- `SCENE_ELEMENT`
- `DEVICE`

## Rules

- stable English filenames and `wf-*` IDs;
- stable `viewBox`;
- no scripts, event handlers, `foreignObject`, external resources, embedded raster, or remote font;
- runtime color via `currentColor`/tokens where geometry is identical;
- manifest status, provenance, checksum, required metrics/anchors;
- approved paths cannot be redesigned by Codex;
- optimization must preserve visible silhouette and required IDs;
- light/dark should share geometry where possible.

## Music assets

Visual-reference-approved glyphs:

- treble clef;
- filled notehead;
- open notehead;
- sharp;
- flat;
- natural;
- eighth flag;
- sixteenth double flag.

Runtime approval is pending human calibration.

## Renderer primitives

Not image assets:

- staff lines/master guide;
- stems;
- ledger lines;
- beams/hooks;
- barlines/final barline;
- key-signature composition.
