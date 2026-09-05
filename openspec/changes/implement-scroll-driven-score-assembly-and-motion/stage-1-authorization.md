# Bounded Stage-1 implementation authorization — proposed

**Status:** DRAFT FOR OWNER REVIEW — NOT AUTHORIZED.

**Prepared:** 2026-09-05.

**Change:** `implement-scroll-driven-score-assembly-and-motion`.

This is the proposed execution boundary after review of the completed Stage-0
package. Its presence does not grant permission to implement. The owner's
subsequent instruction must explicitly authorize Stage 1. The canonical
successor specification remains the technical authority; this document does
not create new product, geometry, or musical decisions.

## Proposed authorization text

> Authorize Stage 1 — Bounded Geometry Stabilization only, for
> `implement-scroll-driven-score-assembly-and-motion`, on the accepted Phase-9
> technical baseline `306ccb74da6c7bbf8f187e360c0776c571b5fc3d` and closure
> record `a20d52ac9f214d385ea7c210b2ab45aa84095fc8`. Implement the five bounded
> pre-motion geometry deltas under the canonical successor specification and
> the limits below, run the required automated checks, and prepare deterministic
> successor visual evidence. Stop for my explicit Human Geometry Approval.
> This authorization does not approve the resulting geometry, authorize Stage 2
> or later stages, change Composer semantics, or authorize commit, push,
> public cutover, deployment, or production/DNS changes.

## Authorized geometry budget if accepted

| Delta | Stage-1 result | Preserved boundary |
|---|---|---|
| `ASM-LAYOUT-DELTA-001` | Application terminal follows its branch without the unnecessary large return/U-turn. | Final local shelf is LTR and `EVENT_SAFE_STRAIGHT`; conventional final barline physically terminates it. |
| `ASM-LAYOUT-DELTA-002` | Place complete Composer event groups only on visually straight safe shelves. | Full footprint and review margin fit `NOTATION_SAFE`; locally LTR, tangent ≤18°, variation ≤6°, no reversal or forbidden-zone overlap. |
| `ASM-LAYOUT-DELTA-003` | Benefits↔Demo becomes a direct/broad, low-curvature, event-free corridor. | Benefits/tablet protection, Demo↔Launch clearance, and safe event resumption remain intact. |
| `ASM-LAYOUT-DELTA-004` | Improve long Professional shelf utilization from existing ordered Composer groups. | Seed, fingerprints, motif/rhythm/group order, stems, beams, triplets, accidentals, ledger lines, and key signatures remain unchanged. |
| `ASM-LAYOUT-DELTA-005` | Prepare only the minimal Home entry-anchor geometry and event-free lead-ins needed for the future Scenic handoff. | Approved clef geometry/calibration and branch topology remain intact; final Home Scenic Assembly is Stage 9. |

The initial full-footprint margin is `1.5 × staffSpace` per side. Professional
review targets are long shelves `≥40 × staffSpace` and typical optical group
spacing `≈8–14 × staffSpace`. These are canonical review calibration values,
not permission to weaken event safety or generate new music.

Desktop remains `APPLICATION ← HOME / ORIGIN → PROFESSIONAL`. Mobile remains
Home → Professional serpentine → Professional final barline → Application
serpentine → Application final barline → one global footer.

## File scope and ownership

Use the verified owner map in [stage-0-review.md](stage-0-review.md) and
reinspect the worktree before editing. A file appearing here is not blanket
permission to change unrelated responsibilities within it.

- Primary geometry: `src/lib/story/score/projection.ts` and tightly scoped
  geometry types/helpers required by the five deltas. Projection currently
  imports event allocation/classification from
  `src/lib/story/score/organic-flowing.ts`; narrowly scoped changes there or
  in a successor projection adapter must preserve unrelated review fixtures
  and shared geometry defaults.
- Bounded geometry measurement: `src/components/story-score/measurement.ts`
  and the existing measurement/output boundary in
  `src/components/story-score/StoryScoreLayer.tsx`, only where required for
  safe shelves, protected content, or minimal entry geometry.
