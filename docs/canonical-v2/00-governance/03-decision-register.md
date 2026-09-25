# Canonical Decision Register

> **Current spatial precedence:** ADR-057 below supersedes the specified prior
> presentation constraints; earlier decision text remains historical lineage.


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

**Current-scope supersession:** ADR-056 supersedes this Phase-3 route and
vertical fan presentation for the unfinished landing-page release. It does not
erase their historical approval or change the horizontal fan contract.

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

**Status:** APPROVED / TECHNICAL BASELINE ACCEPTED — 2026-09-04

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
evidence.

On 2026-09-04, the owner explicitly accepted the resulting score geometry as
the Phase-9 technical baseline. This approval satisfies focused OpenSpec item
7.3; it does not designate the current presentation as the final visual
composition. The accepted implementation/evidence baseline is immutable at:

`PHASE_9_FINAL_GIT_SHA = 306ccb74da6c7bbf8f187e360c0776c571b5fc3d`.

The final validation satisfies parent Task 35 and every Gate-9 acceptance
condition. Task 35 is complete, Gate 9 is `PASS`, and Phase 9 is formally
closed on 2026-09-04. Historical and corrective evidence retains its original
capture-time wording and sealed bytes.

Human review transferred exactly these requirements to isolated successor
scope:

- `ASM-LAYOUT-DELTA-001` — Application terminal spatial continuation;
- `ASM-LAYOUT-DELTA-002` — Composer-backed events only on visually straight,
  event-safe staff shelves;
- `ASM-LAYOUT-DELTA-003` — a direct or broad low-curvature Benefits↔Demo
  corridor;
- `ASM-LAYOUT-DELTA-004` — improved Professional straight-shelf event
  utilization using the existing semantic composition first;
- `ASM-LAYOUT-DELTA-005` — the already-approved final Home Scenic Assembly.

No `ASM-LAYOUT-DELTA-*`, Composer semantic change, Assembly, or Motion work was
implemented as part of Phase 9. The canonical authority for the future
`implement-scroll-driven-score-assembly-and-motion` change is
`docs/canonical-v2/05-architecture/WFlyer_Post_Phase9_ASM_Motion_Canonical_Spec.md`.
The isolated OpenSpec completed documentation-only Stage 0 on 2026-09-05;
Gate 0 is PASS. The owner has approved Stage 0 and its scoped documentation
checkpoint commit; bounded Stage-1 authorization remains pending.
No successor geometry or runtime implementation has started. This operational
status update does not change ADR-043's approved technical decisions or the
mandatory human geometry approval/refreeze boundary before motion.

## ADR-044 — Bounded successor repair of 14 inherited intersections

**Status:** APPROVED by explicit owner governance instruction on 2026-09-08.

The successor's stronger visible-segment validator found 18 CLASS C occurrences
representing 14 distinct inherited staff-line intersections: horizontal 3,
vertical-wide 4, vertical-compact 7, static 4. Every occurrence reproduces in
Stage 0 and frozen Phase 9; none was introduced by Stage 1. The original
`stage-1-self-intersection-review.md` and diagnostic JSON remain unchanged.

This decision authorizes exactly `ASM-SI-001..014`, with static `015..018`
repeating `004..007`, as narrowly bounded successor corrective scope. Canonical
`ASM-IMP-DEC-008` records the complete A–H contract, mapping, and evidence rules:
unchanged zero-global-intersection acceptance; registered defects only; minimal
local/necessary adjacent geometry only; unaffected Phase-9 geometry excluded;
all four historical seals and 64 payloads immutable and historically valid;
distinct inherited/repair/final evidence; no unrelated refinement; new inherited
defects require a new decision. A repair that cannot stay within its local
necessary envelope must stop before expansion.

Phase 9 remains CLOSED and historically valid at
`306ccb74da6c7bbf8f187e360c0776c571b5fc3d`, under the validation/evidence
available at acceptance. This successor correction neither invalidates that
closure nor rewrites historical test claims. Composer semantics/fingerprints,
all event-safe thresholds, glyphs, calibration, protected content, and existing
five-delta intent remain unchanged. No Stage 2+, motion, commit, push, or deploy
is authorized. Geometry approval remains a later explicit human decision.

## ADR-045 — Deterministic Stage-1 SSR hydration and correction order

**Status:** APPROVED by explicit owner instruction on 2026-09-08.

The reported `StoryScoreLayer` `data-score-event-safety` hydration mismatch is
a bounded Stage-1 regression. `ASM-IMP-DEC-009` requires exact semantic
first-divergence diagnosis (full property path and owner), then the minimal
correction preserving `SSR output == first client render output` across DOM
structure/attributes and `hydration warnings = 0`. Final post-effect metadata
alone cannot establish initial equality. Existing lifecycle/readiness owns
responsive reprojection after hydration; Composer and deterministic Projection
boundaries remain unchanged.

