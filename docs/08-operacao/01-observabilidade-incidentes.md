# Observability and incident response

## Privacy boundary

Observability must never capture a contact request body, full email address,
message, Turnstile token, provider key, or secret. The application intentionally
emits no contact payload log and stores no message. Provider and edge views must
use aggregate outcomes and the shortest owner-approved technical retention.

No analytics, advertising pixel, session replay, marketing cookie, or browser
profiling script is authorized.

## Minimum external signals

- institutional-site availability and server restart state;
- aggregate latency/status classes for `/api/contact`;
- aggregate Turnstile verification failures;
- aggregate Resend acceptance/failure counts;
- Napoleon WAF/rate-limit events without payloads, only if those controls are
  actually available and enabled;
- certificate, domain, and provider credential expiry;
- Core Web Vitals or synthetic Lighthouse results without visitor identity;
- report-only CSP violations after removing URLs or fields that contain
  personal data.

The exact Napoleon, Turnstile, and Resend signal sources remain an external
inventory gate. Do not add a client error/analytics SDK merely to obtain these
signals.

## Alert conditions to configure externally

- sustained institutional-site unavailability or restart loop;
- sustained 5xx increase for `/api/contact`;
- continuous Turnstile or Resend failure;
- abnormal Napoleon WAF/rate blocks after an evidenced control and baseline exist;
- certificate, domain, or provider credential approaching expiry;
- material LCP, INP, CLS, or accessibility regression in synthetic checks.

Thresholds and notification destinations are owner/operations decisions and
are not fabricated in repository code.

## Incident sequence

1. Identify affected host, revision, environment, route, start time, and scope.
2. Confirm `app.wflyer.com.br` and mail service independently before any action.
3. If Contact alone is affected, preserve the statically generated pages
   served by the standalone Node.js process and the official email fallback;
   disable only the form through a reviewed revision if required.
4. Rotate a compromised secret in its provider, GitHub Environment, and
   Napoleon runtime; never paste it into the incident record.
5. Roll back only the institutional Napoleon application to the checksummed
   previous known-good revision.
6. Run route, asset, HTTPS, header, indexing, cache, contact-fallback, app, and
   mail smoke checks.
7. Record sanitized evidence, cause, recovery revision, duration, and follow-up.
8. Revisit evidenced Napoleon WAF/rate, CSP, HSTS, retention, or provider controls when relevant.

## Contact-specific fallback

Provider or edge failure must fail closed. The visitor keeps editable context
and receives a generic response; no site-owned copy exists to replay. The
official `davi.benucci@wflyer.com.br` link is the recovery channel. Do not
automatically retry delivery in a way that can duplicate a message.

## Cache guidance

`/api/contact` is never cached. For static content incidents, use only an
observed Napoleon cache control and scoped invalidation when the provider
supports it. No cache-purge API or whole-zone control is presumed, and cache
changes must not hide a failed deployment or disturb the separate application.

The complete staging, rollback, and homologation runbook is
`docs/05-implementacao/21-staging-release-operations.md`.
