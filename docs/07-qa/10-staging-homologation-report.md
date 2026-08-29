# Staging homologation report

**Status:** `BLOCKED — external configuration pending`
**Deployment performed:** `false`
**Production authorized:** `false`
**Owner:** Davi Benucci
**Owner decision:** `PENDING — only Davi Benucci may approve homologation`
**Decision timestamp:** `PENDING`

This is the current factual Phase 09 staging record. It is intentionally
blocked because no Napoleon panel inventory, owner-approved staging origin,
exact-SHA staging deployment, deployed-origin test evidence, real provider
validation, rollback exercise, or owner homologation decision has been
recorded here. Repository-local or GitHub candidate evidence must not be
represented as deployment evidence.

Execution procedures are `09-staging-homologation-runbook.md` and
`../08-operacao/03-napoleon-rollback-runbook.md`. The canonical Napoleon
contract is `../05-implementacao/22-napoleon-node-runtime-runbook.md`.

## Required homologation record

| Field | Current factual value |
|---|---|
| Status | `BLOCKED — external configuration pending` |
| Staging URL | `PENDING — owner-approved deployed HTTPS origin not supplied` |
| Repository | `DaviBenucci/WFlyer` |
| Branch | `develop/site-institucional` |
| Exact deployed SHA | `NOT AVAILABLE — deployment not performed` |
| Green CI run | `PENDING — exact successful run ID, URL, attempt, head SHA, and job results not recorded in this report` |
| Candidate workflow run | `PENDING — Prepare Napoleon release staging run not recorded in this report` |
| Candidate checksum | `PENDING — verified 64-character SHA-256 not recorded in this report` |
| Napoleon application name | `PENDING — Napoleon panel access required` |
| Napoleon runtime/build/start contract | `PENDING — actual panel fields not inspected; expected architecture is a Node.js process running .next/standalone/server.js, never static hosting` |
| Napoleon DNS record changed | `No change performed or evidenced by this repository-owned preparation; staging-only inventory/change remains pending` |
| `app.wflyer.com.br` before/after result | `PENDING — independent DNS, HTTPS, and application checks not recorded` |
| Automated test results | `PENDING — PLAYWRIGHT_BASE_URL=<approved-staging-origin> pnpm test:staging cannot run before deployment` |
| Manual device/browser results | `NOT PERFORMED` |
| Contact delivery evidence without personal message content | `NOT PERFORMED` |
| Security/log review | `NOT PERFORMED` |
| Rollback evidence | `NOT PERFORMED — no prior deployed staging revision is recorded` |
| Open defects | External blockers listed below; no deployed-staging defect classification is possible yet |
| Owner decision | `PENDING` |
| Owner | Davi Benucci |
| Decision timestamp | `PENDING` |

## Candidate and workflow evidence

Do not complete this section until the ordinary CI and manual candidate runs
identify the same full SHA.

| Evidence field | Recorded value |
|---|---|
| Branch-head full SHA | `Resolve with git rev-parse HEAD after the forward-only closure commit and record in external CI/handoff evidence; this containing report does not self-embed its own commit. Prior published checkpoint: 065a077f9425943af8bc3ea821660bb356aef1da` |
| Ordinary CI workflow name | `CI` |
| Ordinary CI run ID | `31118939281 — failed before runner execution; not final green evidence` |
| Ordinary CI run attempt | `1` |
| Ordinary CI run URL | `https://github.com/DaviBenucci/WFlyer/actions/runs/31118939281` |
| Ordinary CI head SHA | `065a077f9425943af8bc3ea821660bb356aef1da` |
| Ordinary CI job results | `4/4 jobs did not start; runner and step lists are empty and the recorded annotation reports a GitHub billing account lock` |
| Candidate workflow name | `Prepare Napoleon release` |
| Selected environment | `staging` |
| Selected ref | `develop/site-institucional` |
| Production confirmation | empty |
| Candidate run ID | `NOT AVAILABLE — the workflow is not yet present on main; the infrastructure-only bootstrap branch awaits owner PR review and merge` |
| Candidate run attempt | `PENDING` |
| Candidate run URL | `PENDING` |
| Resolved full SHA | `PENDING` |
| Package artifact name | `PENDING — expected format wflyer-staging-<sha>-attempt-<attempt>` |
| Candidate browser artifact | `PENDING — expected format candidate-browser-staging-<sha>-attempt-<attempt>` |
| Archive name | `PENDING — expected format wflyer-standalone-staging-<sha>.tar.gz` |
| SHA-256 file | `PENDING` |
| Verified archive SHA-256 | `PENDING` |
| Manifest name | `PENDING — expected format wflyer-release-staging-<sha>.json` |
| Manifest repository/environment/ref/revision | `PENDING` |
| Manifest deployment record | Expected `deployment.performed=false`; actual manifest not recorded |
| SHA equality: branch = CI = candidate = manifest = Napoleon | `NOT VERIFIED` |

## Napoleon panel inventory