No suppression, blanket client-only rendering, major-surface SSR removal,
unsupported metadata deletion, weakened tests, numerical rounding that hides
semantic divergence, new state machine, or responsive-architecture replacement
is authorized. Focused regression must prove initial equality, zero warnings,
responsive reprojection, unchanged fingerprints, and event-safe semantics.

Execution is governance normalization and strict/structured/diff checks → exact
hydration diagnosis → minimal hydration fix → focused hydration/projection/
event-safety checks → registered local inherited repairs → deterministic global
geometry gate → serial Chromium/Firefox/WebKit matrix → new successor evidence
→ Human Geometry Approval → STOP. Final evidence is prohibited while hydration
mismatch remains. Stage 2+ remains unstarted and unauthorized.

## ADR-046 — Successor numerical determinism and search telemetry boundary

**Status:** APPROVED by explicit owner instruction on 2026-09-09.

The Stage-1 H2 stop remains a valid diagnostic checkpoint. The completed
four-engine trace classifies it as numerical-only H2: equal inputs first differ
in `Math.hypot` path-distance calculation, then accumulated distance and exact
`Set` deduplication differ, while semantic allocation and existing six-decimal
rendered coordinates agree. This decision authorizes the minimum successor
boundary in `ASM-IMP-DEC-010`; it neither reopens Phase 9 nor changes its seals.

Semantic IDs/order, source/destination mapping, accepted/rejected groups,
shelf/zone identity and classification, topology, final barline semantics, and
clef/key-signature exclusions require exact equality for equivalent inputs.
Canonical rendered geometry retains the existing six-decimal presentation
representation owned by `serializeSvgNumber` and
`SCORE_REVIEW_SVG_PRECISION=6`. Geometry and safety calculations retain full
internal precision before serialization; no threshold or existing `1e-7`
comparison guard changes. Rounded normalized path parameters must never feed
coordinate reconstruction, allocation, or acceptance checks.

D1 already uses integer-indexed candidates. D2 has no proof that coordinate
keys cannot merge distinct valid candidates, so candidate generation and
deduplication remain unchanged. D3 separates only the proven search-effort
`candidateCount` from hydration-visible canonical event-safety metadata. The
raw integer remains in pure Projection diagnostics and separate post-hydration
tooling through the existing readiness lifecycle. Semantic counters remain
exact canonical outputs. No allocator redesign, suppression, Stage-3 metadata,
new state machine, Composer change, or motion is authorized.

After strict governance validation, focused four-engine proof must establish
exact semantic and canonical-coordinate equality, identical SSR/first-client
markup, zero hydration warnings, unchanged safety and Composer fingerprints.
Any changed semantic branch, safety-boundary result, distinct-candidate merge,
or canonical rendered coordinate requires STOP. Then resume the existing
Stage-1 order under ADR-044/045 and stop at Human Geometry Approval. No
implementation task or human gate is completed by this decision.

## ADR-047 — Exactly six additional inherited Stage-1 defects (Batch 2)

**Status:** APPROVED by explicit owner governance-only instruction on 2026-09-09.

The stronger real-DOM matrix correctly stopped after discovering six inherited
defects outside ADR-044's original 14. Register exactly `ASM-SI-019..024` as
Batch 2 under `ASM-IMP-DEC-011`: one Application Demo→Launch defect has three
viewport occurrences (1440x900, 1536x900, 1920x917); five Professional defects
each occur at 1100x640. All are horizontal visible staff-line crossings.
The supplemental `stage-1-batch-2-inherited-defect-review.md` and diagnostic
JSON retain exact IDs, segments, coordinates, measured inputs, and predecessor
proof. All six distinct defects reproduce in Stage 0 and frozen Phase 9;
duplicate-width Application proof uses the unchanged local branch builder
where full historical Projection rejects the current inputs at another guard.
That bounded diagnostic is not a historical global acceptance claim.

Global acceptance remains **ZERO GLOBAL SELF-INTERSECTIONS**, for center paths
and all visible staff lines, with the stronger validator and all thresholds
enabled. Authorize only these six registered envelopes and the minimum adjacent
geometry necessary to remove each crossing while preserving continuity.
ADR-044's original 14 repairs remain authorized and valid; preserve their
immutable review/JSON and completed implementation. Preserve the completed
ADR-046 / ASM-IMP-DEC-010 numerical/hydration correction without redesign.

