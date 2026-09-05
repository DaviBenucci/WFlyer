This checklist follows canonical specification §27 in exact Stage 0–18 order.
The governing authority is
`docs/canonical-v2/05-architecture/WFlyer_Post_Phase9_ASM_Motion_Canonical_Spec.md`;
its detailed decisions, acceptance contracts, and stop rules control over task
summaries. Each stage requires recorded verification before the next stage.

Stage 0 is planning only. No Stage-1 or successor runtime implementation is
authorized by this checklist. Stage 1 requires a subsequent explicit owner
authorization, and Stage 2 requires explicit Human Geometry Gate approval.
Stage 3 and later require completed geometry refreeze and applicable execution
authorization. An unchecked human approval task cannot be satisfied by an
automated PASS.

Only actually defined `MOT-DEC-*` clauses are normative; the documented
`MOT-DEC-010..024` numbering gap does not authorize invented decisions. Canonical
calibration/review values remain such and must not become invented fixed product
parameters or weakened acceptance thresholds.

## 1. Stage 0 — Successor Change Bootstrap

- [x] 1.1 Verify Phase 9 is CLOSED on 2026-09-04, Gate 9 is PASS, and Task 35 is COMPLETE; record source references and distinguish technical baseline `306ccb74da6c7bbf8f187e360c0776c571b5fc3d` from closure commit `a20d52ac9f214d385ea7c210b2ab45aa84095fc8`, with Git and canonical closure records as evidence.
- [x] 1.2 Inspect the worktree and reconcile live Composer, Projection, measurement, score-rendering, story-motion, and navigation owners; deliver the bounded owner/file inventory and record pre-existing modifications without staging or cleaning unrelated files.
- [x] 1.3 Complete the isolated proposal, design, and seven successor delta specifications, referencing the canonical decision families and exactly `ASM-LAYOUT-DELTA-001..005`; verify artifact coverage, predecessor compatibility, and absence of invented decisions in the Stage-0 review record.
- [x] 1.4 Complete the ordered Stage 0–18 task plan with verification, authorization boundaries, geometry approval/refreeze, and final homologation gates; verify Stage-1 scope contains only the five approved deltas and all Stage-1-and-later tasks remain unchecked.
- [x] 1.5 Reconcile current operational status and handoff surfaces to the actual successor planning state, and prepare a concrete bounded Stage-1 authorization package; verify the package lists allowed work, preserved contracts, tests, deterministic evidence, exact stop conditions, and no implied implementation approval.
- [x] 1.6 Run `openspec validate implement-scroll-driven-score-assembly-and-motion --strict` and inspect artifact status, the final documentation diff, and predecessor evidence seals; record Gate 0 only when all required planning artifacts exist, Phase-9 evidence remains byte-identical, and no runtime, test, script, or evidence-payload change has occurred.

**STOP after Stage 0. Present the completed planning artifacts and review result.
Do not start Stage 1 until the owner explicitly authorizes its bounded
implementation. This planning checklist is not that authorization.**

## 2. Stage 1 — Bounded Geometry Stabilization

