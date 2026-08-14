# Security, Contact, SEO, and Operations

## Retained contact controls

- `POST /api/contact` only;
- strict content type and size;
- Zod schema;
- origin/allowed-origin validation;
- honeypot;
- server-side Turnstile;
- Cloudflare WAF/rate limiting;
- Resend server-only credentials;
- no database/persistence;
- no sensitive message/token/secret logging;
- generic provider error handling;
- duplicate-submit prevention in UI.

Landing motion must never weaken Contact behavior.

## SVG/media security

- no arbitrary raw SVG injection;
- no external SVG resources/scripts/events/foreignObject;
- approved local media only;
- video source types constrained;
- no user-provided upload in demo.

## SEO

Detailed routes retain canonical metadata/structured data. Landing hashes are navigation state, not separate indexable pages. Preserve staging noindex protections and production indexing contract.

## Operations

- Next.js standalone Node runtime on Napoleon;
- Cloudflare remains existing DNS/proxy/security boundary;
- GitHub branch/exact-SHA governance retained;
- `app.wflyer.com.br` unchanged;
- no production merge/deploy without explicit owner authorization.
