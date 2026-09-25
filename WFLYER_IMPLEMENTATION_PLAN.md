# W_Flyer v2 — Linear Implementation Plan

> **Current spatial authority (ADR-057 / ASM-IMP-DEC-020, 2026-09-24):**
> [Continuous Spatial Story](docs/canonical-v2/02-experience/01-global-story-architecture.md)
> supersedes viewport-contained chapters, fixed desktop/mobile geometry and
> the HGA-002 macro-gap plan. HGA-001A–D remain invariant/supporting/transitional
> evidence, not approval of the new target. The notices immediately below are
> predecessor scope checkpoints. The current successor is rebaselined in place
> from 30/51 to 25/55: tasks 5.1–5.5 reopen for fresh target validation and four
> implementation prerequisites precede them. Task 5.6 remains pending.
> Minimal spatial metadata and target geometry belong to Stage 1; later temporal
> Assembly metadata remains behind refreeze. This pass is documentation only;
> it permits one isolated local governance commit after validation, no product
> implementation, push or deployment. Earlier frozen phases remain unchanged.


> **Current institutional scope (ADR-053 / ASM-IMP-DEC-017, 2026-09-22):**
> `wflyer.com.br` is portfolio-only. The active story is Home / Origin →
> Professional / Portfolio; mobile continues through the Professional chapters
> to the global footer. Earlier Application-branch stages below describe the
> historical plan and are superseded for active institutional implementation.
> The independent musical-application product is outside this removal. The
> successor rebaseline and automated geometry checkpoint are complete; Human
> Geometry Approval remains pending at task 5.6 (30/51).
>
> **Current HGA boundary (ADR-055 / ASM-IMP-DEC-018, 2026-09-23):** desktop
> support does not require horizontal orientation. Preserve complete capacity
> gating and desktop-quality `vertical-wide` fallback. HGA-001A is resolved;
> HGA-001B is expected capacity rejection; HGA-001C and HGA-002 remain open.
> Future bounded presentation/macro-spacing work follows 018, without Projects
> geometry, eligibility, Composer or motion changes. Current review is docs-only.
>
> **Current Projects boundary (ADR-056 / ASM-IMP-DEC-019, 2026-09-24):**
> the Stage-1 Motion Lab renders the full Projects fan only in
> `horizontal-enhanced`; vertical story modes render one static teaser. The
> owner withdrew the prior `/portfolio` listing and detail routes from the
> active public scope. Earlier route, card-link, and mobile-stack requirements
> below remain historical phase contracts and are superseded for current work.

**Status:** normative and approved  
**Canonical language:** English  
**Execution rule:** Codex must execute phases strictly in order. A phase is not complete until its gate is satisfied and evidence is recorded. Codex must not skip, merge, or reorder phases.

## Target outcome

Rebuild `wflyer.com.br` as a personal professional portfolio and service-acquisition site under the W_Flyer brand, with:

- one continuous Home → About → Services → Process → Projects → Contact → Terminal journey, with landmarks and content/interaction spans;
- a viewport camera and capability-adaptive expanded landscape, compact landscape and portrait traverse presentations under ADR-057;
- one canonical master story position;
- header traversal through intermediate chapters, proportional to distance and capped at 3.0 seconds;
- one continuous organic musical score from Home through the Professional terminal;
- one portfolio narrative with Home as its sole origin;
- preserved service and legal detailed routes for SEO and long-form content;
- deterministic music rendering/composition;
- a humanized, hooded, non-photorealistic W_Flyer Persona;
- progressive enhancement, reduced-motion support, accessibility, performance, and full recovery behavior.

## Phase 0 — Canonical merge, audit, and baseline protection

### Required work

- Verify the v2 package was extracted at repository root.
- Read all mandatory documents listed in `WFLYER_CODEX_START_HERE.md`.
- Confirm the source archive baseline described in `docs/canonical-v2/06-migration/01-current-state-audit.md`.
- Inventory current routes, chapter configuration, route-transition shell, intro, music components, tablet demo, contact flow, tests, build, and deployment.
- Record a baseline of commands that can run in the environment.
- Create a migration branch and a rollback tag/commit reference before destructive replacement.
- Do not change public behavior in this phase.

### Gate 0

- Canonical documentation is present and internally linked.
- Legacy/current-state files are classified `KEEP`, `REFACTOR`, `REPLACE`, `REMOVE_AFTER_CUTOVER`, or `DEFER`.
- Baseline results are recorded without weakening current tests.
- No production, DNS, Cloudflare, Napoleon, or `app.wflyer.com.br` mutation occurred.

