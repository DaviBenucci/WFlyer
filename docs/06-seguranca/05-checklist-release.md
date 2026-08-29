# Release security checklist

- **Current status:** `CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING`
- **External configuration:** pending
- **Production:** not authorized

Checked source-contract items are not a substitute for validation of the exact
current candidate. Final-current, deployed-runtime, infrastructure,
professional-review, and physical-device gates remain unchecked until their
specific evidence is recorded.

## Source security contract

- [x] `POST /api/contact` is the only contact submission method.
- [x] Method, Content-Type, payload size, origin, and Zod schema are validated.
- [x] Turnstile is verified server-side, including expected hostname and
  action.
- [x] The honeypot path exists and fails closed.
- [x] Resend uses configured fixed sender and recipient values.
- [x] Visitor input is escaped and HTML supplied by the visitor is not sent.
- [x] `/api/contact` is excluded from caching by source/header contract.
- [x] Contact source does not intentionally log messages, complete visitor
  addresses, Turnstile tokens, or secret values.
- [x] Runtime provider credentials remain server-only by source contract.
- [x] Golden and inspiration images are excluded from production packaging by
  source and release-script contract.
- [x] Workflow source does not invoke an invented Napoleon API or print
  configured values.
- [x] GitHub Environment values and Napoleon build/runtime values are documented
  as separate configuration stores; no automatic transfer is assumed.
- [x] The deployable process is the generated Node.js runtime
  `.next/standalone/server.js`, not a static document root.

## Exact current candidate

- [x] Next.js is at an approved current security patch and the final dependency
  audit is green for the exact candidate.
- [x] React and critical direct/transitive dependencies pass the final-current
  dependency and supply-chain checks.
- [x] The complete final-current unit, integration, Storybook, Playwright, axe,
  standalone, and Lighthouse sequence is green.
- [x] Final-current CSP and applicable security-header tests are green without
  `unsafe-eval`.
- [x] Final-current staging-mode metadata, `robots.txt`, and `X-Robots-Tag`
  behavior fail closed.
- [ ] Final-current source, browser/server bundles, checksummed archive, and
  closure logs are inspected without finding a credential value.
- [ ] The exact candidate manifest and archive identify the same full SHA as
  the green workflow run.
- [x] Actionlint and focused workflow tests are green for the exact candidate.

## GitHub and Napoleon configuration

- [ ] GitHub Environments `staging` and `production` exist with the required
  protections and correctly scoped values.
- [ ] The required public build value and five server-only Contact values exist
  independently in the selected Napoleon application without exposing them.
- [ ] The Napoleon source branch and built SHA match the frozen branch head,
  green CI, and release manifest.
- [ ] Napoleon builds from the selected Git revision and starts
  `node .next/standalone/server.js` as a persistent process.
- [ ] The Napoleon Node.js process runs as an isolated, non-administrative
  hosting user.
- [ ] The real injected port, optional host binding, health check, restart
  policy, and rollback selector are recorded from the actual panel.
- [ ] Real GitHub Actions and Napoleon logs are inspected without exposing
  configured values.

## Napoleon DNS/hosting and provider validation

- [ ] Davi Benucci has approved the exact staging hostname, and the actual
  Napoleon DNS/hosting target is recorded before staging work.
- [ ] A read-only Napoleon inventory covers authoritative nameservers, apex,
  `www`, mail and verification records, HTTPS, redirects, cache, and any
  provider-exposed WAF/rate controls without assuming an API or capability.
- [ ] The independent `app.wflyer.com.br` DNS and availability baseline is
  recorded and remains unchanged.
- [ ] HTTPS is valid for every covered host before any HSTS change.
- [ ] `/api/contact` is not cached by the application or any observed Napoleon
  hosting layer.
- [ ] Any Napoleon WAF/rate capability claimed for release is configured and
  verified in staging; absence remains explicit and does not weaken local controls.
- [ ] Real Turnstile success/failure and Resend delivery/failure paths are
  verified in deployed staging.
- [ ] Napoleon, Turnstile, Resend, and Actions technical logs are
  inspected under a short owner-approved retention policy.
- [ ] Deployed staging CSP is observed and separately approved before leaving
  report-only mode.

## Human and operational gates

- [ ] Legal and privacy content has professional review and owner confirmation.
- [ ] Critical journeys have a physical screen-reader and real-device review.
- [ ] Staging rollback is exercised and evidence records the prior and restored
  SHA.
- [ ] Davi Benucci records a dated staging homologation decision.
- [ ] Davi Benucci explicitly authorizes any production merge or deployment.
- [ ] An authorized production deployment receives smoke, security-header,
  Contact, independent-application, and rollback evidence.

## Status interpretation

Repository-owned final validation is complete. The unchecked items above are
remote, provider, deployed-runtime, physical-review, or owner-decision gates,
so the current state is `CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING`.
Production is not authorized, and no checked repository item broadens
permission to change Napoleon, Registro.br, Cloudflare Turnstile, DNS, or
`app.wflyer.com.br`.
