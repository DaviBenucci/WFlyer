# W_Flyer — Post-Phase-9 Assembly, Motion, Score Refinement, and Mobile Navigation Specification

> **Current spatial authority:** ADR-057 / `ASM-IMP-DEC-020` adopts the
> [Continuous Spatial Story](../02-experience/01-global-story-architecture.md).
> It controls conflicting chapter-containment, responsive/mobile geometry,
> navigation landing and old HGA-002 spacing clauses below. Prior decision and
> geometry evidence is retained; target implementation and task 5.6 are pending.


> **Current scope authority:** ADR-053 / `ASM-IMP-DEC-017` supersedes every
> earlier active bidirectional/Application-branch clause in this document for
> the institutional website. Earlier clauses remain historical provenance. The
> current topology is `HOME / ORIGIN → PROFESSIONAL / PORTFOLIO`; Human Geometry
> Approval remains pending.

**Document ID:** `WF-ASM-MOTION-CANONICAL-001`  
**Status:** Canonical technical authority — Phase 9 closed; portfolio-only Stage-1 rebaseline authorized; Human Geometry Approval pending

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

Canonical projection/orientation modes (presentation class is distinguished
separately by ADR-055 / `ASM-IMP-DEC-018`):

- `horizontal-enhanced`;
- `vertical-wide`;
- `vertical-compact`;
- `static` for reduced-motion/failure-safe presentation as applicable.

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

The successor change MAY contain only the explicitly registered Phase-9 visual refinements defined in this document, plus the exact bounded inherited-defect exceptions in ASM-IMP-DEC-008 (Batch 1) and ASM-IMP-DEC-011 (Batch 2), and Stage-1 regression correction in ASM-IMP-DEC-009/010. ADR-048 / ASM-IMP-DEC-012 additionally authorizes only ASM-PC-001 capacity-based whole-story fallback and its bounded vertical Projects compatibility support. ADR-049 / ASM-IMP-DEC-013 separately adds only ASM-PC-002 first-horizontal-Projects-shelf full-ink repair and its minimum required entry/visit-1-to-2 continuity. ADR-050 / ASM-IMP-DEC-014 separately adds only ASM-PC-003 second-horizontal-Projects-shelf interaction clearance and its minimum necessary adjacent junctions on both sides.

This does not authorize unrelated geometry reopening.

## ASM-IMP-DEC-007 — Geometry Refreeze Before Motion

All registered successor geometry deltas SHALL be:

1. implemented;
2. automatically validated;
3. human-approved;
4. sealed as successor geometry evidence;

before scroll-driven Assembly, staff drawing, Composer-backed event reveal, or content choreography is integrated.

After this gate, geometry is frozen for the remainder of the successor change unless a new proven defect requires correction.


## ASM-IMP-DEC-008 — Registered inherited-intersection successor exception

**Owner-authorized on 2026-09-08; canonical register: ADR-044.** This is a
bounded successor correction, not Phase-9 reopening or a new layout delta.
The stronger visible-segment validator catalogued 18 CLASS C mode occurrences,
representing 14 distinct inherited staff-line intersections, in
`openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-self-intersection-review.md`
and its immutable `stage-1-self-intersection-diagnostics.json` companion
(SHA-256 `5e7eb0d1966ff6b1a6a3020e54125c788354c3437528f2ebf1db5205fb46580d`).
All 18 reproduce in Stage 0 and frozen Phase 9; none was introduced by Stage 1.

A. The global acceptance contract remains zero unresolved center-path and zero
   unresolved visible staff-line self-intersections. Validator sensitivity,
   visibility rules, and event-safe/protected-content thresholds SHALL NOT be
   weakened, disabled, hidden behind ignore lists, or restricted to changed zones.
B. Exactly `ASM-SI-001..014` are permitted inherited successor remediation
   scope for Batch 1. Static occurrences `ASM-SI-015..018` repeat `ASM-SI-004..007`
   respectively; they are not four additional redesign targets.
C. Only each registered defect's exact local envelope and the minimal adjacent
   control points/segments required to remove it while preserving continuity
   MAY change. Fix one underlying geometry family at a time; audit nearby
   unaffected geometry and run focused deterministic intersection and relevant
   event-safe/protected-content validation after each family.
D. Unaffected frozen Phase-9 geometry remains outside scope. Material changes
   beyond a registered local envelope SHALL trigger STOP and a new explicit
   dependency/scope decision before expanding the repair.
E. Phase 9 remains historically valid and CLOSED at
   `306ccb74da6c7bbf8f187e360c0776c571b5fc3d`, accepted under the validators
   and evidence available at that time. Its four seals and all 64 historical
   payloads SHALL remain byte-identical; no regeneration or rewriting of
   historical validation statements is allowed.
F. New successor evidence SHALL distinguish inherited baseline defect,
   successor repair, and final corrected state. Each distinct defect record
   SHALL retain diagnostic ID, branch/chapter/transition, all affected modes,
   segment IDs, Stage-0 and Phase-9 reproduction, center-path/staff-line/both
   type, root cause, minimal envelope, changed files/functions, nearby-geometry
   stability proof, and before/after intersection result. Preserve the original
   review and diagnostic JSON unchanged.
G. This exception does not authorize unrelated layout refinement or aesthetic
   redesign, whole-branch reshaping, restarting valid `ASM-LAYOUT-DELTA-001..005`
   work, Composer changes, Stage-3 generalized metadata, or Assembly/Motion.
H. Any newly discovered inherited defect outside these 14 and the exact six
   separately authorized in `ASM-IMP-DEC-011` SHALL trigger a new STOP,
   classification, and governance decision. The original outside-14 STOP was
   valid; `ASM-IMP-DEC-011` is the bounded decision for Batch 2 only.
   A regression introduced by an
   authorized repair SHALL be corrected within its responsible repair envelope;
   it does not authorize additional inherited geometry scope.

Registered defect mapping (original rendered-edge indices; exact full segment
IDs, spline parameters, points, and predecessor reproductions remain in the
immutable diagnostic). Every row is staff-line-only and reproduced in both
predecessors; this table records authorization, not completed repair:

| Distinct ID | Original mode occurrence(s) | Branch / destination | Staff step | Original edge pair |
|---|---|---|---:|---|
| `ASM-SI-001` | horizontal-enhanced | application / application-benefits | 0 | 713 / 720 |
| `ASM-SI-002` | horizontal-enhanced | application / application-how-it-works | 8 | 693 / 695 |
| `ASM-SI-003` | horizontal-enhanced | application / application-benefits | 8 | 724 / 727 |
| `ASM-SI-004` | vertical-wide; static `ASM-SI-015` | application / home | 0 | 189 / 194 |
| `ASM-SI-005` | vertical-wide; static `ASM-SI-016` | application / home | 2 | 191 / 193 |
| `ASM-SI-006` | vertical-wide; static `ASM-SI-017` | professional / professional-about | 6 | 214 / 218 |
| `ASM-SI-007` | vertical-wide; static `ASM-SI-018` | professional / professional-about | 8 | 214 / 218 |
| `ASM-SI-008` | vertical-compact | application / home | 0 | 156 / 158 |
| `ASM-SI-009` | vertical-compact | application / home | 0 | 190 / 194 |
| `ASM-SI-010` | vertical-compact | professional / professional-about | 0 | 177 / 180 |
| `ASM-SI-011` | vertical-compact | professional / professional-about | 0 | 210 / 217 |
| `ASM-SI-012` | vertical-compact | professional / professional-about | 2 | 211 / 214 |
| `ASM-SI-013` | vertical-compact | professional / professional-about | 6 | 213 / 223 |
| `ASM-SI-014` | vertical-compact | professional / professional-about | 8 | 212 / 226 |

Original counts remain horizontal 3, vertical-wide 4, vertical-compact 7,
static 4. The original focused run was 9 passes / 4 failures; these are
pre-repair diagnostic facts, not final validation. All four semantic modes
SHALL be evaluated after repair without browser-dimension special cases that
lack an existing architectural mode boundary.

Composer fingerprints remain Professional `fnv1a32:039bce10` and Application
`fnv1a32:1fe3356b`; order, rhythm, motifs, stems, flags, beams, tuplets,
accidentals, ledger/key-signature semantics, clef orientation, and final
barlines remain fixed. Complete Composer-event footprints plus
`1.5 × staffSpace` side margins SHALL remain locally LTR, tangent ≤18°,
variation ≤6°, without reversal or connector/curve/Assembly overlap, and with
clef/key-signature exclusions preserved.

## ASM-IMP-DEC-009 — Stage-1 hydration equality and execution order

**Owner-authorized on 2026-09-08; canonical register: ADR-045.** The reported
`StoryScoreLayer` `data-score-event-safety` mismatch is an authorized Stage-1
regression. Required invariant: `SSR output == first client render output`
for all hydration-visible attributes and DOM structure; representative runtime
acceptance additionally requires `hydration warnings = 0`.

Before modifying behavior, parse server and FIRST-client-render event-safety
payloads, report the first divergent semantic property with its complete object
path, and trace its owner. Final post-effect DOM alone is insufficient. Audit
window/document/media queries, viewport/DOM measurements and ResizeObserver,
client mode selection, mutable module/session/runtime state, time/randomness,
Map/Set/object iteration, sorting, and numeric serialization. A dev-server
stale indicator is not a demonstrated root cause.

Composer remains semantic-only, Projection deterministic geometry,
StoryScoreLayer rendering-only, and the existing lifecycle/readiness owner
controls post-hydration responsive reprojection. Server and client first render
SHALL use the same deterministic initial projection; actual viewport/DOM data
MAY update it only after hydration/readiness. Diagnostic-only metadata MAY be
omitted or use a deterministic baseline on both initial renders and attached
later if its post-hydration testing/capture role is retained and its diagnostic
ownership is established. Semantic-equal serialization may be canonicalized;
geometry SHALL NOT be rounded to conceal a semantic difference.

