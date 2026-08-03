## Why

The archived Phase 07 opening reaches the header handoff but does not animate any Home/header targets during the normative `hero:start` to `hero:ready` interval; it fills the interval with an empty tween. The same audit found that persistent header, Home, and footer controls remain keyboard-reachable behind the active overlay, contrary to the approved single-skip-control interaction boundary.

## What Changes

- Implement the documented 4.250–5.600 second Home opening: header score, Home score branches, notes/bars, narrative clef, branch copy, actions, and exploration cue in their approved order.
- Keep the branch entrance within 20 px, draw from the center/outward, and preserve the exact final Home visual state.
- Temporarily make site siblings behind the overlay inert while keeping only the native `Pular introdução` control operable, then restore every prior attribute on complete, skip, failure, resize, visibility change, timeout, or teardown.
- Remove all Home/header inline animation properties during every completion path.
- Add normal-completion, checkpoint, keyboard-surface, fail-open cleanup, and visual regression evidence.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `brand-opening-motion`: make the already-approved Home-opening sequence and single-control interaction isolation explicit, tested behavior.

## Impact

- Affected code: brand intro controller, Home target annotations, header score annotations, component/E2E/visual tests, and the Phase 07 execution evidence.
- Affected normative document: `docs/03-motion/06-animacao-entrada-marca.md`; its timing, eases, vector geometry, and accessibility rules remain controlling.
- Verified facts: `hero:start` and `hero:ready` labels exist, but no Home/header tween consumes them; the timeline uses an empty 0.75-second tween; no inert/aria isolation is applied to overlay siblings.
- Non-goals: redesigning Home, changing the official SVG or brand geometry, adding motion engines, replaying on direct subroutes, moving focus, or changing the session key.
- Rollback: revert target annotations, controller choreography/isolation, tests, and synchronized spec together; no stored data beyond the existing session completion flag is introduced.
