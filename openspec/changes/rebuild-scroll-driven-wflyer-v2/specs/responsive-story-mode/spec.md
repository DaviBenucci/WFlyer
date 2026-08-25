# responsive-story-mode Specification

## ADDED Requirements

### Requirement: Vertical story is universal fallback
In mobile, reduced-motion, insufficient-height/width, touch/context-ineligible, or motion-failure conditions, the site SHALL render a normal vertical document in the approved professional-first order.

#### Scenario: Horizontal enhancement is unavailable
- **WHEN** motion is reduced, fails, or the viewport/input context is ineligible
- **THEN** every chapter remains readable and navigable in the approved professional-first vertical order

### Requirement: Mode changes preserve semantic chapter
A responsive rebuild SHALL capture the active chapter, clean owned resources, build the new mode, and restore the equivalent chapter without recomposing the session score.

#### Scenario: Responsive eligibility changes
- **WHEN** the presentation rebuilds into another responsive mode
- **THEN** it restores the same semantic chapter and score composition after cleaning the previous mode's owned resources
