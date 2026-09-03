# Canonical Decision Register

## Legacy ADR status

| ADR | Status in v2 |
|---|---|
| ADR-001 separate repositories | RETAINED |
| ADR-002 static-first with server contact route | RETAINED |
| ADR-003 no database/CMS/auth for site v1 | RETAINED |
| ADR-004 GSAP as sole programmatic motion engine | RETAINED |
| ADR-005 monolithic horizontal scene | HISTORICAL; later route model and then v2 replaced it |
| ADR-006 header compass/page-link model | SUPERSEDED by ADR-031 |
| ADR-007 wavy score | REFINED by ADR-025 |
| ADR-008 official identity/direction | RETAINED |
| ADR-009 contact Route Handler | RETAINED |
| ADR-010 no custom CSRF in initial contact flow | RETAINED with existing controls |
| ADR-011 no runtime AI framework | RETAINED |
| ADR-012 programmatic vector opening | RETAINED and REFINED by ADR-033/038 |
| ADR-013 master visual board | RETAINED as historical global reference; specific approved assets take precedence |
| ADR-014 Home + route-per-chapter double score | SUPERSEDED by ADR-025/030/031/032 |
| ADR-015 route chapter terminals | SUPERSEDED by ADR-025/037 |
| ADR-016 interactive DOM tablet | SUPERSEDED by ADR-036 |
| ADR-017 archetype inheritance | REFINED by ADR-039 |
| ADR-018 Cloudflare/DNS already provisioned | HISTORICAL; superseded by ADR-040 after the owner-completed DNS migration |
| ADR-019 prior implementation freeze | SUPERSEDED by the v2 linear plan |
| ADR-020 Napoleon/GitHub runtime | RETAINED |
| ADR-021 secret ownership | RETAINED |
| ADR-022 channels/projects/no analytics | RETAINED, with W_Flyer repositioning |
| ADR-023 owner homologation | RETAINED |
| ADR-024 Napoleon exact-SHA branch handoff | RETAINED |

## ADR-025 — Continuous organic dual-score narrative

**Status:** APPROVED — 2026-08-14

**Responsive functional clarification:** APPROVED — external human Gate-C
follow-up review, 2026-08-24

Home is the common origin of two perceptually continuous five-line scores. Desktop application travels left and professional travels right. Each branch uses geometrically compatible modular segments, long smooth master-guide curves, coherent offsets, and a final barline before its terminal. Mobile uses vertical document progression while conventional notation remains in locally left-to-right notation-safe zones joined by event-free connector zones; semantic IDs and composition remain shared across projections.

`maxNotationTangentAngleDeg=18` is approved for notation-safe zoning. The
current piecewise returning connector is a validation-only noncanonical fixture,
not the final mobile aesthetic. Final public vertical Score Paths require
`Organic Soft` and `Organic Flowing` candidates in both vertical modes and both
themes, authored against real chapter/reserved zones and explicitly approved at
the blocking Phase-9 Score Path subgate.

## ADR-026 — W_Flyer Music Renderer v0.1

**Status:** APPROVED

Designer-owned SVG glyph geometry is separated from deterministic engraving primitives. `staffSpace`, `staffStep`, ScorePath point/tangent/normal frames, ledger-line rules, stems, beams/hooks, accidentals, key signatures, and barlines are deterministic. The ScorePath master guide is the B4/staffStep-4 middle-line geometry, while all five visible lines remain rendered coherent offsets. `normalAt(t)` is the pitch-increasing normal and does not invert when branch traversal is reversed. Pure geometry is independent of React.

## ADR-027 — Seeded procedural score composition

**Status:** APPROVED

The public score is a session-seeded assembly of whitelisted motifs and versioned per-length pitch contours, not free music generation. Same session/version/chapter/semantic slots yield the same composition across reload, theme, responsive mode, and reduced motion. Boundary correction may translate a complete contour by one smallest uniform integer staffStep offset only; it may not clamp, reflect, reverse, truncate, or mutate individual intervals. An unfit contour is rejected deterministically. `Math.random()` is prohibited.

## ADR-028 — Music calibration and Visual Lab gates

**Status:** APPROVED

Eight SVG glyphs are visual-reference approved but runtime approval requires human-calibrated metrics/anchors. Gate A validates geometry, Gate B is human calibration, and Gate C validates renderer/composer visual behavior. Landing integration is forbidden before all gates.

**Gate-C final decision:** APPROVED — external human review, 2026-08-24.
The reviewed renderer tokens, Composer calibration, final triplet presentation,
responsive semantic rules, and `maxNotationTangentAngleDeg=18` are canonical for
Music System v0.1. Responsive activation thresholds remain noncanonical; the
current connector geometry remains a validation-only noncanonical fixture; and
final public organic Score Paths remain blocked on separate Phase-9 human
approval. Authority and evidence are recorded in
`docs/canonical-v2/06-migration/evidence/music-system-v0.1/gate-c/approval-2026-08-24/`.

## ADR-029 — W_Flyer brand and personal professional positioning

**Status:** APPROVED

