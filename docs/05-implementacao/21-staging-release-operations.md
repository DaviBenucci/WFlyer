# Staging, release, rollback, and homologation operations

**Current state:** `CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING`

This guide begins only after the repository quality gate is green. It does not
authorize production deployment, DNS changes, provider activation, or a merge
to `main`.

## 1. Candidate identity and tag strategy

The manual `Prepare Napoleon release` workflow resolves the requested ref to
one commit before any quality job, then makes every later checkout and build
reuse that immutable SHA. It produces:

- `wflyer-standalone-<environment>-<40-character-sha>.tar.gz`;
- the matching `.sha256` file;
- `wflyer-release-<environment>-<40-character-sha>.json` with repository,
  environment, ref, workflow run and attempt, canonical run URL, creation time,
  checksum, and `deployment.performed=false`.

The checksum names only the archive basename so it remains directly verifiable
after GitHub artifact download. Manifest generation independently hashes the
downloadable archive before accepting that checksum. It also requires the run
URL to equal `https://github.com/<repository>/actions/runs/<run-id>` and checks
the environment, ref, archive basename, and digest as one record. Staging and
production artifacts are separate builds and must never be relabeled or reused
across environments.

Packaging normalizes tar metadata and the checksum fixes the selected
artifact's identity. This does not claim that two independent Next.js builds
on floating hosted runners are byte-reproducible. A byte-identity statement is
permitted only after two packaging executions over the same already-prepared
standalone tree produce the same digest, with that scope recorded explicitly.

Napoleon does not consume this archive directly. The owner-confirmed
integration pulls/builds the environment branch from GitHub. The deployed
identity is therefore the full head SHA selected by Napoleon; the Actions
archive and manifest remain independent quality/provenance evidence for that
same source SHA.

Staging uses `develop/site-institucional`. After staging passes and Davi
Benucci approves the exact revision, the release tag strategy is
`wflyer-vX.Y.Z-rc.N`, followed by `wflyer-vX.Y.Z` only for the authorized
production revision. Do not create a public release or production tag before
approval.

## 2. External prerequisites

### GitHub

- `staging` and `production` Environments exist;
- production requires Davi Benucci as reviewer and restricts branches/tags;
- the six names in `16-github-actions-secrets-napoleon.md` are configured for
  each Environment;
- branch protection requires the complete CI workflow.

### Napoleon

- source integration is Git pull/build from
  `git@github.com:DaviBenucci/WFlyer.git`;
- staging selects only `develop/site-institucional` after that branch's exact
  head SHA has a green CI run and matching release manifest;
- staging is a separate Node.js application using Node 24 and the standalone
  start path;
- the exact build command, standalone start command, build/runtime variable
  scopes, working directory, port, health check, process user, restart
  behavior, and rollback selector are recorded from the Napoleon panel;
- runtime values are configured independently of Actions;
- the process user is isolated and non-administrative;
- health/restart behavior and the prior revision selector are known.

The Napoleon setup guide uses `public_html` as the application-root example.
Use that directory name for manual uploads unless the owner records a different
document root in the panel.

### Cloudflare and providers

- a read-only inventory confirms apex, `www`, mail, application, certificates,
  proxy, cache, WAF, and existing rate rules;
- the planned `staging.wflyer.com.br` host is owner-approved before creation;
- staging and production use appropriate Turnstile site/secret keys;
- the Resend sender domain is verified and staging delivery is safe;
- an owner-approved `/api/contact` edge rate rule is defined;
- legal owner data and the four documents receive professional review.

### Separate application availability baseline

The public read-only observation on 2026-08-03 found that
`app.wflyer.com.br` did not resolve in DNS from the observation environment.
This is an independent baseline blocker: it is not evidence that the
institutional repository caused the failure, and it does not authorize a DNS,
Cloudflare, or application change. The application owner must investigate and
record DNS resolution, HTTPS, and application health independently before the
institutional release can claim preservation of the separate application.

## 3. Prepare the staging candidate

1. Publish the reviewed revision as `develop/site-institucional` without
   merging to `main`, while no Napoleon application is yet attached to that
   branch.
2. Wait for the ordinary **CI** workflow triggered by that push and record a
   green result for the branch's full head SHA. GitHub Actions validates the
   pushed commit; it does not create or push another commit.
3. In GitHub Actions, dispatch **Prepare Napoleon release** with:
   `environment=staging`,
   `release_ref=develop/site-institucional`, and no production confirmation.
4. Confirm both complete quality jobs pass before the environment-scoped job
   starts.
