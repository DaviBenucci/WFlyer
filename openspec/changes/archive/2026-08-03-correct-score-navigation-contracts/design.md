## Context

See `proposal.md` for the audit findings. Phase 05 already has a deterministic topology and lifecycle, but its production geometry is split between `SiteExperienceShell` and `ScoreTransitionLayer`; the well-tested `src/lib/motion/geometry.ts` follows different anchor and path rules and is imported only by tests. The shell deliberately delegates anchor activation in capture phase so it can coordinate Next.js links before page-level replacement.

The approved visual meaning and timing remain governed by `docs/03-motion/07-transicoes-entre-capitulos.md`, the chapter manifest, and the canonical capability. No visual redesign is authorized.

## Goals / Non-Goals

**Goals:**

- Make unit geometry evidence exercise the exact functions used by the runtime.
- Preserve the current measured-anchor, fallback-anchor, central-pivot, segment, curve, and note placement output.
- Distinguish pre-commit consolidation from post-commit continuation in browser history.
- Give an anchor an ordering-safe, declarative way to opt out before capture interception.

**Non-Goals:**

- Moving interception to bubble phase, changing Next.js link ownership, or allowing arbitrary callbacks to coordinate the global transition state.
- Changing motion topology, easing, duration, breakpoint behavior, focus restoration, or the approved overlay appearance.
- Adding a generic navigation framework or a second animation engine.

## Decisions

### Make the motion geometry module the pure runtime boundary

The shared module will own anchor-kind selection, validated viewport fallback, measured/fallback points, Home pivot fallback, segment topology, SVG curve creation, and interpolation. The shell retains only DOM measurement and passes measured points into the pure resolver. The layer renders only the returned segments and paths.

This keeps DOM access inside the client coordinator while eliminating separate production/test algorithms. Preserving the currently rendered curve formula avoids an unauthorized baseline shift. Keeping both implementations and merely adding more tests was rejected because it would leave the drift mechanism intact.

### Push only after a destination has committed

Pre-commit rapid activation continues to retain one pending destination and replaces the transient first destination after it commits; that route was never available as an interactive chapter. Once `active.committed` is true, a new activation uses `push`, because the currently rendered chapter is now real visitor history even if its entrance timeline has not settled.

### Use a declarative capture-visible opt-out

Eligibility accepts an `enhancementOptOut` flag sourced from `data-score-transition="native"` on the anchor. This is observable before parent capture and therefore does not depend on descendant bubble ordering. Existing `defaultPrevented` behavior remains valid for cancellations that occur before the shell sees the event. Moving all delegation to bubble phase was rejected because it would change the established routing lifecycle and expand regression risk.

## Risks / Trade-offs

- [Geometry consolidation can change SVG output accidentally] → Port the current runtime formula byte-for-byte and assert exact segment IDs/paths before visual regression.
- [A held incoming test checkpoint can retain controller state across supersession] → Assert the new request ID, release the latest checkpoint, and verify zero active timelines after Back navigation.
- [The opt-out attribute could be used without an alternate handler] → Native anchor navigation remains functional, so the fallback is safe.
- [History length is browser-context dependent] → Assert relative increments and concrete Back destinations rather than an absolute length.

## Migration Plan

1. Add failing eligibility, geometry, and post-commit Playwright regression tests.
2. Consolidate pure geometry, switch runtime consumers, add opt-out data flow, and change only the committed supersession method.
3. Run Phase 05 unit, E2E, motion, accessibility, and visual gates before synchronizing the spec.
4. Roll back the change atomically if a visual or history regression appears; no stored state or infrastructure migration exists.
