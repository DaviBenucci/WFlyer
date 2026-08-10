# Napoleon Node.js runtime runbook

**Repository:** `DaviBenucci/WFlyer`

**Staging branch:** `develop/site-institucional`

**Runtime:** Next.js standalone on Node.js 24

**Current status:** external Napoleon, GitHub Environment, DNS, and staging
evidence pending

**Production:** not authorized

## 1. Purpose and safety boundary

This runbook defines the only accepted Napoleon deployment model for the
W_Flyer institutional site. Napoleon must pull the selected GitHub revision,
build the repository as a Node.js application, and run the generated Next.js
standalone server.

The runtime entry point is:

```text
.next/standalone/server.js
```

An `index.html` inside a build tree or a legacy `public_html` directory is not a
runtime entry point and is not deployment evidence. Static document-root
hosting is incompatible with this application because it cannot preserve all
of the following contracts:

- server-rendered deep routes;
- `POST /api/contact` and its fail-closed server configuration;
- Next.js response and security headers;
- the custom page and HTTP status for unknown routes;
- staging indexing behavior produced by the selected deployment environment;
- runtime-only Turnstile and Resend secrets.

If the actual Napoleon panel supports only static uploads, FTP-style
`public_html` hosting, or a mandatory root `index.html`, stop. Record the panel
limitation as a provider incompatibility. Do not enable static export, remove
the contact endpoint, replace response headers, or claim a successful deploy
without a separate approved architecture change.

This runbook applies only to `wflyer.com.br`. It must not modify, restart,
repoint, or reuse the separate `app.wflyer.com.br` application.

## 2. Required release identity

Do not attach or restart Napoleon until all four identities are the same full
40-character lowercase Git SHA:

1. the head of `develop/site-institucional`;
2. the green ordinary `CI` workflow run;
3. the `Prepare Napoleon release` manifest revision;
4. the revision selected and built by Napoleon.

The Actions candidate archive is quality and provenance evidence. Napoleon
independently pulls and builds the selected branch; do not claim that the
provider build is byte-identical to the Actions archive. Keep the branch head
unchanged during handoff. If it advances before Napoleon records the selected
SHA, abort and repeat CI and candidate validation for the new revision.

Record these values before configuration:

| Evidence | Required value | Recorded value |
|---|---|---|
| Branch head | full green SHA | `<external evidence pending>` |
| Ordinary CI run ID and URL | same SHA, all required jobs green | `<external evidence pending>` |
| Candidate run ID and attempt | staging, same SHA | `<external evidence pending>` |
| Candidate archive | `wflyer-standalone-staging-<sha>.tar.gz` | `<external evidence pending>` |
| Candidate SHA-256 | 64 lowercase hexadecimal characters | `<external evidence pending>` |
| Manifest | same repository, ref, environment, run, and SHA | `<external evidence pending>` |
| Manifest deployment flag | `deployment.performed=false` | `<external evidence pending>` |

## 3. Napoleon panel contract

Copy the actual provider field labels and observed values into the evidence
column. A baseline value marked **required** is an acceptance condition, not an
assumption that the panel already exposes that field. Fields marked **external**
remain pending until the owner inspects the panel.

| Contract | Required or expected value | Provider evidence |
|---|---|---|
| Application type | **required:** Node.js application/process | `<external evidence pending>` |
| Application name | owner-approved staging application name | `<external evidence pending>` |
| Source provider | GitHub connection authorized by the owner | `<external evidence pending>` |
| Repository | `git@github.com:DaviBenucci/WFlyer.git` | `<external evidence pending>` |
| Staging branch | `develop/site-institucional` | `<external evidence pending>` |
| Selected revision | exact green candidate SHA | `<external evidence pending>` |
| Deploy behavior | actual automatic/manual behavior recorded before attachment | `<external evidence pending>` |
| Working directory | repository root | `<external evidence pending>` |
| Node.js version | `24.x` | `<external evidence pending>` |
| Package manager | pnpm `11.18.0` through Corepack | `<external evidence pending>` |
| Install/build command | command in section 4 | `<external evidence pending>` |
| Runtime entry point | `.next/standalone/server.js` | `<external evidence pending>` |
| Start command | `node .next/standalone/server.js` | `<external evidence pending>` |
| Host binding | `HOSTNAME=0.0.0.0` only when required by Napoleon | `<external evidence pending>` |
| Port | actual Napoleon-injected or configured `PORT`; never guess | `<external evidence pending>` |
| Health path | `/` | `<external evidence pending>` |
| Health timing and success rule | actual provider values | `<external evidence pending>` |
| Process user | isolated non-administrative user when supported | `<external evidence pending>` |
| Restart policy | actual provider value | `<external evidence pending>` |
| Build log access and retention | actual provider controls | `<external evidence pending>` |
| Runtime log access and retention | actual provider controls | `<external evidence pending>` |
| Rollback selector | actual prior-revision control | `<external evidence pending>` |

