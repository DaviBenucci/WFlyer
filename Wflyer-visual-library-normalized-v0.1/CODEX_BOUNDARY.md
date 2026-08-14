# Codex Implementation Boundary

This archive is intentionally normalized to prevent legacy ambiguity.

## Allowed in the next implementation package

Codex may:
- load the eight normalized runtime-candidate SVG glyphs
- build pure geometry functions for the renderer
- build the Music Visual Lab and Composer Visual Lab
- calculate staff/stems/ledger lines/beams/hooks/barlines/key signatures deterministically
- calibrate metrics/anchors in the lab and propose manifest values for human approval

Codex must not yet:
- integrate the new score system into the production landing
- alter approved SVG path geometry
- restore excluded legacy primitive SVGs as runtime assets
- create arbitrary rhythmic motifs outside the composer whitelist
- pick key signatures randomly
- repeat a key signature per chapter
- make motion/scroll code the source of musical geometry

The next gate is human approval of metrics, anchors and Visual Lab evidence.