## Phase 1 — Isolated W_Flyer Music System v0.1

**Final status:** `APPROVED FOR FUTURE LANDING INTEGRATION` — external human
Gate-C approval recorded on 2026-08-24. This approves the isolated foundation;
it does not claim that public landing integration has occurred.

Execute the dedicated change (archived after 55/55 completion):

`openspec/changes/archive/2026-08-24-implement-music-system-v0-1/`

### Required work

- Geometry Core, Glyph Registry, Renderer, Procedural Score Composer, and dev-only Music Visual Lab.
- Approved normalized SVG glyphs and immutable path policy.
- Straight and cubic Bézier ScorePath support.
- Deterministic `staffSpace`/`staffStep`, ledger lines, stems, beams, hooks, barlines, final barline, accidentals, and key signatures.
- Option-B group stem direction.
- Seeded composer with the approved rhythmic whitelist and semantic slots.

### Gate A — geometry

All pure-geometry and composer logic tests pass; no React/DOM/GSAP import exists in pure modules.

### Gate B — human calibration, blocking

Codex presents draft glyph metrics/anchors in the Music Visual Lab. Codex stops. A human explicitly approves or requests changes. Codex may not self-approve.

### Gate C — visual composer, blocking

Fixed-seed visual evidence, curved staff behavior, key signatures, all motifs, accessibility, 10,000-segment stress tests, production 404 for the lab, and performance evidence pass. Human approval is recorded.

**Status:** approved by external human review on 2026-08-24. Responsive
activation thresholds remain noncanonical, and the current returning connector
remains a validation-only noncanonical fixture. Final public responsive Score
Paths remained subject to the separate blocking Phase-9 human subgate until its
Task-33 approval on 2026-08-30; that later approval does not retroactively turn
the Gate-C connector fixture into production geometry.

### Phase 1 completion rule

No public landing integration is allowed before Gates A, B, and C are complete.

## Phase 2 — Story v2 domain model and static vertical skeleton

**Execution status:** complete; Gate 2 passed on 2026-08-24. The typed story
model and static vertical document are available on the development-only
`/__visual-lab/story` surface while the legacy public `/` landing remains the
rollback baseline. Evidence is recorded under
`docs/canonical-v2/06-migration/evidence/phase-2/`.

### Required work

- Introduce v2 story types, chapter IDs, timeline labels, hash mapping, and semantic slot IDs in parallel with legacy configuration.
- Create a semantic static landing structure in the approved mobile order:
  Home → About → Services → Process → Projects → Contact → professional ending → Application → How It Works → Benefits → Demonstration → Access W_Flyer → application ending → global footer.
- Implement without horizontal pinning or advanced motion first.
- Preserve detailed routes and legal pages.
- Change public positioning from company to personal portfolio/services.
- Remove the primary app-access CTA from Home/header in the v2 skeleton.

### Gate 2

- All chapters exist in semantic DOM order.
- JavaScript-disabled or motion-failed content remains readable and navigable.
- Keyboard and screen-reader order match the mobile document order.
- No old company semantics remain in v2 content.
- Current detailed routes still render.

## Phase 3 — Content, detailed routes, and conversion contracts

**Execution status:** complete; Gate 3 passed on 2026-08-24. Typed public
content/publication contracts, retained detailed routes, allowlisted project
details, metadata, Contact regression protection, and production isolation
evidence are recorded under
`docs/canonical-v2/06-migration/evidence/phase-3/`. The legacy public `/`
landing remains the rollback baseline; no Phase-4 readiness work has started.

### Required work

- Refactor Portuguese public copy to the approved semantic intent.
- Preserve `/sobre`, `/servicos`, `/processo`, `/portfolio`, `/contato`, application detail routes, service detail routes, and legal routes.
- Use the public label `Projetos` while retaining `/portfolio` as the stable v1 detailed URL unless the owner separately approves a URL migration.
- Professional services: Sites, Applications, Integrations, Custom Solutions.
- Projects: only W_Flyer, MSN Distribuidora, and MSN Suprimentos unless explicit publication approval exists.
- No invented metrics, testimonials, results, team, or company claims.
- Preserve the secure Contact Route Handler and provider boundaries.

### Gate 3

- Content contracts and SEO metadata are consistent.
- Detailed routes are independent and work without the immersive landing.
- Contact validation/security regression tests remain green.
- Public copy is marked for human editorial review where not final.

