# accessible-navigation-lifecycle Specification

## Purpose
Preserve native navigation semantics, focus, browser history, deep links, and
motion preferences while coordinating transitions between institutional pages.
## Requirements
### Requirement: Only eligible same-tab chapter links are intercepted
The site SHALL preserve native behavior for any navigation that is not an
unmodified primary activation between main chapters in the current browsing
context.

#### Scenario: Eligible chapter link by pointer
- **GIVEN** a same-origin link to a different main chapter with no modifier, download, target, or hash-only destination
- **WHEN** it receives a primary pointer activation
- **THEN** the coordinated lifecycle may intercept it and commits the requested URL once

#### Scenario: Eligible chapter link by keyboard
- **GIVEN** the same eligible link has keyboard focus
- **WHEN** Enter activates it
- **THEN** it reaches the same destination and uses the same post-navigation focus policy as pointer activation

#### Scenario: Native link categories
- **GIVEN** an external, auxiliary, download, hash-only, modified, secondary-button, or new-context link
- **WHEN** it is activated
- **THEN** the browser keeps native behavior without a full chapter transition

#### Scenario: Public application CTA
- **GIVEN** the CTA points to `app.wflyer.com.br`
- **WHEN** it is activated
- **THEN** no transition delay or interception blocks its normal external opening

### Requirement: Direct routes and no-JavaScript navigation remain valid
Every public route SHALL render independently, and every real link MUST remain
navigable when the transition coordinator is unavailable.

#### Scenario: Direct deep link
- **GIVEN** an internal URL is loaded without a known source route
- **WHEN** the server response and client hydration complete
- **THEN** content, current header state, score metadata, and terminal state render without a prior timeline or session state

#### Scenario: JavaScript unavailable
- **GIVEN** JavaScript is disabled or hydration fails
- **WHEN** a real internal link is activated
- **THEN** the browser loads the destination URL normally

#### Scenario: Auxiliary route
- **GIVEN** navigation targets a legal page or service detail
- **WHEN** the route loads
- **THEN** it retains auxiliary score semantics and does not create a false main chapter

### Requirement: Browser history remains truthful
The site MUST commit only requested destinations and SHALL handle Back and
Forward without duplicate route changes, false pivots, loops, or stale visual
state.

#### Scenario: Home-pivot history
- **GIVEN** navigation crosses between main branches
- **WHEN** the destination consolidates
- **THEN** history contains source and destination but no artificial Home entry

#### Scenario: Browser Back
- **GIVEN** at least one completed client navigation
- **WHEN** the browser moves Back
- **THEN** the previous URL and active navigation state are restored once without an extra history entry or stale overlay

#### Scenario: Browser Forward
- **GIVEN** Back has restored a previous URL
- **WHEN** the browser moves Forward
- **THEN** the next URL and active navigation state are restored once without a route loop or stale overlay

#### Scenario: Superseded pending destination
- **GIVEN** an eligible destination is superseded before it is committed
- **WHEN** the latest navigation consolidates
- **THEN** discarded transition work does not add an artificial history entry

### Requirement: Focus, scroll, and announcements follow page semantics
After ordinary client navigation, the site SHALL expose the new page name,
place focus on meaningful page content, and preserve a visible focus indicator
without focusing decorative SVG.

#### Scenario: Ordinary forward navigation
- **GIVEN** an internal navigation consolidates
- **WHEN** incoming content is available
- **THEN** scroll starts at the top and focus moves once to `main#main-content` or its `h1`

#### Scenario: Browser history restoration
- **GIVEN** Back or Forward supplies a reliable browser scroll position
- **WHEN** the route is restored
- **THEN** the coordinator does not unexpectedly steal focus or overwrite that scroll position

#### Scenario: Route announcement
- **GIVEN** a client route change completes
- **WHEN** assistive technology observes the document
- **THEN** the destination title is available through the framework route-announcement behavior without a duplicate custom announcement

### Requirement: Reduced motion preserves complete navigation behavior
When `prefers-reduced-motion: reduce` is active, the site MUST remove large
spatial travel and non-essential score drawing while preserving URLs, history,
focus, scroll, header state, terminal states, and link operation.

#### Scenario: Reduced route transition
- **GIVEN** reduced motion is active
- **WHEN** an eligible route is activated
- **THEN** it uses an immediate replacement or 150–200 ms crossfade with no animated score segment, parallax, or tilt

#### Scenario: Preference changes at runtime
- **GIVEN** a hydrated session with an active or idle coordinator
- **WHEN** the system motion preference changes
- **THEN** incompatible animation is reverted and current content remains usable without reloading

### Requirement: Failure and interruption never block the interface
Failures, timeouts, supersession, and unmounting MUST NOT leave content hidden,
focus trapped, scrolling locked, overlay events enabled, temporary attributes,
timers, listeners, GSAP contexts, or ScrollTriggers behind.

#### Scenario: Timeout recovery
- **GIVEN** a lifecycle exceeds its safety deadline
- **WHEN** 1,100 ms elapse
- **THEN** route content is visible and operable, the overlay is cleared, and focus can reach the page

#### Scenario: Animation error recovery
- **GIVEN** coordinated animation throws or cannot measure an anchor
- **WHEN** the fallback executes
- **THEN** navigation completes or falls back to native loading without broad error swallowing

#### Scenario: Route error recovery
- **GIVEN** an eligible route request does not commit successfully
- **WHEN** the safety deadline is reached
- **THEN** native navigation remains available and all transient presentation state is cleared

#### Scenario: Hidden document interruption
- **GIVEN** a transition is active
- **WHEN** the document becomes hidden
- **THEN** non-essential animation settles or is reverted without a stale callback updating an unmounted page

#### Scenario: Scroll safety
- **GIVEN** any successful, interrupted, reduced, mobile, or failed transition
- **WHEN** the lifecycle settles
- **THEN** the document is not permanently scroll-locked and no transition overlay accepts pointer events

#### Scenario: Lifecycle cleanup
- **GIVEN** repeated navigation and remount cycles
- **WHEN** active animation counts are inspected after settling
- **THEN** no duplicate GSAP context, timeline, ScrollTrigger, or global event listener accumulates

### Requirement: Persistent navigation remains operable
The header and chapter controls SHALL remain keyboard-operable during recovery
and after every transition, and their active state SHALL follow the committed
pathname.

#### Scenario: Process active state
- **GIVEN** the Process route is current after any navigation source
- **WHEN** the header is inspected
- **THEN** Services is the active institutional item and no separate false Process item appears

#### Scenario: Terminal navigation remains available
- **GIVEN** Benefits or Contact is current
- **WHEN** a keyboard user continues navigation
- **THEN** previous navigation, header links, Home pivot, and theme control remain reachable