- [ ] 2.1 Record the explicit bounded Stage-1 owner authorization and recheck the live file inventory, worktree, approved predecessor invariants, and five-delta scope; verify the implementation boundary excludes motion, Stage-3 metadata expansion, unrelated geometry, Composer changes, final assets, and public cutover.
- [ ] 2.2 Implement `ASM-LAYOUT-DELTA-001` so the Application terminal continues spatially along its branch without the unnecessary return/U-turn; verify a locally LTR `EVENT_SAFE_STRAIGHT` final shelf, conventional physical final barline, continuity, zero center/staff-line intersections, and protected-content clearance in supported modes.
- [ ] 2.3 Implement `ASM-LAYOUT-DELTA-002` whole-group `EVENT_SAFE_STRAIGHT` and `EVENT_FREE_CURVED` classification and placement; verify the complete attached event footprint with the canonical review margins satisfies LTR direction, tangent magnitude ≤18°, variation ≤6°, no reversal, and zero overlap with curved, connector, or Assembly regions.
- [ ] 2.4 Implement `ASM-LAYOUT-DELTA-003` as a broad predominantly direct event-free Benefits↔Demo corridor; verify no compressed folds, zero event overlap, Benefits/tablet clearance, safe event resumption, and preserved Demo↔Launch continuity and protected-content clearance.
- [ ] 2.5 Implement `ASM-LAYOUT-DELTA-004` by allocating existing semantic groups more effectively over long Professional safe shelves; verify unchanged event order, rhythm, motifs, stems, beams, tuplets, accidentals, ledger/key semantics, seed, and reference fingerprints against the baseline, and record optical review against long shelves ≥40 × staffSpace and typical group spacing ≈8–14 × staffSpace as review targets rather than rigid thresholds, without inventing or duplicating events.
- [ ] 2.6 Implement only the Stage-1 portion of `ASM-LAYOUT-DELTA-005`: minimal deterministic Home branch-entry geometry for future `CANONICAL_ENTRY_ANCHOR` handoff and event-free lead-in; verify both entry targets are reviewable with `APPLICATION ← HOME / ORIGIN → PROFESSIONAL` preserved and no Scenic motion or second final geometry source introduced.
- [ ] 2.7 Run focused projection, geometry, and renderer validation covering continuity/point gaps, tangent alignment/curvature, zero center and staff-line self-intersections, whole-footprint safe classification, zero forbidden-zone anchors, conventional final barlines, and `ASM-AC-022` protected-content classifications such as `CLEAR`, `TOO_CLOSE`, and `INTENDED_OCCLUDED`; record results with no accidental collision accepted and without disabling, loosening, or deleting failing coverage.
- [ ] 2.8 Run affected horizontal-enhanced, vertical-wide, vertical-compact, and static/reduced-safe regressions; verify unchanged Services/How content contracts, three distinct Projects visits, session composition, approved glyph bytes/calibration, Demo/Launch clearances, and all geometry outside the five deltas.
- [ ] 2.9 Produce deterministic successor-only geometry captures for Application terminal, Benefits↔Demo, Demo↔Launch, representative Professional long shelves, Home entry geometry, and representative responsive modes; record exact candidate revision/worktree provenance, viewport/engine inputs, capture inventory, and automated outcomes, using serial visual execution with `workers=1` and `retries=0` where applicable.
- [ ] 2.10 Present the five-delta geometry review package and exact modified-file list and record explicit owner approval covering the candidate evidence; verify the human decision is present before declaring the Human Geometry Gate approved or starting Stage 2.

**STOP at the Human Geometry Gate after automated validation and deterministic
evidence. Automated PASS does not authorize refreeze or motion. Also stop under
canonical §33 if scope, Composer semantics, tangent validity, sealed evidence,
security, or any required invariant cannot be preserved. In particular, if
Professional density requires new music, report the limitation and seek a
separate Composer-version decision without silently changing composition.**

## 3. Stage 2 — Geometry Refreeze

- [ ] 3.1 Verify the recorded human geometry approval identifies the same Stage-1 candidate and evidence now on disk; deliver the approval-to-candidate reconciliation and stop on any unapproved drift.
- [ ] 3.2 Seal the approved successor geometry evidence in its own directory with a payload manifest and recorded digest; verify every payload against the manifest and verify predecessor Phase-9 evidence remains byte-identical.
- [ ] 3.3 Record geometry as frozen, the exact successor checkpoint/evidence references, and the proven-defect correction procedure; verify handoff and change status agree that any later geometry correction needs a proven defect, focused fix, focused regression, and refreshed affected successor evidence without unrelated changes.

**Stage 3 and later remain blocked until all Stage-2 refreeze evidence is
complete. A bounded Stage-1 authorization does not silently expand to later
runtime stages.**

## 4. Stage 3 — Projection Metadata

- [ ] 4.1 Expose deterministic typed zone metadata for `EVENT_SAFE_STRAIGHT`, `EVENT_FREE_CURVED`, `TRUE_CONNECTOR`, and approved `ASSEMBLY_TRANSITION` intervals from refrozen Projection geometry; verify repeatable classification and stable semantic references in focused unit tests.
- [ ] 4.2 Expose each branch's `CANONICAL_ENTRY_ANCHOR`, exact entry geometry, and event-free lead-in references without a second geometry source; verify entry metadata matches the refrozen Stage-1 geometry and its approved lead-in calibration.
- [ ] 4.3 Expose precomputed Assembly intervals, unified staff draw metrics, and event/content reveal-anchor references required by downstream models; verify deterministic association with the existing semantic composition and zero anchors in forbidden event zones.
- [ ] 4.4 Run the metadata stage gate against approved geometry snapshots and ownership boundaries; verify no visual geometry change, no GSAP or navigation ownership in Projection, no Composer mutation, and no per-frame measurement requirement.

## 5. Stage 4 — Pure Assembly Model

