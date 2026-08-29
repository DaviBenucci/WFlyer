# brand-opening-motion Specification — v2

## Purpose

Present the approved W_Flyer identity through a session-bounded, readiness-driven, skippable, fail-open opening that positions Home/deep-link/history state before revealing the story.

## Requirements

### Requirement: Readiness controls exit
The opening SHALL NOT use elapsed time alone as readiness. Critical layout/assets/story initialization and initial target positioning SHALL complete before exit, subject to a fail-open timeout.

#### Scenario: Opening waits for real readiness
- **WHEN** elapsed time has passed but critical initialization or initial positioning is incomplete
- **THEN** the opening remains until readiness completes or the fail-open timeout releases the page

### Requirement: Deep links position before reveal
A valid landing hash or reliable history position SHALL be applied before the overlay exits and SHALL not require cinematic travel from Home.

#### Scenario: Session opens on a valid deep link
- **WHEN** a valid landing hash or reliable history position is present
- **THEN** that position is applied before the overlay exits without cinematic travel from Home

### Requirement: Noncritical media never blocks readiness
Demo video, distant project media, and optional easter-egg assets SHALL not block `STORY_READY`.

#### Scenario: Optional media is delayed or missing
- **WHEN** demo, distant project, or optional easter-egg media is delayed or unavailable
- **THEN** `STORY_READY` is not blocked by that media

### Requirement: Skip/reduced/failure release the page
Skip, Escape, reduced motion, timeout, asset failure, resize, visibility, and teardown SHALL restore a functional page and clean owned resources.

#### Scenario: Opening is interrupted or degraded
- **WHEN** skip, Escape, reduced motion, timeout, asset failure, resize, visibility change, or teardown interrupts the opening
- **THEN** a functional page is restored and all opening-owned resources are cleaned
