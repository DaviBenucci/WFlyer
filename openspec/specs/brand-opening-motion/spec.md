# brand-opening-motion Specification — v2

## Purpose

Present the approved W_Flyer identity through a session-bounded, readiness-driven, skippable, fail-open opening that positions Home/deep-link/history state before revealing the story.

## Requirements

### Requirement: Readiness controls exit
The opening SHALL NOT use elapsed time alone as readiness. Critical layout/assets/story initialization and initial target positioning SHALL complete before exit, subject to a fail-open timeout.

### Requirement: Deep links position before reveal
A valid landing hash or reliable history position SHALL be applied before the overlay exits and SHALL not require cinematic travel from Home.

### Requirement: Noncritical media never blocks readiness
Demo video, distant project media, and optional easter-egg assets SHALL not block `STORY_READY`.

### Requirement: Skip/reduced/failure release the page
Skip, Escape, reduced motion, timeout, asset failure, resize, visibility, and teardown SHALL restore a functional page and clean owned resources.
