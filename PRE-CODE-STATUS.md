# W_Flyer v2 — Pre-code status

**Status:** `V2_PHASE_8_GATE_8_COMPLETE_PHASE_9_SCORE_PATH_HUMAN_GATE_PENDING`

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

Phases 2 through 8 are complete. A typed, geometry-free v2 story model and the
accessible static vertical skeleton exist in parallel at the development-only
`/__visual-lab/story` surface. The readiness-driven intro/bootstrap lifecycle,
semantic destination/history contracts, static positioning adapter, and
failure/reduced-motion recovery are validated at the development-only
`/__visual-lab/story/bootstrap` surface. The native-scroll desktop master story,
measured Home origin, responsive projection adapter, and owned ScrollTrigger
lifecycle are validated at the development-only
`/__visual-lab/story/motion` surface. That same surface now validates the exact
manifest-derived header targets, native-scroll traversal, proportional timing,
input cancellation, active chapter, canonical hashes, and push/replace/Back/Forward
semantics. The same isolated Motion Lab now contains the complete professional
About, Services, Process, Projects, Contact, final-barline, and terminal
composition. Its About scene reserves the final Persona integration contract
without inventing an asset, Projects exposes the three authorized cards as an
accessible fan/stack, and Contact reuses the retained secure form behavior.
The same isolated surface now contains the complete Application Overview, How
It Works, Benefits, APP-04 structural demonstration, Access W_Flyer,
final-barline, and terminal composition. APP-04 uses a deterministic
missing-media fallback until the owner-supplied Phase-11 media exists; no final
media or score integration is claimed.
Typed public content, publication allowlists,
retained detailed routes, three fail-closed project details, route metadata,
and the preserved Contact contract passed Gate 3 on 2026-08-24. Gate 4 passed
on 2026-08-25, Gate 5 passed on 2026-08-26, Gate 6 passed on 2026-08-27, and
Gates 7 and 8 passed on 2026-08-28. The public landing has not been cut over,
and Phase 9 has not started.

## Human-gated pending assets/calibrations

- final Score Path control points/layout approval;
- final W_Flyer Persona SVG/rig approval;
- final APP-04 WebM/MP4/poster/final-frame assets;
- final project media where applicable;
- final editorial copy review;
- calibrated horizontal-mode breakpoint and mobile activation thresholds;
- staging homologation and production authorization.

## Authorization

Phase 9 is next in sequence under `WFLYER_IMPLEMENTATION_PLAN.md`, but its
first task is the blocking human approval of Score Path layouts. No Phase-9
implementation may begin before that approval, and Codex may not skip later
human gates or deploy production.
