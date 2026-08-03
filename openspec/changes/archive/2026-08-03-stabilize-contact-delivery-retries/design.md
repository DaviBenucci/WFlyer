## Context

See `proposal.md` for the defect. The current route imposes an eight-second application deadline around Resend, but the provider SDK exposes no documented request-cancellation contract. The existing adapter generates a new random idempotency key inside every send call, so the browser has no way to identify a retry as the same logical submission. The endpoint remains a no-persistence, strict JSON boundary governed by `docs/05-implementacao/04-formulario-contato.md` and `docs/06-seguranca/01-modelo-ameacas.md`.

## Goals / Non-Goals

**Goals:**

- Deduplicate an unchanged retry even when the first provider request resolves after the application deadline.
- Keep the identity non-personal, bounded, validated, and ephemeral in the browser.
- Preserve finite deadlines, generic responses, exact-key validation, and the existing no-storage/no-sensitive-log boundary.
- Cover browser identity lifecycle, API validation, and provider adapter behavior with regression tests.

**Non-Goals:**

- Cancelling an in-flight provider request without a documented SDK contract.
- Persisting submissions or provider state.
- Treating the client identifier as authentication, replay protection, rate limiting, or proof of uniqueness.
- Changing Turnstile or the production activation boundary.

## Decisions

### Carry one browser-generated UUID in the strict payload

The form creates a UUID with the browser Web Crypto API only when it begins a logical submission. Zod requires the UUID as `submissionId`; the server treats it as untrusted data and uses it only after the complete request and Turnstile checks pass.

Alternatives considered:

- A server-generated random key cannot survive a client retry because the site intentionally persists no submission state.
- A deterministic hash of personal payload fields would either leak a stable fingerprint or require a server secret and could suppress two legitimate identical messages.
- Removing the application deadline would make request duration depend entirely on the provider and would weaken the existing failure boundary.

### Tie identity lifetime to observable visitor intent

An unchanged retry after an error reuses the UUID. A successful response clears it. Editing a failed form clears it before the next attempt, because changed content is a new logical submission and provider idempotency keys must not be reused for different payloads.

### Derive the provider key directly from the validated UUID

The adapter uses `contact/<submissionId>`, which remains far below the provider's 256-character key limit. The same logical request therefore reaches Resend with the same key during its documented 24-hour idempotency window. The key is never logged or returned.

## Risks / Trade-offs

- [The provider idempotency window is finite] → The protection covers normal immediate retries; documentation must not claim indefinite deduplication.
- [A hostile client can reuse a UUID for different payloads] → Exact validation and Turnstile still apply, and provider rejection fails closed; the UUID grants no authority.
- [A visitor edits only after the first send actually succeeds late] → That is intentionally treated as a new message because the content or intent changed; no local system can know the late provider result without persistence or provider polling.
- [Older custom callers omit the new field] → They receive the existing generic invalid-request response; the institutional form is updated atomically with the endpoint contract.

## Migration Plan

1. Update the browser form, schema, adapter, tests, canonical spec, and technical documentation in one release candidate.
2. Verify unchanged retry identity and provider keys with deterministic component/domain tests; verify exact-key rejection at the route.
3. Deploy only through the existing staging and human-approval boundary.
4. Roll back all contract changes together if needed; no data or infrastructure migration exists.
