## Why

The current institutional site renders decorative music with hard-coded pixel positions, programmatic ellipse noteheads, a legacy narrative-clef path, and independent chapter staff paths. The approved W_Flyer direction now requires one reusable music system that preserves author-approved SVG glyph geometry, supports coherent curved staffs, generates engraving primitives deterministically, and provides controlled session-seeded visual variation without becoming a free music-composition engine.

The new system must be proven in isolation before the landing is migrated. This avoids coupling score geometry, procedural composition, GSAP story motion, and public layout in one high-risk change.

## What Changes

- Add a pure TypeScript music geometry core with `staffSpace/staffStep`, straight/cubic ScorePaths, local tangent/normal frames, ledger lines, stems, beams/hooks, key signatures, and barlines.
- Register the eight normalized visual-reference-approved SVG glyphs without modifying their approved paths.
- Add draft-calibration metrics/anchors and a human calibration workflow.
- Add a pure deterministic Procedural Score Composer using a versioned seeded PRNG, whitelisted rhythmic motifs, controlled pitch contours, anti-repetition rules, semantic slots, and reserved zones.
- Add React/SVG presentation components that consume precomputed models rather than performing music logic.
- Add a development-only Music Visual Lab and deterministic validation fixtures.
- Add unit, stress, accessibility, visual, production-404, and public-regression evidence.
- Keep the main landing and legacy score components unchanged until Gates A/B/C are complete and human-approved.

## Capabilities

### New Capabilities

- `music-renderer`: deterministic musical geometry and SVG render models for straight/curved W_Flyer scores.
- `procedural-score-composer`: session-seeded composition of only approved visual rhythmic motifs and pitch contours.
- `music-visual-lab`: development-only calibration and validation surface for glyphs, geometry, motifs, and composer outputs.

### Modified Capabilities

None in the public landing during this change.

## Impact

- New pure code under `src/lib/music/`.
- New presentation code under `src/components/score/`.
- New development-only routes under `src/app/__visual-lab/music/`.
- New normalized assets under `src/assets/visuals/musical/` and canonical asset documentation under `docs/design-reference/visual-library/`.
- No database, server API, network service, analytics, CMS, or runtime dependency is added.
- No change is authorized for `app.wflyer.com.br`, Cloudflare, Napoleon, contact handling, public routes, or landing motion.