No suppressHydrationWarning, blanket client-only rendering, major-surface SSR
disabling, diagnostic deletion without proof, browser suppression, weaker
hydration tests, extra animation/state machine, or responsive architecture
replacement is permitted. STOP if a fix requires Composer changes, generalized
Stage-3 metadata, new motion ownership, major-surface SSR removal, or changing
the canonical responsive architecture.

Required Stage-1 continuation order:

1. Normalize ADR-044/045 and these decisions across governance/OpenSpec; pass
   strict OpenSpec, applicable structured-document checks, and git diff --check.
2. Diagnose the exact first-render hydration divergence and its owner.
3. Implement the minimal hydration-safe correction.
4. Pass focused hydration plus projection/event-safety regression, including
   identical SSR/initial metadata, zero hydration warnings, working responsive
   reprojection, unchanged fingerprints, and event-safe semantics.
5. Repair the registered inherited intersections by underlying geometry family,
   preserving valid partial five-delta work and recording local proof per family.
6. Pass final deterministic global geometry/event-safe/responsive validation:
   zero unresolved center-path and visible staff-line intersections.
7. Run final Chromium, Firefox, and WebKit matrix with workers=1/retries=0 where
   applicable; do not repeat the full matrix during local iteration.
8. Create and inspect successor-only evidence, including all 14 Batch-1 IDs /
   18 original mode occurrences and the six Batch-2 IDs / eight viewport
   occurrences under `ASM-IMP-DEC-011`, reproduction/repair mapping, and final
   global counts.
9. Present the exact candidate for Human Geometry Approval and STOP awaiting
   the explicit human decision. Do not mark approval complete automatically.

Final captures SHALL include Home origin, Home Application entry, Home
Professional entry, How→Benefits, Benefits→Demo, Demo→Launch, Application
terminal, representative Professional EVENT_SAFE_STRAIGHT utilization,
Projects topology, and responsive/mobile geometry. No final visual evidence
may be generated while hydration mismatch remains. Stage 2+ stays unstarted
and unauthorized; no Assembly/Motion implementation, commit, push, or deploy.

---

## ASM-IMP-DEC-010 — Stage-1 canonical numerical output and internal telemetry

**Owner-authorized on 2026-09-09; canonical register: ADR-046.** This focused
successor decision resolves numerical-only H2 without discarding the valid
prior stop or weakening `ASM-IMP-DEC-009`. The audited first divergence is
`Math.hypot` for identical path-sample deltas; accumulated arc distance later
changes exact-number `Set` deduplication and internal search count. Semantic
allocation is identical, and the observed raw event-center differences do not
change the existing six-decimal rendered coordinates. The complete four-engine
trace and checkpoint belong in `stage-1-progress.md` and successor diagnostics.

### A. Equality domains and canonical outputs

For equivalent composition and Projection inputs, Node/SSR, Chromium, Firefox,
and WebKit SHALL agree as follows:

| Domain | Required equality |
|---|---|
| Composer groups, IDs, order, source/destination mappings, accepted/rejected groups | Exact semantic equality, including fingerprints `fnv1a32:039bce10` and `fnv1a32:1fe3356b` |
| Shelf/zone IDs, safe-interval identity, classifications, topology, final barline semantics, clef/key-signature exclusions | Exact identity, ordering, and decisions |
| Final event centers and rendered primitive coordinates, dimensions, and rotations | Exact canonical serialized strings after full-precision geometry evaluation |
| Canonical event-safety and Home-entry numerical metadata | Exact canonical six-decimal numerical representation with unchanged structural/semantic fields |
| Semantic counters such as event counts, forbidden-event counts, shelf indices, and semantic indices | Exact integer equality; no telemetry exemption |
| Internal search-effort `candidateCount` | Exact integer within its engine-specific diagnostic record; cross-engine equality is not required |

Canonical outputs are the presentation representation of final Projection
geometry consumed by the existing score renderer, hydration attributes, and
cross-engine geometry tests/evidence. Internal path samples, accumulated
distances, candidate centers/costs, raw path parameters, and trial counts retain
their full-precision algorithmic role. Their IEEE values need not be identical
only when exact semantic and canonical-output equality above is proven. Raw
engine-specific values remain available as explicitly identified diagnostics;
they are not replaced by rounded evidence of safety.

### B. Existing presentation precision, applied after safety

Retain the established six-decimal SVG presentation boundary documented by the
immutable Task-33 refinement evidence and implemented by
`src/components/score/svg-number.ts`. `SCORE_REVIEW_SVG_PRECISION=6` and
`serializeSvgNumber(value, SCORE_REVIEW_SVG_PRECISION)` own the canonical
coordinate text, including trailing-zero removal and normalization of negative
zero. Canonical numerical JSON metadata uses the same serialized value as a
number; do not scatter independent precision literals or add an allocator
rounding rule. Existing unrelated presentation formats remain unchanged.

For physical score coordinates this is a `1e-6` score-unit presentation grid
(approximately CSS pixels in the established projection), with rounding error
at most approximately `0.5e-6` units per scalar. It is materially below the
`1.5 × staffSpace` margins and visible pixel scale; `1e-6` degree metadata is
materially below the unchanged 18° tangent and 6° variation limits. This is
an output representation, not an acceptance tolerance. The allocator's
existing `EPSILON=1e-7` is a distinct internal comparison guard, remains
unchanged, and is smaller than the presentation grid.

Full event-ink bounds including strokes, accidental/stem/beam/ledger/tuplet
footprints, conservative renderer padding, margins, tangent magnitude and
variation, local LTR/no reversal, forbidden intervals, structural exclusions,
group order, candidate validity, and selection SHALL use full internal
precision before canonical serialization. Normalized `t` fields in metadata
are descriptive text only: never reconstruct a point, define candidate
uniqueness, or evaluate safety from rounded `t`. Canonical event-center
comparison evaluates the full-precision point first and then serializes its
physical x/y coordinates. Exact canonical-string equality is required; this
decision grants no approximate-equality fallback when strings differ.

### C. D1/D2 audit and selected D3 correction

D1 is already implemented in the candidate grid as
`start + (end - start) * index / steps`; candidate iteration does not accumulate
an increment. The observed discrepancy originates earlier in path-distance
calculation. D2 is not applied: a six-decimal candidate key has no established
proof that it cannot merge distinct valid trial positions or change selection
near a safety/cost boundary. This decision authorizes no change to allocator
math, candidate generation, exact-number deduplication, sorting, or tie rules.

D3 is selected because `candidateCount` counts attempted internal trials across
both search passes, including rejected trials, and does not feed allocation,
acceptance, ordering, topology, or safety. Exclude only this field from
`data-score-event-safety` on server, first client render, and subsequent
canonical markup. Preserve it in pure Projection diagnostics, focused tests,
and successor evidence. A separate diagnostic attribute MAY expose its actual
value after hydration through the existing `ScoreLayerState` readiness
lifecycle; server and first-client render SHALL both omit that attribute.
Retain post-hydration tooling access without adding a lifecycle state machine,
per-frame telemetry, generalized Stage-3 metadata, or motion ownership.

### D. Validation and stop boundary

After strict successor/workspace OpenSpec, applicable structured-document, and
diff checks PASS, implement only the presentation/diagnostic separation. Prove
the table's equality domains across all four engines with equivalent inputs;
record raw maximum coordinate deltas and engine-specific candidate counts
separately. Prove `data-score-event-safety` SSR/first-client equality, all
hydration-visible attribute equality, zero hydration warnings and relevant page
errors, working responsive reprojection, unchanged Composer fingerprints, and
all full-precision event-safe checks. No warning suppression, SSR removal,
arbitrary delay, browser-specific suppression, or weakened test is permitted.

STOP for any semantic destination/order/acceptance change, classification or
safety-boundary change, Composer fingerprint change, distinct-valid-candidate
merge, canonical rendered-coordinate mismatch, or material Projection
redesign. Do not round an unsafe candidate into acceptance. Once the focused
checkpoint passes and is recorded, resume the exact 14 Batch-1 inherited repairs
and only the separately authorized six Batch-2 repairs in `ASM-IMP-DEC-011`,
global validation, five-delta completion, responsive/final browser matrix,
successor evidence, and Human Geometry Approval stop under `ASM-IMP-DEC-009`.
Phase 9 and its evidence stay immutable; Stage 2+ remains unstarted and no
Assembly/Motion, commit, push, or deploy is authorized.

---

## ASM-IMP-DEC-011 — Bounded Batch-2 inherited-defect authorization

**Owner-authorized on 2026-09-09; canonical register: ADR-047.** The real-DOM
matrix exposed six additional inherited defects after Batch-1 correction.
The outside-14 STOP required by `ASM-IMP-DEC-008` was correctly triggered.
This decision resolves only that exact scope conflict and does not reopen
Phase 9 or create a general inherited-defect repair policy.

The authoritative supplemental inventory is
`openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-batch-2-inherited-defect-review.md`
and its `stage-1-batch-2-inherited-defect-diagnostics.json` companion. Both
preserve current visible segments, exact inputs, coordinates, and Stage-0 /
frozen Phase-9 reproduction, with explicit limits on isolated branch replay.
All entries are CLASS-C, staff-line-only, horizontal-enhanced defects.