This adds no general inherited-defect exception. The former outside-14 STOP
was valid; only the exact Batch-2 inventory now has a successor authorization.
Any further inherited defect outside Batch 1 (`001..014`, static aliases
`015..018`) and Batch 2 (`019..024`), or repair requiring material expansion
beyond its minimal local envelope, SHALL trigger a new explicit STOP/decision.
Broad Phase-9 reopening, aesthetic redesign, unrelated branch reshaping,
Composer changes, generalized Stage-3 metadata, and motion remain excluded.

Phase 9 remains CLOSED and historically valid under its contemporary evidence.
All four seals and 64 historical payloads remain byte-identical; successor
evidence must distinguish inherited baseline, local correction, and final
clean geometry for both batches. No historical statement is rewritten to imply
that the new defects were known at Phase-9 acceptance.

The current Ultra run is documentation/diagnostic recovery only. After exact
inventory, canonical normalization, strict successor/workspace OpenSpec,
structured-document validation, diff checks, and integrity verification pass,
STOP immediately before Batch-2 implementation, browser matrix, or final
evidence. A separate High continuation may perform the bounded repairs, using
focused validation first, then a clean deterministic global gate before the
final serial three-engine matrix and successor evidence. Human Geometry
Approval remains blocking; Stage 2+, motion, commit, push, and deploy remain
unauthorized. This decision completes no repair or human-approval checkbox.


## ADR-048 — Projects capacity-based whole-story responsive fallback

**Status:** APPROVED by explicit owner architecture decision on 2026-09-09.

Register ASM-PC-001 as one inherited PROJECTS-P3 root with occurrences
ASM-PC-001-O01/O02/O03 at 1100x640. Full Stage-0/frozen Phase-9 constructor
replays on the saved real-DOM input reproduce the same Projects y=556 cap and
collisions. The persisted lineage/capacity review proves fixed horizontal
space insufficient; no fresh historical browser result is claimed.

The owner selects capacity-based responsive fallback. Under
`ASM-IMP-DEC-012`, coarse eligibility AND complete candidate-horizontal Projects
capacity are necessary for horizontal-enhanced. Failure uses the existing
compatible vertical mode for the WHOLE story, normally vertical-wide. No local
Projects mode island, fan repositioning, card shrinking or viewport exception.

Responsive policy remains in story/motion/eligibility.ts and its runtime
lifecycle; Projection/pure score capacity math owns geometry. A scoped inert
candidate-horizontal measurement transaction independent of current fallback
DOM supplies stable inputs after hydration. Generation-based invalidation and
one commit per settled input prevent feedback; resize preserves semantic
chapter/branch/fraction, seed/composition and no Home replay.

The exact implementation boundary and acceptance cases are centralized in
ASM-IMP-DEC-012(C–I), including the necessary Projects-only vertical
measurement/projection compatibility to preserve three actual visits. Existing
vertical visits:[] audits are not acceptance. No unrelated chapter, card/section
dimension, Composer, footprint, 12px clearance, global-zero, visibility,
NON-ASSEMBLY or three-card requirement may be weakened. Further expansion or
unregistered defects requires another STOP.

Preserve Batch 1, Batch 2 and ADR-046 numeric/hydration repairs and all original
diagnostic records. Phase 9 remains historically accepted; four seals and 64
payloads stay byte-identical. This governance-only run performs no runtime
implementation and completes no repair or Human Geometry Approval checkbox.
After bounded strict/structured/diff/integrity checks PASS, STOP for a separate
High implementation run. Stage 2+, motion, commit, push and deploy remain
unauthorized.

## ADR-049 — First Projects visit full-ink clearance, separate bounded repair

**Status:** APPROVED by explicit owner decision on 2026-09-10.

Register **ASM-PC-002**, diagnostic alias
`PROJECTS-FIRST-EVENT-INK-CLEARANCE`, separately from ASM-PC-001. Occurrences
**ASM-PC-002-O01/O02/O03** are the first horizontal Projects visit at
1440x900, 1536x900 and 1920x917 respectively. The immutable full-ink STOP
review/JSON in the active successor records ~1.03px notehead-envelope and
~5.92px ledger clearance for `professional-projects:primary:note:0`, below
the unchanged 12 physical CSS pixels. Current Chromium corroborates 1536x900;
original Stage-0/frozen Phase-9 Professional branch constructors reproduce
the same primitives on saved inputs. This is branch-only historical proof,
not fresh historical DOM or full historical aggregate PASS.

The uncapped cardBottom + 42px shelf reservation is the limiting mechanism;
ASM-PC-001 remains the distinct capped 1100x640 three-visit root with its
approved capacity-based whole-story fallback and bounded support unchanged.
ASM-IMP-DEC-013 authorizes only the first horizontal Projects notation shelf
and minimum entry/continuity geometry necessary to preserve visit 1 to visit 2.
Reservation must derive from complete rendered musical ink and required
production interaction envelopes. No fixed-pixel fixture workaround,
viewport-specific branch, fan redesign or automatic scope expansion.

