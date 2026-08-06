## Context

See `proposal.md` for motivation. The interrupted repair spans GitHub Actions job containers, the Next.js standalone build, Playwright state synchronization, Phase 06/07/08 visual specs, Linux snapshots, and release evidence. The repository already pins Playwright 1.62.0 and Next.js standalone output. GitHub-hosted container jobs mount the workspace for actions and commands, so the container must retain its default root user unless the workflow also takes ownership of every runner-mounted path. The official Playwright Noble image stores its bundled browsers under `/ms-playwright`, not a per-user cache.

The captured public Actions evidence establishes two different failure shapes. The WebKit reduced-motion Home retry exposed changing Next.js development UI, including a `Compiling...` state, and therefore was not a stable product capture. The Firefox Phase 06 diffs are small and occur exclusively on HTML text-glyph edges; native select arrows, focus outline, SVG score, clef, and tablet geometry are unchanged. Approved references, product motion, the DOM tablet requirement, and zero-tolerance comparison remain authoritative.

## Goals / Non-Goals

**Goals:**

- Make common CI and manual candidate browser evidence reproducible from the same exact runner, package-manager, Playwright image, browser bundle, build mode, and screenshot contract.
- Make readiness observable through explicit application state rather than elapsed time or visibility checks that can pass while content is transparent.
- Keep evidence diagnostic: motion runs before visual comparison, every non-cancelled job uploads the complete Playwright evidence trees, and workflow tests reject environment drift.
- Preserve the approved production tablet, selects, GSAP motion, and reduced-motion final state unless inspected evidence proves a productive defect.

**Non-Goals:**

- The production-test standalone build is not the environment-specific Napoleon candidate archive and is never published.
- Deployed-staging tests do not receive internal timeline controls, forced checkpoints, or public test-only configuration.
- This design does not weaken screenshot tolerances, mask productive regions, update approved golden references, or alter external infrastructure.

## Decisions

### 1. One canonical GitHub browser environment

Both browser jobs use `ubuntu-24.04`, Node.js 24, pnpm 11.18.0, and `mcr.microsoft.com/playwright:v1.62.0-noble` pinned to the reviewed digest with `--ipc=host`. They retain the image's default root user because GitHub container actions require access to runner-mounted workspace and action directories. A preflight creates and verifies the actual pnpm store, `.next`, `test-results`, and `playwright-report` paths before dependency installation. A fingerprint then verifies Ubuntu 24.04, Node, pnpm, Playwright, `PLAYWRIGHT_BROWSERS_PATH`, expected browser revisions, and every package-derived installation path and completion marker before the build. It uses `playwright install --dry-run` only to resolve those paths; the official image's removed build-time registry link makes global `install --list` unsuitable, and no browser installation is performed.

Alternative considered: `--user 1001`. It is useful for untrusted-site sandboxing in a manually managed container, but conflicts with the GitHub-hosted workspace contract unless permissions are broadly rewritten. These tests exercise the trusted repository-owned site, so reproducible workspace access takes precedence.

Alternative considered: install browsers during each job. This would duplicate and potentially drift from the versioned image, so the job instead validates the image bundle and package/image parity.

### 2. Test the generated standalone server

Repository browser jobs build once with their public test configuration, run `prepare:standalone`, and let Playwright start `node .next/standalone/server.js` on loopback with explicit `HOSTNAME`, `PORT`, and `NODE_ENV`. Production-test mode rejects a non-loopback `PLAYWRIGHT_BASE_URL` and never reuses an already-running local server. Ordinary local authoring may still use `next dev`; an external staging origin starts no local server.

Alternative considered: `next start`. Next.js standalone output explicitly expects the generated server and warns that `next start` is unsupported for this mode. Alternative considered: keep development mode for screenshots. The captured Fast Refresh/development overlay is the confirmed cause of the changing reduced-motion retry, so development mode cannot produce governed evidence.

### 3. Centralize screenshot mechanics and make page readiness explicit

Playwright config owns zero-tolerance screenshot behavior: animations disabled, caret hidden, and a screenshot-only stylesheet that removes only `nextjs-portal`. The shared helper applies viewport, color scheme, and reduced-motion settings before navigation when requested; after navigation it requires `document.readyState === "complete"`, `document.fonts.ready`, any explicit application-state marker, and two animation frames. Specs retain semantic assertions for each intended state before calling `toHaveScreenshot`.

The Home shell exposes a pending/ready brand-intro state. The controller marks it ready only after normal completion or the reduced-motion terminal branch restores the target, releases scroll locking, and removes the overlay/timeline. Phase 07 waits for fonts and pre-seek frames before acquiring/seeking the GSAP test handle, then verifies an exactly paused checkpoint and post-seek stable frames. This prevents geometry captured before final font metrics and prevents a server-rendered but transparent Home shell from satisfying readiness.

