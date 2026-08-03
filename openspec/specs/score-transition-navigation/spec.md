# score-transition-navigation Specification

## Purpose

Provide predictable visual continuity between chapters of the double score
without rendering intermediate route content or exceeding the motion budget.

## Requirements

### Requirement: Transition topology is deterministic
The site SHALL resolve transition mode and direction exclusively from the
normative metadata of the source and destination routes.

#### Scenario: Adjacent application chapters
- **GIVEN** Home, Application, How It Works, and Benefits occupy coordinates 0, -1, -2, and -3
- **WHEN** navigation moves between neighboring coordinates in that sequence
- **THEN** the mode is `adjacent-score` and forward travel advances left

#### Scenario: Adjacent institutional chapters
- **GIVEN** Home, Company, Services, Process, Portfolio, and Contact occupy coordinates 0 through 5
- **WHEN** navigation moves between neighboring coordinates in that sequence
- **THEN** the mode is `adjacent-score` and forward travel advances right

#### Scenario: Previous navigation reverses direction
- **GIVEN** two adjacent chapters in one branch
- **WHEN** navigation moves toward the lower-order chapter
- **THEN** `adjacent-score` uses the reverse spatial direction

#### Scenario: Non-adjacent chapter in one branch
- **GIVEN** known source and destination chapters in the same branch
- **WHEN** their absolute coordinate difference is greater than one
- **THEN** the mode is `compressed-score-jump` and preserves the coordinate direction

#### Scenario: Chapters in different main branches
- **GIVEN** source and destination belong to different non-origin branches
- **WHEN** navigation is classified
- **THEN** the mode is `home-pivot` and Home is only a conceptual pivot

#### Scenario: Home and a branch chapter
- **GIVEN** exactly one endpoint is Home and the other belongs to a main branch
- **WHEN** navigation is classified
- **THEN** Home adopts the other endpoint's effective branch, distance one is `adjacent-score`, and greater distance is `compressed-score-jump`

#### Scenario: Unknown, auxiliary, or unchanged route
- **GIVEN** either endpoint is not a main chapter or both endpoints identify the same route
- **WHEN** a visual route change is evaluated
- **THEN** the mode is `neutral` with no declared score direction

### Requirement: Every mode preserves its approved visual meaning
The site SHALL distinguish adjacent continuity, compressed distance, Home-pivot
travel, and neutral replacement without screenshots, intermediate pages,
randomly generated notes, or a second motion engine.

#### Scenario: Adjacent score continuity
- **GIVEN** the mode is `adjacent-score`
- **WHEN** the transition runs
- **THEN** a temporary vector segment connects the measured outgoing score anchor to the incoming score anchor

#### Scenario: Compressed jump
- **GIVEN** the mode is `compressed-score-jump`
- **WHEN** the transition runs
- **THEN** one compact abstract segment communicates distance without mounting or announcing intermediate pages

#### Scenario: Home pivot
- **GIVEN** the mode is `home-pivot`
- **WHEN** full motion is permitted
- **THEN** overlapping phases converge on and depart from the central pivot without directly connecting the two branches

#### Scenario: Neutral replacement
- **GIVEN** the mode is `neutral`
- **WHEN** a visual replacement is possible
- **THEN** it uses a direct replacement or crossfade lasting no more than 220 ms

#### Scenario: Bounded decorative complexity
- **GIVEN** any full-motion transition
- **WHEN** its overlay is visible
- **THEN** no more than two score segments and eight moving notes are present and only transform, opacity, and stroke drawing are animated

### Requirement: Transition time is bounded
Adjacent and compressed full-motion navigation SHALL target 620–820 ms,
Home-pivot navigation SHALL target 760–900 ms, every animated lifecycle MUST
finish within 900 ms, and recovery MUST release a usable destination within
1,100 ms.

#### Scenario: Long compressed distance
- **GIVEN** a compressed jump spanning multiple chapters
- **WHEN** its timeline runs
- **THEN** duration remains constant rather than growing with chapter count

#### Scenario: Cross-branch upper bound
- **GIVEN** a Home-pivot transition
- **WHEN** its phases overlap
- **THEN** the visual lifecycle lasts 760–900 ms and never exceeds 900 ms

#### Scenario: Preparation budget
- **GIVEN** an eligible navigation request
- **WHEN** the source anchor is measured and the route request is prepared
- **THEN** the route request begins within 100 ms

#### Scenario: Timeline or measurement failure
- **GIVEN** an exception, missing measurement, or unavailable decorative asset
- **WHEN** coordinated animation cannot continue
- **THEN** temporary styles and overlay are cleared and the destination becomes usable within 1,100 ms

### Requirement: Explicit native navigation opt-out
Any anchor inside the site experience MAY declare that its activation MUST remain native and MUST NOT be intercepted by the score-transition coordinator, without changing the behavior of other eligible chapter links.

#### Scenario: Anchor owns its activation
- **WHEN** an otherwise eligible main-chapter anchor declares the documented native-navigation opt-out
- **THEN** the coordinator leaves the event and browser history untouched and creates no transition request, overlay, timer, or animation

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

### Requirement: Persistent chrome and theme remain coherent
The header, central Home symbol, current page, and transition layer SHALL remain
coherent throughout navigation in both approved themes.

#### Scenario: Header state after transition
- **GIVEN** a route transition completes
- **WHEN** the destination becomes current
- **THEN** the correct branch and chapter navigation item are active and Process remains represented by Services

#### Scenario: Home symbol during cross-branch travel
- **GIVEN** a Home-pivot transition
- **WHEN** the overlay reaches its pivot phase
- **THEN** the persistent central Home symbol remains operable and supplies the conceptual visual pivot

#### Scenario: Theme toggle during transition
- **GIVEN** a transition is active
- **WHEN** the theme is toggled
- **THEN** persistent chrome, overlay, and incoming page use the new theme without geometry changes or an incorrect-theme frame

### Requirement: Terminal and responsive states preserve score semantics
Benefits SHALL terminate the application branch and Contact SHALL terminate the
institutional branch with the approved double final barline in every supported
viewport and motion preference.

#### Scenario: Benefits terminal state
- **GIVEN** the Benefits route in either theme
- **WHEN** it renders on desktop or mobile
- **THEN** one start-side final barline is shown, no false next chapter exists, and previous/header navigation remains available

#### Scenario: Contact terminal state
- **GIVEN** the Contact route in either theme
- **WHEN** it renders on desktop or mobile
- **THEN** one end-side final barline is shown, no false next chapter exists, and previous/header navigation remains available

#### Scenario: Mobile full-motion navigation
- **GIVEN** a viewport narrower than 768 px without reduced motion
- **WHEN** a score transition runs
- **THEN** the simplified model uses opacity plus only 8–16 px of directional translation and creates no long lateral travel, horizontal overflow, viewport-height failure, or scroll lock

### Requirement: Transition checkpoints are deterministically testable
Non-production test runs SHALL expose deterministic transition metadata and
controllable start, midpoint, and completion checkpoints without relying on
randomness or public query parameters.

#### Scenario: Frozen visual checkpoint
- **GIVEN** the internal test controller is enabled outside production
- **WHEN** a start, midpoint, or completion checkpoint is requested
- **THEN** the phase is observable through stable `data-*` metadata and the decorative geometry is deterministic
