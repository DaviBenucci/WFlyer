# Phase 8 Lifecycle and Performance

Closeout date: 2026-08-28

APP-04 owns and cleans up its MutationObserver when a complete development
media contract needs chapter activity, media play requests, visibility and
reduced-motion subscriptions, event handlers, and the media element. The real
missing-media contract remains static and installs no chapter observer.

The Phase-5 scroll-frame no-React-render assertion and APP-04 lifecycle tests
pass together. The focused post-fix cross-engine matrix passed 27/27, including
the exact Firefox history and motion-budget cases.

Firefox profiling recorded the accepted Phase-7 control at 33.32, 33.30, and
33.32 ms p95. Before correction the Phase-8 tree recorded 66.36–66.46 ms p95.
Removing only `.shell`'s redundant nested `perspective(90rem) rotateX(1.5deg)`
restored approximately 33.22 ms p95. Device perspective, shell geometry,
shadows, reflection, gradients, content, and the canonical `<34 ms` threshold
remain unchanged.

The shared runtime change is bounded to projection rebuild ownership: a newer
explicit traversal outranks a stale preservation request waiting through the
refresh window. Existing rebuild-start cancellation, native scroll authority,
3.0-second traversal cap, and semantic history contracts remain intact.