- Integrated Home: only the minimal Home geometry/content-envelope hooks in
  `src/components/story-motion/MotionStoryLab.tsx` and corresponding layout
  styles, if Projection alone cannot supply the approved entry geometry.
  Runtime creation, navigation, reveal, and temporal behavior remain outside
  Stage 1. Unrelated scene layout changes trigger the canonical stop rules.
- Focused projection, measurement, score-layer and browser regression tests;
  successor diagnostics/capture support; successor planning and evidence
  records. Use existing tests as regression contracts and add meaningful
  coverage for the five deltas. Never relax a failing acceptance threshold.
- Keep `composition.ts`, Music Composer/renderer semantics, approved glyph
  masters/calibration, story manifest/order, native-scroll/history runtime,
  forms/endpoints, public routes/copy, and infrastructure unchanged.

Stage 1 may expose geometry classifications and entry geometry required to
validate its own deltas. General motion metadata, draw/reveal anchors, pure
motion models, GSAP bindings, Home Scenic presentation, Structural Assembly,
mobile motion/header/sheet, and traversal policies belong to Stage 3 onward.
The later `FAST_TRAVERSAL` contract remains staff-only, with Composer events
hidden until settlement or cancellation.

## Required validation and review deliverable

1. Record starting HEAD, worktree, exact changed-file list, each change's delta,
   current Composer fingerprints, and invariant geometry outside the five
   deltas. Preserve Services/How content and Projects visit semantics.
2. Verify projection continuity, point/tangent joins, zero path and staff-line
   self-intersections, event footprint/margins, ≤18° tangent and ≤6° variation,
   deterministic safe-zone classification, atomic group allocation, and zero
   event anchors/footprints in connectors, curves, reversals, or Assembly.
3. Audit protected content, conventional final barlines, horizontal-enhanced,
   vertical-wide, vertical-compact, static/reduced fallback and responsive
   transitions. Preserve exact reported Phase-9 browser/viewport regressions.
   Classify contacts as `CLEAR`, `TOO_CLOSE`, or `INTENDED_OCCLUDED` where the
   canonical protected-content contract applies; intentional occlusion may
   not conceal a forbidden collision.
4. Run affected unit/component tests, lint, typecheck, and deterministic
   Chromium/Firefox/WebKit geometry/integration regressions. Use `workers=1`
   and `retries=0` for visual geometry lanes. Broaden checks only for impacted
   contracts or new failures; record failures and corrections truthfully.
5. Capture and visually inspect Application terminal, Benefits↔Demo,
   Demo↔Launch, representative Professional long shelves, Home entry
   geometry, and representative responsive modes in both themes. Record
   engine, viewport, mode, theme, deterministic semantic position/seed,
   implementation provenance, and measured acceptance outcomes.
6. Create a new successor-only geometry evidence directory and review index.
   Existing Phase-9 capture scripts target historical seal directories: use
   them as references, not successor output jobs. Preserve all historical
   payloads and seals byte-identical. Prepare inventory/checksums for the
   Stage-1 Human Geometry Gate; formal geometry refreeze/sealing belongs to
   Stage 2 after that approval and subsequent authorization.
7. Run strict successor OpenSpec validation and `graphify update .` after code
   changes. Deliver the exact file list, test ledger, captures, unresolved
   limitations, and explicit request for Human Geometry Approval. Record that
   human decision separately from automated PASS.

## Mandatory stopping point

```text
Stage-1 implementation
  → automated geometry validation
  → deterministic, inspected visual evidence
  → STOP: explicit HUMAN GEOMETRY APPROVAL
  → Stage 2 geometry refreeze (subsequent authorized work)
  → Stage 3+ only after refreeze
```

Stop earlier and request a decision for any canonical §33 condition, especially
new Composer semantics, geometry outside these deltas, missing event safety,
sealed-evidence mutation, or weaker protected-content/security contracts.
Do not declare geometry approved because automated checks pass. Phase 9
remains closed throughout; final assets and later parent phases stay gated.
