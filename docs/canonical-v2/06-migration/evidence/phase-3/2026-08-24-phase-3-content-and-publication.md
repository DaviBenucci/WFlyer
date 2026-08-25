# Phase 3 content and publication evidence — 2026-08-24

## Typed semantic domain

`src/content/public/` now owns typed, geometry-free contracts for:

- 13 story chapter content records and route associations;
- four services and shared four-step process;
- three authorized project records and details;
- application overview, exact five-step flow, exact four-benefit groups,
  demonstration placeholder, and terminal-only application access;
- per-route SEO title/description;
- publication state and public selectors;
- Contact project-type values shared with the retained form schema.

The domain imports story identities only. It does not import React, GSAP,
ScrollTrigger, layout coordinates, score geometry, or Music Renderer state.
The Phase-2 story content adapter now consumes this same source.

## Public positioning and claims

- W_Flyer is represented as a brand and the owner as the professional.
- Global structured data uses `Person`, `Brand`, and `WebSite`; service
  provider identity is the owner, not a fabricated `Organization`.
- Detailed-route header/footer labels are `Sobre`, `Serviços`, `Projetos`,
  and `Contato`; the main-header application-access CTA was removed.
- No metric, ROI, testimonial, team, award, result, or additional client was
  introduced.
- Final pt-BR editorial polish remains explicitly marked for human review.

## Publication safety

The private source arrays are filtered by `publicationStatus === "public"`.
Listings, static parameters, SEO, and sitemap entries are derived only from the
filtered exports. Detail pages query those public exports and call
`notFound()` for an absent or nonpublic slug.

Initial allowlists:

- Services: `criacao-de-sites`, `criacao-de-aplicacoes`, `integracoes`,
  `solucoes-sob-medida`.
- Projects: `w-flyer`, `msn-distribuidora`, `msn-suprimentos`.

Unit tests use synthetic unpublished project and service records to prove the
filter fails closed. Three-engine dev and production tests prove invalid
project/service requests return the normal non-indexable HTTP 404 without
disclosing content.

## Deferred assets

Project media arrays are empty. The final Persona and final APP-04 media were
not invented. The application detail exposes only the Phase-3 demonstration
contract; it has no video, fake live processing, select controls, or restored
interactive tablet.
