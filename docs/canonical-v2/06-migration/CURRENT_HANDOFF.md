# W_Flyer current operational handoff

```yaml
schema: wflyer-current-handoff/v1
project: wflyer.com.br institutional website
branch: develop/site-institucional
implementation_checkpoint: 306ccb74da6c7bbf8f187e360c0776c571b5fc3d
phase_9_final_git_sha: 306ccb74da6c7bbf8f187e360c0776c571b5fc3d
refinement_base_checkpoint: 2ffef25b3ba621b535a00c001d68fc3a6977085c
active_change: refine-phase-9-score-choreography-and-prelaunch
active_change_status: complete_unarchived
parent_change: rebuild-scroll-driven-wflyer-v2
successor_change: implement-scroll-driven-score-assembly-and-motion
successor_change_status: not_created
successor_spec: docs/canonical-v2/05-architecture/WFlyer_Post_Phase9_ASM_Motion_Canonical_Spec.md
openspec_progress: 21/21
parent_openspec_progress: 35/45
next_canonical_action: 'Create the isolated successor OpenSpec at Stage 0; do not implement it yet'
parent_next_unchecked_task: 'Task 36 — final Persona asset approval and integration'
current_phase: 'Phase 9 formally closed; successor Assembly/Motion bootstrap pending'
phase_9_started: true
phase_9_closed: true
phase_9_closed_on: 2026-09-04
gate_9_status: pass
task_33_status: human_approved
task_33_checkpoint: 74677a762a9d9a53cb7fd375eecb0462b10e18e9
task_34_status: historical_complete
task_34_refinement_status: human_approved_technical_baseline
refinement_correction_evidence: task-34-refinement-firefox-correction-2026-09-04
refinement_correction_manifest_sha256: 807a15b57e1a5bbc88011d546e69d4a4b281c552344876cddfc3a17042392923
task_35_status: complete
production_authorized: false
```

This file is a compact derived bootstrap, not a normative architecture source.
Canonical precedence remains in `AGENTS.md`.

## Accepted phase state

- Phases 0–9 are complete at their recorded gates.
- Music System Gate A, external-human Gate B, and Gate C are accepted in the
  isolated Music system scope.
- Gate 8 is PASS for canonical Phase 8, **Application branch scenes**.
- Phase-8 implementation checkpoint:
  `5764808399befd6a04e9a12b3e804fa9aaf9493f`.
- Gate-8 report:
  `docs/canonical-v2/06-migration/evidence/phase-8/2026-08-28-phase-8-gate-report.md`.
- Gate-8 payload manifest:
  `docs/canonical-v2/06-migration/evidence/phase-8/SHA256SUMS.txt`.
- Manifest SHA-256:
  `06b0e5d1c655cd77677987789809de0aa3d9cf675b120bca7439b8c9cd369734`.
- Gate 9 is `PASS`; Phase 9 closed on 2026-09-04.
- Immutable Phase-9 implementation/evidence baseline:
  `306ccb74da6c7bbf8f187e360c0776c571b5fc3d`.

## Contracts that must survive future phases

### Foundation and isolated Music system

- Canonical precedence and linear phase/gate discipline are mandatory.
- Graphify is discovery only; it may index noncanonical files but never grants
  them authority.
- The approved Music System composition/renderer boundaries remain isolated
  from projection and motion ownership after their Phase-9 integration.
- Changes to approved Music metrics/anchors, Composer semantics, and successor
  Score Path geometry remain human-gated.

### Phase 2–3 product/content baseline

- Typed local content/story manifests stay independent of layout and motion.
- Professional, service, project, legal, nested Application, and Contact route
  contracts remain stable and production-safe.
- W_Flyer is presented as Davi Benucci's professional brand, not a company.
- Contact retains validation, origin/content-type/payload controls, honeypot,
  independent Turnstile, Resend, logical-submission idempotency, generic
  failures, `no-store`, and no database.
- Visual/Motion/Music labs remain development-only in production.

### Phase 4 intro/bootstrap

- Readiness, not elapsed time alone, controls opening exit.
- Valid deep-link/history positioning completes before reveal.
- Skip, Escape, reduced motion, timeout, failure, resize, visibility, and
  teardown fail open to a functional page with owned cleanup.
- Optional/demo media never blocks `STORY_READY`.

### Phase 5 master story

- Native vertical scroll is canonical story progress.
- Desktop horizontal movement is progressive enhancement only.
- Reduced motion uses the vertical static story.
- No global wheel/touch scroll-jacking; every timeline/trigger/listener/timer
  has explicit ownership and cleanup.

### Phase 6 header/history

