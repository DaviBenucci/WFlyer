# Phase 09 local release-readiness report

**Date:** 2026-08-03
**Scope:** `wflyer.com.br` institutional repository and local standalone runtime
**Administrative infrastructure:** GitHub settings, Napoleon, Cloudflare, and
provider dashboards were not accessed
**Public read-only reachability:** observed separately on 2026-08-03
**Production action:** not authorized or performed

## Historical decision — 2026-08-03

Repository-owned implementation and measured local validation are
`verified-complete`. GitHub settings, Napoleon, Cloudflare, provider delivery,
physical assistive technology, legal review, deployed staging, rollback
rehearsal, and human homologation remain `blocked` on owner-controlled access
or decisions. The operational macrostate is therefore
`CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING`. Production remains
unauthorized.

## Browser-evidence correction — 2026-08-05

The measurements below remain historical evidence for the 2026-08-03 source
state; they are not current release proof for the later interrupted working
tree. Public Actions run `30918790636` subsequently reported 268/291 visual
checks passing and 23 failures. Its retained evidence exposed a development-
server surface in the changing WebKit reduced-motion Home retry and stable
cross-host text-edge differences in Firefox Phase 06. Therefore every later
use of “current” or `verified-complete` below must be read within the dated
2026-08-03 audit only.

The corrective implementation is tracked by OpenSpec change
`stabilize-browser-visual-regression`. Its repository-owned local evidence is
now `verified-complete`: the exact Playwright 1.62.0 Noble image produced 34
reviewed replacement snapshots, five consecutive reduced-motion WebKit passes,
two unchanged 291/291 zero-tolerance visual runs, E2E 318/318, axe 102/102, and
motion 30/30 with retries disabled. Unit/component 305/305, Storybook 63/63,
four 22-route builds, standalone 17 routes + 20 assets, indexing 4/4, and
Lighthouse 15/15 also passed. No previous baseline result was reused to satisfy
the new canonical-environment gate.

This local proof belongs to an uncommitted working tree at base SHA
`5a4ea8529582931e287cc667ab436544c9a176ee`. It is not a GitHub-hosted result.
After an authorized commit and push, common CI must pass for the resulting full
SHA; the manual candidate browser workflow must separately pass for that same
SHA before candidate acceptance. Until then, remote release evidence remains
`implemented-but-unverified`.

The public reachability observation was intentionally narrower than an
infrastructure inventory. `wflyer.com.br` returned an HTTP 200 placeholder, and
the documented MSN portfolio, Instagram, and GitHub destinations returned
public HTTP responses. `app.wflyer.com.br` did not resolve in DNS from the
observation environment. These point-in-time results neither prove ownership,
configuration, application health, staging readiness, nor the cause of the
application-host failure. The unresolved application host is an independent
baseline blocker that must be investigated by its owner without changing it as
part of the institutional-site release.

## Historical implementation audit matrix — 2026-08-03

This matrix uses only the required audit taxonomy: `verified-complete`,
`implemented-but-unverified`, `partially-implemented`, `regressed`,
`not-started`, `blocked`, and `obsolete-or-duplicated`. F00–F08 retain their
durable historical evidence, while F09 records the dated 2026-08-03 local
candidate and separates unavailable external integration.

