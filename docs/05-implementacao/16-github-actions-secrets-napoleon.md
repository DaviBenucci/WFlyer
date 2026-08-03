# GitHub Environments, secrets, and Napoleon runtime

## Ownership boundary

GitHub Actions can validate and build a revision with environment-scoped
values. Napoleon runs a separate Node.js process and must receive its runtime
configuration through the hosting mechanism that is actually available. A
successful Actions build does not prove that the Napoleon process has any
secret.

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

1. record the application name, selected Git revision/artifact, start command,
   working directory, port contract, runtime user, restart behavior, and
   rollback control;
2. configure the five environment-appropriate Contact server values in the
   Node.js runtime; the public Turnstile site key is already fixed in the
   environment-specific browser build;
3. keep `TURNSTILE_SECRET_KEY` and `RESEND_API_KEY` server-only;
4. confirm the Resend sender domain before using
   `davi.benucci@wflyer.com.br`;
5. restrict `CONTACT_ALLOWED_ORIGINS` to the exact environment hosts;
6. restart safely and verify that missing configuration fails the contact route
   closed without exposing a value;
7. record who configured the values and when, without copying them into the
   repository or report.

If Napoleon only pulls Git, configure runtime variables in its application
panel. If it accepts the checksummed artifact, use the manifest revision and
verify the repository, environment, source ref, workflow run provenance, and
SHA-256 before extraction. Do not create `NAPOLEON_*` credentials until the
real integration documents their exact purpose and transport.

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
- unknown deployment method: the workflow uploads the candidate and records a
  pending handoff without external mutation.

Current state: `CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING`.
Repository-owned gates are green. GitHub Environment configuration, Napoleon
runtime/integration inventory, provider verification, and deployed staging are
the next externally owned gates.
