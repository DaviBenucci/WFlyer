## Why

The Phase 05 audit found two observable navigation gaps and one proven duplicate architecture: a second click after the first destination commits can replace that destination in browser history, capture-phase enhancement cannot rely on a descendant bubble handler to cancel it, and geometry tests exercise an implementation that production never calls.

## What Changes

- Preserve every already-committed main chapter as a browser-history entry when the visitor continues during its incoming animation.
- Define an explicit `data-score-transition="native"` opt-out for anchors whose own behavior must retain native navigation.
- Consolidate measured/fallback anchor selection, Home pivot geometry, segment resolution, and SVG path construction into the runtime geometry module covered by unit tests.
- Add DOM/runtime regression tests for committed-route supersession, explicit opt-out, and the exact production geometry.
- Preserve topology, timing budgets, visual paths, reduced-motion behavior, cleanup, and pre-commit latest-destination consolidation.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `score-transition-navigation`: make post-commit history preservation and explicit native-link opt-out observable navigation contracts.

## Impact

- Affected code: score link eligibility, the site experience coordinator, the transition overlay, shared motion geometry, and Phase 05 tests/documentation.
- Affected normative documents: `docs/03-motion/07-transicoes-entre-capitulos.md` and the canonical `score-transition-navigation` capability.
- Verified facts: runtime duplicates geometry/path logic outside `src/lib/motion/geometry.ts`; the duplicate module has no production consumer; the committed supersession branch selects `replace`; parent capture observes descendant bubble cancellation too early.
- Non-goals: changing route topology, animation durations, approved visuals, Next.js routing, focus restoration, or any auxiliary/application route.
- Rollback: revert the coordinator, geometry, eligibility, tests, and synchronized spec together; no data or infrastructure migration exists.