Reject the configuration if the provider cannot run a persistent Node.js
process, cannot supply its actual port contract, or rewrites the application as
static files.

## 4. Build and start commands

First confirm that Napoleon runs a Bash-compatible shell in the repository
checkout and supports `set -euo pipefail`. Then configure this build command:

```bash
set -euo pipefail
corepack enable
test "$(node --version | cut -d. -f1)" = "v24"
test "$(pnpm --version)" = "11.18.0"
pnpm install --frozen-lockfile
WFLYER_BUILD_ID="$(git rev-parse --verify 'HEAD^{commit}')"
export WFLYER_BUILD_ID
test "$(printf '%s' "${WFLYER_BUILD_ID}" | wc -c)" -eq 40
pnpm build
pnpm prepare:standalone
test -f .next/standalone/server.js
test "$(cat .next/standalone/.next/BUILD_ID)" = "${WFLYER_BUILD_ID}"
```

If the provider does not offer a Bash-compatible shell, record its exact shell
and supported command format before adapting this block. Do not silently remove
the fail-fast behavior.

Configure this start command:

```bash
node .next/standalone/server.js
```

Napoleon must inject or configure the real `PORT`. Configure
`HOSTNAME=0.0.0.0` only when required for the provider health proxy to reach the
process. Do not hard-code a guessed production port.

The health path is `/`. A healthy root response is necessary but not sufficient;
section 7 verifies the complete Node.js behavior.

## 5. Build-time and runtime values

GitHub Environment secrets do not automatically become Napoleon variables.
Configure the provider values independently and assign the correct scope.
Never paste secret values into Git, an Actions manifest, this runbook, a ticket,
a screenshot, or unredacted evidence.

| Name | Build scope | Runtime scope | Staging value format |
|---|---:|---:|---|
| `WFLYER_DEPLOYMENT_ENVIRONMENT` | required | required, same value | `staging` |
| `WFLYER_BUILD_ID` | exported by build command | no | exact selected SHA |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | required before `pnpm build` | no effect after build | `<staging public site key>` |
| `TURNSTILE_SECRET_KEY` | prohibited | required, server-only | `<staging Turnstile secret>` |
| `RESEND_API_KEY` | prohibited | required, server-only | `<staging Resend API key>` |
| `CONTACT_FROM_EMAIL` | prohibited | required | `<verified Resend sender>` |
| `CONTACT_RECIPIENT_EMAIL` | prohibited | required | `davi.benucci@wflyer.com.br` |
| `CONTACT_ALLOWED_ORIGINS` | prohibited | required | `https://<approved-staging-host>` |
| `NODE_ENV` | provider build default | required | `production` |
| `HOSTNAME` | no | provider-dependent | `0.0.0.0` only when required |
| `PORT` | no | required | `<actual Napoleon port contract>` |

`CONTACT_ALLOWED_ORIGINS` must contain only the exact HTTPS staging origin.
Wildcards, HTTP public origins, comma-separated development origins, production
origins, and paths are prohibited. `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is public
by design but must still be staging-specific and available before the build.

If Napoleon cannot separate build-time and runtime values, stop and inspect the
provider behavior before continuing. Server secrets must not be exposed to the
client bundle or build artifact.

## 6. Staging hostname and DNS evidence

Do not assume `staging.wflyer.com.br` or any other hostname. Davi Benucci must
approve the exact staging hostname. Record the actual Napoleon target before a
Cloudflare change.

| DNS and edge field | Recorded value |
|---|---|
| Owner-approved staging origin | `https://<approved-staging-host>` |
| Napoleon target hostname or address | `<external evidence pending>` |
| Cloudflare zone/account owner | `<external evidence pending>` |
| Record type | `<external evidence pending>` |
| Record name | `<external evidence pending>` |
| Record target | `<external evidence pending>` |
| Proxy state | `<external evidence pending>` |
| TTL | `<external evidence pending>` |
| SSL/TLS mode and certificate result | `<external evidence pending>` |
| Existing record inventory captured at | `<external evidence pending>` |
| Change operator and timestamp | `<external evidence pending>` |
| `app.wflyer.com.br` before check | `<external evidence pending>` |
| `app.wflyer.com.br` after check | `<external evidence pending>` |

Preserve apex, `www`, mail, verification, and `app.wflyer.com.br` records. Do
not enable HSTS or enforce the report-only CSP during this handoff. Configure an
owner-approved `/api/contact` rate rule only after the exact staging origin and
proxy behavior are known.

