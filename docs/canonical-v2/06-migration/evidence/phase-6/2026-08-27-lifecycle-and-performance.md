# Lifecycle and Performance Evidence

Date: 2026-08-27

## Ownership

- One Phase-5 paused master timeline and one enhanced ScrollTrigger remain.
- Phase 6 adds at most one owned tween over a plain numeric scroll proxy.
- Target lookup is a frozen manifest-derived `Set` plus existing geometry map;
  no repeated DOM scan or long synchronous target search is introduced.
- The temporary root scroll-behavior override restores its prior value and
  priority exactly once.
- History-write suppression is reference-counted so overlapping/aborted
  semantic positioning cannot leave passive observation disabled.

## Cleanup

Wheel, touchstart, touchmove, pointerdown, capture keydown, resize,
orientationchange, visualViewport resize, visibilitychange, and media-query
listeners have explicit runtime ownership and matching teardown. Rebuild and
destroy settle a live traversal before projection resources are replaced.
Destroyed runtime snapshots show zero owned traversal and zero owned
ScrollTrigger; repeated destroy is a no-op.

## Runtime evidence

- Cancellation count increments once per settled request.
- Completion count increments only after final target positioning.
- Supersession leaves one active owner and starts from current native scroll.
- Existing Phase-5 regression proves no MotionStorySurface React render per
  scroll frame or semantic header-state change.
- Existing motion-budget regression passes partial native progress and reports
  no material layout shift.
- Hidden/visible, remount, rebuild, and exact-once Phase-5 cleanup regression
  remains green.

No global scroll prevention, body lock, smooth-scroll library, observer loop,
timer loop, or additional animation engine was added.