Do not copy secret values into this table. Record names, scopes, formats, and
presence only.

| Actual panel field | Recorded value |
|---|---|
| Application type | `PENDING — must support a long-running Node.js process` |
| Application/source connection | `PENDING` |
| Repository | `PENDING — expected git@github.com:DaviBenucci/WFlyer.git` |
| Selected branch | `PENDING — expected develop/site-institucional` |
| Resolved selected SHA | `PENDING` |
| Automatic/manual deployment behavior | `PENDING` |
| Node version | `PENDING — expected 24.x` |
| Package manager/Corepack behavior | `PENDING — expected pnpm 11.24.0 through Corepack` |
| Working directory | `PENDING — expected repository root` |
| Build command | `PENDING` |
| Runtime entry/start command | `PENDING — must execute node .next/standalone/server.js` |
| Build-time variable scope | `PENDING` |
| Runtime variable scope | `PENDING` |
| Port contract and value format | `PENDING — never invent PORT` |
| Health path/interval/timeout | `PENDING — baseline path is /, actual control unverified` |
| Process user | `PENDING` |
| Restart policy | `PENDING` |
| Log access and retention | `PENDING` |
| Rollback selector | `PENDING` |
| Panel operator | `PENDING` |
| Panel inventory timestamp | `PENDING` |

Required names whose values must remain outside this report:

| Name | Expected scope | Presence verified |
|---|---|---|
| `WFLYER_DEPLOYMENT_ENVIRONMENT` | build, value `staging` | `PENDING` |
| `WFLYER_BUILD_ID` | build, derived from selected full SHA | `PENDING` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | build, public staging key | `PENDING` |
| `TURNSTILE_SECRET_KEY` | server runtime only | `PENDING` |
| `RESEND_API_KEY` | server runtime only | `PENDING` |
| `CONTACT_FROM_EMAIL` | server runtime configuration | `PENDING` |
| `CONTACT_RECIPIENT_EMAIL` | server runtime configuration; expected `davi.benucci@wflyer.com.br` | `PENDING` |
| `CONTACT_ALLOWED_ORIGINS` | server runtime configuration; exact staging origin only | `PENDING` |
| `NODE_ENV` | runtime, value `production` | `PENDING` |
| `HOSTNAME` | runtime only if required by Napoleon | `PENDING` |
| `PORT` | actual Napoleon port contract | `PENDING` |

## Napoleon DNS/hosting and separate application evidence

No Napoleon DNS/hosting mutation is authorized until the exact target and an
owner-approved staging hostname are known.

| Evidence | Before | Approved change | After |
|---|---|---|---|
| Registro.br delegation and Napoleon authoritative nameservers | `PENDING` | Staging-only; no delegation change | `PENDING` |
| Apex record | `PENDING` | No change | `PENDING` |
| `www` record | `PENDING` | No change | `PENDING` |
| Staging record name/type/target/TTL | `PENDING` | `PENDING — owner approval required` | `PENDING` |
| `app.wflyer.com.br` record | `PENDING` | No change | `PENDING` |
| MX/SPF/DKIM/DMARC | `PENDING` | No change | `PENDING` |
| Napoleon HTTPS/certificate coverage | `PENDING` | No unrelated change | `PENDING` |
| HSTS | `PENDING` | No enablement/broadening in this task | `PENDING` |
| CSP | Repository policy is report-only | Remain report-only pending deployed review | `PENDING` |
| `/api/contact` cache behavior | `PENDING` | Must remain uncached | `PENDING` |
| Napoleon `/api/contact` WAF/rate capability | `PENDING` | Owner-approved staging rule if available; no fabricated threshold | `PENDING` |
| `app.wflyer.com.br` DNS result | `PENDING` | Observe only | `PENDING` |
| `app.wflyer.com.br` HTTPS/application result | `PENDING` | Observe only | `PENDING` |

## Automated staging evidence

| Gate | Result | Evidence |
|---|---|---|
| All 17 public routes return 200 | `NOT RUN` | `PENDING` |
| Unknown route returns custom HTTP 404 | `NOT RUN` | `PENDING` |
| `/api/contact` rejects GET | `NOT RUN` | `PENDING` |
| `/api/contact` rejects invalid media/payload and is uncached | `NOT RUN` | `PENDING` |
| Public static assets return without 404 | `NOT RUN` | `PENDING` |
| Node.js security headers are present | `NOT RUN` | `PENDING` |
| `X-Robots-Tag` exact staging policy | `NOT RUN` | `PENDING` |
| `robots.txt` disallows all and omits sitemap declaration | `NOT RUN` | `PENDING` |
| CSP remains report-only | `NOT RUN` | `PENDING` |
| `pnpm test:staging` | `NOT RUN` | Requires exact deployed HTTPS origin |

Exact future command:

```bash
PLAYWRIGHT_BASE_URL="https://<owner-approved-staging-host>" pnpm test:staging
```

## Manual homologation evidence

