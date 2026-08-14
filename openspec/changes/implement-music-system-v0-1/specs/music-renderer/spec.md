## ADDED Requirements

### Requirement: Music geometry is deterministic and staff-space based
The music renderer SHALL derive musical vertical placement from `staffStep` and `staffSpace`, SHALL generate staff/ledger/stem/beam/barline primitives deterministically, and SHALL NOT encode pitch through hard-coded screen-pixel coordinates.

#### Scenario: A note is placed on a curved score
- **WHEN** the renderer receives a note with a staffStep and a normalized position on a cubic ScorePath
- **THEN** it derives the point, tangent, normal, pitch offset, ledger lines, notehead placement, and stem geometry from the local frame without changing the approved glyph path

#### Scenario: A note requires intermediate ledger lines
- **WHEN** a note lies beyond the first ledger-line position
- **THEN** every required intermediate ledger line between the staff and note position is generated and no unnecessary ledger line is added

### Requirement: Straight and curved scores share one geometry contract
The renderer SHALL use the same ScorePath abstraction and engraving rules for straight and curved staffs, with v0.1 supporting straight and cubic-Bézier paths.

#### Scenario: The same semantic note is rendered on straight and curved paths
- **WHEN** the same staffStep and motif model is mapped to two different ScorePaths
- **THEN** its musical line/space relationship remains equivalent while only the geometric frame changes

### Requirement: Approved glyph geometry is immutable
The renderer SHALL reference the normalized treble-clef, notehead, accidental, and flag glyph assets by stable IDs and SHALL NOT redraw or mutate their approved path geometry.

#### Scenario: A glyph lacks approved metrics
- **WHEN** an asset is still in draft calibration
- **THEN** it may render inside the Visual Lab but SHALL NOT be marked runtime-approved or authorized for landing integration

### Requirement: Beam groups use the approved group-balance stem rule
Every beamed group SHALL use one stem direction resolved from the entire group's distribution around B4, then the farthest-extreme tie-break, then DOWN on perfect symmetry.

#### Scenario: Beam-group balance is negative
- **WHEN** the sum of `(staffStep - 4)` for all group notes is negative
- **THEN** all stems in the group point UP

#### Scenario: Beam-group balance is perfectly symmetric
- **WHEN** balance is zero and the farthest upper/lower extremes are equal
- **THEN** all stems in the group point DOWN

### Requirement: Key signatures are deterministic structural score elements
Treble key signatures SHALL support fifths `-7..+7`, SHALL use the approved accidental glyphs in canonical order/vertical positions, and SHALL be controlled outside the procedural composer.

#### Scenario: A score config uses four sharps
- **WHEN** `fifths=4`
- **THEN** the renderer places exactly F#, C#, G#, and D# at the canonical treble staffSteps with deterministic horizontal spacing

### Requirement: Final barline is a renderer primitive
The final barline SHALL consist of a thin line, configured gap, and thick line aligned through the staff local normal and SHALL NOT be represented as a repeat barline.