## 7. Exact staging verification

Run the commands below only after replacing the placeholder with the exact
owner-approved HTTPS origin. They intentionally submit no personal contact
content and do not exercise production.

### 7.1 Revision and process evidence

From the Napoleon checkout/build shell, record without secret values:

```bash
set -euo pipefail
git rev-parse --verify 'HEAD^{commit}'
test -f .next/standalone/server.js
test ! -L .next/standalone/server.js
cat .next/standalone/.next/BUILD_ID
node --version
pnpm --version
```

The Git revision and `BUILD_ID` must equal the branch head, green CI SHA, and
candidate manifest revision. Capture the provider deployment/revision screen
and the successful build/start/health events. Do not add a public revision
header merely to make this comparison easier.

### 7.2 Public routes and static assets

```bash
set -euo pipefail
export WFLYER_STAGING_ORIGIN="https://<approved-staging-host>"
node --input-type=module --eval '
  const origin = process.argv[1];
  const parsed = new URL(origin);
  if (parsed.protocol !== "https:" || parsed.origin !== origin) process.exit(1);
' "${WFLYER_STAGING_ORIGIN}"

export WFLYER_STAGING_EVIDENCE_DIR="$(mktemp -d)"
umask 077

while IFS= read -r route; do
  status="$(curl --silent --show-error --output /dev/null \
    --write-out '%{http_code}' "${WFLYER_STAGING_ORIGIN}${route}")"
  test "${status}" = "200" || {
    printf '%s returned HTTP %s\n' "${route}" "${status}" >&2
    exit 1
  }
done <<'WFLYER_PUBLIC_ROUTES'
/
/aplicacao-wflyer
/aplicacao-wflyer/como-funciona
/aplicacao-wflyer/beneficios
/sobre
/servicos
/processo
/portfolio
/contato
/servicos/criacao-de-sites
/servicos/criacao-de-aplicacoes
/servicos/integracoes
/servicos/solucoes-sob-medida
/politica-de-privacidade
/politica-de-cookies
/termos-de-uso
/acessibilidade
WFLYER_PUBLIC_ROUTES

curl --fail --silent --show-error \
  "${WFLYER_STAGING_ORIGIN}/" \
  --output "${WFLYER_STAGING_EVIDENCE_DIR}/home.html"
grep -Eo '(href|src)="/_next/static/[^"]+"' \
  "${WFLYER_STAGING_EVIDENCE_DIR}/home.html" \
  | cut -d'"' -f2 \
  | sort -u \
  >"${WFLYER_STAGING_EVIDENCE_DIR}/assets.txt"
test -s "${WFLYER_STAGING_EVIDENCE_DIR}/assets.txt"
while IFS= read -r asset; do
  curl --fail --silent --show-error \
    "${WFLYER_STAGING_ORIGIN}${asset}" --output /dev/null
done <"${WFLYER_STAGING_EVIDENCE_DIR}/assets.txt"
curl --fail --silent --show-error \
  "${WFLYER_STAGING_ORIGIN}/icon.svg" --output /dev/null
```

Keep the evidence directory until the homologation report has recorded its
redacted results. It contains public response data only and must never receive
provider environment dumps or secret-bearing logs.

### 7.3 Custom 404 and contact endpoint

```bash
set -euo pipefail
not_found_status="$(curl --silent --show-error \
  --output "${WFLYER_STAGING_EVIDENCE_DIR}/404.html" \
  --write-out '%{http_code}' \
  "${WFLYER_STAGING_ORIGIN}/rota-publica-inexistente")"
test "${not_found_status}" = "404"
grep -Fq 'Página não encontrada' \
  "${WFLYER_STAGING_EVIDENCE_DIR}/404.html"

contact_get_status="$(curl --silent --show-error --output /dev/null \
  --write-out '%{http_code}' \
  "${WFLYER_STAGING_ORIGIN}/api/contact")"
test "${contact_get_status}" = "405"

contact_invalid_status="$(curl --silent --show-error \
  --request POST \
  --header 'Content-Type: application/json' \
  --header "Origin: ${WFLYER_STAGING_ORIGIN}" \
  --data '{}' \
  --dump-header "${WFLYER_STAGING_EVIDENCE_DIR}/contact-invalid.headers" \
  --output "${WFLYER_STAGING_EVIDENCE_DIR}/contact-invalid.json" \
  --write-out '%{http_code}' \
  "${WFLYER_STAGING_ORIGIN}/api/contact")"
test "${contact_invalid_status}" = "400"
grep -Eiq '^cache-control:.*no-store' \
  "${WFLYER_STAGING_EVIDENCE_DIR}/contact-invalid.headers"
grep -Fq '"ok":false' \
  "${WFLYER_STAGING_EVIDENCE_DIR}/contact-invalid.json"
```

