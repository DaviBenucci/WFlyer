## ADDED Requirements

### Requirement: Scenographic shared origin
The immersive story SHALL render exactly one approved, unmirrored, unrotated treble-clef asset as a substantially enlarged Home origin while preserving one shared semantic origin and the unchanged branch compositions. Both branch paths MUST depart below or around the clef's lower region and MUST remain outside the primary Home reading exclusion.

#### Scenario: Home origin is reviewed on desktop
- **WHEN** the horizontal-enhanced Home scene is rendered
- **THEN** one large treble clef is visually aligned to two lower branch departures and neither five-line path intersects the primary Home copy region

#### Scenario: Origin adapts without semantic drift
- **WHEN** the story projects the origin in horizontal, wide vertical, compact vertical, or static/reduced-motion mode
- **THEN** the origin remains one semantic point with the same two compositions, approved asset, orientation, and deterministic serialization

### Requirement: Content-aware score zones
The projection SHALL declare scene-specific exclusion and interaction zones. Exclusion zones MUST protect readable or interactive content; expressive Organic Flowing turns MUST use lower or outer negative space instead of wrapping tightly around protected content. Interaction zones MAY alter the visual five-line envelope and opacity behind foreground components but MUST contain zero musical events whenever their local geometry is not notation-safe.

#### Scenario: Shared card interaction
- **WHEN** the score approaches, crosses, and leaves Professional Services or Application How It Works
- **THEN** both scenes use the same eased canonical-to-lead-in-to-expanded-to-lead-out-to-canonical grammar, begin before the first card, finish after the last card, progressively spread all five lines and attenuate opacity behind foreground cards, and contain zero events throughout every non-canonical span

#### Scenario: Interaction transition is measured
- **WHEN** a horizontal card interaction is projected from rendered card bounds
- **THEN** its lead-in and lead-out are each initially at least the greater of eight staff spaces and one quarter of the nearest card width, with deterministic measured lengths recorded for review

#### Scenario: Protected scenes
- **WHEN** the score crosses Home, About, Process, Contact, Application Overview, Benefits, Demonstration, Launch, or a terminal
- **THEN** the path stays in that scene's approved safe corridor and does not cover protected copy, controls, Persona reservation, project text, Contact form, tablet, launch form, or terminal navigation

### Requirement: Project visitation and event-safe connectors
The horizontal Professional Projects projection SHALL associate the score with all three project-card regions through an alternating serpentine. Steep ascent or descent spans MUST be classified as true connectors with zero musical events, while events MUST occur only where the absolute local tangent is at most 18 degrees.

#### Scenario: Three-card serpentine
- **WHEN** Projects is rendered in horizontal-enhanced mode
- **THEN** the score derives one visit anchor from each rendered card's center and safe perimeter, enters low, rises toward each card in order to establish three visually distinct notation-safe presentation shelves, descends through a true event-free connector between visits, remains behind the cards, and exits toward Contact without a path or five-line self-intersection

#### Scenario: Responsive simplification
- **WHEN** Projects is rendered in a vertical or static mode
- **THEN** its physical route may be less dramatic but preserves continuity, card association, event-free connectors, the same semantic slots, and the same composition fingerprint

### Requirement: Physical branch termination
Each branch SHALL end with its final notation-safe region followed by the canonical thin line, gap, and thick final line at the physical end of the score. No staff, connector, guide, event, stem, beam, or other musical primitive may occur after the thick line.

#### Scenario: Branch reaches its final barline
- **WHEN** either branch terminal is inspected
- **THEN** the last two primitives are the canonical thin and thick final barlines and no score primitive exists after them

### Requirement: Chapter barlines require metric proof
Every non-terminal chapter exit SHALL be classified against the unchanged semantic composition as `VALID_MEASURE_BOUNDARY` or `NOT_A_MEASURE_BOUNDARY`. A valid boundary MAY render exactly one ordinary single barline perpendicular to the last notation-safe local staff before its connector. A non-boundary MUST render no chapter barline, MUST NOT alter event durations, motifs, Composer output, or fingerprints, and SHALL be reported as `CHAPTER_BARLINE_REQUIRES_COMPOSITION_DECISION`.

#### Scenario: Chapter exit is a valid measure boundary
- **WHEN** unchanged composition timing proves that the chapter exit completes a metric measure
- **THEN** one ordinary five-line barline appears after the chapter's last event-safe notation and before the true connector

#### Scenario: Chapter exit is not a measure boundary
- **WHEN** unchanged composition timing does not prove a metric measure boundary
- **THEN** no ordinary chapter barline is rendered and the review evidence records `CHAPTER_BARLINE_REQUIRES_COMPOSITION_DECISION`
