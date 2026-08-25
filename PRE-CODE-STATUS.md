# W_Flyer v2 — Pre-code status

**Status:** `V2_PHASE_4_GATE_4_COMPLETE_PHASE_5_AUTHORIZED_NOT_STARTED`

## Approved

- product/brand positioning;
- alternative-A landing + detailed-page model;
- professional and application story order;
- native-scroll desktop architecture;
- vertical mobile architecture and ordering;
- header traversal/history contract;
- intro/bootstrap/deep-link contract;
- continuous dual-score visual system;
- visual asset governance;
- Music Renderer, Procedural Score Composer, and Visual Lab gates;
- project-card system;
- Persona concept and easter-egg rules;
- APP-04 video state machine;
- accessibility, reduced-motion, performance, lifecycle, testing, and deployment boundaries;
- linear implementation plan.

## Current migration state

The public `/` route still implements the legacy route-per-chapter landing,
including route-transition overlays, previous/next chapter controls, company
terminology, a header app-access link, programmatic music geometry, and an
interactive DOM tablet demo.

Those behaviors are not the approved target. They remain only to provide a
functioning rollback baseline during migration.

Phases 2, 3, and 4 are complete. A typed, geometry-free v2 story model and the
accessible static vertical skeleton exist in parallel at the development-only
`/__visual-lab/story` surface. The readiness-driven intro/bootstrap lifecycle,
semantic destination/history contracts, static positioning adapter, and
failure/reduced-motion recovery are validated at the development-only
`/__visual-lab/story/bootstrap` surface. Typed public content, publication allowlists,
retained detailed routes, three fail-closed project details, route metadata,
and the preserved Contact contract passed Gate 3 on 2026-08-24. Gate 4 passed
on 2026-08-25. The public landing has not been cut over, and Phase 5 has not
started.

## Human-gated pending assets/calibrations

- final Score Path control points/layout approval;
- final W_Flyer Persona SVG/rig approval;
- final APP-04 WebM/MP4/poster/final-frame assets;
- final project media where applicable;
- final editorial copy review;
- calibrated horizontal-mode breakpoint and mobile activation thresholds;
- staging homologation and production authorization.

## Authorization

Phase 5 is the next permitted phase under `WFLYER_IMPLEMENTATION_PLAN.md`.
Codex may not skip later human gates or deploy production.
