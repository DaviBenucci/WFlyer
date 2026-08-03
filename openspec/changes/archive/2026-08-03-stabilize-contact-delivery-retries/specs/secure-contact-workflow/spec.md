## MODIFIED Requirements

### Requirement: Strict request boundary
`POST /api/contact` MUST accept only an allowed-origin JSON object at most 16 KiB with the exact documented keys, including a valid UUID that identifies one logical submission, an empty honeypot, bounded plain-text values, a valid project enum, and privacy consent equal to true.

#### Scenario: Request is not trustworthy
- **WHEN** media type, byte limit, origin, JSON syntax, keys, logical-submission UUID, honeypot, or field validation fails
- **THEN** the route rejects it with the documented status class, a generic structured error, no provider call, and `Cache-Control: no-store`

### Requirement: Verified and private delivery
The route MUST validate Turnstile server-side with a finite deadline, hostname and `contact` action checks, then send one plain-text Resend email using only server-controlled sender, recipient, and enumerated subject values without persistence or sensitive logs. The same logical submission MUST use one stable provider idempotency identity across unchanged retries so that a send that resolves after the application deadline cannot be duplicated by the retry.

#### Scenario: Providers accept the message
- **WHEN** the strict payload and Turnstile response are valid and Resend accepts the email
- **THEN** the route returns a generic success without provider identifiers and stores no site-owned copy

#### Scenario: A provider fails or times out
- **WHEN** Turnstile or Resend is unavailable, rejects, or exceeds its deadline
- **THEN** the route fails closed with a generic retry response and does not expose tokens, addresses, bodies, secrets, stack details, or provider payloads

#### Scenario: Visitor retries an unchanged timed-out submission
- **WHEN** a Resend request may still complete after the application deadline and the visitor retries without editing the failed submission
- **THEN** the retry uses the same logical-submission identity and provider idempotency identity, preventing a second delivery within the provider idempotency window

#### Scenario: Visitor changes a failed submission
- **WHEN** the visitor edits any field after a failed attempt and submits again
- **THEN** the form creates a new logical-submission identity for the changed message while retaining the same validation, verification, privacy, and deadline controls
