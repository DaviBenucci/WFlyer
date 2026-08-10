## Context

See `proposal.md` for motivation. The site has durable historical phase
checkpoints and three archived 2026-08-03 corrections. Repository-owned
final-current content, browser, build, standalone, documentation, OpenSpec, and
Graphify gates are now complete; exact-SHA remote CI and external staging
remain pending. The workflow intentionally stops at artifact handoff. The
owner has confirmed that Napoleon can pull
and build a selected GitHub branch. GitHub Environment settings, provider
credentials, the precise Napoleon build/start and environment-scope controls,
Cloudflare inventory, and the staging hostname remain unavailable and must not
be invented. ADR-018, ADR-020, ADR-021, ADR-023, the publication operations
record, and `AGENTS.md` control the boundary.

## Goals / Non-Goals

**Goals:**

- Make local and CI quality evidence reproducible and exhaustive enough for a
  release candidate.
- Encode staging indexing protection as a build contract with independent HTML,
  robots, and header defenses.
- Produce an immutable, checksummed, non-secret candidate plus exact external
  handoff and rollback documentation.
- Bind the Git-based staging handoff to `develop/site-institucional`, its full
  commit SHA, and the CI result for that exact SHA without workflow-authored
  commits or write credentials.
- Keep the application on `develop/site-institucional` while making the manual
  workflow discoverable through the smallest infrastructure-only bootstrap on
  the default branch.
- Treat `.next/standalone/server.js` as the only deployment entry point and
  reject static document-root hosting as incompatible with the current Route
  Handler and response-header architecture.
- Leave every unavailable external prerequisite named, located, and paired with
  a rerun command.

**Non-Goals:**

- Deploying to staging or production, creating GitHub Environments, registering
  secrets, configuring the Napoleon application, changing Cloudflare/DNS,
  enabling HSTS/CSP enforcement, or validating provider delivery.
- Merging to `main`, tagging a public release, publishing contact delivery, or
  claiming physical-device, screen-reader, legal, staging, rollback, or
  production validation that did not occur.

## Decisions

1. **One strict deployment-environment parser.** A small server/build-only
   configuration module accepts only `staging` or `production`; all other local
   values are non-production for index safety. The release workflow separately
   rejects missing/invalid input. This is safer than inferring production from
   `NODE_ENV`, which is `production` for both staging and production builds.
2. **Three-layer staging exclusion.** Root metadata supplies noindex/nofollow,
   `robots.txt` disallows all crawling and omits the sitemap, and global headers
   add `X-Robots-Tag`. Any one layer can protect staging if another is cached or
   consumed differently. Production retains the existing SEO surface.
3. **Test every indexing mode without external secrets.** Pure configuration,
   metadata, and standalone HTTP tests prove production, staging, absent, and
   invalid environment outputs. The latter three fail closed. No test key or
   fake credential is promoted as external provider-validation evidence.
4. **Read-only CI plus a Git-branch Napoleon handoff.** GitHub Actions validates
   the pushed commit and may package its immutable SHA, but retains
   `contents: read`, `persist-credentials: false`, and no `git push` or commit
   step. Napoleon's confirmed integration is to pull/build the selected
   environment branch. For staging that branch is
   `develop/site-institucional`; its head SHA must match the reviewed CI run and
   release manifest before the application is pointed or restarted. No API,
   webhook, SSH transport, or Actions-authored deployment commit is introduced.
5. **Build and runtime values have separate ownership.** Exactly one public
   Environment value, the Turnstile site key, is required while building the
   pre-rendered contact page. Exactly five server values—the Turnstile secret,
   Resend API key, contact sender, contact recipient, and exact allowed
   origins—are checked by name, excluded from the build/archive, and must be
   injected into Napoleon's Node.js runtime through the verified integration.
   Canonical site and application URLs remain approved source configuration
   rather than unused environment variables.
6. **Reports use measured evidence and explicit completion states.** Local
   results, manual inspection, and external gates remain separate. The final
   status cannot exceed `CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING` without
   staging access and successful external validation.
7. **Deployed staging receives a public-surface smoke suite.** Repository-owned
   deterministic browser suites continue to run against their controlled local
   server. Deployed staging runs a separate command that checks only visitor-
   visible behavior and never exposes test controllers or forced checkpoints.
