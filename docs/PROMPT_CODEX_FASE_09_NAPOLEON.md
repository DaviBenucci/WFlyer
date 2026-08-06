# Codex master prompt — W_Flyer Phase 09, Napoleon staging and homologation

You are working in the W_Flyer institutional-site repository. Continue from the current repository state; do not restart Phase 09 from scratch.

## Communication and canonical language

- Communicate progress, blockers, and the final implementation report to me in Portuguese.
- Keep all canonical technical documentation, architecture records, code comments, manifests, workflow names, test descriptions, and implementation notes in English, according to the repository governance.
- Work directly in the repository and complete every repository-owned task in this prompt. Do not stop after analysis.
- Stop only for a genuine external blocker that requires credentials, a provider-panel value, DNS ownership, secret values, or human visual approval. When blocked, finish all other tasks and provide the exact field, value format, command, and evidence that I must supply.

## Current repository facts that must be preserved

- Repository: `DaviBenucci/WFlyer`.
- Working branch: `develop/site-institucional`.
- Current remote baseline commit: `5a4ea8529582931e287cc667ab436544c9a176ee`.
- The working tree already contains an uncommitted browser/visual-regression stabilization change affecting workflows, Playwright, application readiness state, tests, documentation, and reviewed Linux snapshots.
- The default branch is `main`, and its current application tree contains only the previous `index.html` and `package-lock.json` placeholder.
- The institutional application is Next.js with `output: "standalone"` and must run as a Node.js process through `.next/standalone/server.js`.
- The current GitHub workflow named `Prepare Napoleon release` validates and packages a candidate; it does not contact Napoleon and does not perform deployment.
- `app.wflyer.com.br` is a separate application and must not be modified.
- Do not request, restore, commit, or depend on uploaded `node_modules` or `.next`. Install and build from `pnpm-lock.yaml`.

## Non-negotiable safety rules

1. Read `AGENTS.md`, `PRE-CODE-STATUS.md`, the active OpenSpec change, and the release/QA documents before editing.
2. Use Graphify for the cross-file release analysis when `graphify-out/graph.json` is available, then update the graph after structural changes.
3. Do not run destructive commands such as `git reset --hard`, `git clean -fd`, `git checkout -- .`, or any command that discards the current dirty working tree.
4. Do not overwrite or blindly regenerate visual baselines. Every changed snapshot must be inspected and justified.
5. Do not weaken screenshot tolerances, accessibility gates, security checks, branch gates, homologation gates, or release traceability merely to make CI pass.
6. Do not merge the institutional application into `main`, deploy production, alter apex DNS, or change Cloudflare records without my explicit approval after staging homologation.
7. Do not invent Napoleon UI fields, provider environment-variable names, ports, URLs, credentials, health-check behavior, or rollback controls. Record actual panel values or mark them as externally pending.
8. Do not treat `public_html/index.html` as proof that the Next.js application is deployable as a static site. Deep routes, `/api/contact`, Next.js headers, and runtime behavior require the Node.js standalone server.
9. Never expose secret values in source, commits, test output, reports, screenshots, manifests, or logs.

# Objective

Produce a clean, reviewable and remotely verifiable Phase 09 staging candidate, make the manual release-candidate workflow discoverable from GitHub Actions, prepare the exact Node.js deployment contract for Napoleon, deploy or hand off staging safely, and generate a complete homologation record. Production must remain unauthorized.

# Phase A — Audit and preserve the current work

1. Confirm the current branch, remote, HEAD, dirty status, ignored artifacts, and changed files.
2. Run Graphify queries focused on:
   - Phase 09 release flow;
   - GitHub Actions to Napoleon handoff;
   - Next.js standalone runtime;
   - Playwright visual stabilization;
   - staging indexing and contact-form configuration.
3. Inspect the entire current diff before making new edits.
4. Identify generated or local-only files that must not be committed, including at least:
   - `.pnpm-store/`;
   - `.next/`;
   - `.lighthouseci/`;
   - `coverage/`;
   - `playwright-report/`;
   - `test-results/`;
   - `storybook-static/`;
   - `release/`.
5. Fix the Unicode filename corruption involving `docs/design-reference/Representação visual.png`. Preserve the original approved binary and canonical UTF-8 filename; do not create a renamed duplicate such as `Representa#U00e7#U00e3o visual.png`.
6. Verify whether Graphify outputs are current. Regenerate them only through the documented Graphify command and do not commit unrelated local diagnostic noise.
7. Run `git diff --check` and eliminate whitespace, encoding, YAML, JSON, TypeScript, and shell syntax problems.

Deliverable: a short Portuguese audit report listing the existing work that will be retained, any unsupported changes that were reverted, and the exact files planned for commits.

# Phase B — Complete the browser and visual-regression stabilization