ASM-IMP-DEC-012(I.B)'s old positive-fixture assumption is explicitly amended:
the three saved inputs remain proven full-ink failures before repair and
become positive horizontal candidates only when the complete new capacity
predicate actually passes. At least one appropriate corrected horizontal candidate at the three registered
viewport occurrences must satisfy that full contract within the authorized
local envelope; if none can pass, STOP. Missing interaction measurements do not negate an observed idle failure.

Preserve all three visits, card dimensions/content/fan interaction, Projects
NON-ASSEMBLY, visits 2/3 shelves except minimum proven necessary continuity,
Composer semantics/fingerprints, approved glyphs, full visible staff/event ink,
12px clearance, global zero intersections, Batch 1/2 and ADR-046, all historical
evidence and validators. The detailed boundary is ASM-IMP-DEC-013.
This Ultra run normalizes governance only; after bounded strict, structured,
diff and integrity checks, STOP with a separate Astra High implementation
handoff. No repair, final matrix/captures, Stage 2+, refreeze, motion,
commit/push/deploy or Human Geometry Approval is authorized by this run.

## ADR-050 — Second Projects visit focus clearance, distinct bounded repair

**Status:** APPROVED by explicit owner decision on 2026-09-11.

Register **ASM-PC-003**, alias `PROJECTS-VISIT-2-FOCUS-CLEARANCE`, separately
from ASM-PC-001 and ASM-PC-002. Occurrences **ASM-PC-003-O01/O02/O03** map to
1440x900, 1536x900 and 1920x917. The immutable interaction STOP and lineage
review/JSON in the active successor retain current Chromium focus-start staff
clearances of 9.134092525156348, 9.138670081197802 and 9.142343177774706
physical CSS pixels, below the unchanged 12px requirement. Original Stage-0
and frozen Phase-9 constructors on saved inputs reproduce the relevant local
geometry, and relevant interaction styles are identical. This is inherited
constructor/style proof, not fresh historical browser or aggregate acceptance.

ASM-IMP-DEC-014 authorizes only the second horizontal Projects notation shelf
and the minimum visit-1-to-2 / visit-2-to-3 junction controls proven necessary
for valid continuous geometry after its correction. Reservation derives from
complete visible staff/applicable event ink, actual cards and production
idle/hover/focus/touch-equivalent envelopes over transitions. No arbitrary
fixed offset, viewport branch, focus reduction/clipping, card/fan change,
shared valley redesign or unrelated geometry is authorized.

ADR-048 / 012 retains ASM-PC-001 fallback/support. ADR-049 / 013 retains
ASM-PC-002's first-shelf/minimum entry/visit-1-to-2 boundary; it never supplied
authority for visit 2's own shelf. The new decision preserves visit 1 except
its existing ASM-PC-002 authority and preserves visit 3's own shelf. Only
complete candidate qualification is reconciled to the separately named
013 + 014 envelopes; neither root or repair scope is merged. Old fixtures
remain negative baselines. At least one appropriate corrected horizontal
candidate among the three recorded dimensions must satisfy the complete
predicate; universal fallback cannot conceal failure to achieve this.

Future High implements ASM-PC-002 first, then ASM-PC-003, with focused local
validation; only after both local repairs pass may ASM-PC-001 fallback work
continue. Any required expansion beyond the new shelf/minimum junction scope,
new inherited defect or inability to satisfy the full contract triggers STOP.
Preserve all three visits, NON-ASSEMBLY, cards/content/fan/focus accessibility,
Composer/fingerprints, glyphs/full ink, 12px, global zero intersections, five
deltas, both repaired batches, ADR-046, all validators and historical records.

This Ultra authorization is governance-only: normalize required contracts,
pass bounded strict/structured/diff/historical/protected-file integrity checks,
then STOP with a separate Astra High handoff. All implementation remains
pending; 7/92 and Human Geometry Approval pending. No runtime/test repair,
final matrix/captures, Stage 2+, refreeze, successor motion, commit/push/deploy
or self-approved human gate.

## ADR-051 — Inherited Access reservation and deterministic scene envelope

**Status:** APPROVED by explicit owner decision on 2026-09-13, with execution-
efficiency guardrails; registration and scope are approved, runtime execution
is paused until the audit and batch disposition under ADR-052.