| Phase | Requirement | Documentation | Implementation | Test evidence | Runtime evidence | Status | Action |
|---|---|---|---|---|---|---|---|
| F00 | Establish the locked Next.js foundation, strict types, local fonts, standalone output, and baseline controls. | Phase plan, technology manifest, and accumulated execution report. | Foundation, dependency policy, Storybook, Playwright, headers, and initial standalone scripts were committed. | Historical gate: 8 unit tests plus Storybook, Playwright, actionlint, and Lighthouse. | Historical local standalone and Lighthouse checkpoint passed; no Napoleon runtime was used. | `verified-complete` | Preserve the checkpoint. |
| F01 | Implement the approved visual system, themes, header, score primitives, and catalog. | Design tokens, header/score specifications, and Phase 01 report. | Local fonts, CSS tokens, themes, official brand symbol, score, header, and navigation primitives were committed. | Historical gate: 48 unit, 33 Storybook, and 13 Playwright checks. | Historical local standalone and three Lighthouse runs passed. | `verified-complete` | Preserve the approved visual language. |
| F02 | Publish the 17 approved routes with verified local content and SEO foundations. | Content profile, route/content specifications, and Phase 02 report. | Static routes, route compositions, verified profile facts, metadata, and legal surfaces were committed. | Historical gate: 52 unit and 35 focused route, keyboard, SEO, and axe checks. | Historical build emitted 22 pages; local standalone covered 17 routes and 14 assets. | `verified-complete` | Preserve route/content parity. |
| F03 | Compose Home as the origin of the two score branches and enforce chapter topology. | Double-score, Home, chapter-manifest, and transition specifications. | Bifurcated Home, original narrative clef, chapter anchors, directional navigation, and terminal barlines were committed. | Historical gate: 58 unit, 38 Storybook, and 73 Playwright checks. | Historical local standalone covered 17 routes and 14 assets; three Lighthouse runs passed. | `verified-complete` | Preserve exact topology. |
| F04 | Derive every authorized page from its visual archetype without productive screenshots. | Visual archetypes, page matrix, visual page specification, and Phase 04 report. | Sixteen authorized page compositions, static tablet shell, page scores, services order, and legal header treatment were committed. | Historical gate: 65 unit, 46 Storybook, 147 Playwright checks, and 15 reviewed visual captures; the current visual matrix also passed 291/291 without baseline updates. | Historical local standalone covered 17 routes and 17 assets; the current cross-engine density correction is verified. | `verified-complete` | Preserve reviewed baselines. |
| F05 | Deliver cancelable score-driven navigation with truthful focus, history, and reduced motion. | Motion/navigation specification, canonical OpenSpec capability, and Phase 05 report. | Persistent transition shell, manifest topology, GSAP lifecycle, focus/history behavior, and deterministic local controllers were committed. | Historical gate plus the current 315/315 E2E, 102/102 axe, 30/30 motion, and 291/291 visual matrices passed. | Current local browser/runtime evidence includes corrective commit `f61d995`. | `verified-complete` | Preserve the corrective contract. |
| F06 | Provide an operable, local, deterministic tablet demonstration without network or musical processing. | Tablet motion/product specifications and Phase 06 report. | Semantic five-state tablet, original SVG score, keyboard/touch controls, cancellable processing, privacy instrumentation, and bounded CSS/GSAP tilt were committed. | Historical gate plus the current complete browser, accessibility, motion, and visual matrices passed. | Current standalone and public staging-mode checks preserve the no-network tablet contract. | `verified-complete` | Preserve tablet privacy and geometry. |
| F07 | Implement the official 5.6-second brand opening, Home handoff, recovery, and accessible interaction isolation. | Opening timeline, canonical capability, original archive, and corrective archive `2026-08-03-complete-brand-home-opening`. | Original intro plus the missing Home choreography and exact inert/`aria-hidden` restoration are durable in commit `51e8e62`. | Corrective focused gates and the current complete browser/accessibility/visual matrices passed. | Current local runtime evidence covers completion, skip, recovery, reduced motion, and cleanup. | `verified-complete` | Preserve the refreshed Graphify representation. |
| F08 | Complete official content, secure Contact delivery, legal surfaces, and the browser-security baseline. | Contact/security documentation, two canonical capabilities, and Phase 08 report. | Strict 16 KiB API, Turnstile/Resend boundaries, recoverable form, headers, CSP report-only policy, and truthful public content were committed. | Historical gate plus 298/298 current unit/component tests in 33 files and the complete browser matrices passed. | Corrective commit `3c4940c` is locally verified; real provider delivery remains external. | `verified-complete` | Preserve local security boundaries. |
| F09-local | Add fail-closed indexing modes, complete CI, a governed candidate handoff, public-only staging checks, and exact operations documentation. | Active OpenSpec change, deployment/secrets guides, this report, acceptance/security checklists, and staging operations runbook. | Environment/indexing contracts, normalized candidate workflow, manifest validation, public staging suite, and operations documentation are implemented. | 298/298 unit in 33 files, 63/63 Storybook, 315/315 E2E, 102/102 axe, 30/30 motion, 291/291 visual, and 69/69 local public-staging checks passed. | Four 22-route builds, standalone 17 routes + 20 assets, indexing 4/4, Lighthouse 15/15, archive/manifest integrity, and bundle isolation passed. | `verified-complete` | Preserve the focused checkpoint; continue only with external gates. |
| F09-external | Configure and validate the protected delivery path without altering the separate application. | ADR-024, staging/release operations, security checklist, and external blocker register. | The owner-confirmed Napoleon Git-branch handoff is documented; application settings and other owner-controlled infrastructure remain unavailable. | Workflow regression evidence covers the read-only branch/SHA contract; no deployed-staging, provider, physical-device, legal, rollback, or production evidence is claimed. | `app.wflyer.com.br` remains unresolved in the public baseline; no Napoleon or Cloudflare setting was mutated. | `blocked` | Publish and validate the staging branch CI, inventory/configure Napoleon, deploy staging, validate, and homologate before production. |

