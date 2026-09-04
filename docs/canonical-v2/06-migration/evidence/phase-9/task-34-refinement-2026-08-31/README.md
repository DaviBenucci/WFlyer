# Phase 9 Task-34 Choreography/PRELAUNCH Refinement Evidence

Capture date: 2026-09-03  
Status: automated acceptance evidence complete; external human visual acceptance pending

## Scope and decision boundary

This sibling bundle records the bounded choreography, semantic-header, immersive
footer, and Application PRELAUNCH refinement requested after the historical
Task-34 checkpoint. It does not reopen or rewrite that checkpoint. The sealed
historical bundle remains at
`../task-34-integration-review-2026-08-31/`, and its detached manifest digest
remains
`c4bec2d7f6b546c44d9b7bd053ad0b4ff0c42d1d143cc079dd0714068c3fef8a`.

The repository base commit used for this final capture is
`2ffef25b3ba621b535a00c001d68fc3a6977085c`. The captures also include the
working-tree accessibility expectation corrections and the capture harness
named below. No commit, push, deployment, DNS change, public `/` cutover, or
production mutation is part of this evidence.

Automated OpenSpec items 1.1 through 7.2 are supported by the implementation
and evidence summarized here. Item 7.3 is intentionally open: an external
human must accept the visuals before this focused change may complete, parent
Task 35 may begin, or Gate 9 may be called PASS.

## Deterministic capture contract

Capture command:

```bash
node scripts/capture-phase9-refinement-evidence.mjs
```

The script owns a local Next development server unless
`WFLYER_EVIDENCE_BASE_URL` is supplied, uses the exact review route
`http://127.0.0.1:43129/__visual-lab/story/motion`, and selects each scene with
`window.__WFLYER_PHASE5_MOTION__.position(chapterId)`. The capture is therefore
based on canonical story positions rather than click-map or image-coordinate
navigation. `capture-manifest.json` records every file, active chapter,
selection method, projection mode, theme, dimensions, route, and browser.

The final run produced 25/25 viewport screenshots with Chromium
151.0.7922.34 at device scale 1:

- 13 dark desktop scene frames at 1536x900, one for every physical story scene;
- 9 dark desktop diagnostic frames at 1536x900: Services lead-in, expansion,
  and lead-out; How It Works lead-in, expansion, and lead-out; and rendered
  Projects visits 1, 2, and 3;
- 1 light horizontal Home regression at 1536x900;
- 1 dark compact Launch regression at 390x844;
- 1 dark compact Projects regression at 390x844.

Before any screenshot, the harness fails unless the rendered score reports two
Composer invocations, zero connector events, zero path self-intersections,
zero staff-line self-intersections, and a maximum notation tangent no greater
than 18 degrees. Horizontal captures additionally require DOM-measured
Services and How It Works geometry. Diagnostic captures fail unless the
expected rendered cards, interaction lines, and project visit anchors exist.

The server uses Cloudflare's public test site key and a local deterministic
Turnstile browser stub. The Launch form is required to remain `IDLE`; Contact
is intentionally required to remain `deferred` until user interaction. This is
local UI evidence only and does not prove a real Turnstile hostname/action,
mailbox, provider acceptance, or message delivery.

## Manual inspection of the generated images

All 25 final PNGs were inspected at original resolution, including aggregate
contact sheets and individual full-resolution checks of Contact and compact
Launch. The inspection found:

- every frame is readable and identifies the intended active scene;
- the large approved Home treble clef and the two lower-corridor departures
  remain clear in both dark and light themes;
- protected headings, cards, APP-04 media, Contact content, and Launch form
  remain foreground-readable without score collisions;
- both branch terminals visibly end at the physical thin-gap-thick final
  barline;
- Services and How It Works diagnostics visibly distinguish approach,
  expanded, and recovery spans with review-only cyan overlays;
- Projects diagnostics visibly associate three distinct rendered anchors with
  project cards 1, 2, and 3;
- compact Launch is readable in the truthful idle state and compact Projects
  remains readable in its representative top-of-scene viewport;
- Contact shows the intended deferred verification message, not a provider or
  loading error.

The cyan diagnostic labels, outlines, highlighted staff paths, and visit
anchors exist only in the capture harness. The screenshots are review evidence,
never shippable backgrounds, pixel goldens, or interaction maps.

## Automated acceptance result

`validation-results.json` is the machine-readable result ledger. The relevant
non-overlapping or intentionally overlapping test lanes must be read
individually rather than summed into one synthetic total.