Register **ASM-CR-001**, alias `APPLICATION-ACCESS-CONTENT-RESERVATION`, in the
new content-reservation diagnostic family (CR); do not reuse ASM-AC acceptance
IDs or merge it into Projects ASM-PC-001/002/003. The completed Access
classification in the active change proves equivalent current/frozen-source
wide overflow of 62/62 without a key, 110/110 with verifying key and 118/118 with
failed script. Six saved input cases across four presentation profiles receive
ASM-CR-001-O01..O06 in the canonical known-inherited ledger. Compact Soft X5 is
retained as an associated unresolved horizontal-root grouping, not silently
waived or assumed a second authorized defect. Historical-source replay used
current dependencies/engine and explicitly different bundlers; it is neither a
historical installation recreation nor historical aggregate PASS. Do not repeat
the completed causal investigation or change accepted Phase-9 evidence.

The inherited 370px Access reservation did not evolve with the PRELAUNCH form.
Approve **scene-owned deterministic metadata**, carrying a documented envelope
derived from all ten UI states, acknowledgment-pending result and required
verification/interaction variants, using existing geometric transport. 118px is
not a maximum or a height increment. Inline feasibility, complete scene/form
wrapping, typography, padding/borders, controls/status/provider and focus bounds
must be derived; 44px widget minimum is not maximum proof. Projection consumes
stable input, never owns generic reactive DOM measurement. Preserve SSR/first-
client equality, bounded meaningful resize/revision rebuilds, stable ordinary
interaction, no per-frame measurement or measurement/Projection feedback loop.
Future approved LIVE evolution uses the same versioned scene contract.

ASM-IMP-DEC-015 bounds later repair to Access content reservation and minimum
local entry/exit support only where proven necessary. No generic vertical
rewrite, unrelated chapter/Projects/Composer change, automatic terminal movement,
form shrinking/redesign, clipping/hidden error, viewport workaround or weakened
validator. Shared authored geometry must not propagate a preview-only change
into unrelated integrated geometry. Stop if the complete envelope cannot fit
without expanding this boundary. The systematic audit must inform the later
batch disposition before implementation, even inside this approved envelope.

Preserve ADR-043 PRELAUNCH/security, ADR-046, ADR-048/049/050 and all existing
repairs, negative fixtures, content/glyphs/Composer, three visits/NON-ASSEMBLY,
12px physical full-ink clearance, global zero intersections and historical
records. No Access repair is performed by this normalization; Human Geometry
Approval is pending and progress remains 7/92.

## ADR-052 — Systematic inherited-defect audit, stage disposition and efficiency

**Status:** APPROVED by the same explicit 2026-09-13 owner decision.

Approve **ASM-AUDIT-001**, normalized in
[the successor audit policy](07-successor-inherited-defect-audit-policy.md),
and ASM-IMP-DEC-016. At three distinct inherited roots in one successor stage,
pause individual inherited repairs and perform one bounded audit before one
batch owner disposition. Count neither occurrences/engines nor pipeline defects
as additional roots. ASM-PC-001/002/003 already trigger this gate. Preserve their
repair scope and valid implementation; the new prerequisite pauses execution,
not prior authority or historical acceptance.

Keep causal class, raw validation result, runtime fallback and stage disposition
separate. CURRENT_REGRESSION always blocks. INHERITED_CRITICAL and mandatory
invariant failures block. INHERITED_NONBLOCKING can defer only through explicit
individual owner disposition with equivalent-not-worse evidence, no required
invariant/material functional/accessibility/security loss, enabled detecting
validator, accountable owner/review point and measurable approved baseline.
Worsening, unknown evidence, uncovered occurrences or expired approval reblock.
No finding is deferred by this decision. Pipeline defects require separate
pipeline disposition, never geometry changes to accommodate bad measurements.

SAFE_FALLBACK never changes INVALID/INSUFFICIENT_CAPACITY to candidate PASS.
Expected capacity rejection may satisfy its classification assertion without
waiving geometry or the required qualifying horizontal candidate. Raw failing
assertions/exit codes remain visible. Gate eligibility with approved debt is
limited to supplementary noncritical findings, never relabeling an existing
must-pass test/invariant. AGENTS phase discipline and ASM-AC-025 remain intact.

The approved active-change `stage-1-inherited-audit-manifest.json` fixes 150
current cases plus 150 frozen comparison obligations, 3,240 Access state slots,
48 lifecycle + 24 static-accessibility sequences and the already named guard
sources. Compare frozen Phase-9 source with exact dirty current input; record
and control modes, viewport, theme, content/verification, fonts, runtime/build,
seed and interaction inputs. Complete safe independent declared observations
rather than stopping at the first inherited failure. Unknown evidence remains
UNCLASSIFIED/blocking; OUT_OF_AUDIT_SCOPE / NEEDS_REVIEW findings are recorded
without automatically expanding the audit or launching broad investigation.

