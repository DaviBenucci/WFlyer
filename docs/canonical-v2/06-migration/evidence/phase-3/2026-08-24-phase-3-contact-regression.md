# Phase 3 Contact regression — 2026-08-24

## Preserved implementation boundary

Phase 3 changed the public Contact introduction and reused the centralized
project-type values. It did not change the Contact Route Handler, Zod schema,
origin/content-type/body-size controls, honeypot, Turnstile verification,
Resend provider adapter, in-memory submission coordination, secret handling,
or form state machine.

Cloudflare remains the external rate-limiting/security boundary. No live
provider-delivery or Cloudflare claim is made by this local gate.

## Executed coverage

The 561-test unit/component run includes Contact domain, Route Handler, and
form tests for invalid input, denied origin/media, Turnstile failure, provider
failure, private submission identity, retry coordination, duplicate actions,
input preservation, and success state.

Three-engine Playwright Contact coverage (15/15 registrations within the
120-test browser run) passed:

- query-driven project type, keyboard verification, finite submit, mocked
  success, and UUID submission identity;
- provider failure followed by an unchanged retry reusing one private logical
  submission identity;
- native field validation and recoverable provider failure with preserved
  input/focus;
- 320px dark reduced-motion layout, control sizes, focus, and no overflow;
- security headers, CSP policy, and HTTP 405 for unsupported GET.

Contact accessibility coverage (9/9 registrations within the 75-test axe run)
passed idle, validation, verification, submitting, success, provider-error,
and mobile dark reduced-motion states in Chromium, Firefox, and WebKit.

Success/provider behavior was exercised with local deterministic mocks. This
does not claim real provider delivery or staging validation.
