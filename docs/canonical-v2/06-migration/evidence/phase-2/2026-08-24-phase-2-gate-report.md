# Phase 2 Gate 2 report — static vertical v2 skeleton

**Date:** 2026-08-24  
**Result:** PASS — Gate 2 complete  
**Active OpenSpec change:** `rebuild-scroll-driven-wflyer-v2`  
**Branch:** `develop/site-institucional`  
**Baseline HEAD:** `784856b5b34ef87c8be24ab666d5d37756573ded`  
**Task progress:** `6/39` → `10/39`  
**Next OpenSpec checklist item:** 11, `Implement readiness state machine` — not started

## Implemented architecture

- A typed story model in `src/lib/story/` mirrors the canonical YAML chapter,
  branch, route, hash, timeline, desktop, and vertical order mappings.
- Semantic chapter identity is independent of projection geometry. Stable
  scene and future score-segment hooks use canonical chapter IDs; Phase-9
  semantic slot arrays remain intentionally empty.
- A simple server-rendered static story component tree presents all thirteen
  chapters in the approved vertical order with one H1 and one global footer.
- The professional and application terminals are narrative sections preceded
  by decorative final barlines, never duplicate footer landmarks.
- The v2 review document is isolated at development-only
  `/__visual-lab/story`. A route-aware root boundary supplies one v2 header and
  footer there while preserving the complete legacy shell everywhere else.
  The boundary fails closed in production, so even the 404 body contains no
  story-specific chrome or development title.
- The public `/` landing was not cut over. Existing detailed/legal routes,
  Contact backend, Music System implementation/evidence, and sitemap remain in
  place.

## Gate 2 acceptance

| Criterion | Result | Evidence |
|---|---|---|
| All chapters exist in semantic DOM order | PASS | Exact 13-chapter order plus separate `global-footer`, unit and browser assertions |
| JavaScript-disabled or motion-failed content remains readable/navigable | PASS | JS-disabled all-engine native document/anchor test; reduced-motion all-engine test |
| Keyboard and screen-reader order match the vertical document | PASS | Native header/hash traversal, skip target, exact DOM order, axe and hidden-content checks |
| No old company semantics remain in v2 content | PASS | Source/component and all-engine rendered-copy assertions |
| Current detailed routes still render | PASS | 57/57 detailed/legal E2E registrations plus 17-route standalone smoke |

## Boundary verification

- Music System: no renderer, composer, score-role output, or Gate-C connector
  fixture appears in the v2 skeleton; public-isolation unit coverage passes.
- Persona: only a visibly pending development structural placeholder exists;
  no artwork, mascot, likeness, or easter egg was invented.
- APP-04: only a visibly pending structural placeholder exists; no media,
  autoplay, replay, simulated processing, or state machine was implemented.
- Projects: exactly W_Flyer, MSN Distribuidora, and MSN Suprimentos; no metrics,
  testimonial, result, or additional client was introduced.
- Contact: the skeleton links to the retained `/contato` flow; server route,
  validation, Turnstile, Resend, retry identity, and security controls were not
  rewritten and pass retained tests.
- Advanced motion: not implemented. No GSAP story timeline, pinning, horizontal
  mapping, intro, header traversal, score drawing, project fan, or demo motion
  was added.

## Validation summary

| Check | Result |
|---|---|
| Locked dependencies | PASS |
| Repository lint | PASS |
| Next type generation + strict TypeScript | PASS |
| Unit/component tests | PASS — 64 files, 552 tests |
| Three-engine browser + accessibility + retained regressions | PASS — 159/159 |
| Final-source Phase-2 post-isolation-hardening rerun | PASS — 30/30 |
| Optimized production build | PASS — 31 static pages generated |
| Standalone preparation and smoke | PASS — 17 public routes, 22 assets |
| Story + Music development-route production isolation | PASS — 6/6 |
| Focused strict OpenSpec | PASS — 1/1, zero issues |
| Repository-wide strict OpenSpec | KNOWN DEBT — 11/15; four untouched legacy specs |
| Diff hygiene and immutable `tests/visual` scope | PASS |
| Graphify | Query completed; refresh N/A until the plan requires it |
| Lighthouse / motion regression | N/A — advanced motion and performance hardening are later phases |

Detailed command records are under `validation/`.

## Static evidence

- `01-static-v2-mobile-390x844.png`
- `02-static-v2-tablet-768x1024.png`
- `03-static-v2-desktop-1536x1024.png`
- `04-static-v2-reduced-motion-1536x1024.png`

These screenshots are evidence only. They do not canonize final layout,
editorial copy, Persona art, application media, score paths, responsive motion
thresholds, or public visuals.

## Local runnability

For ordinary local inspection, no environment variable is required:

```bash
pnpm dev
```

- Legacy public baseline: `http://localhost:3000/`
- Phase-2 review surface: `http://localhost:3000/__visual-lab/story`

Without Contact provider variables, reading and navigation work but real
Contact submission fails closed. Real submission requires protected values for
`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`,
`CONTACT_FROM_EMAIL`, `CONTACT_RECIPIENT_EMAIL`, and
`CONTACT_ALLOWED_ORIGINS`. No value is recorded here.

A local noindex production preview is supported with:

```bash
WFLYER_DEPLOYMENT_ENVIRONMENT=staging pnpm build
pnpm prepare:standalone
HOSTNAME=127.0.0.1 PORT=3000 NODE_ENV=production node .next/standalone/server.js
```

Provider-backed Contact submission still requires the protected variables
listed above.

## Remaining human decisions and stop condition

- Final pt-BR editorial copy remains pending; Phase-2 text is explicitly
  noncanonical review copy.
- Final Persona asset remains pending.
- Final APP-04 WebM/MP4/poster/final-frame assets remain pending.
- Final Organic Soft/Flowing public Score Paths remain a blocking Phase-9
  human subgate; responsive activation thresholds remain noncanonical.
- Staging homologation and production authorization remain pending.

Canonical Phase 3 (`Content, detailed routes, and conversion contracts`) is the
next permitted phase. It was not started. The active OpenSpec checklist still
places `Implement readiness state machine` next, which belongs to the later
intro/bootstrap work under the higher-precedence canonical plan; that sequence
must be reconciled before applying task 11. No staging, commit, push, merge,
public cutover, infrastructure change, or deployment occurred.
