## Context

See `proposal.md` for motivation and verified live state. The existing Phase-9 baseline already separates deterministic composition (`composition.ts`) from responsive projection (`projection.ts`) and renders one pointer-inert score layer behind chapter content. The header already traverses the single native-scroll timeline, and Contact already supplies reusable strict-body, configuration, Turnstile, and finite Resend-delivery primitives.

This refinement is governed by ADR-025/026/027/031/032/034/036/037/038/039/041/042, the story chapter manifest, the approved Music asset manifest, and the external human choreography brief that will be normalized as ADR-043. The Task-34 evidence directory remains historical and immutable.

## Goals / Non-Goals

**Goals:**

- Encode human-approved spatial intent as deterministic projection recipes and measurable evidence rather than visual-only CSS guesses.
- Keep notation events on locally readable path spans while allowing event-free staff/connector presentation to interact behind cards.
- Make semantic header order a standalone manifest independent of physical story order.
- Add one purpose-limited PRELAUNCH form and dedicated secure endpoint using existing server boundaries.
- Produce deterministic browser and email-preview surfaces for external visual acceptance.

**Non-Goals:**

- Altering Composer inputs/outputs, approved glyph bytes/calibration, APP-04 media behavior, the master motion runtime, or project-card geometry.
- Claiming durable distributed rate limiting, provider tracking configuration, real delivery, or physical-device approval from local evidence.
- Creating storage, mailing-list automation, a general email design framework, or a general feature-flag platform.

## Decisions

### Keep composition immutable and enrich projection evidence

`projection.ts` remains the only integration owner. It will expose explicit scene exclusions, card-interaction spans, project visit regions, and terminal evidence alongside the existing paths/zones. Horizontal geometry uses chapter-specific recipes; vertical modes retain the approved Organic Flowing foundation with bounded responsive simplification.

Notation ranges may be split into multiple local shelves only when explicit semantic-slot allocation prevents duplication. True connectors and every non-canonical part of an expanded interaction carry no slots and therefore no events. Expressive turns are routed through declared negative-space corridors outside measured content envelopes rather than wrapped around protected content for decoration. This is preferable to counter-rotating notes or mutating semantic music, both forbidden by ADR-026/027/042.

An ordinary single chapter barline is not inferred from a visual scene boundary. Every non-terminal chapter exit is classified against the unchanged semantic composition as `VALID_MEASURE_BOUNDARY` or `NOT_A_MEASURE_BOUNDARY`. Only a valid metric boundary may render one ordinary barline in the last notation-safe region before its connector. An invalid boundary renders none and is reported as `CHAPTER_BARLINE_REQUIRES_COMPOSITION_DECISION`. The existing thin-gap-thick terminal barline remains a separate physical-end contract.

### Treat the Home clef as a projection presentation override

The one existing professional-model treble-clef primitive remains the single shared-origin asset owner. Projection scales that primitive around its approved anchor according to mode and positions the common origin in a lower Home corridor. No second clef, path-data copy, mirror, or arbitrary rotation is introduced. This preserves asset and semantic identity while implementing the explicitly approved scenographic exception.

### Implement card expansion as event-free variable staff presentation

`CARD_SCORE_INTERACTION` is a shared projection descriptor used by Services and How It Works. It is measured from the rendered card envelope and owns five deterministic phases: canonical, lead-in, expanded, lead-out, canonical. Initial lead-in and lead-out lengths are each at least `max(8 * staffSpace, 25% of the nearest card width)` and may be longer where continuity requires it. The five staff polylines progressively diverge and recover around the canonical center trajectory; opacity uses the same eased progress so it falls through lead-in, reaches a restrained minimum inside the card region, and recovers through lead-out. Foreground card surfaces remain above the decorative score. Notes, accidentals, beams, stems, key signatures, and all other events are excluded from every span whose five-line geometry is outside canonical notation geometry.

An independent DOM animation was rejected because it would add scroll ownership and drift from projection geometry. Scaling the entire SVG was rejected because it would distort musical events and other chapters.

### Derive Projects visits from rendered card geometry

Projects exposes three measured card rectangles to the projection owner. A deterministic visit anchor is derived from each card center and safe perimeter, then projected into three distinct notation-safe shelves. The route enters low, rises toward visit 1, descends through an event-free connector valley, repeats for visits 2 and 3, and descends toward Contact. This keeps the visible relationship responsive to actual layout rather than a single screenshot coordinate set. Text-bearing card surfaces remain opaque foreground exclusions; connector slopes may exceed the notation angle only because they own no events.

### Use an explicit header manifest while retaining stable chapter identity

The stable `application-access` chapter/timeline identity remains to minimize motion/history risk, but its public label/hash become `Lançamento`/`#lancamento`, its header membership becomes true, and its external action is removed in PRELAUNCH. `professional-process` becomes a header target. The explicit branch lists remain the sole header ordering source; desktop timeline order remains unchanged.

### Use one typed Application release-state seam

A small local configuration exports `PRELAUNCH | LIVE`, currently `PRELAUNCH`. The scene renders the form for PRELAUNCH and can later render the canonical external action for LIVE without a remote flag service. This separates present availability from stable chapter identity while avoiding premature infrastructure.

### Build a dedicated launch-interest domain on shared primitives

