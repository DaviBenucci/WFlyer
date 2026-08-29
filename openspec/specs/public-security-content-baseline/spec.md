# public-security-content-baseline Specification

## Purpose

Define the approved public content, legal disclosures, indexing metadata, and browser security baseline for the institutional website.

## Requirements
### Requirement: Locally enforceable browser security headers
Every site response SHALL deny framing, disable MIME sniffing, use strict-origin referrers, isolate openers, restrict sensitive browser capabilities, and expose a tested report-only CSP without `unsafe-eval`; the contact response SHALL additionally be JSON and no-store.

#### Scenario: Public and API headers are inspected
- **WHEN** a static route and `POST /api/contact` are requested from the standalone runtime
- **THEN** each locally enforceable header matches the approved baseline and no contact response is cacheable

### Requirement: External security controls remain truthful gates
The active infrastructure topology MUST remain documented as Registro.br delegation to Napoleon authoritative DNS and Napoleon hosting. Cloudflare DNS, proxy, and WAF MUST NOT be represented as active controls; Cloudflare Turnstile remains an independent anti-abuse integration. HSTS enforcement, any Napoleon-hosting WAF/rate capability, production Turnstile/Resend, and provider log retention MUST remain pending until documented inventory, credentials, and staging validation exist, without weakening local application controls.

#### Scenario: External access is absent
- **WHEN** Phase 08 completes without authenticated Napoleon infrastructure or production-provider access
- **THEN** code and mock evidence are complete, exact external configuration is documented, and no DNS, mail, application host, HSTS, WAF, or production state is changed

### Requirement: Public content matches implemented data use
Portuguese contact, privacy, cookie, terms, and accessibility content SHALL describe the enabled form, theme preference, per-tab opening marker, provider processing, lack of analytics and persistence, and owner contact using only approved facts.

#### Scenario: Content and runtime are reconciled
- **WHEN** final content, routes, metadata, structured data, storage calls, and external scripts are audited
- **THEN** no placeholder, fabricated business fact, unapproved social network, analytics payload, unnecessary consent banner, or false legal-review claim remains
