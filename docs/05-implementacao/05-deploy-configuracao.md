# Deployment and runtime configuration

**Repository state:** `CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING`
**Production deployment:** not authorized
**Scope:** `wflyer.com.br` institutional site only

## Approved topology

```text
GitHub environment branch at a validated full commit SHA
  → Napoleon Node.js application
  → Cloudflare DNS / proxy / HTTPS / WAF
  → wflyer.com.br
```

The release does not require a VPS, EasyPanel, Docker, a database, or any
change to the separate `app.wflyer.com.br` application.

## Traceable build and artifact integrity

- Node.js 24 and pnpm 11;
- `pnpm install --frozen-lockfile`;
- `WFLYER_DEPLOYMENT_ENVIRONMENT=staging|production`;
- `WFLYER_BUILD_ID=<full-40-character-release-sha>` for a release candidate;
- `pnpm build`;
- `pnpm prepare:standalone`;
- start `.next/standalone/server.js` with the host and port supplied by
  Napoleon;
- use `HOSTNAME=0.0.0.0` only when the Napoleon process contract requires it.

The package contains `public/`, `.next/static/`, server output, and no source
documentation, Graphify output, OpenSpec artifact, golden reference, test
report, or provider credential value. Required server-runtime variable names
remain in server code by design; their values are supplied only to the
Napoleon process. The standalone package also exposes the document root files
needed by Napoleon-style uploads: `index.html`, `icon.svg`, `robots.txt`,
`sitemap.xml`, and `404.html`, plus a mirrored `_next/static/` tree for direct
file hosting. `pnpm smoke:standalone` validates all 17 public routes and their
referenced static assets.

`WFLYER_BUILD_ID` is a build-only traceability input. The manual workflow
resolves the approved source ref once, passes that immutable SHA to every
quality and packaging job, and uses it as the Next.js build ID. Local builds
may omit it and let Next.js create a development-only ID. A release value must
be the full lowercase Git SHA.

Exact dependencies, one resolved source SHA, and normalized tar metadata reduce
uncontrolled variance. The SHA-256 proves the integrity of the selected
archive. They do not establish that two independent Next.js builds on
`ubuntu-latest`, Node 24, or different absolute paths are byte-reproducible.
At release closure, repeated packaging may be compared only for the same
already-prepared standalone tree and must be described with that scope.

## Deployment environment contract

`WFLYER_DEPLOYMENT_ENVIRONMENT` is mandatory for a release build and accepts
only:

- `staging`: metadata and response headers use noindex/nofollow, and
  `robots.txt` disallows all crawling without advertising the sitemap;
- `production`: approved public metadata remains indexable, the sitemap is
  advertised, and `/api/` remains disallowed.

An absent or invalid value fails closed as non-indexable. `NODE_ENV` is not a
substitute because both staging and production use optimized production builds.
The selector is evaluated while prerendered pages, headers, and `robots.txt`
are built. A staging archive therefore cannot be promoted as a production
archive; each environment gets its own build, filename, checksum, and manifest.

## Required values

| Name | Build | Napoleon runtime | Secret |
|---|---:|---:|---:|
| `WFLYER_DEPLOYMENT_ENVIRONMENT` | yes | no; fixed in artifact | no |
| `WFLYER_BUILD_ID` | release only | no | no |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | yes, required for a candidate | no; fixed in browser output | public key |
| `TURNSTILE_SECRET_KEY` | no | yes | yes |
| `RESEND_API_KEY` | no | yes | yes |
| `CONTACT_FROM_EMAIL` | no | yes | configuration |
| `CONTACT_RECIPIENT_EMAIL` | no | yes | configuration |
| `CONTACT_ALLOWED_ORIGINS` | no | yes | configuration |

The protected GitHub Environment supplies exactly six values: the public
Turnstile site key used by the build and the five Contact server values used by
the Napoleon runtime. `WFLYER_DEPLOYMENT_ENVIRONMENT` comes from the controlled
workflow input and `WFLYER_BUILD_ID` comes from the resolved revision, so
neither is an Environment secret.

The canonical institutional and application URLs are version-controlled in
the approved site configuration. They are not release environment variables.
The contact route reads its five server values from the Napoleon Node.js
process. GitHub Environment secrets exist only inside the Actions job and do
not become Napoleon runtime variables automatically.

## Environment values

