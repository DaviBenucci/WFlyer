# Bootstrap / Projection Adapter Contract

## Interface

`StoryPositioningAdapter` accepts an allowlisted `StoryChapterId`, optional
abort signal, and returns the requested/positioned chapter, fallback status,
and projection mode. It does not accept a selector, pixel offset, URL, timeline
progress, or animation engine.

Supported contract modes are `static`, `vertical-wide`, `vertical-compact`, and
`horizontal-enhanced`.

## Current Phase-4 implementation

- Mode: `static`.
- Home maps to the native document origin with immediate `scrollTo`.
- Other chapters map to the mounted semantic chapter and use immediate
  `scrollIntoView`.
- Root `scroll-behavior` is temporarily forced to `auto !important` and restored
  exactly.
- Two owned animation frames confirm layout stability before normal reveal.
- Missing targets fall back to Home; missing Home or unavailable positioning
  fails explicitly and enters the controller's fail-open path.
- Abort cancels pending frame ownership and restores scroll behavior.

## Phase-5 handoff

Phase 5 may inject an enhanced adapter that derives Home and every chapter from
real branch/timeline geometry after its own refresh. The readiness reducer,
destination resolver, session contract, and history envelope do not change.
Unit proof uses a future adapter that maps Home to a nonzero `0.63` physical
value without changing bootstrap semantics.

No `0.5`/`50%` Home mapping or document-midpoint assumption exists in Phase
4. CSS percentage values are presentation-only. No responsive threshold, GSAP
timeline, ScrollTrigger, pin, scrub, or branch travel exists in Phase 4.