Mechanically collect structured measurements, compare paired inputs, group
occurrences and deduplicate root causes. Model analysis is reserved for
differences, failures, unclassified cases and candidate root clusters; no
per-observation narratives or repeated passing data in context. No per-slot
screenshots: only necessary representative roots, ambiguity/material visual
defects or separately required canonical artifacts. Final human-review captures
belong to the later acceptance step. Never hide raw failures to reduce output.

Current Ultra: only approved normalization, strict/structured/ID/reference/diff/
historical-integrity validation, then STOP. Next: Astra High COMPLEX_DIAGNOSIS,
AUDIT ONLY, including no product/runtime pipeline repairs. Then STOP for one
complete-batch owner/governance disposition. Only afterward normally route the
bounded blocking repair package to Sol High. Focused/deterministic checks precede
fresh final browser matrix/evidence; STOP at Human Geometry Approval. No Stage
2+, refreeze, motion, commit, push, deploy or human self-approval. Owner approval
is retained verbatim in the active change; all historical seals/payloads and
AI-MRP-001 v1.1.0 remain unchanged.

## ADR-053 — Portfolio-only institutional narrative

**Status:** APPROVED by the product owner on 2026-09-22. Implementation contract:
`ASM-IMP-DEC-017` in the active successor architecture specification.

The institutional website at `wflyer.com.br` has one narrative origin and one
active branch: **Home / Origin → Professional / Portfolio**. On mobile the order
is Home → Professional chapters → global footer. The former institutional
Application branch, its chapters, navigation, geometry, reservations, responsive
ordering, Access surface and branch-only validation are removed from active
scope. Home is no longer a branch-selection junction. No hidden compatibility
branch, empty left-side reservation or dormant Application geometry remains.

This decision does not delete an independent musical-application product merely
because its former institutional presentation has been removed. Shared modules
remain where the Professional narrative or independent product still uses them.
The Professional chapter sequence, Projects NON-ASSEMBLY and visit/capacity
contracts, Composer constraints, native-scroll/GSAP ownership, accessibility,
security and human geometry gate survive unless a direct dependency on the
removed topology is demonstrated. ADR-048/049/050 remain in force.

The incomplete `ASM-AUDIT-001` execution against the former topology is
**SUPERSEDED_SCOPE**, not PASS, FAIL or a completed audit. Preserve its manifest,
raw results and frozen historical evidence. Its Access-only finding `ASM-CR-001`
is no longer an active repair item; the inherited 62/110/118px diagnosis remains
historical evidence, not a repaired or deferred finding. Neither this decision
nor that incomplete inventory authorizes another repair. Rebaseline the existing
`implement-scroll-driven-score-assembly-and-motion` change, remove obsolete
institutional Application code and active requirements, validate the surviving
single narrative, then stop for architectural review with Human Geometry Approval
still pending. Historical Phase-9 records retain their truthful former topology.

## ADR-054 — Capability-Based AI Routing Indirection and Single Canonical Model Registry

**Status:** APPROVED on 2026-09-23.

1. Routing decisions are expressed by semantic routing class.
2. Concrete model selection belongs to one canonical registry (`ai-model-routing-registry.yaml`).
3. Active normative documents must reference routing classes rather than model names.
4. Handoffs must not hardcode the next concrete model as authority.
5. Actual model used during an execution may be retained as historical evidence.
6. Frozen historical evidence is not rewritten.
7. Newly released models enter as candidates until explicitly approved.
8. Future model replacement normally changes one registry mapping only.
9. Generated/derived routing views are non-authoritative.
10. Repository validation prevents hardcoded normative model routing from reappearing.

## ADR-055 — Desktop presentation independent of horizontal capacity

**Status:** APPROVED for normalization on 2026-09-23 under the owner's HGA
architecture-review instruction. Implementation contract: `ASM-IMP-DEC-018`.

Select alternative **A**: preserve capacity-based orientation and require a
desktop-quality `vertical-wide` presentation when a desktop environment lacks
horizontal capacity. Input capability, story orientation and presentation class
are separate concepts. Existing modes remain `horizontal-enhanced`,
`vertical-wide`, `vertical-compact` and `static`; no additional runtime mode,
device classifier or presentation enum is required. Wide tablet use of
`vertical-wide` remains valid. Reduced motion retains `static` with suitable
wide or compact presentation.

1366×768 is a supported desktop review case, not a required horizontal mode or
a new breakpoint. Support must not depend on reducing browser zoom. Replace the
earlier HGA interpretation “1366 requires horizontal-enhanced” with “1366
requires a coherent, usable desktop presentation in the canonically selected
mode.” No viewport special case or zoom-dependent policy is authorized.

