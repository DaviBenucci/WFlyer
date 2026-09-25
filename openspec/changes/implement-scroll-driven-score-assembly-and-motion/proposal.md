## Why

The owner approved ADR-057 / ASM-IMP-DEC-020 before Human Geometry Approval:
the institutional landing must become one continuous spatial story with a
viewport camera and semantic landmarks. Viewport-contained chapters and the
HGA-002 macro-gap repair plan no longer define the target.

## What Changes

- **BREAKING spatial contract:** adopt the
  [Continuous Spatial Story](../../../docs/canonical-v2/02-experience/01-global-story-architecture.md)
  as the single normative model for coordinates, landmarks, spans, camera,
  capability classes, portrait local reflow, input and stable interaction.
- Rebaseline this existing successor in place. It already owns the affected
  geometry, responsive/navigation surfaces and later motion; a new change would
  duplicate that ownership and obscure the preserved implementation history.
- Preserve three distinct states: frozen Phase-9 technical baseline;
  portfolio-only/transitional Stage-1 including HGA-001A–D; new unimplemented
  continuous-story target. ADR-053's removed Application scope stays removed.
- Supersede HGA-002's old spacing-remediation plan. Preserve ADR-048/049/050
  safety/evidence and qualify their simultaneous-fan-specific constraints.
  ADR-056's vertical teaser remains valid transitional behavior; its final
  disposition is recorded during continuous-story implementation.
- Reopen 5.1–5.5 for target validation, add four spatial implementation
  prerequisites, keep 5.6 pending: **30/51 → 25/55**.

### Scope and non-goals

This pass normalizes documentation/governance only. It does not implement
geometry, CSS, Projection, Composer, Projects, public Motion Lab integration,
new portfolio routes, Assembly or GSAP. It authorizes one local governance
checkpoint only if its delta is safely isolated and validated. No push/deploy.
No frozen historical record, security control or accessibility invariant changes.

## Capabilities

The seven existing delta files remain the capability boundary; no new spec or
parallel mobile story is introduced.

### New Capabilities

- `score-assembly-motion`: pending staged successor geometry/motion gates.

### Modified Capabilities

- `continuous-dual-score`: retained name; one continuous portfolio score and spatial narrative.
- `responsive-story-mode`: shared capability-adaptive presentation, portrait reflow and reduced motion.
- `score-transition-navigation`: semantic entry-anchor destinations on one native position.
- `accessible-navigation-lifecycle`: reachable focus and stable interaction regions.
- `music-renderer`: preserved full-ink/clearance/determinism requirements.
- `brand-opening-motion`: preserved single origin, destination bootstrap and fail-open behavior.

## Impact

Canonical authority is ADR-057 / ASM-IMP-DEC-020 and the linked spatial contract.
The [implementation package](continuous-story-implementation-package.md) maps
existing owners and bounds the first next slice. No dependency or route is added.
The live dirty baseline is HEAD `40e6ae1a8996c53ed2ec372c47f16bc073d6cee9`;
Phase-9 remains frozen at `306ccb74da6c7bbf8f187e360c0776c571b5fc3d`.

Rollback of a future candidate uses the preserved transitional Motion Lab
behavior, never a reset of unrelated dirty work. New target implementation,
review and release are separate gates; governance validation proves none of them.