## Regression register — 2026-08-03

| Register | Audit finding | Correction | Measured evidence | Status | Remaining boundary |
|---|---|---|---|---|---|
| `REG-F05-NAVIGATION` | Production and test geometry had diverged, capture-phase enhancement lacked a native opt-out contract, and post-commit navigation could replace truthful history. | Commit `f61d995` consolidated geometry, added native opt-out, and preserved post-commit history. | Corrective focused gates plus current E2E 315/315, axe 102/102, motion 30/30, and visual 291/291 passed. | `verified-complete` | None locally. |
| `REG-F08-CONTACT-RETRY` | An unchanged retry after provider timeout could create a second delivery. | Commit `3c4940c` added a logical-submission UUID and stable Resend identity. | Corrective tests and the current 298/298 unit/component and 315/315 E2E suites passed. | `verified-complete` | Real provider delivery is `blocked`. |
| `REG-F07-HOME-OPENING` | The authored Home interval was empty and the surface behind the overlay remained operable. | Commit `51e8e62` added bounded choreography and exact interaction isolation/restoration. | Corrective focused gates plus the current complete browser/accessibility/visual matrices passed. | `verified-complete` | Graphify refresh remains administrative closure. |
| `REG-F09-COMMON-CI-ARTIFACT` | The Phase 09 draft allowed ordinary CI to create a deployable standalone archive. | Common CI now validates only; candidate packaging exists only in the protected manual workflow. | Workflow regression coverage is included in 298/298 unit tests; actionlint 1.7.12 passed both workflows. | `verified-complete` | Real protected Environment execution is `blocked`. |
| `REG-F09-PLAYWRIGHT-EVIDENCE-COLLISION` | Sequential browser categories could overwrite shared Playwright output. | Each category uses a validated directory below the safe evidence roots. | E2E 315/315, axe 102/102, motion 30/30, and visual 291/291 produced separate evidence. | `verified-complete` | None locally. |
| `REG-F09-RELEASE-IDENTITY` | A mutable requested ref could diverge between candidate jobs. | The workflow resolves the ref once and reuses one full SHA for quality, browser, build, archive, and manifest. | Workflow/manifest regression tests passed within 298/298. | `verified-complete` | URL-to-artifact confirmation in Napoleon is `blocked`. |
| `REG-F09-RERUN-MANIFEST-PROVENANCE` | Rerun artifacts could collide and a checksum file alone did not prove the archive actually hashed. | Artifact names and manifests include run attempt; manifest creation hashes the actual archive. | Local manifest integrity passed with `deployment.performed=false`; two packages of the same tree shared SHA-256 `b1c262ff65624c234fe7822aa5829a5c0872616d12f3fd47fa5ad7ee030e3a53`. | `verified-complete` | GitHub artifact execution is `blocked`. |
| `REG-F09-ENVIRONMENT-OWNERSHIP` | The initial contract mixed unused public URLs with Napoleon runtime values. | The candidate uses exactly one public build value and five server-runtime values. | Unit/workflow checks passed; bundle inspection found no secret-like value. | `verified-complete` | Runtime injection in Napoleon is `blocked`. |
| `REG-F09-STAGING-QUALITY-ORDER` | A staging noindex build could contaminate the production Lighthouse/SEO baseline. | Lighthouse runs on the production build before the separate staging indexing build. | Four indexing modes passed 4/4; Lighthouse passed 15/15 with every category at least 1.00. | `verified-complete` | Deployed staging remains `blocked`. |
| `REG-F09-REPRODUCIBILITY-CLAIM` | Documentation overstated reproducibility across independent hosted builds. | The contract now claims normalized, checksummed packaging and scopes byte identity to the same prepared tree. | Two same-tree packages produced the same SHA-256; prepared tree/archive sizes were 29 MiB/4.4 MiB. | `verified-complete` | None locally. |
| `REG-F09-STAGING-REVISION-IDENTITY` | A staging suite could run from a different checkout, while the public URL exposes no documented revision proof. | Operations require a clean checkout at the manifest SHA and an operator record tying Napoleon/host to it. | Repository instructions and local manifest checks are complete. | `verified-complete` | External URL-to-artifact attestation is `blocked`. |
| `REG-F09-CROSS-ENGINE-APPLICATION-DENSITY` | Firefox/WebKit wrapped the Application feature heading and displaced the feature strip/cue. | The localized heading cap preserves density without moving the tablet or overlapping its caption. | Focused cross-engine inspection and the unchanged-baseline visual matrix passed 291/291. | `verified-complete` | None locally. |
| `REG-F09-NEXT-TYPEGEN-GATE` | Plain `tsc --noEmit` could consume stale generated route types while `next-env.d.ts` was tracked, so the final gate did not prove current Next.js route contracts. | `typecheck` now runs `next typegen` first, generated `.next/types` remain included, `next-env.d.ts` is ignored, and the two newly exposed typed-route errors were corrected without weakening runtime validation. | Official Next.js type generation and strict TypeScript pass; the complete unit suite passes 298/298. | `verified-complete` | None locally. |
| `REG-F09-BUILD-ID-CANONICALIZATION` | Trimming `WFLYER_BUILD_ID` accepted a padded value instead of the exact raw 40-character lowercase SHA. | Build-ID validation now rejects leading/trailing whitespace, uppercase, and wrong length before Next.js accepts the candidate. | Focused configuration behavior tests and the complete 298/298 unit suite passed. | `verified-complete` | None locally. |
| `REG-F09-SYMLINK-CONTAINMENT` | Lexical evidence and release-path containment could traverse a symlink below an allowed root. | Playwright evidence paths and release-manifest inputs now walk existing path components with `lstat` and reject symlinks before use. | Dedicated workflow/manifest symlink regressions and the complete 298/298 unit suite passed. | `verified-complete` | None locally. |
| `REG-F09-NAPOLEON-HANDOFF-ASSUMPTION` | Operations treated the Napoleon transport as unknown and could not distinguish an Actions artifact from a provider-side source build. | ADR-024 and the release contract now record a read-only GitHub Actions pipeline plus Napoleon Git pull/build from `develop/site-institucional`, with one branch/CI/manifest SHA and no Actions-authored commit. | Focused workflow tests verify the branch trigger, read-only permissions, non-persisted checkout credentials, immutable SHA, and absence of commit/push/deploy commands. | `verified-complete` | Napoleon build/start, environment scopes, selected SHA, and public runtime remain `blocked` until panel inventory. |

