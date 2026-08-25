# Canonical Decision Register

## Legacy ADR status

| ADR | Status in v2 |
|---|---|
| ADR-001 separate repositories | RETAINED |
| ADR-002 static-first with server contact route | RETAINED |
| ADR-003 no database/CMS/auth for site v1 | RETAINED |
| ADR-004 GSAP as sole programmatic motion engine | RETAINED |
| ADR-005 monolithic horizontal scene | HISTORICAL; later route model and then v2 replaced it |
| ADR-006 header compass/page-link model | SUPERSEDED by ADR-031 |
| ADR-007 wavy score | REFINED by ADR-025 |
| ADR-008 official identity/direction | RETAINED |
| ADR-009 contact Route Handler | RETAINED |
| ADR-010 no custom CSRF in initial contact flow | RETAINED with existing controls |
| ADR-011 no runtime AI framework | RETAINED |
| ADR-012 programmatic vector opening | RETAINED and REFINED by ADR-033/038 |
| ADR-013 master visual board | RETAINED as historical global reference; specific approved assets take precedence |
| ADR-014 Home + route-per-chapter double score | SUPERSEDED by ADR-025/030/031/032 |
| ADR-015 route chapter terminals | SUPERSEDED by ADR-025/037 |
| ADR-016 interactive DOM tablet | SUPERSEDED by ADR-036 |
| ADR-017 archetype inheritance | REFINED by ADR-039 |
| ADR-018 Cloudflare/DNS already provisioned | RETAINED |
| ADR-019 prior implementation freeze | SUPERSEDED by the v2 linear plan |
| ADR-020 Napoleon/GitHub runtime | RETAINED |
| ADR-021 secret ownership | RETAINED |
| ADR-022 channels/projects/no analytics | RETAINED, with W_Flyer repositioning |
| ADR-023 owner homologation | RETAINED |
| ADR-024 Napoleon exact-SHA branch handoff | RETAINED |

## ADR-025 — Continuous organic dual-score narrative

**Status:** APPROVED — 2026-08-14

Home is the common origin of two perceptually continuous five-line scores. Desktop application travels left and professional travels right. Each branch uses geometrically compatible modular segments, long smooth master-guide curves, coherent offsets, and a final barline before its terminal. Mobile uses a vertical/serpentine adaptation with shared semantic IDs.

## ADR-026 — W_Flyer Music Renderer v0.1

**Status:** APPROVED

Designer-owned SVG glyph geometry is separated from deterministic engraving primitives. `staffSpace`, `staffStep`, ScorePath point/tangent/normal frames, ledger-line rules, stems, beams/hooks, accidentals, key signatures, and barlines are deterministic. Pure geometry is independent of React.

## ADR-027 — Seeded procedural score composition

**Status:** APPROVED

The public score is a session-seeded assembly of whitelisted motifs and controlled pitch contours, not free music generation. Same session/version/chapter/semantic slots yield the same composition across reload, theme, responsive mode, and reduced motion. `Math.random()` is prohibited.

## ADR-028 — Music calibration and Visual Lab gates

**Status:** APPROVED

Eight SVG glyphs are visual-reference approved but runtime approval requires human-calibrated metrics/anchors. Gate A validates geometry, Gate B is human calibration, and Gate C validates renderer/composer visual behavior. Landing integration is forbidden before all gates.

## ADR-029 — W_Flyer brand and personal professional positioning

**Status:** APPROVED

W_Flyer is a brand. The site presents the owner’s professional work, services, and projects without claiming a company/team structure. Positioning is portfolio + service acquisition (P2).

## ADR-030 — Alternative A: immersive landing plus detailed routes

**Status:** APPROVED

`/` is an immersive summary story. Detailed pages remain independent for SEO, accessibility, sharing, and long-form content. The landing is not required to contain all detail-page content.

## ADR-031 — Native-scroll master story and header traversal

**Status:** APPROVED

Native vertical scroll is the canonical story progress. Desktop maps it to one horizontal master timeline. Header navigation animates that same scroll position through intermediate chapters; duration is proportional to real story distance and capped at 3.0 seconds. Explicit user input cancels/supersedes automated traversal.

## ADR-032 — Responsive vertical story and mobile order

**Status:** APPROVED

Horizontal story is progressive enhancement for eligible wide/full-motion viewports. Vertical story is universal fallback. Mobile order is Home → professional branch → professional ending → application branch → application ending → global footer. Access W_Flyer is the last application content scene.

## ADR-033 — Readiness-driven opening, deep links, and history restoration

**Status:** APPROVED

The opening is readiness-driven, fail-open, session-bounded, skippable, and noncritical-media independent. Initial Home/hash/history position is established before the overlay exits. Direct deep links do not replay the whole narrative. Passive scroll uses `replaceState`; successful explicit header traversal uses `pushState`.

## ADR-034 — Professional branch and project-card presentation

**Status:** APPROVED

Professional sequence is About → Services → Process → Projects → Contact. Process is a narrative chapter but not a required header item. Projects are authorized cases displayed as partially overlapped hand/fan cards on desktop and a staggered vertical stack on mobile. Hover/focus raises and foregrounds the selected card.

**Phase-3 route clarification:** APPROVED by repository owner instruction on
2026-08-24. `/portfolio` remains the stable current-release listing URL;
allowlisted details use `/portfolio/[slug]`. This is an additive detail
contract, not approval to migrate the namespace to `/projetos`. Unknown or
nonpublic slugs fail closed and remain absent from sitemap output.

## ADR-035 — Humanized hooded W_Flyer Persona

**Status:** APPROVED CONCEPT / FINAL ASSET PENDING

The Persona represents the owner and W_Flyer simultaneously. It is a humanized, hooded, non-photorealistic Concept-D figure derived from brand geometry, without reproducing identifiable physical appearance. It is required in About and may appear in controlled session-seeded easter eggs.

## ADR-036 — Non-interactive video application demonstration

**Status:** APPROVED / FINAL MEDIA PENDING

APP-04 is a scenographic device containing a muted/no-audio video, not a mini application. It plays once only when the chapter becomes active, then shows the exact final-frame image and a replay control at the top center. The simulated interface is non-interactive; replay is the only interactive screen control.

## ADR-037 — Branch terminals and footer semantics

**Status:** APPROVED

Each desktop branch reaches a final barline and a visual terminal/footer. Mobile uses a visual professional ending/transition and one real global footer after the application ending. Footer data is shared and never maintained as independent copies.

## ADR-038 — Progressive enhancement, reduced motion, lifecycle, and performance

**Status:** APPROVED

Motion failure degrades to a functional vertical document. Reduced motion uses vertical static mode, no horizontal pinning, no demo autoplay, and no animated easter eggs. GSAP/ScrollTrigger resources have explicit ownership/cleanup. Core Web Vitals and zero React renders per scroll frame are release gates.

## ADR-039 — Designer-owned visual asset governance

**Status:** APPROVED

Visual assets are separated into source master, approved asset, and runtime representation. Manifest/status/checksum/semantic IDs are mandatory. Codex may compose but not redraw approved geometry. Score segments have entry/exit contracts and shared semantic IDs across layouts.
