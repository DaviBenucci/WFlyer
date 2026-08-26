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

Runtime metrics/anchors and the down-flag transform passed external human Gate B
review on 2026-08-15. Each glyph's `runtimeStatus` is `approved` in the canonical
manifest. Approved SVG geometry and checksums remain unchanged. Gate C renderer and
composer presentation passed external human review on 2026-08-24. This does not
authorize public landing integration or the still-pending Phase-9 Score Path
human decision.

## Renderer primitives

Not image assets:

- staff lines/master guide;
- stems;
- ledger lines;
- beams/hooks;
- barlines/final barline;
- key-signature composition.