- [ ] 5.1 Implement DOM-independent resolution of `CANONICAL → DISASSEMBLING → TRANSITION → REASSEMBLING → CANONICAL` from semantic progress, scene descriptor, Projection metadata, responsive mode, and reduced-motion policy; verify serializable deterministic outputs and boundary behavior with focused unit tests.
- [ ] 5.2 Model bounded Subtle, Structural, and Scenic classifications with events absent throughout Assembly intervals and canonical state restored afterward; verify only approved scenes qualify and Projects cannot enter Structural Assembly through default configuration.
- [ ] 5.3 Implement semantic responsive/reduced-state resolution without replay or recomposition; verify equivalent seed, composition, chapter, logical progress, and Assembly semantic state across supported modes.
- [ ] 5.4 Prove forward/reverse state equality and repeated evaluation at identical semantic progress with property tests, including interval boundaries and supported mode/policy combinations; record the deterministic tolerances used before passing this stage.

## 6. Stage 5 — Staff Draw Model

- [ ] 6.1 Implement a pure staff draw/erase resolver consuming precomputed draw metrics and one logical progress front for all five staff lines; verify coherent forward and reverse progression without DOM/path measurement or GSAP binding.
- [ ] 6.2 Resolve origin, branch boundaries, connectors, Assembly regions, and conventional terminals from the same logical staff front; verify boundary fixtures preserve continuity and final barline termination.
- [ ] 6.3 Verify horizontal-enhanced, vertical-wide, vertical-compact, and static/reduced-safe projection compatibility through deterministic model tests and same-progress reverse equality; record the staff-model gate before event reveal implementation.

## 7. Stage 6 — Event Reveal Model

- [ ] 7.1 Associate unchanged Composer event groups with precomputed whole-footprint `EVENT_SAFE_STRAIGHT` reveal anchors; verify deterministic ordering, complete group identity, and unchanged reference composition fingerprints.
- [ ] 7.2 Implement pure event eligibility from staff-front arrival, safe zone, canonical/Assembly state, and presentation policy; verify all events remain hidden in curved, connector, Assembly, and `FAST_TRAVERSAL` states.
- [ ] 7.3 Preserve atomic presentation of noteheads, stems, flags/beams, accidentals, ledger lines, and tuplets with their members; verify boundary/reverse tests never expose partial groups and settled restoration derives the correct eligible set directly.

## 8. Stage 7 — Scenic-to-Canonical Handoff Model

- [ ] 8.1 Model scenic convergence against the exact Projection-owned canonical branch-entry targets; verify geometry equality at ownership transfer, no second canonical geometry definition, and no positional jump or cusp in deterministic fixtures.
- [ ] 8.2 Resolve reversible progress-based ownership and controlled scenic/canonical overlap opacity; verify same-progress forward/reverse equality and absence of duplicate staff appearance without irreversible `onEnter` swapping.
- [ ] 8.3 Apply the approved event-free canonical lead-in before the first safe event anchor; verify Composer events cannot appear before that anchor and document calibration against human-approved geometry without inventing an `N × staffSpace` value.
- [ ] 8.4 Implement direct settled deep-link/history bypass and reduced-motion handoff, with mobile Home handing off only into Professional before the later separate Application branch; verify origin clef isolation, branch separation, no replay, and deterministic settled outcomes.

## 9. Stage 8 — GSAP Presentation Binding

- [ ] 9.1 Bind the verified pure models in a scoped story-root GSAP context using the existing native-scroll master timeline as temporal authority; verify no second animation system, parallel scroll state, global wheel/touch interception, or global kill-all cleanup.
- [ ] 9.2 Establish owned initialization/disposal for model bindings, timelines/triggers, listeners, observers, timers/RAF, and retained DOM references; verify unmount and repeated cleanup release only story-owned resources.
- [ ] 9.3 Add bounded development/test counters for Composer calls, Projection builds, layout measurements, React frame-clock activity, rebuilds, and resource owners; verify instrumentation operates outside the frame hot path and does not log form data or enable analytics.
- [ ] 9.4 Instrument ordinary native wheel, touch, keyboard, and scrollbar scrub; record zero per-frame Composer calls, Projection rebuilds, DOM measurements, React frame-clock writes, and telemetry before passing the GSAP-binding gate.

## 10. Stage 9 — Home Scenic Assembly

