# Napoleon Node.js rollback runbook

**Current validation status:** `BLOCKED — no staging rollback exercise recorded`
**Deployment performed by this task:** `false`
**Production:** not authorized

This procedure restores only the institutional W_Flyer Next.js application by
selecting a previously verified immutable Git revision in the actual Napoleon
Node.js application controls. It never authorizes a force-push, destructive Git
reset, static `public_html` replacement, production release, Registro.br or
Napoleon DNS rewrite, invented cache purge, or any mutation of
`app.wflyer.com.br`.

The runtime entry point remains `.next/standalone/server.js`. If Napoleon cannot
run a long-lived Node.js process and offers only static document-root hosting,
stop and report provider incompatibility; static files cannot preserve deep
routes, `/api/contact`, Next.js response headers, or runtime behavior.

The canonical panel/build/runtime contract is
`../05-implementacao/22-napoleon-node-runtime-runbook.md`. Staging validation
and its factual evidence record are in
`../07-qa/09-staging-homologation-runbook.md` and
`../07-qa/10-staging-homologation-report.md`.

## 1. Authorization and triggers

Rollback may be proposed for:

- institutional-site health failure, restart loop, or material 5xx regression;
- missing/broken public route or static asset;
- security/indexing/header regression;
- a Contact failure that cannot be isolated safely while retaining the static
  site and official email fallback;
- an owner-rejected staging candidate;
- an authorized production incident, but only under separate production
  authority that does not exist in the current Phase 09 task.

Before any action, record:

| Field | Required evidence |
|---|---|
| Environment | `staging`; production requires separate explicit authority |
| Incident/change reference | Owner or operations reference |
| Napoleon application | Actual institutional application name |
| Public host | Exact affected origin |
| Current revision | Full 40-character lowercase SHA observed in Napoleon |
| Target revision | Previously deployed, known-good full SHA |
| Target source ref | Immutable commit/tag/ref actually selectable by Napoleon |
| Current and target manifests | Repository/ref/revision/checksum evidence |
| Trigger | Sanitized symptom and first-observed timestamp |
| Operator/approver | Named authorized people |
| Napoleon controls | Actual deploy, restart, health, log, and rollback field labels |
| Separate app baseline | `app.wflyer.com.br` DNS/HTTPS/application result |
| Napoleon DNS/hosting baseline | Staging record, TLS, redirect/cache controls, conditional WAF/rate, and unrelated records |

Do not use `<PREVIOUS_INSTITUTIONAL_RELEASE_SHA>` as a literal value. It is an
unresolved operational token until a real previously deployed and verified SHA
exists.

## 2. Evidence and privacy boundary

Create an ignored, operator-only evidence directory:

```bash
set -euo pipefail

export WFLYER_ROLLBACK_FROM_SHA="<current-full-40-character-sha>"
export WFLYER_ROLLBACK_TO_SHA="<previous-known-good-full-40-character-sha>"
export WFLYER_ROLLBACK_ORIGIN="https://<affected-institutional-host>"
export WFLYER_ROLLBACK_EVIDENCE_DIR="release/rollback/${WFLYER_ROLLBACK_FROM_SHA}-to-${WFLYER_ROLLBACK_TO_SHA}"

[[ "${WFLYER_ROLLBACK_FROM_SHA}" =~ ^[0-9a-f]{40}$ ]]
[[ "${WFLYER_ROLLBACK_TO_SHA}" =~ ^[0-9a-f]{40}$ ]]
test "${WFLYER_ROLLBACK_FROM_SHA}" != "${WFLYER_ROLLBACK_TO_SHA}"
[[ "${WFLYER_ROLLBACK_ORIGIN}" =~ ^https://[A-Za-z0-9.-]+(:[0-9]+)?$ ]]
install -d -m 0700 "${WFLYER_ROLLBACK_EVIDENCE_DIR}"
```

Never record environment values, secrets, tokens, cookies, authorization
headers, Contact bodies, full visitor email addresses, messages, or provider
payloads. Provider screenshots must hide environment values. Do not export an
unsanitized HAR. Application and provider logs may be retained only as
privacy-safe status/timing summaries under the owner-approved retention policy.

## 3. Validate both immutable revisions

Use a separate clean repository checkout for verification. Do not reset or
clean an unrelated worktree.

```bash
set -euo pipefail

git cat-file -e "${WFLYER_ROLLBACK_FROM_SHA}^{commit}"
git cat-file -e "${WFLYER_ROLLBACK_TO_SHA}^{commit}"

git show --no-patch \
  --format='sha=%H%nparents=%P%nauthor_date=%aI%ncommit_date=%cI%nsubject=%s' \
  "${WFLYER_ROLLBACK_FROM_SHA}" \
  >"${WFLYER_ROLLBACK_EVIDENCE_DIR}/from-revision.txt"
git show --no-patch \
  --format='sha=%H%nparents=%P%nauthor_date=%aI%ncommit_date=%cI%nsubject=%s' \
  "${WFLYER_ROLLBACK_TO_SHA}" \
  >"${WFLYER_ROLLBACK_EVIDENCE_DIR}/to-revision.txt"

git merge-base --is-ancestor \
  "${WFLYER_ROLLBACK_TO_SHA}" \
  "${WFLYER_ROLLBACK_FROM_SHA}"
```

