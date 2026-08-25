# scroll-driven-portfolio-landing Specification

## ADDED Requirements

### Requirement: Native scroll is canonical
The landing SHALL derive story progress from native vertical scroll and SHALL NOT use global wheel/touch prevention as a story driver.

#### Scenario: Partial trackpad movement
- **WHEN** the user produces partial inertial scroll
- **THEN** the story advances partially without mandatory chapter snap

### Requirement: Home is the branch origin
Home SHALL be positioned from real branch lengths and SHALL permit upward travel to Application and downward travel to Professional.

#### Scenario: The story is presented vertically
- **WHEN** the horizontal enhancement is unavailable
- **THEN** Home remains the shared semantic origin before the professional and application branches in document order

### Requirement: Header traversal uses the same story
Header navigation SHALL traverse intermediate chapters using the same canonical progress, remain interruptible, and never exceed 3.0 seconds for an extreme traversal.

#### Scenario: Explicit navigation crosses multiple chapters
- **WHEN** a visitor activates a distant header target in an enhanced mode
- **THEN** traversal uses the canonical story progress, crosses intermediate chapters, remains interruptible, and completes within 3.0 seconds

### Requirement: Detailed routes remain independent
Every detailed route SHALL render independently of the landing timeline and remain navigable when motion or JavaScript is unavailable.

#### Scenario: A detailed route is requested directly
- **WHEN** a visitor opens a retained detailed route without entering the immersive landing
- **THEN** its semantic content renders independently of story motion and remains navigable without JavaScript

### Requirement: Application details respect the conversion sequence
The current-release application detail routes SHALL remain
`/aplicacao-wflyer`, `/aplicacao-wflyer/como-funciona`, and
`/aplicacao-wflyer/beneficios`. The public five-step flow and four benefit
groups SHALL stay within approved public boundaries, and no primary Access
W_Flyer action SHALL appear before the terminal Access chapter.

#### Scenario: A visitor reads an application detail route
- **WHEN** Application, How It Works, or Benefits is opened directly
- **THEN** the route exposes only approved public content, has no premature primary app-access CTA, and identifies its canonical URL