- [ ] 10.1 Implement Stage 9A scenic clef and warm atmosphere using the approved intact glyph and semantic Home content; verify `LATENT_ORIGIN` and `CLEF_ESTABLISHED` captures preserve origin position, no mirroring/arbitrary rotation, restrained glyph budget, warm dark atmosphere, and fail-open usability.
- [ ] 10.2 Implement Stage 9B desktop center-out semantic header reveal after clef establishment; verify Application reveals left, Professional right, W_Flyer remains stable, and keyboard/DOM order and real link semantics survive the midpoint and settled captures.
- [ ] 10.3 Implement Stage 9C latent branch scores emerging from the approved desktop edge depth zones; verify deterministic `SCORE_AWAKENING` captures, limited presentation-only scenic material, and no Composer mutation or premature canonical events.
- [ ] 10.4 Implement Stage 9D branch formation with independent one-shot `originRevealProgress` and reversible `signedBranchProgress`; verify neutral Home, negative Application activation, positive Professional activation, and geometry-matched convergence without replaying entry on back-scroll.
- [ ] 10.5 Implement Stage 9E by binding the verified scenic-to-canonical handoff model; verify forward/reverse seam captures, controlled overlap, event-free lead-in, deep-link settled bypass, and reduced/mobile semantic equivalence.
- [ ] 10.6 Implement Stage 9F branch emphasis and bounded visual docking on the master timeline; verify the main header remains structurally stable, the scenic clef remains at Home, and settled Home/branch activation captures preserve canonical orientation and focus behavior.
- [ ] 10.7 Review deterministic evidence after each materially distinct Home family and run the integrated Home gate; record captures for all canonical Home states, both branch activations, compact simplification, restoration, and return-to-Home without cinematic replay, including any owner feedback actually received.

## 11. Stage 10 — Structural Assembly

- [ ] 11.1 Integrate Professional Services through bounded scene configuration and the shared Assembly model; verify canonical, disassembling, transition, and reassembling snapshots with no events during Assembly and the canonical five-line score restored on exit.
- [ ] 11.2 Integrate Application How It Works using the same Assembly grammar and bounded configuration; verify its four state families preserve content order, card relationships, continuity, and safe event resumption.
- [ ] 11.3 Validate both scenes for zero center/staff intersections, explicit protected-content clearance/occlusion classification, deterministic reverse snapshots, and responsive/reduced-motion equivalence; record the Structural Assembly gate without introducing unapproved directional-transition Assembly.
- [ ] 11.4 Run Projects non-Assembly regression through all three real card visits and the Contact departure; verify three distinct safe event shelves, event-free valleys, unchanged visit logic, and preserved Composer semantics.

## 12. Stage 11 — Mobile Serpentine Motion

- [ ] 12.1 Bind draw/erase and authorized Assembly to the accepted vertical-wide and vertical-compact serpentine geometry; verify locally LTR event shelves, correct unmirrored glyph orientation, and zero Composer events on side-repositioning connectors.
- [ ] 12.2 Preserve Home → Professional score → Professional final barline → event-free transition → Application score → Application final barline → one global footer; verify full mobile traversal, semantic document order, separate terminals, and the later independent Application start.
- [ ] 12.3 Preserve semantic state during material horizontal/vertical mode changes while simplifying physical choreography as required; verify stable seed, composition, active chapter, logical progress, Assembly state, and no Home/chapter replay over repeated resize/orientation fixtures.
- [ ] 12.4 Capture representative mobile Home, branch shelves, both Structural scenes, terminals, Application start, and global footer; record the mobile integration gate with clearances, native touch scrolling, reverse equality, and supported-mode regressions passing.

## 13. Stage 12 — Compact Mobile Header

- [ ] 13.1 Replace the old multi-row vertical header presentation with one sticky row containing the real Home anchor, semantic chapter label, menu trigger, and theme control; verify targets ≥44 px, stable sticky reservation, one-row fit, and zero score/content collision in supported narrow modes.
- [ ] 13.2 Derive the empty Home label and actual active chapter labels from stable semantic ownership, including narrative Demo even without a sheet destination; verify no premature target label, threshold flicker, or raw pixel-driven label state during scrub/restoration.
- [ ] 13.3 Resolve `SETTLED`, `MENU_OPEN`, `NAVIGATING`, and `RESTORING` header presentation using the canonical story controller and stable destinations; verify semantic links, keyboard focus order, non-color-only active indication, and direct settled history/deep-link state.
- [ ] 13.4 Record compact-header Home and active-chapter captures and run keyboard/touch/accessibility checks across theme and responsive modes; verify usable labels, visible focus, and preserved composition/projection state before the sheet stage.

