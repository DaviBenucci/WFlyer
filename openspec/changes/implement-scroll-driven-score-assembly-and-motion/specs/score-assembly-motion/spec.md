## ADDED Requirements

### Requirement: Geometry stabilization precedes motion
Stage 1 SHALL implement the ADR-057 continuous spatial target, including its
minimal spatial span/anchor metadata, preserve general safety and prior evidence,
and produce fresh target validation before explicit Human Geometry Approval.
Later temporal draw/reveal/Assembly metadata SHALL remain behind refreeze.

#### Scenario: Automated Stage-1 checks pass
- **WHEN** deterministic geometry, hydration, Projects, accessibility, and responsive checks pass
- **THEN** the change remains blocked at Human Geometry Approval and Stage 2 does not begin

### Requirement: Assembly is deterministic and event-free
Assembly SHALL resolve reversible state from semantic progress and precomputed
Projection metadata. Composer events SHALL be absent from every Assembly
transition and forbidden score region.

#### Scenario: A user reverses inside an Assembly interval
- **WHEN** forward and reverse travel return to the same semantic progress
- **THEN** geometry, visibility, opacity, and event-free state match deterministically

### Requirement: Projects remains NON-ASSEMBLY
Projects SHALL remain NON-ASSEMBLY. The full fan SHALL retain three distinct
visits, event-free connectors, complete capacity/ink/interaction safety wherever
it exists. The one-teaser vertical implementation SHALL be retained as
transitional evidence, not frozen as the final continuous-story requirement.

#### Scenario: The Projects target disposition is recorded
- **WHEN** continuous-story implementation selects sequential or retained fan presentation
- **THEN** all required content and interactions remain reachable and general safety passes
- **AND** retained fan states keep their complete prior contract and no route is invented

### Requirement: GSAP remains the sole temporal presentation authority
The existing native-scroll master timeline SHALL remain authoritative. Ordinary
scrub SHALL perform no per-frame Composer call, Projection build, ordinary DOM
measurement, or React state clock.

#### Scenario: Native scroll changes progress
- **WHEN** the user advances the story normally
- **THEN** GSAP interpolates precomputed state and structural counters do not increase per frame

### Requirement: Runtime failure is fail-open and resource-stable
The story root SHALL own initialization, rebuild, traversal, observers,
listeners, timers, focus/scroll locks, and teardown. Repeated cleanup SHALL be
safe and failures SHALL leave content and native interaction usable.

#### Scenario: Initialization or teardown fails midway
- **WHEN** motion cannot continue
- **THEN** the portfolio remains readable and operable with no hidden content, stale lock, or orphan owner

### Requirement: Completion requires fresh successor evidence and human review
Final unit, browser, accessibility, reduced-motion, performance, lifecycle, and
determinism validation SHALL cover Chromium, Firefox, and WebKit. Historical
evidence SHALL remain immutable and cannot substitute for current evidence.

#### Scenario: Automated final gates pass
- **WHEN** all supported-engine checks and successor captures pass
- **THEN** completion still requires sealed successor evidence and explicit final human homologation