| Distinct Batch-2 ID | Branch / exact transition envelope | Viewport occurrences | Staff step | Current edge pair |
|---|---|---|---:|---|
| `ASM-SI-019` | Application Demo→Launch; `connector:5` / `application-access` | 1440x900; 1536x900; 1920x917 | 0 | 886/889; 887/890; 887/890 respectively |
| `ASM-SI-020` | Professional Home→About first fold; `connector:1` | 1100x640 | 0 | 102/106 |
| `ASM-SI-021` | Professional Home→About arrival fold; `connector:1` | 1100x640 | 8 | 134/138 |
| `ASM-SI-022` | Professional Services interaction lead-out; `connector:3` | 1100x640 | 0 | 495/499 |
| `ASM-SI-023` | Professional Services `connector:3` → `notation:professional-services:4` | 1100x640 | 8 | 498/508 |
| `ASM-SI-024` | Professional `notation:professional-services:4` → Process `connector:4` | 1100x640 | 0 | 510/523 |

A. Global acceptance remains **ZERO GLOBAL SELF-INTERSECTIONS**: zero center
   path and zero visible five-line staff crossings, not merely zero crossings
   introduced by Stage 1. Keep complete visible-segment coverage, cross-run
   comparisons, sampling, visibility, numerical guards, event-safe and
   protected-content thresholds enabled and unchanged. No ignore list,
   changed-zone filter, hidden crossing, or weaker validator is permitted.
B. Authorize exactly `ASM-SI-019..024`: six underlying defects and eight
   viewport occurrences. The three `019` manifestations share one local
   Demo→Launch defect and do not create separate redesign targets. Only each
   exact registered defect envelope and minimum adjacent control points or
   segments necessary to remove the crossing while preserving continuity MAY
   change. Verify unaffected nearby geometry after each owner/family repair.
C. `ASM-IMP-DEC-008` / ADR-044 remains valid for the original 14 repairs;
   preserve their implementation, original 18-occurrence mapping, review and
   diagnostic JSON. The completed ADR-046 / `ASM-IMP-DEC-010` hydration and
   numerical-determinism solution remains valid and SHALL NOT be restarted
   or redesigned. Composer fingerprints, allocation semantics, full-precision
   safety, approved glyphs/calibration, content and final barlines remain fixed.
D. This exception does not authorize broad Phase-9 geometry reopening,
   aesthetic redesign, unrelated branch reshaping, Composer changes,
   generalized Stage-3 metadata, Assembly/Motion, or restarting valid five-delta
   work. A necessary material expansion beyond the registered local envelope
   SHALL trigger STOP before implementing it.
E. Phase 9 remains CLOSED and historically valid at
   `306ccb74da6c7bbf8f187e360c0776c571b5fc3d`, accepted under its contemporary
   validator/evidence. All four historical seals and all 64 payloads SHALL
   remain byte-identical. No regenerated evidence or rewritten historical
   claim may imply these defects were known at Phase-9 acceptance.
F. Successor evidence SHALL distinguish inherited baseline defect, successor
   local correction, and final clean geometry for each batch. Retain stable
   IDs and occurrence mapping, both predecessor proofs, precise changed
   owners/envelopes, nearby stability, and before/after global validation.
   The supplement is diagnostic registration, not final geometry evidence.
G. Any further newly discovered inherited defect outside Batch 1
   (`ASM-SI-001..014`, static aliases `015..018`) and exactly Batch 2
   (`ASM-SI-019..024`) SHALL trigger another explicit STOP and governance
   decision. Regressions caused by an authorized local repair must be corrected
   within its responsible envelope without expanding inherited scope.
H. The current governance-only run SHALL stop immediately after inventory,
   predecessor verification, canonical normalization, strict successor and
   workspace OpenSpec, structured-document and diff checks, and historical
   integrity all pass. No Batch-2 runtime/test/capture behavior repair, final
   browser matrix, or final evidence belongs to this run. The separate High
   continuation starts with focused `019` measured-input regression fixtures
   and local repair, then `020..024`; final browser validation is allowed only
   after deterministic geometry is globally clean. Stage 1 then completes
   successor evidence and stops at explicit Human Geometry Approval.
   Stage 2+, refreeze, motion, commit, push, and deploy remain unauthorized.

This decision marks no repair or human-approval task complete. Stage-1 task 2.7
remains blocking until both batches and all global acceptance checks pass.

---

## ASM-IMP-DEC-012 — Projects capacity gates whole-story enhancement

**APPROVED by explicit owner architecture decision on 2026-09-09; ADR-048.**
Normalization continued on 2026-09-10 under the owner’s vertical-support continuation.
This successor-only decision resolves the recorded Projects capacity STOP.
It adds no general inherited-defect exception and does not reopen Phase 9.
Prior dated ASM-IMP-DEC-008..011 STOP clauses remain valid for their checkpoints;
this decision adds only the named ASM-PC-001 exception. The later owner decision
ASM-IMP-DEC-013 separately adds ASM-PC-002; all other unregistered defects still STOP.

### A. Registered root and lineage

Register **ASM-PC-001**, PROJECTS-P3, one inherited Projects capacity defect,
with **ASM-PC-001-O01/O02/O03** for visits 1/2/3 at 1100x640 horizontal-enhanced.
The immutable `stage-1-projects-lineage-and-capacity-review.md` and companion
JSON in the active change contain the actual input and proof. Full current,
Stage-0 `40e6ae1a8996c53ed2ec372c47f16bc073d6cee9` and frozen Phase-9
`306ccb74da6c7bbf8f187e360c0776c571b5fc3d` constructors reproduce the same
Projects geometry on that DOM-derived input; this is not historical fresh-DOM
rendering. `horizontalChapterShelves` / `professional-projects` caps anchors
at `min(height - 7*staffSpace, cardBottom + 3.5*staffSpace)`: 556px with
staffSpace 12. Available bands 30.92/42.17/30.92px cannot contain the required
60.72px horizontal staff-plus-clearance band, before event ink. The proof is
complete and SHALL NOT be repeated as a repair investigation.

### B. Approved responsive policy

The owner selects **capacity-based responsive fallback**, not fan repositioning.
`horizontal-enhanced` requires BOTH existing coarse eligibility AND a complete
PASS for the candidate horizontal Projects presentation. Insufficient capacity
selects the existing compatible vertical mode for the **whole story**, normally
`vertical-wide`; reduced motion remains `static`, compact remains
`vertical-compact`, and coarse/touch input retains its existing compatible mode.
No horizontal→vertical Projects island→horizontal coordinate switch is allowed.
1100x640 is a negative fixture, never a viewport exception. No arbitrary new
height cutoff, device table or change to coarse calibration may replace capacity.

### C. One policy owner and one geometry owner

- `src/lib/story/motion/eligibility.ts:resolveStoryProjectionMode` owns the final
  responsive policy; expose/reuse its coarse decision independently of capacity.
- `src/lib/story/motion/runtime.ts` owns evaluation scheduling and committed
  mode/driver lifetime through `buildOwnedDriver` and
  `rebuildPreservingActiveChapter`. The positioning adapter and
  `src/lib/story/motion/geometry.ts` own semantic/native-scroll mapping.
- `src/lib/story/score/projection.ts` remains the single path/zone/ink authority.
  A focused pure `src/lib/story/score/projects-capacity.ts` MAY evaluate its
  candidate output using existing geometry/footprint math. It never selects a
  mode, reads DOM, imports runtime policy as a value, or recreates composition.
- The existing `src/components/story-score/measurement.ts` normalization and
  `StoryScoreLayer.tsx:measureScoreScenes` collection SHALL share a bounded
  measurement bridge injected by `MotionStoryLab.tsx` into runtime options
  (no lib/runtime import of React components). A focused component-side candidate
  measurement module MAY be added; there is no generalized layout solver.

### D. Candidate-horizontal input/output

The pure capacity input is an immutable snapshot: candidate viewport/layout
frame; normalized scene measurements; raw protected rectangles and coordinate
transform/scale; three Projects card identities and production idle/hover/focus/
touch-equivalent envelopes; measured clip bounds; stable font/intrinsic-layout
revision; and candidate Projection output from the existing seed/composition.
All acceptance distances are physical CSS pixels. Full-precision safety runs
before presentation rounding; two-decimal measurement normalization and
six-decimal canonical serialization retain their established distinct roles.

Output is a deterministic result with input signature, per-visit measurements,
limiting constraints and status **PASS / INSUFFICIENT_CAPACITY / NOT_READY /
INVALID**. PASS requires all three recognizable visits, unchanged content/card
sizes, five visible staff lines, >=12px protected-content clearance including
stroke, complete event/ledger/stem/notehead ink, event-safe LTR shelves (<=18°,
variation <=6°, retained margins), event-free valleys/entry/exit, unclipped idle/
hover/focus and touch-equivalent interaction, Projects NON-ASSEMBLY, unchanged
Composer fingerprints, and zero global center/staff self-intersections.
A cheap necessary-space rejection MAY short-circuit INSUFFICIENT_CAPACITY;
its converse SHALL NOT manufacture PASS. Missing measurements are NOT_READY,
never an optimistic PASS. Non-finite/inconsistent inputs or unrelated geometry
violations are INVALID: enhancement remains ineligible and the diagnostic
triggers STOP; vertical fallback cannot conceal a new unregistered defect.

### E. Independent candidate measurement, not mode feedback

Evaluate "would the horizontal candidate satisfy the contract for these stable
inputs?", never "does the current vertical DOM have spare room?". Use a scoped,
temporary, inert, accessibility-hidden, nonpainted candidate layout host during
build/rebuild. It reuses actual story content, production horizontal CSS and
root/stage/track/chapter sizing, independent of the committed mode. Do not
publish a horizontal mode merely to measure it. Do not use fallback card bounds,
hand-authored substitute card sizes or a second authored geometry source.
The host must be measurable (not display:none), isolated from global selectors,
without duplicate actionable IDs, interaction, form submission, navigation,
script/component effects, media loads or additional live score/runtime owners.
Discard it after the transaction, including abort/failure/unmount.

