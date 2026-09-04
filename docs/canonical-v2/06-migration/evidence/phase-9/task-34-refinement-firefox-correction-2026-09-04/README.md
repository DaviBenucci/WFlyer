# Phase 9 Firefox and Demo Geometry Correction Evidence

Capture date: 2026-09-04  
Status: automated correction evidence complete; external human visual acceptance pending

## Scope and authority

This bundle is the authoritative corrective addendum for the active OpenSpec
change `refine-phase-9-score-choreography-and-prelaunch`. It records the
Firefox staff-line corrections and the Application Demo CTA-clearance
correction discovered during the broad rerun. It does not rewrite either prior
bundle:

- the sealed historical Task-34 checkpoint remains at
  `../task-34-integration-review-2026-08-31/`, with detached manifest digest
  `c4bec2d7f6b546c44d9b7bd053ad0b4ff0c42d1d143cc079dd0714068c3fef8a`;
- the first refinement candidate remains at
  `../task-34-refinement-2026-08-31/`, with detached manifest digest
  `1ce1043412c6ad77b34c0d77bad565cb9aef3af6808c8b54d48b0d7e13fdc442`.

Both prior manifests still verify byte-for-byte. The repository base is
`2ffef25b3ba621b535a00c001d68fc3a6977085c`; the correction itself is an
uncommitted working-tree review state. No commit, push, deployment, public `/`
cutover, DNS change, or production mutation is represented here.

OpenSpec remains 20/21. Item 7.3, parent Task 35, Gate 9, and Phase 9 remain
open pending explicit external human visual acceptance.

## Diagnosis and geometric correction

The originally reported Firefox failure was reproduced at exactly 1920x917:
the fifth Application staff line crossed itself on the terminal return.
Additional measured failures at 1536x864 and tall 1920x1200/2304x1200
viewports exposed two other fragile horizontal regimes. The retained generic
corrections:

- bound the Home-origin turn before the complete outer staff can fold through
  the shallow measured arrival;
- cap the terminal return lane to one complete staff envelope around the
  terminal shelf;
- include the measured How departure endpoint when selecting the Overview
  lower lane on tall viewports.

The next full rerun exposed a separate real Chromium defect at 1536x900. The
Application Demo-to-Launch return hairpin reached the Demo CTA with a measured
clearance of -0.90 px (`COLLISION`); the surrounding paragraph was only 3.50 px
away (`TOO_CLOSE`). Reverting each Firefox correction separately and then all
three together did not remove that collision. The clean base projection still
failed, proving that the Firefox changes neither introduced nor required the
Demo defect; the broader acceptance run merely exposed a latent clearance gap.

The Demo shelf had reserved 5.75 staff spaces before the content edge, but the
outbound staff must reverse tangent there, so the outer line extends farther
right than its centerline shelf. The correction reserves 7.25 staff spaces and
guarantees a 6.25-space usable shelf before the return. The approved 12 px
clearance threshold was not changed. The deterministic final capture measures
the CTA at 30.76 px and classifies it `CLEAR`.

An alternative experiment that lowered the return lane created two
Application path intersections and eleven staff-line intersections. It was
discarded and is not part of the final geometry.

## Permanent regression coverage

The correction is guarded at the smallest useful boundaries:

- exact measured projection fixtures cover Firefox 1536x864 and 1920x917;
- browser cases cover measured 1536x864, 1920x917, and 1920x1200 regimes;
- the accepted Family-A browser audit now measures the actual Demo CTA and
  requires `CLEAR` with at least 12 px, while retaining the existing tablet
  and Launch-form floors.

No accepted Services, How It Works, Projects, Contact, Launch, terminal,
header, composition, fingerprint, connector-event, or final-barline contract
was weakened.

## Visual-evidence staleness audit

The first refinement bundle is retained as historical evidence, but it must
not be used alone for current horizontal Application geometry. Exact pixel
comparison at 1536x900 established:

| Prior capture | Changed pixels | Current disposition |
|---|---:|---|
| `01-scene-home-dark-1536x900.png` | 0 | byte-identical; revalidated here |
| `02-scene-application-overview-dark-1536x900.png` | 0 | byte-identical; revalidated here |
| `03-scene-application-how-it-works-dark-1536x900.png` | 0 | byte-identical; revalidated here |
| `04-scene-application-benefits-dark-1536x900.png` | 104 | superseded by current capture 04 |
| `05-scene-application-demo-dark-1536x900.png` | 3,269 | superseded by current capture 05 |
| `06-scene-application-access-dark-1536x900.png` | 367,960 | superseded by current capture 06 |
| `07-scene-application-terminal-dark-1536x900.png` | 375,558 | superseded by current capture 07 |

