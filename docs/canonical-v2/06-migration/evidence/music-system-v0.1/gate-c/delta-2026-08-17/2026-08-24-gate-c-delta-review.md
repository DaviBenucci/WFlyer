# Music System v0.1 Gate C corrective delta — automated review bundle

**Sealed:** 2026-08-24  
**Branch:** `develop/site-institucional`  
**HEAD:** `784856b5b34ef87c8be24ab666d5d37756573ded`  
**Environment:** local dirty worktree / noncanonical Ubuntu visual host  
**Automated status:** complete  
**Human Gate C:** pending  
**OpenSpec human task:** `7.7` remains incomplete  
**Public landing integration:** absent and unauthorized

## 1. Resume audit

The interrupted conversation did not define the resume point. Repository logs do.
OpenSpec was `48/55` before resume. All 20 steps of
`scripts/run-music-gate-c-delta-validation.mjs` had actually completed with
`exitCode: 0`, including the final public regression and both pinned immutable
post-checks. The last runner step finished at `2026-08-18T20:08:23.424Z`.

The first incomplete action was the structural Graphify refresh. No capture,
source, browser, production, or public-regression phase was rerun. Existing logs
were reused because they are complete, include command/start/finish/timeout/exit
metadata, and no relevant source/test/script/OpenSpec file changed after their
final post-check before this evidence-only closeout began.

## 2. Decision boundary

| Classification | Status |
|---|---|
| Gate-B glyph metrics/anchors and down-flag transform | Externally approved on 2026-08-15; unchanged |
| Eight source + eight runtime SVG files | Immutable; 16/16 byte-identical |
| Existing committed visual snapshots | Immutable; 84/84 byte-identical |
| Original Gate-C renderer/Composer values | Draft human-review candidates; unchanged |
| `tupletNumeralSizeSp=0.75` | Draft human-review candidate |
| `tupletNumeralSideGapSp=0.18` | Draft human-review candidate |
| `maxNotationTangentAngleDeg=18` | Draft human-review candidate |
| Responsive activation thresholds | Not canonicalized; outside this Gate-C decision |
| Corrective PNG/JSON artifacts | Candidate evidence, not approved goldens |
| Automated validation results | Verified facts, not optical approval |
| Landing integration | Not present and not authorized |

## 3. Named corrective work

### Triplet presentation

Every `E8_TRIPLET_3` retains exactly three eighth notes, one primary beam, one
bracket, and the numeral `3`. The bracket is split around the centered numeral.
The rendered gap equals the numeral width plus two `0.18 staffSpace` side gaps;
the numeral size is `0.75 staffSpace`. Six dedicated fixtures cover UP/DOWN stems
on straight, gentle-arc, and gentle-S paths in both themes.

### Responsive score projection

The semantic score and physical projection are separate. The four conceptual
modes preserve seed, Composer version, chapter, motif IDs/order, semantic slot
IDs, staffSteps, durations, contour IDs/translations, reserved slots, and key
signature configuration. Compact/wide/static vertical-document projections use
left-to-right notation-safe spans joined by continuous, event-free connectors.
Notation spans satisfy the active draft 18-degree tangent limit; a direct
left-to-right 19-degree rejection test protects the boundary. The clef remains
upright and unmodified, and the final barline remains conventionally oriented.

## 4. Candidate evidence index

| Evidence | Path |
|---|---|
| Updated motif matrix, light | `01-motif-matrix-light.png` |
| Updated motif matrix, dark | `02-motif-matrix-dark.png` |
| Updated responsive mobile | `08-responsive-vertical-mobile.png` |
| Triplet detail, light | `10-triplet-detail-light.png` |
| Triplet detail, dark | `11-triplet-detail-dark.png` |
| Responsive orientation, light | `12-responsive-orientation-light.png` |
| Responsive orientation, dark | `13-responsive-orientation-dark.png` |
| Semantic equivalence | `gate-c-delta-semantic-equivalence.json` |
| Corrective proposals | `gate-c-delta-proposals.json` |
| Performance projection | `../gate-c-performance.json` plus `validation/2026-08-17-dev-lab-cross-engine.log` |
| Accessibility | `validation/2026-08-17-dev-lab-cross-engine.log` |
| Structural isolation | `validation/2026-08-24-graphify-isolation-paths.log` |
| Changed-file inventory | `2026-08-24-gate-c-delta-changed-files.txt` |
| Checksum manifest | `SHA256SUMS.txt` |

