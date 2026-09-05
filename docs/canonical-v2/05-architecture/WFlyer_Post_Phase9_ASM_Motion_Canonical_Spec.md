# W_Flyer — Post-Phase-9 Assembly, Motion, Score Refinement, and Mobile Navigation Specification

**Document ID:** `WF-ASM-MOTION-CANONICAL-001`  
**Status:** Canonical technical authority — Phase 9 closed; successor Stage 0 complete; Stage-1 authorization pending

**Normative language:** English  
**Project:** W_Flyer institutional immersive story  
**Successor OpenSpec change:** `implement-scroll-driven-score-assembly-and-motion`  
**Purpose:** Provide a complete implementation contract for the successor Assembly/Motion phase so that the executor can implement without inventing essential behavior.

---

# 1. Executive Decision

The post-Phase-9 successor change SHALL implement the final Assembly/Motion experience over the accepted Phase-9 technical baseline.

The successor change is explicitly allowed to perform a **bounded set of visual geometry refinements** before motion integration because the Phase-9 human review identified technical geometry that is valid but not yet visually final.

The successor change SHALL proceed in this order:

1. successor geometry-delta intake;
2. bounded geometry stabilization;
3. human geometry review;
4. geometry refreeze;
5. projection metadata;
6. pure motion models;
7. GSAP presentation binding;
8. Home Scenic Assembly;
9. Structural Assembly;
10. responsive/mobile integration;
11. compact mobile header;
12. mobile navigation sheet;
13. normal score draw/event/content choreography;
14. staff-only Fast Traversal;
15. reduced-motion adaptation;
16. lifecycle/cleanup/observability/performance hardening;
17. deterministic cross-browser evidence;
18. final human homologation.

No scroll-driven Assembly, final score draw, musical-event reveal, or content choreography SHALL be implemented over geometry that is still subject to the registered successor layout deltas.

---

# 2. Preconditions and Phase-9 Handoff

## 2.1 Mandatory entry gate

The successor OpenSpec MUST NOT begin implementation until Phase 9 is formally closed.

Before opening the successor change, the executor SHALL confirm:

```text
PHASE_9_CLOSED = true
TASK_35_COMPLETE = true
GATE_9_PASS = true
PHASE_9_FINAL_GIT_SHA = 306ccb74da6c7bbf8f187e360c0776c571b5fc3d
PHASE_9_FINAL_HANDOFF_UPDATED = true
```

The executor SHALL record the exact frozen Phase-9 baseline SHA in the new OpenSpec.

## 2.2 Known corrective evidence

Current known corrective Phase-9 evidence:

```text
docs/canonical-v2/06-migration/evidence/phase-9/
task-34-refinement-firefox-correction-2026-09-04/
```

Current known corrective digest:

```text
807a15b57e1a5bbc88011d546e69d4a4b281c552344876cddfc3a17042392923
```

Historical Task-34 evidence SHALL remain immutable.

## 2.3 Meaning of Phase-9 acceptance

Phase 9 is accepted as the **technical baseline**, not as the final visual composition.

The following refinements are intentionally transferred to the successor OpenSpec:

- `ASM-LAYOUT-DELTA-001` — Application terminal spatial continuation.
- `ASM-LAYOUT-DELTA-002` — Composer-backed events only on visually straight event-safe shelves.
- `ASM-LAYOUT-DELTA-003` — Benefits ↔ Demo direct/broad transition corridor.
- `ASM-LAYOUT-DELTA-004` — improved event utilization on long Professional straight shelves using the existing semantic composition first.
- `ASM-LAYOUT-DELTA-005` — replacement of the structural Home placeholder with the approved final Home Scenic Assembly.

These deltas SHALL NOT be interpreted as permission to reopen Phase-9 geometry broadly.

---

# 3. Scope

## 3.1 In scope

The successor change SHALL cover:

- bounded score geometry refinements listed in Section 8;
- score-zone metadata;
- `EVENT_SAFE_STRAIGHT`;
- `EVENT_FREE_CURVED`;
- Scenic / Structural / Subtle Assembly;
- Home final scenic composition;
- scenic-to-canonical handoff;
- reversible score draw and erase;
- Composer-backed event reveal;
- score-driven content reveal;
- explicit staff-only Fast Traversal;
- desktop branch activation choreography;
- responsive/mobile serpentine score presentation;
- compact mobile header;
- mobile navigation sheet;
- reduced-motion behavior;
- deep-link settled states;
- responsive state preservation;
- lifecycle and cleanup;
- diagnostics and performance instrumentation;
- deterministic visual evidence;
- final human homologation.

## 3.2 Out of scope unless separately approved

The successor change SHALL NOT:

- redesign Composer semantics merely to visually fill empty space;
- silently regenerate Music System fingerprints;
- rewrite historical Task-34 evidence;
- replace approved glyph masters;
- create vertical musical notation on mobile;
- introduce Anime.js;
- introduce scroll-jacking;
- use React state as a per-frame story clock;
- place events in connectors, turns, or Assembly regions;
- weaken Contact or Launch-interest security contracts;
- introduce invented public claims, metrics, testimonials, or portfolio results;
- deploy without explicit authorization.

---

# 4. Normative Vocabulary

The terms **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, and **MAY** are normative.

Project-specific terms:

- **Composer** — semantic musical composition owner.
- **Projection** — physical score geometry owner.
- **Motion Model** — deterministic semantic-progress-to-presentation-state owner.
- **GSAP Presentation** — interpolation/presentation owner.
- **NOTATION_SAFE** — geometric region where notation is physically valid.
- **EVENT_SAFE_STRAIGHT** — stricter subset of NOTATION_SAFE where events may actually be shown.
- **EVENT_FREE_CURVED** — region too curved/turning for event placement.
- **TRUE_CONNECTOR** — event-free staff relocation between shelves/scenes.
- **ASSEMBLY_TRANSITION** — deliberate event-free staff transformation.
- **SCENIC** — presentation-only musical material, not Composer semantics.
- **CANONICAL** — Composer-backed score presentation.
- **Settled state** — deterministic state corresponding directly to a resolved semantic story position, without requiring previous animation playback.

---

# 5. Canonical Architecture

## 5.1 Ownership hierarchy

```text
Composer
  decides WHAT musical semantics exist
        ↓
Projection
  decides WHERE geometry and event-safe regions exist
        ↓
Motion Model
  decides WHEN precomputed material is presented
        ↓
GSAP
  decides HOW the presentation interpolates
        ↓
StoryScoreLayer / UI
  renders and orchestrates the bounded owners
```

## 5.2 Existing conceptual owners

```text
src/lib/story/score/composition.ts
  → semantic musical composition

src/lib/story/score/projection.ts
  → physical score geometry + geometry metadata

src/lib/story/score/measurement.ts
  → bounded layout/content measurement

src/components/story-score/StoryScoreLayer.tsx
  → runtime/render orchestration
```

Exact paths SHALL be reconciled against the live repository before edits.

## 5.3 Candidate new owners

Recommended responsibilities:

```text
src/lib/story/motion/
├── motion-model.ts
├── reveal-anchors.ts
├── assembly-model.ts
├── traversal-presentation.ts
├── responsive-motion-state.ts
└── diagnostics.ts
```

Possible navigation owners:

```text
src/components/story-navigation/
├── MobileStoryHeader.tsx
├── MobileNavigationSheet.tsx
└── ...
```

Names are not normative; responsibility boundaries are.

## 5.4 Architectural prohibition

`projection.ts` SHALL NOT become a combined geometry + motion + navigation engine.

Prohibited shape:

```text
projection.ts
├── DOM measurement
├── score geometry
├── GSAP timeline creation
├── active header state
├── drawer state
├── traversal policy
└── per-frame reveal calculations
```

Projection MAY expose metadata required by motion. It SHALL NOT own GSAP timelines or navigation state.

---

# 6. Approved Assembly Decisions — `ASM-DEC-*`

## ASM-DEC-001 — GSAP Only

GSAP SHALL be the single animation library for this story experience. Anime.js SHALL NOT be introduced.

## ASM-DEC-002 — Intermediate Assembly Scope

Assembly SHALL be meaningful but restrained. The experience SHALL NOT continuously disassemble/reassemble the score for decoration.

## ASM-DEC-003 — Home Origin Visual Hierarchy

Home SHALL be organized around:

- the principal scenic treble clef;
- W_Flyer identity;
- the two branch origins.

## ASM-DEC-004 — Home Edge Depth Zones