The ancestry check is required for the normal rollback path. Stop and obtain a
specific review if the target is not an ancestor; do not assume that an
unrelated commit is known-good.

Confirm the target evidence before selecting it:

- it belongs to `DaviBenucci/WFlyer`;
- it was previously deployed and passed the appropriate environment checks;
- its manifest identifies the same environment, source ref, and revision;
- its archive SHA-256 validates when an archive exists;
- the current runtime configuration is compatible with that revision;
- no database or migration rollback is required. The institutional site has no
  database, but record the observed release scope rather than relying only on
  that expectation.

For staging branch identity, record the current remote head without moving it:

```bash
git ls-remote origin refs/heads/develop/site-institucional \
  >"${WFLYER_ROLLBACK_EVIDENCE_DIR}/remote-branch-before.txt"
```

Do not force-move `develop/site-institucional` or `main`. Prefer Napoleon's
verified immutable revision selector. If Napoleon can select only a branch,
stop and obtain owner approval for a dedicated rollback ref; do not rewrite a
shared branch as an incident shortcut.

## 4. Capture pre-rollback state

Record the actual Napoleon fields before mutation:

- application name and Node.js application type;
- repository/source connection;
- selected branch/ref and resolved full SHA;
- automatic/manual deploy behavior;
- Node version, package manager, and working directory;
- build and `node .next/standalone/server.js` start commands;
- build/runtime variable names and scopes, without values;
- port contract and health path/interval/timeout;
- process user, restart policy, log access/retention, and rollback selector;
- last successful deploy/restart time and current health state.

Capture sanitized current public behavior:

```bash
{
  printf 'checked_at=%s\n' "$(date --iso-8601=seconds)"
  printf 'host=app.wflyer.com.br\n'
  getent ahosts app.wflyer.com.br || true
} >"${WFLYER_ROLLBACK_EVIDENCE_DIR}/app-before-dns.txt"

curl --silent --show-error \
  --connect-timeout 10 \
  --max-time 30 \
  --dump-header "${WFLYER_ROLLBACK_EVIDENCE_DIR}/institutional-before.headers" \
  --output /dev/null \
  --write-out 'http_code=%{response_code}\nremote_ip=%{remote_ip}\nurl=%{url_effective}\n' \
  "${WFLYER_ROLLBACK_ORIGIN}/" \
  >"${WFLYER_ROLLBACK_EVIDENCE_DIR}/institutional-before.txt" || true

curl --silent --show-error \
  --connect-timeout 10 \
  --max-time 30 \
  --dump-header "${WFLYER_ROLLBACK_EVIDENCE_DIR}/app-before.headers" \
  --output /dev/null \
  --write-out 'http_code=%{response_code}\nremote_ip=%{remote_ip}\nurl=%{url_effective}\n' \
  'https://app.wflyer.com.br/' \
  >"${WFLYER_ROLLBACK_EVIDENCE_DIR}/app-before.txt" || true
```

Inventory, without changing, the staging DNS record, apex, `www`, app, MX,
SPF, DKIM, DMARC, Registro.br delegation, Napoleon authoritative nameservers,
HTTPS certificates, actual redirect/cache controls, and any evidenced WAF/rate
rules. A source rollback should require no DNS mutation.

## 5. Execute through the actual Napoleon Node.js control

The operator must transcribe the actual panel labels and selected values. This
repository does not invent a Napoleon API, token, SSH command, webhook, port,
or rollback endpoint.

1. Prevent a concurrent automatic deploy using the observed provider control.
   If no safe control exists, stop rather than race a mutable branch.
2. Select `WFLYER_ROLLBACK_TO_SHA` through the verified immutable rollback or
   Git revision selector.
3. Confirm the source remains `git@github.com:DaviBenucci/WFlyer.git` and that
   the panel resolves exactly the target full SHA.
4. Preserve the environment's existing build/runtime value names and scopes.
   Do not copy values into the report or substitute staging/production values.
5. Build from the repository root with the approved Node.js 24/Corepack/pnpm
   contract. Do not upload or serve a static `public_html` replacement.
6. Start `node .next/standalone/server.js` with Napoleon's actual `PORT` and
   required `HOSTNAME` contract.
7. Restart only the institutional Node.js application.
8. Wait for the actual `/` health-check success definition. Record timestamps,
   status, and sanitized log outcome.
9. If the selected SHA, build, process, or health evidence differs from the
   intended target, stop and follow the rollback-failure path below.

No production action is authorized by these instructions. A production
rollback requires an independently authorized incident decision and a
previously authorized production target.

## 6. Post-rollback verification