## Phase 4 — Readiness-driven intro, bootstrap, deep links, and recovery

**Execution status:** complete; Gate 4 passed on 2026-08-25. The validated
implementation remains isolated at `/__visual-lab/story/bootstrap`; public `/`
is still the legacy rollback baseline.

### Required work

- Refactor the intro from a fixed-delay authority into the approved readiness state machine.
- Position Home, a valid hash target, or a restored history position before the intro exits.
- Critical assets only block readiness; video and distant media never block LCP/readiness.
- Preserve skip/Escape, once-per-session behavior, fail-open timeout, and reduced motion.
- No visible jump from top to Home.

### Gate 4

- Direct `/`, hash deep links, reload, Back/Forward, reduced motion, missing SVG, delayed JavaScript, and timeout recovery pass.
- The intro cannot permanently cover a functional page.
- No noncritical asset blocks `STORY_READY`.

## Phase 5 — Desktop Motion Lab and native-scroll master story

**Execution status:** complete; Gate 5 passed on 2026-08-26. The validated
surface remains development-only at `/__visual-lab/story/motion`; public `/`
is unchanged.

### Required work

- Build a dev-only story/motion lab with placeholder chapter blocks.
- Use native vertical scroll as the source of truth.
- Pin the desktop viewport only in eligible wide/full-motion conditions.
- Map vertical progress to one horizontal master timeline with stable labels.
- Calculate Home progress from actual branch lengths, not a fixed 0.5.
- No snap requirement and no global wheel/touch interception.
- Implement breakpoint rebuild that preserves the semantic chapter.

### Gate 5

- Wheel, trackpad, scrollbar drag, Page Up/Down, Space/Shift+Space, Home/End, resize, orientation, 200% zoom, and reduced motion pass.
- Scroll partial progress produces partial story progress.
- No React render occurs per scroll frame.
- All owned GSAP/ScrollTrigger resources clean up exactly once.

## Phase 6 — Header traversal, URL, and history

**Execution status:** complete; Gate 6 passed on 2026-08-27. Evidence is under
`docs/canonical-v2/06-migration/evidence/phase-6/`.

### Required work

- Header targets: Home; Application, How It Works, Benefits; About, Services, Projects, Contact.
- Process, Demonstration, and Access W_Flyer remain narrative chapters but are not primary header items.
- Animate the native scroll position through intermediate chapters using the same master timeline.
- Duration is proportional to normalized story distance, minimum short duration, hard maximum 3.0 seconds.
- User wheel/touch/navigation key/Escape/new header target cancels or supersedes traversal.
- Passive scroll uses `replaceState`; successful explicit header navigation uses `pushState`.

### Gate 6

- Adjacent and extreme traversal evidence passes.
- Extreme traversal never exceeds 3.0 seconds.
- Intermediate chapter animations are traversed, not teleported.
- Cancel/supersession produces no snap correction or stale history.
- Back/Forward restores a coherent canonical position.

## Phase 7 — Professional branch scenes

**Execution status:** complete; Gate 7 passed on 2026-08-28. Evidence is under
`docs/canonical-v2/06-migration/evidence/phase-7/`.

### Required work

- About, Services, Process, Projects, Contact, professional terminal.
- About contains the required Persona integration point; use only an approved asset, never a Codex-invented final character.
- Services use four brand-derived modules, not project-card styling.
- Process uses four ordered stages and is not a required header item.
- Projects use 3–5 highlighted cards; initial set is three authorized projects.
- Desktop cards form a partially overlapped hand/fan; hover and focus raise/foreground the card. Mobile uses a staggered vertical stack.
- Contact remains the professional conversion terminal and preserves secure form behavior.

### Gate 7

- Every professional chapter meets its chapter contract and acceptance IDs.
- No interaction depends only on hover.
- Project cards remain readable, focusable, and unclipped.
- No easter egg appears while Contact is being edited.
- Final barline precedes the professional terminal.

## Phase 8 — Application branch scenes

**Execution status:** complete; Gate 8 passed on 2026-08-28. Evidence is under
`docs/canonical-v2/06-migration/evidence/phase-8/`. The implementation remains
isolated at `/__visual-lab/story/motion`; public `/` is unchanged. Final
APP-04 media remains the human-gated Phase-11 asset boundary.

### Required work

- Application overview includes problem + value proposition and no app-access CTA.
- How It Works contains the approved five steps.
- Benefits contains four summary groups.
- Demonstration uses the approved video state machine.
- Access W_Flyer is the only primary app-access conversion scene.
- Application terminal follows the final barline.