W_Flyer is a brand. The site presents the owner’s professional work, services, and projects without claiming a company/team structure. Positioning is portfolio + service acquisition (P2).

## ADR-030 — Alternative A: immersive landing plus detailed routes

**Status:** APPROVED

`/` is an immersive summary story. Detailed pages remain independent for SEO, accessibility, sharing, and long-form content. The landing is not required to contain all detail-page content.

## ADR-031 — Native-scroll master story and header traversal

**Status:** APPROVED

Native vertical scroll is the canonical story progress. Desktop maps it to one horizontal master timeline. Header navigation animates that same scroll position through intermediate chapters; duration is proportional to real story distance and capped at 3.0 seconds. Explicit user input cancels/supersedes automated traversal.

## ADR-032 — Responsive vertical story and mobile order

**Status:** APPROVED

**Responsive functional clarification:** APPROVED — external human Gate-C
follow-up review, 2026-08-24

Horizontal story is progressive enhancement, not a width-only breakpoint. Responsive score presentation supports `horizontal-enhanced`, `vertical-wide`, `vertical-compact`, and `static`; selection can consider width, height, pointer/input capability, reduced-motion preference, and effective layout capacity while exact thresholds remain Motion Lab calibration. Vertical document progression is the universal fallback and does not rotate conventional musical notation. Mobile order is Home → professional branch → professional ending → application branch → application ending → global footer. Access W_Flyer is the last application content scene.

The approved responsive semantics and `maxNotationTangentAngleDeg=18` do not
approve the current connector curve aesthetic. Responsive activation thresholds
remain noncanonical; final organic connector layouts are deferred to the
blocking Phase-9 Score Path human subgate.

## ADR-033 — Readiness-driven opening, deep links, and history restoration

**Status:** APPROVED

The opening is readiness-driven, fail-open, session-bounded, skippable, and noncritical-media independent. Initial Home/hash/history position is established before the overlay exits. Direct deep links do not replay the whole narrative. Passive scroll uses `replaceState`; successful explicit header traversal uses `pushState`.

## ADR-034 — Professional branch and project-card presentation

**Status:** APPROVED

Professional sequence is About → Services → Process → Projects → Contact. Process is a narrative chapter but not a required header item. Projects are authorized cases displayed as partially overlapped hand/fan cards on desktop and a staggered vertical stack on mobile. Hover/focus raises and foregrounds the selected card.

**Phase-3 route clarification:** APPROVED by repository owner instruction on
2026-08-24. `/portfolio` remains the stable current-release listing URL;
allowlisted details use `/portfolio/[slug]`. This is an additive detail
contract, not approval to migrate the namespace to `/projetos`. Unknown or
nonpublic slugs fail closed and remain absent from sitemap output.

## ADR-035 — Humanized hooded W_Flyer Persona

**Status:** APPROVED CONCEPT / FINAL ASSET PENDING

The Persona represents the owner and W_Flyer simultaneously. It is a humanized, hooded, non-photorealistic Concept-D figure derived from brand geometry, without reproducing identifiable physical appearance. It is required in About and may appear in controlled session-seeded easter eggs.

## ADR-036 — Non-interactive video application demonstration

**Status:** APPROVED / FINAL MEDIA PENDING

APP-04 is a scenographic device containing a muted/no-audio video, not a mini application. It plays once only when the chapter becomes active, then shows the exact final-frame image and a replay control at the top center. The simulated interface is non-interactive; replay is the only interactive screen control.

## ADR-037 — Branch terminals and footer semantics

**Status:** APPROVED

Each desktop branch reaches a final barline and a visual terminal/footer. Mobile uses a visual professional ending/transition and one real global footer after the application ending. Footer data is shared and never maintained as independent copies.

## ADR-038 — Progressive enhancement, reduced motion, lifecycle, and performance

**Status:** APPROVED

Motion failure degrades to a functional vertical document. Reduced motion uses vertical static mode, no horizontal pinning, no demo autoplay, and no animated easter eggs. GSAP/ScrollTrigger resources have explicit ownership/cleanup. Core Web Vitals and zero React renders per scroll frame are release gates.

## ADR-039 — Designer-owned visual asset governance

**Status:** APPROVED

Visual assets are separated into source master, approved asset, and runtime representation. Manifest/status/checksum/semantic IDs are mandatory. Codex may compose but not redraw approved geometry. Score segments have entry/exit contracts and shared semantic IDs across layouts.

## ADR-040 — Napoleon authoritative DNS and hosting topology

**Status:** APPROVED — 2026-08-29

Registro.br controls domain delegation. Napoleon is the authoritative DNS
provider and the Next.js standalone Node hosting provider for `wflyer.com.br`.
Cloudflare DNS, proxy, WAF, redirect rules, cache purge, and DNS API operations
are not part of the active request path. Cloudflare Turnstile remains an
independent anti-abuse integration and retains its browser, CSP, and server-side
verification contracts.

Operational documentation must inventory actual Napoleon DNS and hosting
controls without inventing provider APIs or capabilities. DNS, hosting, and
production mutations still require explicit owner approval, exact-SHA evidence
remains mandatory, and `app.wflyer.com.br` remains a separate application.

