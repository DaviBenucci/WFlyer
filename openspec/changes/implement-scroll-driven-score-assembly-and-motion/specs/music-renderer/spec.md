## ADDED Requirements

### Requirement: Complete event ink occupies safe straight geometry
Every visible Composer event group SHALL fit wholly inside
`EVENT_SAFE_STRAIGHT`, including notehead, stem, flag or beam, accidental,
ledger lines, tuplets, strokes, and required clearance envelopes.

#### Scenario: An event is rendered
- **WHEN** Projection places a Composer-backed event
- **THEN** its complete rendered footprint remains in the safe region with at least 12 physical CSS pixels from protected content

### Requirement: Forbidden regions remain event-free
`TRUE_CONNECTOR`, `EVENT_FREE_CURVED`, and `ASSEMBLY_TRANSITION` SHALL contain no
Composer-backed event ink.

#### Scenario: Staff geometry turns or connects visits
- **WHEN** a segment is classified as curved, connector, or Assembly transition
- **THEN** staff may remain visible but no event group is assigned there

### Requirement: Rendering remains semantically deterministic
The portfolio rebaseline SHALL preserve the approved Composer seed,
fingerprint, semantic event order, and glyph paths.

#### Scenario: The same portfolio composition is rendered twice
- **WHEN** identical semantic and geometry inputs are used
- **THEN** canonical render primitives and fingerprints are identical across supported engines