### Gate 8

- No primary app-access CTA appears earlier in the mobile application sequence or header.
- Demo never starts on mount/preload/refresh/proximity alone.
- Demo starts only when APP-04 is active for the first time.
- Final-frame/replay/error/reduced-motion cases pass.
- Simulated UI is non-interactive; replay is the sole interactive control inside the screen area.

## Phase 9 — Continuous dual-score integration

**Execution status:** complete; Gate 9 `PASS` on 2026-09-04. Task 33 passed
explicit external human review on 2026-08-30. `Organic Flowing`, including the
shared-origin departure and all three production geometry modes, was approved
for integration. Task 34 completed its automated integration checkpoint on
2026-08-31. A later external human review approved a bounded choreography and
Application PRELAUNCH refinement tracked by
`refine-phase-9-score-choreography-and-prelaunch`. Its initial implementation,
affected automated validation, and deterministic recapture completed on
2026-09-03. A subsequent exact Firefox runtime report exposed three horizontal
projection boundary regimes, and the required broad rerun exposed a separate
latent Demo CTA clearance defect. Both were corrected geometrically without
weakening the approved thresholds. The 2026-09-04 corrective addendum is sealed
after one clean 21/21 three-engine refinement run. The owner then explicitly
accepted the current geometry as the Phase-9 technical baseline, not as the
site's final visual composition. Task 35 is complete, Gate 9 passes, and the
immutable implementation/evidence baseline is:

`PHASE_9_FINAL_GIT_SHA = 306ccb74da6c7bbf8f187e360c0776c571b5fc3d`.

### Preconditions

- Music Gates A/B/C complete.
- Phases 2 through 8 and their gates complete.

### Score Path candidate subgate — human blocking

Before public dual-score integration begins, author at least `Organic Soft` and
`Organic Flowing` candidates for both `vertical-wide` and `vertical-compact`.
Each mode/style candidate requires light and dark evidence and must be authored
against the real chapter layouts and reserved content zones for headings/body,
W_Flyer Persona, Services, Process, Project cards, Contact form, application
tablet/demo, and terminal areas. Stop for explicit human Score Path approval.

The current Gate-C piecewise returning connector is a validation-only
noncanonical fixture and cannot satisfy this subgate.

**Subgate result:** `APPROVED` — external human Task-33 review, 2026-08-30.
`Organic Flowing` is the selected production grammar for
`horizontal-enhanced`, `vertical-wide`, and `vertical-compact`, in light and
dark. Approval includes the real shared origin, clef-to-staff departure,
descending notation-safe zones, event-free connectors, and physical final
barline. Production clef optical scale may be calibrated during integration if
needed, without changing the approved SVG, `gLine`, `staffSpace`, topology,
orientation, or semantic role. This result authorizes Task 34 only; it does not
complete Task 34, Task 35, or Gate 9.

### Required work

- Integrate one shared origin plus six application and six professional score segments.
- Use long, smooth, organic master-guide curves with few inflection points.
- Use asymmetric cubic Bézier geometry with tangent and curvature continuity
  across joined segments.
- Avoid repeated identical 180-degree U-turns, mirrored hairpins, identical
  turn radii, rigid rectangular returns, and unnecessarily long straight
  connector plateaus.
- Vary vertical drop and lateral return from the actual chapter layout.
- Preserve geometric entry/exit compatibility, `staffSpace`, tangent, and semantic slot IDs.
- Preserve all five lines without cusp, crossing, collapse, or
  self-intersection; keep events inside notation-safe zones and connectors
  event-free.
- Use the same semantic composition across horizontal and vertical layouts.
- Armature/key signature occurs at most once per continuous branch, after clef and before first relevant material.
- Final barline is deterministic and precedes each terminal.

### Human choreography and PRELAUNCH refinement — accepted technical baseline

- Keep the Task-34 composition, fingerprints, Music assets, renderer
  calibration, and sealed evidence unchanged; refine projection/presentation
  rather than musical semantics.
- Present one substantially enlarged approved Home treble clef as the shared
  scenographic origin, with both branch scores departing below its lower region
  and outside the Home reading exclusion.
- Route Professional through a low About corridor with a reserved Persona
  exclusion, a shared event-free card interaction behind Services, restrained
  Process, a three-card Projects serpentine, a low Contact wave, and a physical
  final-barline end.
