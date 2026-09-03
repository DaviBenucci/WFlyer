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

## Application launch-interest workflow

- Dedicated `POST /api/app-launch-interest`; `/api/contact` is not overloaded.
- Exact user-controlled JSON keys only: `email`, `consent`,
  `turnstileToken`, and `honeypot`; no recipient, sender, Reply-To, subject,
  HTML, or arbitrary message body.
- Server-side normalization/validation, explicit consent, empty honeypot,
  exact allowed origin and host, 4 KiB streamed/declared body limit, dedicated
  Turnstile action/hostname, generic no-store errors, and server request ID.
- Bounded process-local rate/deduplication state uses only a hash of the
  normalized address and is explicitly best-effort: it resets on restart and
  is neither durable nor cross-process enforcement. Turnstile and provider
  idempotency remain independent layers.
- The operational registration email is sent first to fixed recipient
  `welcome.app@wflyer.com.br` and owns the canonical registration event. It
  contains normalized email, timestamp, source, purpose, request ID, and stable
  `W_FLYER_LAUNCH_INTEREST` machine fields, but no IP, fingerprint, or
  geolocation.
- Only after operational acceptance does the server attempt a fixed pt-BR
  transactional acknowledgment. Acknowledgment failure does not discard the
  registration and is reported honestly without provider details.
- Both fixed templates have escaped interpolation, table-based warm-neutral
  HTML, plain-text alternatives, no scripts or custom tracking pixels, and no
  unrelated marketing consent. Repository code does not enable tracking;
  actual Resend domain tracking configuration remains external evidence.
- The mailbox is the current operational record. No database, CMS,
  authentication, Redis/KV, mailing-list automation, or new release secret is
  introduced.

## SVG/media security

- no arbitrary raw SVG injection;
- no external SVG resources/scripts/events/foreignObject;
- approved local media only;
- video source types constrained;
- no user-provided upload in demo.

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
