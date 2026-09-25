## ADDED Requirements

### Requirement: Navigation policies share one portfolio model
`NORMAL_SCRUB`, `FAST_TRAVERSAL`, and `RESTORE_SETTLED_STATE` SHALL operate on
the same native-scroll portfolio position, chapter order, history, and focus
contracts.

#### Scenario: Manual scrolling advances the story
- **WHEN** wheel, touch, keyboard, scrollbar, or assistive scrolling changes native position
- **THEN** normal scrub remains authoritative and no parallel navigation state starts

### Requirement: Explicit distant navigation uses staff-only traversal
Only an explicit programmatic destination MAY use Fast Traversal. Composer event
presentation SHALL remain hidden until the surviving destination settles.

#### Scenario: A distant Professional destination is selected
- **WHEN** traversal begins
- **THEN** the canonical staff progresses continuously and events remain hidden until arrival

### Requirement: Cancellation and replacement use actual progress
User input, Escape, a new target, or material responsive change SHALL cancel or
replace traversal from the actual current story position.

#### Scenario: A second destination replaces the first
- **WHEN** a new surviving target is selected before arrival
- **THEN** the abandoned destination does not settle and the replacement begins from current progress

### Requirement: History restoration never invents a removed chapter
Back, forward, refresh, and valid hashes SHALL restore surviving settled state
directly. Removed hashes SHALL fall back through existing unknown-target policy.

#### Scenario: Browser history restores a portfolio chapter
- **WHEN** popstate resolves a surviving location
- **THEN** history, focus, header state, and semantic chapter ownership agree without replaying Home

### Requirement: Shortcuts resolve semantic landmark entry
Header, hash and chapter-history navigation SHALL resolve the canonical
`entryAnchor` through the current projection/native-scroll mapping. Structural
scene start, DOM center and musical entry SHALL NOT be assumed equivalent.
The destination SHALL be immediately recognizable without whole-chapter fit.

#### Scenario: Entry differs from structural start
- **WHEN** the reader chooses the chapter in the header
- **THEN** its semantic entry station lands visibly below the header with usable focus
- **AND** remaining content is reachable by continued native traversal

#### Scenario: Traversal is reduced or interrupted
- **WHEN** reduced motion, user cancellation or replacement applies
- **THEN** the same entry authority and actual native position govern immediate/short positioning or cancellation
- **AND** no stale arrival/history is committed and animated traversal never exceeds the existing 3.0-second maximum