Idle and selected/focus/touch-equivalent bounds SHALL use the same production
state styles or shared transform/outline parameters. A probe selector alias MAY
be added in `project-cards.module.css`; it must not change visible fan behavior.
Never focus the hidden host or duplicate hover math as a second policy. Where
interaction transitions can exceed endpoint envelopes, use the existing style
parameters to bound the whole transition conservatively at build time; do not
sample animation frames during ordinary user interaction. Candidate/live
measurement equivalence is a required focused test at capable layouts.

### F. Hydration, lifecycle and anti-oscillation

SSR and FIRST client render retain the existing deterministic static baseline,
initial omission of candidateCount, seed and canonical metadata. No new DOM
read or capacity-dependent branch occurs during either render. After hydration,
existing font/fallback readiness and positioning/build transaction runs the
candidate before enhanced driver activation and destination reveal. Current
synchronous useGSAP runtime mount must not bypass that readiness; it starts
unresolved/static-compatible without remounting the bootstrap. NOT_READY retains compatible
readable vertical behavior until the existing readiness completion/failure path;
no new indefinite loading gate, hydration suppression or client-only surface.

The runtime assigns one generation to a coalesced material resize, relevant
media change, or settled external font/content/intrinsic-layout change. Input
identity includes normalized dimensions/signals and external layout revision;
capacity result additionally identifies the measured candidate signature.
Only the latest generation may commit; newer invalidation cancels/discards old
measurement, delayed callbacks and driver work. Publish at most one final mode
per settled generation; equal inputs reuse the same decision. Probe mutations,
committed mode attributes, fallback dimensions and mode-induced ResizeObserver
notifications SHALL NOT create a new eligibility generation. External content
size changes remain observable and coalesce into one real invalidation.
No per-frame, scroll-event, ordinary scrub, or React-frame-clock evaluation.
All observers, hosts, timers, pending generations and drivers have one cleanup
owner; focus/hover state changes use the prevalidated envelope, not remeasurement.

### G. Resize semantic preservation

Before teardown, capture current branch, chapter, Projects projectIndex where
applicable, and chapter/visit-local narrative fraction from the old mode; preserve seed, Composer output/version and event
order. Extend existing `geometry.ts`/positioning mapping only as necessary:
map the same viewport focal point through the chapter's interval, account for
opposite Application horizontal direction, and restore the fraction into the
new mode's native-scroll interval (clamp only at physical document limits).
Map Projects by stable projectIndex 1/2/3 across fan and vertical sequence.
If a sub-visit fraction cannot map into a valid target interval, use that same
visit’s safe anchor. For a transition use the nearest bracketing semantic
visit, ties resolving to lower projectIndex; record this settlement. No
per-pixel identity is required. Capturing only a chapter then resetting to
its center/top is insufficient.
A newer explicit navigation request supersedes stale preservation. No reset to
Home, Home/Assembly replay, bootstrap remount, composition regeneration, new
scroll owner or scroll-jacking. Both directions require one settled transition
and no mode alternation for unchanged external input.

### H. Bounded vertical compatibility, with no acceptance exemption

The existing vertical renderer currently has one generic Projects notation
range and its audit returns no horizontal anchors. That behavior is a migration
baseline, not proof of this fallback contract. The owner's required three visits
and clearance authorize only the supporting **Projects-local** adaptation of
vertical measurement and Projection needed by the whole-story fallback.

Collect actual Projects card/interaction bounds in vertical mode too, convert
DOM/track coordinates explicitly into that mode's SVG space and retain relevant
measurement signatures in its Projection cache key (not the old ':vertical'
constant). Prefer a local adapter in `projection.ts:verticalGeometry` after
obtaining the unchanged Organic Flowing base. Existing
`AuthoredTrackGeometry.notationRanges` supports multiple ranges per chapter,
explicit semanticSlotIds and projectVisit; `buildZones` already creates
event-free gaps and propagates visits. Reuse these structures and
`ScorePathReviewProjectVisit` with explicit selected-mode coordinates. A small
optional mode/transform field may disambiguate them, without a generic schema.
Only a required shared type/facility extension may touch `organic-flowing.ts`;
do not rewrite its generic builder. Represent visit 1 safe shelf → event-free
transition → visit 2 safe shelf → event-free transition → visit 3 safe shelf
→ continuation within the current
Projects chapter interval, plus minimum adjacent Process/Contact join support.
This support is an implementation dependency of the approved fallback, not
a second inherited defect or desktop fan pixel identity. Keep the first
visit’s existing primary event/full ink on visit 1 and retain the reserved/
empty assignments of visits 2/3. All three safe regions exist even when
visits 2/3 contain zero events; do not synthesize or duplicate music.
Retain existing groups/order, current cards/content/section dimensions, locally
horizontal or gentle LTR notation, event-free turns and final continuity. This
is no fan redesign, generic vertical rewrite, motion, or Stage-3 metadata system.
Mode-local visit records are bounded geometry/acceptance data, not fabricated
horizontal anchors. Preserve untouched chapter/control geometry and all batches.

The vertical audit SHALL verify three recognizable visits, >=12px actual
clearance, complete visible staff/ink and interaction accessibility. A vertical
`visits:[]` early return, merely counting three cards, or skipping the horizontal
assertions is not equivalent coverage. "Visible" in a vertical document means
unclipped when each visit is scrolled into view, not all chapters simultaneously
on screen. If the required adaptation cannot fit this bounded interval/joins
without changing card/section dimensions, unrelated geometry, event semantics
or acceptance, STOP for a further decision; do not enlarge scope automatically.

### I. Acceptance and evidence

A. Saved ASM-PC-001 1100x640 input fails horizontal capacity and selects
vertical-wide for the whole story; all three vertical visits pass unchanged
clearance/ink/visibility/interaction/global geometry checks.
B. As explicitly amended by the 2026-09-10 owner decision ADR-049 /
ASM-IMP-DEC-013, the saved 1440x900, 1536x900 and 1920x917 inputs are proven
first-visit full-ink failures, not positive horizontal-capacity fixtures.
Retain those failing baselines. A corrected candidate at any of these dimensions
becomes positive only after the complete actual ink/interaction predicate
passes; historical acceptance or width/height alone cannot qualify it.
At least one appropriate corrected horizontal candidate from these three
viewport occurrences must pass the complete contract and remain enhanced within
the separately named ASM-IMP-DEC-013 + 014 repair envelopes, as reconciled
by ADR-050 / 014(C); if none can pass, STOP. This does not broaden 013(B).
Earlier Chromium passes remain historical evidence with their original scope.
C/D. Capable→insufficient and insufficient→capable resize preserve non-Home
chapter/branch/fraction/seed/composition and commit once without oscillation.
E. SSR/first-client equality and clean hydration persist; stale generation,
probe cleanup, unmount, delayed-font readiness and denied enhancement are tested.
Test predicate boundaries by varying measured card/ink capacity at the SAME
viewport; dimension equality alone must never determine the result.

Keep complete visible-segment/cross-run validation, 2049-point center replay,
1025-point staff input and existing 1e-7 guards. Preserve all 14 Batch-1 repairs,
six Batch-2 repairs, original diagnostic mappings and ADR-046 hydration/numeric
boundary. Focused cases and deterministic global geometry must pass before a
fresh serial Chromium/Firefox/WebKit matrix (workers=1, retries=0). Rerun the
previous 132-test scope against one clean candidate, replacing obsolete
1100x640 enhanced-mode expectations only with stronger fallback coverage and
retaining the pure horizontal Batch-2 fixture. Do not resume from test 5 and
reuse prior passes across the changed implementation. Add the focused transition/
capacity cases to the final browser coverage and inspect successor evidence.
Record before/inherited horizontal failure, predicate/fallback correction and
final accepted mode/geometry for ASM-PC-001 and all three occurrence IDs.

### J. Scope, history and stop

This adds exactly ASM-PC-001 capacity fallback and its mandatory local vertical
compatibility/measurement/lifecycle support, not "Batch 3" or a general capacity
framework. The later ASM-IMP-DEC-013 and 014 register distinct first-visit
full-ink and second-visit interaction defects respectively; neither changes
ASM-PC-001 or its approved fallback/support boundary. Current Ultra work normalizes documents only and stops as soon as
strict successor/workspace, structured/YAML, diff and historical integrity pass.
Implementation belongs to a separate High run. Further unregistered defects,
material expansion, geometry/semantic/validator changes outside this decision,
or inability to preserve the contracts require STOP and architecture review.
Phase 9 remains accepted under contemporary evidence; its four seals and 64
payloads remain immutable. No repair/approval checkbox is completed here.
Human Geometry Approval blocks Stage 2/refreeze and all later stages. No
successor motion, commit, push, deploy, archive or public cutover is authorized.

---

## ASM-IMP-DEC-013 — First Projects shelf reserves complete rendered ink

**APPROVED by explicit owner decision on 2026-09-10; ADR-049.**
This adds one distinct named inherited defect and its bounded local repair.
It does not expand or merge ASM-PC-001, reopen Phase 9, or create a general
Projects repair authorization. Prior dated STOPs remain truthful historical
checkpoints; current Stage-1 scope includes this specific additional exception.

### A. Identity, occurrences and retained proof

Register **ASM-PC-002**, alias `PROJECTS-FIRST-EVENT-INK-CLEARANCE`, for
`professional-projects:primary:note:0` on horizontal Projects visit 1.

| Occurrence | Saved viewport | Notehead-envelope clearance (CSS px) | Ledger clearance with stroke (CSS px) |
| --- | --- | ---: | ---: |
| ASM-PC-002-O01 | 1440x900 | 1.0290065434475082 | 5.919519992479309 |
| ASM-PC-002-O02 | 1536x900 | 1.0284733524625835 | 5.918756994098771 |
| ASM-PC-002-O03 | 1920x917 | 1.0275674524551732 | 5.917460345319682 |

