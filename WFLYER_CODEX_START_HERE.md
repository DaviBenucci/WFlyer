# Codex Initial Prompt — W_Flyer v2 Re-architecture

You are Codex working in the **root directory of the W_Flyer website repository**.

**Current checkpoint:** Phase 5 / Gate 5 is complete as of 2026-08-26.
Phase 6 — Header Traversal, URL, and History — is the next permitted phase and
has not started. Verify the sealed Phase-5 evidence before resuming; do not
rerun or reopen completed Phases 0–5 without a demonstrated inconsistency.

The repository root is the directory that contains:

- `package.json`
- `AGENTS.md`
- `WFLYER_IMPLEMENTATION_PLAN.md`
- `docs/`
- `openspec/`
- `src/`

## Mandatory paths

Before changing code, read these files in this exact order:

1. `<repository-root>/AGENTS.md`
2. `<repository-root>/PRE-CODE-STATUS.md`
3. `<repository-root>/WFLYER_IMPLEMENTATION_PLAN.md`
4. `<repository-root>/WFLYER_CANONICAL_DOCUMENTATION_MANIFEST.md`
5. `<repository-root>/docs/canonical-v2/README.md`
6. `<repository-root>/docs/canonical-v2/00-governance/01-source-of-truth.md`
7. `<repository-root>/docs/canonical-v2/00-governance/03-decision-register.md`
8. `<repository-root>/docs/canonical-v2/00-governance/04-supersession-map.md`
9. `<repository-root>/docs/canonical-v2/06-migration/01-current-state-audit.md`
10. `<repository-root>/docs/canonical-v2/06-migration/02-file-by-file-migration-map.md`
11. `<repository-root>/openspec/changes/rebuild-scroll-driven-wflyer-v2/proposal.md`
12. `<repository-root>/openspec/changes/rebuild-scroll-driven-wflyer-v2/design.md`
13. `<repository-root>/openspec/changes/rebuild-scroll-driven-wflyer-v2/tasks.md`
14. `<repository-root>/openspec/changes/archive/2026-08-24-implement-music-system-v0-1/` in full.

## Source of truth

The approved target is the v2 canonical documentation under:

`<repository-root>/docs/canonical-v2/`

Legacy documents and current code describe the old route-transition architecture. They are evidence of the current state, not authority for the target, unless the v2 supersession map explicitly retains them.

When a conflict exists, use this precedence:

1. `AGENTS.md`
2. `WFLYER_IMPLEMENTATION_PLAN.md`
3. `docs/canonical-v2/00-governance/03-decision-register.md`
4. other `docs/canonical-v2/**` documents and manifests
5. active OpenSpec v2 changes/specifications
6. retained deployment, contact-security, and legal documentation
7. legacy documentation
8. current implementation behavior

## Required execution behavior

- Execute the phases in `WFLYER_IMPLEMENTATION_PLAN.md` **strictly in order**.
- Do not start a later phase until the current phase gate is satisfied and evidence is recorded.
- Update the phase checkboxes and evidence log as work progresses.
- Do not declare a phase complete because its happy path works.
- At every gate, run the required unit, browser, accessibility, visual, motion, build, and cleanup checks listed in the plan.
- Preserve `app.wflyer.com.br`; do not modify the music application repository or its infrastructure.
- Preserve the existing contact security, deployment topology, Cloudflare boundary, Napoleon standalone runtime, legal routes, and no-analytics policy unless a v2 document explicitly changes a behavior.
- Do not add a second animation engine, a smooth-scroll library, Lenis, Anime.js, Framer Motion, WebGL, Three.js, Lottie, or a CMS.
- Do not intercept global `wheel` or `touchmove` with `preventDefault()` to drive the narrative.
- Do not alter approved SVG glyph path geometry.
- Do not invent the final Persona artwork, demonstration video, poster, final frame, project media, metrics, testimonials, clients, or results.
- Stop at explicit human approval gates: Music Gate B, Music Gate C, Persona asset approval, final APP-04 media approval, visual score-path approval, staging homologation, and production authorization.

## First actions

1. Confirm the repository root and the presence of every mandatory file above.
2. Verify the current phase/gate status and the latest sealed evidence bundle.
3. Inspect the active OpenSpec progress and confirm Phase 6 is the first
   incomplete executable phase.
4. Record failures without weakening tests or deleting evidence.
5. Begin Phase 6 only under a new explicit execution instruction; do not skip
   its Gate 6 requirements or modify the completed Phase-4/5 bootstrap and
   master-story contracts.

Do not restart the project from scratch. Reuse retained infrastructure and components where the migration map says `KEEP` or `REFACTOR`; replace only what the canonical target supersedes.
