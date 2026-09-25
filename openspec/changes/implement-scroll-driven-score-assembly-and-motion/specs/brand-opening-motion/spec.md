## ADDED Requirements

### Requirement: Home is the single musical and spatial origin
Home SHALL introduce one portfolio staff and one Professional/Portfolio path.
It SHALL NOT present branch selection, an Application CTA, a second staff, or a
hidden compatibility direction.

#### Scenario: A first visit reaches Home
- **WHEN** the opening presentation completes or is skipped
- **THEN** one five-line portfolio score and the surviving professional actions are available

### Requirement: Home remains usable when motion is unavailable
Readiness failure, timeout, reduced motion, skip, or missing GSAP SHALL release
semantic content, focus, native scroll, and navigation.

#### Scenario: Opening initialization fails
- **WHEN** the cinematic cannot complete
- **THEN** Home fails open with the portfolio path usable and no stale inert or scroll lock

### Requirement: Deep links do not replay the opening
A valid Professional deep link or history restoration SHALL settle at the
requested chapter without replaying Home entry.

#### Scenario: The page loads with a surviving chapter hash
- **WHEN** readiness resolves the hash
- **THEN** the matching chapter owns semantic state directly and Home entry remains complete
