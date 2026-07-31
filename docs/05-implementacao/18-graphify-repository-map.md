# Graphify architecture map

**Status:** REFRESHED_LOCALLY
**Baseline date:** 2026-07-30
**Phase 05 refresh:** 2026-07-31
**Graphify:** `0.9.31`
**Mode:** normal, undirected graph
**Analyzed root:** W_Flyer institutional-site repository

## 1. Role and precedence

Graphify is an auxiliary index for architectural discovery and navigation. It
does not replace ADRs, contracts, manifests, specifications, approved visual
references, or the normative order in `AGENTS.md`. A graph answer must be
checked at its cited source before it guides implementation.

Cross-cutting questions about routes, components, documents, and dependencies
should begin with the graph. A narrow local search remains more appropriate for
a known symbol or file.

## 2. Corpus and exclusions

The corpus starts at `.` and is filtered by `.graphifyignore`. Code,
configuration, tests, Storybook, normative documentation, and original SVG
assets remain included. Two raster images are explicit exceptions because they
are the canonical golden references:

- `docs/design-reference/golden-pages/master/wflyer-approved-master-board.png`;
- `docs/design-reference/golden-pages/application/application-desktop-light.png`.

The corpus excludes:

- `.git`, `node_modules`, `.next`, caches, and tool stores;
- builds, coverage, Playwright/Lighthouse reports, and generated Storybook;
- ordinary `graphify-out` outputs;
- vendored skills under `.codex/skills`;
- lockfiles, source maps, archives, and temporary files;
- non-canonical rasters, audio, video, and fonts.

Files detected as sensitive are omitted by Graphify and require separate
review; secrets must never be forced into the graph. Graphify 0.9.31
deliberately reinjects only `graphify-out/memory/*.md` into its feedback loop
despite the broader exclusion. This local exception is validated separately
and does not admit cache, JSON, HTML, raw queries, or other outputs as sources.

## 3. Reproducible generation

Prerequisites:

```bash
graphify --version
openspec --version
scripts/graphify-repository.sh deps
```

Initial interactive generation through Codex, required when no Gemini key is
available:

```text
$graphify .
```

Subsequent local operations:

```bash
scripts/graphify-repository.sh update
scripts/graphify-repository.sh validate
scripts/graphify-repository.sh query "pergunta arquitetural"
```

The `generate` subcommand accepts the headless flow only when
`GEMINI_API_KEY` or `GOOGLE_API_KEY` is already configured. Without either
key, it exits with explicit guidance to use the interactive skill; it does not
silently reduce the corpus to code.

## 4. Baseline and Phase 05 refresh statistics

<!-- GRAPHIFY_STATS_START -->
| Measure | Pre-Phase 05 | Post-Phase 05 | Delta |
|---|---:|---:|---:|
| Eligible files | 307 | 307 | 0 |
| Detected words | 247,658 | 268,080 | +20,422 |
| Nodes | 2,117 | 2,493 | +376 |
| Undirected edges | 3,142 | 3,699 | +557 |
| Communities | 234 | 257 | +23 |

The existing filtered configuration was preserved. The incremental refresh
re-extracted 158 code files without an LLM and incorporated the persistent
experience shell, pure motion domain, transition layer, score-anchor changes,
and Phase 05 tests. The final eligible-file count matches the baseline after
the active change was archived and its two canonical specifications were
created; generated output, caches, fonts, and non-canonical raster evidence
remain excluded.

The refreshed report classifies approximately 92% of relationships as
`EXTRACTED` and 8% as `INFERRED`, with 305 inferred edges at average confidence
0.92. `graphify diagnose multigraph` reports 2,493 verified nodes, 3,699 valid
edges, zero missing or dangling endpoints, zero self-loops, zero exact
duplicates, and no endpoint-pair collapse in the persisted graph.

The refresh is structural. Existing semantic memory from the pre-implementation
snapshot can still surface stale statements that Phase 05 is only planned.
Ten post-refresh queries were therefore checked against source locations, and
two explicit corrected memories now identify the implemented shell/state model
and the dedicated Phase 05 test matrix. Normative source and current code take
precedence over those historical semantic nodes.
<!-- GRAPHIFY_STATS_END -->

## 5. Communities and high-impact nodes

<!-- GRAPHIFY_COMMUNITIES_START -->
The refreshed graph contains 257 communities; 163 are shown in the expanded
report and 94 thin communities are omitted from that listing without being
removed from JSON or the standalone HTML.

Degree-ranked god nodes are now:

1. `SiteExperienceShell()` — 22 edges;
2. `scripts` — 21;
3. `LinkButton()` — 20;
4. `createPageMetadata()` — 18;
5. `compilerOptions` — 18;
6. the cumulative execution report — 18;
7. this Graphify map — 17;
8. the Graphify/OpenSpec bootstrap report — 17;
9. `classifyScoreTransition()` — 16;
10. `.next` — 16.

`SiteExperienceShell()` becoming the highest-degree code node is the material
architectural change that justified this refresh. `classifyScoreTransition()`
also entered the top ten, while `chapters.ts`, `SiteHeader()`, `OriginScore()`,
`ChapterScore()`, and the transition test community define its principal
integration boundary.
<!-- GRAPHIFY_COMMUNITIES_END -->

Communities are probabilistic groupings. A central node indicates topological
impact, not normative priority or permission to modify that node.

