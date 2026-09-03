## Purpose

Defines a secure, accessible, mailbox-backed way for visitors to request one transactional notification when the W_Flyer application becomes available, without creating a database or marketing subscription.

## ADDED Requirements

### Requirement: Launch-interest request boundary is strict
`POST /api/app-launch-interest` MUST accept only an allowed-origin and allowed-host JSON object within the documented small byte limit with exactly `email`, `consent`, `turnstileToken`, and `honeypot`. It MUST normalize and validate the email server-side, require consent equal to true and an empty honeypot, reject unknown or user-controlled routing/content fields, and return no-store generic responses with a server-owned request ID.

#### Scenario: Valid request reaches verification
- **WHEN** an exact, bounded payload contains a valid normalized email, explicit consent, an empty honeypot, and a token from an allowed origin and host
- **THEN** the route assigns a request ID and proceeds to the dedicated Turnstile action without accepting a recipient, sender, Reply-To, subject, HTML, or arbitrary body

#### Scenario: Boundary validation fails
- **WHEN** media type, declared or streamed byte limit, JSON syntax, key set, email, consent, honeypot, origin, or host is invalid
- **THEN** the route returns the documented generic failure and request-ID header with no Turnstile or email delivery call and no sensitive echo

### Requirement: Anti-abuse checks fail closed
The endpoint SHALL validate the dedicated Turnstile action and allowed hostname with finite deadlines, apply a bounded best-effort process-local rate limit without storing raw email addresses, and preserve Contact's existing security behavior unchanged. Rate limiting MUST return a generic 429 response and a bounded `Retry-After` value.

#### Scenario: Turnstile rejects or is unavailable
- **WHEN** verification is invalid, mismatched, unavailable, or exceeds its deadline
- **THEN** the endpoint fails safely without sending either email or exposing provider details

#### Scenario: Repeated address exceeds the local limit
- **WHEN** the hashed normalized-address key exceeds its documented allowance within the local window
- **THEN** the endpoint returns 429, sends no email, and does not claim durable or cross-process enforcement

### Requirement: Operational delivery is the registration event
After all checks pass, the service MUST first send a fixed server-owned operational email to `welcome.app@wflyer.com.br` with subject `Novo interesse no lançamento da W_Flyer`, normalized email, timestamp, source, purpose, request ID, and the stable machine-readable launch-interest fields. It MUST include HTML and plain text, MUST NOT include IP, fingerprint, or geolocation, and MUST NOT send the acknowledgment if this delivery fails.

#### Scenario: Operational delivery fails
- **WHEN** the operational provider rejects, errors, or exceeds its finite deadline
- **THEN** registration fails with `DELIVERY_FAILED`, no false success is shown, and no acknowledgment is attempted

#### Scenario: Operational delivery succeeds
- **WHEN** the provider accepts the fixed operational message
- **THEN** the interest becomes registered in the operational mailbox and acknowledgment delivery begins

### Requirement: Acknowledgment is transactional and non-destructive
After operational registration, the service SHALL send a fixed pt-BR acknowledgment to the normalized visitor address with subject `Recebemos seu interesse na W_Flyer`, the approved preheader and purpose-limited copy, an optional canonical-site action, HTML and plain text. Acknowledgment failure MUST NOT undo or falsely report loss of the registered interest.

#### Scenario: Both deliveries succeed
- **WHEN** operational and acknowledgment messages are both accepted
- **THEN** the UI reports registration, confirmation delivery, and future availability notification

#### Scenario: Acknowledgment fails after registration
- **WHEN** operational delivery succeeds but acknowledgment delivery fails or times out
- **THEN** the response remains successful with an honest `acknowledgmentSent=false` outcome and the UI states that registration succeeded without claiming confirmation delivery

### Requirement: Transactional templates are fixed, compatible, and private
Both messages SHALL use one server-owned W_Flyer transactional family with warm near-black `#12100f`, ivory `#f4ecdf`, muted warm text `#c1b9ad`, and restrained copper `#e79271`. Essential layout MUST be table-based within approximately 600–640 px, critical CSS inline, readable without images, mobile-safe, and paired with plain text. Templates MUST escape all interpolated values and MUST contain no scripts, custom tracking pixels, marketing enrollment, or dependency on web layout CSS.

#### Scenario: User input contains markup-like text
- **WHEN** a syntactically valid address contains characters requiring HTML escaping
- **THEN** the HTML template renders it only as escaped text while routing, subject, surrounding markup, and plain-text structure remain server controlled

#### Scenario: Email client omits styles or images
- **WHEN** a compatible email client blocks images or ignores noncritical styles
- **THEN** sender purpose, status, address, request data, and canonical action remain readable and understandable

### Requirement: Form exposes explicit accessible states
The PRELAUNCH form MUST support `IDLE`, `VALIDATING`, `VERIFYING_TURNSTILE`, `SUBMITTING`, `SUCCESS`, `INVALID_EMAIL`, `CONSENT_REQUIRED`, `RATE_LIMITED`, `TURNSTILE_FAILED`, and `DELIVERY_FAILED`. It MUST use real labels, visible focus, keyboard operation, field/status associations, a live announcement, a Privacy Policy link, and purpose-limited explicit consent.

#### Scenario: Client validation fails
- **WHEN** a visitor submits an invalid email or omits consent
- **THEN** the form enters the corresponding explicit state, identifies the field error without color alone, focuses or announces actionable feedback, and does not request delivery

#### Scenario: Registered without acknowledgment confirmation
- **WHEN** the endpoint reports `ok=true` and `acknowledgmentSent=false`
- **THEN** the form enters SUCCESS and announces that interest is registered while confirmation delivery could not be verified

