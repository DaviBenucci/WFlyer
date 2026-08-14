## Context

The legacy source uses route coordinates, previous/next controls, a route-transition shell, per-page score segments, company terminology, and an interactive tablet. V2 uses one canonical scroll progress and a semantic vertical document fallback.

## Goals

- Native-scroll desktop story without scroll-jacking.
- Header fast traversal through the same story, ≤3 seconds.
- Preserved detailed routes and no-JavaScript content.
- Professional-first mobile order.
- Two continuous organic scores.
- Deterministic, gated music system.
- Accessible project cards, Persona, video demo, Contact conversion, and terminals.
- Fail-open, reduced-motion, performance, cleanup, and exact evidence.

## Non-Goals

- Modifying the musical application.
- Adding database/CMS/authentication/analytics.
- Free music generation.
- Codex-generated final Persona or media.
- Production deployment without owner approval.

## Key Decisions

1. Native scroll is the single source of truth.
2. Landing summary and detailed routes coexist.
3. Mobile semantic order is canonical fallback.
4. Header traversal animates native scroll and is interruptible.
5. Score composition/geometry is precomputed before scroll reveal.
6. Music integration waits for Gates A/B/C.
7. Persona and final demo media are human asset gates.
8. Legacy removal occurs only after v2 replacement evidence and rollback reference.

## Migration

Follow `WFLYER_IMPLEMENTATION_PLAN.md` phases P0–P15. Build parallel labs/skeletons before public cutover. Preserve Contact/deployment/legal systems. Replace obsolete tests only after equivalent v2 tests pass.