Alternative considered: fixed delays or `toBeVisible()` on the Home section. Both can pass before layout and opacity settle. Alternative considered: a broad screenshot stylesheet or pixel ratio. Those approaches can conceal regressions and are rejected.

### 4. Keep Phase 06 production rendering unchanged

Artifact inspection localized every Phase 06 mismatch to HTML text-glyph edges. The native selects and production tablet depth therefore remain in their approved implementation. Environment-dependent tiny edge pixels are addressed by the canonical image and reviewed snapshot generation, not by replacing controls or masking depth. No screenshot-only 3D neutralization is used.

Alternative considered: keep the interrupted custom select shell. It changes productive markup without evidence that select chrome caused the failure, so it would turn an environment investigation into an unauthorized design change.

### 5. Regenerate only invalidated Linux evidence under governance

Snapshots are updated only inside the pinned Noble image after focused specs pass repeatedly. Every changed image is reviewed against approved references and its expected/actual/diff context. The three pre-correction reduced-motion Home baselines were invalid because they contained the development indicator and were replaced. In total, 34 images were reviewed and replaced: 7 Phase 06, 16 Phase 07, and 11 Phase 08. Five consecutive reduced-motion WebKit runs and two complete 291/291 visual runs then passed unchanged at zero tolerance. No `maxDiffPixels` or `maxDiffPixelRatio` allowance is introduced.

### 6. Separate common CI proof, candidate proof, and deployable archive

Common CI and the manual candidate browser job share the exact browser contract and repository-test standalone server. The later candidate-quality job independently builds the selected staging/production configuration and packages the Napoleon standalone artifact. Workflow contract tests compare both browser jobs and assert that browser-test output is never treated as the candidate archive.

### 7. Bound Storybook browser-test file concurrency

The Storybook Vitest project disables file parallelism, which caps its browser
worker count at one while retaining every story and assertion. The parallel
default launched enough simultaneous Chromium work to exceed the measured
1.66 GiB local Docker limit and was terminated with exit 137 after completed
files had passed. Sequential execution passed all 63 assertions in 13 files in
17.5 seconds. The modest duration trade-off makes the repository gate reliable
on constrained runners without changing application behavior or test coverage.

## Risks / Trade-offs

- [Root inside the trusted CI job container reduces Chromium sandbox isolation] → The job visits only the repository-owned loopback site, keeps the runner ephemeral, uses the official pinned image, and sets `--ipc=host`; external staging remains a separate gate.
- [A public test setting is inlined at build time] → It is limited to deterministic transitions, contains no secret, and the browser-test build is discarded rather than deployed.
- [The local container does not reproduce GitHub runner mounts or Actions orchestration] → Record the exact local Noble fingerprint and results, then retain a remote exact-SHA GitHub Actions run as a separate required validation.
- [A readiness marker could become stale after future intro changes] → Unit and browser tests cover pending, normal completion, and reduced-motion completion, including scroll/timeline cleanup.
- [Removing only `nextjs-portal` may miss a future development surface] → Production standalone is the primary defense; the stylesheet remains narrowly auditable and semantic assertions reject unexpected page state.
- [Zero tolerance can expose legitimate engine upgrades] → Versions are exact, upgrades are explicit reviewed changes, and expected/actual/diff artifacts remain complete.
- [Serial Storybook files increase wall-clock duration] → The measured 63-test gate completes in seconds and avoids nondiagnostic browser-worker OOM termination.

## Migration Plan

1. Land workflow contract tests together with both matched browser jobs and the standalone Playwright configuration.
2. Add the Home readiness marker and shared visual helper; repair Phase 07 assertions and revert any unsupported Phase 06 production edits.
3. Run unit, type, lint, dependency, build/standalone, focused browser, accessibility, and motion checks available on the host.
4. In the exact Noble image, run Phase 06, Phase 07, and Phase 08 repeatedly, regenerate only invalidated Linux snapshots, review every image, then run the complete visual suite twice.
5. Run common CI remotely after an authorized push; separately run the manual candidate workflow before release approval.

Rollback is a normal source revert of this focused change and its reviewed snapshots. It requires no data migration or external-system change. Reverting must not restore a development-server visual gate or accept the contaminated reduced-motion baselines.

## Resolved validation environment

The workstation started the Docker service and exercised
`mcr.microsoft.com/playwright:v1.62.0-noble` at digest
`sha256:baed2032d533817f3dbe6425de795788430ba345e819a1201337009ba17c9d07`.
The observed CI fingerprint is Ubuntu 24.04.4, Node.js 24.18.0, pnpm 11.18.0,
Playwright 1.62.0, `/ms-playwright`, Chromium 1234, Firefox 1538, and WebKit
2336. This closes local canonical visual proof; exact-SHA GitHub Actions
orchestration remains a separate external gate.