- Header traversal animates the same native scroll and master timeline.
- Extreme traversal never exceeds 3.0 seconds and user input cancels it.
- Passive scroll replaces history; successful explicit navigation pushes;
  cancellation creates no entry; Back/Forward restores canonical chapter
  progress.

### Phase 7 professional branch

- About exposes only the final Persona integration contract; no final Persona
  asset or rig exists yet.
- Services, Process, Projects, Contact, and the professional terminal remain in
  the accepted sequence.
- Contact/security remains an independent regression boundary.

### Phase 8 Application branch — historical entry contract

- Exact sequence: Overview, How It Works, Benefits, APP-04 demonstration,
  Access W_Flyer, structural final barline, Application terminal.
- APP-04 is inert except replay and uses the accepted five-state reducer with
  active-entry/visibility ownership, pause/resume, final-frame, replay,
  deterministic failure, reduced motion, and cleanup.
- Missing media is the truthful default. Sentinel media exists only in an
  explicit intercepted development-test scenario.
- No final APP-04 asset or invented product footage exists.
- Access W_Flyer was the Phase-8 primary CTA; the bounded Phase-9 PRELAUNCH
  refinement replaced that unavailable action with launch-interest registration.
- Task 34 integrates the real score only in the Phase-5 development review
  story. Public `/` remains on the retained page and is not cut over.

### Phase 9 Task-33 approval and Task-34 integration baseline

- Organic Flowing alternating-S geometry, the mobile Project-card responsive
  direction, ADR-041's warm dark-neutral palette, canonical copper dark UI
  emphasis, and warm dark Home atmosphere directions are approved.
- `#e79271` owns selective dark UI/text/ornamental emphasis through semantic
  tokens. Task 34 adds final theme-aware warm score-primary and score-muted
  roles, with copper limited to key-signature and thick-final-bar emphasis.
  Purple/cobalt remain valid only where intrinsic to approved brand assets or
  isolated diagnostics. The light theme remains warm and unchanged in intent.
- Task-33 review routes project their explicit theme query through the document
  theme owner. Score SVG presentation uses deterministic six-decimal
  serialization across SSR and browser hydration. Review-only descending-arc
  evidence treats sub-`1e-7` shelf deltas as level so runtime floating-point
  noise cannot flip a whole sampled segment. Neither boundary changes renderer
  math, authored geometry, or semantic fingerprints.
- The real treble-clef-to-staff origin, branch-departure topology,
  notation-safe descending regions, event-free connectors, and physical final
  barline termination are human-approved. Task 34 promotes that approved
  geometry and the immutable clef calibration without changing SVG bytes,
  musical anchor, `gLine`, `staffSpace`, topology, orientation, or semantic
  role.
- Task 34 owns exactly two module/session compositions, one production
  projection owner, and one presentational score layer. It integrates one
  shared origin, six Professional segments, and six Application segments with
  fingerprints `fnv1a32:039bce10` and `fnv1a32:1fe3356b`.
- Final geometry is crossing-free in horizontal-enhanced, vertical-wide,
  vertical-compact, static, and transient stale-mode handoffs. Composer work,
  React renders, and new ScrollTriggers do not occur per scroll frame.
- Final validation is green: 90 unit files / 707 tests, 13 Storybook files / 63
  interactions, 12/12 three-engine integration/hydration cases, and 294/294
  applicable affected-regression cases with zero retries or skips. Production
  build and Visual Lab isolation also pass.
- Task-34 review evidence is sealed at
  `docs/canonical-v2/06-migration/evidence/phase-9/task-34-integration-review-2026-08-31/`;
  its manifest SHA-256 is
  `c4bec2d7f6b546c44d9b7bd053ad0b4ff0c42d1d143cc079dd0714068c3fef8a`.
- Task 34 remains a truthful historical checkpoint. Its later accepted
  correction and evidence are frozen with the complete Phase-9 technical
  baseline at `306ccb74da6c7bbf8f187e360c0776c571b5fc3d`.

### Phase 9 human choreography/PRELAUNCH refinement

- External human review after the automated Task-34 checkpoint approved the
  bounded contract normalized in ADR-043. It does not reopen Task 34.
- The focused OpenSpec change is
  `refine-phase-9-score-choreography-and-prelaunch`; its planning artifacts
  strict-validate and all items 1.1 through 7.3 are complete. It remains active
  and intentionally unarchived.
- The parent Task-34 evidence directory and manifest SHA-256 remain immutable
  historical evidence. The first refinement used the sibling
  `task-34-refinement-2026-08-31/` bundle, which is now also sealed and
  immutable.