Approximately 20–25% of each desktop side MAY act as atmospheric edge depth.

```text
APPLICATION depth  ←  HOME  →  PROFESSIONAL depth
```

Dark theme atmosphere SHALL remain warm near-black/brown/charcoal. Purple neon haze is prohibited.

## ASM-DEC-005 — Center-Out Header Reveal

Desktop semantic header links SHALL reveal visually from the W_Flyer center outward.

- Application group reveals toward the left.
- Professional group reveals toward the right.
- DOM/accessibility order SHALL remain stable.
- Text remains semantic HTML.
- Text SHALL NOT be converted into SVG solely for animation.

## ASM-DEC-006 — Branch Header Docking

The active branch header group MAY visually approach its branch score using a bounded review-range transform of approximately 12–24 px.

The main header container SHALL remain structurally stable.

## ASM-DEC-007 — Branch Depth Activation

Branch activation/depth SHALL derive only from the existing GSAP master story timeline.

## ASM-DEC-008 — Reduced Motion Functional Preservation

`prefers-reduced-motion` SHALL remove or substantially reduce decorative/cinematic motion while preserving:

- content;
- navigation;
- branch access;
- deep links;
- routes;
- focus;
- forms;
- required state feedback;
- semantic score;
- final states.

## ASM-DEC-009 — Dual Home Progress Model

Home SHALL use two independent progress concepts:

```text
originRevealProgress
  one-shot readiness-driven entry

signedBranchProgress
  reversible scroll-driven branch movement
```

## ASM-DEC-010 — Signed Home Branch Progress

```text
-1 = Application
 0 = Home
+1 = Professional
```

Derived values:

```text
applicationActivation = max(0, -signedBranchProgress)
professionalActivation = max(0, signedBranchProgress)
```

## ASM-DEC-011 — Home Entry Choreography

Sequence:

1. scenic treble clef presence;
2. center-out header reveal;
3. edge atmosphere + latent branch score;
4. settled neutral Home.

## ASM-DEC-012 — Branch Activation Choreography

The selected branch progressively gains emphasis. The inactive branch remains background material initially.

Docking is visual only.

## ASM-DEC-013 — Origin Persistence

The scenic Home treble clef remains a Home/origin anchor.

It SHALL NOT:

- fly into a branch;
- become the branch clef;
- rotate arbitrarily;
- mirror;
- travel with the user.

## ASM-DEC-014 — Entry Replay Policy

The Home entry cinematic is one-shot for its defined entry/session lifecycle.

Ordinary back-scroll to Home SHALL restore settled Home without replaying the entry cinematic.

## ASM-DEC-015 — Deep-Link Settled State

Deep links, refresh restoration, history restoration, and popstate SHALL resolve directly to the correct settled state under the readiness cover.

They SHALL NOT force Home cinematic playback.

## ASM-DEC-016 — Assembly State Model

```text
CANONICAL
  ↓
DISASSEMBLING
  ↓
TRANSITION
  ↓
REASSEMBLING
  ↓
CANONICAL
```

This is a semantic model. It does not require React state.

## ASM-DEC-017 — Event-Free Assembly

Composer-backed musical events SHALL NOT be shown in Assembly transitions.

## ASM-DEC-018 — Assembly Levels

Allowed levels:

```text
ASSEMBLY_SUBTLE
ASSEMBLY_STRUCTURAL
ASSEMBLY_SCENIC
```

## ASM-DEC-019 — Scenic Reservation

Scenic Assembly is primarily reserved for Home/origin unless explicitly approved elsewhere.

## ASM-DEC-020 — Structural Assembly Scenes

Structural Assembly is authorized for:

- Professional Services;
- Application How It Works;
- explicitly approved complex directional transitions.

## ASM-DEC-021 — Glyph Participation

Canonical glyph components MAY visually participate in explicit Scenic contexts, but this SHALL NOT mutate Composer semantics.

## ASM-DEC-022 — Deterministic Reversibility

Assembly state SHALL be a deterministic function of semantic progress.

Returning to the same semantic progress SHALL return to the same visual state.

## ASM-DEC-023 — Projection vs GSAP

Projection owns geometry and progress anchors.

GSAP owns interpolation/presentation.

## ASM-DEC-024 — Responsive Semantic Equivalence

Desktop and mobile MAY use different physical choreography while preserving the same semantic intent.

## ASM-DEC-025 — Mobile Professional-First

Mobile narrative order SHALL be Professional first, then Application.

## ASM-DEC-026 — Horizontal Musical Notation Invariant

Vertical document flow SHALL NOT produce vertical musical notation.

Event shelves remain locally horizontal or gently inclined.

## ASM-DEC-027 — Mobile Serpentine Score Continuity

Each mobile branch SHALL use a continuous S-shaped / alternating left-right serpentine score.

Each chapter MAY contain a local left-to-right event shelf.

Side repositioning occurs through:

- event-free TRUE_CONNECTOR; or
- authorized Assembly.

## ASM-DEC-028 — Mobile Branch Separation

Professional SHALL end at its own final barline before Application begins.

Application SHALL end at its own final barline before the one global footer.

## ASM-DEC-029 — Mobile Connector Event Safety

Mobile side-repositioning connectors SHALL contain zero Composer-backed events.

## ASM-DEC-030 — Responsive Header Equivalence

Desktop center-out header choreography SHALL NOT be mechanically copied to narrow viewports.

Mobile uses the compact responsive navigation specified later.

## ASM-DEC-031 — Assembly Level Adaptation

Vertical-wide and vertical-compact modes SHALL reduce Scenic/Structural geometric complexity while preserving semantic classification.

## ASM-DEC-032 — Responsive State Preservation

Resize SHALL preserve:

- seed;
- composition;
- active semantic chapter;
- logical story position;
- Assembly semantic state.

Projection/presentation MAY change.

## ASM-DEC-033 — No Assembly Replay on Responsive Change

Responsive mode changes SHALL settle to equivalent state without replaying intro or chapter Assembly.

## ASM-DEC-034 — Home Scenic Restraint

Home Scenic Assembly SHALL use a restrained musical component budget.

Uncontrolled glyph dispersion is prohibited.

## ASM-DEC-035 — Scenic Treble Clef Stability

The scenic treble clef remains visually intact as the stable origin anchor.

Only bounded opacity/scale/position settlement is allowed.

## ASM-DEC-036 — Desktop Latent Edge Score Formation

Desktop branch scores SHALL initially emerge from their respective edge depth zones before canonical score presentation.

## ASM-DEC-037 — Scenic-to-Canonical Handoff

Scenic musical material is presentation-only.

Canonical Composer-backed notation begins only after the geometry establishes a valid canonical/event-safe handoff.

## ASM-DEC-038 — Header as Secondary Assembly Event

Header reveal occurs after the scenic treble clef establishes origin.

## ASM-DEC-039 — Scenic Glyph Budget

Initial Scenic implementation SHOULD prioritize:

- staff;
- at most a small number of supporting glyph fragments.

Beams, ledger lines, rests, and dense notation SHOULD be avoided unless separately approved.

## ASM-DEC-040 — Mobile Scenic Simplification

Compact mobile preserves:

- origin;
- treble clef;
- Professional-first entry;

while substantially reducing spectacle.

## ASM-DEC-041 — Canonical Entry Anchor

Each branch SHALL expose a deterministic `CANONICAL_ENTRY_ANCHOR` owned by Projection.

## ASM-DEC-042 — Geometry-Matched Handoff

Scenic staff SHALL converge to the exact canonical branch-entry geometry before ownership transfer.

## ASM-DEC-043 — Single Canonical Geometry Source

Scenic Assembly SHALL consume canonical entry geometry.

It SHALL NOT define a second final staff geometry.

## ASM-DEC-044 — Canonical Lead-In

The first Composer-backed event SHALL appear only after a short event-free canonical lead-in.

The exact `N × staffSpace` value is a calibration/human-review parameter.

## ASM-DEC-045 — Scenic Clef Separation

The scenic Home clef SHALL NOT replace the canonical branch clef.

## ASM-DEC-046 — Scenic Glyph Semantic Isolation

Scenic glyph fragments remain presentation-only and SHALL NOT become canonical Composer events in the initial implementation.

## ASM-DEC-047 — Progress-Based Ownership Transfer

Scenic/canonical handoff SHALL be deterministic and reversible by semantic progress.

It SHALL NOT be implemented as an irreversible one-shot `onEnter` swap.

