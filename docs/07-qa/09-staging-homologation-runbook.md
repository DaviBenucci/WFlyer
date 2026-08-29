# Staging homologation runbook

**Current execution status:** `BLOCKED — external configuration pending`
**Authorized environment:** staging only
**Production:** not authorized
**Owner and final approver:** Davi Benucci

This runbook validates the institutional `wflyer.com.br` Next.js application
after an exact green revision is running as a Napoleon Node.js process at an
owner-approved staging origin. It does not authorize a production deployment,
a merge to `main`, a production tag, a Registro.br/Napoleon DNS change, an
invented cache purge, or any change to `app.wflyer.com.br`.

The deployable runtime is `.next/standalone/server.js`. An `index.html` file in
a standalone tree is not a deployable substitute for that Node.js process.
Stop and report a provider incompatibility if the inspected Napoleon product
offers only static document-root hosting.

Use `../05-implementacao/22-napoleon-node-runtime-runbook.md` for the canonical
panel/build/runtime contract and
`../08-operacao/03-napoleon-rollback-runbook.md` for the controlled rollback
exercise.

## 1. Entry gate and stop conditions

Do not begin deployed-origin validation until every required input below has an
observed value. Use `PENDING` in the homologation report; never guess a value.

| Required input | Exact evidence |
|---|---|
| Repository | `DaviBenucci/WFlyer` and `git@github.com:DaviBenucci/WFlyer.git` |
| Staging source ref | `develop/site-institucional` |
| Candidate revision | Full 40-character lowercase Git SHA |
| Ordinary CI | Green run URL, run ID, attempt, head SHA, and every job result |
| Candidate workflow | Green `Prepare Napoleon release` run URL, ID, attempt, selected ref, resolved SHA, and every job result |
| Candidate artifacts | Archive, `.sha256`, manifest, and candidate browser evidence artifact names |
| Candidate manifest | `environment=staging`, matching revision/ref/repository, matching artifact digest, and `deployment.performed=false` |
| Napoleon application | Actual application name and observed Node.js panel inventory |
| Napoleon revision | Selected branch and resolved SHA equal to CI and manifest |
| Staging origin | Exact owner-approved `https://` origin with no path, query, fragment, or wildcard |
| Napoleon DNS/hosting | Read-only inventory and an approved staging-only record plan |
| Provider values | Staging-specific Turnstile, verified Resend sender, exact allowed origin, and Napoleon build/runtime scopes |
| Separate application baseline | DNS, HTTPS, and application result for `app.wflyer.com.br` before the staging change |

Stop without deployment or homologation if any of these conditions applies:

- ordinary CI, candidate quality, or candidate browser evidence is not green
  for the same full SHA;
- the remote branch head changed after candidate validation;
- the candidate checksum or manifest does not validate;
- Napoleon's application type, Git source, selected SHA, build command, start
  command, variable scopes, port contract, or health behavior is unknown;
- Napoleon exposes static hosting but no long-running Node.js process;
- the staging origin or Napoleon DNS/hosting target is not owner-approved;
- a required secret value is unavailable or would have to be copied into Git,
  a command transcript, a screenshot, or an evidence file;
- the proposed operation would alter apex, `www`, mail, nameservers,
  `app.wflyer.com.br`, or production.

## 2. Evidence handling and privacy boundary

Use an ignored local evidence directory with mode `0700`. Do not commit this
directory.

```bash
set -euo pipefail

export WFLYER_CANDIDATE_SHA="<full-40-character-lowercase-sha>"
export WFLYER_STAGING_ORIGIN="https://<owner-approved-staging-host>"
export WFLYER_EVIDENCE_DIR="release/staging-homologation/${WFLYER_CANDIDATE_SHA}"

[[ "${WFLYER_CANDIDATE_SHA}" =~ ^[0-9a-f]{40}$ ]]
[[ "${WFLYER_STAGING_ORIGIN}" =~ ^https://[A-Za-z0-9.-]+(:[0-9]+)?$ ]]
install -d -m 0700 "${WFLYER_EVIDENCE_DIR}"
```

Evidence may contain public response headers, public HTML, sanitized console
output, run metadata, SHA-256 values, timestamps, and screenshots with no
visitor data. Evidence must not contain:

- a Turnstile token, site secret, Resend API key, provider credential, cookie,
  authorization header, or Napoleon environment value;