| Alternative | Disposition and reason |
| --- | --- |
| A — Desktop presentation in existing `vertical-wide` | Selected: fits existing fallback ownership, smallest scope and maintenance cost; preserves safety contracts. |
| B — Redesign Projects to qualify 1366 horizontally | Not selected: expands protected geometry and repeat-validation obligations without being necessary for desktop support. |
| C — Add compact horizontal mode | Not selected: adds policy, projection and lifecycle combinations without an established need. |
| D — Weaken capacity/clearance | Rejected: conflicts with complete visible ink, interaction safety and the approved 12px minimum. |

ADR-048/049/050 and `ASM-IMP-DEC-012/013/014` are **PRESERVED**, not amended.
The corrected 1366 horizontal candidate's sole rejection is
`projects-protected-clearance-or-clip`: visits 1/2/3 measure approximately
−37.10/11.92/−20.26px against 12px. This is correct capacity rejection, not a
tolerance defect or a new Projects repair authorization. Its raw result remains
`INSUFFICIENT_CAPACITY`; whole-story `vertical-wide` selection is expected.
`SAFE_FALLBACK != VALIDATION_PASS`: selected-mode geometry and presentation
still require their own evidence; a rejected horizontal candidate proves neither.

HGA-001A is RESOLVED (offset loop); HGA-001B is EXPECTED_CAPACITY_REJECTION /
NOT_A_PRODUCT_DEFECT; HGA-001C is OPEN (desktop presentation quality); HGA-002
is OPEN (composition density). Aggregate HGA-001 and task 5.6 remain open for
owner review. Existing desktop grids/header behavior do not disprove the
owner's visual concern, but vertical orientation alone is not evidence of a
mobile layout defect.

Future bounded work follows 018: improve desktop presentation without Projects
geometry or eligibility changes, then address measured non-Projects macro
spacing as a distinct delta. Preserve HGA-002 measurements and all historical
evidence. This review normalizes documentation only; no product implementation,
human approval, refreeze or later stage is performed or implied.

## ADR-056 — Projects presentation by story mode; browsing routes deferred

**Status:** APPROVED by the owner for the current Stage-1 landing-page scope on
2026-09-24. Implementation contract: `ASM-IMP-DEC-019`. This decision supersedes
ADR-034's current-release `/portfolio` listing/detail routes and vertical
fan/stack presentation. The existing `/portfolio` and `/portfolio/[slug]`
implementations are withdrawn from the active public surface. No replacement
Projects URL, listing, detail page, or dead navigation affordance is authorized.
Future browsing surfaces require a separate product/architecture decision after
the landing page is complete.

`horizontal-enhanced` alone renders the full Projects fan, its three distinct
NON-ASSEMBLY visits and approved focus interaction. `vertical-wide` and
`vertical-compact` each render exactly one deterministic teaser selected from
the same canonical project records: the first featured, publicly eligible
record in canonical portfolio order; if no featured record is eligible, the
first publicly eligible record in that order. `static` does not render the rich
fan either. The vertical fan is absent from DOM interaction, selected-mode
measurement, chapter sizing, Projection inputs, focus ownership and visit state.
An isolated inert horizontal candidate may still instantiate the full fan to
evaluate the complete canonical horizontal capacity predicate.

ADR-048/049/050 and `ASM-IMP-DEC-012/013/014` remain binding and unchanged
**where the full horizontal fan exists**. Candidate capacity, visit 1/2/3
semantics, 12px protected clearance, complete ink and global zero visible
self-intersections cannot be weakened. The previously observed ~642px focused
fan card is not geometrically repaired; HGA-001D records that this state is
obsolete in vertical modes and remains required in horizontal enhancement.
HGA-002 density remains separate and pending. Human Geometry Approval is not
conferred by this decision or its automated validation.

## ADR-057 — Continuous Spatial Story and landmark camera model

**Status:** APPROVED by the owner on 2026-09-24; normalized in a governance-only
pass before final Human Geometry Approval. Implementation governance:
`ASM-IMP-DEC-020`. Single normative definition:
[Continuous Spatial Story](../02-experience/01-global-story-architecture.md).

Adopt one continuous spatial narrative from Home through the Professional
landmarks to Terminal. The viewport is a camera, chapters own semantic entry,
content/interaction spans and transitions, and capability-adaptive presentation
uses EXPANDED_LANDSCAPE, COMPACT_LANDSCAPE and PORTRAIT_TRAVERSE conceptually.
Portrait shares the story, uses native vertical input and readable local reflow;
whole-chapter viewport containment and global composition shrinking are rejected.
Header shortcuts resolve landmark entry anchors. Contact requires a stable
interaction region. Reduced motion retains full semantic access.

