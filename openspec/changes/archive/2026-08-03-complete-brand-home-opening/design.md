## Context

See `proposal.md` for the regression evidence. The existing controller already implements the approved symbol/wordmark sequence, FLIP handoff, session eligibility, reduced-motion bypass, skip, deadline, and test checkpoints. It then leaves the 4.250–5.600 second Home-opening interval empty. The overlay is a direct child of the experience shell alongside the skip link, header, Home main, and footer, which makes those siblings a bounded isolation surface.

The timing, target order, authorized properties, and interaction rules in `docs/03-motion/06-animacao-entrada-marca.md` remain normative. No new geometry is authorized.

## Goals / Non-Goals

**Goals:**

- Fill only the missing Home-opening interval while preserving all earlier Phase 07 choreography.
- Use stable semantic `data-*` target annotations and direct element references so the scoped GSAP context can animate elements outside the overlay.
- Restore a byte-equivalent normal Home/header state after success and every fail-open path.
- Limit keyboard/assistive interaction to skip while the overlay owns the viewport, without changing DOM order or moving focus.

**Non-Goals:**

- Replacing the official master SVG, changing Home layout/CSS, adding scroll choreography, or changing local reveals below the fold.
- Adding focus trapping loops, a modal dialog role, or automatic focus movement.
- Animating layout dimensions, using fixed FLIP coordinates, or adding another motion engine.

## Decisions

### Annotate the existing semantic pieces instead of wrapping or cloning them

Home keeps its current DOM/layout. Existing score/origin/branch elements gain specific target attributes, actions and cue gain their own attributes, and header score graphics/labels gain header targets. The controller resolves visible targets once after the asset is ready and passes element arrays directly to GSAP; scoped selector strings cannot reach siblings outside the overlay reliably.

### Encode the normative interval with transform, opacity, and stroke-safe reveals

At `hero:start`, header/Home score geometry begins from the center with opacity/scale on existing SVG/group targets. The narrative origin follows with scale `0.94` and at most one degree rotation. Branch copy enters from `x=-20` and `x=20`; actions fade/translate after copy; the cue appears last before `hero:ready`. The real header pivot remains hidden until the moving symbol converges, then becomes visible under the clone. No width, height, top, left, viewBox, or randomized property is animated.

The current runtime end frame is the visual baseline. Baselines may change only if a reviewed `hero:ready` checkpoint proves that the new frame is the previously missing approved state, not to hide unrelated drift.

### Isolate direct experience-shell siblings with reversible snapshots

When the overlay becomes eligible, the controller records each sibling's prior `inert` and `aria-hidden` attribute state, excluding itself and already decorative transition layers, then makes the other site surfaces inert and hidden from assistive navigation. The overlay remains non-modal and its skip button stays native. One idempotent release restores exact prior attributes during completion and effect cleanup.

### Keep target cleanup independent of React unmount timing

The controller stores resolved Home/header targets and explicitly clears only the GSAP properties it owns before setting state to completed. GSAP context cleanup remains a second safety layer. This avoids relying on a state-driven effect teardown to restore a visible Home after skip, deadline, asset error, or animation failure.

## Risks / Trade-offs

- [Hidden Home targets could survive a killed timeline] → Use one idempotent final-state function from all exits and assert no inline opacity/transform/visibility remains.
- [Restoring `aria-hidden` or `inert` could overwrite another owner] → Snapshot exact pre-intro attribute presence/value and restore rather than blindly remove.
- [Mobile has no desktop header score] → Resolve only visible/available targets; the Home score and remaining ordered content still complete the same final state.
- [A target annotation can drift from markup] → Component tests enumerate the required target surface and normal-completion E2E checks all groups.
- [External target animation is outside the overlay scope] → Pass concrete elements to GSAP and keep explicit cleanup rather than relying on scoped selectors.

## Migration Plan

1. Add target annotations and failing tests for target presence, isolation, checkpoint ordering, normal completion, and cleanup.
2. Add the missing timeline interval and idempotent isolation/final-state helpers.
3. Run Phase 07 component, E2E, accessibility, mobile/dark/reduced-motion, and reviewed visual gates.
4. Roll back controller, annotations, tests, and synchronized spec together if any Home/header final-state regression appears; no infrastructure or persistent-data migration exists.
