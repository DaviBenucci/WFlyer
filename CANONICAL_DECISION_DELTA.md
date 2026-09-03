# Canonical decision-register delta

Codex MUST normalize these decisions into `docs/00-governanca/05-registro-decisoes.md` before writing implementation code. Keep existing history; do not erase old ADR text. Mark conflicting older ADRs as superseded only in the scope stated below.

## Required status adjustments

- `ADR-014 — Home como origem de duas partituras`: mark **superseded for score topology and current chapter composition by ADR-025**. Historical rationale remains.
- `ADR-015 — Continuidade e encerramento musical`: mark **superseded for current score topology and terminal placement by ADR-025**. Historical rationale remains.
- Do not modify unrelated hosting, security, contact, or deployment ADRs.

## ADR-025 — Continuous organic dual-score narrative

**Status:** approved on 2026-08-14

The Home is the common semantic origin of two continuous musical scores. On desktop, the application score travels left and the professional score travels right. Each score is one perceptually continuous five-line staff across its complete branch, built from geometrically compatible modular segments rather than independent chapter staffs. The master guide uses long, smooth organic curves with few inflection points; the five staff lines are coherent offsets of that guide. Scene elements may pass in front of, behind, around, or emerge from the staff, but may not replace score continuity. Each branch ends with a deterministic final barline (thin line, configured gap, thick line) before its terminal/footer. Mobile uses a vertical/serpentine adaptation of the same semantic score without horizontal scrolling. Horizontal and vertical layouts preserve semantic chapter/slot IDs even when geometry differs.

## ADR-026 — W_Flyer Music Renderer v0.1

**Status:** approved on 2026-08-14

The W_Flyer music system separates designer-owned glyph geometry from deterministic engraving geometry. Approved SVG glyphs define the shape of treble clef, filled/open noteheads, sharp/flat/natural accidentals, eighth flag, and sixteenth double flag. Code generates staff lines, stems, ledger lines, beams, beam hooks, ordinary barlines, final barlines, and key-signature placement. `staffSpace` is the canonical spacing unit and `staffStep = 0.5 * staffSpace` is the canonical diatonic vertical step. Straight and curved staffs share the same `ScorePath` abstraction and use local point/tangent/normal frames. Pure geometry and renderer-model logic are independent of React. For beamed groups, stem direction is resolved from the group as a whole: balance around middle-line `B4`, then farthest extreme, then `DOWN` on perfect symmetry. The renderer supports only the whitelisted v0.1 rhythmic structures and may not redraw approved glyph paths.

## ADR-027 — Seeded procedural score composition

**Status:** approved on 2026-08-14

The public score is visually procedural but not a free music generator. A versioned, deterministic session seed selects and organizes only approved rhythmic motifs and controlled pitch contours. The same session, composer version, chapter ID, and semantic slot IDs produce the same semantic score across reloads, theme changes, navigation, responsive mode changes, and reduced-motion mode. A new session may generate a different approved arrangement. `Math.random()` is prohibited from score composition. The whitelist includes simple quarter-note, half-note, and approved whole-note motifs plus: two beamed eighth notes; exactly three beamed eighth notes only as a triplet with mandatory centered `3` and bracket; four beamed sixteenth notes; eighth + two sixteenths; two sixteenths + eighth; and sixteenth + eighth + sixteenth using secondary beam hooks. Motifs outside the whitelist are forbidden by default. The landing composer pitch range is `C4..A5`, favoring `E4..F5` so ledger lines are occasional rather than dominant. Key signatures are explicit score configuration, never random, and each continuous branch score has at most one key-signature occurrence near its origin after the treble clef and before the first relevant rhythmic material.

## ADR-028 — Music asset calibration and Visual Lab gates

**Status:** approved on 2026-08-14

Eight normalized SVG glyphs are visual-reference approved but runtime approval remains blocked until staff-space-relative metrics and semantic anchors are calibrated and human-approved in the Music Visual Lab. Codex may propose `draft-calibration` values but may not mark them approved. The development-only `/__visual-lab/music/*` surface must return 404 in production. Gates are sequential: Gate A validates pure geometry and deterministic rules; Gate B requires human approval of glyph metrics/anchors; Gate C validates renderer/composer visual behavior, multiple seeds, curved staff behavior, accessibility, determinism, and performance. Integration with the main landing is prohibited before all three gates are complete and the human approval is recorded.