8. **Deployable packaging is exclusive to the protected manual workflow.**
   Pull requests and ordinary pushes still build the production baseline, run
   standalone smoke and Lighthouse, and exercise production, staging, absent,
   and invalid indexing modes. They never create or upload a standalone release
   archive. Only the environment-bound manual workflow may produce the
   normalized archive, checksum, and manifest used for a handoff.
9. **Standalone means a Node.js process, not static export.** The preparation
   step copies only `public/` and `.next/static/` into Next.js' documented
   standalone locations, then acceptance runs
   `node .next/standalone/server.js` from the repository root and exercises
   routes, assets, headers, indexing, and `/api/contact`. Root `index.html`,
   `404.html`, metadata mirrors, `_next/static/`, and `public_html` are not
   produced or accepted as deployment proof. A static-only Napoleon product
   would require a separately approved architecture change rather than a
   misleading upload workaround.
10. **The default-branch workflow copy is temporary infrastructure.** GitHub
    only exposes manual dispatch workflows from the default branch. Until the
    application itself is homologated for `main`, an infrastructure-only PR
    adds the identical release workflow without touching `index.html` or
    `package-lock.json`. The arrangement ends when the homologated application
    reaches `main` and that path becomes the single source.

## Risks / Trade-offs

- **[Risk] Staging host policy is correct but unobserved externally** → Verify
  HTML, headers, robots, cache, HTTPS, and search behavior after the real staging
  URL exists.
- **[Risk] GitHub Environment protection cannot be created from repository
  files** → Document exact settings and keep the workflow job bound to the
  selected Environment so secrets remain inaccessible until approval.
- **[Risk] A branch-tracking Napoleon application can observe a new commit
  before its CI finishes** → Publish the audited staging SHA while the
  application is not yet attached, require the exact SHA's CI result to be
  green, freeze that branch head until Napoleon records the same selected SHA,
  and only then point/restart Napoleon. Any intervening branch advance
  invalidates the handoff. For later releases, advance the tracked branch only
  through the reviewed staging promotion procedure.
- **[Risk] A Napoleon source build is independent from the checksummed Actions
  archive** → Use the branch head/full SHA as deployment identity, retain the
  archive as quality evidence, record the exact Napoleon build output, and do
  not claim byte identity between the two builds.
- **[Risk] The default-branch workflow copy can drift from the development
  branch** → Keep the bootstrap byte-identical when proposed, review future
  workflow changes against both refs, and delete the temporary distinction as
  part of the eventual homologated merge.
- **[Risk] Napoleon may expose only static hosting** → Record the observed
  panel capability and stop the handoff; do not convert the application or
  treat copied HTML as a successful deployment.
- **[Risk] Report-only CSP and absent HSTS are less strict than the intended
  production policy** → Observe CSP reports and validate all hostnames/HTTPS
  before separate owner-approved enforcement.
- **[Risk] Cross-browser local development can saturate under concurrency** →
  use the proven one-worker matrix without inflating product timeouts.

## Migration Plan

1. Open the infrastructure-only default-branch bootstrap PR and obtain owner
   approval before merging it; do not merge application files.
2. Publish the audited commit as `develop/site-institucional` while no Napoleon
   application is yet attached to that branch, then require the CI run for its
   full SHA to pass.
3. Configure GitHub `staging` and `production` Environments and their scoped
   values; require Davi Benucci for production.
4. Inventory Napoleon and Cloudflare read-only. Record the Git repository,
   staging branch, exact head SHA, build/start commands, build/runtime variable
   scopes, process user, port, health check, restart, and rollback controls.
5. Configure a separate Napoleon staging Node.js application to pull only
   `develop/site-institucional` with
   `WFLYER_DEPLOYMENT_ENVIRONMENT=staging`, then verify that its selected SHA
   equals the green CI/manifest SHA before starting it.
6. Run the documented staging matrix and obtain human homologation.
7. Only after explicit approval, prepare the production candidate with
   `WFLYER_DEPLOYMENT_ENVIRONMENT=production` and the verified deployment path.
8. Roll back by selecting the prior institutional commit through the verified
   Napoleon rollback control, restarting only that application, running smoke
   checks, and confirming
   `app.wflyer.com.br` and mail records remain unchanged.

## Open Questions

- What exact build command, standalone start command, environment-variable
  scope, port/health contract, and rollback selector does the Napoleon Node.js
  application expose for the confirmed Git-branch integration?
- What staging hostname and Cloudflare access scope will Davi Benucci approve?
- Which institutional commit is the previous known-good external release after
  the first successful staging and production deployment?