5. Download the archive, checksum, and manifest; verify repository,
   environment, source ref, revision, run ID, run attempt, canonical run URL,
   artifact basename, and digest together; run
   `sha256sum -c <archive-name>.sha256` from the download directory; and
   confirm that the manifest says no deployment occurred.
6. Confirm `git ls-remote origin refs/heads/develop/site-institucional`, the
   green CI run, and the manifest all identify the same full SHA.
7. Freeze that branch head until Napoleon records the same selected SHA. If the
   head changes first, abort this handoff and repeat CI/candidate validation for
   the new full SHA.
8. In Napoleon, select the repository and
   `develop/site-institucional`; record the observed build/start and variable-
   scope controls before entering values or starting the application.
9. Configure `WFLYER_DEPLOYMENT_ENVIRONMENT=staging`, ensure the build derives
   `WFLYER_BUILD_ID` from the selected full Git SHA, configure the staging
   public Turnstile key and five Contact runtime values, then start or restart
   only the institutional staging application. If build and runtime values
   cannot be scoped separately, inspect the resulting server/client output for
   credential values before accepting staging.

### 3.1 Manual upload procedure for a checked artifact

If Napoleon expects a direct web-root upload, use the generated standalone
artifact instead of the source tree:

1. run `pnpm build`;
2. run `pnpm prepare:standalone`;
3. verify `.next/standalone/index.html` exists;
4. back up the current `public_html` contents on Napoleon;
5. upload the contents of `.next/standalone/` into `public_html`;
6. confirm `public_html/index.html` exists and references the uploaded
   `_next/static/` assets and `icon.svg`;
7. verify the route files or server output for the expected public pages;
8. test the domain root and the documented deep links;
9. restore the backup if any route, asset, or header check fails.

## 4. External staging validation

Use a separate clean checkout of the exact manifest revision for the staging
test runner. Before installing or running the suite, record the manifest SHA,
run `git rev-parse HEAD`, confirm exact equality, and confirm
`git status --porcelain` is empty. Do not run a newer worktree's tests against
an older candidate and describe them as revision-specific evidence.

Record the staging URL, manifest, branch head, revision, tester, date,
browser/device, and result. The staging report must also record the operator's
confirmation that the Napoleon application and host were selected from that
same branch/manifest/SHA.
The public URL currently exposes no documented revision header or endpoint, so
URL-to-artifact identity remains an external operational verification; do not
invent a public header or diagnostic route to claim it. Then run from the clean
checkout:

```bash
PLAYWRIGHT_BASE_URL=https://staging.wflyer.com.br pnpm test:staging
```

This production-safe staging suite uses only public behavior. Do not run the
local deterministic `test:e2e`, `test:a11y`, `test:motion`, or `test:visual`
suites against a deployed candidate: those suites rely on development-only
timeline controls and local visual baselines that are intentionally absent from
the production build.

Then verify manually:

- all 17 public routes, 404, sitemap, and direct deep links;
- adjacent, compressed, cross-branch, Back/Forward, terminal, and external-link
  navigation;
- brand opening once per tab, skip, Escape, asset/timeout fail-open, and reduced
  motion;
- tablet keyboard, mouse, touch, processing/result/reset, privacy, and tilt;
- Contact validation, Turnstile expiry/error/reset, one safe real delivery,
  provider failure, official email fallback, and no duplicate message;
- 320 px portrait, short landscape, tablet, desktop, wide desktop, zoom 200%
  and 400%, light/dark, orientation, and on-screen keyboard behavior;
- keyboard-only and physical screen-reader journeys with no focus trap or
  unannounced status;
- HTTPS certificate, no development stack, no sensitive logs, no contact cache,
  CSP reports, WAF/rate behavior, and aggregate provider failure visibility;
- `X-Robots-Tag` contains `noindex`, Home HTML contains robots noindex/nofollow,
  and `robots.txt` disallows `/` without advertising a sitemap;
- `app.wflyer.com.br` DNS, HTTPS, and application health are checked
  independently, and mail-related records remain operational and unchanged;
  the unresolved 2026-08-03 application baseline must be resolved and recorded
  before preservation can be claimed.

Do not update visual baselines from staging unless a reviewed product change,
not environment variance, justifies it.

## 5. CSP, HSTS, cache, and edge gates

- Observe report-only CSP violations through a privacy-safe staging channel;
  remove unnecessary sources and separately approve enforcement.
- Validate HTTPS for every hostname covered by any proposed HSTS policy,
  including the separate application, before enabling HSTS. Do not infer
  `includeSubDomains` safety.
- Keep `/api/contact` uncached at the application and edge.
- Prefer URL-scoped cache invalidation for changed institutional HTML/static
  assets. Never purge or mutate `app.wflyer.com.br` as part of this release.
