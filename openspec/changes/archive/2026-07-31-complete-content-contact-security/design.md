## Context

Contact is the only dynamic institutional route. The repository already pins Zod and Resend, defines a 16 KiB JSON contract, lists official origins and mail addresses, and documents Turnstile Siteverify. The visual Contact archetype and Portuguese legal pages already exist but currently describe a workflow that the disabled shell cannot perform.

## Goals / Non-Goals

**Goals:**

- Keep all public pages static while isolating runtime work in `POST /api/contact`.
- Reject malformed or untrusted input before any provider call.
- Keep visitor content out of HTML, storage, logs, response details, and mail headers.
- Make idle, verification, submitting, success, recoverable error, unavailable, and reduced/mobile form states accessible.
- Enforce headers that are safe locally and make external-only controls explicit.

**Non-Goals:**

- No database, queue, attachment, analytics, marketing cookie, general CORS API, application-domain integration, or client-side Resend call.
- No Cloudflare/DNS mutation, HSTS activation, or real mail delivery without the external Phase 09 gates.

## Decisions

### Strict validation pipeline

The route checks JSON media type, declared and streamed byte length, exact allowed Origin, parseability, honeypot, and a `z.strictObject` schema in that order. It normalizes bounded plain text and rejects HTML-like input and control characters. Unknown keys fail rather than being stripped.

### Server-only provider boundary

Turnstile receives only its secret, the submitted token, an optional edge-provided IP, and an idempotency UUID. The result must be successful with `action=contact` and a hostname derived from the configured allowed origins. Resend receives fixed server from/to values, a normalized enumerated subject, validated reply-to, and plain text only. Provider work has finite deadlines and produces generic public responses.

### Client state and progressive failure

The form is a focused Client Component inside the static Contact page. The Turnstile script is loaded only there, explicitly renders with `action=contact`, and is removed on teardown. A missing public site key disables submission while preserving the official email path. Native fields, visible instructions, `aria-busy`, a polite status region, and server-generic recovery keep the flow operable without exposing internals.

### Security headers by deployment maturity

Next.js applies nosniff, deny framing, strict referrer, same-origin opener, permissions policy, and a report-only CSP derived from the real bundle and Turnstile requirements. HSTS remains withheld until the required read-only inventory proves every subdomain, mail route, and `app.wflyer.com.br` safe. Cloudflare WAF/rate limiting remain documented external controls.

### Content truthfulness

Legal and cookie copy describe only actual theme localStorage, the per-tab opening marker, Turnstile/Cloudflare/Napoleon technical processing, Resend delivery, and lack of analytics or persistence. Technical completion does not claim legal review.

## Risks / Trade-offs

- Report-only CSP detects violations but does not yet block them; enforcement moves to staging after evidence.
- Without edge access, repository tests cannot prove WAF or rate-limit activation.
- Resend has no site-owned queue; a provider failure requires a visitor retry.
- Turnstile is a third-party availability dependency, so the email link remains the non-form fallback.

## Migration / Rollback

Configure public variables at build time and all server variables in the Napoleon runtime. Test with provider mocks locally, then with separate staging credentials. Rollback removes the form/API and restores the email-only shell; Cloudflare and `app.wflyer.com.br` are unaffected because this phase performs no external mutation.