## ASM-DEC-048 — Mobile Branch Handoff Separation

Home may scenically hand off into Professional.

Application starts later as a separate canonical branch after the Professional final barline.

---

# 7. Mobile Header Decisions — `MOB-HDR-DEC-*`

## MOB-HDR-DEC-001 — Compact Mobile Header

Vertical W_Flyer modes SHALL use a compact sticky single-row header:

```text
CHAPTER
┌───────────────────────────────┐
│ W_Flyer       Sobre      ☰ ◐ │
└───────────────────────────────┘
```

Owners:

1. W_Flyer/Home anchor;
2. active semantic chapter label;
3. full navigation trigger;
4. theme control.

## MOB-HDR-DEC-002 — Mobile Navigation Consolidation

The complete canonical navigation SHALL move behind the mobile menu trigger rather than rendering all destinations simultaneously in the sticky header.

## MOB-HDR-DEC-003 — Mobile Navigation Sheet

`☰` SHALL open a dedicated navigation sheet/drawer, not a narrow dropdown.

## MOB-HDR-DEC-004 — Mobile Navigation Ordering

The sheet SHALL use Professional-first ordering, followed by Application.

## MOB-HDR-DEC-005 — Active Destination Semantics

Active state SHALL use semantic state such as `aria-current` and a visual indicator that does not rely only on color.

## MOB-HDR-DEC-006 — Accessible Modal Navigation

While open:

- focus remains inside the navigation surface;
- Escape closes;
- background interaction is suppressed;
- focus restoration is deterministic.

## MOB-HDR-DEC-007 — Background Scroll Isolation

Document scrolling MAY be locked only while the mobile navigation surface is open.

This does not authorize ordinary-story scroll interception.

## MOB-HDR-DEC-008 — Story Navigation Reuse

Selecting a mobile destination SHALL reuse the canonical story navigation controller.

No separate mobile teleport system.

## MOB-HDR-DEC-009 — Header Semantic State Model

```text
SETTLED
MENU_OPEN
NAVIGATING
RESTORING
```

These are semantic states, not a requirement for scroll-frame React state.

## MOB-HDR-DEC-010 — Active Chapter Label

The compact header context label SHALL reflect the actual active narrative chapter, including narrative chapters not explicitly listed in the sheet.

## MOB-HDR-DEC-011 — Home Label Suppression

On Home/origin, the center label SHALL be empty because W_Flyer itself represents Home.

```text
HOME
┌───────────────────────────────┐
│ W_Flyer                  ☰ ◐ │
└───────────────────────────────┘
```

## MOB-HDR-DEC-012 — Stable Chapter Ownership

Chapter-label changes SHALL derive from stable semantic chapter ownership, not raw pixel position.

## MOB-HDR-DEC-013 — Menu Story-State Isolation

Opening/closing/interacting with the sheet SHALL NOT alter:

- story progress;
- active chapter;
- Composer output;
- score projection.

## MOB-HDR-DEC-014 — Destination Focus Policy

Closing without navigation restores focus to the trigger.

Successful navigation follows the canonical destination-focus contract.

## MOB-HDR-DEC-015 — Responsive Menu Teardown

If the viewport leaves mobile-navigation mode while the sheet is open, the sheet SHALL close deterministically before establishing the new responsive header state.

## MOB-HDR-DEC-016 — Theme Independence

Theme changes while the sheet is open SHALL preserve:

- open menu;
- semantic story state;
- composition.

Theme color changes SHALL NOT regenerate score geometry or composition.

## 7.1 Canonical mobile sheet order

```text
W_Flyer / Home

PROFISSIONAL
Sobre
Serviços
Processo
Projetos
Contato

APLICAÇÃO
Aplicação
Como funciona
Benefícios
Lançamento
```

`Demonstração` is a narrative chapter and MAY appear as the active label, but it is not a dedicated navigation-sheet destination.

---

# 8. Bounded Successor Geometry Refinement

This section is the only pre-motion geometry work intentionally transferred from Phase 9.

---

## 8.1 ASM-LAYOUT-DELTA-001 — Application terminal continuation

### Current problem

The Application terminal currently uses a large return/U-turn to bring the score back toward the opposite side.

The human review determined that this is technically valid but narratively unnecessary.

### Required visual result

The Application terminal SHALL remain on the spatial continuation of the Application branch.

The terminal SHALL NOT use a large return loop whose only purpose is moving the staff back to the opposite side.

### Musical reading constraint

Story-space direction and musical reading direction are distinct.

The final local notation shelf SHALL still read left-to-right.

### SCORE-LAYOUT-DEC-001 — Application Terminal Continuation

```text
The Application terminal scene shall remain on the spatial continuation of the
Application branch rather than introducing a terminal U-turn whose sole purpose
is returning the staff toward the opposite side.

The final musical shelf shall remain locally left-to-right and EVENT_SAFE_STRAIGHT.
The final barline shall terminate that shelf conventionally.
```

### Acceptance

- no unnecessary terminal return loop;
- final shelf locally LTR;
- final barline conventional;
- zero path self-intersections;
- zero staff-line self-intersections;
- protected content remains clear;
- terminal visually reads as the natural end of the Application branch.

---

## 8.2 ASM-LAYOUT-DELTA-002 — Composer events only on visually straight shelves

### Problem

The previous `NOTATION_SAFE` rule and tangent threshold are not sufficient.

Some events can remain technically under 18° yet still appear inside/near a turn or reversal.

This visually reads as incorrect notation.

### New classification

Projection SHALL distinguish:

```text
NOTATION_SAFE
├── EVENT_SAFE_STRAIGHT
└── EVENT_FREE_CURVED
```

Composer-backed events SHALL appear only in `EVENT_SAFE_STRAIGHT`.

### SCORE-LAYOUT-DEC-004 — Event-Safe Straight Shelves

An event-safe interval SHALL satisfy all of the following:

- entire event footprint remains inside NOTATION_SAFE;
- event footprint plus safety margins remains away from turn/reversal boundaries;
- local direction remains left-to-right across the entire event footprint;
- local tangent angle remains <=18°;
- tangent variation across the full event footprint remains <=6°;
- no local direction reversal;
- no overlap with TRUE_CONNECTOR;
- no overlap with ASSEMBLY_TRANSITION;
- no overlap with EVENT_FREE_CURVED.

Initial review margin:

```text
event footprint + 1.5 × staffSpace on each side
```

This margin is a calibration value, not a permission to weaken visual correctness.

### Acceptance

- zero Composer events inside curved/U-turn/reversal regions;
- accidental/stem/beam/ledger footprint included in safety classification;
- deterministic zone classification;
- event groups remain musically coherent.

---

## 8.3 ASM-LAYOUT-DELTA-003 — Benefits ↔ Demo direct corridor

### Problem

The Benefits ↔ Demo/tablet path currently compresses multiple staff turns into a narrow transition region.

The result visually resembles squeezed geometry and can make notes overlap in a way that appears like a rendering error.

### Required result

When consecutive scenes expose a compatible unobstructed corridor, Projection SHALL prefer direct or broad low-curvature continuity.

### SCORE-LAYOUT-DEC-002 — Direct Transition Preference

```text
When consecutive scenes expose a compatible unobstructed score corridor,
Projection shall prefer direct or broad low-curvature continuity instead of
adding loops, folds, or compressed turns solely for visual complexity.
```

### SCORE-LAYOUT-DEC-003 — Application Benefits/Demo Corridor

The Benefits ↔ Demo transition SHALL:

- be broad and predominantly direct;
- remain event-free while transitioning;
- avoid unnecessary staff compression;
- preserve tablet and Benefits protected-content clearance;
- resume Composer-backed events only on the next `EVENT_SAFE_STRAIGHT` shelf.

### Acceptance

- transition reads as one scene flowing naturally into the next;
- no squeezed-staff appearance;
- zero event overlap;
- zero events in transition;
- zero protected-content collisions;
- event shelves remain within tangent constraints.

---

## 8.4 ASM-LAYOUT-DELTA-004 — Professional straight-shelf event utilization

### Problem

Professional geometry is generally correct, but some long straight shelves appear visually under-populated.

### Required rule

Existing semantic composition SHALL be used first.

Projection MAY redistribute available semantic events more effectively across long `EVENT_SAFE_STRAIGHT` shelves while preserving:

- event order;
- rhythmic grouping;
- motif identity;
- stems;
- beams;
- triplets;
- accidentals;
- ledger-line semantics;
- key-signature semantics.

