# Graphify architecture map

**Status:** REFRESHED_LOCALLY
**Baseline date:** 2026-07-30
**Phase 05 refresh:** 2026-07-31
**Phase 08 refresh:** 2026-07-31
**Phase 09 closure refresh:** 2026-08-03
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

## 4. Historical and current refresh statistics

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

### 4.1 Accumulated Phase 08 structural refresh

After Phases 06–08, `graphify update .` re-extracted the filtered code corpus
and advanced the graph from the Phase 07 checkpoint of 2,651 nodes / 3,859
edges / 282 communities to 2,793 / 4,038 / 287. Relative to that checkpoint,
the contact and security boundary added 142 nodes, 179 edges, and 5
communities. The filtered corpus and `.graphifyignore` were preserved; no full
working-directory or secret-bearing scan was performed.

Read-only multigraph diagnostics report 2,793 verified nodes, 4,038 valid
undirected edges, and zero missing endpoints, dangling endpoints, self-loops,
exact duplicates, or endpoint-pair collapses. The degree-ranked top ten remain
unchanged, while `ContactForm()`, `POST()`, `readLimitedBody()`,
`verifyTurnstile()`, and `sendContactEmail()` now form one extracted contact
community connected to route, content, tests, Resend, and runtime
configuration.

A bounded Phase 08 query traced that complete path and exposed one historical
memory claiming that the endpoint was still unimplemented. The result was
saved as a correction: current source now implements and tests the client,
server, Turnstile, and Resend workflow; edge rate limiting, HSTS, provider
credentials, and CSP enforcement remain external staging gates.

### 4.2 Phase 09 closure and Graphify 0.9.31 semantic refresh

The initial Phase 09 closure snapshot contained 3,081 nodes, 4,322 undirected
edges, and 328 communities. After ADR-024 and the Napoleon branch contract were
added, the Graphify 0.9.31 refresh re-extracted 95 changed semantic sources and
the final filtered 189-file code corpus. The semantic fragments contributed
237 nodes, 282 edges, and 15 hyperedges before merge; replacement and the new
deduplication pass compacted 202 nodes. After the final two-file semantic
reconciliation and structural pass, that snapshot contained 2,308 nodes, 3,633
edges, and 239 communities. The subsequent branch-freeze correction triggered
one bounded incremental refresh over ten semantic sources and one changed test.
Its semantic fragments contributed 45 nodes, 79 edges, and 5 hyperedges, while
AST extraction contributed 4 nodes and 9 edges; replacement deduplicated 6
exact nodes. The wrapper's final 189-file structural reconciliation restored 6
additional AST nodes and reclustered the result. The current persisted graph
contains 2,307 nodes, 3,640 edges, and 247 communities across a filtered
390-file / approximately 316,259-word report corpus.

The decrease is therefore a versioned re-extraction/compaction event, not a
Phase 09 feature delta and not evidence that repository code was removed. The
existing `.graphifyignore` and repository wrapper were preserved; no broad
workspace, generated-output, or secret-bearing scan was performed.

`graphify diagnose multigraph` reports 2,307 verified nodes and 3,640 valid
edges, with zero missing or dangling endpoints, self-loops, exact duplicates,
or endpoint-pair collapses. Wrapper validation also verified the standalone
HTML, filtered source scope, and SHA-256 checksums. During the semantic merge,
legacy visual-asset hyperedges whose members no longer matched rebuilt node IDs
were dropped; no persisted ordinary edge failed the final diagnostics.

The new extracted relationships connect deployment selection through
`deployment.ts`, `layout.tsx`, `robots.ts`, `next.config.ts`, four-mode builds,
and `smoke-indexing.mjs`; release provenance through the protected manual
workflow, standalone preparation, `create-release-manifest.mjs`, and focused
tests; and external operations through the Napoleon/Cloudflare runbook,
production-safe staging suite, rollback checklist, and mandatory
`app.wflyer.com.br` preservation boundary. These are repository contracts,
not evidence that external staging or rollback has run.