A static host cannot satisfy these checks: the unknown route must carry HTTP
404 and the custom page, while `/api/contact` must enforce the Node.js route
contract.

### 7.4 Headers and staging indexing

```bash
set -euo pipefail
curl --silent --show-error --head \
  "${WFLYER_STAGING_ORIGIN}/" \
  | tr -d '\r' \
  >"${WFLYER_STAGING_EVIDENCE_DIR}/home.headers"

grep -Eiq '^content-security-policy-report-only:' \
  "${WFLYER_STAGING_EVIDENCE_DIR}/home.headers"
grep -Eiq '^cross-origin-opener-policy: same-origin$' \
  "${WFLYER_STAGING_EVIDENCE_DIR}/home.headers"
grep -Eiq '^referrer-policy: strict-origin-when-cross-origin$' \
  "${WFLYER_STAGING_EVIDENCE_DIR}/home.headers"
grep -Eiq '^x-content-type-options: nosniff$' \
  "${WFLYER_STAGING_EVIDENCE_DIR}/home.headers"
grep -Eiq '^x-frame-options: DENY$' \
  "${WFLYER_STAGING_EVIDENCE_DIR}/home.headers"
grep -Eiq '^x-robots-tag: noindex, nofollow, noarchive, noimageindex$' \
  "${WFLYER_STAGING_EVIDENCE_DIR}/home.headers"

curl --fail --silent --show-error \
  "${WFLYER_STAGING_ORIGIN}/robots.txt" \
  | tr -d '\r' \
  >"${WFLYER_STAGING_EVIDENCE_DIR}/robots.txt"
grep -Fqx 'User-Agent: *' \
  "${WFLYER_STAGING_EVIDENCE_DIR}/robots.txt"
grep -Fqx 'Disallow: /' \
  "${WFLYER_STAGING_EVIDENCE_DIR}/robots.txt"
if grep -Fq 'Sitemap:' "${WFLYER_STAGING_EVIDENCE_DIR}/robots.txt"; then
  printf 'Staging robots.txt must not advertise a sitemap.\n' >&2
  exit 1
fi
```

The CSP must remain report-only until deployed reports are reviewed. Staging
must remain `noindex`, `nofollow`, `noarchive`, and `noimageindex` at the HTTP
layer, with equivalent HTML metadata.

### 7.5 Repository staging suite

From a clean checkout of the exact deployed revision:

```bash
set -euo pipefail
test -z "$(git status --porcelain)"
test "$(git rev-parse --verify 'HEAD^{commit}')" = "<exact-deployed-sha>"
corepack enable
pnpm install --frozen-lockfile
PLAYWRIGHT_BASE_URL="https://<approved-staging-host>" pnpm test:staging
```

Record the command, exact SHA, run start/end time, pass/fail counts, browser
versions, and evidence path. Automated success does not replace physical
screen-reader, keyboard-only, real-device, contact-delivery, security, or visual
homologation.

## 8. Logs and evidence record

Retain or link the following without copying secret values:

- Napoleon application identifier and actual panel field names;
- source connection, branch, selected SHA, and deployment event identifier;
- Node.js/pnpm versions and redacted build log;
- successful build, start, health, and restart events;
- actual port and host-binding contract without credentials;
- process user, restart policy, log retention, and rollback control;
- green CI and candidate workflow URLs;
- archive and manifest names plus SHA-256;
- approved staging origin and Cloudflare record evidence;
- public HTTP command output and `test:staging` result;
- `app.wflyer.com.br` independent before/after health result;
- operator, timestamp, open defects, and rollback evidence.

Before attaching logs, search them for full email addresses other than the
approved public recipient, Turnstile tokens, Resend keys, provider credentials,
cookies, contact message content, and environment dumps. Redact or omit any
sensitive line. A statement that logs were reviewed is not a substitute for
recording their access method and retention period.

## 9. Production approval boundary

This runbook does not authorize production. Do not perform any of the following
without Davi Benucci's explicit approval after completed staging homologation:

- merge the institutional application into `main`;
- create or publish a production release tag;
- dispatch a production candidate;
- attach or restart a production Napoleon application;
- change apex, `www`, mail, or production Cloudflare records;
- enforce CSP or enable HSTS;
- alter `app.wflyer.com.br`.

The maximum truthful status before staging exists is
`CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING`. After the exact SHA is live and
automated staging gates pass, use
`STAGING_DEPLOYED_HOMOLOGATION_PENDING`. Only Davi Benucci may record
`STAGING_HOMOLOGATED_PRODUCTION_NOT_AUTHORIZED` after human approval.