### SCORE-LAYOUT-DEC-005 — Existing Composition First

The renderer/projection SHALL NOT invent presentation-only notes simply because a shelf looks empty.

Initial optical target:

```text
long shelf >= 40 × staffSpace
typical event-group optical spacing ≈ 8–14 × staffSpace
```

These are review targets, not rigid musical timing.

If adequate density cannot be achieved with existing canonical composition:

```text
STOP
→ report the limitation
→ request explicit Composer-version approval
```

The executor SHALL NOT silently duplicate or synthesize events.

### Acceptance

- long Professional straight shelves use existing events more effectively;
- no semantic duplication;
- no events inside curves/connectors;
- reference composition fingerprints remain unchanged unless a separately approved Composer version change is opened.

---

## 8.5 ASM-LAYOUT-DELTA-005 — Home final scene

The existing Home placeholder SHALL NOT be treated as the final Home.

Home SHALL be replaced by the approved Scenic Assembly specified in Section 10.

This is successor-scope implementation, not a Phase-9 defect.

---

# 9. Motion Decisions — `MOT-DEC-*`

## MOT-DEC-001 — Score Draw Ownership

The existing GSAP master story timeline SHALL drive deterministic staff draw and erase through precomputed semantic anchors.

## MOT-DEC-002 — Unified Staff Front

The five staff lines SHALL share one logical draw front.

They SHALL NOT behave as five unrelated writing animations.

## MOT-DEC-003 — Semantic Event Reveal

Musical events become eligible only after the staff front reaches their precomputed `EVENT_SAFE_STRAIGHT` reveal anchor.

## MOT-DEC-004 — Event Group Atomicity

Coupled notation SHALL reveal as coherent groups.

Examples:

- notehead + stem + flag;
- beamed notes;
- triplets + “3”;
- attached accidentals;
- ledger lines belonging to the event.

## MOT-DEC-005 — No Events During Connector/Assembly

The following regions SHALL never trigger Composer-backed event reveal:

- TRUE_CONNECTOR;
- EVENT_FREE_CURVED;
- ASSEMBLY_TRANSITION.

## MOT-DEC-006 — Score-Driven Content Reveal

Narrative content MAY use reveal anchors related to score approach, provided semantic DOM content remains present and usable without motion.

## MOT-DEC-007 — Content Reveal Hysteresis

Content reveal/hide MAY use bounded hysteresis to prevent flicker near thresholds.

## MOT-DEC-008 — Settled Deep-Link State

Deep links, restoration, and explicit navigation SHALL resolve directly to correct settled score/event/content states.

## MOT-DEC-009 — Precomputed Reveal Anchors

All reveal anchors SHALL be precomputed.

Per-frame DOM/path measurement is prohibited.

---

# 10. Home Scenic Assembly — State by State

## 10.1 Home progress model

Home SHALL use:

```text
originRevealProgress
signedBranchProgress
```

`originRevealProgress` is one-shot.

`signedBranchProgress` is reversible.

---

## HOME-STATE-00 — LATENT_ORIGIN

### Required state

- semantic Home content is present;
- W_Flyer identity exists;
- scenic clef may be latent;
- no branch is active;
- branch scores are not yet canonical event-bearing notation;
- page remains usable if motion never initializes.

### Exit condition

Motion readiness becomes valid.

---

## HOME-STATE-01 — CLEF_ESTABLISHED

### Required state

- principal scenic treble clef becomes the visual origin anchor;
- clef remains intact;
- no mirror;
- no arbitrary rotation;
- no travel into branches;
- W_Flyer identity relationship is established.

---

## HOME-STATE-02 — HEADER_REVEAL

### Desktop

- central W_Flyer identity stable;
- semantic links reveal center-out;
- Application group expands left;
- Professional group expands right;
- DOM/accessibility semantics remain stable.

### Mobile

Do not mechanically reproduce desktop center-out choreography.

---

## HOME-STATE-03 — SCORE_AWAKENING

### Required state

- warm edge atmosphere becomes perceptible;
- latent Application staff emerges from the left depth zone;
- latent Professional staff emerges from the right depth zone;
- no canonical events are required yet;
- limited scenic glyph fragments MAY appear.

---

## HOME-STATE-04 — BRANCH_FORMATION

Canonical desktop orientation:

```text
APPLICATION ← HOME / ORIGIN → PROFESSIONAL
```

### Required state

- scenic branch material converges toward each branch `CANONICAL_ENTRY_ANCHOR`;
- selected branch may gain depth/emphasis as signed branch progress moves away from zero;
- scenic geometry matches canonical entry before ownership transfer.

---

## HOME-STATE-05 — SETTLED_HOME

### Required state

- one-shot entry cinematic is complete;
- scenic clef remains;
- header stable;
- branch directions legible;
- back-scroll returns directly here without entry replay;
- signed branch progress remains reversible.

---

# 11. Scenic-to-Canonical Handoff

Required sequence:

```text
SCENIC STAFF
  ↓
geometry convergence
  ↓
CANONICAL_ENTRY_ANCHOR
  ↓
matched ownership overlap
  ↓
event-free canonical lead-in
  ↓
EVENT_SAFE_STRAIGHT
  ↓
Composer-backed events allowed
```

The handoff SHALL NOT use a crude visible geometry swap.

If opacity crossfade is used:

- scenic + canonical geometry must match;
- total visual opacity must remain controlled;
- no duplicate staff line appearance;
- no positional jump.

Deep links SHALL bypass previous Scenic playback and resolve directly to settled canonical state.

Reduced motion SHALL use a direct/minimal handoff.

---

# 12. Structural Assembly — Services and How It Works

## 12.1 Authorized scenes

Structural Assembly is initially authorized for:

- Professional Services;
- Application How It Works;
- specifically approved complex directional transitions.

Projects remains explicitly non-Assembly.

## 12.2 State machine

### CANONICAL

Normal five-line canonical staff.

### DISASSEMBLING

The staff begins bounded separation/expansion.

Constraints:

- zero Composer events;
- zero self-intersections;
- zero accidental protected-content collisions.

### TRANSITION

Maximum structural transformation.

The staff MAY:

- expand;
- partially converge;
- reduce visible-line count temporarily if deliberate;
- route around card envelopes.

### REASSEMBLING

The staff returns toward canonical geometry.

### CANONICAL

Five-line canonical score fully restored.

Composer-backed events may resume only after an event-safe shelf exists.

## 12.3 Structural rule

Assembly SHALL solve a narrative/layout problem.

If a direct low-curvature path solves the scene, direct continuity is preferred.

Assembly SHALL NOT be decorative filler.

---

# 13. Projects — Explicit Non-Assembly Choreography

Projects SHALL preserve distinct card visits.

Required sequence:

```text
entry
→ Project 1 shelf
→ event-free valley
→ Project 2 shelf
→ event-free valley
→ Project 3 shelf
→ Contact departure
```

Requirements:

- each real card has a distinct visit;
- valleys/connectors remain event-free;
- events only on `EVENT_SAFE_STRAIGHT`;
- existing composition used first;
- event utilization may increase under `ASM-LAYOUT-DELTA-004`;
- Projects SHALL NOT be converted to Structural Assembly without a new decision.

---

# 14. Responsive / Mobile Score Model

## 14.1 Canonical mobile story

```text
HOME
  ↓
PROFESSIONAL S-SCORE
  ↓
PROFESSIONAL FINAL BARLINE
  ↓
TRANSITION
  ↓
APPLICATION S-SCORE
  ↓
APPLICATION FINAL BARLINE
  ↓
ONE GLOBAL FOOTER
```

## 14.2 Local notation orientation

The document is vertical.

Musical notation remains locally LTR.

```text
EVENT_SAFE_STRAIGHT →
                    ╲
                     ╲ TRUE_CONNECTOR
                      ╲
EVENT_SAFE_STRAIGHT →
```

## 14.3 Responsive modes

Canonical presentation modes:

- `horizontal-enhanced`;
- `vertical-wide`;
- `vertical-compact`;
- static/reduced-motion-safe as applicable.

Mode changes preserve:

- session seed;
- semantic composition;
- active semantic chapter;
- logical story progress;
- Assembly semantic state.

Mode changes MAY alter physical projection/presentation.

They SHALL NOT replay Home entry or chapter Assembly.

---

# 15. Mobile Header — State by State

## MOBILE-HDR-STATE-SETTLED

Home:

```text
┌───────────────────────────────┐
│ W_Flyer                  ☰ ◐ │
└───────────────────────────────┘
```

Chapter:

```text
┌───────────────────────────────┐
│ W_Flyer       Projetos    ☰ ◐ │
└───────────────────────────────┘
```

Requirements:

- sticky;
- one compact row;
- touch targets >=44 px;
- Home anchor real and accessible;
- center label empty on Home;
- active semantic chapter shown elsewhere.

## MOBILE-HDR-STATE-MENU_OPEN

Required:

- full Professional-first navigation sheet;
- focus containment;
- Escape closes;
- background interaction suppressed;
- body scroll locked only while open;
- story progress unchanged;
- Composer unchanged;
- Projection unchanged.

## MOBILE-HDR-STATE-NAVIGATING

Sequence:

```text
sheet closes
  ↓
canonical navigation controller starts
  ↓
FAST_TRAVERSAL activates when applicable
  ↓
header label follows actual semantic ownership
  ↓
destination settles
  ↓
SETTLED
```

The header SHALL NOT display a destination as active before semantic ownership reaches it.

## MOBILE-HDR-STATE-RESTORING

Used for:

- Back;
- Forward;
- refresh;
- deep link;
- browser restoration.

Restoration resolves directly to the settled state.

---

# 16. Score Draw, Event Reveal, and Content Reveal

## 16.1 Logical staff front

```text
staffDrawProgress = p
```

All five lines share one logical front.

Small optical offsets MAY exist, but the staff must read as one entity.

## 16.2 Event reveal eligibility

An event group becomes eligible only when:

```text
staff front reached eventRevealAnchor
AND zone == EVENT_SAFE_STRAIGHT
AND presentation policy allows events
```

During `FAST_TRAVERSAL`, event presentation is always disabled.

## 16.3 Content reveal

Content MAY respond to score approach.

Examples:

Projects:
```text
score approaches Project 1 → Project 1 reveal
score approaches Project 2 → Project 2 reveal
```

Services / How:
```text
Assembly progresses → card presentation progresses
```

Semantic DOM content remains present regardless of enhancement.

## 16.4 Hysteresis

Bounded hysteresis MAY prevent flicker.

Example review model:

```text
show >= 0.52
hide < 0.46
```

Exact thresholds SHALL be deterministic and tested.

---

# 17. Fast Traversal — State by State

## 17.1 Presentation modes

```text
NORMAL_SCRUB
FAST_TRAVERSAL
RESTORE_SETTLED_STATE
```

These are presentation policies over the same story model.

## 17.2 Activation

`FAST_TRAVERSAL` activates only from explicit programmatic story navigation.

Manual high-velocity scrolling remains `NORMAL_SCRUB` unless separately decided.

## 17.3 Active Fast Traversal

During traversal:

```text
staff progression            ON
staff draw/erase             ON
canonical path state         ON
Assembly geometry            ON when required
Composer-backed events       OFF
event reveal                 OFF
intermediate content motion  simplified/suppressed
```

This is the canonical rule:

```text
FAST_TRAVERSAL = STAFF ONLY
```

## 17.4 Arrival

```text
FAST_TRAVERSAL
  ↓
destination semantic state resolved
  ↓
NORMAL_SCRUB
  ↓
events may reveal
  ↓
destination content settles
```

## 17.5 Cancellation

Cancellation sources:

- wheel;
- touch;
- navigation key;
- Escape;
- new target;
- material responsive-mode change.

On cancel:

```text
capture actual current story progress
  ↓
cancel old traversal
  ↓
NORMAL_SCRUB owns presentation
  ↓
events/content resolve from actual current state
```

The old destination SHALL NOT complete.

## 17.6 Target replacement

A new destination replaces the previous target.

Traversal restarts from the current real story position.

Events remain hidden while replacement traversal is active.

## 17.7 Cross-branch traversal

Professional ↔ Application Fast Traversal MAY pass through settled Home.

Home entry cinematic SHALL NOT replay.

---

# 18. Reduced Motion

Reduced motion SHALL preserve the full feature set.

## 18.1 Remove or substantially reduce

- long cinematic staff writing;
- decorative glyph movement;
- prolonged Assembly separation;
- large docking movement;
- decorative stagger;
- parallax/atmosphere motion;
- long intermediate Fast Traversal animation.

## 18.2 Preserve

- content;
- navigation;
- score semantics;
- branch structure;
- deep links;
- forms;
- focus;
- state feedback;
- final barlines;
- active chapter;
- responsive continuity.

## 18.3 Navigation under reduced motion

Navigation MAY resolve quickly/directly to the target settled state while preserving:

- correct scroll state;
- history;
- destination;
- focus;
- semantic chapter ownership.

---

# 19. Runtime Lifecycle — State by State

Canonical lifecycle:

```text
UNINITIALIZED
  ↓
WAITING_FOR_READINESS
  ↓
BUILDING
  ↓
READY
  ↓
ACTIVE
  ↓
REBUILDING
  ↓
ACTIVE
  ↓
DISPOSING
  ↓
DISPOSED
```

## RUNTIME-STATE-UNINITIALIZED

No motion runtime exists.

## RUNTIME-STATE-WAITING_FOR_READINESS

Wait only for dependencies that materially affect geometry/presentation.

Classify dependencies:

```text
GEOMETRY_CRITICAL
PRESENTATION_ENHANCEMENT
NON_BLOCKING
```

Readiness SHALL retain a hard timeout/fallback.

## RUNTIME-STATE-BUILDING

Create:

- scoped GSAP context;
- master bindings;
- staff draw anchors;
- event reveal anchors;
- content reveal anchors;
- Assembly bindings;
- header bindings;
- diagnostics counters.

## RUNTIME-STATE-READY

Bindings valid and ready to activate.

## RUNTIME-STATE-ACTIVE

Hard invariants during ordinary scrub:

```text
Composer calls / frame         = 0
Projection rebuilds / frame    = 0
DOM measurements / frame       = 0
React frame-clock state writes = 0
```

## RUNTIME-STATE-REBUILDING

Allowed only after material layout/responsive invalidation.

Sequence:

```text
coalesce invalidations
  ↓
measure stable layout once
  ↓
rebuild projection
  ↓
rebuild bounded motion bindings
  ↓
restore equivalent semantic state
```

No Home replay.

## RUNTIME-STATE-DISPOSING

Release:

- scoped GSAP owners;
- traversal;
- observers;
- listeners;
- timers/RAF;
- focus trap;
- body scroll lock;
- DOM references.

## RUNTIME-STATE-DISPOSED

No stale runtime owner remains.

Cleanup must be idempotent.

---

# 20. Readiness, SSR, Hydration, and Fail-Open

## 20.1 SSR baseline

Server output SHALL contain usable semantic content.

SSR SHALL NOT guess:

- scroll position;
- viewport-specific Assembly state;
- DOM measurements;
- runtime transform state.

## 20.2 Progressive enhancement

Conceptual guard:

```text
data-motion-ready="false|true"
```

Exact naming is implementation-specific.

Before motion readiness:

- content visible;
- navigation usable;
- forms usable;
- score safe/static.

After readiness:
GSAP may assume presentation ownership.

## 20.3 Fail-open behavior

If motion/projection enhancement fails:

```text
content remains visible
navigation remains usable
forms remain usable
scroll remains available
focus remains recoverable
score falls back safely
```

Prohibited failure states:

- hidden document;
- permanent `overflow:hidden`;
- orphan focus trap;
- blank screen;
- inaccessible navigation.

---

# 21. Lifecycle, Cleanup, Performance, and Observability Decisions

## MOT-DEC-025 — Scoped Motion Runtime Ownership

All W_Flyer story motion SHALL be owned by a scoped story-root lifecycle.

Global kill-all cleanup is prohibited.

## MOT-DEC-026 — Idempotent Cleanup

Cleanup SHALL release:

- GSAP bindings;
- listeners;
- observers;
- traversal state;
- RAF/timers;
- scroll locks;
- focus traps;
- stale DOM references.

Repeated cleanup SHALL be safe.

## MOT-DEC-027 — Structural Rebuild Only

Motion/projection rebuilds SHALL occur only after material geometry or responsive-mode invalidation.

They SHALL NOT occur because of:

- ordinary scroll;
- active chapter change;
- theme color change.

## MOT-DEC-028 — Coalesced Layout Invalidation

Equivalent layout invalidations SHALL be coalesced into one stable measurement/projection rebuild.

