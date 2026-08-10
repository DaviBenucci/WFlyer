# GitHub Environments, secrets, and Napoleon runtime

## Ownership boundary

GitHub Actions validates and may package a revision with environment-scoped
values. Napoleon's owner-confirmed integration independently pulls/builds a
selected GitHub branch and runs a separate Node.js process. A successful
Actions build does not transfer any value to that process and does not prove
that the Napoleon source build selected the same SHA.

## Required GitHub Environments

Create these in **Repository settings → Environments**:

- `staging`: allow only `develop/site-institucional`; use environment-specific
  provider configuration;
- `production`: allow only `main` and approved `wflyer-vX.Y.Z` or
  `wflyer-vX.Y.Z-rc.N` tags; require Davi Benucci as reviewer; prevent
  self-review when the repository plan supports it.

The workflow already binds the packaging job to the selected Environment,
serializes candidates per environment, and never runs from a pull request.
Repository settings remain an external configuration gate and cannot be
created by committed YAML.

## Environment-scoped values

Register these names in both Environments with values appropriate to each host:

```text
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
RESEND_API_KEY
CONTACT_FROM_EMAIL
CONTACT_RECIPIENT_EMAIL
CONTACT_ALLOWED_ORIGINS
```

The workflow requires exactly these six Environment values. The Turnstile site
key is a required public build-time value and is necessarily present in browser
output. The other five values are excluded from the build and release artifact
and must be configured independently in Napoleon. The validation step prints
missing names only, never values.

The canonical `wflyer.com.br` and `app.wflyer.com.br` URLs are versioned public
configuration and are deliberately not Environment values.

`WFLYER_DEPLOYMENT_ENVIRONMENT` is derived from the controlled workflow choice
and is not a secret. `WFLYER_BUILD_ID` is derived from the single resolved
release SHA, is passed to every candidate build, and is neither a secret nor a
Napoleon runtime setting.

## Napoleon runtime checklist

For each separate Napoleon Node.js application:

1. record the application name, `git@github.com:DaviBenucci/WFlyer.git` source,
   selected environment branch, full branch-head SHA, build command, standalone
   start command, working directory, port contract, runtime user, health check,
   restart behavior, and rollback control;
2. configure `WFLYER_DEPLOYMENT_ENVIRONMENT` for that separate application
   (`staging` for the currently authorized path; `production` only after
   homologation), plus the environment-appropriate public Turnstile site key
   and five Contact server values; ensure the recorded build derives
   `WFLYER_BUILD_ID` from the selected full Git SHA rather than a manual or
   mutable value;
3. keep `TURNSTILE_SECRET_KEY` and `RESEND_API_KEY` server-only;
4. confirm the Resend sender domain before using
   `davi.benucci@wflyer.com.br`;
5. restrict `CONTACT_ALLOWED_ORIGINS` to the exact environment hosts;
6. restart safely and verify that missing configuration fails the contact route
   closed without exposing a value;
7. record who configured the values and when, without copying them into the
   repository or report.

Napoleon pulls Git, so configure the public build value and five server values
explicitly in its application panel using the environment-appropriate values.
The GitHub workflow must retain `contents: read`, checkout without persisted
credentials, and no `git commit`/`git push` step. Before first startup or later
restart, verify that Napoleon's selected branch head, the green CI run, and the
release manifest identify the same full SHA. The checksummed Actions artifact
remains independent quality evidence; it is not the byte source for the
Napoleon build. Do not advance the environment branch until Napoleon records
that selected SHA; a changed head invalidates the handoff and requires a new
green CI/manifest cycle. Do not create `NAPOLEON_*` credentials because this
integration requires no repository-side deploy token, webhook, or SSH
transport.

## CI without provider secrets

Pull requests and ordinary pushes run deterministic local mocks and the public
Turnstile test key supplied by Playwright configuration. The manual candidate
quality job also uses Cloudflare's official always-pass public test site key,
while the environment-scoped packaging build uses the selected Environment's
real public site key. They execute lint, types, unit/component tests, Storybook,
complete Chromium/Firefox/WebKit functional, axe, motion and visual suites,
production build, standalone smoke, production indexing smoke, Lighthouse, a
conditional staging indexing build, OpenSpec validation, dependency audit, and
peer validation. Production provider secrets are not required or exposed.

Common CI validates the production baseline and all four indexing modes but
does not create or upload a deployable standalone archive. Environment-specific
archive, checksum, and manifest generation exists only in the manually
dispatched workflow after its quality gates and selected GitHub Environment.

## Failure behavior

- missing GitHub Environment value: candidate packaging stops before build;
- missing Napoleon runtime value: `/api/contact` fails closed with a generic
  response while static pages and the official email fallback remain usable;
- wrong staging/production selector: packaging stops, and unknown application
  builds remain non-indexable;
- unavailable provider: no message is persisted, and the visitor receives a
  recoverable generic error;
- branch SHA differs from the green CI/manifest SHA: do not attach or restart
  the Napoleon application;
- unknown build/start or environment-scope controls: keep the branch handoff
  pending and invent no command or credential.

Current state: `CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING`.
The infrastructure-only workflow bootstrap is published as commit
`d67554be7ceee4f2e744380275860781d302d145`
on `ci/napoleon-release-workflow-bootstrap`; it changes only
`.github/workflows/deploy.yml`. The connected GitHub App cannot open its draft
pull request (`403 Resource not accessible by integration`), so owner review
and merge to the default branch remain external. Ordinary CI run `31118939281`
for `065a077f9425943af8bc3ea821660bb356aef1da` also started no runner because
the GitHub account is locked for billing. Resolve that account lock and require
a green ordinary CI run for the exact final branch-head SHA before candidate
dispatch.

GitHub Environment configuration, the bootstrap merge, Napoleon
build/start/runtime inventory, provider verification, and deployed staging are
the next externally owned gates. The canonical panel contract is
`22-napoleon-node-runtime-runbook.md`; staging and owner-decision evidence is
recorded in `../07-qa/10-staging-homologation-report.md`.