- Choose rate thresholds/actions from observed traffic and owner policy; no
  number is fabricated in the repository.

## 6. Human homologation

Davi Benucci reviews the exact staging manifest and revision:

1. Home in light/dark and desktop/mobile;
2. opening sequence, skip, second visit in the same tab, and reduced motion;
3. both score branches, compressed jump, Home pivot, Back/Forward, and final
   barlines;
4. Application tablet journey and external application link;
5. Company, Services, four service details, Process, and the three-project
   Portfolio;
6. Contact success, failure, email fallback, and recipient delivery;
7. Privacy, Cookies, Terms, Accessibility, 404, sitemap, and staging noindex;
8. known limitations: report-only CSP, deferred HSTS, external rate policy,
   legal review, and unvalidated rollback if still pending.

Approval must identify the manifest/revision and explicitly authorize
production preparation. The workflow confirmation is exactly
`HOMOLOGADO_POR_DAVI`; the protected production Environment remains the
authoritative reviewer gate.

## 7. Production preparation and post-deploy smoke

Only after approval:

1. make the approved revision available as `main` or an approved
   `refs/tags/wflyer-vX.Y.Z[-rc.N]` ref;
2. dispatch the workflow with `environment=production`, that exact ref, and the
   confirmation above;
3. review the production Environment gate;
4. verify the candidate has `WFLYER_DEPLOYMENT_ENVIRONMENT=production` and
   passes production indexing smoke;
5. point the production Napoleon application only to the approved `main`
   revision (or select the verified tag if the panel supports tags), confirm
   its observed SHA, then build/restart through the inventoried controls;
6. smoke all routes, contact, HTTPS, headers, metadata, sitemap, error states,
   cache, provider delivery, logs, `app.wflyer.com.br`, and mail records;
7. record the release manifest, operator, start/end time, and observations.

No step in the current repository performs items 5–7 automatically.

## 8. Rollback

The previous known-good institutional reference is intentionally recorded as
`<PREVIOUS_INSTITUTIONAL_RELEASE_SHA>` until an external release exists. It is
an operational token, not a fabricated revision.

If staging or an authorized production release fails:

1. disable or bypass only the Contact form if provider behavior is the sole
   incident; keep the official email and static site available;
2. select the previous institutional commit/artifact in Napoleon through the
   verified control;
3. verify its checksum, runtime values, and deployment environment;
4. restart only the institutional Node.js application;
5. run route, asset, header, indexing, contact-fallback, HTTPS, and log smoke
   checks;
6. confirm `app.wflyer.com.br`, nameservers, and mail records are unchanged;
7. invalidate only affected institutional URLs when cache prevents recovery;
8. record cause, timeline, operator, restored revision, and follow-up.

Rollback is prepared but not validated until it is exercised in staging. Do
not mark the checklist item complete before that evidence exists.

## 9. Exact current blockers and rerun

| Blocker | Configuration owner/location | Rerun after resolution |
|---|---|---|
| GitHub Environments and values | Repository Settings → Environments | Dispatch `Prepare Napoleon release` for staging |
| Napoleon build/start/runtime controls | Napoleon application settings | Record source, branch, SHA, commands, variable scopes, port, health, process user, restart, and rollback controls; then run section 4 |
| Staging URL-to-source identity | Napoleon branch selection plus the release manifest/SHA | Record operator confirmation that `develop/site-institucional`, CI, manifest, selected application, and host identify the same SHA; do not infer identity from an undocumented public header |
| Cloudflare inventory/staging host/rate rule | Cloudflare read-only inventory, then approved change | Repeat header, HTTPS, cache, WAF/rate, app/mail checks |
| Independent `app.wflyer.com.br` DNS/availability baseline | Separate application/DNS owner and read-only Cloudflare inventory | Resolve the 2026-08-03 DNS failure cause, then record DNS, HTTPS, and application health before and after staging without mutating the application as part of this release |
| Turnstile and Resend staging configuration | Provider dashboards and Napoleon runtime | Repeat Contact success/failure/delivery checks |
| CSP and HSTS decisions | Staging reports plus owner/security approval | Rebuild and repeat security/Lighthouse matrix |
| Legal and physical accessibility review | Davi Benucci and qualified reviewers | Update reports, then repeat homologation |
| Production approval | Davi Benucci on exact manifest | Dispatch production candidate workflow only |

The repository-owned validation and controlled publication only to
`develop/site-institucional` are complete. The exact branch-head CI result must
still be recorded and pass before Napoleon is pointed to that frozen SHA. The
state remains `CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING`; it is not
`READY_FOR_HUMAN_HOMOLOGATION` or `READY_FOR_PRODUCTION` until deployed staging
and owner approval pass.
