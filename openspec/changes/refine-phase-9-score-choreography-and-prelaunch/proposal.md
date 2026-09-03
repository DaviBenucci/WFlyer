## Why

The Task-34 automated score integration is a truthful historical checkpoint, but subsequent external human review rejected its generic upper-horizontal choreography and approved a bounded spatial refinement. The same review confirmed that the unavailable Application access action must become a secure pre-launch notification flow before Phase-9 stability closure can begin.

## What Changes

- Preserve the checked parent Task 34, its evidence bundle, Music composition semantics, reference fingerprints, native-scroll ownership, and all approved Music assets.
- Refine only projection and presentation so Home uses a large approved treble-clef origin, each Professional/Application scene has content-aware exclusion or interaction geometry, Projects visits all three cards through event-free steep connectors, and both branches physically end at their final barlines.
- Define one shared `CARD_SCORE_INTERACTION` presentation grammar for Professional Services and Application How It Works while keeping unsafe expanded geometry free of musical events.
- Preserve expressive Organic Flowing turns only in measured scene negative space: protected scenes MUST keep the score outside headings, cards, forms, controls, and media instead of wrapping curves around them.
- Give `CARD_SCORE_INTERACTION` explicit pre-expansion and post-expansion spans so the five-line envelope and restrained opacity transform progressively before the first card and recover after the last card.
- Derive the three Professional Projects visit anchors from rendered project-card bounds, producing a distinct notation-safe presentation moment for every card separated by true event-free connectors.
- Replace physical-order-derived header behavior with an explicit semantic manifest: Aplicação, Como funciona, Benefícios, Lançamento; W_Flyer; Sobre, Serviços, Processo, Projetos, Contato. Demonstration remains in the story but outside the header.
- Prove all ten semantic header targets by activation result, canonical scene, hash/history result, active item, and keyboard order rather than treating visible label order as sufficient.
- Render an ordinary chapter-end barline only where the unchanged semantic composition proves a valid metric measure boundary; otherwise record `CHAPTER_BARLINE_REQUIRES_COMPOSITION_DECISION` without altering Composer semantics or fingerprints.
- Replace the unavailable Application access action with the current `PRELAUNCH` scene and a dedicated `POST /api/app-launch-interest` flow.
- Send a fixed operational registration email to `welcome.app@wflyer.com.br` before a fixed transactional acknowledgment, with honest partial-delivery semantics, HTML and text templates, explicit consent, Turnstile, honeypot, origin/host validation, bounded bodies, rate limiting, and request IDs.
- Remove the second visual footer only from the immersive landing when a branch terminal already fulfills the closing presentation; retain shared footer behavior on unrelated routes and semantic mobile fallback.
- Add focused deterministic geometry, API, email, component, accessibility, responsive, hydration, and human-review evidence without starting parent Task 35.

### Scope

This change covers the Phase-9 immersive story, score projection/presentation, semantic story header, Application final scene, launch-interest route and transactional templates, focused validation, and new human-review evidence.

### Non-goals

- No Composer, motif, pitch, duration, contour, transposition, key-signature, glyph-byte, or immutable-manifest changes.
- No Persona implementation, APP-04 redesign, Task 35 work, Phase 10 work, database, CMS, authentication, provider configuration mutation, deployment, production cutover, or changes to `app.wflyer.com.br`.
- No rewriting of the 2026-08-31 Task-34 evidence as if the refined geometry had existed at that checkpoint.

## Capabilities

### New Capabilities

- `application-launch-interest`: PRELAUNCH scene, secure mailbox-backed registration, operational and acknowledgment email delivery, explicit form states, consent, transactional presentation, and the future `PRELAUNCH` to `LIVE` seam.

### Modified Capabilities

- `continuous-dual-score`: content-aware Home, Professional, and Application score choreography with interaction/exclusion zones and physical terminal guarantees.
- `professional-portfolio-presentation`: Professional scene association, Persona reservation, Projects visitation grammar, Contact protection, and nonduplicated immersive closing.
- `responsive-story-mode`: responsive simplification of the refined choreography without semantic recomposition and with fully functional static/reduced-motion forms.
- `scroll-driven-portfolio-landing`: explicit semantic header ordering, Lançamento target, hidden Demonstration header membership, native-scroll traversal preservation, and PRELAUNCH conversion behavior.

## Impact

### Verified facts

- Parent OpenSpec change `rebuild-scroll-driven-wflyer-v2` is at 34/45; Task 34 is checked and Task 35 is unchecked.
- The live Task-34 implementation owns score composition separately from projection and exposes reference fingerprints `fnv1a32:039bce10` and `fnv1a32:1fe3356b`.
- Existing Contact code provides strict JSON/body validation, exact-origin configuration, Turnstile hostname verification, server-only Resend credentials, provider idempotency, finite delivery deadlines, and generic public failures, but no route host check, request ID, or local rate limiter.

### Inferences and implementation choices

- A dedicated strict launch-interest domain can reuse Contact primitives without weakening or overloading `/api/contact`.
- A bounded process-local hashed-key limiter is an honest release-compatible defense for the current single-host Node boundary; it is not durable or cross-process infrastructure and will be documented as such.
- Resend idempotency protects repeated logical submissions within its finite provider window; mailbox extraction by normalized address remains the approved durable deduplication mechanism.

### Pending external evidence

- Real mailbox existence/delivery, verified sender status, production Turnstile behavior, provider-domain tracking settings, physical devices, and final human visual acceptance cannot be claimed from local implementation.

### Affected normative documents

- `WFLYER_IMPLEMENTATION_PLAN.md`
- `docs/canonical-v2/00-governance/03-decision-register.md`
- `docs/canonical-v2/01-product/02-information-architecture-and-routes.md`
- `docs/canonical-v2/01-product/03-user-journeys-conversion-and-content-boundaries.md`
- `docs/canonical-v2/02-experience/02-chapter-contracts.md`
- `docs/canonical-v2/02-experience/03-desktop-scroll-header-history.md`
- `docs/canonical-v2/02-experience/06-terminals-footers-and-navigation-semantics.md`
- `docs/canonical-v2/03-visual/01-continuous-dual-score-system.md`
- `docs/canonical-v2/05-architecture/03-security-contact-seo-and-operations.md`
- `docs/canonical-v2/manifests/story-chapters.v2.yaml`
- `docs/canonical-v2/06-migration/CURRENT_HANDOFF.md`

### Rollback

Rollback is file-scoped: remove this focused change's product/documentation edits and restore the live Task-34 checkpoint while leaving its historical evidence untouched. The launch-interest endpoint and preview routes can be removed independently because they add no storage or schema migration; no external state is mutated by local implementation.
