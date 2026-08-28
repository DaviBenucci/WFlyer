# W_Flyer v2 — Linear Implementation Plan

**Status:** normative and approved  
**Canonical language:** English  
**Execution rule:** Codex must execute phases strictly in order. A phase is not complete until its gate is satisfied and evidence is recorded. Codex must not skip, merge, or reorder phases.

## Target outcome

Rebuild `wflyer.com.br` as a personal professional portfolio and service-acquisition site under the W_Flyer brand, with:

- a scroll-driven desktop narrative using native vertical scroll mapped to a horizontal story;
- a vertical mobile/tablet fallback with Portfolio first and Application second;
- one canonical master story position;
- header traversal through intermediate chapters, proportional to distance and capped at 3.0 seconds;
- two continuous organic musical scores from Home to their final barlines;
- a professional branch and an application branch;
- preserved detailed routes for SEO and long-form content;
- deterministic music rendering/composition;
- a humanized, hooded, non-photorealistic W_Flyer Persona;
- a video-based, non-interactive application demonstration;
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
Paths still require the separate blocking Phase-9 human subgate.

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

**Execution status:** not started. The first task is the blocking human
approval of Score Path layouts; no integration work is authorized before that
approval.

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

### Gate 9

- The selected `Organic Soft` or `Organic Flowing` layouts have explicit human
  approval for both vertical modes and both themes.
- No visible segment seam beyond the approved tolerance.
- Notes, ledger lines, stems, beams, accidentals, barlines, and key signatures remain coherent on curved paths.
- Same session composition remains stable across reload, theme, breakpoint, and reduced motion.
- No score/composer work occurs per scroll frame.

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

- Build Next.js standalone and preserve Napoleon/Cloudflare topology.
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
