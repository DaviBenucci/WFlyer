## Why

The Contact chapter is still a disabled visual shell even though the approved stack, payload contract, privacy copy, and release environment are already defined. Phase 08 must enable that workflow without persistence or secret exposure and close the locally enforceable security/content baseline before release QA.

## What Changes

- Replace the disabled Contact shell with an accessible client form and explicit Cloudflare Turnstile lifecycle.
- Add the Node.js-only `POST /api/contact` boundary with byte, media-type, origin, honeypot, strict Zod, Turnstile, and Resend controls.
- Add generic no-store responses, upstream deadlines, plain-text email construction, and privacy-safe operational behavior.
- Apply the locally safe security headers and a report-only CSP compatible with the approved runtime; keep HSTS, Cloudflare WAF, and edge rate limits gated on external inventory.
- Reconcile public content, legal disclosures, cookies/storage, SEO, environment documentation, and tests with the implemented behavior.

## Capabilities

### New Capabilities

- `secure-contact-workflow`: Accessible form states and a fail-closed server contact boundary with Turnstile and Resend.
- `public-security-content-baseline`: Enforced local headers plus factually accurate public, legal, cookie, and environment contracts.

### Modified Capabilities

None.

## Impact

The change affects the Contact chapter, a new App Router API route, server-only contact modules, global HTTP headers, local Portuguese legal content, environment documentation, tests, CI evidence, and the standalone runtime. It does not add persistence, analytics, attachments, visitor HTML, application-domain behavior, Cloudflare mutations, Napoleon deployment, or production secrets. Rollback restores the existing email-only Contact shell and removes the API/security modules while leaving every static route available.
