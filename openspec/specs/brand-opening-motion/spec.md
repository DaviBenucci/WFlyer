# brand-opening-motion Specification

## Purpose

Present the approved W_Flyer identity once per browser session through a recoverable, accessible vector opening while preserving the already-rendered Home and its navigation.

## Requirements

### Requirement: Eligible first-session opening
The opening SHALL run only on the Home route when the session completion key is absent, SHALL leave Home rendered behind its overlay, and SHALL record completion after finish, skip, reduced motion, or recovery.

#### Scenario: First Home visit
- **WHEN** a visitor opens Home without `wflyer.brand-intro.completed.v1`
- **THEN** the official opening becomes active above the already-rendered Home and does not run again during that session

### Requirement: Approved vector choreography
The full opening SHALL use only approved immutable SVG geometry and authorized GSAP eases, SHALL expose the normative labels from 0.000 through 5.600 seconds, and SHALL end in the same visible Home/header state as a direct completed session.

#### Scenario: Timeline completes
- **WHEN** the full 5.600-second sequence reaches `hero:ready`
- **THEN** the overlay and temporary styles are removed and header, hero, branches, and controls are interactive

### Requirement: Accessible interruption and reduced motion
The opening SHALL provide a native 44 by 44 pixel skip control reachable by keyboard, SHALL treat Escape equivalently, and SHALL use the direct final Home state without modular motion when reduced motion is requested.

#### Scenario: Visitor skips
- **WHEN** the visitor activates `Pular introdução` or presses Escape
- **THEN** the final Home state is applied, scroll and interaction are released, and focus is not moved into the hero

#### Scenario: Reduced motion visit
- **WHEN** reduced motion is active on an eligible Home visit
- **THEN** the final Home state is rendered directly without mounting or locking an opening overlay

### Requirement: Fail-open recovery and cleanup
An asset, animation, timeout, visibility, resize, orientation, or teardown failure MUST release the overlay and page locks, kill active timelines, remove listeners and temporary styles, and show functional Home without automatic replay.

#### Scenario: Opening cannot finish
- **WHEN** the SVG is unavailable or the safety deadline is exceeded
- **THEN** Home becomes interactive promptly and the session is marked complete without a substitute logo or sensitive log

### Requirement: Finite local reveals
Page-local hero, card, note, score, and final-barline reveals SHALL use finite transform/opacity choreography, SHALL preserve semantic DOM and focus behavior, and SHALL become direct final states for reduced motion or missing GSAP.

#### Scenario: Content enters viewport
- **WHEN** an approved reveal target becomes relevant
- **THEN** it reaches its final readable state once without blocking scroll, links, or assistive technology
