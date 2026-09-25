# HGA-001C — desktop presentation on the Stage-1 Motion Lab

**Later owner-device verification:** the 1366×611 Firefox and 1366×639
Chromium profiles [failed the short-height focus/composition review](stage-1-hga-001c-owner-profile-verification.md).
The machine-readable result below is the earlier, still-valid 1366×768
viewport checkpoint, not the current owner-device disposition. HGA-001C is
currently blocked for owner-device review; Human Geometry Approval is pending.

```text
HGA_001C_IMPLEMENTATION=PASS
HGA_001C_VALIDATION_SURFACE=MOTION_LAB
1366_ENVIRONMENT_CLASS=desktop
1366_STORY_MODE=vertical-wide
1366_PRESENTATION_CLASS=desktop
VERTICAL_WIDE_DESKTOP_PRESENTATION=true
VERTICAL_COMPACT_MOBILE_PRESENTATION=true
PROJECTS_CAPACITY_POLICY_CHANGED=false
PROJECTS_CLEARANCE_CONTRACTS=PRESERVED; 1366 horizontal candidate correctly rejected
HGA_001A_REGRESSION=PASS
HORIZONTAL_ENHANCED_REGRESSION=PASS
TABLET_REGRESSION=PASS
MOBILE_REGRESSION=PASS
CHROMIUM=PASS
FIREFOX=PASS
WEBKIT=PASS
PUBLIC_IMMERSIVE_INTEGRATION=NOT_STARTED_OUT_OF_STAGE1_SCOPE
HUMAN_EVIDENCE_PATH=openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-hga-001c-evidence/manifest.json
HGA_001C_STATUS=READY_FOR_HUMAN_REVIEW
HGA_002_STATUS=PENDING
HUMAN_GEOMETRY_APPROVAL=PENDING
COMMIT_CREATED=false
```

The owner-corrected acceptance surface is the development
`/__visual-lab/story/motion`, not the current public route architecture. At
1366×768 and 100% browser scale, fine-pointer/hover desktop input selects the
unchanged capacity-gated `vertical-wide` story and now has a distinct desktop
presentation. The horizontal candidate remains `INSUFFICIENT_CAPACITY` solely
because of `projects-protected-clearance-or-clip`; fallback is independent of
candidate PASS. Public Home remains BrandIntroController and the Professional
routes remain independent. Public immersive integration was not validated.

The presentation class is derived from the existing compact width and input
signals, independently of story orientation. On desktop `vertical-wide`, the
existing About, Process and Contact scene grids reserve the left score lane so
their primary reading areas no longer cross visible staff segments or event
ink. Home, Services, Projects, chapter heights, fan interaction, capacity
predicate, 12px clearance and Composer/Projection geometry were not changed.
There is no 1366-specific branch, forced horizontal mode or HGA-002 spacing
compression. The 1536×900 control remains `horizontal-enhanced`/desktop; the
900×1024 touch control remains `vertical-wide`/wide-touch; the 390×844 touch
control remains `vertical-compact`/mobile.

At 1366px the affected scene left edge moved from approximately 68.3px to
260.3px while its desktop columns remained intact. The reserve applies at the
scene's existing 75rem grid breakpoint, and the focused test checks all
rendered staff and event primitives against the protected reading areas.

Focused validation passed: 36 geometry/unit/component tests across five files,
including HGA-001A and Projects capacity; four browser assertions passed in
Chromium, Firefox and WebKit (two redundant cross-engine control cases were
skipped); the registered 1100×640 Projects fallback browser test passed. The
1366 browser assertions verify full visible staff-segment and event-ink bounds
against 12px-inflated About, Process and Contact reading areas, no horizontal
overflow, 100% visual scale, unforced mode and the exact Projects rejection.
Typecheck, focused lint, active-change and workspace OpenSpec strict validation
(17/17), and scoped diff hygiene passed. The unrelated pre-existing whitespace
finding in `.env.example` was excluded from the scoped diff check. The code
graph was updated after product edits.

