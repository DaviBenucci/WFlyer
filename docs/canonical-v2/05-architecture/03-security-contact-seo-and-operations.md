# Security, Contact, SEO, and Operations

## Retained contact controls

- `POST /api/contact` only;
- strict content type and size;
- Zod schema;
- origin/allowed-origin validation;
- honeypot;
- server-side independent Cloudflare Turnstile;
- provider WAF/rate limiting is not assumed and requires separate, observed
  Napoleon hosting capability evidence;
- Resend server-only credentials;
- no database/persistence;
- no sensitive message/token/secret logging;
- generic provider error handling;
- duplicate-submit prevention in UI.

Landing motion must never weaken Contact behavior.

## Removed institutional Application workflow

ADR-053 / `ASM-IMP-DEC-017` removed the launch-interest route, form, email
workflow, dedicated Turnstile action, and demo upload/media surface from this
institutional repository. Their predecessor contracts remain historical only.
The independent product at `app.wflyer.com.br` remains outside this site
boundary.

## SVG/media security

- no arbitrary raw SVG injection;
- no external SVG resources/scripts/events/foreignObject;
- approved local media only;
- video source types constrained;
- no user-provided upload.

## SEO

Detailed routes retain canonical metadata/structured data. Landing hashes are navigation state, not separate indexable pages. Preserve staging noindex protections and production indexing contract.

## Operations

- Registro.br delegates to Napoleon authoritative DNS;
- Napoleon provides authoritative DNS and the Next.js standalone Node runtime;
- Cloudflare DNS, proxy, and WAF are outside the active request path;
  Cloudflare Turnstile remains an independent anti-abuse provider;
- GitHub branch/exact-SHA governance retained;
- `app.wflyer.com.br` unchanged;
- no production merge/deploy without explicit owner authorization.