## 14. Stage 13 — Mobile Navigation Sheet

- [ ] 14.1 Implement a dedicated navigation sheet/drawer in canonical order: W_Flyer/Home; PROFISSIONAL — Sobre, Serviços, Processo, Projetos, Contato; APLICAÇÃO — Aplicação, Como funciona, Benefícios, Lançamento; verify the approved pt-BR destinations match §7.1, Demo remains a narrative label without an added destination, and active state uses `aria-current` where applicable plus an indicator beyond color.
- [ ] 14.2 Implement open/close, focus containment, Escape, background interaction suppression, and body scroll lock scoped only to the open sheet; verify keyboard and touch operation, deterministic trigger focus restoration on close without navigation, and idempotent release of every modal resource.
- [ ] 14.3 Route destination selection through the existing canonical navigation controller after closing the sheet; verify successful navigation uses canonical destination focus/history and actual semantic labels, with denied, invalid, and repeated actions handled without orphan locks or duplicate traversal ownership.
- [ ] 14.4 Isolate menu interactions and theme changes from story progress, chapter ownership, Composer output, and Projection; verify theme changes preserve the open sheet and produce no composition regeneration or color-only geometry rebuild.
- [ ] 14.5 Close and dispose the sheet before switching out of mobile-navigation mode; verify responsive teardown, unmount, failure recovery, no focus trap outside `MENU_OPEN`, and usable navigation after returning to mobile mode.

## 15. Stage 14 — Normal Scrub Choreography

- [ ] 15.1 Enable normal staff draw/erase followed by atomic event reveal from the verified precomputed anchors; verify native input remains `NORMAL_SCRUB`, all five lines share one logical front, and no forbidden-zone event appears in forward/reverse traversal.
- [ ] 15.2 Bind bounded score-driven content enhancement to existing semantic DOM content, including distinct Projects approaches and Services/How card presentation; verify content and controls remain available before readiness, without JavaScript, and after motion failure.
- [ ] 15.3 If content hysteresis is needed, implement documented deterministic bounded thresholds rather than adopting the canonical example as a fixed product value; verify threshold oscillation does not flicker or break the documented forward/reverse contract, or record why hysteresis is unnecessary.
- [ ] 15.4 Run normal-scrub integration snapshots at representative semantic progress and settled restoration points; verify safe events/content, consistent header ownership, no replay, and continued zero per-frame structural work.

## 16. Stage 15 — Fast Traversal

- [ ] 16.1 Implement pure `NORMAL_SCRUB`, `FAST_TRAVERSAL`, and `RESTORE_SETTLED_STATE` policy resolution and activate fast mode only from explicit programmatic navigation; verify rapid manual wheel/touch/keyboard/scrollbar input remains normal scrub and extreme traversal stays within the existing 3.0-second maximum.
- [ ] 16.2 Bind staff-only traversal with continuous staff/path and required Assembly geometry while suppressing every Composer-backed event group and simplifying intermediate content motion; verify deterministic mid-traversal captures show staff and zero notes/accidentals/beams/tuplets/ledger-event presentation.
- [ ] 16.3 Resolve actual destination ownership before returning to normal scrub and permitting events/content settlement; verify arrival captures, one successful explicit history entry, canonical focus, and no false active chapter before arrival.
- [ ] 16.4 Handle wheel, touch, navigation keys, Escape, and material responsive-change cancellation from actual current progress; verify the old target never completes, cancelled traversal creates no history entry, and normal events/content resolve at the actual position.
- [ ] 16.5 Replace an active destination deterministically from current real progress while keeping events hidden during replacement traversal; verify repeated/invalid target actions and competing completion callbacks cannot create duplicate owners, stale completion, or a note flash.
- [ ] 16.6 Preserve settled Home across Professional↔Application traversal and direct settled restoration for Back/Forward, refresh, and deep links; verify no entry replay, correct scroll/history/focus/chapter state, and staff-only mid-traversal plus allowed-events arrival evidence.

## 17. Stage 16 — Reduced Motion

- [ ] 17.1 Apply reduced-motion policy over the same semantic models with the canonical vertical static story and direct/minimal settlement; verify decorative staff writing, glyph movement, Assembly separation, docking, stagger, atmosphere, and intermediate traversal are removed or substantially reduced.
- [ ] 17.2 Preserve all content, branches, score semantics, final barlines, active chapter, forms, focus, navigation, history, deep links, and responsive continuity; verify keyboard/touch destination access and representative settled states without cinematic prerequisites.
- [ ] 17.3 Verify reduced-motion initialization and preference/responsive changes preserve actual semantic state without recomposition or Home/Assembly replay; record representative Home, Structural scenes, branch terminals, navigation, and footer captures with no functional loss.