## 5. Validation ledger

Every reused runner result below was produced after the corrective source/tests
were in place and before any resumed evidence-only documentation edits.

| Suite | Command | Result | Exit | Evidence / completed UTC |
|---|---|---|---:|---|
| Dependency validation | `pnpm validate:dependencies` | PASS; exact dependency policy | 0 | `validation/2026-08-17-dependency-validation.log` / `2026-08-18T19:58:08.094Z` |
| Lint | `pnpm lint` | PASS; 0 errors, 0 warnings | 0 | `validation/2026-08-17-lint.log` / `2026-08-18T19:58:15.754Z` |
| TypeScript | `pnpm typecheck` | PASS; route type generation + `tsc --noEmit` | 0 | `validation/2026-08-17-typecheck.log` / `2026-08-18T19:58:18.556Z` |
| Focused music tests | `pnpm exec vitest run --project=unit tests/unit/music/geometry tests/unit/music/renderer tests/unit/music/composer tests/unit/music/presentation/score-svg.test.tsx src/app/%5F_visual-lab/music/_fixtures/lab-score-models.test.ts src/app/%5F_visual-lab/music/_fixtures/gate-c-review.test.ts` | PASS; 21 files, 211 tests | 0 | `validation/2026-08-17-focused-music-tests.log` / `2026-08-18T19:58:26.241Z` |
| Full unit tests | `pnpm test` | PASS; 61 files, 537 tests | 0 | `validation/2026-08-17-unit-tests.log` / `2026-08-18T19:58:46.682Z` |
| Storybook static build | `pnpm build:storybook` | PASS; one nonfatal chunk-size warning | 0 | `validation/2026-08-17-storybook-build.log` / `2026-08-18T19:58:52.156Z` |
| Storybook browser tests | `pnpm test:storybook` with `CHOKIDAR_USEPOLLING=1` | PASS; 13 files, 63 tests | 0 | `validation/2026-08-17-storybook-tests.log` / `2026-08-18T19:59:21.571Z` |
| Visual Lab Chromium | recorded three-engine Playwright command | PASS; 22 passed, 1 contract skip | 0 | `validation/2026-08-17-dev-lab-cross-engine.log` / `2026-08-18T20:02:15.594Z` |
| Visual Lab Firefox | same | PASS; 21 passed, 2 contract skips | 0 | same |
| Visual Lab WebKit | same | PASS; 21 passed, 2 contract skips | 0 | same |
| Cross-engine accessibility subset | same combined log | PASS; 37 passed, 2 forced-colors skips | 0 | same |
| Production Next build | `pnpm build` | PASS; optimized build and 30 static-generation entries | 0 | `validation/2026-08-17-production-build.log` / `2026-08-18T20:03:49.262Z` |
| Standalone packaging | `pnpm prepare:standalone` | PASS | 0 | `validation/2026-08-17-prepare-standalone.log` / `2026-08-18T20:03:49.707Z` |
| Production Visual Lab 404 | recorded three-engine Playwright 404 command | PASS; 3 tests and 24/24 route-engine 404 assertions | 0 | `validation/2026-08-17-production-lab-404-cross-engine.log` / `2026-08-18T20:03:52.579Z` |
| Music/public boundaries | recorded focused Vitest command | PASS; 2 files, 3 tests | 0 | `validation/2026-08-17-music-boundary-tests.log` / `2026-08-18T20:04:06.370Z` |
| Public regression Chromium | recorded five-file Playwright command | PASS; 51 tests | 0 | `validation/2026-08-17-public-functional-regression.log` / `2026-08-18T20:08:23.280Z` |
| Public regression Firefox | same | PASS; 51 tests | 0 | same |
| Public regression WebKit | same | PASS; 51 tests | 0 | same |
| Snapshot Git diff | `git diff --exit-code -- tests/visual` | PASS; no diff | 0 | `validation/2026-08-17-committed-snapshot-diff.log` / `2026-08-18T20:08:23.285Z` |
| Snapshot pinned manifest | recorded `sha256sum --check --strict` | PASS; 84/84 | 0 | `validation/2026-08-17-committed-snapshot-pinned-manifest.log` / `2026-08-18T20:08:23.413Z` |
| Approved SVG Git diff | recorded scoped `git diff --exit-code` | PASS; no diff | 0 | `validation/2026-08-17-approved-svg-diff.log` / `2026-08-18T20:08:23.417Z` |
| Approved SVG pinned manifest | recorded `sha256sum --check --strict` | PASS; 16/16 | 0 | `validation/2026-08-17-approved-svg-pinned-manifest.log` / `2026-08-18T20:08:23.424Z` |
| Structural Graphify refresh | `scripts/graphify-repository.sh update` | PASS; 4,465 nodes, 7,342 edges, 430 communities | 0 | `validation/2026-08-24-graphify-update.log` |
| Graph isolation paths | five `graphify path` queries | PASS; no public/legacy integration path | 0 | `validation/2026-08-24-graphify-isolation-paths.log` |
| Strict OpenSpec, final | `pnpm exec openspec validate implement-music-system-v0-1 --strict` | PASS; 1/1 valid, 0 issues | 0 | `validation/2026-08-24-final-openspec-strict-validation.log` |
| Final format diff | `git diff --check` | PASS | 0 | `validation/2026-08-24-final-format-diff-check.log` |