These are three currently proven occurrences of one inherited TOO_CLOSE root,
not three defects or overlap. The required clearance remains 12 physical CSS
pixels. The immutable active-change `stage-1-projects-full-ink-stop.md` and
`stage-1-projects-full-ink-stop-diagnostics.json` hold the inputs, independent
ledger/stroke arithmetic and current Chromium DOM corroboration at 1536x900.
Original Stage-0 and frozen Phase-9 **Professional branch constructors** on
those saved inputs reproduce identical event primitives. Historical evidence
is branch-only, not fresh historical DOM or full historical aggregate PASS;
the unrelated failed aggregate attempt remains recorded. Do not repeat the
completed inheritance investigation or mutate any baseline diagnostic/fixture.

The owner is `projection.ts:horizontalChapterShelves`, professional-projects.
The uncapped cardBottom + 3.5*staffSpace (+42px at staffSpace 12) reservation
leaves insufficient space for the first event's full ink. This differs from
ASM-PC-001's capped 1100x640 three-visit capacity failure and its approved
whole-story fallback under ASM-IMP-DEC-012, which remains unchanged.

### B. Exact future implementation envelope

Only the **first horizontal Projects notation shelf** and the **minimum entry/
continuity geometry necessary to preserve Projects visit 1 to visit 2** may
change. Projection remains the single geometry owner; use the existing
complete rendered musical footprint math and actual required production
idle/hover/focus/touch-equivalent interaction envelopes from the
ASM-IMP-DEC-012 measurement contract. Derive reservation from those bounds
plus the unchanged 12px physical clearance, accounting for stroke, coordinate
scale and clipping. The complete post-repair candidate must be evaluated.

No fixed-pixel increment intended only for the three viewport dimensions,
viewport-specific branch, arbitrary capacity cutoff, card/fan repositioning,
card/section dimension change, broad Projects fan redesign or new layout
solver is permitted. A shared valley-rule change that propagates into later
visits/chapters is outside scope unless each changed control is proven to be
the minimum continuity necessary under this exact first-visit envelope.
Preserve visits 2 and 3 shelves except that minimum proven necessary continuity;
freeze unrelated geometry and keep their existing reserved/empty event slots.
Do not move the primary event to another visit, hide/delete ink, alter glyphs,
recompose music or change event order to manufacture capacity.

### C. Capacity qualification and required proof

This decision explicitly amends only the old positive-fixture assumption in
ASM-IMP-DEC-012(I.B). The existing 1440x900, 1536x900 and 1920x917 fixtures
are full-ink negative baselines. They SHALL NOT be forced to PASS or relabeled
positive because they were historically accepted. At these dimensions a
corrected horizontal candidate is positive only after the **complete** actual
capacity predicate in ASM-IMP-DEC-012(D) passes, including production interaction
envelopes, all three visits, full visible ink/staff and global geometry.
An observed idle failure remains sufficient rejection even if other interaction
measurements are missing; NOT_READY does not negate that measured failure.

Require per-occurrence before/repair/final results for ASM-PC-002-O01..O03,
separate from ASM-PC-001-O01..O03. Preserve the immutable saved raw inputs and
use distinct corrected-candidate results; do not change old data to fit a test.
Test capacity changes at the same viewport and changed ink/interaction bounds,
so positive mode follows actual capacity. Preserve meaningful insufficient/
NOT_READY/INVALID coverage. ASM-PC-001 capacity-based whole-story fallback and
all existing eligibility/readiness/lifecycle contracts remain mandatory.
At least one appropriate corrected horizontal candidate at the three registered
viewport occurrences must satisfy the complete contract within the separately
named 013 + 014 local envelopes, under ADR-050 / 014(C). This qualification
cross-reference does not expand this decision's first-shelf boundary in B.
If none can pass, **STOP for another owner decision**; do not expand geometry, weaken acceptance or use universal fallback
to claim the authorized repair is complete.

Focused repair tests must prove first-shelf clearance, entry/visit1-to-2
continuity, unchanged geometry outside the exact envelope, all three visits
and Composer fingerprints. Keep global visible-segment/cross-run validation,
2049-point center replay, 1025-point staff input and existing 1e-7 guards
fully enabled. No selective segment omission or test relaxation. Focused and
complete deterministic geometry must be clean before the fresh serial browser
matrix specified in ASM-IMP-DEC-012(I), with new full-ink/capacity cases and no
reuse of prechange browser passes. Only then produce successor Stage-1 evidence.

### D. Preserved authority and Ultra stop

Preserve the five existing deltas, 14 Batch-1 repairs and original 18-occurrence
mapping, all six Batch-2 repairs/eight occurrences, ADR-046 hydration/numeric
determinism, Composer semantics/seed/fingerprints, approved glyphs, three
Projects visits, card dimensions/content/fan interaction, NON-ASSEMBLY,
12px physical clearance, complete visible staff/event ink and global zero
self-intersections. Phase 9 remains historically valid; all four seal pairs,
64 payloads and earlier successor diagnostic records remain immutable.

Owner approval authorizes **no implementation during this Ultra run**.
Normalize only required canonical/OpenSpec contracts; validate strict successor
and workspace OpenSpec, affected structured/YAML documentation, git diff --check
and historical/worktree integrity, then STOP with the bounded Astra High
handoff. Preserve the partial unintegrated projects-capacity.ts evaluator,
its focused test and negative fixture. Complete no repair or human checkbox.
New unregistered defects, need for a larger envelope or any invariant conflict
require STOP; model escalation supplies no additional permission. Human Geometry
Approval remains pending at 7/92. No final matrix/captures in Ultra, Stage 2+,
refreeze, motion, commit, push, deploy, archive or public cutover.

---

## ASM-IMP-DEC-014 — Second Projects shelf reserves the complete focus envelope

**APPROVED by explicit owner decision on 2026-09-11; ADR-050.** This adds
exactly one distinct inherited defect and its local correction authority.
ASM-PC-001 / 012 and ASM-PC-002 / 013 remain distinct and valid. In particular,
013 never authorized visit 2's own shelf through an assumed continuity need.

### A. Identity and immutable lineage

Register **ASM-PC-003**, alias `PROJECTS-VISIT-2-FOCUS-CLEARANCE`, on the
second horizontal Projects notation shelf (`professional-projects:reserved`).

| Occurrence | Viewport | Current Chromium focus-start clearance (physical CSS px) |
| --- | --- | ---: |
| ASM-PC-003-O01 | 1440x900 | 9.134092525156348 |
| ASM-PC-003-O02 | 1536x900 | 9.138670081197802 |
| ASM-PC-003-O03 | 1920x917 | 9.142343177774706 |

All three are TOO_CLOSE against >=12px: one inherited staff/interaction
reservation root, not three defects or a Stage-1 regression. Actual focus is
visible at transition time zero with identity card transform; the observed
4px solid outline and 6px used offset are already active. The uncapped
cardBottom + 42px reservation leaves insufficient room for that envelope.
These observed values explain the defect; they are not new product constants.

Retain active-change `stage-1-projects-interaction-clearance-stop.md` / JSON
and `stage-1-projects-interaction-lineage-review.md` /
`stage-1-projects-interaction-lineage-diagnostics.json` byte-for-byte. They
distinguish actual current DOM from original Stage-0/frozen-Phase-9 Professional
constructor replay on saved normalized inputs and identical relevant styles.
No fresh historical browser or full historical aggregate PASS is claimed.
Local cubic support proves the interior witness does not depend on incoming
connector controls: the minimum 013 visit-1-to-2 continuity edit alone cannot
necessarily or sufficiently repair it with visit 2's geometry fixed.
No completed inheritance investigation is repeated or historical claim rewritten.

### B. Exact geometry ownership and repair envelope

Projection remains the sole geometry owner. Only the **second horizontal
Projects notation shelf**, plus the **minimum visit-1-to-2 and visit-2-to-3
junction controls proven necessary** to maintain valid continuous geometry
after that correction, MAY change under this decision. Existing owners are
`projection.ts:horizontalChapterShelves`, `horizontalProjectConnector` and
`horizontalGeometry`. The local spline support is an existing facility, not
permission to rewrite the generic Organic Flowing builder or add a solver.

Derive safe reservation from actual production card bounds, complete visible
staff ink including strokes, complete applicable musical ink, actual focus
outline and idle/hover/focus/touch-equivalent interaction envelopes over relevant
transitions. Use 012(D/E)'s production measurement/shared-parameter ownership,
full-precision geometry, explicit coordinate scales and >=12 physical CSS
pixels. An empty reserved event slot does not exempt the five visible staff
lines. Keep event-free connectors, locally LTR safe notation, <=18° tangent,
<=6° variation, margins, clipping checks and the complete capacity predicate.

The exact changed junction controls and their necessity SHALL be demonstrated
with before/after local support and neighbor stability. Preserve visit 1's own
shelf except its separately authorized ASM-PC-002 repair; preserve visit 3's
own shelf, all unrelated Projects geometry and all unrelated connectors. A
shared valley/helper adjustment that propagates beyond these exact local
envelopes is not authorized. Do not move/resize cards or sections, alter content,
fan presentation/interaction, synthesize/remove/reassign events or change Composer.
No arbitrary fixed-offset workaround, viewport-specific branch, global Projects
redesign, focus-visible removal/reduction, outline hiding/clipping, exclusion
of transition frames, weakened clearance or validation is permitted.

### C. Combined candidate qualification, without merging repair scope

This decision reconciles only the repair-envelope references in 012(I.B) and
013(C)'s complete horizontal-candidate qualification: evaluate the candidate
after both separately authorized local repairs under **013 + 014**. The
first-shelf authority in 013(B), identities/occurrences, 012 responsive policy
and all acceptance thresholds remain unchanged. This is not a retroactive
expansion of 013 or permission to move either defect into the other register.