The new endpoint accepts exactly the four approved user fields. It reuses Contact's server configuration and bounded-body reader, and parameterizes the existing Turnstile verifier by fixed server-owned action while preserving the public Contact wrapper unchanged. Host validation is added only to the new route because changing Contact is outside this bounded refinement.

A server UUID is generated as the correlation and logical-registration identity. A bounded process-local registry stores only a SHA-256 address key plus request ID/timestamp/outcome for finite retry/deduplication; raw addresses are not retained there. The same logical record and provider idempotency keys are reused for an in-process retry, including an uncertain timeout, while the mailbox's `WAITLIST_EMAIL` field remains the durable deduplication source. A separate bounded process-local window counter supplies best-effort rate limiting. Both structures reset on restart and do not claim cross-process enforcement.

### Make delivery sequential and outcome-aware

The server sends the fixed operational message first. Only provider acceptance marks the registry as registered and permits acknowledgment. The route returns `ok=true, acknowledgmentSent=false` if acknowledgment fails, allowing the UI to report registration honestly. A later in-process duplicate may retry only the acknowledgment with the same logical record.

One email module owns escaped data interpolation, warm transactional tokens, table HTML, text alternatives, subjects, recipients, and idempotency keys. No web CSS, external image, script, pixel, arbitrary Reply-To, or user-authored content enters either message. Repository code adds no tracking; actual Resend domain settings remain external evidence.

### Keep the visual lab review-only and production-isolated

Email previews and deterministic form outcomes live under the existing development-only `/__visual-lab` boundary and render the exact server-owned templates with fixed non-personal sample data. Production isolation tests must prove those routes are unavailable in production builds.

### Integrate the semantic footer into the immersive terminal

The route-aware experience boundary omits only the appended global visual footer on the immersive motion route. Horizontal branch terminals retain shared footer groups; vertical/static modes expose those groups in the final Application terminal so the one semantic footer contract remains. Standalone/internal pages retain `SiteFooter` and other story review routes retain `StoryGlobalFooter`.

## Risks / Trade-offs

- [Large clef or serpentine collides at an untested viewport] → Define projection evidence/exclusions, test a viewport matrix, and review deterministic dark/light/compact captures before human acceptance.
- [Variable staff spread accidentally includes notation] → Derive interactions from explicit connector ranges and fail projection construction if any interaction overlaps an event-bearing zone.
- [Multiple local notation shelves add unintended structural bars] → Allocate slots and `barlineAfter` explicitly, then assert semantic slots, ordinary/final bar roles, tangent bounds, and fingerprints.
- [Process-local abuse controls reset or differ across workers] → Bound memory, document the limitation, retain Turnstile and provider idempotency, and do not claim provider-grade or durable enforcement.
- [Operational send times out but completes later] → Reuse the cached server logical identity and exact message body/idempotency key during the finite local/provider window.
- [Acknowledgment failure creates confusing UI] → Return an explicit boolean while treating registration as successful only after operational acceptance; maintain separate pt-BR success copy for both outcomes.
- [Provider tracking state is unknowable locally] → Add no tracking markup/API option, record Resend's documented default, and leave domain-level verification as an external pending gate.
- [Changing the access hash breaks stale links] → Update manifest/bootstrap/header tests and optionally resolve the retired hash to the same stable chapter only if canonical deep-link compatibility requires it; do not maintain two header items.

## Test Strategy

- Pure/unit: projection topology, interaction/event separation, visit regions, exclusion rectangles, clef presentation, barline ends, fingerprints, serialization, strict schema, guard bounds, templates/escaping/idempotency, sequential delivery, route errors, and header manifest.
- Component: every launch form state, Turnstile action/lifecycle/cleanup, retry behavior, focus/live regions, PRELAUNCH/LIVE seam, and immersive footer ownership.
- Browser: all required scenes and headers in Chromium/Firefox/WebKit as risk-appropriate, keyboard and axe checks, horizontal/wide/compact/static/reduced modes, zero collisions/intersections/hydration warnings, endpoint outcomes, and production isolation.
- Visual: 13 required dark desktop scene captures, 9 transition/project diagnostic captures, plus representative light and compact frames, exact URLs, manifest, checksums, and manual inspection notes.
- Final affected regression: lint, typecheck, unit, Storybook, selected E2E/motion/a11y/visual suites, build, immutable assets/manifests, and strict OpenSpec validation. No unrelated full matrix is rerun repeatedly during iteration.

## Migration Plan

1. Add this focused OpenSpec amendment and parent prose blocker without changing parent checkbox counts.
2. Normalize ADR-043 and existing canonical owners, then implement header/content/API/email/form and projection changes behind current PRELAUNCH configuration.
3. Run focused tests, inspect deterministic review frames, and create a new sibling refinement evidence bundle without editing Task-34 evidence.
4. Stop with the local review server running. External human visual acceptance is required before completing the amendment or starting parent Task 35.
5. A later separately approved release may change the local state to LIVE and replace the form with the canonical application action.

Rollback is file-scoped and requires no data migration: restore Task-34 projection/header/content, remove the additive endpoint/form/previews, and restore the appended immersive footer. Preserve both historical evidence bundles and record any rejected refinement rather than rewriting them.

## Open Questions

- Real delivery, mailbox existence, verified sender status, production Turnstile hostname/action, Resend domain tracking settings, and physical-device presentation remain external verification items. They do not change the local contract or implementation breakdown.