| Lane | Recorded result |
|---|---:|
| Dependency policy | PASS |
| ESLint, zero warnings | PASS |
| Next route type generation + strict TypeScript | PASS |
| Focused unit/component | 23 files, 126 tests PASS |
| Focused projection | 18/18 PASS |
| Phase-8/PRELAUNCH Chromium | 14/14 PASS |
| Semantic header Chromium | 9/9 PASS |
| Score integration Chromium | 4/4 PASS |
| Score integration three-engine total | 12/12 PASS |
| Score refinement Chromium accepted-family subset | 3/3 PASS, serial |
| Score refinement three-engine total | 12/12 PASS after one stale floor assertion correction |
| PRELAUNCH targeted three-engine evidence | 17/18 initial plus unchanged focused WebKit 1/1 confirmation |
| Accessibility applicable total | 193/193 PASS; 2 intentional forced-colors skips |
| Storybook interactions | 13 files, 63 tests PASS with polling watcher |
| Storybook static build | PASS |
| Production Next build | PASS; 40 static pages generated |
| Existing visual snapshots | no diff; pinned manifest 84/84 PASS |
| Approved Music source/runtime SVGs | no diff; pinned manifest 16/16 PASS |
| Strict focused OpenSpec validation | 1/1 valid; zero issues |
| Historical Task-34 evidence seal | 11 payload files plus manifest digest PASS |

The accepted-family regression was recovered first and was not restarted:

```bash
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 \
  pnpm exec playwright test tests/e2e/phase09-score-refinement.spec.ts \
  --project=chromium --workers=1 --retries=0 \
  --grep "shared Services and How It Works|accepted Family-A|rendered three-card Projects"
```

Result: 3/3 passed. The complete refinement suite then established a 12/12
three-engine aggregate. Its first cross-engine pass was 11/12 only because a
Firefox observation of 23.65 was validly above the 23.64 minimum clearance but
the test still required exact equality. The assertion was corrected to encode
the approved minimum-floor contract, and the focused unchanged Firefox case
passed 1/1. Product geometry was not changed to satisfy that test.

## Accessibility and framework-announcer repair

The first dedicated `tests/a11y` serial run recorded 169 passes, 6 failures,
2 intentional skips, and 18 tests not run after project-local serial failure.
All six failures were stale expectations rather than product defects:

- the Phase-2 header list omitted the now-canonical `#lancamento` and
  `#processo` targets;
- the navigation assertion required only `document.title`, while the installed
  Next route announcer is documented and implemented to choose the destination
  name from title, then H1, then pathname.

Only those assertions were updated. A focused three-engine run of the two
affected files then passed 33/33. Combined with the unaffected cases from the
initial run, the final applicable accessibility result is 193/193; the two
skips are the pre-existing Firefox/WebKit exclusions for a Chromium-only
forced-colors evidence case. No accessibility rule or product behavior was
disabled, loosened, or removed.

## Failure and environment ledger

Intermediate outcomes are retained rather than restated as single-run green:

- Storybook's first interaction invocation hit the host `ENOSPC` watcher
  limit before tests began. Re-running the same suite with
  `CHOKIDAR_USEPOLLING=1` passed 13 files and 63 tests. The static Storybook
  build passed; its large-chunk warning is non-fatal.
- The PRELAUNCH targeted multi-engine lane first recorded 17/18. The unchanged
  focused WebKit case passed 1/1, so the evidence is an aggregate confirmation,
  not a falsely claimed single 18/18 run.
- The first capture-authoring attempt stopped after 19 temporary images because
  of a local `projectIndex` identifier typo. The second correctly reached
  Contact but used an invalid `verified` precondition for its intentionally lazy
  Turnstile lifecycle. Both incomplete directories were moved to desktop Trash
  and are recoverable; neither is part of this bundle. The clean final run
  passed all 25 capture preconditions.

## Integrity and exclusions

`SHA256SUMS.txt` covers this README, `capture-manifest.json`,
`validation-results.json`, and all 25 PNGs. `SHA256SUMS.txt.sha256`
authenticates that payload manifest. Both must pass
`sha256sum --check --strict` after the payload is closed.

The following remain explicitly unproved and pending outside local automated
acceptance: real email delivery, mailbox existence, verified sender state,
Resend domain tracking configuration, production Turnstile hostname/action,
staging behavior, physical-device presentation, owner homologation, and
production behavior. No final Persona or APP-04 media asset is invented here.

## External human visual acceptance checklist

Review the 25 files in numerical order and decide whether the approved
choreography is accepted as captured. In particular, confirm:

1. Home scale/origin and both branch departures;
2. negative-space routing in every protected scene;
3. Services and How It Works approach/expansion/recovery behavior;
4. all three Projects visits;
5. Launch and Contact form clearance;
6. both physical terminal barlines;
7. dark desktop, light Home, and compact Launch/Projects presentation.

Until that explicit decision is recorded, OpenSpec item 7.3 stays unchecked,
the focused change stays active, parent Task 35 stays unchecked, and Gate 9
stays open.
