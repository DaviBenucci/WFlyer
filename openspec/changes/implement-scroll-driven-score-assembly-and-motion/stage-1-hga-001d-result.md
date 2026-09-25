# HGA-001D — Projects progressive disclosure on the Stage-1 Motion Lab

ADR-056 / `ASM-IMP-DEC-019` supersedes the former vertical fan contract. The
horizontal-enhanced story keeps the full three-card fan and its three
NON-ASSEMBLY visits. `vertical-wide` and `vertical-compact` mount one static
teaser, chosen from the existing canonical featured-public project order. The
same `PUBLIC_PROJECTS` authority feeds the teaser, active horizontal fan and
inert measurement-only horizontal candidate. The `featured` field and selector
predate this package at preserved HEAD
`40e6ae1a8996c53ed2ec372c47f16bc073d6cee9`.

The owner withdrew the old Projects listing/detail pages from active public
scope. The old route decisions and frozen evidence remain historical; no
replacement project URL or navigation affordance was introduced. Public
immersive-story integration is still out of Stage 1.

## Bounded human evidence

All captures are stable after story-bootstrap readiness and font loading.
They use deterministic layout viewports, not physical-device screenshots. See
the [structured manifest](stage-1-hga-001d-evidence/manifest.json) for mode,
presentation, capacity, fallback reason, dimensions, interaction counts and
SHA-256 hashes.

| Evidence | Browser / viewport | Active presentation | Screenshot |
| --- | --- | --- | --- |
| HGA001D-01 | Firefox 1366×611 | desktop / vertical-wide / one teaser | [view](stage-1-hga-001d-evidence/screenshots/hga001d-01-firefox-1366x611.png) |
| HGA001D-02 | Chromium 1366×639 | desktop / vertical-wide / one teaser | [view](stage-1-hga-001d-evidence/screenshots/hga001d-02-chromium-1366x639.png) |
| HGA001D-03 | Chromium 390×844 | mobile / vertical-compact / one teaser | [view](stage-1-hga-001d-evidence/screenshots/hga001d-03-chromium-390x844.png) |
| HGA001D-04 | Chromium 1536×900 | desktop / horizontal-enhanced / three-card fan | [view](stage-1-hga-001d-evidence/screenshots/hga001d-04-chromium-1536x900.png) |

The owner-profile teaser heights are 259.78px in Firefox and 259.67px in
Chromium. The previously recorded focused fan cards were 642.15px and
642.02px respectively. Thus the former oversized focusable element is absent
from vertical modes, rather than resized or geometrically repaired. The
Projects scene itself still measures about 1577.8px at both owner viewports;
its fixed story composition/score spacing has not been compressed. The mobile
teaser measures 275.13px. At 1536×900, the qualified Chromium horizontal fan
measures 689.52px and keeps its full visit state. HGA-002 macro-density work
remains separate and untouched.

The vertical teaser has no links, buttons or tab stops; no fan cards or
fan-only interaction/focus geometry exist in the selected vertical DOM. The
teaser can be scrolled completely below the sticky header within each reviewed
viewport. The screenshots deliberately frame the teaser; preceding chapter
heading lines remain reachable by native scroll. No global horizontal
overflow was measured. The low-height focused-card clipping recorded before
ADR-056 is obsolete for vertical modes; its horizontal focus contract remains
binding. Firefox at 1536×900 continues to select its previously documented
capacity fallback rather than being forced horizontal.

## Validation and remaining gate

```text
PROJECTS_PROGRESSIVE_DISCLOSURE=PASS
CANONICAL_DECISION=ADR-056 / ASM-IMP-DEC-019
HORIZONTAL_ENHANCED_PROJECTS=FULL_FAN
VERTICAL_WIDE_PROJECTS=SINGLE_TEASER
VERTICAL_COMPACT_PROJECTS=SINGLE_TEASER
FEATURED_PROJECT_SELECTION_RULE=first featured publicly eligible record in canonical order; otherwise first publicly eligible record
PROJECTS_INDEX_ROUTE=NOT_DEFINED_OUT_OF_SCOPE
PROJECTS_DETAIL_ARCHITECTURE=NOT_DEFINED_OUT_OF_SCOPE
SINGLE_PROJECT_DATA_AUTHORITY=true
HGA_001D_STATUS=READY_FOR_HUMAN_REVIEW
FIREFOX_OWNER_PROFILE=PASS
CHROMIUM_OWNER_PROFILE=PASS
MOBILE=PASS
HORIZONTAL_ENHANCED=PASS_WHEN_CAPACITY_PASSES
VERTICAL_FAN_RUNTIME_PRESENT=false
FOCUS_CLIPPING=PASS
CONTENT_CLIPPING=PASS_FOR_REVIEWED_TEASER_STATES
CHROMIUM=PASS
FIREFOX=PASS
WEBKIT=PASS
HUMAN_EVIDENCE_PATH=openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-hga-001d-evidence/manifest.json
HGA_002_STATUS=PENDING
HUMAN_GEOMETRY_APPROVAL=PENDING
REMOVED_PORTFOLIO_ROUTES=PASS
ACTIVE_PORTFOLIO_ROUTE_REFERENCES_REMAINING=0
HISTORICAL_PORTFOLIO_ROUTE_REFERENCES_PRESERVED=223
FEATURED_MECHANISM_PREEXISTING=true
HORIZONTAL_CANDIDATE_FAN_IS_MEASUREMENT_ONLY=true
```

Validation: focused Projects/content/manifest/motion and geometry Vitest
suites passed (128 + 10 + 42 tests in separate focused runs); the new
Projects E2E passed 12/12 across Chromium, Firefox and WebKit, including
visible teaser bounds below the sticky header. Focused professional-scene and
Phase-9 preview E2E passed after reconciling obsolete vertical fan assertions;
24/24 ScorePath preview tests passed. Typecheck, focused ESLint, production
build, four-file structured YAML parsing, active-change and workspace OpenSpec
strict validation (17/17), Graphify update, and scoped `git diff --check`
passed. The production app-path and pages manifests contain zero former
Projects browsing routes. The standalone smoke passed 13 current public
routes, four development-route 404 checks and 21 static assets. Current route
E2E also verifies removed browsing pages return non-indexable 404 responses
and are absent from the sitemap.

The semantic search counted 223 surviving literal former-route references in
historical/predecessor artifacts and explicit supersession notices, plus 11
references in negative tests. No active route/page, navigation link, route
manifest, sitemap/SEO destination or positive runtime test retains the old
browsing behavior. The predecessor ADR-034 text remains intact and is marked
superseded by ADR-056. Historical Phase-3/4 capture recipes remain labeled as
historical and were not rerun.

One broad E2E run also exposed an unrelated, preexisting legal-date mismatch:
the privacy-page test expects 2026-07-31 while the public content already had
2026-08-31 at preserved HEAD. This package did not change that authority or
alter the test. A concurrent-load rerun of an existing bootstrap lifecycle
test briefly degraded on hard timeout; the same focused test passed in
isolation without assertion changes. Neither finding is a Projects regression.

Human Geometry Approval remains pending; this artifact is evidence for owner
review, not an approval or Geometry Refreeze. No HGA-002 pass, public
immersive-story integration, Assembly, GSAP integration, Stage 2+, commit,
push or deploy occurred.
