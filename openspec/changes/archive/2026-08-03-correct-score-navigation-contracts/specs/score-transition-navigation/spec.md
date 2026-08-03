## ADDED Requirements

### Requirement: Explicit native navigation opt-out
Any anchor inside the site experience MAY declare that its activation MUST remain native and MUST NOT be intercepted by the score-transition coordinator, without changing the behavior of other eligible chapter links.

#### Scenario: Anchor owns its activation
- **WHEN** an otherwise eligible main-chapter anchor declares the documented native-navigation opt-out
- **THEN** the coordinator leaves the event and browser history untouched and creates no transition request, overlay, timer, or animation

## MODIFIED Requirements

### Requirement: Concurrent navigation is bounded and recoverable
The site MUST retain at most one pending destination, SHALL cleanly supersede or cancel stale animation work, and MUST preserve every main chapter that has already committed and become available as a distinct browser-history entry.

#### Scenario: Rapid valid navigation
- **GIVEN** a transition has not consolidated
- **WHEN** another eligible destination is activated before the first destination commits
- **THEN** the latest valid destination supersedes pending work without an unbounded queue, orphaned overlay, or artificial intermediate history entry

#### Scenario: Visitor continues after destination commit
- **GIVEN** the first destination has committed while its incoming animation is still active
- **WHEN** the visitor activates another eligible main chapter
- **THEN** the committed destination remains in history and Back returns to it before returning to the original source chapter

#### Scenario: Interrupted transition
- **GIVEN** a running timeline
- **WHEN** the component unmounts, motion preference changes, or a newer request invalidates it
- **THEN** stale callbacks, timers, listeners, inline styles, and animation instances are cleaned exactly once