Production candidate build values are:

```text
WFLYER_DEPLOYMENT_ENVIRONMENT=production
WFLYER_BUILD_ID=<approved-full-40-character-release-sha>
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<production-public-site-key>
```

The production Napoleon runtime separately requires:

```text
TURNSTILE_SECRET_KEY=<production-server-secret>
RESEND_API_KEY=<production-server-secret>
CONTACT_FROM_EMAIL=davi.benucci@wflyer.com.br
CONTACT_RECIPIENT_EMAIL=davi.benucci@wflyer.com.br
CONTACT_ALLOWED_ORIGINS=https://wflyer.com.br,https://www.wflyer.com.br
```

The planned staging host is `https://staging.wflyer.com.br`, subject to the
read-only Cloudflare/Napoleon inventory and owner confirmation. Its artifact
must be built with `WFLYER_DEPLOYMENT_ENVIRONMENT=staging`, its own Turnstile
configuration, and an allowed-origin list that does not broaden production.
Mirroring the selector in Napoleon can aid operations, but changing it at
runtime does not convert an already built artifact to another environment.

The hosting panel documentation for Napoleon uses `public_html` as the example
application root. That is the only document-root name evidenced in this
repository, so manual uploads should target `public_html` unless the owner
confirms a different Napoleon root.

## Cloudflare precondition

Before any change, inventory read-only:

- zone and nameservers;
- apex, `www`, planned staging, and `app.wflyer.com.br` records;
- mail-related MX, TXT, SPF, DKIM, and DMARC records;
- proxy, SSL/TLS mode, certificates, cache, WAF, and existing rate rules.

Preserve every unrelated record. Do not enable HSTS until all covered hosts
pass HTTPS validation. Do not enforce the current report-only CSP until staging
reports have been observed and reviewed. `/api/contact` must remain uncached and
requires an owner-approved edge rate rule.

## Napoleon handoff

The owner-confirmed Napoleon integration pulls and builds a selected GitHub
branch. Staging uses `develop/site-institucional`; production remains limited
to `main` after explicit homologation. A push triggers read-only GitHub Actions
CI for that commit, but Actions does not create or advance a deployment branch.

The manual workflow continues to produce an environment-specific immutable
standalone archive, basename-compatible SHA-256 file, and non-secret release
manifest as quality/provenance evidence. The manifest generator hashes the
actual archive and validates repository, resolved revision, source ref,
environment, workflow run ID, attempt and canonical run URL, archive, checksum,
creation time, and `deployment.performed=false`. Before Napoleon is attached or
restarted, record that its selected branch head equals the full green CI and
manifest SHA. A Napoleon source build is independent from the Actions archive,
so do not claim byte identity between them. Keep the environment branch at that
head until Napoleon records the same selected SHA. If it advances first, abort
the handoff and repeat CI/candidate validation for the new head.

The remaining Napoleon inventory must identify its build command, standalone
start command, build/runtime variable scopes, port, health check, process user,
restart behavior, and rollback selector. Until those controls are observed, do
not invent an API, token, SSH process, hook, or executable deployment command.

## Completed local verification

The measured results are recorded in
`../07-qa/08-phase-09-release-readiness-report.md` and
`17-relatorio-execucao-codex.md`. The following commands remain the canonical
reproduction sequence:

```bash
WFLYER_DEPLOYMENT_ENVIRONMENT=production pnpm build
pnpm prepare:standalone
pnpm smoke:standalone
WFLYER_DEPLOYMENT_ENVIRONMENT=production pnpm smoke:indexing
pnpm lighthouse

WFLYER_DEPLOYMENT_ENVIRONMENT=staging pnpm build
pnpm prepare:standalone
WFLYER_DEPLOYMENT_ENVIRONMENT=staging pnpm smoke:indexing

env -u WFLYER_DEPLOYMENT_ENVIRONMENT pnpm build
pnpm prepare:standalone
env -u WFLYER_DEPLOYMENT_ENVIRONMENT pnpm smoke:indexing

WFLYER_DEPLOYMENT_ENVIRONMENT=preview pnpm build
pnpm prepare:standalone
WFLYER_DEPLOYMENT_ENVIRONMENT=preview pnpm smoke:indexing
```

External staging, rollback, and homologation procedures are in
`21-staging-release-operations.md`. No production command is authorized by
this document.