The old 1440x900, 1536x900 and 1920x917 fixtures remain immutable failing
baselines. Preserve before/after coverage separately: applying a corrected
constructor to old input dimensions is not reproduction of old geometry.
Only the complete actual ink/interaction/three-visit/global predicate qualifies
a positive horizontal candidate. At least one appropriate corrected candidate
among those three dimensions SHALL pass and remain enhanced within the combined
named envelopes. Otherwise STOP for another owner decision; no universal
fallback merely to conceal a local horizontal defect. A proven idle or
transition-start failure remains rejection even when other input is missing;
missing input cannot manufacture PASS and settled-only focus is insufficient.

### D. Ordered implementation, tests and evidence

After governance validation and a separate High continuation, preserve the
partial unintegrated `projects-capacity.ts`, its original five focused cases,
three pending ASM-PC-002 repair assertions and immutable negative fixture.
Maintain meaningful inherited-baseline coverage distinct from corrected
production projections; do not remove a failure merely to pass a gate.

Implement **ASM-PC-002 under 013 first**, then **ASM-PC-003 under 014**.
Use focused tests to prove >=12px complete first-event ink and visit-2
production interaction clearance across relevant transitions, stroke/scale,
visibility, both necessary junctions and unchanged outside-envelope geometry.
Check all three recorded occurrences; retain empty visit-2/3 assignments and
the primary event on visit 1. A geometry change must repair the physical
rendered locus; changing normalized parameter/sample phase alone is not a fix.
The diagnostic straight-shelf height bands are not a proved feasible spline
interval or candidate PASS; implementation must demonstrate the full contract.

Only after **both local repairs pass** may the already approved ASM-PC-001
whole-story capacity fallback/vertical/lifecycle work under 012(C–I) continue.
Keep complete visible-segment/cross-run validation, 2049-point center replay,
1025-point staff input, existing 1e-7 guards and all full-precision event-safe
checks enabled. Focused validation then deterministic global geometry must be
clean before the fresh serial Chromium/Firefox/WebKit matrix (workers=1,
retries=0), retaining the prior 132-test scope plus necessary full-ink/focus/
transition/capacity/resize/hydration/lifecycle coverage under 012(I). Preserve
pure horizontal 1100x640 Batch-2 checks and stronger three-visit fallback tests.
Do not reuse earlier browser passes across changed candidate geometry.

Successor Stage-1 evidence SHALL record ASM-PC-003-O01/O02/O03 before/repair/
final interaction results separately from ASM-PC-001 and ASM-PC-002, exact
changed local controls, unchanged neighbors, current versus historical proof
scope, complete candidate qualification and global counts. Historical Phase-9
acceptance remains valid under its contemporary evidence; four seal pairs,
64 payloads and all previous successor diagnostic records remain immutable.

### E. Preserved contracts and mandatory stops

Preserve ADR-048 / 012 and ADR-049 / 013; all three Projects visits,
NON-ASSEMBLY, cards/dimensions/content/fan, keyboard accessibility and visible
focus behavior, complete musical/staff ink, >=12px physical clearance and
zero global center/visible-staff intersections. Preserve five approved deltas,
14 Batch-1 repairs/18 occurrences, six Batch-2 repairs/eight occurrences,
ADR-046 hydration/numeric determinism, Composer semantics/seed/fingerprints
`fnv1a32:039bce10` / `fnv1a32:1fe3356b`, approved glyphs and all validators.

If correction cannot fit visit 2's shelf plus minimum adjacent junctions,
STOP. Do not expand into visit 3's own shelf, cards/fan, global responsive
rules, another chapter or another unregistered inherited defect. Model
escalation supplies no additional permission; apply AI-MRP-001 routing.

Current Ultra work is **governance normalization only**. Run successor and
workspace OpenSpec strict, structured JSON/YAML, git diff --check, historical
evidence and protected runtime/test/script/asset integrity checks. Then STOP
immediately with the bounded Astra High handoff; no runtime repair/tests,
final matrix/captures or optional investigation. Implementation remains pending
at 7/92. Complete no repair or human checkbox. After future High validation and
successor evidence, STOP at Human Geometry Approval. No Stage 2+, refreeze,
successor motion, archive, commit, push, deploy or public cutover.

---

## ASM-IMP-DEC-015 — Access scene-owned deterministic content reservation

**Status:** APPROVED under ADR-051 on 2026-09-13. Distinct diagnostic:
**ASM-CR-001 — APPLICATION-ACCESS-CONTENT-RESERVATION**. Existing ASM-AC-* IDs
remain acceptance contracts. Known equivalent occurrences and their historical
limitations are registered in the canonical `known-inherited-findings.json`.
This decision is separate from ASM-PC-001/002/003 and changes no Projects scope.

### A. Complete scene contract and ownership

The Application scene/layout owner SHALL own one versioned deterministic Access
content-envelope contract outside Projection. Its payload SHALL derive from the
maximum complete required PRELAUNCH scene/form envelope over approved content,
metrics, available inline size and responsive presentation profile, reusing
existing contentRect/section-sizing transport. Cover all ten current UI states,
acknowledgment-pending success, no-key/script/widget failure, verification/expired
and visible-interaction states, full text wrapping, scene and form padding/gaps/
borders, controls, focus outlines and real provider occupied bounds. Derive
inline feasibility as well as height. Neither 118px overflow nor the 44px widget
minimum is a maximum-envelope proof or an unexplained replacement for 370px.

The scene/form owner retains public copy, content/control dimensions, release,
security and accessibility semantics. Projection owns pure geometric consumption
and verification of complete musical ink separation, not a generic DOM-measuring
service. Offline diagnostics may derive/validate the envelope; production Access
reservation SHALL NOT acquire per-state observers, per-frame measurements,
continuous DOM/Projection feedback, or ordinary-interaction-driven rebuilds.

Establish the reserve before rendering from deterministic inputs; preserve the
same approved SSR/first-client baseline under ADR-046. Only the existing owned
post-hydration resize/profile lifecycle may resolve browser size. Recompute for
material profile/available-inline-size or approved content/metrics/release
revision; ordinary focus/input/status/submission/token changes SHALL preserve
the reservation and not trigger structural rebuilds. Bound loaded/supported
fallback fonts and verification occupancy up front. A later approved PRELAUNCH
→ LIVE switch derives a separate revision through the same scene contract; it
is not authorized now.

### B. Exact local scope and invariants

Later repair is limited to **application-access content reservation and minimum
local entry/exit support proved necessary**. Prefer a local review adapter if
sufficient for Task-33 Soft/Flowing vertical-wide/compact. Integrated horizontal,
vertical-wide/compact and static consumers use the same stable contract where
Access is reserved, without changing already-fitting or unrelated geometry.
Shared `organic-flowing.ts:buildAuthoredGeometry` use prevents calling a global
height edit preview-only. No generic vertical rewrite, unrelated chapter/control
movement (including automatic Application-terminal translation), Projects change,
Composer change, form/content reduction or dimension redesign, hidden/clipped
errors, viewport-specific branches or weaker overflow/clearance checks.

Prove complete X/Y fit, controls/focus usability, >=12 physical CSS pixel musical
ink clearance, full visibility, local continuity, <=18° tangent/<=6° variation,
event-safe zones and global zero center/visible-staff intersections. Demonstrate
local necessity and unchanged outside-envelope output. Sample viewport PASS
alone does not prove a responsive envelope over its supported width interval.
If adequate fit or a bounded provider envelope requires expanded scope, STOP.

### C. Audit dependency and preserved work

The repair boundary is owner-approved, but execution SHALL remain paused under
016 until its audit and complete-batch owner disposition. No new runtime,
component, product test or pipeline repair in this Ultra normalization or the
subsequent audit. Preserve the completed causal comparison without replay;
record its current-toolchain/frozen-source and bundler limitations honestly.
Preserve prior five deltas, both repaired batches, ADR-046, all Projects work,
Composer/glyphs, full ink/12px/global-zero, all negative fixtures/validators and
historical evidence. Human Geometry Approval remains pending, 7/92.

## ASM-IMP-DEC-016 — Systematic audit prerequisite and batch disposition

**Status:** APPROVED under ADR-052 on 2026-09-13. Canonical policy:
**ASM-AUDIT-001**, `docs/canonical-v2/00-governance/07-successor-inherited-defect-audit-policy.md`.
Its taxonomy, BLOCK/individual-DEFER conditions, schema-backed ledger, reblocking,
runtime/validation separation, bounded comparison protocol and efficiency rules
are binding. No existing finding is automatically deferred and no mandatory
acceptance/test invariant is waived.

Three distinct evidenced inherited roots in one stage trigger the gate; repeated
occurrences, engines and pipeline defects do not count again. ASM-PC-001/002/003
already meet it. Pause new one-off inherited repairs; preserve all valid current
work and previous authorization boundaries. Scope registration under 015 is not
permission to bypass the audit and subsequent batch decision.

The approved active-change `stage-1-inherited-audit-manifest.json` is prebounded:
150 current cases plus 150 historical comparison obligations, 3,240 Access
state observations, 48 lifecycle + 24 static-accessibility sequences and the
already named deterministic guard sources. AUDIT ONLY compares frozen Phase-9
source with the actual fingerprinted dirty current input under equivalent
conditions. Keep common-mode comparison separate from policy-selected runtime.
Absent historical successor telemetry is not an invented product failure.

Collect and compare structured results mechanically; group occurrences and
analyze only differences/failures/unclassified/root clusters. Human reports
summarize root causes and occurrence matrices; identical passing records stay
in structured artifacts, not model context. No per-observation screenshots;
only necessary representative/ambiguous/material visual evidence or separately
required canonical artifacts. No hidden failing assertions or skipped coverage.