## ADR-041 — Warm dark-neutral and copper-emphasis theme language

**Status:** APPROVED — external human Task-33 review, 2026-08-30

The warm dark neutral palette derived from the approved Phase-9 Task-33
origin-review surface supersedes the previous W_Flyer dark neutral palette. The
real-origin review fixture establishes that canonical W_Flyer v2 language: a
warm near-black canvas, subtly lighter warm-charcoal surfaces, an
ivory/off-white primary foreground, a restrained warm muted foreground,
low-contrast warm borders and dividers, and subtle tonal separation instead of
blue-heavy neutral surfaces.

The same human review promotes fixture copper `#e79271` through the canonical
semantic emphasis family for selective dark-theme text, interaction, focus, and
ornament. Systematic hover, active, and subtle states derive from that owner.
General dark UI no longer uses purple/cobalt as its dominant textual or
ornamental language and no longer uses the purple neon glow. Purple/cobalt
remain valid where intrinsic to approved W_Flyer brand assets. Task-33 review
fixtures may retain their pre-integration score presentation, but final Music
notation ink is a separate theme-aware semantic owner in Task 34. Review
connector cyan and fixture-local diagnostic/status semantics remain review-only
even when a diagnostic happens to share the copper literal.

The dark Home atmosphere projects the approved origin visual family: warm
near-black and brown/charcoal depth with a subtle warm falloff instead of a
large purple haze. It uses gradients rather than filter/blur layers and does not
alter Home geometry or scroll behavior. The light theme, approved Music glyph
geometry and calibration, approved Organic Flowing alternating-S grammar, and
component geometry remain unchanged.

The complete Task-33 approval also accepts the real shared-origin topology and
Organic Flowing path grammar recorded by ADR-042. It does not freeze the
fixture clef's exact pixel size as the final production optical prominence.

## ADR-042 — Organic Flowing production Score Path layouts

**Status:** APPROVED — external human Task-33 review, 2026-08-30

`Organic Flowing` is the canonical Score Path direction. Its production
projection uses the approved alternating side-to-side S-transition grammar in
`horizontal-enhanced`, `vertical-wide`, and `vertical-compact`, including the
compact mobile spacing and Project-card treatment. The shared origin uses the
real treble clef, initial five-line staff, and approved branch-departure
topology. Descending regions remain notation-safe, true connectors remain
event-free, and each branch ends physically at its thin/thick final barline.

The responsive projections preserve the same semantic Music composition; they
may regroup physical zones but may not recompose motifs, slots, or chapters.
The final production optical prominence of the treble clef may be calibrated
during Task-34 integration against the real Home composition while preserving
the approved glyph bytes, musical anchor, staff spacing, orientation, and
origin topology. This approval closes Task 33 and authorizes Task 34 only; it
does not complete Task 34, Task 35, or Gate 9.

## ADR-043 — Phase-9 human choreography and Application PRELAUNCH

**Status:** APPROVED FOR IMPLEMENTATION / EXTERNAL VISUAL ACCEPTANCE PENDING —
2026-08-31

The 2026-08-31 Task-34 automated integration bundle remains immutable,
truthful historical review evidence. Subsequent external human review approved
a bounded Phase-9 refinement rather than reopening that task: one large
approved Home treble clef becomes the scenographic shared origin; branch paths
depart below it; scene-owned exclusion and interaction zones prioritize
content; Services and How It Works share an event-free expanded staff/card
grammar; Projects uses a three-card event-safe serpentine; Contact, APP-04, and
the final form are protected; and each branch physically ends at its canonical
final barline. Music composition, fingerprints, assets, calibration, and
semantic slots do not change.

Header navigation uses the explicit semantic order Aplicação, Como funciona,
Benefícios, Lançamento; W_Flyer; Sobre, Serviços, Processo, Projetos, Contato.
Demonstration remains a non-header story chapter. Existing native-scroll
traversal, 3.0-second maximum, interruption, and history semantics remain.

The stable final Application content chapter is currently `PRELAUNCH` and
contains a purpose-limited launch-interest form rather than an unavailable
application link. `POST /api/app-launch-interest` accepts only email, explicit
consent, a Turnstile token, and a honeypot; reuses bounded Contact security
primitives; adds host validation, request IDs, a 4 KiB boundary, and honest
process-local rate/deduplication limits; and stores no database record. Fixed
operational delivery to `welcome.app@wflyer.com.br` is the registration event;
a fixed transactional acknowledgment follows and may fail without undoing the
registration. Both HTML/text templates use the warm near-black/ivory/muted
warm/copper visual family, escaped server-owned content, no custom tracking
pixel, and no marketing expansion.

The future `LIVE` state is a small local scene configuration that replaces the
form with `app.wflyer.com.br` only after separate approval. The immersive route
uses its terminal as the single visual close while retaining one semantic
mobile/footer close and unrelated route footers. The focused OpenSpec change
`refine-phase-9-score-choreography-and-prelaunch` owns implementation and new
evidence. Task 35 and Gate 9 remain blocked until implementation, affected
validation, deterministic recapture, and explicit external human visual
acceptance.
