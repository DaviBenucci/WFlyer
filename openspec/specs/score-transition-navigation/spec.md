# score-transition-navigation Specification — v2

## Purpose

Coordinate native-scroll story progress, header traversal, hashes/history, cancellation, and recovery without route-transition overlays or scroll-jacking.

## Requirements

### Requirement: Native scroll is the source of truth
The landing SHALL map native vertical scroll to master-story progress and SHALL preserve wheel, trackpad, keyboard, scrollbar, and assistive scrolling.

### Requirement: Header traversal crosses intermediate chapters
A header target SHALL animate native scroll through the same timeline, use real normalized distance, remain cancelable, and never exceed 3.0 seconds.

### Requirement: History is truthful
Passive scroll SHALL replace state; successful explicit header navigation SHALL push state; cancelled traversal SHALL not create an entry; Back/Forward SHALL restore canonical progress.

### Requirement: Failure is fail-open
Missing measurement, GSAP, ScrollTrigger, or animation failure SHALL expose a usable vertical document and native links without stale locks/resources.
