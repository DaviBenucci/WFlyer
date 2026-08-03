## MODIFIED Requirements

### Requirement: Approved vector choreography
The full opening SHALL use only approved immutable SVG geometry and authorized GSAP eases, SHALL expose the normative labels from 0.000 through 5.600 seconds, SHALL reveal the header score and Home score from their origin before the narrative clef, branch copy, actions, and exploration cue in the documented order, and SHALL end in the same visible Home/header state as a direct completed session. Branch copy MUST travel no more than 20 px from its respective side.

#### Scenario: Timeline completes
- **WHEN** the full 5.600-second sequence reaches `hero:ready`
- **THEN** the overlay and every temporary inline style are removed and header, hero, branches, and controls are visible and interactive in their normal final state

#### Scenario: Home opening interval is inspected
- **WHEN** deterministic checkpoints are inspected between `hero:start` at 4.250 seconds and `hero:ready` at 5.600 seconds
- **THEN** score/header geometry appears first, the narrative clef follows, application copy enters from the left and institutional copy from the right, actions follow their copy, and the exploration cue appears last without layout-sized animation

### Requirement: Accessible interruption and reduced motion
The opening SHALL provide a native 44 by 44 pixel skip control reachable by keyboard, SHALL make persistent site controls behind the active overlay temporarily inert so the skip control is the only operable element, SHALL treat Escape equivalently, and SHALL use the direct final Home state without modular motion when reduced motion is requested.

#### Scenario: Visitor skips
- **WHEN** the visitor activates `Pular introdução` or presses Escape
- **THEN** the final Home state is applied, scroll and interaction are released, prior sibling accessibility/interaction attributes are restored, and focus is not moved into the hero

#### Scenario: Active overlay receives keyboard navigation
- **WHEN** the full opening is active and the visitor navigates by keyboard
- **THEN** header, Home, and footer controls cannot receive focus and the native skip button remains reachable and operable

#### Scenario: Reduced motion visit
- **WHEN** reduced motion is active on an eligible Home visit
- **THEN** the final Home state is rendered directly without mounting or locking an opening overlay

### Requirement: Fail-open recovery and cleanup
An asset, animation, timeout, visibility, resize, orientation, or teardown failure MUST release the overlay and page locks, kill active timelines, remove listeners, restore prior sibling interaction/accessibility attributes, clear temporary Home/header inline styles, and show functional Home without automatic replay.

#### Scenario: Opening cannot finish
- **WHEN** the SVG is unavailable or the safety deadline is exceeded
- **THEN** Home becomes interactive promptly, has no hidden or transformed opening target, and the session is marked complete without a substitute logo or sensitive log