- Route Application below Overview/Benefits, use the same event-free card
  interaction behind How It Works, protect APP-04, and end at the PRELAUNCH
  scene and physical final barline.
- Use the explicit semantic header order Aplicação, Como funciona, Benefícios,
  Lançamento; W_Flyer; Sobre, Serviços, Processo, Projetos, Contato.
  Demonstration remains a non-header story chapter.
- Replace the unavailable Application access action with a purpose-limited,
  consented launch-interest form backed by a dedicated secure endpoint and
  sequential operational/acknowledgment email delivery. No database is added.
- Remove only the redundant second visual footer from the immersive landing;
  retain one semantic terminal/footer close and unrelated route footers.
- Stop for new deterministic human visual review. Do not start Task 35 or
  claim Gate 9 PASS before explicit acceptance.
- Treat
  `task-34-refinement-firefox-correction-2026-09-04/` as the authoritative
  current-geometry addendum. Its 14-payload manifest digest is
  `807a15b57e1a5bbc88011d546e69d4a4b281c552344876cddfc3a17042392923`;
  the historical Task-34 and first refinement bundles remain byte-identical.

**Refinement result:** `APPROVED` — explicit external human review on
2026-09-04 accepts this geometry as the technical baseline and completes
focused item 7.3. This acceptance does not designate the presentation as the
final site composition and does not authorize any successor Assembly/Motion
implementation.

### Gate 9

- The selected `Organic Soft` or `Organic Flowing` layouts have explicit human
  approval for both vertical modes and both themes.
- No visible segment seam beyond the approved tolerance.
- Notes, ledger lines, stems, beams, accidentals, barlines, and key signatures remain coherent on curved paths.
- Same session composition remains stable across reload, theme, breakpoint, and reduced motion.
- No score/composer work occurs per scroll frame.
- The focused choreography/PRELAUNCH refinement has new dark-desktop, light,
  compact, accessibility, security, email-preview, and geometry evidence and
  explicit external human visual acceptance.

**Gate 9 result:** `PASS` — 2026-09-04. Task 35's
session/responsive/reduced-motion validation is satisfied by the final
cross-engine state, including 20/20 projection tests, 23 files and 128/128
focused unit/component tests, 12/12 score-integration cases across Chromium,
Firefox, and WebKit, and one clean serial 21/21 three-engine refinement run
with workers=1 and retries=0. Lint, typecheck, strict OpenSpec validation, and
all required visual/accessibility/security/email-preview evidence pass.

The authoritative Phase-9 evidence references are:

- Task-33 human approval: `task-33-refinement-2026-08-30/`, manifest digest
  `10ce142087e3e249842f04c2d47a47d988ac499c71f13f7da7a6fd267659cba0`;
- historical Task-34 integration: `task-34-integration-review-2026-08-31/`,
  manifest digest
  `c4bec2d7f6b546c44d9b7bd053ad0b4ff0c42d1d143cc079dd0714068c3fef8a`;
- first choreography/PRELAUNCH refinement:
  `task-34-refinement-2026-08-31/`, manifest digest
  `1ce1043412c6ad77b34c0d77bad565cb9aef3af6808c8b54d48b0d7e13fdc442`;
- authoritative current-geometry corrective addendum:
  `task-34-refinement-firefox-correction-2026-09-04/`, manifest digest
  `807a15b57e1a5bbc88011d546e69d4a4b281c552344876cddfc3a17042392923`.

All sealed evidence remains immutable.

### Post-Phase-9 Assembly/Motion successor boundary — bounded Stage 1 authorized

**Current execution gate — 2026-09-13:** ADR-051 / ASM-IMP-DEC-015
registers the distinct inherited **ASM-CR-001 Access content-reservation** root
and approves scene-owned deterministic full-state PRELAUNCH reservation using
existing geometry transport, with only minimum proven local entry/exit support.
No reactive form/Turnstile DOM→Projection loop, per-frame measurement, arbitrary
370px replacement, unrelated chapter/Projects/Composer change, form redesign or
weakened acceptance. 118px is not a maximum. SSR/first-client and ordinary
interaction remain stable; later LIVE evolution uses the same scene contract.

ADR-052 / ASM-IMP-DEC-016 and **ASM-AUDIT-001** add a prerequisite now triggered
by three distinct inherited roots (ASM-PC-001/002/003). Preserve valid prior
repairs and scopes, but pause new individual inherited repairs, including Access,
until one prebounded audit and one complete-batch owner disposition. Historical
execution sequences below remain context; they do not override this prerequisite.
The canonical policy is
`docs/canonical-v2/00-governance/07-successor-inherited-defect-audit-policy.md`.

