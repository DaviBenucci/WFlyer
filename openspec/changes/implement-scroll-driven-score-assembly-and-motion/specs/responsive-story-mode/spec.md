## ADDED Requirements

### Requirement: Presentations share one continuous portfolio story
Under ADR-057 / ASM-IMP-DEC-020 the presentation SHALL follow the
[canonical spatial contract](../../../../../docs/canonical-v2/02-experience/01-global-story-architecture.md).
EXPANDED_LANDSCAPE, COMPACT_LANDSCAPE and PORTRAIT_TRAVERSE SHALL preserve the
same Home → About → Services → Process → Projects → Contact → Terminal order.
Capability selection SHALL consider usable content capacity rather than device
name, width alone or orientation alone. No class requires whole-chapter fit.

#### Scenario: Capacity changes during traversal
- **WHEN** usable width, height, input capability or content capacity changes
- **THEN** the selected presentation preserves the current semantic content station and required content
- **AND** no second mobile story, viewport hardcode or global scale is introduced

### Requirement: Native input is separate from camera geometry
Native scroll SHALL remain authoritative. Portrait SHALL use native vertical
scroll as primary input, which may drive lateral camera progress. Desktop SHALL
initially use the same native vertical mapping; an optional native horizontal
adapter SHALL meet the same access and restoration contracts.

#### Scenario: Portrait traversal reaches a long landmark
- **WHEN** the reader continues vertical scrolling
- **THEN** all stations remain reachable through local vertical staging and subsequent global progression
- **AND** horizontal swiping, scroll interception and a second progress clock are unnecessary

### Requirement: Capacity is resolved by readable reflow and spans
Adaptation SHALL follow reflow, redistribution, progressive reveal, span growth,
then bounded role-token typography adaptation. Partial offscreen content SHALL
remain reachable; it SHALL NOT by itself fail validation.

#### Scenario: A chapter exceeds the usable viewport
- **WHEN** simultaneous content cannot fit at readable scale
- **THEN** it occupies more stations or span while every required item can become readable and operable
- **AND** focus, ink clearance and interaction safety remain enforced

### Requirement: Transitional fan and teaser evidence is preserved
ADR-056's one vertical teaser SHALL remain classified as valid transitional
Stage-1 implementation. The final continuous Projects disposition SHALL be
recorded during implementation, allowing sequential projects across a span.
The full fan, wherever retained, SHALL still meet ADR-048/049/050's complete
capacity, three-visit, interaction and NON-ASSEMBLY contracts. Old candidate
failures SHALL remain failures, separately from usable fallback.

#### Scenario: Sequential Projects content is evaluated
- **WHEN** projects are exposed across multiple reachable stations
- **THEN** safety and required content are evaluated across those stations without requiring simultaneous fan fit
- **AND** historical fan predicates/results are preserved rather than silently weakened

### Requirement: HGA-002 margin remediation is superseded
The old HGA-002 isolated-block macro-gap plan SHALL NOT resume. Transition spans
SHALL address continuity under the new target and fresh validation.

#### Scenario: A transition appears disconnected
- **WHEN** continuity validation examines the interval between landmarks
- **THEN** it checks narrative ownership, reachable progression and score continuity rather than merely reducing section margins

### Requirement: Project browsing remains outside the landing-page release
The current landing-page release SHALL expose no dedicated Projects listing or
detail route, replacement URL, navigation promise or placeholder link.

#### Scenario: A project has no approved destination
- **WHEN** its content is presented in any story class
- **THEN** factual canonical content is available without a dead navigation control

### Requirement: Reduced motion and failure retain access
Reduced motion and motion failure SHALL retain the same semantic order,
landmarks, focus and interactions, using the semantic vertical document or
short/immediate positioning without required long camera travel.

#### Scenario: Reduced motion is enabled inside the story
- **WHEN** the preference changes or a valid destination is restored
- **THEN** equivalent content settles without replaying Home, mandatory pinning or scrub
- **AND** the presentation remains appropriate to available capacity

### Requirement: Responsive lifecycle preserves local semantic state
Rebuild SHALL preserve landmark, reachable content station and focused control
with Contact values/status, cancel stale automation, discard stale measurements
and release only owned resources.

#### Scenario: A virtual keyboard changes the visual viewport
- **WHEN** a Contact input remains focused while usable height changes
- **THEN** the control remains visible/reachable and form state is preserved without camera drift or repeated remounts