## MOT-DEC-029 — Resize Traversal Cancellation

Material responsive-mode change during Fast Traversal SHALL:

1. cancel traversal;
2. capture actual semantic position;
3. rebuild;
4. resolve equivalent `NORMAL_SCRUB` state.

## MOT-DEC-030 — Progressive Motion Readiness

Semantic content remains usable before motion readiness.

## MOT-DEC-031 — Motion Fail-Open

Motion failure SHALL fall back to usable content/navigation/forms.

## MOT-DEC-032 — Non-Frame Observability

Observability SHALL record lifecycle/traversal/rebuild/invariant events, not per-frame scroll telemetry.

## MOT-DEC-033 — Instrumentable Performance Counters

Development/test builds SHALL expose counters sufficient to prove:

```text
ordinary scrub:
Δ Composer calls        = 0
Δ Projection rebuilds   = 0
Δ DOM measurements      = 0
Δ React frame-clock use = 0
```

## MOT-DEC-034 — Motion Memory Stability

Repeated navigation, resize, and mount/unmount SHALL NOT cause unbounded growth in:

- timelines;
- observers;
- listeners;
- visual owners.

## MOT-DEC-035 — Session Composition Stability

The following SHALL NOT regenerate the deterministic session composition:

- resize;
- theme change;
- navigation-sheet state;
- motion rebuild;
- traversal;
- traversal cancellation.

---

# 22. Performance and Diagnostics

## 22.1 Performance targets

Preserve existing targets:

- LCP p75 <=2.5 s;
- INP <=200 ms;
- CLS <=0.10;
- avoid >50 ms main-thread tasks;
- approximately 16.7 ms/frame enhanced desktop target;
- no unnecessary critical video bytes.

## 22.2 Development counters

Expose bounded diagnostics such as:

```text
composerCalls
projectionBuilds
layoutMeasurements
storyRenderCount
motionRebuilds
activeTimelineOwners
activeObserverOwners
```

## 22.3 Visual Lab diagnostics

Development Visual Lab MAY expose:

```text
mode
storyProgress
activeChapter
branch
fastTraversal
assemblyZone
staffDrawProgress
visibleEventGroupCount
projectionBuildCount
composerInvocationCount
layoutReadCount
```

## 22.4 Production event logging

Useful event classes:

```text
MOTION_INIT_STARTED
MOTION_READY
MOTION_FALLBACK
MOTION_REBUILD_STARTED
MOTION_REBUILD_COMPLETED
MOTION_REBUILD_FAILED

TRAVERSAL_STARTED
TRAVERSAL_COMPLETED
TRAVERSAL_CANCELLED

RESPONSIVE_MODE_CHANGED

PROJECTION_INVALID
ASSEMBLY_INVARIANT_FAILED
```

Per-frame telemetry is prohibited.

Sensitive form data SHALL NOT be logged.

---

# 23. Accessibility

The implementation SHALL preserve:

- semantic HTML;
- real links/controls;
- keyboard accessibility;
- stable focus order;
- visible focus;
- active-location semantics;
- >=44 px mobile touch targets;
- reduced-motion support;
- no-JS semantic availability;
- screen-reader-meaningful document order;
- Professional-first mobile narrative;
- navigation-sheet focus restoration;
- no focus trap outside `MENU_OPEN`.

Visual branch position SHALL NOT override semantic accessibility order.

---

# 24. Security and Form Isolation

This OpenSpec is presentation-heavy, but it SHALL NOT weaken existing security controls.

Specifically:

- Contact form security remains authoritative.
- Launch-interest Turnstile/origin/rate-limit/idempotency remains authoritative.
- Motion readiness SHALL NOT bypass form validation.
- Mobile sheet scroll lock SHALL always be recoverable.
- Animation labels/content SHALL NOT introduce unsafe HTML injection.
- Diagnostics SHALL NOT capture email, form messages, consent payloads, Turnstile token, or sensitive fields.
- Theme/motion state SHALL NOT affect security authorization decisions.

---

# 25. Acceptance Contracts — `ASM-AC-001..025`

## ASM-AC-001 — Composition Immutability

Reference semantic composition remains unchanged unless a separately approved Composer change explicitly authorizes version change.

## ASM-AC-002 — Event-Free Connectors and Assembly

`TRUE_CONNECTOR`, `EVENT_FREE_CURVED`, and `ASSEMBLY_TRANSITION` contain zero Composer-backed event presentation.

## ASM-AC-003 — Notation Geometry

Event-bearing shelves:

- tangent <=18°;
- zero center/staff intersections;
- correct orientation;
- no mirrored notation.

## ASM-AC-004 — Deterministic Reversibility

Same semantic progress `p` yields the same Assembly/presentation state in forward and reverse travel.

## ASM-AC-005 — Native Scroll

Ordinary wheel/touch scrolling remains native.

## ASM-AC-006 — Single Temporal Authority

GSAP master story timeline remains the single temporal authority.

Anime.js absent.

## ASM-AC-007 — Zero Per-Frame Structural Work

Ordinary scrub produces:

```text
Composer calls/frame       = 0
Projection rebuilds/frame  = 0
DOM measurements/frame     = 0
React frame-clock updates  = 0
```

## ASM-AC-008 — Home Integrity

Desktop Home clearly reads:

```text
APPLICATION ← HOME / ORIGIN → PROFESSIONAL
```

with scenic clef, W_Flyer identity, latent scores, and restrained warm edge depth.

## ASM-AC-009 — Dual Home Progress

One-shot origin reveal and reversible branch progress remain separate.

## ASM-AC-010 — Header Semantic Stability

Header transforms SHALL NOT alter semantic destinations/order or break keyboard navigation.

## ASM-AC-011 — Deep-Link Settled State

Deep links resolve directly to correct settled target state.

## ASM-AC-012 — Mobile Serpentine Continuity

Each mobile branch remains a continuous S-shaped score.

## ASM-AC-013 — No Vertical Musical Staff

Vertical document flow never becomes vertical musical notation.

## ASM-AC-014 — Mobile Branch Separation

Professional final barline precedes Application start.

Application final barline precedes global footer.

## ASM-AC-015 — Professional-First Accessibility

Mobile visual/semantic order preserves Professional-first behavior.

## ASM-AC-016 — Responsive State Preservation

Resize preserves seed/composition/chapter/logical story/Assembly state.

## ASM-AC-017 — No Responsive Replay

Responsive change does not replay intro/Assembly.

## ASM-AC-018 — Reduced Motion Functional Preservation

Reduced motion preserves functionality, content, navigation, and state.

## ASM-AC-019 — Structural Assembly Equivalence

Services and How It Works preserve Structural Assembly semantics across responsive modes, with complexity adapted as required.

## ASM-AC-020 — Projects Assembly Prohibited

Projects is not converted into Assembly without a new approved decision.

## ASM-AC-021 — Scenic Glyph Presentation Isolation

Home Scenic glyph material remains presentation-only.

## ASM-AC-022 — Protected Content Classification

Protected-content relationships resolve to explicit states such as:

```text
CLEAR
TOO_CLOSE
INTENDED_OCCLUDED
```

Final accepted state SHALL NOT contain accidental collision.

## ASM-AC-023 — Deterministic Progress Snapshots

Deterministic snapshots exist at selected semantic progress points.

## ASM-AC-024 — Reverse-State Snapshot Equality

Equivalent forward/backward progress snapshots match within defined deterministic tolerance.

## ASM-AC-025 — Cross-Browser + Human Approval

Chromium, Firefox, and WebKit automated gates SHALL pass.

Explicit human visual approval SHALL follow.

---

# 26. Implementation Decisions — `ASM-IMP-DEC-*`

## ASM-IMP-DEC-001 — Separate Post-Phase-9 Change

Assembly/Motion implementation SHALL use an isolated OpenSpec change created only after Phase 9 closes.

Recommended change:

```text
implement-scroll-driven-score-assembly-and-motion
```

## ASM-IMP-DEC-002 — Layered Implementation Order — REVISED

Implementation SHALL proceed through:

1. bounded successor geometry stabilization;
2. geometry human-review gate;
3. geometry refreeze;
4. motion metadata and pure models;
5. presentation binding;
6. scene integration;
7. navigation integration;
8. responsive/reduced-motion integration;
9. lifecycle, observability, and final regression.

No motion shall be layered over unresolved registered successor layout deltas.

## ASM-IMP-DEC-003 — Projection Remains Geometry Owner