Treat `openspec/changes/stabilize-browser-visual-regression/` as the active focused change. Do not create a competing implementation.

1. Validate that common CI and candidate browser jobs use the same canonical environment:
   - Ubuntu 24.04 Noble;
   - Node.js 24;
   - pnpm 11.18.0;
   - Playwright 1.62.0;
   - the reviewed official Playwright image pinned by digest;
   - the browser binaries already included in that image;
   - the generated Next.js standalone server, not `next dev`, for governed browser evidence.
2. Preserve zero-tolerance visual comparison. Do not add `maxDiffPixels`, `maxDiffPixelRatio`, broad masks, or production CSS changes designed only to hide diffs.
3. Verify the shared visual helper waits for:
   - navigation completion;
   - `document.readyState === "complete"`;
   - `document.fonts.ready`;
   - the explicit application-ready marker where required;
   - stable animation frames.
4. Confirm the screenshot-only stylesheet removes only the Next.js development portal and does not alter productive visual regions.
5. Verify normal intro completion, skip, Escape, first-session behavior, reduced motion, scroll-lock cleanup, timeline cleanup, and the brand-intro ready state.
6. Inspect every changed snapshot against its expected/actual/diff evidence. Produce a machine-readable or Markdown review table with:
   - snapshot path;
   - browser;
   - reason for invalidation;
   - productive UI changed: yes/no;
   - human review status.