The Benefits delta is confined to a 22x26 px edge region and has no pixel with
channel delta above 16, but it is still treated as stale rather than ignored.
The prior light Home regression was separately recaptured and remained
byte-identical. Prior Professional, diagnostic, and vertical-compact captures
08 through 25 do not exercise the modified horizontal Application geometry and
remain supporting evidence. The prior capture manifest and validation ledger
remain truthful historical records, but their source hashes, test counts, and
pre-correction geometry cannot serve as the current correction manifest.

For current review, use this addendum for Home and every horizontal
Application scene plus the Firefox boundary regimes. Use the unaffected prior
captures only for Professional, interaction diagnostics, light Home, and
vertical-compact presentation.

## Deterministic capture contract

Capture command against the owned deterministic development server:

```bash
WFLYER_EVIDENCE_BASE_URL=http://127.0.0.1:43129 \
  node scripts/capture-phase9-firefox-demo-correction-evidence.mjs
```

The harness selects canonical scenes through
`window.__WFLYER_PHASE5_MOTION__.position(chapterId)`, waits for `REVEALED`,
uses DOM-measured exclusions, and fails before capture unless the score reports
two Composer invocations, zero connector events, zero path intersections, zero
staff-line intersections, and notation tangents no greater than 18 degrees.
Launch must remain in the truthful `IDLE` state. The server uses Cloudflare's
public test key and a deterministic local Turnstile stub; this is not provider
or delivery evidence.

The final run produced 11/11 captures:

- seven current Chromium 1536x900 views: Home and the complete horizontal
  Application sequence through its terminal;
- Firefox Home at 1536x864;
- the exactly reported Firefox terminal at 1920x917;
- Firefox Overview and How at 1920x1200.

Every capture records zero page errors, zero path intersections, and zero
staff-line intersections in `capture-manifest.json`. All 11 PNGs were inspected
at original resolution. Text remains readable, score routing remains outside
protected content, the Demo CTA has visible clearance, Launch remains idle,
and both Chromium and Firefox terminals close without a crossing.

## Automated validation result

`validation-results.json` is the exact machine-readable ledger. The final
state includes:

| Lane | Recorded result |
|---|---:|
| Dependency policy | PASS |
| ESLint | PASS, zero warnings |
| Strict TypeScript and Next route generation | PASS |
| Projection unit suite | 20/20 PASS |
| Focused unit/component suite | 23 files, 128/128 PASS |
| Chromium live audit plus Family-A | 2/2 PASS |
| Firefox boundary, live audit, and Family-A | 5/5 PASS |
| Score integration across three engines | 12/12 PASS |
| Complete Phase-9 refinement across three engines | 21/21 PASS, workers=1, retries=0 |
| Deterministic correction capture | 11/11 PASS |
| Strict focused OpenSpec validation | 1/1 valid; zero issues |
| Historical Task-34 seal | 11 payloads plus detached digest PASS |
| Prior refinement-candidate seal | 28 payloads plus detached digest PASS |

The first broad pre-correction rerun is not erased: it passed 12/21 and failed
9/21. Chromium and Firefox each reached the geometry under test and failed the
real Demo clearance. All seven WebKit cases instead hit bootstrap `hard-timeout`
before the geometry was exercised. After the geometric correction, one clean
serial invocation passed all 21/21 across Chromium, Firefox, and WebKit; the
separate three-engine score-integration suite also passed 12/12. Thus the
earlier WebKit result is recorded as a pre-geometry bootstrap outcome, not
misclassified as geometry and not used as a substitute for the clean final run.

## Integrity and remaining gate

`SHA256SUMS.txt` covers this README, `capture-manifest.json`,
`validation-results.json`, and all 11 PNGs. `SHA256SUMS.txt.sha256`
authenticates that 14-payload manifest. Verify both with:

```bash
sha256sum --check --strict SHA256SUMS.txt
sha256sum --check --strict SHA256SUMS.txt.sha256
```

External visual acceptance, physical-device review, real mailbox/provider
delivery, verified sender state, production Turnstile hostname/action, staging,
owner homologation, and production validation remain unproved. Review the 11
images in numerical order and either accept them explicitly or return concrete
refinement notes. Until then, OpenSpec 7.3 stays unchecked, Task 35 does not
start, and Gate 9/Phase 9 remain open.
