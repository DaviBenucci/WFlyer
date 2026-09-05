## Purpose

Define the bounded successor refinements, geometry approval/refreeze boundary,
and Projection metadata for the continuous dual score without owning motion.

## ADDED Requirements

### Requirement: Successor geometry scope is limited to five registered deltas
Before motion integration, Projection SHALL change Phase-9 geometry only as
required by `ASM-LAYOUT-DELTA-001..005`. Unrelated Professional, Application,
responsive, origin, terminal, card, content-clearance, or composition behavior
SHALL remain frozen unless a separately proven defect triggers the canonical
stop-and-review process.

#### Scenario: An unrelated geometry improvement is proposed
- **WHEN** implementation identifies a desirable geometry change outside the five registered deltas
- **THEN** work stops for an explicit decision and the change is not folded silently into successor stabilization

### Requirement: Application terminal continues naturally to a conventional final shelf
The Application terminal SHALL remove the unnecessary large return/U-turn and
remain on the spatial continuation of its branch while ending on a locally
left-to-right `EVENT_SAFE_STRAIGHT` shelf with the conventional final barline.
The resulting path SHALL preserve content clearance, continuity, and zero path
or staff-line self-intersections.

#### Scenario: Application reaches its terminal
- **WHEN** the final Application score region is projected in a supported mode
- **THEN** it reads as the natural branch continuation without a return loop, its last event shelf reads left-to-right, and the canonical final barline physically terminates the score

### Requirement: Benefits to Demo uses a broad event-free corridor
The Application Benefits↔Demo transition SHALL prefer direct or broad
low-curvature continuity, contain zero Composer-backed events, avoid compressed
decorative folds, preserve Benefits/tablet clearances, and resume events only
on the next `EVENT_SAFE_STRAIGHT` shelf. Demo↔Launch continuity SHALL remain
protected while this corridor changes.

#### Scenario: Application crosses from Benefits toward Demo
- **WHEN** both scenes expose a compatible unobstructed corridor
- **THEN** one broad predominantly direct event-free transition connects them without squeezed staff, protected-content collision, or early event resumption

### Requirement: Professional shelf utilization uses existing composition first
Projection SHALL distribute existing ordered semantic event groups more
effectively across long Professional `EVENT_SAFE_STRAIGHT` shelves while
preserving rhythm, motif identity, pitch/accidental/beam/tuplet/ledger/key
semantics, seed, and reference fingerprints. It SHALL NOT duplicate or invent
notes to fill space.

#### Scenario: Existing events can improve a long shelf
- **WHEN** a long Professional safe shelf can use existing event groups more effectively
- **THEN** physical allocation improves while semantic order, group identity, and composition fingerprints remain unchanged

#### Scenario: Adequate density requires new semantic events
- **WHEN** the approved optical result cannot be achieved from the existing canonical composition
- **THEN** Stage 1 stops and requests a separate explicit Composer-version decision without duplicating, synthesizing, or silently changing an event

### Requirement: Home exposes exact canonical entry geometry before Scenic motion
Stage-1 geometry SHALL replace the structural Home placeholder only to the extent
needed to expose deterministic branch `CANONICAL_ENTRY_ANCHOR` geometry and the
future Scenic-to-canonical match. Final Home Scenic motion SHALL remain deferred
until after geometry approval/refreeze and the canonical Home stage.

#### Scenario: Home geometry reaches human review
- **WHEN** the Stage-1 Home candidate is captured
- **THEN** both branch entry anchors and their event-free canonical lead-ins are deterministic and reviewable without any final Home motion being implemented

### Requirement: Geometry evidence is human-approved and refrozen separately
Stage 1 SHALL automatically verify continuity, tangent/event zoning, zero path
and staff intersections, protected-content clearance, final barlines, and
responsive behavior, then capture Application terminal, Benefits↔Demo,
Demo↔Launch, representative Professional shelves, Home entry geometry, and
representative responsive modes. Explicit human approval SHALL precede a
successor-only sealed manifest/digest and geometry freeze.

#### Scenario: Required geometry evidence is incomplete
- **WHEN** any required view, invariant, or explicit human decision is missing
- **THEN** geometry remains unfrozen and Stage 3 and later implementation stay blocked

### Requirement: Projection exposes stable metadata without motion ownership
After refreeze, Projection SHALL expose deterministic zone types,
`CANONICAL_ENTRY_ANCHOR`, `EVENT_SAFE_STRAIGHT`, `EVENT_FREE_CURVED`, event-free
connectors, Assembly intervals, draw metrics, and reveal-anchor references.
Projection SHALL NOT create GSAP timelines, navigation state, or per-frame
presentation calculations, and adding metadata SHALL not change approved visual
geometry.

#### Scenario: Motion consumes a refrozen projection
- **WHEN** a downstream pure motion model receives Projection output
- **THEN** it can resolve precomputed draw, Assembly, and reveal state from stable metadata without rebuilding geometry or querying layout per frame
