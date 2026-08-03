## Context

See `proposal.md` for motivation. The site has durable historical phase
checkpoints and three archived 2026-08-03 corrections, but the final-current-
revision closure is still pending. It produces a Next.js standalone package
and has comprehensive local tests plus a manual workflow that intentionally
stops at artifact handoff. The actual Napoleon integration,
GitHub Environment settings, provider credentials, Cloudflare inventory, and
staging hostname are unavailable and must not be invented. ADR-018, ADR-020,
ADR-021, ADR-023, the publication operations record, and `AGENTS.md` control
the boundary.

## Goals / Non-Goals

**Goals:**

- Make local and CI quality evidence reproducible and exhaustive enough for a
  release candidate.
- Encode staging indexing protection as a build contract with independent HTML,
  robots, and header defenses.
- Produce an immutable, checksummed, non-secret candidate plus exact external
  handoff and rollback documentation.
- Leave every unavailable external prerequisite named, located, and paired with
  a rerun command.

**Non-Goals:**

- Deploying to staging or production, creating GitHub Environments, registering
  secrets, configuring Napoleon, changing Cloudflare/DNS, enabling HSTS/CSP
  enforcement, or validating provider delivery.
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
4. **Artifact handoff, not fictional deployment.** The GitHub workflow keeps its
   environment-scoped job, pinned actions, immutable SHA archive, and
   `cancel-in-progress: false`; it adds a machine-readable manifest and stronger
   environment/ref validation. It still calls no Napoleon endpoint because none
   is documented.
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

## Risks / Trade-offs

- **[Risk] Staging host policy is correct but unobserved externally** → Verify
  HTML, headers, robots, cache, HTTPS, and search behavior after the real staging
  URL exists.
- **[Risk] GitHub Environment protection cannot be created from repository
  files** → Document exact settings and keep the workflow job bound to the
  selected Environment so secrets remain inaccessible until approval.
- **[Risk] Napoleon may pull Git rather than accept an archive** → Treat the
  archive plus checksum as candidate-integrity evidence, not proof that two
  independent builds are byte-reproducible, and adapt only after a read-only
  inventory of the actual application configuration.
- **[Risk] Report-only CSP and absent HSTS are less strict than the intended
  production policy** → Observe CSP reports and validate all hostnames/HTTPS
  before separate owner-approved enforcement.
- **[Risk] Cross-browser local development can saturate under concurrency** →
  use the proven one-worker matrix without inflating product timeouts.

## Migration Plan

1. Merge the reviewed Phase 09 repository change into the staging branch only
   after CI passes.
2. Configure GitHub `staging` and `production` Environments and their scoped
   values; require Davi Benucci for production.
3. Inventory Napoleon and Cloudflare read-only, then configure a separate
   staging Node.js application with `WFLYER_DEPLOYMENT_ENVIRONMENT=staging`.
4. Run the documented staging matrix and obtain human homologation.
5. Only after explicit approval, prepare the production candidate with
   `WFLYER_DEPLOYMENT_ENVIRONMENT=production` and the verified deployment path.
6. Roll back by selecting the prior institutional commit/artifact, restarting
   only that Napoleon application, running smoke checks, and confirming
   `app.wflyer.com.br` and mail records remain unchanged.

## Open Questions

- What deployment mechanism does the existing Napoleon account expose: Git
  pull, artifact upload, webhook, or another documented path?
- What staging hostname and Cloudflare access scope will Davi Benucci approve?
- Which institutional commit is the previous known-good external release after
  the first successful staging and production deployment?
