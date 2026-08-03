## Why

Phases 00–08 have durable historical checkpoints, and the 2026-08-03 audit
closed three bounded regressions in navigation (`f61d995`), Contact delivery
identity (`3c4940c`), and the Home opening (`51e8e62`). Those focused corrective
gates do not replace one auditable final-current-revision quality run. The
repository therefore still needs that closure and a safe, environment-aware
release-candidate handoff before any Napoleon staging or production action can
be authorized. This change closes repository-owned Phase 09 work while
preserving external access, infrastructure decisions, staging validation, and
Davi Benucci's production approval as explicit gates.

## What Changes

- Make the complete CI matrix deterministic across unit, Storybook, Chromium,
  Firefox, WebKit, axe, motion, visual, dependency-security, OpenSpec, build,
  standalone, and Lighthouse gates.
- Add an explicit staging/production build environment that makes staging
  non-indexable at metadata, `robots.txt`, and response-header layers while
  leaving approved production builds indexable.
- Strengthen the manual release-candidate workflow with immutable revision and
  checksum metadata, environment-scoped configuration checks, safe artifact
  retention, and production request gates without inventing or invoking a
  Napoleon deployment mechanism.
- Reconcile deployment, runtime-secret, QA, security, observability, rollback,
  staging, and homologation documentation in English with exact external
  blockers and rerun instructions.
- Add a production-safe deployed-staging smoke suite that verifies only public
  behavior and never enables deterministic development controllers.
- Produce final local QA, accessibility, responsive, visual, performance,
  security, SEO, and release-readiness evidence without deploying or mutating
  Cloudflare, Napoleon, GitHub repository settings, DNS, or
  `app.wflyer.com.br`.

## Capabilities

### New Capabilities

- `complete-quality-gate`: Defines the reproducible repository and CI evidence
  required for a release candidate.
- `staging-index-isolation`: Defines environment-derived indexing behavior for
  staging and production builds.
- `governed-release-candidate`: Defines immutable candidate packaging,
  environment configuration, approval boundaries, handoff, and rollback
  traceability.

### Modified Capabilities

None.

## Impact

The change affects GitHub Actions, package scripts, deployment/SEO
configuration, focused tests, and technical operations/QA documentation. It
does not change public product scope, contact semantics, DNS, Cloudflare,
Napoleon, the musical application, production data, or external provider state.
Rollback consists of reverting the Phase 09 commit; existing standalone builds
and the already completed site remain operable.
