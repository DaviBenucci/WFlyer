# secure-contact-workflow Specification

## Purpose
TBD - created by archiving change complete-content-contact-security. Update Purpose after archive.
## Requirements
### Requirement: Accessible contact form lifecycle
The Contact chapter SHALL expose labelled native fields for every approved payload value, SHALL render explicit verification, submitting, success, error, and unavailable states, and SHALL retain the official email channel when the form cannot submit.

#### Scenario: Visitor completes a valid form
- **WHEN** every required field, privacy consent, and Turnstile verification are complete
- **THEN** the form submits once, announces progress and success without a focus trap, clears visitor fields and token, and keeps the terminal cadence after the interaction

#### Scenario: Client integration is unavailable
- **WHEN** the public Turnstile configuration or script is unavailable
- **THEN** submit remains disabled with a generic explanation and the official mail link remains operable

### Requirement: Strict request boundary
`POST /api/contact` MUST accept only an allowed-origin JSON object at most 16 KiB with the exact documented keys, an empty honeypot, bounded plain-text values, a valid project enum, and privacy consent equal to true.

#### Scenario: Request is not trustworthy
- **WHEN** media type, byte limit, origin, JSON syntax, keys, honeypot, or field validation fails
- **THEN** the route rejects it with the documented status class, a generic structured error, no provider call, and `Cache-Control: no-store`

### Requirement: Verified and private delivery
The route MUST validate Turnstile server-side with a finite deadline, hostname and `contact` action checks, then send one plain-text Resend email using only server-controlled sender, recipient, and enumerated subject values without persistence or sensitive logs.

#### Scenario: Providers accept the message
- **WHEN** the strict payload and Turnstile response are valid and Resend accepts the email
- **THEN** the route returns a generic success without provider identifiers and stores no site-owned copy

#### Scenario: A provider fails or times out
- **WHEN** Turnstile or Resend is unavailable, rejects, or exceeds its deadline
- **THEN** the route fails closed with a generic retry response and does not expose tokens, addresses, bodies, secrets, stack details, or provider payloads