| Journey/review | Result | Operator/device/evidence |
|---|---|---|
| First-session intro natural completion | `NOT PERFORMED` | `PENDING` |
| Skip, Escape, no replay, and scroll cleanup | `NOT PERFORMED` | `PENDING` |
| Application and institutional navigation | `NOT PERFORMED` | `PENDING` |
| Back/Forward, refresh, and deep links | `NOT PERFORMED` | `PENDING` |
| Light/dark theme | `NOT PERFORMED` | `PENDING` |
| Tablet mouse/keyboard/touch and reduced motion | `NOT PERFORMED` | `PENDING` |
| Desktop light/dark against approved references | `NOT PERFORMED` | `PENDING` |
| Mobile light/dark on a real device | `NOT PERFORMED` | `PENDING` |
| Keyboard-only operation | `NOT PERFORMED` | `PENDING` |
| Physical screen-reader review | `NOT PERFORMED` | `PENDING` |
| Contact validation and Turnstile lifecycle | `NOT PERFORMED` | `PENDING` |
| One safe real Resend delivery | `NOT PERFORMED` | Record no personal message content |
| Generic provider failure and email fallback | `NOT PERFORMED` | `PENDING` |
| Browser Console/Network review | `NOT PERFORMED` | No unsanitized HAR allowed |

## Security, logs, and operations

| Check | Result | Evidence |
|---|---|---|
| No secret, token, complete visitor email, or message in logs | `NOT PERFORMED` | `PENDING` |
| Contact endpoint not cached at application or Napoleon hosting layer | `NOT PERFORMED` | `PENDING` |
| Napoleon staging WAF/rate capability recorded and safely tested if available | `NOT PERFORMED` | `PENDING` |
| HTTPS/redirect behavior correct | `NOT PERFORMED` | `PENDING` |
| Napoleon process isolated/non-administrative where supported | `NOT PERFORMED` | `PENDING` |
| CSP report-only observations reviewed | `NOT PERFORMED` | `PENDING` |
| HSTS unchanged pending complete host validation | `NOT PERFORMED` | `PENDING` |
| Apex, `www`, mail, nameservers, and app preserved | `NOT PERFORMED` | `PENDING` |

## Rollback evidence

| Field | Recorded value |
|---|---|
| Current staging SHA before exercise | `PENDING` |
| Previous known-good staging SHA | `PENDING — no prior deployed staging revision recorded` |
| Actual Napoleon rollback selector | `PENDING` |
| Rollback operator | `PENDING` |
| Exercise start/end/duration | `PENDING` |
| Prior revision health/routes | `NOT PERFORMED` |
| Candidate redeployed | `NOT PERFORMED` |
| Candidate health after restoration | `NOT PERFORMED` |
| `app.wflyer.com.br` before/after | `NOT PERFORMED` |
| DNS/mail records preserved | `NOT PERFORMED` |
| Observed data-loss risk | `PENDING — expected none, but not exercised` |
| Evidence location | `PENDING` |

## Open external blockers

1. GitHub billing must be resolved so Actions jobs can acquire a runner. After
   resolution, rerun or push the exact final branch-head SHA and require every
   ordinary CI job to pass; run `31118939281` is not reusable as green proof.
2. The owner must open and review the infrastructure-only bootstrap PR from
   `ci/napoleon-release-workflow-bootstrap`, then merge it to `main` without
   changing the placeholder application. The connected GitHub App received
   `403 Resource not accessible by integration` when attempting to create the
   draft PR.
3. GitHub Environments `staging` and `production`, their branch/reviewer
   policies, and required values need owner-authorized configuration.
4. The exact ordinary CI and staging candidate workflow runs must pass for one
   identical full SHA.
5. Napoleon panel access is required to prove Node.js capability and record
   every source/build/start/scope/port/health/user/log/restart/rollback field.
6. Staging-specific Turnstile and Resend values must be configured in the
   correct Napoleon scopes without entering this report.
7. The owner must approve a separate staging hostname after the exact Napoleon
   target is known.
8. Napoleon authoritative DNS/hosting inventory and any staging-only
   DNS/rate-rule change require provider access and approval.
9. Independent `app.wflyer.com.br` DNS, HTTPS, and application baselines must be
   recorded before and after the staging-only change.
10. Deployed automated, manual browser/device, physical screen-reader, Contact,
   security/log, and rollback evidence does not yet exist.
11. Davi Benucci's human homologation decision is pending.

## Owner decision

```text
Owner: Davi Benucci
Decision: PENDING
Decision timestamp: PENDING
Exact approved staging SHA: PENDING
Exact approved candidate manifest: PENDING
Production authorization: false
```

This report must remain blocked until external evidence is entered. Repository
authors and automated agents must not convert `PENDING` or `NOT PERFORMED` into
success. No production deployment, production workflow dispatch, `main` merge,
production tag, apex DNS change, or modification to `app.wflyer.com.br` is
authorized by this report.
