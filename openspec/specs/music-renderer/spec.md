# Music Renderer Specification

## Purpose

Define deterministic staff-space geometry and immutable SVG render-model
behavior for straight, curved, and responsive W_Flyer scores.

## Requirements

### Requirement: Music geometry is deterministic and staff-space based
The music renderer SHALL derive musical vertical placement from `staffStep` and `staffSpace`, SHALL generate staff/ledger/stem/beam/barline primitives deterministically, and SHALL NOT encode pitch through hard-coded screen-pixel coordinates.

#### Scenario: A note is placed on a curved score
- **WHEN** the renderer receives a note with a staffStep and a normalized position on a cubic ScorePath
- **THEN** it derives the point, tangent, normal, pitch offset, ledger lines, notehead placement, and stem geometry from the local frame without changing the approved glyph path

#### Scenario: A note requires intermediate ledger lines
- **WHEN** a note lies beyond the first ledger-line position
- **THEN** every required intermediate ledger line between the staff and note position is generated and no unnecessary ledger line is added

#### Scenario: The master guide and visible middle line coincide
- **WHEN** the renderer samples any valid position on a straight or cubic ScorePath
- **THEN** `pointAt(t)` is the B4/staffStep-4 master guide, the visible staffStep-4 line is still emitted at that point, and a pitch uses `(staffStep - 4) * (staffSpace / 2)` along the pitch-increasing normal

### Requirement: Straight and curved scores share one geometry contract
The renderer SHALL use the same ScorePath abstraction and engraving rules for straight and curved staffs, with v0.1 supporting straight and cubic-Bézier paths.

#### Scenario: The same semantic note is rendered on straight and curved paths
- **WHEN** the same staffStep and motif model is mapped to two different ScorePaths
- **THEN** its musical line/space relationship remains equivalent while only the geometric frame changes

#### Scenario: A branch path reverses traversal direction
- **WHEN** equivalent geometry is traversed in the opposite direction with the same world-space increasing-pitch side
- **THEN** corresponding points have opposite progression tangents but equivalent pitch-increasing normals and identical pitch placement

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

### Requirement: Triplet numeral and bracket remain legible
`E8_TRIPLET_3` SHALL retain exactly three eighth notes, one primary beam, one
visible bracket, and the numeral `3`. The numeral SHALL use score
foreground/`currentColor`, SHALL be centered from the complete group bounding
span, and SHALL remain external to both the primary beam and bracket strokes.
The horizontal bracket SHALL be split around the numeral with a central gap of
`renderedNumeralWidth + 2 * tupletNumeralSideGapSp`.

The final external-human-approved Gate-C implementation SHALL expose
`tupletNumeralSizeSp=0.85`, `tupletNumeralSideGapSp=0.18`,
`bracketClearanceSp=0.65`, `bracketEndCapSp=0.30`, and
`bracketThicknessSp=0.07` exactly.

#### Scenario: A triplet bracket is split around its numeral
- **WHEN** the renderer builds an `E8_TRIPLET_3` model
- **THEN** the two horizontal bracket spans leave a central gap equal to the rendered width of `3` plus two `0.18 staffSpace` side gaps and the numeral is centered on the complete group span

#### Scenario: Stem direction changes triplet placement
- **WHEN** otherwise equivalent triplets resolve to UP and DOWN stems
- **THEN** each numeral remains outside its primary beam, does not overlap either bracket span, and retains the approved `0.85 staffSpace` size

#### Scenario: ScorePath shape changes triplet geometry
- **WHEN** equivalent triplets are projected on straight, gentle-arc, and gentle-S ScorePaths
- **THEN** every projection preserves the same centered `3`, split bracket, side gaps, and non-overlap contract

### Requirement: Responsive ScorePath projection separates notation from connectors
The renderer SHALL support the presentation modes `horizontal-enhanced`,
`vertical-wide`, `vertical-compact`, and `static` as physical projections of one
semantic score. Mode selection SHALL be capable of considering viewport width,
viewport height, pointer/input capability, reduced-motion preference, and
effective layout capacity; exact activation thresholds SHALL remain
noncanonical Motion Lab calibration parameters.

Every responsive projection SHALL distinguish notation-safe composition zones
from connector zones. Only notation-safe zones may contain clefs, key
signatures, notes, stems, flags, beams/hooks, accidentals, tuplets, ledger lines,
or barlines. Such zones SHALL read left-to-right and remain locally horizontal
or gently inclined. Connector zones MAY descend, curve, become steep, or return
across the viewport while preserving all five staff lines, but SHALL contain no
musical events.

The renderer SHALL correct the ScorePath zoning itself. It SHALL NOT
counter-rotate arbitrary glyphs independently while leaving a vertical or steep
staff underneath them.

The final 2026-08-24 external human Gate-C decision approves
`maxNotationTangentAngleDeg=18` for functional notation-safe zoning. Responsive
activation thresholds remain noncanonical Motion Lab calibration values. The
current piecewise returning connector geometry SHALL remain a validation-only
noncanonical fixture and SHALL NOT be treated as the final public mobile Score
Path aesthetic.

#### Scenario: A compact vertical document projects conventional notation
- **WHEN** the same semantic score is projected into `vertical-compact`
- **THEN** musical events occupy left-to-right notation-safe spans within the approved 18-degree tangent limit and vertical or steep displacement occurs only in event-free connector zones

#### Scenario: A serpentine path returns across the viewport
- **WHEN** a continuous ScorePath uses a returning span whose tangent would make notation read right-to-left or exceed the active notation-safe angle
- **THEN** that span is classified as a connector and receives no musical event placement

#### Scenario: A responsive origin contains a treble clef
- **WHEN** a clef-bearing origin is projected in any mode
- **THEN** the clef remains upright, unmirrored, unflipped, and unrotated sideways, its byte-identical approved path uses the approved `gLine` anchor, and the origin span is notation-safe

#### Scenario: A responsive branch terminates
- **WHEN** the final barline is projected in a vertical document mode
- **THEN** it remains thin vertical bar plus gap plus thick vertical bar across a locally horizontal five-line notation-safe terminal zone and is not rotated with document flow

#### Scenario: ScorePath traversal changes direction
- **WHEN** notation-safe and connector zones are assembled into one continuous path
- **THEN** `normalAt()` continues to point toward increasing pitch independently of traversal direction and the B4/staffStep-4 master-guide contract is unchanged

### Requirement: Key signatures are deterministic structural score elements
Treble key signatures SHALL support fifths `-7..+7`, SHALL use the approved accidental glyphs in canonical order/vertical positions, and SHALL be controlled outside the procedural composer.

#### Scenario: A score config uses four sharps
- **WHEN** `fifths=4`
- **THEN** the renderer places exactly F#, C#, G#, and D# at the canonical treble staffSteps with deterministic horizontal spacing

### Requirement: Final barline is a renderer primitive
The final barline SHALL consist of a thin line, configured gap, and thick line aligned through the staff local normal and SHALL NOT be represented as a repeat barline.

#### Scenario: A branch reaches its terminal score position
- **WHEN** the renderer builds the final barline at the terminal local frame
- **THEN** it emits the ordered thin stroke, clear configured gap, and thick stroke across the staff normal with no repeat dots
