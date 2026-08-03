## 1. Staging index isolation

- [x] 1.1 Add a strict deployment-environment domain and document the required build/runtime value.
- [x] 1.2 Apply non-production robots metadata, crawler policy, and `X-Robots-Tag` while preserving production SEO.
- [x] 1.3 Add unit and standalone HTTP evidence for staging, production, absent, and invalid environment behavior.

## 2. Complete quality workflow

- [x] 2.1 Make functional, accessibility, motion, and visual CI commands cover Chromium, Firefox, and WebKit with the proven worker profile.
- [x] 2.2 Add production dependency audit, peer validation, OpenSpec, Storybook, build, standalone, and Lighthouse gates without production secrets.
- [x] 2.3 Validate workflow syntax, pinned actions, permissions, concurrency, and artifact isolation; common CI must never package or upload a deployable standalone candidate.
- [x] 2.4 Add a production-safe deployed-staging suite that uses no private deterministic controller or forced checkpoint.

## 3. Governed release candidate

- [x] 3.1 Add validated non-secret release manifest generation for revision, ref, environment, workflow run and attempt, archive, checksum, and creation time.
- [x] 3.2 Gate candidate packaging on the complete revision-specific quality matrix and the selected GitHub Environment.
- [x] 3.3 Validate exactly one public build value and five server runtime values by name only, expose only the public value to the environment-specific build, and retain the no-deploy Napoleon handoff.
- [x] 3.4 Add automated tests for manifest rejection, integrity output, release-request policy, and absence of invented deploy mechanisms.

## 4. Operational documentation

- [x] 4.1 Reconcile the Napoleon standalone, GitHub Environment, runtime-variable, Cloudflare inventory, and staging setup guide in English.
- [x] 4.2 Document the exact public-surface staging command, CSP/HSTS/rate-limit gates, contact-provider validation, and indexing checks without prescribing local deterministic suites against the deployment.
- [x] 4.3 Document release-candidate identity, deployment checklist, previous-known-good placeholder, rollback, incident response, cache guidance, and `app.wflyer.com.br` preservation.
- [x] 4.4 Record local QA, accessibility, responsive, visual, SEO, performance, security, and external-gate evidence without overstating manual or deployed validation.
- [x] 4.5 Update acceptance/security checklists, documentation index, execution report, completion state, exact human homologation steps, and the 2026-08-03 F00–F09 historical audit matrix with columns `Phase | Requirement | Documentation | Implementation | Test evidence | Runtime evidence | Status | Action` plus its regression register.

## 5. Final validation and closure

- [x] 5.1 Run dependency, lint, typecheck, unit, Storybook, complete cross-browser, axe, motion, visual, build-mode, standalone, Lighthouse, audit, bundle, and secret gates.
- [x] 5.2 Refresh and validate Graphify for CI, indexing, candidate packaging, operations, and rollback relationships.
- [x] 5.3 Strict-validate OpenSpec and preserve the active change if external staging gates remain incomplete.
- [x] 5.4 Create a focused repository checkpoint while preserving unrelated work and performing no external deployment.

## 6. Confirmed Napoleon Git-branch handoff

- [x] 6.1 Reconcile the OpenSpec design, governed candidate contract, deployment guides, runbook, and execution evidence with the owner-confirmed Napoleon Git pull/build integration on `develop/site-institucional`.
- [x] 6.2 Add regression evidence that CI observes the staging branch, remains read-only, creates no deployment commit, and requires one full branch/CI/manifest SHA before Napoleon activation.
- [x] 6.3 Strict-validate and sync the revised OpenSpec contract, then refresh Graphify for the branch-to-CI-to-Napoleon relationship.
- [x] 6.4 Create a focused checkpoint and publish only `develop/site-institucional` after local gates pass, without changing `main`, configuring Napoleon, or claiming deployed-staging evidence.