- a contact request body, personal message, complete visitor email address, or
  complete provider delivery payload;
- an unsanitized HAR file, because it can contain cookies, headers, form data,
  and ephemeral verification tokens;
- a screenshot of a provider environment-value screen while values are
  visible.

Record the operator, timezone-aware start/end timestamps, browser/device,
network vantage point, and evidence filename for every manual result. Redact a
secret at the source; do not rely on later repository cleanup.

## 3. Exact candidate identity

Run these commands from a separate clean checkout of the candidate revision.
Do not switch or clean an unrelated working tree to create this evidence.

```bash
set -euo pipefail

test "$(git rev-parse HEAD)" = "${WFLYER_CANDIDATE_SHA}"
test -z "$(git status --porcelain)"

remote_sha="$(
  git ls-remote origin refs/heads/develop/site-institucional |
    awk 'NR == 1 { print $1 }'
)"
test "${remote_sha}" = "${WFLYER_CANDIDATE_SHA}"

printf 'repository=%s\nbranch=%s\nsha=%s\nremote_sha=%s\n' \
  'DaviBenucci/WFlyer' \
  'develop/site-institucional' \
  "${WFLYER_CANDIDATE_SHA}" \
  "${remote_sha}" \
  >"${WFLYER_EVIDENCE_DIR}/source-identity.txt"
```

Record ordinary CI without copying job logs that might contain external
configuration:

```bash
export WFLYER_CI_RUN_ID="<ordinary-ci-run-id>"
export WFLYER_CI_RUN_ATTEMPT="<positive-integer-attempt>"

gh run view "${WFLYER_CI_RUN_ID}" \
  --attempt "${WFLYER_CI_RUN_ATTEMPT}" \
  --json attempt,conclusion,headBranch,headSha,jobs,name,status,url,workflowName \
  >"${WFLYER_EVIDENCE_DIR}/ordinary-ci.json"

jq -e --arg sha "${WFLYER_CANDIDATE_SHA}" '
  .headSha == $sha and
  .headBranch == "develop/site-institucional" and
  .status == "completed" and
  .conclusion == "success" and
  ([.jobs[].conclusion] | all(. == "success" or . == "skipped"))
' "${WFLYER_EVIDENCE_DIR}/ordinary-ci.json"
```

Record and download the exact staging candidate run:

```bash
export WFLYER_CANDIDATE_RUN_ID="<prepare-napoleon-release-run-id>"
export WFLYER_CANDIDATE_RUN_ATTEMPT="<positive-integer-attempt>"
export WFLYER_PACKAGE_ARTIFACT="wflyer-staging-${WFLYER_CANDIDATE_SHA}-attempt-${WFLYER_CANDIDATE_RUN_ATTEMPT}"
export WFLYER_BROWSER_ARTIFACT="candidate-browser-staging-${WFLYER_CANDIDATE_SHA}-attempt-${WFLYER_CANDIDATE_RUN_ATTEMPT}"

gh run view "${WFLYER_CANDIDATE_RUN_ID}" \
  --attempt "${WFLYER_CANDIDATE_RUN_ATTEMPT}" \
  --json attempt,conclusion,headBranch,headSha,jobs,name,status,url,workflowName \
  >"${WFLYER_EVIDENCE_DIR}/candidate-run.json"

jq -e '
  .status == "completed" and
  .conclusion == "success" and
  .workflowName == "Prepare Napoleon release" and
  ([.jobs[].conclusion] | all(. == "success" or . == "skipped"))
' "${WFLYER_EVIDENCE_DIR}/candidate-run.json"

install -d -m 0700 "${WFLYER_EVIDENCE_DIR}/package"
install -d -m 0700 "${WFLYER_EVIDENCE_DIR}/browser"

gh run download "${WFLYER_CANDIDATE_RUN_ID}" \
  --name "${WFLYER_PACKAGE_ARTIFACT}" \
  --dir "${WFLYER_EVIDENCE_DIR}/package"
gh run download "${WFLYER_CANDIDATE_RUN_ID}" \
  --name "${WFLYER_BROWSER_ARTIFACT}" \
  --dir "${WFLYER_EVIDENCE_DIR}/browser"
```

Set the downloaded candidate paths and verify the archive and manifest:

```bash
export WFLYER_RELEASE_ARCHIVE="${WFLYER_EVIDENCE_DIR}/package/wflyer-standalone-staging-${WFLYER_CANDIDATE_SHA}.tar.gz"
export WFLYER_RELEASE_CHECKSUM="${WFLYER_RELEASE_ARCHIVE}.sha256"
export WFLYER_RELEASE_MANIFEST="${WFLYER_EVIDENCE_DIR}/package/wflyer-release-staging-${WFLYER_CANDIDATE_SHA}.json"

test -f "${WFLYER_RELEASE_ARCHIVE}"
test -f "${WFLYER_RELEASE_CHECKSUM}"
test -f "${WFLYER_RELEASE_MANIFEST}"

(
  cd "$(dirname "${WFLYER_RELEASE_CHECKSUM}")"
  sha256sum -c "$(basename "${WFLYER_RELEASE_CHECKSUM}")"
)

archive_name="$(basename "${WFLYER_RELEASE_ARCHIVE}")"
jq -e \
  --arg sha "${WFLYER_CANDIDATE_SHA}" \
  --arg archive "${archive_name}" \
  --arg run_id "${WFLYER_CANDIDATE_RUN_ID}" \
  --arg run_attempt "${WFLYER_CANDIDATE_RUN_ATTEMPT}" '
    .schemaVersion == 1 and
    .project == "wflyer.com.br" and
    .repository == "DaviBenucci/WFlyer" and
    .environment == "staging" and
    .revision == $sha and
    .sourceRef == "develop/site-institucional" and
    .artifact.file == $archive and
    (.artifact.sha256 | test("^[0-9a-f]{64}$")) and
    .workflow.runId == $run_id and
    .workflow.runAttempt == $run_attempt and
    .workflow.url == ("https://github.com/DaviBenucci/WFlyer/actions/runs/" + $run_id) and
    .deployment.performed == false and
    .deployment.target == "Napoleon Node.js application"
  ' "${WFLYER_RELEASE_MANIFEST}"

archive_digest="$(sha256sum "${WFLYER_RELEASE_ARCHIVE}" | awk '{ print $1 }')"
manifest_digest="$(jq -r '.artifact.sha256' "${WFLYER_RELEASE_MANIFEST}")"
test "${archive_digest}" = "${manifest_digest}"

jq '{
  schemaVersion,
  project,
  repository,
  environment,
  revision,
  sourceRef,
  workflow,
  createdAt,
  artifact,
  deployment
}' "${WFLYER_RELEASE_MANIFEST}" \
  >"${WFLYER_EVIDENCE_DIR}/candidate-manifest-summary.json"
```

The checksummed Actions archive is provenance evidence. Napoleon independently
pulls and builds the selected Git revision; do not claim byte identity between
the archive and Napoleon's build.

## 4. Napoleon DNS and hosting handoff record

Before starting the application, transcribe these actual Napoleon panel fields
without copying any secret value:

| Panel field | Required recorded value |
|---|---|
| Application name | Actual Napoleon application identifier |
| Application type | Must support a long-running Node.js application |
| Source connection | Actual Git integration and repository |
| Selected source | `develop/site-institucional` and observed full SHA |
| Deploy behavior | Actual automatic/manual control and how premature deploy is prevented |
| Node version | Actual configured `24.x` value |
| Package manager | Actual Corepack/pnpm `11.24.0` behavior |
| Working directory | Actual repository-root setting |
| Build command | Actual command, compared with the canonical runtime runbook |
| Start command | Must execute `node .next/standalone/server.js` |
| Build-time values | Names and scopes only; never values |
| Runtime values | Names and scopes only; never values |
| Port contract | Actual injected/configured field and value format |
| Health check | Actual path, interval, timeout, and success definition |
| Process user | Actual user and whether it is isolated/non-administrative |
| Restart policy | Actual restart control and limits |
| Logs | Actual access control and retention; payload logging must be absent |
| Rollback selector | Actual immutable revision/ref selector |

The six provider-backed names are
`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`,
`CONTACT_FROM_EMAIL`, `CONTACT_RECIPIENT_EMAIL`, and
`CONTACT_ALLOWED_ORIGINS`. Record only whether each name is present in the
correct build/runtime scope. `CONTACT_ALLOWED_ORIGINS` must contain only the
exact staging origin. GitHub Environment values do not automatically enter the
Napoleon process.

Before a Napoleon DNS/hosting mutation, record the actual authoritative
nameservers and the before-state of these fields:

