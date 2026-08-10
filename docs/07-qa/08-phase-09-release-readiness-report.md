# Phase 09 local release-readiness report

**Historical report date:** 2026-08-03
**Current reconciliation date:** 2026-08-10
**Scope:** `wflyer.com.br` institutional repository and local standalone runtime
**Administrative infrastructure:** GitHub settings, Napoleon, Cloudflare, and
provider dashboards were not accessed
**Public read-only reachability:** observed separately on 2026-08-03
**Current repository state:** `CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING`
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
cross-host text-edge differences in Firefox Phase 06. Therefore uses of
“current” or `verified-complete` inside the explicitly historical sections
below must be read within their dated checkpoint only; the separate 2026-08-10
reconciliation controls the present repository state.

The first corrective checkpoint is tracked by OpenSpec change
`stabilize-browser-visual-regression`. For the tree that became commit
`065a077f9425943af8bc3ea821660bb356aef1da`, its dated repository-owned local
evidence reached `verified-complete`: the exact Playwright 1.62.0 Noble image
produced 34 reviewed replacement snapshots (7 Phase 06, 16 Phase 07, and 11
Phase 08), five consecutive reduced-motion WebKit passes, two unchanged
291/291 zero-tolerance visual runs, E2E 318/318, axe 102/102, and motion 30/30
with retries disabled. Unit/component 305/305, Storybook 63/63, four 22-route
builds, standalone 17 routes + 20 assets, indexing 4/4, and Lighthouse 15/15
also passed for that checkpoint. No previous baseline result was reused to
satisfy its canonical-environment gate. These measurements remain historical;
they do not close the later 2026-08-10 working tree.

This local proof was originally recorded for an uncommitted working tree at
base SHA `5a4ea8529582931e287cc667ab436544c9a176ee`. That tree was subsequently
published as commit `065a077f9425943af8bc3ea821660bb356aef1da` without
rewriting its parent. Ordinary CI run `31118939281` targeted that exact SHA but
executed no runner step because the GitHub account was locked for billing.
Therefore the historical local result is not a green GitHub-hosted result, and
remote release evidence remains `implemented-but-unverified`.

The public reachability observation was intentionally narrower than an
infrastructure inventory. `wflyer.com.br` returned an HTTP 200 placeholder, and
the documented MSN portfolio, Instagram, and GitHub destinations returned
public HTTP responses. `app.wflyer.com.br` did not resolve in DNS from the
observation environment. These point-in-time results neither prove ownership,
configuration, application health, staging readiness, nor the cause of the
application-host failure. The unresolved application host is an independent
baseline blocker that must be investigated by its owner without changing it as
part of the institutional-site release.

## Current reconciliation — 2026-08-10

The current repository-owned Phase 09 content is
`CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING`. The dated
`verified-complete` statements elsewhere in this report preserve their original
checkpoint evidence and remain separate from the current proof below.
Production remains unauthorized, no staging
deployment has been performed, and Davi Benucci's human approval is pending.