Run public checks against the restored institutional origin:

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
  status="$(
    curl --silent --show-error \
      --connect-timeout 10 \
      --max-time 30 \
      --output /dev/null \
      --write-out '%{response_code}' \
      "${WFLYER_ROLLBACK_ORIGIN}${route}"
  )"
  test "${status}" = '200'
done

unknown_status="$(
  curl --silent --show-error \
    --output "${WFLYER_ROLLBACK_EVIDENCE_DIR}/unknown-after.html" \
    --write-out '%{response_code}' \
    "${WFLYER_ROLLBACK_ORIGIN}/rota-publica-inexistente"
)"
test "${unknown_status}" = '404'

curl --silent --show-error --fail-with-body \
  --dump-header "${WFLYER_ROLLBACK_EVIDENCE_DIR}/home-after.headers" \
  --output /dev/null \
  "${WFLYER_ROLLBACK_ORIGIN}/"
curl --silent --show-error --fail-with-body \
  --output "${WFLYER_ROLLBACK_EVIDENCE_DIR}/robots-after.txt" \
  "${WFLYER_ROLLBACK_ORIGIN}/robots.txt"
curl --silent --show-error --fail-with-body \
  --output /dev/null \
  "${WFLYER_ROLLBACK_ORIGIN}/icon.svg"

contact_status="$(
  curl --silent --show-error \
    --request POST \
    --header 'Content-Type: text/plain' \
    --data '{}' \
    --dump-header "${WFLYER_ROLLBACK_EVIDENCE_DIR}/contact-after.headers" \
    --output "${WFLYER_ROLLBACK_EVIDENCE_DIR}/contact-after.json" \
    --write-out '%{response_code}' \
    "${WFLYER_ROLLBACK_ORIGIN}/api/contact"
)"
test "${contact_status}" = '415'
grep -Eiq '^cache-control:[[:space:]]*no-store, max-age=0[[:space:]]*$' \
  "${WFLYER_ROLLBACK_EVIDENCE_DIR}/contact-after.headers"
```

For staging, run the public suite from a clean checkout of the restored SHA:

```bash
PLAYWRIGHT_BASE_URL="${WFLYER_ROLLBACK_ORIGIN}" pnpm test:staging
```

Then verify manually:

- navigation, Back/Forward, deep links, theme, intro, reduced motion, tablet,
  Contact validation, and official email fallback;
- no development runtime or unexpected console error;
- expected security/indexing headers and CSP mode;
- no Contact cache and no sensitive log content;
- health/restart stability for the actual observation window;
- only affected institutional URLs are invalidated if Napoleon exposes an
  approved scoped cache control; no purge API is assumed.

Repeat the `app.wflyer.com.br` DNS/HTTPS/application observations into
`app-after-*` evidence files. Confirm that app, apex, `www`, authoritative
nameservers, and mail records are unchanged. Never invent or use a broad cache
purge to hide a failed rollback.

## 7. Staging rollback exercise

Homologation requires a reversible staging exercise when a prior known-good
staging revision exists:

1. record the healthy candidate SHA;
2. select the prior known-good staging SHA;
3. verify health, routes, headers, indexing, and Contact fallback;
4. reselect the candidate SHA through the same verified Node.js control;
5. verify candidate health and public behavior again;
6. record both transitions, operator, timestamps, duration, actual selector,
   sanitized evidence, and observed data-loss risk.

Expected data-loss risk is none because the institutional site has no database.
The report must nevertheless record what was observed. If no prior deployed
staging revision exists, leave the exercise `BLOCKED`; do not fabricate one.

## 8. Rollback failure and Contact-only incidents

If the target build or health check fails:

1. do not change Registro.br delegation, Napoleon DNS/HTTPS controls, or the
   separate application as an improvisation;
2. retain or reselect the last actually healthy institutional revision using
   the verified provider control;
3. capture sanitized build/process/health evidence;
4. escalate with exact current/target SHAs and actual provider field names;
5. keep production unauthorized unless separate incident authority exists.

If Contact alone is failing, preserve the static pages and public official
email fallback. A form-disable change requires a reviewed source revision; do
not expose secrets, loosen origin checks, bypass Turnstile, cache the endpoint,
or automatically retry delivery in a way that may duplicate a message.

## 9. Closure record

Record these fields in the staging homologation report or incident record:

```text
Environment:
Incident/change reference:
Napoleon application:
Institutional origin:
Operator:
Approver:
Start timestamp:
End timestamp:
Duration:
Trigger:
From SHA:
To SHA:
From manifest/checksum:
To manifest/checksum:
Actual Napoleon rollback selector:
Build/start/port/health contract observed:
Route and asset results:
Header/indexing results:
Contact fallback result:
Security/log review:
Registro.br/Napoleon DNS changed: no | exact approved staging-only change
app.wflyer.com.br before/after:
Mail records before/after:
Candidate restored after exercise:
Observed data-loss risk:
Open follow-up:
Evidence location:
Owner decision:
```

Rollback is not validated until the staging exercise and evidence are complete.
This document does not authorize production.