### Reused structured performance evidence

`../gate-c-performance.json` was captured on 2026-08-17 and remains the complete
machine-readable memo-result/commit projection for task 7.6. It is reused because
the corrective delta did not change its semantic counters or scroll ownership,
and the post-correction three-engine Visual Lab test reran the same performance
contract successfully in `validation/2026-08-17-dev-lab-cross-engine.log`.

## 6. Immutable baseline

| Baseline | Before resume | Final post-seal | Match |
|---|---|---|---:|
| 16 approved source/runtime SVGs | `38ad23abbd642bac57bae9781f66124a46efde90b2921de2c0811966d93bab65` | `38ad23abbd642bac57bae9781f66124a46efde90b2921de2c0811966d93bab65` | 16/16 |
| 84 committed visual snapshots | `ba4f23c08613c1c1c9a1481fa6d8466dd7bfa0641cf3b6ae898424966ccc6b63` | `ba4f23c08613c1c1c9a1481fa6d8466dd7bfa0641cf3b6ae898424966ccc6b63` | 84/84 |

The final reproduction and pinned-manifest check is retained in
`validation/2026-08-24-final-immutable-check.log`. Corrective images are separate
candidate evidence and did not replace committed snapshot baselines.

## 7. Graphify and isolation

The 2026-08-24 structural refresh produced 4,465 nodes, 7,342 edges, and 430
communities. Graph integrity reports zero missing/dangling endpoints, self loops,
duplicates, or collapsed edges. The update reports 17 data files that produce no
AST nodes and a community-label drift diagnostic; neither affects the verified
music-to-public isolation paths. Full document/image semantic extraction was not
needed for OpenSpec task 8.4, which explicitly requires structural refresh after
code changes and relationship inspection.

## 8. OpenSpec truth

Automated tasks `8.1` through `8.6` are complete and independently supported by
the paths above. Overall progress is `54/55`. Task `7.7` remains the sole
incomplete task because deterministic candidate evidence is not human approval.
The change remains active and unarchived.

## 9. Required human decision

The reviewer must decide whether to approve the corrected triplet presentation,
responsive orientation, the three named draft candidates, and the unchanged
original Gate-C renderer/Composer candidate set. Until an explicit approval is
recorded:

- Gate C remains pending;
- task `7.7` remains unchecked;
- no draft value becomes canonical;
- no snapshot becomes an approved cross-host golden;
- no new Music System code is wired into the public landing;
- the change is not archived and Phase 2 does not begin.

## 10. Evidence limits

This bundle proves a local dirty-worktree candidate, not a committed exact-SHA
release. It does not claim staging, provider delivery, physical-device review,
screen-reader review, homologation, asset approval, deployment, or production
validation. Those remain outside this isolated Gate-C delta.