## 5. Communities and high-impact nodes

<!-- GRAPHIFY_COMMUNITIES_START -->
At the Phase 05 checkpoint the refreshed graph contained 257 communities. The
current Graphify 0.9.31 snapshot contains 247; the generated report may omit thin
communities from its prose without removing them from JSON or standalone HTML.

Current degree-ranked god nodes are:

1. the angular winged W_Flyer symbol — 39 edges;
2. `scripts` — 24;
3. the custom angular italic W_Flyer wordmark — 23;
4. `SiteExperienceShell()` — 22;
5. `LinkButton()` — 20;
6. `createPageMetadata()` — 18;
7. `compilerOptions` — 18;
8. the normative documentation index — 18;
9. `classifyScoreTransition()` — 16;
10. the chapter-score manifest — 16.

`SiteExperienceShell()` remains the most central behavioral implementation.
The refreshed semantic graph also exposes the brand vectors, operational
scripts, and normative index as high-degree cross-community nodes. Centrality
was treated as review priority, not as proof of missing coverage or permission
to refactor.
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

### 6.1 Final F00–F09 audit and release queries

After the Phase 09 refresh, the required audit repeated ten bounded questions:
main-route implementations, shared archetype components, double-score files,
GSAP lifecycle/cleanup, theme propagation, interactive tablet, Contact
endpoint, security headers, tests per completed phase, and changed central
files without matching tests. The graph reconnected each domain to current
source and test communities. The broad untested-central query was semantically
weak and therefore was not treated as proof of absence; current diffs and
focused tests were checked directly.

Four additional queries exercised the release boundary:

1. indexing connected `deployment.ts`, layout/robots/Next configuration,
   `deployment-environment.test.ts`, four build modes, and indexing smoke;
2. candidate identity connected the manual workflow, one resolved SHA,
   standalone preparation, manifest generation, checksum, and workflow/
   manifest regression tests;
3. operations connected the staging runbook, public staging smoke, Napoleon
   handoff, rollback checklist, incident guidance, and separate-application
   preservation;
4. coverage connected deployment, Next configuration, release workflow,
   manifest, and public-staging suites to their implementation nodes.
5. the owner-confirmed Napoleon handoff connected
   `develop/site-institucional`, the read-only CI workflow, the full release
   SHA, explicit provider configuration, and public staging validation. The
   branch integration is now known; the provider-specific build/start,
   environment-scope, health, and rollback controls still require panel
   inventory before staging can be claimed.

No duplicate navigation provider, second animation engine, disconnected tablet
or Contact implementation, stale route mapping, invented deployment mechanism,
write-enabled deployment automation, or central changed source file without
proportionate focused evidence was found.

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

- The 0.9.31 semantic refresh replaced every changed document/image source;
  semantic nodes for untouched sources remain from their last successful
  extraction. Corrected query memories and current source resolve known
  historical contradictions.
- Legacy visual hyperedges with members absent after node-ID replacement were
  dropped during merge. The persisted graph has no missing/dangling ordinary
  edges or endpoint collapse, while the approved visual sources remain the
  normative evidence.
- Semantic subagent extraction does not expose token counts to the current
  orchestrator, so recorded cost remains zero/unknown rather than estimated.
- The active installation is Graphify `0.9.31` through `uv`; an inactive
  alternative `pipx` installation was not removed.
- The global and repository-local Graphify skills are both aligned with
  `0.9.31`; the active CLI is also `0.9.31`.
- This map represents the local snapshot above. Later structural changes still
  require `scripts/graphify-repository.sh update`, validation, and checksums.
- Phase 05–09 repository relationships now exist in current code and
  documentation. Hosting, deployed staging, external-provider validation,
  rollback rehearsal, and production release remain external until their
  infrastructure gates are completed.