Projection MAY expose Assembly/reveal metadata but SHALL NOT own GSAP presentation or navigation state.

## ASM-IMP-DEC-004 — Pure Motion Models

Assembly, draw, reveal, traversal presentation, and responsive-state resolution SHALL be deterministic DOM-independent models wherever practical.

## ASM-IMP-DEC-005 — Gate-by-Gate Integration

Each implementation stage SHALL pass focused semantic, geometry, and regression gates before the next visual family is introduced.

## ASM-IMP-DEC-006 — Explicit Successor Geometry Deltas

The successor change MAY contain only the explicitly registered Phase-9 visual refinements defined in this document.

This does not authorize unrelated geometry reopening.

## ASM-IMP-DEC-007 — Geometry Refreeze Before Motion

All registered successor geometry deltas SHALL be:

1. implemented;
2. automatically validated;
3. human-approved;
4. sealed as successor geometry evidence;

before scroll-driven Assembly, staff drawing, Composer-backed event reveal, or content choreography is integrated.

After this gate, geometry is frozen for the remainder of the successor change unless a new proven defect requires correction.

---

# 27. Implementation Stages and Stop Gates

---

## Stage 0 — Successor Change Bootstrap

### Actions

- verify Phase-9 formal closure;
- record exact baseline SHA;
- create isolated OpenSpec;
- reference this canonical specification;
- reconcile actual file owners;
- inspect worktree;
- do not edit runtime yet.

### Gate 0

PASS only if:

- Phase 9 closed;
- baseline SHA recorded;
- historical evidence immutable;
- five successor deltas registered;
- implementation scope bounded.

STOP if any precondition is missing.

---

## Stage 1 — Bounded Geometry Stabilization

### Implement

- `ASM-LAYOUT-DELTA-001`;
- `ASM-LAYOUT-DELTA-002`;
- `ASM-LAYOUT-DELTA-003`;
- `ASM-LAYOUT-DELTA-004`;
- minimal Home entry-anchor geometry required for future Scenic handoff.

### Preserve

- Composer semantics;
- session seed;
- key signatures;
- motif/group ordering;
- Services/How content contracts;
- Projects visit logic;
- Demo/Launch protected-content clearances;
- final barline semantics.

### Required tests

- projection unit tests;
- path continuity;
- zero self-intersections;
- staff-line self-intersections zero;
- tangent rules;
- event-safe classification;
- zero event anchors in forbidden zones;
- protected-content audits;
- horizontal/vertical mode regressions.

### Human Geometry Gate

Capture:

- Application terminal;
- Benefits ↔ Demo;
- Demo ↔ Launch;
- Professional long shelves;
- Home origin entry geometry;
- responsive representative modes.

STOP until explicit human approval.

---

## Stage 2 — Geometry Refreeze

After approval:

- record successor geometry evidence;
- seal manifest;
- record digest;
- mark geometry frozen.

Any later geometry change requires:

1. proven defect;
2. focused fix;
3. focused regression;
4. refreshed affected evidence;
5. no silent unrelated geometry changes.

---

## Stage 3 — Projection Metadata

Add only metadata needed by motion:

- zone type;
- `CANONICAL_ENTRY_ANCHOR`;
- `EVENT_SAFE_STRAIGHT`;
- `EVENT_FREE_CURVED`;
- event-free connectors;
- Assembly intervals;
- draw metrics;
- reveal anchor references.

No GSAP.

### Gate

No visual change beyond the already approved Stage-1 geometry.

---

## Stage 4 — Pure Assembly Model

Implement DOM-independent state resolution:

```text
CANONICAL
DISASSEMBLING
TRANSITION
REASSEMBLING
CANONICAL
```

Inputs:

- semantic progress;
- scene descriptor;
- projection metadata;
- responsive mode;
- reduced-motion policy.

Output:

- deterministic presentation state.

### Gate

Forward/reverse deterministic property tests PASS.

---

## Stage 5 — Staff Draw Model

Implement one logical staff front.

Verify:

- forward;
- reverse;
- branch boundary;
- terminal;
- responsive projection compatibility.

No final GSAP binding yet.

---

## Stage 6 — Event Reveal Model

Associate Composer event groups with `EVENT_SAFE_STRAIGHT` anchors.

Verify:

- atomic event grouping;
- deterministic reveal ordering;
- zero forbidden-zone events;
- no semantic mutation.

---

## Stage 7 — Scenic-to-Canonical Handoff Model

Implement:

- canonical branch entry targets;
- geometry-matched ownership transfer;
- event-free canonical lead-in;
- first event-safe anchor after lead-in.

Verify:

- no visible jump;
- no cusp;
- no duplicate staff opacity artifact;
- deep-link settled bypass;
- reverse equality.

---

## Stage 8 — GSAP Presentation Binding

Only now bind pure motion state to GSAP.

Requirements:

- scoped GSAP context;
- existing master timeline remains authority;
- no DOM reads per frame;
- no Composer calls from GSAP update;
- no Projection rebuild from GSAP update;
- no React frame-state loop.

### Gate

Instrumented ordinary scrub proves all zero-per-frame invariants.

---

## Stage 9 — Home Scenic Assembly

Implement incrementally:

### Stage 9A — Scenic clef + warm atmosphere

### Stage 9B — Center-out desktop header reveal

### Stage 9C — Latent edge scores

### Stage 9D — Branch formation

### Stage 9E — Scenic-to-canonical handoff

### Stage 9F — Branch activation/docking

Recommended:
human review after each materially distinct family.

---

## Stage 10 — Structural Assembly

Implement Services and How It Works using the shared Assembly model.

Scene-specific configuration SHOULD be data-driven/bounded.

Avoid widespread hard-coded scene branching.

### Gate

- event-free Assembly;
- card clearances;
- zero self-intersections;
- deterministic reverse snapshots;
- reduced-motion equivalent;
- responsive equivalent.

---

## Stage 11 — Mobile Serpentine Motion

Bind draw/erase/Assembly to accepted mobile S geometry.

Verify:

- Professional first;
- local LTR notation;
- event-free side connectors;
- Professional terminal before Application;
- Application terminal before global footer;
- no replay on resize.

---

## Stage 12 — Compact Mobile Header

Replace old multi-row mobile header presentation.

Verify:

- single row;
- center empty on Home;
- active semantic chapter elsewhere;
- >=44 px targets;
- sticky reservation;
- no score/content collision.

---

## Stage 13 — Mobile Navigation Sheet

Implement:

- sheet open/close;
- Professional-first order;
- focus containment;
- Escape;
- focus restoration;
- scoped body scroll lock;
- theme independence;
- responsive teardown.

---

## Stage 14 — Normal Scrub Choreography

Enable:

```text
staff draw/erase
→ event reveal
→ bounded content reveal
```

Semantic content remains present regardless of motion.

---

## Stage 15 — Fast Traversal

Implement explicit navigation-controller policy.

During traversal:

```text
STAFF ONLY
```

No Composer-backed notes.

At settle/cancel:

- return to normal scrub;
- resolve notes/content from actual semantic position.

---

## Stage 16 — Reduced Motion

Apply reduced-motion policy over the same semantic architecture.

Do not build a parallel product/navigation architecture.

---

## Stage 17 — Lifecycle and Failure Hardening

Mandatory scenarios:

- mount;
- unmount;
- remount;
- repeated resize;
- orientation changes;
- Fast Traversal cancellation;
- resize during traversal;
- drawer open during responsive mode change;
- theme change;
- deep link before readiness;
- font timeout;
- asset timeout;
- GSAP initialization failure;
- unmount during traversal.

---

## Stage 18 — Final Regression and Homologation

Run full deterministic cross-browser, accessibility, performance, and visual evidence gates.

STOP at explicit final human homologation.

No deployment before approval.

---

# 28. Test Strategy

## 28.1 Unit tests

Required:

- Assembly pure model;
- signed Home branch progress;
- event-safe classification;
- event-free curved classification;
- reveal anchor generation;
- staff draw state;
- Fast Traversal presentation policy;
- cancellation recovery;
- responsive state mapping;
- reduced-motion policy;
- cleanup idempotence.

## 28.2 Projection/geometry tests

Verify:

- continuity;
- point gaps;
- tangent alignment;
- curvature;
- path self-intersections;
- staff-line self-intersections;
- protected-content clearances;
- final barlines;
- event-safe straight rules;
- zero forbidden-zone event anchors.

## 28.3 Playwright

