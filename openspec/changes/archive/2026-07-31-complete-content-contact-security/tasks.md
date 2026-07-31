## 1. Contact domain and server boundary

- [x] 1.1 Add strict shared contact types, normalization, enum mapping, and 16 KiB streamed-body enforcement.
- [x] 1.2 Add server environment parsing and allowed-origin/hostname derivation without public secret exposure.
- [x] 1.3 Implement finite Turnstile verification with action and hostname checks.
- [x] 1.4 Implement fixed-header, plain-text Resend delivery with a finite deadline and no persistence.
- [x] 1.5 Implement `POST /api/contact` validation order, generic structured responses, and no-store headers.

## 2. Accessible Contact experience

- [x] 2.1 Replace the disabled shell with the complete labelled form and valid query preselection.
- [x] 2.2 Implement explicit Turnstile render, expiry/error/reset, unavailable fallback, and cleanup.
- [x] 2.3 Implement idle, verifying, submitting, success, and recoverable error states with native and ARIA semantics.
- [x] 2.4 Preserve responsive layout, theme parity, terminal barline, keyboard/touch operation, and official email fallback.

## 3. Security and content baseline

- [x] 3.1 Apply safe global headers and a build-compatible report-only CSP without unsafe-eval.
- [x] 3.2 Reconcile contact, privacy, cookie, terms, accessibility, storage, SEO, and external-link claims with runtime.
- [x] 3.3 Document HSTS, Cloudflare WAF/rate limit, provider runtime variables, logging retention, and legal review as exact external gates.
- [x] 3.4 Audit bundles and source for secrets, dangerous HTML, analytics, persistence, attachments, and unapproved integrations.

## 4. Automated and visual evidence

- [x] 4.1 Add unit tests for schema, normalization, body limits, configuration, Turnstile, email construction, and secret-safe failures.
- [x] 4.2 Add route tests for valid, malformed, wrong media type, oversize, unknown/missing fields, honeypot, origin, Turnstile timeout/rejection, Resend failure, and configuration failure.
- [x] 4.3 Add component and cross-browser tests for preselection, validation, verification, submit, success, retry, unavailable, keyboard, mobile, theme, and reduced motion.
- [x] 4.4 Capture and inspect idle, field error, verification, submitting, success, provider error, dark, mobile, and reduced-motion form states.
- [x] 4.5 Run axe on every meaningful form state and manually document focus, zoom, orientation, and screen-reader checks.

## 5. Closure

- [x] 5.1 Run dependency, lint, typecheck, unit, Storybook, E2E, visual, motion, axe, security-header, build, standalone, Lighthouse, and audit gates.
- [x] 5.2 Refresh Graphify for the API/service boundary and update the Phase 08 execution evidence.
- [x] 5.3 Strict-validate, sync, archive, and checkpoint the OpenSpec change while preserving unrelated edits.