## Historical automated quality gate — 2026-08-03

The measured repository-owned gate and administrative closure are complete:

| Gate | Final result |
|---|---|
| Final source/dependency rerun | `verified-complete` — frozen install, exact versions, ESLint, Next typegen/strict TypeScript, production audit, peers, and actionlint |
| Unit/component tests | `verified-complete` — 298/298 in 33 files |
| Coverage | `verified-complete` — statements 69.40% (1277/1840), branches 68.29% (896/1312), functions 74.59% (279/374), lines 69.86% (1231/1762) |
| Storybook browser tests | `verified-complete` — 63/63 |
| Functional E2E | `verified-complete` — 315/315 |
| axe accessibility | `verified-complete` — 102/102 |
| Motion | `verified-complete` — 30/30 |
| Visual | `verified-complete` — 291/291 without baseline update |
| Local public-staging suite | `verified-complete` — 69/69 |
| Four deployment-mode builds | `verified-complete` — production, staging, absent, and preview each built 22 routes |
| Standalone and indexing | `verified-complete` — 17 routes + 20 assets; indexing 4/4 |
| Lighthouse | `verified-complete` — 15/15; minimum category score 1.00; maximum LCP 755 ms, CLS 0.0034, TBT 3 ms |
| Archive and manifest | `verified-complete` — 29 MiB tree, 4.4 MiB archive, same-tree SHA-256 match, valid manifest with `performed=false` |
| Bundle isolation | `verified-complete` — no credential values or prohibited tooling/content; expected runtime variable names remain server-side and dormant checkpoint strings expose no private production controller |
| Final OpenSpec and Graphify rerun | `verified-complete` — OpenSpec 10/10 strict; Graphify 3,081 nodes, 4,322 edges, 328 communities with clean multigraph diagnostics |
| Focused repository checkpoint | `verified-complete` — this closure is recorded in the focused Phase 09 commit without the unrelated README change |