| Inventory group | Exact fields |
|---|---|
| DNS | record name, type, target/content, TTL for apex, `www`, staging, `app`, MX, SPF, DKIM, and DMARC |
| TLS | Napoleon certificate coverage/status and HSTS state |
| Cache | actual Napoleon cache controls affecting staging and explicit `/api/contact` behavior, or unavailable |
| Security | actual Napoleon WAF/rate capability and approved staging rule, or unavailable |
| Ownership | operator, approval reference, change timestamp, and rollback target |

Create or change only the separately approved staging record after the exact
Napoleon target is known. Preserve apex, `www`, nameservers, mail, and
`app.wflyer.com.br`. Do not enable HSTS, enforce CSP, or choose a fabricated
rate threshold during this procedure.

## 5. Automated public staging gate

From the same clean candidate checkout:

```bash
set -euo pipefail
corepack enable
pnpm install --frozen-lockfile

PLAYWRIGHT_BASE_URL="${WFLYER_STAGING_ORIGIN}" \
  pnpm test:staging 2>&1 |
  tee "${WFLYER_EVIDENCE_DIR}/playwright-staging.log"
```

The suite must pass against the external HTTPS origin without starting a local
server and without exposing `__WFLYER_TRANSITION_TEST__`. It covers all public
routes, staging noindex, accessibility, 404, navigation history, first-session
intro, the local tablet journey, and a non-submitting Contact form check.

Do not point `test:e2e`, `test:a11y`, `test:motion`, or `test:visual` at
deployed staging. Those suites use repository-test controls and local visual
baselines.

## 6. HTTP and runtime evidence

Use `curl` without credentials. Do not use `--location-trusted`, authorization
headers, cookies, or a Turnstile token. Save headers and public bodies
separately.

```bash
set -euo pipefail

routes=(
  '/'
  '/aplicacao-wflyer'
  '/aplicacao-wflyer/como-funciona'
  '/aplicacao-wflyer/beneficios'
  '/sobre'
  '/servicos'
  '/processo'
  '/portfolio'
  '/contato'
  '/servicos/criacao-de-sites'
  '/servicos/criacao-de-aplicacoes'
  '/servicos/integracoes'
  '/servicos/solucoes-sob-medida'
  '/politica-de-privacidade'
  '/politica-de-cookies'
  '/termos-de-uso'
  '/acessibilidade'
)

for route in "${routes[@]}"; do
  slug="${route#/}"
  slug="${slug//\//__}"
  [[ -n "${slug}" ]] || slug='root'

  status="$(
    curl --silent --show-error \
      --connect-timeout 10 \
      --max-time 30 \
      --dump-header "${WFLYER_EVIDENCE_DIR}/${slug}.headers" \
      --output "${WFLYER_EVIDENCE_DIR}/${slug}.html" \
      --write-out '%{response_code}' \
      "${WFLYER_STAGING_ORIGIN}${route}"
  )"
  test "${status}" = '200'
done
```

The Home response must expose the Node.js security/indexing contract:

```bash
home_headers="${WFLYER_EVIDENCE_DIR}/root.headers"

grep -Eiq '^x-robots-tag:[[:space:]]*noindex, nofollow, noarchive, noimageindex[[:space:]]*$' "${home_headers}"
grep -Eiq '^content-security-policy-report-only:' "${home_headers}"
! grep -Eiq '^content-security-policy:' "${home_headers}"
grep -Eiq '^cross-origin-opener-policy:[[:space:]]*same-origin[[:space:]]*$' "${home_headers}"
grep -Eiq '^referrer-policy:[[:space:]]*strict-origin-when-cross-origin[[:space:]]*$' "${home_headers}"
grep -Eiq '^x-content-type-options:[[:space:]]*nosniff[[:space:]]*$' "${home_headers}"
grep -Eiq '^x-frame-options:[[:space:]]*DENY[[:space:]]*$' "${home_headers}"
```

Record any `strict-transport-security` header as observed hosting evidence. Do not
enable or broaden HSTS until every covered hostname, including the separate
application, has been inventoried and approved.

Verify negative routes and Contact method/content handling:

```bash
unknown_status="$(
  curl --silent --show-error \
    --connect-timeout 10 \
    --max-time 30 \
    --dump-header "${WFLYER_EVIDENCE_DIR}/unknown.headers" \
    --output "${WFLYER_EVIDENCE_DIR}/unknown.html" \
    --write-out '%{response_code}' \
    "${WFLYER_STAGING_ORIGIN}/rota-publica-inexistente"
)"
test "${unknown_status}" = '404'
grep -Fq 'Página não encontrada' "${WFLYER_EVIDENCE_DIR}/unknown.html"

contact_get_status="$(
  curl --silent --show-error \
    --request GET \
    --dump-header "${WFLYER_EVIDENCE_DIR}/contact-get.headers" \
    --output "${WFLYER_EVIDENCE_DIR}/contact-get.body" \
    --write-out '%{response_code}' \
    "${WFLYER_STAGING_ORIGIN}/api/contact"
)"
test "${contact_get_status}" = '405'

contact_media_status="$(
  curl --silent --show-error \
    --request POST \
    --header 'Content-Type: text/plain' \
    --data '{}' \
    --dump-header "${WFLYER_EVIDENCE_DIR}/contact-media.headers" \
    --output "${WFLYER_EVIDENCE_DIR}/contact-media.json" \
    --write-out '%{response_code}' \
    "${WFLYER_STAGING_ORIGIN}/api/contact"
)"
test "${contact_media_status}" = '415'
grep -Eiq '^cache-control:[[:space:]]*no-store, max-age=0[[:space:]]*$' \
  "${WFLYER_EVIDENCE_DIR}/contact-media.headers"

contact_payload_status="$(
  curl --silent --show-error \
    --request POST \
    --header 'Content-Type: application/json' \
    --header "Origin: ${WFLYER_STAGING_ORIGIN}" \
    --data '{"website":""}' \
    --dump-header "${WFLYER_EVIDENCE_DIR}/contact-invalid.headers" \
    --output "${WFLYER_EVIDENCE_DIR}/contact-invalid.json" \
    --write-out '%{response_code}' \
    "${WFLYER_STAGING_ORIGIN}/api/contact"
)"
test "${contact_payload_status}" = '400'
grep -Fq '"code":"invalid_request"' \
  "${WFLYER_EVIDENCE_DIR}/contact-invalid.json"
```

Verify staging crawler controls and public assets:

```bash
curl --silent --show-error --fail-with-body \
  --dump-header "${WFLYER_EVIDENCE_DIR}/robots.headers" \
  --output "${WFLYER_EVIDENCE_DIR}/robots.txt" \
  "${WFLYER_STAGING_ORIGIN}/robots.txt"

diff -u \
  <(printf 'User-Agent: *\nDisallow: /\n') \
  "${WFLYER_EVIDENCE_DIR}/robots.txt"
! grep -Fq 'Sitemap:' "${WFLYER_EVIDENCE_DIR}/robots.txt"

curl --silent --show-error --fail-with-body \
  --output "${WFLYER_EVIDENCE_DIR}/sitemap.xml" \
  "${WFLYER_STAGING_ORIGIN}/sitemap.xml"
! grep -Fq '/api/contact' "${WFLYER_EVIDENCE_DIR}/sitemap.xml"
! grep -Fq 'app.wflyer.com.br' "${WFLYER_EVIDENCE_DIR}/sitemap.xml"

grep -oE "/_next/static/[^\"' <]+" "${WFLYER_EVIDENCE_DIR}/root.html" |
  sort -u >"${WFLYER_EVIDENCE_DIR}/next-assets.txt"
test -s "${WFLYER_EVIDENCE_DIR}/next-assets.txt"

while IFS= read -r asset; do
  curl --silent --show-error --fail-with-body \
    --output /dev/null \
    "${WFLYER_STAGING_ORIGIN}${asset}"
done <"${WFLYER_EVIDENCE_DIR}/next-assets.txt"

curl --silent --show-error --fail-with-body \
  --output /dev/null \
  "${WFLYER_STAGING_ORIGIN}/icon.svg"
```

## 7. Manual browser and DevTools review

Use a new browser profile with extensions disabled. Record browser name,
version, operating system, device, viewport, theme, reduced-motion setting,
operator, timestamp, and result. At minimum review:

1. desktop light and dark;
2. mobile light and dark on a real device;
3. first-session intro natural completion, Skip, Escape, unlocked scroll, and
   no replay in the same tab;
