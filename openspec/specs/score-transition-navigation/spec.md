# score-transition-navigation Specification — v2

## Purpose

Coordinate native-scroll story progress, header traversal, hashes/history, cancellation, and recovery without route-transition overlays or scroll-jacking.

## Requirements

### Requirement: Native scroll is the source of truth
The landing SHALL map native vertical scroll to master-story progress and SHALL preserve wheel, trackpad, keyboard, scrollbar, and assistive scrolling.

#### Scenario: User scrolls by any supported native input
- **WHEN** the user scrolls with wheel, trackpad, keyboard, scrollbar, or assistive input
- **THEN** native vertical scroll maps to the same master-story progress without scroll-jacking

### Requirement: Header traversal crosses intermediate chapters
A header target SHALL animate native scroll through the same timeline, use real normalized distance, remain cancelable, and never exceed 3.0 seconds.

#### Scenario: User selects a distant header target
- **WHEN** a header target crosses one or more intermediate chapters
- **THEN** native scroll traverses the same timeline using normalized distance, remains cancelable, and completes within 3.0 seconds

### Requirement: History is truthful
Passive scroll SHALL replace state; successful explicit header navigation SHALL push state; cancelled traversal SHALL not create an entry; Back/Forward SHALL restore canonical progress.

#### Scenario: Navigation and history state change
- **WHEN** progress changes through passive scroll, completed explicit navigation, cancellation, or Back/Forward
- **THEN** history uses replace, push, no new entry, or canonical restoration respectively

### Requirement: Failure is fail-open
Missing measurement, GSAP, ScrollTrigger, or animation failure SHALL expose a usable vertical document and native links without stale locks/resources.

#### Scenario: Motion infrastructure fails
- **WHEN** measurement, GSAP, ScrollTrigger, or an owned animation fails
- **THEN** the vertical document and native links remain usable without stale locks or resources