The [manifest](stage-1-hga-001c-evidence/manifest.json) contains per-capture
browser/version, exact viewport, route/chapter, selected mode, presentation,
capacity result, safe-fallback flag, motion preference, source test, readiness,
scale, overflow and screenshot SHA-256. All 11 captures use the Playwright
managed browser engines and a stable post-readiness Motion Lab state. WebKit's
first screenshot immediately after programmatic positioning showed pending
compositor paint despite stable DOM geometry; a focused repeat after paint
settled produced the linked complete image. This was a capture-timing issue;
the WebKit geometry assertion passed unchanged.

| Evidence | Browser | Viewport | Chapter | Selected presentation | Review purpose |
| --- | --- | ---: | --- | --- | --- |
| [01](stage-1-hga-001c-evidence/screenshots/hga001c-01-chromium-home-1366x768.png) | Chromium | 1366×768 | Home | `vertical-wide` / desktop | Single origin and desktop header |
| [02](stage-1-hga-001c-evidence/screenshots/hga001c-02-chromium-professional-about-1366x768.png) | Chromium | 1366×768 | About | `vertical-wide` / desktop | Reading lane and two-column content |
| [03](stage-1-hga-001c-evidence/screenshots/hga001c-03-chromium-professional-services-1366x768.png) | Chromium | 1366×768 | Services | `vertical-wide` / desktop | Desktop modules unchanged |
| [04](stage-1-hga-001c-evidence/screenshots/hga001c-04-chromium-professional-process-1366x768.png) | Chromium | 1366×768 | Process | `vertical-wide` / desktop | Reading lane and process layout |
| [05](stage-1-hga-001c-evidence/screenshots/hga001c-05-chromium-professional-projects-1366x768.png) | Chromium | 1366×768 | Projects | `vertical-wide` / desktop | Fallback chapter entry; prior fan/focus evidence remains valid |
| [06](stage-1-hga-001c-evidence/screenshots/hga001c-06-chromium-professional-contact-1366x768.png) | Chromium | 1366×768 | Contact | `vertical-wide` / desktop | Terminal reading/form lanes |
| [07](stage-1-hga-001c-evidence/screenshots/hga001c-07-chromium-professional-about-1536x900.png) | Chromium | 1536×900 | About | `horizontal-enhanced` / desktop | Passing horizontal control |
| [08](stage-1-hga-001c-evidence/screenshots/hga001c-08-chromium-professional-about-900x1024.png) | Chromium | 900×1024 | About | `vertical-wide` / wide-touch | Tablet control |
| [09](stage-1-hga-001c-evidence/screenshots/hga001c-09-chromium-professional-about-390x844.png) | Chromium | 390×844 | About | `vertical-compact` / mobile | Mobile control |
| [10](stage-1-hga-001c-evidence/screenshots/hga001c-10-firefox-professional-about-1366x768.png) | Firefox | 1366×768 | About | `vertical-wide` / desktop | Firefox rendering |
| [11](stage-1-hga-001c-evidence/screenshots/hga001c-11-webkit-professional-about-1366x768.png) | WebKit | 1366×768 | About | `vertical-wide` / desktop | WebKit rendering |

An exploratory 1199px desktop-input spot check, outside the owner's exact
1366×768 HGA-001C acceptance viewport, still found staff crossing the About
reading area below the existing 75rem scene breakpoint. Source inspection
shows the new reservation does not apply there, so this behavior was not
introduced by the HGA-001C CSS rule. It was not repaired or folded into
HGA-002 here. The owner should classify any broader desktop-width presentation
requirement separately; this exact-viewport result does not claim full
continuous-width approval.

The owner must assess visual quality and any later width-scope decision. Task
5.6 remains unchecked at 30/51; HGA-002 density is pending. No Geometry
Refreeze, public cutover, Assembly, Motion integration, Stage 2+, commit, push
or deploy occurred.

Final Git inspection found 1,056 dirty paths and zero staged paths. The
HGA-001C runtime and eligibility edits share tracked files with earlier
uncommitted successor-capacity work; the worktree also contains extensive
untracked successor evidence and unrelated `.env.example` whitespace. A
coherent isolated checkpoint commit boundary is not evident, so nothing was
staged or committed. The worktree was preserved.
