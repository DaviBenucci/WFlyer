# Portfolio-only institutional branch inventory

Authority: ADR-053 / ASM-IMP-DEC-017. This is the bounded semantic inventory
before removal, based on the live dirty worktree at
`40e6ae1a8996c53ed2ec372c47f16bc073d6cee9`. A match on the generic word
`application` alone is not evidence of an institutional branch dependency.

| Class | Current owners and treatment |
| --- | --- |
| APPLICATION_ONLY | Institutional `/aplicacao-wflyer` pages, Application scene and demo components, PRELAUNCH interest form/API/email/guard, app-only visual-lab route and fixtures, their CSS and tests: remove when no independent product caller remains. The site routes use existing Not Found behavior. |
| SHARED | `src/lib/story/manifest.ts`, types, motion runtime/positioning/traversal, `src/lib/story/score/{composition,projection,organic-flowing}.ts`, `MotionStoryLab`, `StoryScoreLayer`, Home, header/footer, public content, SEO/navigation and mixed tests: retain Professional behavior and remove only the Application-specific case/branch. Preserve Projects and its capacity validator. |
| PROFESSIONAL_ONLY | Professional scene, Projects cards/fan, contact, surviving service and portfolio routes, Professional score geometry and related fixtures: retain. |
| UNRELATED | `app.wflyer.com.br` (separate product), generic references to software applications in service copy/code, approved music glyph and generic renderer, frozen Phase-9 evidence, old audit raw files: do not delete merely because of a name match. |

The bounded removal is complete in the working tree: Home presents one portfolio
path; the public route, footer, header, deep-link, manifest, responsive,
composition, Projection, and test owners no longer construct the removed
branch. Negative 404 assertions remain intentionally. The independent
application product remains outside this site repository boundary.

The obsolete mixed `phase09-score-refinement.spec.ts` predecessor suite was
removed after its surviving Professional contracts were covered by the
portfolio-only score-path review and Stage-1 geometry/hydration/capacity suites.
This does not alter its frozen Phase-9 captures or audit source pins.

Audit provenance: `stage-1-inherited-audit-supersession.json` records 3,192 of
3,692 old-manifest slots terminal and 500 pending. Application-only results are
outside current acceptance; shared/Professional observations remain supporting
history and cannot qualify the new topology.

## Closure verification — 2026-09-23

`PORTFOLIO-OOS-001` records pre-existing release-toolchain assertion drift.
`package.json` is the live pin authority: `packageManager` selects pnpm 11.26.0,
and the two Playwright development dependencies select 1.63.0. The lockfile and
both release workflows agree with those values. Three assertions in
`tests/unit/release-workflows.test.ts` still expect pnpm 11.24.0 and Playwright
1.62.1.

The 2026-09-13 Stage-1 start-state snapshot records all six files with the same
SHA-256 values they have now and already lists the five pin-owner/consumer files
as dirty. ADR-053 and ASM-IMP-DEC-017 were normalized on 2026-09-22. The
portfolio rebaseline therefore changed neither a pin authority nor the stale
test. This finding is `PREEXISTING_UNRELATED`, is outside this rebaseline, and
does not block the remaining Stage-1 geometry gate.

The final semantic search counts unique text locations (`file:line`) and assigns
each location to one retained class: 502 frozen/historical, 13 negative-test,
5,778 superseded-audit, 20 independent musical-product, and 198 generic
non-branch locations. Two live Stage-1 browser-test expectations and six active
contract documents found during closure were corrected to the one-branch
portfolio contract; three predecessor ADR files received explicit supersession
status. No current route, runtime owner, configuration, geometry/navigation
contract, or positive test retains the former topology.
