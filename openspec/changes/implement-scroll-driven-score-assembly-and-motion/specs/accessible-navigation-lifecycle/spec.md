## ADDED Requirements

### Requirement: Mobile header is compact, semantic, and operable
Vertical W_Flyer modes SHALL use one compact sticky row containing the real
W_Flyer/Home anchor, the active semantic chapter label, a navigation-sheet
trigger, and theme control, with interactive targets at least 44 pixels. The
chapter label SHALL derive from stable semantic ownership, SHALL be empty at
Home because W_Flyer represents Home, and SHALL NOT claim a destination before
ownership reaches it.

#### Scenario: Story ownership changes from Home to a chapter
- **WHEN** canonical semantic progress transfers to a narrative chapter
- **THEN** the compact header exposes that chapter accessibly with a non-color-only active indication while retaining one-row operability

#### Scenario: Demo is the active narrative chapter
- **WHEN** semantic ownership reaches Application Demo
- **THEN** Demo may appear as the active header label even though it is not a dedicated navigation-sheet destination

### Requirement: Mobile navigation is a Professional-first modal sheet
The complete mobile destination set SHALL appear in a dedicated sheet or
drawer ordered Home, Professional destinations, then Application destinations.
While open it SHALL contain focus, close on Escape, suppress background
interaction, and lock document scrolling only for the open interval. Active
destination semantics SHALL use `aria-current` where applicable and a visual
indicator not based on color alone.

#### Scenario: Keyboard user opens and closes without navigating
- **WHEN** the user opens the sheet, traverses its controls, and presses Escape
- **THEN** focus stays inside while open, background interaction and scroll remain unavailable only while open, the sheet closes, and focus returns deterministically to the trigger

### Requirement: Menu interaction is isolated from canonical story state
Opening, closing, theme-changing, or interacting with the sheet SHALL NOT
change story progress, active semantic chapter, Composer output, or score
Projection. Selecting a destination SHALL close the sheet and reuse the
canonical story navigation controller; no separate mobile teleport or motion
clock is permitted.

#### Scenario: User changes theme while the sheet is open
- **WHEN** the theme control is activated from an open navigation sheet
- **THEN** the sheet and semantic story state remain stable and neither score composition nor geometry is regenerated

#### Scenario: User selects a destination
- **WHEN** an enabled sheet destination is activated
- **THEN** the sheet closes, canonical navigation begins from actual story progress, and destination focus follows the existing canonical focus contract after settlement

### Requirement: Navigation teardown and restoration are recoverable
Leaving mobile-navigation mode while the sheet is open SHALL close it and
release focus containment, inert/background suppression, and scroll lock before
the next header mode is established. Back, Forward, refresh, deep link, and
browser restoration SHALL resolve directly to a settled semantic header state.

#### Scenario: Viewport leaves mobile mode with the sheet open
- **WHEN** a material responsive change selects a non-mobile header
- **THEN** the sheet closes idempotently, all modal resources are released, and the new header reflects actual semantic ownership without story replay
