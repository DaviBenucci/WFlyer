# Task 5.8 — Continuous Spatial Story projection

Status: **PASS**. Human Geometry Approval remains **PENDING**. This is the Stage-1 Motion Lab candidate only.

The existing professional score projection now owns one spatial timeline for all presentation classes. Its measured chapter frames and content rectangles determine each landmark's structural start, semantic entry, content span, interaction span, stations and exit transition. Physical lengths vary with the projection; chapter identity and order do not. The track has one continuous visual field, with the score as its visible spine. Vertical chapters may grow with content, and portrait uses native vertical scroll with local reflow and projected local holds. The expanded horizontal composition retains the capacity-gated Projects fan. No final navigation, Contact hold runtime, Assembly choreography or public integration was added.

Projects disposition: **TEASER** in constrained presentations. One existing canonical teaser remains readable and reachable across its span; the three-card fan remains restricted to the existing capacity PASS path. The same project data source is used. No portfolio route or new copy was added.

Contact has a projected interaction region and camera hold for the later runtime binding. The form and controls are reachable and readable on the tested profiles. Stable hold behavior and header entry navigation belong to task 5.9.

## Human review evidence

The [manifest](task-5-8-evidence/manifest.json) records the route, viewport, mode, presentation, score intersection counts and all 21 captures. Representative views:

| Presentation | Evidence |
| --- | --- |
| Expanded 1536×900 | [Projects fan](task-5-8-evidence/screenshots/expanded-1536x900-professional-projects.png), [Contact form](task-5-8-evidence/screenshots/expanded-1536x900-contact-form.png) |
| Compact Firefox 1366×611 | [Continuous overview](task-5-8-evidence/screenshots/owner-firefox-1366x611-overview.png), [Projects teaser](task-5-8-evidence/screenshots/owner-firefox-1366x611-professional-projects.png) |
| Compact Chromium 1366×639 | [Continuous overview](task-5-8-evidence/screenshots/owner-chromium-1366x639-overview.png), [Projects teaser](task-5-8-evidence/screenshots/owner-chromium-1366x639-professional-projects.png) |
| Tablet portrait 820×1180 | [Continuous overview](task-5-8-evidence/screenshots/tablet-portrait-820x1180-overview.png), [About local reflow](task-5-8-evidence/screenshots/tablet-portrait-820x1180-about-local-reflow.png) |
| Mobile portrait 390×844 | [Continuous overview](task-5-8-evidence/screenshots/mobile-portrait-390x844-overview.png), [About local reflow](task-5-8-evidence/screenshots/mobile-portrait-390x844-about-local-reflow.png), [Projects teaser](task-5-8-evidence/screenshots/mobile-portrait-390x844-professional-projects.png), [Contact form](task-5-8-evidence/screenshots/mobile-portrait-390x844-contact-form.png) |

## Validation

- 24/24 Stage-1 Motion Lab cases passed: eight profiles each in Chromium, Firefox and WebKit. Checks cover projected identity/order/continuity, zero score intersections, no page overflow, chapter and content reachability, Contact controls and focus visibility, Projects disposition and portrait reflow.
- 20/20 affected unit and geometry/projection tests passed. The expanded horizontal controls were additionally checked in all three engines after the matrix.
- Typecheck, focused ESLint, OpenSpec strict validation, AI routing validation, Graphify update and scoped diff check passed.

OpenSpec: **26/55 → 27/55**. Task 5.9 is the next bounded implementation task. ADR-058 disputed historical evidence was left untouched. No commit, push or deployment.