This decision supersedes conflicting spatial/presentation clauses in ADR-031,
ADR-032 and ADR-038, the universal application of simultaneous/fan-specific
capacity in ADR-048/049/050, the fixed mode mapping and HGA-002 macro-gap plan
in ADR-055, and final-target interpretation of ADR-056's one-teaser rule.
It does not erase those decisions, their evidence or still-valid safety.
ADR-053's portfolio-only scope, ADR-056's route withdrawal and the general
full-ink/clearance/interaction/determinism contracts remain. Section 11 of the
canonical story contract distinguishes fan-specific constraints from general
invariants; sections 12–13 own HGA disposition and new validation classes.

Amend the existing active OpenSpec change; no new change/sub-change is needed.
Its subject already includes story geometry, responsive behavior, navigation
and later motion. Historical Phase-9, transitional Stage-1 and unimplemented
canonical target remain distinct. Pause/supersede HGA-002 spacing remediation.
Human Geometry Approval stays pending against the new target; no geometry
refreeze, Assembly, GSAP integration, public integration or completion is claimed.

## ADR-058 — Historical baseline provenance exception

**Exception ID:** `ADR-058`.
**Status:** APPROVED by the owner's explicit Historical Baseline Provenance
Exception instruction on 2026-09-24; non-blocking for task 5.7.
**Scope:** exact-preservation certification of the single historical audit
artifact below. ADR-057 / ASM-IMP-DEC-020 remains approved and unchanged.

Use this existing decision register for the owner-approved exception; do not
extend the geometry-specific ASM-AUDIT-001 finding schema or create a general
exception framework. The [completed narrow diagnosis](../../../openspec/changes/implement-scroll-driven-score-assembly-and-motion/continuous-story-baseline-integrity-diagnosis.md)
remains historical evidence. Its evidence ceiling is accepted; no further
baseline forensics is authorized without new independent provenance.

### Exact artifact and unresolved evidence

Repository-relative current file:
`openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-inherited-audit-data/access-paired-comparisons.json`.

Repository-relative captured copy:
`.git/continuous-story-governance/20260924T171616Z/files/openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-inherited-audit-data/access-paired-comparisons.json`.

The original capture manifest is
`.git/continuous-story-governance/20260924T171616Z/baseline.json`.

| Property | Current file | Captured baseline copy |
| --- | --- | --- |
| Size in bytes | 11139205 | 11139205 |
| SHA-256 | `1f2482af6d698365d9f0a9d00cd6af8244761d8a03a8903b0be98cc8681ed57a` | `b4a2aeab70b27103a853e9dbd334df12de38ff8c04266baf9fd9909391b93603` |
| Byte at zero-based offset 10998499 | `0x69` (`i`) | `0x6b` (`k`) |
| Context | `light/integrated-static` | `light/kntegrated-static` |

There are no unmatched trailing bytes. Root cause remains
`UNRESOLVED_PROVENANCE_FAILURE`. The captured copy and recorded pre-edit hash
derive from the same capture read. No independent pre-capture digest exists,
no responsible writer was established, and neither side is established as the
authoritative original. The forensic session modified neither file. This
exception does not choose the semantically correct byte or claim integrity PASS.

### Disposition, prohibitions and reopen condition

```text
BASELINE_INTEGRITY=UNRESOLVED_NON_BLOCKING_EXCEPTION
ROOT_CAUSE=UNRESOLVED_PROVENANCE_FAILURE
PREEXISTING_DIRTY_WORK_EXACT_PRESERVATION_CERTIFIED=false
PREEXISTING_DIRTY_WORK_KNOWN_LOST=false
TASK_5_7_DEPENDS_ON_DISPUTED_CONTENT=false
```

No runtime/product impact or loss of prior work has been demonstrated. Task
5.7 introduces pure spatial contracts and deterministic mappings under the
[existing implementation package](../../../openspec/changes/implement-scroll-driven-score-assembly-and-motion/continuous-story-implementation-package.md);
its implementation, tests and acceptance do not consume or depend on this
superseded historical audit output or the disputed byte. Preserve both versions
and the manifest as auditable evidence, without declaring either authoritative.

Do not repair, replace, regenerate, normalize, manually edit or delete either
file or rewrite the capture manifest to conceal the difference. New independent
provenance is required before any repair can be considered; it does not by itself
authorize a repair. **Reopen only when new independent provenance evidence
becomes available.** Repeated comparisons, semantic plausibility, a new baseline
capture or readiness work are not grounds to resume investigation.

This exception removes only the historical provenance readiness blocker. It
waives no runtime, accessibility, geometry, security, raw-result or human gate.
Human Geometry Approval remains PENDING. All other validated governance stands.
No other blocker is identified; the next executor is ready for **task 5.7 only**
under `BOUNDED_IMPLEMENTATION`. Task 5.7 remains NOT_STARTED. This normalization
session implements no product work. The existing no-commit disposition remains:
overlap with pre-existing dirty governance; do not retry the checkpoint commit.
