# scroll-driven-portfolio-landing Specification

## Requirement: Native scroll is canonical
The landing SHALL derive story progress from native vertical scroll and SHALL NOT use global wheel/touch prevention as a story driver.

### Scenario: Partial trackpad movement
- **WHEN** the user produces partial inertial scroll
- **THEN** the story advances partially without mandatory chapter snap

## Requirement: Home is the branch origin
Home SHALL be positioned from real branch lengths and SHALL permit upward travel to Application and downward travel to Professional.

## Requirement: Header traversal uses the same story
Header navigation SHALL traverse intermediate chapters using the same canonical progress, remain interruptible, and never exceed 3.0 seconds for an extreme traversal.

## Requirement: Detailed routes remain independent
Every detailed route SHALL render independently of the landing timeline and remain navigable when motion or JavaScript is unavailable.