The approved manifest in the active change fixes 150 current cases plus 150
frozen-source comparison obligations, 3,240 Access state observations, 48 lifecycle
and 24 static-accessibility sequences, and existing named guard sources. Use
mechanical structured collection/comparison/grouping; model analysis only for
differences, failures, unclassified cases and root clusters. No per-slot narrative
or unnecessary screenshots. Keep raw failures and all mandatory validators;
individual explicit noncritical DEFER never waives an invariant or must-pass test.
Fallback remains separate from candidate validity. OUT_OF_AUDIT_SCOPE /
NEEDS_REVIEW is recorded without automatic expansion; independent safe declared
observations continue after findings. Missing required evidence remains blocking.

Current Ultra normalizes only approved governance, validates strict/structured/
ID/reference/diff/historical integrity and STOPs. Next is COMPLEX_DIAGNOSIS AUDIT ONLY,
with no product/runtime/pipeline repair; then STOP for one owner/governance batch
disposition before normally routing bounded blocking work to BOUNDED_IMPLEMENTATION. Focused
and deterministic qualification still precede fresh final matrix/evidence and
Human Geometry Approval. Progress remains 7/92, human approval pending; no Stage
2+, refreeze, motion, commit, push or deploy. All previous seals/payloads,
negative fixtures, diagnostics and unrelated dirty changes remain immutable.

The isolated OpenSpec change `implement-scroll-driven-score-assembly-and-motion`
has completed its documentation-only Stage-0 bootstrap on 2026-09-05. Gate 0
is PASS; the owner has approved Stage 0 and its scoped documentation checkpoint
commit. Subsequent owner instructions authorize bounded Stage 1, with the
2026-09-08 ADR-044/045 exception and hydration correction normalized before
implementation, the focused 2026-09-09 ADR-046 numerical determinism
boundary normalized before the hydration fix, and ADR-047's exact six-defect
Batch-2 exception normalized before any Batch-2 repair. Its sole
successor technical authority is:

`docs/canonical-v2/05-architecture/WFlyer_Post_Phase9_ASM_Motion_Canonical_Spec.md`.

The successor owns these five geometry refinements transferred
from the Phase-9 human review:

- `ASM-LAYOUT-DELTA-001` — Application terminal spatial continuation;
- `ASM-LAYOUT-DELTA-002` — event-safe straight-shelf projection;
- `ASM-LAYOUT-DELTA-003` — Benefits↔Demo low-curvature corridor;
- `ASM-LAYOUT-DELTA-004` — Professional straight-shelf event utilization from
  the existing semantic composition first;
- `ASM-LAYOUT-DELTA-005` — approved final Home Scenic Assembly.

No `ASM-LAYOUT-DELTA-*`, Composer semantic change, Assembly, or Motion work was
implemented in Phase 9 or Stage 0. The isolated successor boundary and its
Stage-0 preconditions are recorded in its `stage-0-review.md`. The later
ADR-044/045 authorization adds exactly the 14 inherited defect envelopes
(`ASM-SI-001..014`; static `015..018` repeat `004..007`) and the direct
StoryScoreLayer hydration regression. Global zero-intersection acceptance and
all historical evidence remain unchanged. Normalize governance and pass its
checks first. ADR-046 / `ASM-IMP-DEC-010` retains the existing six-decimal
presentation representation after full-precision safety and separates only
internal `candidateCount` telemetry from canonical hydration attributes;
allocator math, candidate uniqueness, semantics, and acceptance remain
unchanged. Preserve the valid numerical-only H2 stop and four-engine source
trace; prove exact semantic/canonical geometry and SSR/first-client equality
with zero hydration warnings before continuing. Diagnose and fix hydration,
pass focused regression, repair the
registered local geometry families, then run the deterministic geometry gate,
serial three-engine matrix, and successor evidence. The hydration fix and the
14 Batch-1 repairs have passed their recorded focused checks. The real-DOM
matrix then correctly stopped for six additional inherited defects. ADR-047 /
`ASM-IMP-DEC-011` authorizes exactly Batch 2 `ASM-SI-019..024`: one Application
Demo→Launch defect at 1440x900, 1536x900 and 1920x917, plus five Professional
defects at 1100x640 (six distinct defects / eight viewport occurrences).
Their supplemental review and JSON retain Stage-0/Phase-9 reproduction and
do not replace the immutable Batch-1 records. Only the exact six local
envelopes and minimum adjacent continuity geometry may change. Global zero
center-path and visible-staff intersections remains mandatory; no broader
Phase-9 reopening, aesthetic redesign, unrelated reshaping, Composer change,
or generalized metadata is authorized. Any additional inherited defect outside
Batch 1 plus Batch 2, or material expansion beyond an envelope, requires a new
explicit STOP/decision. The ADR-047 governance-only run was required to stop after its
inventory, normalization, strict/structured/diff and historical integrity checks
pass, before Batch-2 runtime repairs, browser matrix, or final evidence. The
separate High continuation may implement those six repairs with focused checks;
the final browser matrix still requires a clean deterministic global gate.
ADR-048 / ASM-IMP-DEC-012 now registers ASM-PC-001 (one inherited P3 root,
O01/O02/O03) with Stage-0/Phase-9 constructor proof. The owner selects whole-
story capacity fallback: coarse eligibility AND candidate-horizontal Projects
capacity are required; otherwise the existing compatible vertical mode applies.
The exact exception includes minimum Projects-only vertical three-visit
Projection/measurement support and lifecycle/semantic visit preservation. No
fan repositioning, card/section dimension changes, viewport hack, Composer
change or weaker 12px/global-zero contract. Preserve all previous repairs.
The prior outside-batches STOP remains historically valid; future unregistered
defects/material expansion still STOP. Current Ultra work normalizes only
governance and stops after bounded checks, before High implementation.