- The refinement owns projection/presentation choreography, the explicit
  semantic header, immersive-only footer de-duplication, current PRELAUNCH
  scene, dedicated launch-interest endpoint, and fixed transactional emails.
- Music fingerprints `fnv1a32:039bce10` and `fnv1a32:1fe3356b`, composition,
  assets, calibration, semantic slots, native-scroll runtime, and Task-34
  hydration fixes remain baseline invariants.
- On 2026-09-04, the owner explicitly accepted the current score geometry as
  the Phase-9 technical baseline, not as the final visual composition. This
  satisfies focused item 7.3. No successor layout delta was implemented.
- The new 2026-09-03 refinement bundle contains 25 inspected deterministic
  captures, a capture manifest, the exact validation/failure ledger, and a
  28-payload checksum manifest at
  `docs/canonical-v2/06-migration/evidence/phase-9/task-34-refinement-2026-08-31/`.
  Its detached manifest SHA-256 is
  `1ce1043412c6ad77b34c0d77bad565cb9aef3af6808c8b54d48b0d7e13fdc442`.
- A later exact Firefox 1920x917 runtime report reproduced one Application
  staff-line self-intersection. Measured 1536x864 and tall 1920x1200/2304x1200
  boundary failures were also corrected generically. The projection suite now
  has permanent exact-fixture and browser coverage for those regimes.
- The required broad rerun then exposed a separate latent Chromium Demo CTA
  collision. Reverting the Firefox changes diagnostically did not remove it.
  The Demo-to-Launch tangent-reversal shelf now reserves the complete outer
  staff plus the approved 12 px content gap; the threshold itself is unchanged.
- The final correction state passes 20/20 projection tests, 23 files and
  128/128 focused unit/component tests, 12/12 three-engine score integration,
  and one clean serial 21/21 three-engine refinement run with retries=0. The
  exact reported Firefox and high-viewport regimes report zero path/staff-line
  intersections, and the deterministic Demo capture measures 30.76 px CTA
  clearance.
- The authoritative 2026-09-04 current-geometry addendum contains 11 inspected
  captures and a 14-payload checksum manifest at
  `docs/canonical-v2/06-migration/evidence/phase-9/task-34-refinement-firefox-correction-2026-09-04/`.
  Its detached manifest SHA-256 is
  `807a15b57e1a5bbc88011d546e69d4a4b281c552344876cddfc3a17042392923`.
  It supersedes the first refinement bundle only for the changed horizontal
  Benefits, Demo, Launch, and Application-terminal frames and supplements it
  with Firefox boundary evidence; both earlier bundles remain byte-identical.

### Phase 9 formal closure

- `PHASE_9_FINAL_GIT_SHA` is
  `306ccb74da6c7bbf8f187e360c0776c571b5fc3d`.
- Parent Task 35 is complete at parent progress 35/45. The final 12/12
  three-engine score-integration lane covers horizontal enhanced,
  static/reduced vertical-wide, vertical compact, and fail-open vertical-wide
  behavior while preserving fingerprints and two Composer invocations. The
  clean 21/21 refinement lane supplies the final geometry/browser result.
- Gate 9 is `PASS` and Phase 9 is formally closed on 2026-09-04.
- Phase-9 evidence remains distributed across four immutable seals:
  - Task-33 approval:
    `task-33-refinement-2026-08-30/` —
    `10ce142087e3e249842f04c2d47a47d988ac499c71f13f7da7a6fd267659cba0`;
  - historical Task-34 integration:
    `task-34-integration-review-2026-08-31/` —
    `c4bec2d7f6b546c44d9b7bd053ad0b4ff0c42d1d143cc079dd0714068c3fef8a`;
  - first refinement candidate:
    `task-34-refinement-2026-08-31/` —
    `1ce1043412c6ad77b34c0d77bad565cb9aef3af6808c8b54d48b0d7e13fdc442`;
  - authoritative corrective addendum:
    `task-34-refinement-firefox-correction-2026-09-04/` —
    `807a15b57e1a5bbc88011d546e69d4a4b281c552344876cddfc3a17042392923`.
- The exact deferred successor requirements are
  `ASM-LAYOUT-DELTA-001..005`. They remain bounded to the future isolated
  `implement-scroll-driven-score-assembly-and-motion` change. Their canonical
  authority is
  `docs/canonical-v2/05-architecture/WFlyer_Post_Phase9_ASM_Motion_Canonical_Spec.md`.
- No Assembly/Motion runtime, Composer change, or successor OpenSpec was
  created or implemented during Phase 9.

## Deferred work and hard stops