## 18. Stage 17 — Lifecycle and Failure Hardening

- [ ] 18.1 Implement and verify owned runtime transitions from uninitialized through readiness/build/active/rebuild to disposal, with geometry-critical, enhancement, and non-blocking dependencies classified; test hard timeout/fallback, deep link before readiness, font timeout, asset timeout, and missing optional media without hiding content or blocking forms/navigation.
- [ ] 18.2 Harden material layout invalidation into one coalesced stable measurement, Projection rebuild, bounded motion rebind, and equivalent-state restoration; verify repeated resize/orientation, active chapter changes, and theme changes do not cause unnecessary rebuilds or recomposition.
- [ ] 18.3 Harden traversal and modal coordination across resize during traversal, drawer-open responsive change, theme change, input interruption, and unmount during traversal; verify actual-progress recovery, no old-target completion, no replay, and complete focus/scroll-lock release.
- [ ] 18.4 Verify mount/unmount/remount, repeated and partial cleanup, GSAP initialization failure, rebuild failure, and hidden-tab/resume behavior; record fail-open semantic content, safe score, native scroll, usable forms/navigation, and zero orphan timeline/trigger/observer/listener/timer/RAF/focus owners.
- [ ] 18.5 Exercise long repeated navigation/resize/mount cycles with bounded lifecycle/traversal/rebuild diagnostics; verify stable resource/visual-owner counts and memory behavior, zero ordinary-scrub structural work, no frame telemetry, and no sensitive form data in diagnostics.
- [ ] 18.6 Run affected Contact and launch-interest security regressions across normal, reduced, timeout, failure, and modal states; verify validation, origin/content-type/payload controls, Turnstile, rate limits, idempotency, generic failures, and provider-secret boundaries remain intact without claiming unobserved provider delivery.

## 19. Stage 18 — Final Regression and Human Homologation

- [ ] 19.1 Run required lint, strict type checking, unit/property, Storybook, production standalone-build/isolation, and focused-to-full affected regression gates; record exact commands, results, failures/corrections, and `ASM-AC-001..025` coverage without suppressing failures or claiming unrun checks.
- [ ] 19.2 Run deterministic Chromium, Firefox, and WebKit geometry/motion/navigation/lifecycle regression, using `workers=1` and `retries=0` for applicable visual geometry suites; verify continuity, clearances, event zoning, both terminals, actual-progress cancellation/replacement, restoration, and same-progress reverse snapshots.
- [ ] 19.3 Complete keyboard, touch-target, focus-order/containment/restoration, active-location, reduced-motion, forced-colors where applicable, no-JS, and Professional-first reading-order checks with axe and appropriate browser/manual evidence; record any physical-device or assistive-technology review only when actually performed.
- [ ] 19.4 Run the performance gate using existing project targets and Lighthouse CI where applicable; record lab versus field evidence honestly, including long tasks, CLS, frame behavior, zero per-frame structural work, resource-owner counts, and repeated-navigation/resize memory stability.
- [ ] 19.5 Produce and inspect the complete deterministic visual evidence matrix from canonical §29, covering every Home state, Application and Professional scenes/Assembly states, three Projects visits, mobile header/sheet/serpentines/terminals/footer, staff-only Fast Traversal and arrival, and reduced-motion settled states; verify capture inventory and exact candidate provenance.
- [ ] 19.6 Seal final successor-only evidence with a verified payload manifest and recorded digest, reconcile the exact modified-file list and all stage gates, and rerun strict OpenSpec validation; verify Phase-9 seals remain byte-identical and distinguish final automated PASS from pending human homologation.
- [ ] 19.7 Present the final candidate against canonical §30 geometry, musical readability, Home, Assembly, navigation, responsive, and reduced-motion criteria; record explicit human homologation of the evidenced candidate before declaring this successor complete.
- [ ] 19.8 After actual human homologation, update canonical operational handoff and successor completion state with exact implementation/evidence/approval references; verify every completion criterion in §31 is supported and no commit, push, archive, deployment, public cutover, or production approval is implied by completion.

**STOP for explicit final human homologation. Automated PASS alone is
insufficient. Commit, push, archive, deployment, public cutover, production, and
DNS changes remain subject to their separate workflow/owner authorization.**