ADR-049 / ASM-IMP-DEC-013 separately registers ASM-PC-002: the uncapped
first-Projects-visit full-ink clearance defect at 1440x900, 1536x900 and 1920x917
(O01/O02/O03). Only the first horizontal notation shelf and minimum entry/
visit-1-to-2 continuity may change, with reservation derived from complete
rendered ink and required interaction envelopes. ASM-PC-001 stays unchanged.
The three saved fixtures remain negative baselines; horizontal capability
requires complete actual capacity PASS, never historical acceptance or a fixed
viewport workaround. Candidate qualification now uses the separately named
013 + 014 local envelopes under ADR-050 below; if none can pass, STOP.
Preserve cards/fan, visits 2/3 except minimum proven continuity, NON-ASSEMBLY,
Composer/glyphs, both batches, ADR-046, 12px, visible ink/staff and global zero.
This additional owner decision permits only governance normalization in Ultra,
then bounded validation and STOP for a separate High implementation run.
All historical records remain immutable; no human gate is marked complete.

ADR-050 / ASM-IMP-DEC-014 registers distinct ASM-PC-003: second-horizontal-
Projects-shelf focus-start clearance at 1440x900, 1536x900 and 1920x917
(O01/O02/O03). Its retained constructor/style lineage is inherited, not a fresh
historical browser PASS. Only that shelf and minimum necessary visit-1-to-2 /
visit-2-to-3 junction controls may change. Derive reservation from full visible
staff/applicable event ink and actual production card/interaction envelopes
over transitions. Preserve focus accessibility, visit 1 except its separate
ASM-PC-002 authority, visit 3's own shelf, cards/fan, unrelated geometry and
all prior contracts/validators. No fixed offset, viewport branch or new solver.

ASM-PC-001/002 remain separate and their repair boundaries are unchanged.
At least one appropriate corrected horizontal candidate among those three
viewports must pass the complete predicate within the combined named 013 + 014
envelopes; old fixtures remain negative and universal fallback cannot conceal
failure. High repairs 002 first, then 003; only after both local repairs pass
may 001 fallback/vertical/lifecycle work continue. Out-of-envelope movement or
another unregistered defect requires STOP. Current Ultra normalizes only
necessary governance and validates strict/structured/diff/integrity checks,
then stops for High with runtime implementation pending. Retain the partial
evaluator/eight tests, all original STOP/lineage evidence, 7/92 and pending
Human Geometry Approval. No runtime repair, final matrix or captures here.

Phase 10 and later parent work remain unauthorized. Stage 1 must stop
after automated validation and deterministic visual evidence for explicit
Human Geometry Approval. Stage 2 refreeze follows that approval; Stage 3+
requires the refreeze. Stage 2+ remains unstarted and unauthorized. See the
successor `stage-1-authorization.md`. No commit, push, deploy, or motion is
authorized by the current Stage-1 instruction.

## Phase 10 — W_Flyer Persona asset, rig, and easter eggs