7. Do not mark visual review complete unless the images were actually inspected.
8. Run the full repository-owned validation sequence, using the pinned Playwright container when required:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm validate:dependencies
pnpm dlx @fission-ai/openspec@1.7.0 validate --all --strict --no-interactive
pnpm lint
pnpm typecheck
pnpm test
pnpm build:storybook
pnpm test:storybook
pnpm build
pnpm prepare:standalone
pnpm smoke:standalone
pnpm smoke:indexing
pnpm test:e2e
pnpm test:a11y
pnpm test:motion
pnpm test:visual
pnpm lighthouse
pnpm audit --prod
pnpm peers check
```

9. Run focused repeated WebKit navigation/reduced-motion checks and at least two unchanged complete visual runs in the canonical environment.
10. Update the active OpenSpec tasks and design evidence honestly. Do not archive the change before remote CI validation and required visual approval.

Deliverable: exact commands, environment fingerprint, pass/fail counts, snapshot-review record, and remaining blockers.

# Phase C — Create clean, logical commits and validate remotely

1. Keep generated outputs and secret values out of Git.
2. Split the current work into reviewable commits. Prefer this order when the actual diff supports it:
   - `test(ci): pin canonical browser environment and standalone server`;
   - `fix(intro): expose deterministic terminal readiness and cleanup`;
   - `test(visual): centralize readiness and review invalidated baselines`;
   - `docs(release): align Phase 09 evidence and Napoleon handoff`.
3. Do not manufacture commits merely to match these names; each commit must be coherent and pass its proportional tests.
4. Ensure the final working tree is clean except for explicitly documented local-only evidence.
5. Push `develop/site-institucional` only if authenticated and authorized. Otherwise prepare the commits and print the exact push command.
6. Record the new full 40-character head SHA.
7. Wait for or inspect the GitHub CI run for that exact SHA. Do not claim remote success based only on local output.
8. If CI fails, download/inspect the exact artifacts and fix the cause. Do not update baselines from the failing runner without reviewed evidence.

Gate: Phase C is complete only when the exact branch-head SHA has a green remote CI run or when the sole remaining blocker is explicitly identified as unavailable GitHub access.

# Phase D — Make the manual release-candidate workflow available from the default branch

The `workflow_dispatch` release workflow must be visible and runnable from GitHub Actions while the institutional application itself remains unmerged from `develop/site-institucional`.

1. Implement the smallest safe infrastructure-only change on `main` that makes `Prepare Napoleon release` manually dispatchable from the default branch.
2. Do not replace or modify the placeholder application files on `main` during this bootstrap.
3. The manual workflow must continue to:
   - accept only `staging` or `production`;
   - require `develop/site-institucional` for staging;
   - require `main` or an approved release tag plus `HOMOLOGADO_POR_DAVI` for production;
   - resolve the requested ref once to a full immutable SHA;
   - reuse that SHA in every checkout/build/package step;
   - keep `permissions: contents: read`;
   - avoid `git commit`, `git push`, SSH, webhook, invented Napoleon credentials, or provider contact;
   - bind the packaging job to the selected GitHub Environment;
   - upload checksummed candidate and non-secret manifest;
   - record `deployment.performed=false`.
4. Avoid creating an ungoverned long-term divergence between workflow copies. Document the temporary bootstrap arrangement and how the workflow becomes single-source after the homologated application is merged to `main`.
5. Validate workflow syntax and repository contract tests.
6. Create an infrastructure-only branch/commit from `main` and open or prepare the smallest possible pull request. Do not merge it automatically unless authorized.

Gate: the workflow is visible in GitHub Actions from the default branch and can be dispatched with:

```text
environment = staging
release_ref = develop/site-institucional
production_confirmation = empty
```

# Phase E — Correct the deployment documentation

Resolve the current ambiguity between a Node.js application root and static `public_html` hosting.

1. Update the canonical documentation to state unambiguously:
   - the deployable runtime is `.next/standalone/server.js`;
   - `index.html` in the standalone package is not a replacement for the Node.js server;
   - serving the directory as static files is not accepted because deep routes, `/api/contact`, Next.js response headers, and runtime behavior would fail;
   - GitHub Actions prepares quality/provenance evidence but Napoleon independently pulls and builds the selected branch;
   - GitHub Environment secrets do not automatically become Napoleon runtime variables.
2. Review `scripts/prepare-standalone.mjs` and related tests. Keep document-root mirror files only if they serve a verified Napoleon Node.js requirement. Never use their presence as the deployment acceptance criterion. If the panel only supports static hosting, report an architecture/provider incompatibility instead of faking a successful deploy.
3. Create or update these canonical English runbooks, using equivalent names if the document index requires another convention:
   - `docs/05-implementacao/22-napoleon-node-runtime-runbook.md`;
   - `docs/07-qa/09-staging-homologation-runbook.md`;
   - `docs/08-operacao/03-napoleon-rollback-runbook.md`.
4. Update `docs/00-indice.md`, documentation manifests, IDs, checksums, Graphify, and references.
5. Keep external unknowns explicitly marked as external evidence fields, never as completed facts.

The Napoleon runtime runbook must include the following baseline contract, subject to confirmation against the actual panel:

```text
Application type: Node.js application
Repository: git@github.com:DaviBenucci/WFlyer.git
Staging branch: develop/site-institucional
Working directory: repository root
Node.js: 24.x
Package manager: pnpm 11.18.0 through Corepack
Health path: /
Runtime entry point: .next/standalone/server.js
HOSTNAME: 0.0.0.0 when required by the provider
PORT: use the actual port contract injected or configured by Napoleon; do not invent it
```

Recommended build command, after confirming Napoleon executes a POSIX shell in the repository checkout:

```bash
set -euo pipefail
corepack enable
pnpm install --frozen-lockfile
export WFLYER_BUILD_ID="$(git rev-parse HEAD)"
pnpm build
pnpm prepare:standalone
```

Recommended start command:

```bash
node .next/standalone/server.js
```

The application environment must provide these values in Napoleon, with correct build/runtime scope:

```text
WFLYER_DEPLOYMENT_ENVIRONMENT=staging
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<staging public site key; available before build>
TURNSTILE_SECRET_KEY=<staging secret; server-only>
RESEND_API_KEY=<server-only>
CONTACT_FROM_EMAIL=<verified Resend sender>
CONTACT_RECIPIENT_EMAIL=davi.benucci@wflyer.com.br
CONTACT_ALLOWED_ORIGINS=<exact HTTPS staging origin only>
NODE_ENV=production
HOSTNAME=0.0.0.0, if required
PORT=<Napoleon actual port contract>
```

Never use wildcard origins. Never place secret values in GitHub manifests or documentation.

# Phase F — Configure GitHub Environments and prepare the staging candidate

These are external settings. Configure them only when access is available; otherwise provide a precise owner checklist.

1. GitHub Environment `staging`:
   - allow `develop/site-institucional` only;
   - configure the six required environment-scoped values;
   - use staging-specific Turnstile and contact settings.
2. GitHub Environment `production`:
   - restrict to `main` and approved release tags;
   - require Davi Benucci as reviewer;
   - prevent self-review when supported;
   - configure production-specific values, but do not dispatch production.
3. Dispatch `Prepare Napoleon release` for staging.
4. Record:
   - workflow run ID and URL;
   - run attempt;
   - selected ref;
   - resolved full SHA;
   - archive name;
   - SHA-256;
   - manifest name;
   - browser evidence artifact;
   - result of every job.
5. Verify that the candidate SHA equals the green ordinary CI SHA.

# Phase G — Napoleon staging handoff

Do not attach Napoleon to a mutable branch before the candidate is green unless the provider offers a manual deployment control that prevents premature deployment.

1. Inspect and record the actual Napoleon panel fields:
   - application type;
   - source connection;
   - selected branch and resolved SHA;
   - automatic/manual deploy behavior;
   - Node version;
   - working directory;
   - build command;
   - start command;
   - build-time variable scope;
   - runtime variable scope;
   - port contract;
   - health check;
   - process user;
   - restart policy;
   - log access and retention;
   - rollback selector.
2. If Napoleon supports a Node.js application process, configure the verified contract and deploy the exact green candidate SHA.
3. If Napoleon exposes only a static document-root upload requiring `index.html`, stop and report that the current Next.js architecture is incompatible with that hosting mode. Do not convert to static export without a separate approved architectural change because `/api/contact` and response-header behavior would need replacement.
4. Use a separate staging hostname approved by the owner. Do not modify `wflyer.com.br`, `www`, mail records, or `app.wflyer.com.br` during staging setup.
5. Configure Cloudflare only after recording the exact Napoleon target. Preserve existing DNS, proxy, SSL/TLS, mail, and application records.
6. Confirm the deployed Napoleon revision exactly matches:
   - the branch head;
   - the green CI SHA;
   - the candidate manifest SHA.

# Phase H — Staging homologation

After staging is live at the exact HTTPS origin, run:

```bash
PLAYWRIGHT_BASE_URL="https://<approved-staging-host>" pnpm test:staging
```

Also perform and record:

1. HTTP/runtime checks:
   - `/` returns 200;
   - every public route returns 200;
   - an unknown route returns the custom 404 and HTTP 404;
   - `/api/contact` rejects GET and invalid requests correctly;
   - static assets load without 404;
   - Node.js headers are present;
   - staging returns `X-Robots-Tag: noindex, nofollow, noarchive, noimageindex`;
   - `robots.txt` disallows all crawling and does not advertise the sitemap;
   - CSP remains report-only until deployed evidence is reviewed.
2. Functional journeys:
   - first-session brand intro;
   - skip and Escape;
   - intro does not replay in the same session;
   - application and institutional branch navigation;
   - back/forward history;
   - deep links;
   - theme behavior;
   - tablet interaction by mouse, keyboard, and touch where available;
   - reduced motion;
   - contact-form validation, Turnstile verification, real Resend delivery, and generic failure behavior.
3. Security and operations:
   - no secret values in Actions, Napoleon, Cloudflare, Turnstile, or Resend logs;
   - contact endpoint is not cached;
   - Cloudflare rate limiting for `/api/contact` is active and tested safely;
   - HTTPS and proxy behavior are correct;
   - process runs under an isolated non-administrative user when the provider supports it.
4. Regression isolation:
   - verify `app.wflyer.com.br` DNS, HTTPS, and application health independently before and after the staging change;
   - do not attribute any pre-existing outage to this repository without evidence.
5. Human review:
   - desktop light/dark;
   - mobile light/dark;
   - real-device navigation;
   - keyboard-only operation;
   - physical screen-reader review;
   - visual comparison against approved references.
6. Rollback exercise:
   - record the currently deployed SHA;
   - deploy or select the prior known-good staging revision;
   - verify health and routes;
   - redeploy the candidate SHA;
   - verify health again;
   - record duration, operator, evidence, and any data-loss risk (expected: none, because the site has no database).

Create a staging homologation report containing:

```text
Status: APPROVED | REJECTED | BLOCKED
Staging URL:
Repository:
Branch:
Exact deployed SHA:
Green CI run:
Candidate workflow run:
Candidate checksum:
Napoleon application name:
Napoleon runtime/build/start contract:
Cloudflare record changed:
app.wflyer.com.br before/after result:
Automated test results:
Manual device/browser results:
Contact delivery evidence without personal message content:
Security/log review:
Rollback evidence:
Open defects:
Owner decision:
Owner: Davi Benucci
Decision timestamp:
```

Do not mark homologation approved yourself. Prepare the evidence and leave the owner decision pending for Davi Benucci.

# Phase I — Closure and final report

1. Update Phase 09 status accurately:
   - `CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING` while external setup is missing;
   - `STAGING_DEPLOYED_HOMOLOGATION_PENDING` after exact-SHA staging is live and automated gates pass;
   - `STAGING_HOMOLOGATED_PRODUCTION_NOT_AUTHORIZED` only after Davi Benucci records approval.
2. Do not mark production complete.
3. Do not merge the application to `main`, create a production tag, dispatch production, or change apex DNS in this task.
4. Provide a final Portuguese report with:
   - files changed;
   - commits and SHAs;
   - local and remote test results;
   - GitHub workflow status;
   - exact Napoleon configuration recorded;
   - staging URL and deployed SHA, if available;
   - homologation checklist result;
   - remaining external actions;
   - exact next command for the owner.

## Definition of Done for this task

This task is complete only when all repository-owned work is committed and validated, the release workflow is dispatchable from the default branch, the Node.js deployment contract is unambiguous, and either:

A. the exact green SHA is deployed to Napoleon staging with completed automated evidence and a pending human homologation decision; or

B. the only remaining blockers are external and are documented with exact owner actions, without any false claim that deployment or homologation occurred.
