# Phase 3 changed-file inventory — 2026-08-24

This is the Phase-3 touch inventory, not a claim that the repository worktree
contains only Phase-3 changes. The live worktree also retains legitimate,
uncommitted Phase-0/1/2 and Music System work. Shared status and OpenSpec files
below therefore contain changes from more than one completed phase.

## Canonical status and route decisions

- `PRE-CODE-STATUS.md`
- `WFLYER_CODEX_START_HERE.md`
- `WFLYER_CANONICAL_DOCUMENTATION_MANIFEST.md`
- `WFLYER_IMPLEMENTATION_PLAN.md`
- `docs/canonical-v2/README.md`
- `docs/canonical-v2/00-governance/03-decision-register.md`
- `docs/canonical-v2/00-governance/06-decision-traceability.md`
- `docs/canonical-v2/01-product/02-information-architecture-and-routes.md`
- `docs/canonical-v2/02-experience/02-chapter-contracts.md`
- `docs/canonical-v2/03-visual/04-project-card-system.md`
- `docs/canonical-v2/06-migration/02-file-by-file-migration-map.md`
- `docs/canonical-v2/manifests/implementation-phases.v2.yaml`

## Active OpenSpec change

- `openspec/changes/rebuild-scroll-driven-wflyer-v2/proposal.md`
- `openspec/changes/rebuild-scroll-driven-wflyer-v2/design.md`
- `openspec/changes/rebuild-scroll-driven-wflyer-v2/tasks.md`
- `openspec/changes/rebuild-scroll-driven-wflyer-v2/specs/continuous-dual-score/spec.md`
- `openspec/changes/rebuild-scroll-driven-wflyer-v2/specs/persona-easter-eggs/spec.md`
- `openspec/changes/rebuild-scroll-driven-wflyer-v2/specs/professional-portfolio-presentation/spec.md`
- `openspec/changes/rebuild-scroll-driven-wflyer-v2/specs/responsive-story-mode/spec.md`
- `openspec/changes/rebuild-scroll-driven-wflyer-v2/specs/scroll-driven-portfolio-landing/spec.md`

## Typed domain and adapters

- `src/content/public/types.ts`
- `src/content/public/domain.ts`
- `src/content/public/index.ts`
- `src/content/story-v2.ts`
- `src/content/site-content.ts`

## Routes

- `src/app/layout.tsx`
- `src/app/sobre/page.tsx`
- `src/app/servicos/page.tsx`
- `src/app/servicos/criacao-de-sites/page.tsx`
- `src/app/servicos/criacao-de-aplicacoes/page.tsx`
- `src/app/servicos/integracoes/page.tsx`
- `src/app/servicos/solucoes-sob-medida/page.tsx`
- `src/app/servicos/[slug]/page.tsx`
- `src/app/processo/page.tsx`
- `src/app/portfolio/page.tsx`
- `src/app/portfolio/[slug]/page.tsx`
- `src/app/contato/page.tsx`
- `src/app/aplicacao-wflyer/page.tsx`
- `src/app/aplicacao-wflyer/como-funciona/page.tsx`
- `src/app/aplicacao-wflyer/beneficios/page.tsx`

`src/app/page.tsx`, the public legacy landing, was not changed.

## Presentation, navigation, SEO, and configuration

- `src/components/pages/ProjectListing.tsx`
- `src/components/pages/ProjectListing.test.tsx`
- `src/components/pages/ServiceDetailPage.tsx`
- `src/components/pages/index.ts`
- `src/components/seo/StructuredData.tsx`
- `src/components/header/SiteHeader.tsx`
- `src/components/header/SiteHeader.test.tsx`
- `src/components/header/navigation.test.ts`
- `src/components/header/NavigationMeasure.stories.tsx`
- `src/components/footer/SiteFooter.tsx`
- `src/config/deployment.ts`
- `src/config/navigation.ts`
- `src/config/seo.ts`
- `src/config/site.ts`

## Validation and evidence tooling

- `scripts/capture-phase-3-content-evidence.mjs`
- `scripts/smoke-standalone.mjs`
- `tests/unit/public-content.test.ts`
- `tests/unit/content.test.ts`
- `tests/unit/navigation.test.ts`
- `tests/e2e/phase03-content-routes.spec.ts`
- `tests/e2e/static-routes.spec.ts`
- `tests/e2e/design-system.spec.ts`
- `tests/e2e/page-archetypes.spec.ts`
- `tests/a11y/static-routes.a11y.spec.ts`
- all files in `docs/canonical-v2/06-migration/evidence/phase-3/`

The existing Contact Route Handler, schema, Turnstile/provider adapters, form
state machine, Music implementation, Phase-2 story implementation, and visual
goldens were not changed by Phase 3.