Visual geometry suites SHALL use deterministic serial execution where relevant:

```text
workers = 1
retries = 0
```

Required engines:

- Chromium;
- Firefox;
- WebKit.

## 28.4 Accessibility

Verify:

- keyboard navigation;
- focus order;
- sheet focus containment;
- Escape;
- focus restoration;
- touch targets;
- active-location semantics;
- reduced motion;
- forced colors where applicable;
- no-JS fallback;
- Professional-first mobile reading order.

## 28.5 Performance

During ordinary scrub:

```text
Δ composerCalls       = 0
Δ projectionBuilds    = 0
Δ layoutMeasurements  = 0
```

Also inspect:

- long tasks;
- CLS;
- owner counts;
- memory stability during repeated resize/navigation.

---

# 29. Deterministic Visual Evidence Matrix

## 29.1 Home desktop

Capture:

- latent origin;
- clef established;
- header reveal midpoint;
- score awakening;
- branch formation;
- settled Home;
- Application activation;
- Professional activation.

## 29.2 Application

Capture:

- Overview;
- How It Works canonical;
- How It Works disassembling;
- How It Works transition;
- How It Works reassembling;
- Benefits;
- Benefits ↔ Demo direct corridor;
- Demo;
- Launch;
- Application terminal on branch continuation;
- final barline.

## 29.3 Professional

Capture:

- About;
- Services canonical;
- Services disassembling;
- Services transition;
- Services reassembling;
- Process;
- Projects visit 1;
- Projects visit 2;
- Projects visit 3;
- Contact;
- Professional terminal.

## 29.4 Mobile

Capture:

- Home;
- compact header Home;
- compact header active chapter;
- navigation sheet;
- Professional S representative;
- Services Assembly;
- Professional terminal;
- Application start;
- How Assembly;
- Application S representative;
- Application terminal;
- global footer.

## 29.5 Fast Traversal

Mandatory mid-traversal capture:

```text
staff visible
Composer-backed notes absent
```

Mandatory arrival capture:

```text
destination settled
notes allowed again
```

## 29.6 Reduced motion

Capture settled representative states proving no content/function loss.

---

# 30. Final Human Homologation Checklist

Human review SHALL evaluate more than collision absence.

## 30.1 Geometry

- Are curves broad and intentional?
- Does every complex transition solve a real layout/narrative problem?
- Are there decorative loops with no purpose?
- Are any regions visually squeezed?
- Does Application terminate naturally on its branch continuation?
- Are final barlines conventional?

## 30.2 Musical readability

- Are notes restricted to visually straight shelves?
- Are there any notes inside U-turns/curves/connectors?
- Do event groups read naturally?
- Are long Professional shelves populated enough without becoming crowded?
- Are clefs correctly oriented and unmirrored?

## 30.3 Home

- Does Home communicate “Dois caminhos, uma origem”?
- Is the scenic clef dominant but not overwhelming?
- Is Application-left / Professional-right immediately legible?
- Are edge zones warm/atmospheric rather than neon?
- Does header reveal feel coherent?
- Does back-scroll return to settled Home without cinematic replay?

## 30.4 Assembly

- Does Services Assembly clarify the card experience?
- Does How It Works reuse the same grammar coherently?
- Are Assembly transitions event-free?
- Is reverse scroll equally coherent?

## 30.5 Navigation

- Does Fast Traversal feel like movement through the score rather than flashing notation?
- Do notes resume only after traversal settles/cancels?
- Is the mobile header compact and readable?
- Is the navigation sheet predictable and accessible?

## 30.6 Responsive

- Does the mobile S still read as a score?
- Are local event shelves LTR?
- Are branch terminals clear?
- Is Professional-first preserved?

## 30.7 Reduced motion

- Is functionality unchanged?
- Is nonessential cinematic motion genuinely reduced?

---

# 31. Completion Criteria

The successor OpenSpec SHALL NOT be complete until all are true:

```text
Phase-9 baseline pinned
successor geometry deltas implemented
successor geometry automatically validated
successor geometry human-approved
successor geometry refrozen
pure motion models complete
GSAP binding complete
Home Scenic Assembly complete
Structural Assembly complete
mobile serpentine integration complete
compact mobile header complete
mobile navigation sheet complete
normal draw/event/content choreography complete
Fast Traversal staff-only behavior complete
reduced-motion behavior complete
lifecycle/cleanup complete
observability/performance complete
Chromium PASS
Firefox PASS
WebKit PASS
accessibility PASS
deterministic evidence sealed
final human homologation APPROVED
canonical handoff updated
```

Automated PASS without explicit human homologation is insufficient.

---

# 32. Repository and Evidence Safety

The executor SHALL:

- preserve historical Task-34 evidence byte-identical;
- preserve accepted Phase-9 evidence as historical baseline evidence;
- create successor evidence in a separate directory;
- never overwrite sealed evidence to make a new implementation appear compatible;
- avoid broad cleanup/staging of unrelated files;
- report exact modified files at human gates;
- not commit/push/deploy unless explicitly authorized by project workflow/user;
- not deploy before final human homologation.

---

# 33. Canonical Stop Rules

The executor SHALL STOP and request a decision if:

1. adequate Professional event density requires changing Composer semantics;
2. a requested visual effect requires events inside connector/curve/Assembly;
3. geometry outside the five registered successor deltas needs modification;
4. <=18° event tangent cannot be preserved without changing scene layout;
5. motion requires per-frame DOM measurement or Projection rebuild;
6. mobile design would require vertical musical notation;
7. reduced-motion support would remove required content/functionality;
8. sealed Phase-9 evidence would need mutation;
9. a security/form contract would need weakening;
10. deterministic forward/reverse equality cannot be proven.

Acceptance criteria SHALL NOT be silently weakened.

---

# 34. Canonical Successor Workflow Summary

```text
FROZEN PHASE-9 TECHNICAL BASELINE
        ↓
BOUNDED SUCCESSOR GEOMETRY DELTAS
        ↓
HUMAN GEOMETRY APPROVAL
        ↓
GEOMETRY REFREEZE
        ↓
PROJECTION METADATA
        ↓
PURE ASSEMBLY / DRAW / REVEAL MODELS
        ↓
GSAP PRESENTATION
        ↓
FINAL HOME SCENIC ASSEMBLY
        ↓
SERVICES / HOW STRUCTURAL ASSEMBLY
        ↓
MOBILE S
        ↓
COMPACT MOBILE HEADER
        ↓
MOBILE NAVIGATION SHEET
        ↓
NORMAL SCRUB:
staff + music + content choreography
        ↓
FAST_TRAVERSAL:
staff only
        ↓
REDUCED MOTION:
same semantics, less motion
        ↓
LIFECYCLE / PERFORMANCE / A11Y HARDENING
        ↓
CROSS-BROWSER DETERMINISTIC EVIDENCE
        ↓
FINAL HUMAN HOMOLOGATION
```

---

# 35. Canonical Status at Time of Writing

```text
ASSEMBLY GRAMMAR                APPROVED
HOME SCENIC DIRECTION           APPROVED
DESKTOP ORIENTATION             APPROVED
MOBILE SERPENTINE               APPROVED
RESPONSIVE STATE MODEL          APPROVED
REDUCED MOTION                  APPROVED
SCENIC→CANONICAL HANDOFF        APPROVED
MOBILE COMPACT HEADER           APPROVED
MOBILE NAVIGATION SHEET         APPROVED
SCORE DRAW / ERASE              APPROVED
EVENT REVEAL                    APPROVED
CONTENT REVEAL                  APPROVED
FAST_TRAVERSAL STAFF-ONLY       APPROVED
LIFECYCLE / CLEANUP             APPROVED
OBSERVABILITY / PERFORMANCE     APPROVED
SUCCESSOR GEOMETRY DELTAS       APPROVED
ASM-IMP-DEC-001..007            APPROVED
FINAL HUMAN GATE                REQUIRED
```

Phase 9 is formally closed at
`306ccb74da6c7bbf8f187e360c0776c571b5fc3d`. The isolated successor OpenSpec
completed documentation-only Stage 0 on 2026-09-05; Gate 0 is PASS. Its
`stage-0-review.md` records planning verification and subsequent owner Stage-0
approval. Stage 1 has not started and requires separate explicit bounded owner
authorization. The canonical
Stage-1 Human Geometry Gate and Stage-2 refreeze remain mandatory before
Stage 3+; no technical decision in this specification is changed by this
administrative status update.