| Current area | Repository evidence | State and remaining boundary |
|---|---|---|
| Node-only standalone runtime | Standalone preparation now copies only `public/` and `.next/static/` into their generated locations. The accepted persistent process is `node .next/standalone/server.js`; root `index.html`, `404.html`, metadata mirrors, `_next/static/`, and `public_html` are neither created nor accepted as runtime evidence. Smoke coverage exercises deep routes, `/api/contact`, headers, assets, indexing, and the custom 404 through that Node.js server. | Implemented and locally validated. Static hosting is incompatible; exact-SHA remote CI remains external. |
| Transitive `nanoid` remediation | The prior production path was `next@16.2.12` → `postcss@8.5.25` → `nanoid@3.3.16`. GitHub Reviewed advisory [`GHSA-2v37-7h3g-55p8`](https://github.com/advisories/GHSA-2v37-7h3g-55p8) / `CVE-2026-67213` affects versions below `3.3.17`. The scoped override `nanoid@<3.3.17: 3.3.17` now resolves the production path to `3.3.17`. Frozen install, dependency validation, lint, typecheck, 306 unit tests, coverage, Storybook, builds/smokes/Lighthouse, strict OpenSpec 11/11, `pnpm audit --prod`, and peer checks passed after the lock change. | Repository-side supply-chain correction is measured; no exploitation is claimed. Exact-SHA remote CI proof remains pending. |
| Governed visual replacement register | The published checkpoint contained 34 unique replacement paths. A later audit proved that Chromium's Phase 06 processing baseline still encoded a removed test-only flat transform; its inspected replacement adds one unique path, while the Firefox processing replacement revises a path already in the 34-path set. The current register therefore contains 35 unique paths: 8 Phase 06, 16 Phase 07, and 11 Phase 08. | Repository-side inspection is recorded path by path. Davi Benucci's approval of all 35 images remains pending. |
| Contact visual actionability stall | A clean pre-fix matrix passed 290/291. Its only failure was WebKit `contact submitting`: the 30-second actionability timeout occurred in `fillValidForm` at the consent `.check()`, while the checkbox remained unchecked and before Turnstile verification, `POST /api/contact`, or the screenshot assertion. No actual/diff image or Contact network call was produced, and the 84-snapshot manifest was unchanged. The exact pre-fix case passed a focused 10/10, confirming an intermittent preparation stall rather than a pixel mismatch. | The visual-only helper now uses `consent.check({ force: true })` and immediately asserts `toBeChecked()`. Functional E2E and axe suites retain normal visitor actionability coverage. The patched WebKit case passed 10/10 in 106 seconds. |
| Clean visual matrix #1 after the Contact correction | `pnpm exec playwright test tests/visual --retries=0 --workers=1` ran against the internal production standalone server in the pinned Playwright 1.62.0 Noble image at digest `sha256:baed2032d533817f3dbe6425de795788430ba345e819a1201337009ba17c9d07`, with read-only source and snapshots. It passed 291/291 in 501 seconds: Chromium 97/97, Firefox 97/97, and WebKit 97/97, with zero retries or flakes. The WebKit Contact case passed in 3.9 seconds. The 84-PNG manifest was byte-identical before and after at `ba4f23c08613c1c1c9a1481fa6d8466dd7bfa0641cf3b6ae898424966ccc6b63`; the Contact spec hash was `feb669db0767030c539784dbee8ee674130ad6b0c0b7c77f8f1f936c4b8978f8`. | This is the first clean post-fix matrix, not final closure. Clean matrix #2 and the required complete E2E, accessibility, motion, and focused repeat sequence were still pending at this checkpoint. |
| Final canonical browser sequence | The same pinned Noble source/build passed E2E 318/318 in 593 seconds, axe 102/102 in 293 seconds, motion 30/30 in 81 seconds, and clean visual matrix #2 291/291 in 521 seconds. Focused repeats passed Firefox branch direction 10/10 in 58 seconds, WebKit final barlines 5/5 in 24 seconds, and WebKit reduced-motion final Home 5/5 in 18 seconds. The complete-sequence summary SHA-256 is `dce40df46fc2d5733ae771d614bd4e673c47e4dfc204bda3bdefa0df00f3f58a`. | Repository browser evidence complete. The 84-PNG manifest remained byte-identical from sequence start to end at `ba4f23c08613c1c1c9a1481fa6d8466dd7bfa0641cf3b6ae898424966ccc6b63`; remote CI and human review remain separate. |
| Default-branch workflow bootstrap | Remote branch `ci/napoleon-release-workflow-bootstrap` points to infrastructure-only commit `d67554be7ceee4f2e744380275860781d302d145`, adding the manual release workflow without merging the institutional application into `main`. | Branch evidence exists. Owner review, PR creation/merge, and default-branch dispatch remain external and incomplete. |
| Remote ordinary CI | Run [`31118939281`](https://github.com/DaviBenucci/WFlyer/actions/runs/31118939281) targeted published SHA `065a077f9425943af8bc3ea821660bb356aef1da`; all four jobs acquired no runner and executed no step because the GitHub account was locked for billing. | External billing blocker, not green CI and not a code-failure result. The exact final branch-head run must be recorded after the forward-only commit series is pushed; it cannot be inferred from this prior run. |

Repository-owned closure includes the two clean visual matrices, complete and
focused browser sequence, refreshed Graphify/checksums, strict OpenSpec task
evidence, additive documentation integrity records, and reviewed forward-only
commits. Those results are current proof and are not inferred from clean matrix
#1 or from the historical 2026-08-03/2026-08-05 checkpoints.

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
without a sitemap advertisement. At the 2026-08-03 checkpoint, production,
staging, absent, and preview builds each emitted 22 routes and passed standalone
indexing smoke, 4/4; current closure is governed by the reconciliation above.

## Performance and artifact boundary

The build remains predominantly static with `/api/contact` as the intentional
dynamic route. At the 2026-08-03 checkpoint, standalone smoke passed all 17
public routes and 20 referenced assets. Bundle inspection found no credential
values or prohibited tooling/content. Required server-runtime variable names
remain in the server bundle by design. Dormant checkpoint code strings may
remain in production client chunks, but `testMode=false` exposes no private
global/controller; the production-safe public staging suite verified that hooks
are disabled and not exposed. The only intended Contact browser third party is
the scoped, finite Turnstile script.

The historical Lighthouse checkpoint passed 15/15 runs with every category
score at least 1.00. Maximum observed LCP was 755 ms, CLS 0.0034, and TBT 3 ms.
External Core Web Vitals, real network/provider latency, Napoleon process
behavior, and edge caching cannot be inferred locally.

## Security

The implemented, locally verifiable baseline includes strict request ordering,
streamed 16 KiB limit, exact origin, honeypot, Zod, Turnstile action/hostname,
fixed
plain-text Resend construction, no persistence, no contact-payload logging in
application source, generic no-store responses, safe browser headers,
report-only CSP without `unsafe-eval`, safe external links, and release
artifact isolation. The historical source/dependency closure was green. The
current transitive `nanoid` correction and its measured checks are recorded in
the 2026-08-10 reconciliation, but they do not by themselves close the final
current-tree gate; external logs and controls are not inferred from local
bundle inspection.

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

The historical prepared standalone tree measured 29 MiB and its normalized
archive 4.4 MiB. Two packaging executions over that same tree produced SHA-256
`b1c262ff65624c234fe7822aa5829a5c0872616d12f3fd47fa5ad7ee030e3a53`.
The local non-secret manifest matched repository, revision, source ref,
environment, workflow run ID/attempt/URL, archive, checksum, creation time, and
`deployment.performed=false`; tests reject inconsistent provenance. This is an
integrity contract, not a claim that independent Next.js builds on floating
hosted environments are byte-reproducible. No Napoleon API, webhook, SSH
command, DNS mutation, deploy call, merge, tag, or public release is performed.

The deployable candidate is the generated Node.js process at
`.next/standalone/server.js`, completed with `public/` and
`.next/standalone/.next/static/`. Root `index.html`, `404.html`, metadata
mirrors, `_next/static/`, and `public_html` are neither generated nor accepted
as deployment evidence. A static file host is incompatible with the deep-route,
`/api/contact`, response-header, custom HTTP 404, and runtime contracts.

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
repository state is `CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING`.
Repository-owned gates are complete; the first clean post-fix matrix remains
intermediate evidence within the two-run proof.

The reviewed tree is committed and published through a forward-only series;
the exact final SHA is recorded in Git and the external execution handoff
rather than self-embedded in this containing commit. Require green common CI
for that full SHA; run `31118939281` is unusable as green proof because billing
prevented every job from starting. Keep the resulting head frozen, obtain owner review and
merge of bootstrap commit `d67554be7ceee4f2e744380275860781d302d145`, run the
manual candidate workflow for the same SHA, configure the six values in the
protected GitHub `staging` Environment, inventory Napoleon/Cloudflare
read-only, and resolve the independent `app.wflyer.com.br` baseline without
modifying that application. Then select the branch in Napoleon, record the same
SHA, prepare and verify staging, and run `pnpm test:staging` from a clean
checkout of its manifest SHA. Davi Benucci's visual and staging homologation
decisions remain pending. Production is not authorized.
