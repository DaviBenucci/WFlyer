## Purpose

Define the deterministic, reversible, accessible, and human-gated Assembly and
score-presentation capability layered over refrozen successor geometry.

## ADDED Requirements

### Requirement: Geometry is approved and refrozen before motion
The successor SHALL implement only `ASM-LAYOUT-DELTA-001..005` during bounded
geometry stabilization, SHALL automatically validate them, SHALL stop for
explicit Human Geometry Gate approval, and SHALL seal and refreeze the approved
geometry before Projection metadata or any scroll-driven Assembly, staff
draw/erase, Composer-backed event reveal, content choreography, or final GSAP
integration begins. This hard ordering is governed by `ASM-IMP-DEC-006..007`.

#### Scenario: Automated geometry passes without human approval
- **WHEN** all Stage-1 automated geometry checks pass but explicit human geometry approval has not been recorded
- **THEN** the change remains stopped at the Human Geometry Gate and no Stage-2 refreeze or Stage-3-and-later motion work begins

#### Scenario: Geometry is approved and refrozen
- **WHEN** the five bounded deltas pass automated checks and explicit human review
- **THEN** successor-only evidence is sealed with a manifest and digest, geometry is marked frozen, and Stage 3 may begin without reopening unrelated Phase-9 geometry

### Requirement: Assembly state is deterministic, reversible, and event-free
Assembly SHALL resolve the canonical
`CANONICAL → DISASSEMBLING → TRANSITION → REASSEMBLING → CANONICAL`
state from semantic progress, Projection metadata, responsive mode, and
reduced-motion policy. The same semantic progress SHALL yield the same state in
forward or reverse travel, and Composer-backed events SHALL be absent from
every Assembly transition.

#### Scenario: User reverses through an Assembly scene
- **WHEN** forward and reverse traversal return to the same semantic progress inside an Assembly interval
- **THEN** the resolved geometry, opacity, visibility, and event-free state match within the documented deterministic tolerance

### Requirement: Staff and event presentation follow precomputed safe anchors
All five staff lines SHALL share one logical reversible draw front. A complete
Composer-backed event group SHALL become visible atomically only after that
front reaches its precomputed reveal anchor in `EVENT_SAFE_STRAIGHT`; events
SHALL remain hidden in `TRUE_CONNECTOR`, `EVENT_FREE_CURVED`,
`ASSEMBLY_TRANSITION`, and Fast Traversal. Narrative reveal enhancement SHALL
not remove semantic DOM content when motion is absent.

#### Scenario: Staff front reaches a safe event group
- **WHEN** normal scrub advances the unified staff front beyond an event group's precomputed `EVENT_SAFE_STRAIGHT` anchor
- **THEN** the notehead, stem, flag or beam, accidental, ledger lines, and tuplet members reveal as one coherent group without a per-frame geometry lookup

#### Scenario: Staff traverses a forbidden event region
- **WHEN** the logical front crosses a connector, curved, Assembly, or Fast Traversal interval
- **THEN** the staff may progress but no Composer-backed event group is presented there

### Requirement: Scenic material hands off to canonical geometry without a seam
Scenic staff SHALL converge to Projection's exact `CANONICAL_ENTRY_ANCHOR`,
transfer ownership through matched geometry, and provide an event-free
canonical lead-in before the first safe Composer event. The handoff SHALL be
deterministic and reversible, with no visible jump, cusp, duplicate staff, or
uncontrolled opacity accumulation.

#### Scenario: A branch leaves Home normally
- **WHEN** scenic branch formation reaches its canonical ownership-transfer interval
- **THEN** scenic and canonical staff geometry coincide before canonical ownership becomes visible and events remain absent until the first safe post-lead-in anchor

#### Scenario: A deep link targets a branch
- **WHEN** readiness resolves a valid deep link or history restoration beyond Home
- **THEN** presentation settles directly to the correct canonical state without replaying prior Scenic animation or exposing a geometry swap

### Requirement: Structural Assembly remains bounded to approved scenes
Structural Assembly SHALL initially apply only to Professional Services,
Application How It Works, and an explicitly approved complex directional
transition. It SHALL solve a layout or narrative need, remain event-free, and
preserve protected-content clearance. Projects SHALL remain distinct
event-bearing shelves separated by event-free valleys and SHALL NOT become
Assembly without a new approved decision.

#### Scenario: Services or How It Works transforms
- **WHEN** the score enters an approved card-interaction Assembly interval
- **THEN** bounded disassembly and reassembly preserve continuity, zero accidental collisions, zero self-intersections, and responsive/reduced-motion semantic equivalence

#### Scenario: Projects is presented
- **WHEN** the score visits the three Professional project cards
- **THEN** it retains three distinct safe shelves and event-free connector valleys without Structural Assembly

### Requirement: GSAP presentation has one temporal authority and zero frame structural work
GSAP SHALL be the only programmatic motion engine and the existing native-scroll
master story timeline SHALL remain the single temporal authority. Ordinary scrub
SHALL produce zero Composer calls, Projection rebuilds, DOM measurements, and
React frame-clock updates; Anime.js, a parallel animation clock, ordinary-story
scroll interception, and global kill-all cleanup are prohibited.

#### Scenario: Ordinary native scrolling advances the story
- **WHEN** wheel, touch, keyboard, scrollbar, or assistive scrolling changes semantic progress without material layout invalidation
- **THEN** GSAP interpolates precomputed presentation state while Composer-call, Projection-build, layout-read, and React-frame-clock counters do not increase per frame

### Requirement: Runtime ownership is scoped, fail-open, and resource-stable
The story root SHALL own motion initialization, rebuild, traversal, observers,
listeners, timers, focus/scroll locks, and disposal. Material invalidations SHALL
be coalesced into one stable measurement and bounded rebuild that restores
equivalent semantic state without replay. Failure or timeout SHALL leave content,
navigation, forms, native scrolling, and focus usable, and repeated cleanup
SHALL be safe.

#### Scenario: Responsive geometry changes during traversal
- **WHEN** a material mode change occurs during Fast Traversal
- **THEN** traversal cancels at actual progress, one coalesced rebuild occurs, normal scrub resumes at equivalent semantic state, and no Home or chapter Assembly replays

#### Scenario: Motion initialization or teardown fails midway
- **WHEN** initialization times out, GSAP fails, or the story unmounts during active presentation
- **THEN** the document fails open without hidden content, stale scroll lock, orphan focus trap, or unbounded timeline/observer/listener ownership

### Requirement: Completion requires deterministic evidence and human homologation
The successor SHALL verify unit/property, geometry, browser, accessibility,
reduced-motion, performance, lifecycle, and deterministic forward/reverse
contracts; Chromium, Firefox, and WebKit SHALL pass. It SHALL create separate
successor evidence without mutating Phase-9 seals and SHALL stop for explicit
final human homologation before completion or deployment.

#### Scenario: Automated final gates pass
- **WHEN** all automated Stage-18 checks and deterministic captures pass across supported engines
- **THEN** the change remains incomplete until successor evidence is sealed and explicit final human homologation is recorded
