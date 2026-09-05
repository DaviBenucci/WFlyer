## ADDED Requirements

### Requirement: Composer events require whole-footprint event-safe straight geometry
The renderer SHALL present a Composer-backed event group only when its complete
visual footprint, plus an initial safety margin of `1.5 × staffSpace` on each
side, lies inside deterministic `EVENT_SAFE_STRAIGHT`. Across that footprint the
staff SHALL read left-to-right, tangent magnitude SHALL remain at most 18
degrees, tangent variation SHALL remain at most 6 degrees, and no direction
reversal or overlap with `TRUE_CONNECTOR`, `EVENT_FREE_CURVED`, or
`ASSEMBLY_TRANSITION` is permitted. The margin is a human-review calibration
value and SHALL NOT be weakened merely to make a failing event fit.

#### Scenario: Complete event group fits a straight shelf
- **WHEN** noteheads, stems, flags or beams, accidentals, tuplets, and ledger lines plus both safety margins satisfy every straight-shelf condition
- **THEN** the event group is eligible for one coherent Composer-backed presentation at its deterministic anchor

#### Scenario: Event center passes but its footprint approaches a turn
- **WHEN** an event's center is under the 18-degree tangent limit but any attached primitive or safety margin reaches a turn, reversal, connector, curved interval, or Assembly interval
- **THEN** the complete event group is not eligible there and no partial musical event is presented in that region

#### Scenario: Projection is rebuilt deterministically
- **WHEN** equivalent composition and layout inputs produce the same responsive projection
- **THEN** `EVENT_SAFE_STRAIGHT` and `EVENT_FREE_CURVED` classifications and eligible event anchors are identical