Complete all safe independent in-manifest slots despite failures. Keep raw
validators enabled and unchanged. UNCLASSIFIED/required coverage gaps remain
blocking. OUT_OF_AUDIT_SCOPE / NEEDS_REVIEW is logged without automatic expansion
or another broad investigation. Scratch collector corrections remain separate
from unchanged product/runtime/test/historical source, under two bounded attempts;
production pipeline repairs await batch disposition. Candidate INVALID remains
invalid even with usable fallback; preserve required horizontal qualification.

This decision reconciles §33 only for authorized **read-only audit collection**:
new findings do not stop independent in-scope collection, but unauthorized repair,
unsafe action, scope expansion, security or invariant changes still stop the
affected action. No Stage 2+ implementation is implied by observing existing
runtime behavior during Stage 1.

Order: Ultra normalization/validation → STOP → Astra High AUDIT ONLY → one
root inventory and STOP → owner/governance complete-batch disposition → normally
Sol High bounded blocking repairs → focused/deterministic qualification → fresh
serial final matrix and successor evidence → STOP at Human Geometry Approval.
No direct normalization-to-repair handoff, automatic DEFER, refreeze, motion,
commit/push/deploy or self-approved human gate. Four historical seals, 64 payloads
and prior diagnostics stay immutable; exact worktree/progress are handed off.

---

## ASM-IMP-DEC-017 — Portfolio-only successor scope rebaseline

**Status:** APPROVED under ADR-053 on 2026-09-22. This decision supersedes
earlier active institutional Application-branch topology and the instruction to
finish the old `ASM-AUDIT-001` manifest. Historical Phase-9 descriptions remain
historically valid.

The institutional site has only **Home / Origin → Professional / Portfolio** on
desktop, and Home → Professional chapters → global footer on mobile. Home is the
sole origin. Remove institutional Application chapters, staff, projection,
navigation/deep links, Access form, responsive concatenation and every
Application-only reservation, route, feature flag, fixture and validator. Do not
retain a hidden branch or symmetric left-side geometry for compatibility. Use
existing Not Found behavior for removed branch URLs unless an earlier approved
redirect contract specifically applies. This does not delete an independent
musical-application product outside the institutional narrative.

Preserve surviving Professional structure and interactions, Projects
NON-ASSEMBLY/three visits/capacity and clearances, approved glyphs, applicable
Composer semantics/fingerprints, native-scroll and GSAP ownership, reduced-motion
and accessibility behavior. ADR-048/049/050 retain their Professional scope.
Simplify shared code only where its second-branch behavior has become dead;
avoid an unrelated geometry, Composer, motion or visual redesign.

The old audit is `SUPERSEDED_SCOPE` while incomplete. Preserve all raw results,
source pins, old manifest and four Phase-9 seals/64 payloads. They are supporting
history, not validation PASS for the new topology. `ASM-CR-001` remains a proven
inherited Access deficit and is removed from active repair scope without being
marked repaired or deferred. The existing successor OpenSpec is rebaselined;
recalculate tasks, update active documentation and focused tests, then run the
established validation gates. Human Geometry Approval remains PENDING/BLOCKING.

---

## ASM-IMP-DEC-018 — Desktop fallback presentation and bounded HGA density

**Status:** APPROVED under ADR-055 on 2026-09-23. This is the current Stage-1
HGA continuation contract. It replaces the earlier requirement that native
1366×768 must select horizontal enhancement; it does not amend ADR-048/049/050
or `ASM-IMP-DEC-012/013/014`. This normalization run is documentation-only.

### Capability, orientation and presentation

Keep the existing input/eligibility owner in `motion/eligibility.ts`, lifecycle
owner in `motion/runtime.ts`, and Projection/capacity ownership intact. Desktop
input plus complete horizontal capacity selects `horizontal-enhanced` with
desktop presentation. Insufficient horizontal capacity selects whole-story
`vertical-wide` with desktop presentation. Narrow mobile uses `vertical-compact`;
wide tablet may also use `vertical-wide`; reduced motion keeps `static` and an
appropriate wide/compact layout. These distinctions need no new runtime mode,
enum, device sniffing, policy threshold, zoom detection or 1366 special case.

Desktop-quality fallback SHALL use available width coherently, retain readable
type and appropriate grids/navigation, preserve the score/content relationship,
and keep fan/focus states and terminal/footer usable without clipping or
unexpected horizontal overflow. Orientation alone neither proves a mobile
defect nor proves adequate presentation. The owner decides visual acceptance.

### Finding disposition and evidence boundary

| Finding | Current status | Meaning |
| --- | --- | --- |
| HGA-001A | RESOLVED | Local Home-to-About offset loop fixed; retain its deterministic regression. |
| HGA-001B | EXPECTED_CAPACITY_REJECTION / NOT_A_PRODUCT_DEFECT | Corrected 1366 horizontal candidate fails Projects capacity; retain raw insufficiency and whole-story fallback. |
| HGA-001C | OPEN | Supported 1366 desktop presentation quality, without a horizontal-mode mandate. |
| HGA-002 | OPEN | Excessive composition spacing/density, distinct from capacity qualification. |

The active change's `stage-1-hga-001a-result.md` and runtime residual JSON remain
unaltered dated evidence. At 1366×768 @100%, the sole remaining rejection is
`projects-protected-clearance-or-clip` (visit minima −37.10/11.92/−20.26px;
minimum 12px). Neither rounding nor density compression may turn it into PASS.
The previous 63/63 matrix is a retained checkpoint, not evidence for unmade
presentation changes or a fresh 1366 selected-mode PASS. Aggregate HGA-001 and
Human Geometry Approval remain open; SAFE_FALLBACK is independent of validation.

### Bounded future implementation and density guidance

1. HGA-001C: measure the actual selected `vertical-wide` desktop layout first.
   Reuse existing non-Projects scene CSS and scoped Home/chapter alignment,
   widths and macro padding. Do not assume header or public Home are broken:
   public `/` is owned by BrandIntro, separately from Visual Lab Home. Preserve
   their current lifecycle/navigation ownership. No broad visual redesign,
   Projects geometry, card/fan/dimensions/content, mode selection or capacity
   predicate changes are authorized.
2. HGA-002: retain the original measurements in the intersection/causal records.
   Those measurements describe the forced rejected horizontal candidate, not
   today's selected vertical layout. Measure the affected current mode before
   changing it. Target excessive macro-gutters and inter-scene distances for
   About, Services, Process and Contact; prioritize space inside existing
   reservations. Do not globally scale, shrink glyphs/cards, or blindly compress
   internal component spacing. A large gap can be an approved safety reservation.
3. Vertical-wide chapter heights and score coordinates are coupled through
   `--story-score-wide-block-size` and approved section block sizes. Never
   shorten CSS chapter heights independently. A local non-Projects inter-scene
   adjustment must retain layout/Projection agreement and all invariants; stop
   if it needs a new geometry scheme, Projects shelf/entry/exit changes, altered
   approved glyphs or a wider repair envelope. Keep HGA-001C and HGA-002 evidence
   separate even if they touch the same layout owner. Density is not a repair
   for HGA-001B.

This is the narrow HGA continuation of the existing owner-requested corrections,
reconciling §33 item 3 only for the presentation/macro-spacing scope above.
It supplies no general inherited-defect repair authorization. Preserve the
completed HGA-001A controls, Batch-1/2 repairs, ADR-046, Composer/seed/fingerprints,
approved glyphs, three NON-ASSEMBLY Projects visits, complete visible ink and
interaction envelopes, 12px clearance and the unthinned global zero-intersection
validator. Existing required positive horizontal controls must still qualify;
universal fallback cannot hide regressions. No original fixture becomes positive
merely through historic acceptance or fallback selection.

### Validation and stop

Route future work as `BOUNDED_IMPLEMENTATION` / `HIGH` through the current
registry. First prove selected-mode geometry/readiness at 1366 without forcing a
mode; verify presentation changes with focused layout/geometry, a11y and browser
checks plus a known qualifying horizontal control and affected compact/static
controls. Run lint/typecheck for affected code and strict/structured/diff checks
for documentation. Do not restart the completed 63-observation matrix as a
diagnostic or reuse old captures as post-change approval. Keep all assertions
enabled and record raw capacity, actual selected mode and validation separately.
Return bounded representative evidence to the owner; do not mark task 5.6.

Stop on a new defect, scope/architecture/invariant conflict, or two bounded
attempts without material causal progress; route unresolved implementation
diagnosis through the current registry. No refreeze, Assembly, GSAP, Stage 2+,
commit, push or deploy. This architecture run stops after governance validation.

## ASM-IMP-DEC-019 — Projects progressive disclosure on the landing story

**Status:** APPROVED under ADR-056 on 2026-09-24 for the current Stage-1
landing-page scope. This decision replaces only the selected vertical Projects
presentation and withdraws the previously implemented public Projects
listing/detail routes from the current release. It does not alter Composer,
horizontal Projection, capacity thresholds, clearance, or fan visit semantics.

- `horizontal-enhanced`: render the full fan with all canonically eligible
  cards and three NON-ASSEMBLY visits. Its candidate must still pass the full
  ADR-048/049/050 capacity and global safety contracts before selection.
- `vertical-wide` and `vertical-compact`: render one teaser from the first
  featured public project in canonical portfolio order, falling back to the
  first public project only when no featured public record exists. The same
  canonical data authority supplies horizontal and vertical presentations.
- `static`: preserve meaningful Projects content without instantiating the
  rich fan. Reduced motion does not authorize the fan in a vertical document.
- No current `/portfolio` listing or detail route, replacement URL, future
  route name, placeholder destination, or navigation-only teaser action.
  Future project-browsing architecture is outside this Stage-1 decision.

