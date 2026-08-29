# W_Flyer current operational handoff

```yaml
schema: wflyer-current-handoff/v1
project: wflyer.com.br institutional website
branch: develop/site-institucional
implementation_checkpoint: 5764808399befd6a04e9a12b3e804fa9aaf9493f
maintenance_checkpoint: this file belongs to the current maintenance HEAD; resolve with git rev-parse HEAD
active_change: rebuild-scroll-driven-wflyer-v2
openspec_progress: 32/45
next_unchecked_task: '33 — Human-approve Score Path layouts'
next_phase: 'Phase 9 — Continuous dual-score integration'
phase_9_started: false
production_authorized: false
```

This file is a compact derived bootstrap, not a normative architecture source.
Canonical precedence remains in `AGENTS.md`.

## Accepted phase state

- Phases 0–8 are complete at their recorded gates.
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

## Contracts that must survive future phases

### Foundation and isolated Music system

- Canonical precedence and linear phase/gate discipline are mandatory.
- Graphify is discovery only; it may index noncanonical files but never grants
  them authority.
- The approved Music System remains structurally isolated until Phase 9.
- Changes to approved Music metrics/anchors and later Score Path layouts remain
  human-gated.

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

### Phase 8 Application branch

- Exact sequence: Overview, How It Works, Benefits, APP-04 demonstration,
  Access W_Flyer, structural final barline, Application terminal.
- APP-04 is inert except replay and uses the accepted five-state reducer with
  active-entry/visibility ownership, pause/resume, final-frame, replay,
  deterministic failure, reduced motion, and cleanup.
- Missing media is the truthful default. Sentinel media exists only in an
  explicit intercepted development-test scenario.
- No final APP-04 asset or invented product footage exists.
- Access W_Flyer is the sole primary Application CTA and opens the separate app.
- The Phase-9 score is a pending seam only; no ScorePath/Music integration is
  present.

## Deferred work and hard stops

- Tasks 33–35 / Phase 9: human approval first, then continuous dual score and
  stability validation.
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
  product copy while starting Phase 9.

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
| Next.js / `eslint-config-next` | 16.3.3 / 16.3.3 |
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
- OpenSpec strict validation is 15/15 workspace and 1/1 active change.
- Graphify's project skill is current; post-commit/post-checkout hooks and the
  merge driver are installed. The maintenance checkpoint is accepted only with
  the single final incremental refresh and health/checksum validation passing.
- Detailed decisions and validation:
  `docs/canonical-v2/06-migration/evidence/maintenance/2026-08-29-post-phase-8-toolchain-maintenance.md`.

## Known primary-worktree residue

Do not stage, delete, or treat these as maintenance dependencies:

- unrelated `.gitignore` edit adding the line `g`;
- root/import artifacts: `CANONICAL_DECISION_DELTA.md`, `CODEX_PROMPT.md`,
  `PACKAGE_MANIFEST.txt`, `REPOSITORY_CONFLICT_MAP.md`, and the noncanonical
  `WFLYER_IMPLEMENTATION_PLAN(1).md`;
- historical Phase-0 residue under
  `docs/canonical-v2/06-migration/evidence/phase-0/`;
- `gate-b-evidence-2026-08-15.zip`;
- `repo-overlay/`;
- prunable metadata for older missing temporary worktrees.

The noncanonical `(1)` plan is discoverable but never authoritative. The live
`WFLYER_IMPLEMENTATION_PLAN.md` is authoritative below `AGENTS.md`.

## Exact next safe action

Stop at task 33. When Davi Benucci explicitly authorizes Phase 9, bootstrap from
this file, load tasks 33–35 and the Phase-9 canonical contracts, and obtain the
required human Score Path layout approval before implementation. Do not infer
approval from prior Music gates or this maintenance checkpoint.

`Phase 9 — use CURRENT_HANDOFF.md as the primary operational bootstrap`

## Minimal required reading for a fresh session

1. `AGENTS.md`.
2. `docs/canonical-v2/06-migration/CURRENT_HANDOFF.md`.
3. Current Phase OpenSpec task range/spec.

Load older canonical or Gate documents only when the current Phase touches
their contract, a contradiction is detected, or this handoff points to them.
