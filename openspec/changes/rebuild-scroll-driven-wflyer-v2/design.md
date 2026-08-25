## Context

The legacy source uses route coordinates, previous/next controls, a route-transition shell, per-page score segments, company terminology, and an interactive tablet. V2 uses one canonical scroll progress and a semantic vertical document fallback.

## Goals

- Native-scroll desktop story without scroll-jacking.
- Header fast traversal through the same story, ≤3 seconds.
- Preserved detailed routes and no-JavaScript content.
- Typed public content, publication allowlists, and route-level SEO independent
  from layout, motion, and music geometry.
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
9. Canonical phase order is binding: the static Phase-2 story is followed by
   Phase-3 content/detailed-route/conversion contracts; readiness, intro, and
   deep-link positioning remain Phase 4.
10. Phase 3 retains the canonical current-release routes: `/portfolio` with
    authorized `/portfolio/[slug]` project details, `/processo`, and the nested
    application detail routes. A future URL migration requires separate owner
    approval plus redirect and SEO evidence during a later phase.

## Migration

Follow `WFLYER_IMPLEMENTATION_PLAN.md` phases P0–P15. Build parallel labs/skeletons before public cutover. After the completed Phase-2 skeleton, finish and record Phase 3 before beginning any Phase-4 readiness work. Preserve Contact/deployment/legal systems. Replace obsolete tests only after equivalent v2 tests pass.