4. Application and institutional branches, compressed jumps, Home pivot,
   terminal pages, Back/Forward, refresh, and direct deep links;
5. theme persistence without analytics or marketing storage;
6. tablet mouse, keyboard, touch, processing, result, reset, focus indicator,
   mobile layout, and reduced motion;
7. Contact native/client validation, keyboard order, Turnstile success/expiry/
   reset, one owner-approved real delivery, generic provider failure, retained
   editable context, and official email fallback;
8. 320 px portrait, short landscape, tablet, desktop, wide desktop, 200% zoom,
   400% zoom, orientation change, and on-screen keyboard;
9. keyboard-only navigation and a physical screen-reader journey;
10. comparison against the approved master board and authorized page
    archetypes without updating any baseline from staging.

In DevTools:

- keep **Preserve log** enabled and verify the initial document, deep links,
  CSS, JavaScript, fonts, and images have no unexpected 4xx/5xx response;
- verify no `/_next/webpack-hmr`, development portal, Fast Refresh, source-map
  disclosure, or test-only transition controller appears;
- inspect document response headers for report-only CSP, frame protection,
  referrer policy, content-type protection, and staging noindex;
- inspect `/api/contact` responses for `Cache-Control: no-store, max-age=0` and
  generic public errors;
- verify the tablet performs no application/API upload or musical-engine
  request;
- inspect Console for uncaught errors and unexpected CSP violations, while
  recording only sanitized summaries;
- do not export an unsanitized HAR and do not screenshot Contact fields,
  cookies, request payloads, or Turnstile tokens.

For the single safe real Contact delivery, use owner-approved synthetic text.
Record only timestamp, staging origin, aggregate success/failure, provider
acceptance/delivery state, and recipient confirmation. Do not record the
message, visitor address, token, or provider payload.

## 8. Security, hosting, and separate-application checks

Record before and after staging setup from the same network vantage point:

```bash
{
  printf 'checked_at=%s\n' "$(date --iso-8601=seconds)"
  printf 'host=app.wflyer.com.br\n'
  getent ahosts app.wflyer.com.br || true
} >"${WFLYER_EVIDENCE_DIR}/app-before-dns.txt"

curl --silent --show-error \
  --connect-timeout 10 \
  --max-time 30 \
  --dump-header "${WFLYER_EVIDENCE_DIR}/app-before.headers" \
  --output /dev/null \
  --write-out 'http_code=%{response_code}\nremote_ip=%{remote_ip}\nurl=%{url_effective}\n' \
  'https://app.wflyer.com.br/' \
  >"${WFLYER_EVIDENCE_DIR}/app-before-http.txt" || true
```

Repeat into `app-after-dns.txt`, `app-after.headers`, and
`app-after-http.txt` after the staging-only change. A pre-existing failure must
remain described as pre-existing; do not attribute it to this repository
without evidence. Never repair or mutate the separate application from this
runbook.

Also verify and record:

- HTTPS certificate and observed Napoleon redirect/routing behavior for staging;
- no Contact response is cached at either application or any observed Napoleon
  hosting layer;
- any claimed owner-approved `/api/contact` Napoleon WAF/rate rule is active
  and tested safely; otherwise record the capability as unavailable;
- Napoleon, Actions, Turnstile, and Resend logs expose no secret,
  full visitor email, contact message, or token;
- the Napoleon process uses an isolated non-administrative user when the
  provider supports it;
- CSP remains report-only until the observed staging report is separately
  reviewed;
- HSTS remains unchanged until every covered host is confirmed safe;
- apex, `www`, mail, nameservers, and `app.wflyer.com.br` remain unchanged.

## 9. Rollback exercise and owner decision

Exercise staging rollback through
`../08-operacao/03-napoleon-rollback-runbook.md` only after the first candidate
is healthy and a real prior known-good staging SHA exists. Record the current
SHA, prior SHA, operator, start/end time, actual Napoleon selector, health and
route results, restoration of the candidate SHA, duration, and any unexpected
risk. Expected data-loss risk is none because the site has no database, but the
report must record the observed result rather than assume success.

Copy results into `10-staging-homologation-report.md`. Only Davi Benucci may set
the decision to approved. Until an exact-SHA staging deployment, automated
gate, manual review, security/log inspection, rollback exercise, and owner
decision exist, keep the report status:

```text
BLOCKED — external configuration pending
```

This runbook never authorizes production.
