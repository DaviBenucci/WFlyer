## Why

The contact provider can finish a send after the application deadline while the visitor receives a retryable error. Because every attempt currently receives a different provider idempotency key, an unchanged retry can deliver the same message twice.

## What Changes

- **BREAKING**: require the institutional contact form to send a client-generated UUID identifying one logical submission.
- Reuse that UUID as the Resend idempotency identity across unchanged retries, including retries after an application timeout.
- Start a new logical submission identity only after success or after the visitor edits a failed submission.
- Add regression tests for late provider resolution, unchanged retries, edited retries, and the exact API schema.
- Keep the finite provider deadline, generic public errors, fail-closed validation, plain-text delivery, and no-persistence boundary unchanged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `secure-contact-workflow`: define stable logical-submission identity and duplicate-safe retry behavior for provider delivery.

## Impact

- Affected code: contact payload schema, browser form serialization, Resend delivery adapter, route/domain/component tests, and contact technical documentation.
- Affected API: `POST /api/contact` gains one required non-personal UUID field named `submissionId`; the endpoint remains private to the institutional form and retains the 16 KiB limit.
- Dependencies and external systems: no new dependency or service; the existing Resend idempotency contract is used.
- Verified fact: the current timeout does not cancel the in-flight Resend promise and the current random key cannot deduplicate a retry.
- Non-goals: provider cancellation, durable server storage, visitor tracking, delivery-status polling, changes to Turnstile, or changes to `app.wflyer.com.br`.
- Rollback: revert the schema, form, adapter, tests, and synchronized spec together; there is no persisted data or infrastructure migration.