- Tasks 33–35 / Phase 9: complete. Gate 9 is `PASS`; the focused change is
  21/21 complete but unarchived. Do not rewrite its historical evidence.
- Successor Assembly/Motion: OpenSpec not created. Stage 0 must record the
  Phase-9 SHA, the canonical successor specification, and exactly
  `ASM-LAYOUT-DELTA-001..005` before any implementation.
- Task 36 / Phase 10: owner-approved final Persona asset, rig, easter eggs.
- Task 37 / Phase 11: owner-approved final APP-04 media.
- Tasks 38–39: accessibility/responsive/reduced-motion and lifecycle/recovery
  hardening.
- Tasks 40–41: public `/` cutover, legacy removal, complete regression/evidence.
- Tasks 42–45: exact-SHA staging, external validation, owner homologation, and
  production only with explicit authorization.
- `src/content/site-content.ts` retains one public copy claim about Cloudflare
  edge protection from the earlier topology. This docs-only checkpoint flags
  it for a separately authorized content reconciliation; do not silently edit
  product copy during the successor bootstrap.

## Current operational topology

```text
Registro.br delegation
  -> Napoleon authoritative DNS
  -> Napoleon hosting
  -> Next.js standalone Node runtime
```

- Cloudflare authoritative DNS/proxy/WAF is inactive in the request path.
- Cloudflare Turnstile remains an independent anti-abuse integration.
- Do not assume Napoleon WAF, rate limit, redirects, cache purge, DNS API, or
  deployment API without observed evidence.
- `app.wflyer.com.br` is separate and must not be modified.
- No infrastructure mutation is authorized by this handoff.

## Maintenance state

| Tool/runtime | Verified version |
|---|---:|
| Node.js | 24.18.0 |
| pnpm/Corepack pin | 11.24.0 |
| Next.js / `eslint-config-next` | 16.4.0-canary.13 / 16.3.3 |
| React / React DOM | 19.2.8 / 19.2.8 |
| TypeScript | 5.9.3 |
| GSAP / `@gsap/react` | 3.15.0 / 2.1.2 |
| Playwright | 1.62.1 |
| Storybook | 10.5.10 |
| Vitest | 4.1.11 |
| Tailwind CSS | 4.3.3 |
| Zod / Resend | 4.4.3 / 6.18.1 |
| Graphify | 0.9.51 via `uv` |
| OpenSpec | 1.11.0 via pnpm |

- Next 16.2.12 critical advisory exposure is remediated; production audit is
  zero. Development-only upstream transitive debt is recorded in the
  maintenance evidence.
- OpenSpec generated integration lives in `.agents/skills`; the unrelated
  Graphify project skill remains in `.codex/skills/graphify`.
- OpenSpec strict validation is 16/16 workspace; the focused Phase-9 and parent
  changes each validate independently at 1/1.
- Graphify's project skill is current; post-commit/post-checkout hooks and the
  merge driver are installed. The maintenance checkpoint is accepted only with
  the single final incremental refresh and health/checksum validation passing.
- Detailed decisions and validation:
  `docs/canonical-v2/06-migration/evidence/maintenance/2026-08-29-post-phase-8-toolchain-maintenance.md`.

## Known noncanonical repository material

Older root/import artifacts, Phase-0 recovery material,
`gate-b-evidence-2026-08-15.zip`, and `repo-overlay/` remain outside Phase-9
authority even where earlier history tracks them. The noncanonical `(1)` plan
is discoverable but never authoritative. The live
`WFLYER_IMPLEMENTATION_PLAN.md` is authoritative below `AGENTS.md`.

## Exact next safe action

Create the isolated OpenSpec change
`implement-scroll-driven-score-assembly-and-motion` at Stage 0, reference
`docs/canonical-v2/05-architecture/WFlyer_Post_Phase9_ASM_Motion_Canonical_Spec.md`,
and record Phase-9 baseline
`306ccb74da6c7bbf8f187e360c0776c571b5fc3d`. Do not edit runtime, implement an
`ASM-LAYOUT-DELTA-*`, change Composer semantics, begin Task 36, archive the
completed focused change, cut over public `/`, push, deploy, or mutate
production as part of that bootstrap without separate authorization.

`Phase 9 closed — successor Assembly/Motion OpenSpec creation is next`

## Minimal required reading for a fresh session

1. `AGENTS.md`.
2. `docs/canonical-v2/06-migration/CURRENT_HANDOFF.md`.
3. Current Phase OpenSpec task range/spec.

Load older canonical or Gate documents only when the current Phase touches
their contract, a contradiction is detected, or this handoff points to them.