The vertical story DOM SHALL contain no fan cards, fan-only focus controls,
interaction envelopes, visit state, or fan geometry in selected-mode
measurement and chapter sizing. A bounded, inert, detached horizontal candidate
may render the same full fan solely to evaluate the existing horizontal
capacity predicate. It SHALL NOT change the selected vertical DOM or make a
failed candidate eligible. Horizontal card focus/selection remains usable
without links to unapproved routes. Teaser content uses existing factual fields
and has no hover-only information.

HGA-001D **supersedes the low-height vertical focused-card finding by product
scope**: the approximately 642px rich focused state is no longer present in
vertical modes; it is not claimed as a geometric repair. Preserve its evidence
and verify that the teaser is usable at Firefox-equivalent 1366×611 and
Chromium-equivalent 1366×639. HGA-002 and task 5.6 remain pending. Preserve
all horizontal positive controls, 12px clearance, complete ink, global zero
self-intersections, Batch-1/2, HGA-001A and historical evidence. Do not run
the 63-observation matrix merely to prove this bounded change.

---

## ASM-IMP-DEC-020 — Continuous-story rebaseline before geometry approval

**Status:** APPROVED under ADR-057 on 2026-09-24. This decision references the
[canonical spatial model](../02-experience/01-global-story-architecture.md)
rather than defining a second story contract. Amend the current successor;
retain Phase-9 seals, audit records and all Stage-1 HGA results byte-for-byte.

Current precedence over earlier text in this document:

| Earlier scope | Current disposition |
| --- | --- |
| Chapter-contained physical layouts, mobile serpentine as the only geometry, scene-start navigation in §§13–14 and other spatial clauses | Apply canonical spatial contract §§1–10. Existing modes are transitional implementation vocabulary. |
| ASM-IMP-DEC-012/013/014 | Keep general ink/clearance/focus/geometry safety; retain exact fan constraints while that presentation exists. Do not universalize simultaneous fan capacity to sequential content. |
| ASM-IMP-DEC-018 | Preserve responsive evidence; supersede fixed mode target and HGA-002 macro-spacing implementation plan. |
| ASM-IMP-DEC-019 | Preserve implemented teaser evidence as transitional; final continuous Projects disposition is pending implementation. Route withdrawal remains. |
| §27 Stage 1 / Stage 3 | Canonical spatial contract §3 explicitly permits deterministic structural native/story/camera mapping and existing adapter consumption for reachability before HGA; final choreography, new GSAP presentation and Assembly stay behind later authorization. |
| §§27–30 validation and review | Use spatial contract §13 alongside retained safety/performance/accessibility checks. Partial offscreen content alone does not fail. |
| §33 older geometry repair envelope and §35 status | Owner-approved target replaces the old bounded margin-remediation target; this run remains documentation only. Later work follows the bounded package and new evidence gate. |

The active tasks move **30/51 → 25/55**: prior 5.1–5.5 evidence remains a
completed transitional checkpoint, but those acceptance tasks reopen for the
new target; four implementation prerequisites are added. No previously achieved
historical result is rewritten as failure, and no new-target implementation is
credited. Human Geometry Approval (5.6), refreeze, Assembly and GSAP remain pending.

Implementation route after operational readiness: `BOUNDED_IMPLEMENTATION`,
resolved through the canonical routing registry, starting only the spatial-contract slice of the
[implementation package](../../../openspec/changes/implement-scroll-driven-score-assembly-and-motion/continuous-story-implementation-package.md).
This governance session stops after validation and optional isolated checkpoint
commit. Runtime code, CSS, Projects, Composer, Projection and public integration
are not changed here. The owner's explicit one-local-commit exception applies
only if the new governance delta is safely isolated; no push or deployment.

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

Current portfolio/HGA authority is `ASM-IMP-DEC-017/018`: the former audit
prerequisite below is superseded for active scope by 017, not resumed. Current
work is limited to 018 before task 5.6; the retained earlier implementation list
is provenance, not permission to repeat completed or removed-branch work.

### Current execution prerequisite — ADR-052 / ASM-IMP-DEC-016

The approved finite audit SHALL precede new individual inherited repairs,
including ASM-CR-001 under 015. Prior bounded scopes/repairs remain valid. Current
Ultra is governance-only; next Astra High is AUDIT ONLY; a complete-batch owner
disposition is required before repair execution. The following implementation
list and previous 012–014 ordering do not override this current prerequisite.
Raw acceptance remains mandatory; supplementary individual DEFER is governed
only by ASM-AUDIT-001 and never waives a must-pass test or human gate.

### Implement

- `ASM-LAYOUT-DELTA-001`;
- `ASM-LAYOUT-DELTA-002`;
- `ASM-LAYOUT-DELTA-003`;
- `ASM-LAYOUT-DELTA-004`;
- minimal Home entry-anchor geometry required for future Scenic handoff;
- the exact inherited repairs under `ASM-IMP-DEC-008` (Batch 1) and
  `ASM-IMP-DEC-011` (Batch 2);
- ASM-PC-001 whole-story capacity fallback and bounded vertical Projects
  three-visit support under `ASM-IMP-DEC-012`;
- ASM-PC-002 first horizontal Projects shelf full-ink clearance, plus only
  required entry/visit-1-to-2 continuity, under `ASM-IMP-DEC-013`;
- ASM-PC-003 second horizontal Projects shelf interaction clearance, plus only
  necessary visit-1-to-2 / visit-2-to-3 junctions, under `ASM-IMP-DEC-014`;
- ASM-CR-001 Access reservation/minimum proven local entry/exit support under
  `ASM-IMP-DEC-015`, only after `ASM-IMP-DEC-016` audit/batch disposition;
- hydration equality under `ASM-IMP-DEC-009`, in its mandatory execution order,
  with the numerical-output/telemetry boundary in `ASM-IMP-DEC-010`.

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
- horizontal/vertical mode regressions;
- identical SSR/first-client markup and event-safety metadata, zero hydration
  warnings, and preserved post-hydration responsive reprojection.

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

For the portfolio-only HGA continuation, apply `ASM-IMP-DEC-017/018` first.
018 permits only its bounded presentation/non-Projects macro-spacing work;
all other repair envelopes and mandatory invariant stops remain unchanged.

ASM-IMP-DEC-016 permits continued safe, independent read-only collection inside
the approved audit manifest after a new finding. It does not authorize repairs
or scope expansion: log OUT_OF_AUDIT_SCOPE / NEEDS_REVIEW and stop the affected
unauthorized action. All mandatory invariants and the stops below remain.

The executor SHALL STOP and request a decision if:

1. adequate Professional event density requires changing Composer semantics;
2. a requested visual effect requires events inside connector/curve/Assembly;
3. geometry outside the five registered successor deltas and the exact local
   inherited-defect exceptions in ASM-IMP-DEC-008/011 and the bounded
   ASM-PC-001 fallback/support in ASM-IMP-DEC-012 and ASM-PC-002 first-shelf/
   minimum entry/visit-1-to-2 envelope in ASM-IMP-DEC-013 and ASM-PC-003
   second-shelf/minimum adjacent-junction envelope in ASM-IMP-DEC-014 and the
   ASM-CR-001 Access/minimum entry-exit envelope in ASM-IMP-DEC-015 (subject to
   016 audit/batch disposition) needs modification, including any new inherited
   defect outside the original
   Batch-1 14, exact Batch-2 six, ASM-PC-001, ASM-PC-002, ASM-PC-003 and ASM-CR-001;
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
PRESERVED STAGE-1 WORK + TRIGGERED BOUNDED AUDIT / BATCH DISPOSITION
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
ASM-IMP-DEC-001..013            APPROVED
FINAL HUMAN GATE                REQUIRED
```

Phase 9 is formally closed at
`306ccb74da6c7bbf8f187e360c0776c571b5fc3d`. The isolated successor OpenSpec
completed documentation-only Stage 0 on 2026-09-05; Gate 0 is PASS. Its
`stage-0-review.md` records planning verification and subsequent owner Stage-0
approval. Subsequent owner authorization started Stage 1. On 2026-09-08,
ADR-044/045 and ASM-IMP-DEC-008/009 authorize only the 14 registered inherited
repairs and the direct hydration regression correction, after governance
validation. ADR-046 / ASM-IMP-DEC-010 adds the focused 2026-09-09 numerical
determinism and internal-search telemetry boundary without changing allocator
math or safety acceptance. ADR-047 / ASM-IMP-DEC-011 adds exactly the six
Batch-2 inherited defects (`ASM-SI-019..024`, eight viewport occurrences),
preserving the 14 Batch-1 repairs, completed hydration solution, and global
zero-intersection gate. Governance normalization stops before Batch-2 repair;
the separate High continuation remains bounded to those six envelopes.
Human Geometry Approval and refreeze remain pending; Stage 2+
remains unstarted and unauthorized. Phase 9 remains closed and historically
valid, with all evidence immutable.

Current Projects successor authority is ADR-048 / ASM-IMP-DEC-012 for
ASM-PC-001 (capped 1100x640, three visits) and ADR-049 / ASM-IMP-DEC-013 for
ASM-PC-002 (uncapped first-visit full-ink deficit, three viewport occurrences).
The latter permits only first-shelf/minimum entry/visit-1-to-2 repair and
reconciles the old positive-fixture assumption with complete capacity PASS.
ADR-050 / ASM-IMP-DEC-014 separately registers ASM-PC-003 (second-visit
focus-start clearance, three viewport occurrences) and permits only that shelf
and minimum necessary junctions on both sides. Candidate qualification uses the
combined named 013 + 014 envelopes without merging their scope. High implements
002, then 003; both local repairs must pass before 001 fallback work continues.
All three implementations remain pending; normalization performs no runtime
repair. Human Geometry Approval remains pending at 7/92.
