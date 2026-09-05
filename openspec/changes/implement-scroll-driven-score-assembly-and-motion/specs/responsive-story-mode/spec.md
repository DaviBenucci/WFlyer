## Purpose

Define semantic continuity, locally conventional score geometry, state
preservation, and reduced-motion behavior across successor responsive modes.

## ADDED Requirements

### Requirement: Mobile story is Professional-first and branch-separated
Vertical modes SHALL present Home, a continuous Professional serpentine score,
the Professional final barline, an event-free inter-branch transition, a
continuous Application serpentine score, the Application final barline, and
one global footer in that order. Each branch SHALL terminate independently and
Application SHALL NOT begin before Professional has reached its final barline.

#### Scenario: A compact viewport traverses the complete story
- **WHEN** the user follows native document flow from Home to the footer
- **THEN** Professional is encountered first, both branch final barlines remain conventional and distinct, and only one global footer follows Application

### Requirement: Vertical flow preserves locally left-to-right notation
Each event-bearing mobile shelf SHALL read locally left-to-right and be
horizontal or gently inclined. Side repositioning SHALL occur only through an
event-free `TRUE_CONNECTOR` or authorized Assembly; vertical musical notation
and Composer-backed events on mobile connectors are prohibited.

#### Scenario: A mobile branch changes side
- **WHEN** its serpentine staff moves from one event shelf to the next
- **THEN** the connecting turn contains no Composer-backed event and the next event shelf resumes locally left-to-right notation

### Requirement: Responsive rebuild preserves semantic state without replay
Transitions among `horizontal-enhanced`, `vertical-wide`, and
`vertical-compact` SHALL preserve session seed, Composer output, active semantic
chapter, logical story progress, and Assembly semantic state. Projection and
presentation MAY adapt; vertical-wide and vertical-compact SHALL reduce Scenic
and Structural geometric complexity. Home entry and chapter Assembly SHALL NOT
replay.

#### Scenario: A material mode change occurs during an active chapter
- **WHEN** viewport change requires a new responsive projection
- **THEN** one bounded rebuild settles at equivalent semantic progress with the same composition and chapter ownership and without replaying prior Assembly

### Requirement: Responsive Assembly preserves semantic equivalence
Vertical-wide and vertical-compact modes SHALL reduce physical Scenic and
Structural geometric complexity while preserving the same scene classification,
content relationships, event-free Assembly intervals, protected-content
clearance, and final semantic states as desktop.

#### Scenario: An authorized structural scene becomes compact
- **WHEN** Services or How It Works is presented in vertical-compact mode
- **THEN** its geometric complexity is reduced while its canonical content order, Assembly meaning, event exclusion, and usable settled result remain equivalent

### Requirement: Reduced motion preserves the complete functional product
The reduced-motion presentation SHALL remove or substantially reduce prolonged
staff writing, decorative glyph movement, Assembly separation, docking,
stagger, atmosphere, and intermediate traversal animation while preserving
content, score semantics, branch structure, navigation, history, deep links,
forms, focus, active chapter, state feedback, final barlines, and responsive
continuity.

#### Scenario: Reduced motion is requested before initialization
- **WHEN** the story initializes with reduced motion enabled
- **THEN** every destination and final semantic state remains available through direct or minimal settlement without functional loss or required cinematic playback