No assertion is weakened, conditionally skipped, or updated without visual
inspection to create this evidence. The stable local/CI browser profile is one
worker.

These results establish the repository-owned implementation as
`verified-complete`. They do not complete any external gate.

## Historical functional coverage — 2026-08-03

The 315/315 E2E journeys cover both Home branches,
adjacent and compressed score navigation, Home-pivot cross-branch navigation,
direct links, Back/Forward,
focus transfer, cancellation, timeout recovery, terminal chapters, opening
completion/skip/Escape/fail-open, tablet processing/result/reset/privacy,
Contact validation/verification/success/failure, legal routes, theme, mobile
menu, 404, sitemap/robots, and external-link semantics.

When executed locally, provider checks use deterministic mocks or official
public test configuration. They can prove application behavior but not external
Turnstile or Resend readiness.

## Historical accessibility — 2026-08-03

The 102/102 axe matrix and functional assertions cover semantic
landmarks, headings, skip navigation, keyboard access, visible focus, route
announcement, SVG/decorative exclusion, target sizes, form
labels/constraints/status, error recovery, mobile navigation,
theme contrast rules, reduced motion, reflow, orientation, and the meaningful
Contact states. Critical/serious axe findings are release blockers.

Not performed locally: a physical screen-reader session, operating-system
high-contrast mode, real on-screen keyboard, independent WCAG review, and a
qualified accessibility audit. These remain explicit staging/homologation
checks.

## Historical responsive and visual evidence — 2026-08-03

The 291/291 unchanged-baseline visual matrix and responsive assertions cover
320 px portrait,
short landscape, mobile, tablet, canonical 1536 × 1024 desktop, wide
layouts, all documented breakpoints, light/dark, and reduced motion. Assertions
check horizontal overflow, reachable
controls, geometry parity, final barlines, tablet usability, legal readability,
and score containment.

Existing golden references continue to control approved visual language.
Phase-specific snapshots are QA evidence only and are never loaded by
production pages. The cross-engine Application density correction passed the
complete matrix without updating a baseline.

## SEO and staging isolation

The implementation preserves unique production titles/descriptions,
canonicals, Open Graph/Twitter metadata, favicon, structured data limited to
verified facts, the 17-route sitemap, and a crawler policy that excludes
`/api/`. Staging and unknown builds fail closed through HTML
noindex/nofollow metadata, `X-Robots-Tag`, and a disallow-all `robots.txt`
without a sitemap advertisement. Production, staging, absent, and preview
builds each emitted 22 routes and passed standalone indexing smoke, 4/4.

## Performance and artifact boundary

The build remains predominantly static with `/api/contact` as the intentional
dynamic route. Standalone smoke passed all 17 public routes and 20 referenced
assets. Bundle inspection found no credential values or prohibited
tooling/content. Required server-runtime variable names remain in the server
bundle by design. Dormant checkpoint code strings may remain in production
client chunks, but `testMode=false` exposes no private global/controller; the
production-safe public staging suite verified that hooks are disabled and not
exposed. The only intended Contact browser third party is the scoped, finite
Turnstile script.