## 6. Phase 05 acceptance queries

Each result is classified as `EXTRACTED` when directly supported by graph
nodes and source locations, `INFERRED` when synthesized across graph evidence,
or `AMBIGUOUS` when the refreshed corpus is insufficient.

<!-- GRAPHIFY_QUERIES_START -->
1. **Which files control route-to-route animated navigation?** `EXTRACTED`:
   `RootLayout()` mounts `SiteExperienceShell()`, which coordinates eligible
   clicks, early App Router requests, pathname commits, and the presentation
   lifecycle. `topology.ts`, `eligibility.ts`, and `lifecycle.ts` supply pure
   contracts.
2. **Which components render the left and right musical-score branches?**
   `EXTRACTED`: `OriginScore()` renders the central bifurcation,
   `ChapterScore()` renders branch segments and real entry/exit anchors, and
   `ScoreTransitionLayer()` renders deterministic temporary continuity.
3. **Which hooks, providers, stores, or services manage transition state?**
   `EXTRACTED`: `SiteExperienceShell()` owns persistent React state and
   request-local runtime work; `navigationLifecycleReducer()` is the pure
   cancelable state model. No duplicate provider or global store exists. This
   corrects the pre-implementation memory that described both as plans.
4. **Which files map routes to chapter coordinates?** `EXTRACTED`:
   `src/config/chapters.ts` remains the single source through `ScoreManifest`,
   `scoreChapterByPath`, and coordinates -3 through +5;
   `classifyScoreTransition()` consumes those relationships.
5. **Which files control GSAP timelines and cleanup?** `EXTRACTED`:
   `SiteExperienceShell.tsx` creates scoped outgoing/incoming `gsap.context()`
   work, while `cleanup.ts` supplies `createCleanupRegistry()` and
   `scheduleRecoveryTimeout()` and `timing.ts` owns fixed budgets.
6. **Which files handle browser history and deep links?** `EXTRACTED`:
   `SiteExperienceShell.tsx` coordinates push, replace, pathname commits, and
   `popstate`; `topology.ts` normalizes paths. Server-rendered route files and
   real anchors keep direct and no-JavaScript navigation valid.
7. **Which files handle focus restoration after navigation?** `EXTRACTED`:
   the shell transfers ordinary link navigation to `main#main-content` with a
   visible indicator and deliberately leaves Back/Forward focus untouched.
   `phase05-navigation.spec.ts` and `phase05-navigation.a11y.spec.ts` verify
   focus, keyboard activation, and the single framework announcer.
8. **Which files implement `prefers-reduced-motion` behavior?** `EXTRACTED`:
   the shell observes the live media query and reverts incompatible active
   work; `ScoreTransitionLayer()` suppresses decorative drawing. Motion and
   axe suites cover initial and runtime preference states.
9. **Which tests currently cover Phase 05?** `EXTRACTED`: six pure-domain test
   files, component tests, 11 Storybook states, shared Playwright helpers, and
   dedicated E2E, motion, visual, and accessibility specs now cover the phase.
   This corrects the historical memory that described these scenarios as only
   planned tasks.
10. **Which highly connected nodes may be affected by Phase 05 changes?**
    `EXTRACTED`: the principal boundary is `RootLayout()` →
    `SiteExperienceShell()` → chapter manifest/motion domain, with
    `SiteHeader()`, `OriginScore()`, and `ChapterScore()` supplying the pivot
    and measured anchors. The shell is now the graph's top god node at 22
    edges.

All ten queries used vocabulary-expanded BFS traversal with bounded output.
The answers were checked at the reported source locations and saved to local
Graphify memory as 8 useful results and 2 corrections. Raw query output and
memory remain ignored; absence from a bounded traversal is not proof of absence
without checking current source.
<!-- GRAPHIFY_QUERIES_END -->

## 7. Integrity and versioning

Version-controlled outputs are:

- `graphify-out/GRAPH_REPORT.md`, as an auditable text report;
- `graphify-out/CHECKSUMS.sha256`, for local-output verification;
- this map, the exclusion policy, and the repository script.

`graph.json`, the standalone HTML, caches, manifests, sidecars, vocabulary,
memory, and raw query output remain local and ignored. The manifest is portable
and root-relative, so the graph can be rebuilt through the documented workflow.

Graphify 0.9.31 still exports an HTML reference to `vis-network` on a CDN. The
repository script downloads only pinned version `9.1.6`, verifies its declared
SRI, and embeds it into the HTML. The validated output has no remote script or
stylesheet dependency.

## 8. Limitations

- The structural refresh uses local AST extraction. Historical semantic nodes
  are retained until a future full semantic rebuild; corrected query memories
  and current source resolve the known Phase 05 contradictions.
- Semantic subagent extraction does not expose token counts to the current
  orchestrator, so recorded cost remains zero/unknown rather than estimated.
- The active installation is Graphify `0.9.31` through `uv`; an inactive
  alternative `pipx` installation was not removed.
- The user's global skill remains `0.9.23`, while the repository-local skill is
  `0.9.31` and takes precedence. The CLI warning about the global copy is
  therefore benign and no reinstall was performed.
- This map represents the local snapshot above. Later structural changes still
  require `scripts/graphify-repository.sh update`, validation, and checksums.
- Phase 05 runtime relationships now exist in code. Features that belong to
  Phases 06–08 remain plans until their own implementation gates are completed.
