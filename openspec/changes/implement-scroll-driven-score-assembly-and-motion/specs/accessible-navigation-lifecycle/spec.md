## ADDED Requirements

### Requirement: Navigation exposes only surviving destinations
Header, mobile sheet, footer, landmarks, accessible names, focus order, sitemap,
and public route metadata SHALL expose Home and Professional/Portfolio
destinations only.

#### Scenario: A user opens site navigation
- **WHEN** navigation links are enumerated visually or by assistive technology
- **THEN** no removed institutional Application destination or external-access CTA is present

### Requirement: Removed routes fail closed
The removed institutional URLs SHALL use the existing accessible,
non-indexable Not Found behavior with no redirect or hidden compatibility page.

#### Scenario: A removed URL is requested
- **WHEN** `/aplicacao-wflyer` or its former child URL is loaded
- **THEN** the response is 404, no removed UI is exposed, and robots metadata is non-indexable

### Requirement: Focus and scroll-lock ownership is scoped
Navigation and transition owners SHALL restore focus, release inert state and
scroll locks, and remove listeners and observers on completion, cancellation,
responsive rebuild, failure, and unmount.

#### Scenario: A traversal is interrupted
- **WHEN** user input cancels an active destination traversal
- **THEN** native scrolling and operable focus resume from actual progress without an orphan lock or trap

### Requirement: Interaction regions remain stable and reachable
Interaction-heavy landmarks SHALL provide stable regions under canonical
spatial contract §8. Contact SHALL preserve readable/operable fields, statuses,
values, security and focus while lateral camera advancement holds. Native
vertical reachability and deliberate exit SHALL remain available without traps.

#### Scenario: A reader edits and submits Contact
- **WHEN** text entry, IME, validation, submission or virtual-keyboard resize occurs
- **THEN** the focused control and required messages remain reachable/visible without lateral drift or discarded values
- **AND** form success/error does not automatically navigate

#### Scenario: A reader leaves or returns to the interaction span
- **WHEN** native scrolling or explicit navigation changes the landmark
- **THEN** traversal resumes safely, retained form state follows its existing lifecycle and no stale lock/focus trap remains

### Requirement: Partial visibility never prevents access
Required content and controls SHALL become readable/operable through native
traversal, keyboard or assistive navigation. Focus SHALL NOT remain obscured
by camera clipping, sticky header, safe areas or the virtual keyboard.

#### Scenario: Keyboard navigation reaches an offscreen station
- **WHEN** a required control receives focus
- **THEN** its station is made visible through the same story mapping and the control can be operated
- **AND** passive scroll does not steal focus or require a horizontal swipe