Lighthouse passed 15/15 runs with every category score at least 1.00. Maximum
observed LCP was 755 ms, CLS 0.0034, and TBT 3 ms. External Core Web Vitals,
real network/provider latency, Napoleon process behavior, and edge caching
cannot be inferred locally.

## Security

The implemented, locally verifiable baseline includes strict request ordering,
streamed 16 KiB limit, exact origin, honeypot, Zod, Turnstile action/hostname,
fixed
plain-text Resend construction, no persistence, no contact-payload logging in
application source, generic no-store responses, safe browser headers,
report-only CSP without `unsafe-eval`, safe external links, and release
artifact isolation. Final source/dependency closure is green; external logs
and controls are not inferred from local bundle inspection.

Still external: Cloudflare read-only inventory, WAF/rate policy, HTTPS/HSTS
decision, CSP report observation/enforcement, Napoleon process isolation and
runtime values, provider verification, log-retention approval, and rollback
rehearsal.

## Workflow and release candidate

The CI and manual release workflows use pinned actions, non-persisted checkout
credentials, and read-only repository permissions. Pull requests and ordinary
pushes—including `develop/site-institucional`—validate the production
standalone baseline and all four indexing modes without creating or uploading a
deployable archive. Candidate packaging exists only in the manual workflow: it
waits for complete quality and browser jobs, then enters the selected GitHub
Environment. Production additionally requires an approved main/tag ref, the
exact homologation confirmation, and the external protected-Environment review.

The owner-confirmed Napoleon integration independently pulls/builds the
selected environment branch. GitHub Actions creates no deployment commit and
does not advance that branch. Before the first staging start, the remote
`develop/site-institucional` head, green CI run, manifest revision, and
Napoleon-selected SHA must match. The Actions archive proves candidate quality;
it is not asserted to be byte-identical to Napoleon's source build.

The prepared standalone tree measured 29 MiB and its normalized archive 4.4
MiB. Two packaging executions over that same tree produced SHA-256
`b1c262ff65624c234fe7822aa5829a5c0872616d12f3fd47fa5ad7ee030e3a53`.
The local non-secret manifest matched repository, revision, source ref,
environment, workflow run ID/attempt/URL, archive, checksum, creation time, and
`deployment.performed=false`; tests reject inconsistent provenance. This is an
integrity contract, not a claim that independent Next.js builds on floating
hosted environments are byte-reproducible. No Napoleon API, webhook, SSH
command, DNS mutation, deploy call, merge, tag, or public release is performed.

The final standalone candidate now exposes the document-root files expected by
Napoleon-style uploads: `index.html`, `icon.svg`, `robots.txt`, `sitemap.xml`,
`404.html`, and the mirrored `_next/static/` tree. The root `index.html`
references the actual production assets rather than a placeholder landing
page.

## Historical manual inspection performed locally — 2026-08-03

Historical phase screenshots and the 2026-08-03 corrective Phase 07 images were
inspected across engines. The final visual suite passed 291/291 without a
baseline update, including the verified Application density correction.
Archive, manifest, bundle isolation, source/dependency, OpenSpec, Graphify, and
checkpoint checks also passed. The active Phase 09 OpenSpec change remains
deliberately unarchived because deployed-staging gates are external and
incomplete.

This does not substitute for real hardware, screen reader, provider, edge,
hosting, or legal review.

## External blockers and next gate

Exact owners, configuration locations, rerun commands, staging checks,
homologation steps, and rollback procedure are maintained in
`docs/05-implementacao/21-staging-release-operations.md`. The current working
tree is `verified-complete` locally; remote and external integration remain
`blocked`. No commit or push was authorized for this correction. Next, commit
the reviewed tree when authorized, push `develop/site-institucional`, and
record a green common-CI result for that new full SHA. Keep that head frozen,
run the manual candidate workflow for the same SHA, configure the six values in
the protected GitHub `staging` Environment, inventory Napoleon/Cloudflare
read-only, and resolve the independent `app.wflyer.com.br` baseline. Then
select that branch in Napoleon, record the same SHA, prepare/verify the staging
candidate, and run `pnpm test:staging` from a clean checkout of its manifest
SHA. Production is not authorized.