### Blocking asset gate

The final Concept-D humanized hooded Persona must be supplied and human-approved. Codex may not invent the final geometry.

### Required work after approval

- Required About pose/integration.
- Rig supports Neutral, Working, Presenting, and Peeking.
- Session-seeded optional appearances: 20–25% per eligible chapter, maximum 2 per session, minimum 2 chapters apart, 2–4 seconds, no required interaction.
- No optional appearance during Contact typing, APP-04 PLAYING, Access W_Flyer, or open modal/dialog.
- Easter eggs remain outside the master story timeline and expose deterministic dev debug controls.

### Gate 10

- Persona is non-photorealistic, does not reproduce the owner’s physical appearance, and visibly derives from W_Flyer geometry.
- No layout shift, focus theft, content obstruction, or reduced-motion violation.

## Phase 11 — Final APP-04 media assets

### Blocking asset gate

Owner supplies/approves:

- muted/no-audio WebM;
- MP4 fallback;
- poster image;
- exact final-frame image.

### Required work

- Integrate final assets and loading policy.
- Poster is available before video; video never blocks readiness/LCP.
- Pause when hidden/outside active chapter; resume only when appropriate.
- After completion, remain on final frame until explicit replay.

### Gate 11

- Media failure never creates an empty screen.
- No audio track/use.
- Replay keyboard/pointer/touch behavior passes.
- Final-frame asset is visually identical to approved source.

## Phase 12 — Accessibility, reduced motion, responsive hardening

### Required work

- Validate semantic order, landmarks, focus, skip link, header/menu, forms, project cards, replay, and detailed routes.
- Reduced motion uses vertical static mode, no horizontal pinning, no autoplay, no animated easter eggs.
- 320 px width, mobile browser UI, landscape, tablet, small desktop height, touch laptop, 200% zoom, and forced colors where applicable.

### Gate 12

- No unjustified critical/serious axe violations.
- Keyboard-only and screen-reader review recorded.
- No horizontal document overflow in vertical mode.
- Content remains complete without motion.

## Phase 13 — Performance, lifecycle, observability, and failure recovery

### Required work

- LCP/INP/CLS targets, no React per-frame render, bounded long tasks.
- Asset loading classes: critical, near-story, deferred.
- Pause nonessential work on hidden tab.
- Debug overlays/controllers dev-only and production-inaccessible.
- GSAP ownership and cleanup registry.
- Vertical fallback if motion or ScrollTrigger fails.

### Gate 13

- LCP p75 target ≤ 2.5 s, INP p75 target ≤ 200 ms, CLS ≤ 0.10 in the approved test context.
- No significant layout shift caused by motion.
- No stale listeners, timelines, observers, or triggers after rebuild/unmount.
- Failure-injection tests preserve content/navigation.

## Phase 14 — Cutover, legacy removal, and full regression

### Required work

- Switch `/` from legacy route-transition Home to v2 story only after prior gates.
- Remove or archive legacy route-transition overlay, previous/next chapter controls, hard-coded music geometry, interactive tablet state machine, and obsolete tests.
- Do not remove retained detailed routes, contact/security, deployment, theme, legal, SEO, or approved intro assets.
- Update Graphify/OpenSpec and documentation with verified implementation facts.

### Gate 14

- Replacement tests cover every removed legacy contract.
- Full repository verify/build/browser/visual/motion/a11y suite passes.
- Rollback reference can restore the prior baseline.
- No obsolete `Empresa`, header `Acessar app`, previous/next chapter control, or interactive demo behavior remains in the public v2 landing.

## Phase 15 — Staging, homologation, and production authorization

### Required work

- Build Next.js standalone and preserve Registro.br delegation, Napoleon
  authoritative DNS/hosting, and independent Cloudflare Turnstile.
- Deploy exact-SHA candidate to approved staging only.
- Run real-device, screen-reader, contact-provider, security-header, indexing, performance, and rollback validation.
- Record Davi Benucci’s explicit homologation.

### Gate 15

- Staging evidence references exact immutable SHA.
- `app.wflyer.com.br` baseline remains unchanged.
- Rollback is exercised.
- Production remains unauthorized until explicit owner approval.

## Global stop conditions

Codex must stop and request owner input when:

- a canonical conflict cannot be resolved by precedence;
- a human visual/asset gate is reached;
- an external secret, account, provider, or infrastructure action is required;
- a legal/public copy decision is missing;
- a destructive production action would be required.
