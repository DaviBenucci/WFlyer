# Repository conflict map — inspected `WFlyer(10).zip`

This file exists to prevent Codex from treating current implementation details as the target architecture.

## Current implementation that is legacy for the new music system

| Existing path | Observed behavior | New-system rule | Action in this change |
|---|---|---|---|
| `src/components/music/MusicalNote.tsx` | Programmatic `<ellipse>` notehead, hard-coded stem offsets/lengths | Approved SVG noteheads + calibrated anchors + deterministic stem primitive | Do not migrate landing; do not reuse as renderer authority |
| `src/components/music/Staff.tsx` | Static `NOTE_POSITIONS` with pixel `x/y` and fixed stems | Composer emits `staffStep` + semantic slots; renderer derives geometry | Leave legacy landing behavior unchanged |
| `src/components/music/StaffSegment.tsx` | Five Bézier paths built independently by changing `y` | Five staff lines must be offsets of one master guide/local frame | New core implements canonical model separately |
| `src/components/music/NarrativeClef.tsx` | Hard-coded custom clef path and decorative orbits | Use normalized `wf-music-treble-clef.svg`; geometry immutable | Do not rewrite landing in this phase |
| `src/components/music/ChapterScore.tsx` | Per-chapter score with static note blueprints and hard-coded dimensions | Continuous branch score + semantic slots + seeded motifs | Keep as legacy until post-Gate-C migration |
| `src/components/music/OriginScore.tsx` | Separate desktop/compact hard-coded note blueprints | Same semantic composition across responsive geometry | Keep legacy; Visual Lab uses new system |
| `src/components/music/FinalBarline.tsx` | Useful concept but fixed pixel defaults | Final barline primitive derived from `staffSpace` and local normal | Reimplement in pure geometry core; no dependency on legacy component |

## Normative-document conflicts

### `docs/02-design/05-partitura-ondulada.md`

Older text states that note positions are static and that no note is randomized in production. This is superseded by ADR-027: the score uses deterministic session-seeded procedural selection. It remains non-random during scroll and stable inside a session.

### `docs/02-design/09-sistema-dupla-partitura.md`

Older route-per-chapter topology and the `institutional/company/portfolio` terminology are historical. New canonical terminology is `professional/about/projects`, and each branch is a perceptually continuous score. Do not refactor the public route system in this isolated change.

### `docs/05-implementacao/11-manifesto-capitulos-partitura.yaml`

This v1 manifest reflects the previous chapter/terminal model. The new music system must not bind its core to this file. Use semantic test/lab chapter IDs defined in the new implementation contract. A landing-story v2 manifest is a later migration task after Gate C.

## Existing infrastructure to preserve

- Next.js App Router, React 19, TypeScript strict.
- Vitest unit project and existing test conventions.
- Playwright, Storybook, axe-core, Lighthouse infrastructure.
- GSAP remains the only programmatic motion engine, but GSAP is outside the renderer/composer implementation scope.
- `app.wflyer.com.br`, contact endpoint, Cloudflare, Napoleon, and deployment workflows are out of scope.

## New source boundaries

The implementation SHOULD use:

```text
src/lib/music/
  geometry/
  glyphs/
  renderer/
  composer/

src/components/score/
  ScoreSvg.tsx
  ScoreGlyph.tsx
  ScoreDebugOverlay.tsx

src/app/__visual-lab/music/
```

Do not place pure geometry or composer logic inside React components.
