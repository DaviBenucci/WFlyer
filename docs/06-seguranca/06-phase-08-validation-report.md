# Phase 08 security and contact validation

**Date:** 2026-07-31
**Repository scope:** `wflyer.com.br` institutional website only
**Local result:** complete
**External enforcement:** pending staging access and owner-controlled configuration

## Implemented boundary

`POST /api/contact` is a Node.js route handler with a fixed validation order:

1. exact JSON media type;
2. declared and streamed 16 KiB limits;
3. complete server configuration;
4. exact allowed origin;
5. JSON decoding;
6. honeypot rejection;
7. strict Zod schema;
8. Turnstile verification, including `action=contact` and allowed hostname;
9. fixed-address, plain-text Resend delivery.

The public response contains only `ok` and a generic code. Responses use
`Cache-Control: no-store, max-age=0`. The application does not persist the
submission, accept attachments, render visitor HTML, or log the request body,
complete address, message, token, or secret.

The client uses native labelled controls, explicit Turnstile rendering, an
eight-second initialization fallback, token expiry/error/reset handling, query
preselection restricted to the documented enum, and recoverable validation,
provider-error, submitting, and success states. The official email remains
available when the widget or provider is unavailable.

## HTTP and content baseline

Global responses include `nosniff`, `DENY`, `same-origin` COOP, a restrictive
referrer policy, and a permissions policy. The CSP is intentionally delivered
as `Content-Security-Policy-Report-Only` for the first staging observation. It
allows only the application and Cloudflare Turnstile, contains no
`unsafe-eval`, and keeps `frame-ancestors 'none'`.

`upgrade-insecure-requests` is intentionally absent while the policy is
report-only because browsers ignore that directive in report-only mode and
emit a console error. It may be added when the enforcing policy is enabled
after the HTTPS inventory.

HSTS is intentionally absent from application responses. Enabling
`includeSubDomains` before validating every hostname could affect mail or
`app.wflyer.com.br`; it remains an external release gate.

The cookie policy now describes both `wf-theme` in `localStorage` and the
session-only brand-opening marker. No analytics, advertising pixel, replay
script, marketing cookie, behavioural profile, or consent banner was added.

## Evidence

- 239 unit/component tests cover the domain, streamed limit, configuration,
  provider construction, timeout, route mapping, client states, and source
  invariants.
- 12 Phase 08 behavioural checks pass in Chromium, Firefox, and WebKit.
- 9 Phase 08 axe executions cover idle, verified, validation error,
  submitting, success, provider error, and mobile dark reduced-motion states.
- 27 reviewed visual baselines cover nine form states in all three engines.
- Dependency audit reports zero known vulnerabilities after workspace
  overrides to `sharp@0.35.3` and `postcss@8.5.25`; peer validation is clean.
- Production build generates 22 routes, with `/api/contact` as the only new
  dynamic route. Standalone smoke covers 17 public routes and 19 assets.
- Fifteen Lighthouse runs over five representative routes scored 100 in
  Performance, Accessibility, Best Practices, and SEO. FCP was
  249.1132–262.39 ms, LCP was 638.62115–719.94585 ms, maximum CLS was
  0.0034082042, and TBT remained 0 ms.

Static inspection confirmed that production contact code has no console call,
client-side secret name, visitor HTML path, database integration, attachment,
analytics dependency, or persistence dependency. Existing
`dangerouslySetInnerHTML` uses remain limited to constant theme bootstrap code
and JSON-LD serialized with `<` escaped; neither accepts contact input.

## Accessibility and responsive review

Automated checks cover programmatic labels, required constraints, live status,
error alert, focus transfer, keyboard verification, 44 px primary controls,
consent target area, 320 px portrait, 844 × 320 landscape, dark theme, reduced
motion, final barline visibility, and horizontal overflow. Semantic inspection
confirmed that status and error text are associated through
`aria-describedby`, while native validation remains available without
JavaScript.

No physical screen-reader session or independent legal/accessibility audit was
performed locally. Those are accurately retained as homologation checks rather
than claimed as completed certifications.

## External gates

1. Create `staging` and `production` GitHub Environments and register every
   variable listed in `.env.example`; never reuse production provider secrets
   in CI tests.
2. Configure the same server-only variables in the Napoleon Node.js runtime.
   GitHub Actions Secrets do not automatically enter that process.
3. Verify the sender domain in Resend and configure environment-specific
   Turnstile site/secret keys and allowed hostnames.
4. Obtain read-only Cloudflare access and inventory DNS, mail records,
   `app.wflyer.com.br`, proxy state, certificates, WAF, cache, and existing rate
   rules before any mutation.
5. Define and approve a Cloudflare rule for `POST /api/contact`; thresholds and
   actions are owner/operations decisions and are not invented in code.
6. Observe CSP reports in staging, remove any unnecessary source, then approve
   the switch from report-only to enforcement.
7. Enable HSTS only after all covered hostnames pass HTTPS validation.
8. Configure and approve short technical-log retention in Napoleon and
   Cloudflare. The application itself emits no contact payload log.
9. Obtain professional legal review of the four public legal documents and
   owner confirmation of all missing legal identifiers before production.

Until these gates are completed, the repository may be code-complete but the
contact workflow is not externally validated or authorized for production.
