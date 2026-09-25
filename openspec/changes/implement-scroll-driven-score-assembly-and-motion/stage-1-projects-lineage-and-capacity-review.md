# Projects lineage and capacity review — 2026-09-09

**STOP: architecture review required; unsafe to downgrade to implementation.**
The three observed collisions are PROJECTS-P3, one inherited geometric root
`ASM-PC-001`, with occurrence IDs `ASM-PC-001-O01..O03`. This diagnostic identity
is separate from Batch 1 and Batch 2 and grants no repair authorization. No
Projects repair, browser matrix, final capture, or broad test suite ran here.

The owner's original Ultra prompt and continuation authorized lineage and
capacity diagnosis and conditional governance normalization. That condition is
not met: no feasible correction confined to the existing local score envelope
has been established. Do not create speculative ADR-048 / ASM-IMP-DEC-012.
The live register remains at ADR-047 / ASM-IMP-DEC-011. Do not relabel proven
inherited lineage as a Stage-1 regression just because layout accommodation is
unresolved.

## Proven shared root and occurrence mapping

`src/lib/story/score/projection.ts:horizontalChapterShelves`, in its
`professional-projects` branch, computes each card-centered visit anchor as:

```text
staffSpace = 12
anchor.y = min(viewportHeight - 7*staffSpace,
               card.y + card.height + 3.5*staffSpace)
```

At 1100x640 the first operand is **556**, derived from viewport height, not a
literal y coordinate or a Stage-1 repair. The three measured second operands
are **651.08, 639.83, 651.08**. All three consume the same undersized cap. Shelves
are authored from anchor.y to anchor.y+1, with 0.45px modulation. The shared
valley target is `min(640-36, max(anchorY)+36) = 592`.

| Occurrence / card | Bounds x, y, width, height (raw DOM px) | Bottom | Shelf zone | Current DOM clearance |
| --- | --- | ---: | --- | ---: |
| O01 / W_Flyer | 11994.779785, 44.131798, 268.843750, 564.949280 | 609.081078 | `notation:professional-projects:6` | -77.173939 |
| O02 / MSN Distribuidora | 12276.906250, 42.156250, 247.203125, 555.671875 | 597.828125 | `notation:professional-projects:7` | -65.919488 |
| O03 / MSN Suprimentos | 12537.392090, 44.132103, 268.828125, 564.948669 | 609.080772 | `notation:professional-projects:8` | -77.178056 |

All are horizontal-enhanced at 1100x640 and require **12px** minimum signed
staff/card clearance. Each minimum involves `professional:staff:8`, at original
full-polyline edges 636, 767 and 898 respectively. Exact edge endpoints, nearest
card boundary coordinates, original rendered run IDs, raw protected bounds,
normalized measurement input and all three revision results are in
[the diagnostic JSON](stage-1-projects-lineage-and-capacity-diagnostics.json).
The same root explains these three observations; no broader Projects inventory
or assumption about other unexecuted viewports is made. Removing the cap alone
is not established as a complete repair.

## Lineage proof and its limits

Safely exported `src` trees from Git were bundled in scratch space, with only
diagnostic exports added to the in-memory module. The active worktree was never
reset or replaced. The complete `buildStoryScoreProjection` constructor finished
for current Stage 1, Stage 0 `40e6ae1a8996c53ed2ec372c47f16bc073d6cee9` and frozen
Phase 9 `306ccb74da6c7bbf8f187e360c0776c571b5fc3d`, using the **same actual saved
1100x640 DOM-derived input**, not simplified fallback cards.

Every revision produced anchors at y=556 and identical full-precision local
staff coordinates. Full-precision minimum clearances are exactly equal across
revisions: **-77.17393825011492, -65.91948755275153, -77.17805605382851px**.
The difference from saved Chromium DOM metrics is below 0.000001px and comes
from six-decimal rendered vertices. The Projects owner block including
`horizontalProjectConnector` has identical SHA-256
`8270420cdac049cd7e5b42ca15bab4a668669b87261efece07a409a1fdacae68` in all three
revisions. The sampled original local staff has identical SHA-256
`e80fc4b1477809a5f4a1aa0bed1bbb40b75290d3f47815196a6d1ce934386641`.
Thus none of these occurrences is a Batch-1/Batch-2 correction consequence or
Stage-1 geometric regression.

This is **direct historical constructor replay on current measured inputs**,
not freshly rendered historical DOM. It proves the inherited geometry failure
for those inputs, not historical global acceptance or a new historical browser
result. Current DOM reproduction comes from the saved failed matrix attachment;
no browser was reopened. Phase 9 remains accepted under its contemporary
validation; this latent defect was discovered by the successor real-DOM gate.

## Available-space proof

Keep the 640px local vertical viewport, measured card rectangles, five-line
staff with 12px spacing, 0.72px stroke, and the existing shelf tangent constraint.
For a horizontal shelf, the outer ink is 24.36px from the center. A complete
visible staff below a card with 12px clearance therefore needs:

```text
cardBottom + 12 + 24.36 <= centerY <= 640 - 24.36
```

| Visit | Available band below card | Required staff+clearance band | Required minimum centerY | Visible maximum centerY | Deficit |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | 30.918922 | 60.72 | 645.441078 | 615.64 | 29.801078 |
| 2 | 42.171875 | 60.72 | 634.188125 | 615.64 | 18.548125 |
| 3 | 30.919228 | 60.72 | 645.440772 | 615.64 | 29.800772 |

**Every interval is empty.** This necessary local cross-section already fails
before accounting for event ink or valleys. Even an 18° shelf reduces the staff
half-height only to `24*cos(18°)+0.36`; all intervals remain empty. Above the
cards, only 42.16–44.13px exists, also less than the staff-plus-clearance band.
The two interior card gaps are each 13.282715px: insufficient even for a
zero-width path needing 12px on both sides. This is a fixed-bounds capacity
proof, not a claim that every redesigned scene is impossible.

The first visit contains one existing event with ledger, notehead and stem;
its complete current ink bounds reach y=515.017056..564.900299, extending above
the staff. It cannot be deleted, synthesized, moved to a forbidden region or
hidden to create capacity. Visits 2/3 have zero events but still require their
complete five-line safe shelves. The diagnostic retains actual group safety,
ink footprint and sampled bounds of Process notation, entry connector:5,
valleys:6/7, Contact connector:8 and Contact notation. These four connectors
remain event-free; adjacent continuity constraints cannot repair an impossible
visit cross-section. No candidate connector redesign was attempted.

Simply routing below the viewport would evade visibility, not satisfy it:
`MotionStoryLab` has a 100svh horizontal stage with `overflow: clip`; the retained
capture contract requires a visibly reviewable anchor. A lateral route outside
the entire fan would need a new proof of three recognizable visits and minimum
adjacent scope. The predecessor permits relationships beside/below/behind cards,
so below-card position is not treated as a universal immutable architectural
rule; nevertheless the current protected-content gate requires CLEAR, and the
retained centered/below fixtures must not be weakened to manufacture a PASS.

## Exact unresolved decision

Conflicting requirements are canonical **ASM-AC-022** (no accidental collision),
**§13 / ASM-AC-020** (three safe shelves, event-free valleys, NON-ASSEMBLY), the
Projects chapter contract (identifiable projects, unclipped selected card and
keyboard/touch equivalence), the retained **12px** clearance/visible-target
acceptance, and the owner's prohibition on changing card dimensions, responsive
acceptance or broadly redesigning Projects.

The geometry owner is known, but **a viable repair envelope is not**. Merely
naming Projects entry/shelves/valleys/Contact exit would authorize an unproven
solution. Translating cards changes scene layout and protected-bound inputs;
its interaction states also matter: existing hover/focus moves cards upward by
24px and scales them, so idle space alone does not establish unclipped selection.
A capacity-based vertical fallback would change responsive behavior. Neither
choice is silently authorized by the inherited-defect diagnosis.

Minimum human decision: **select and authorize one bounded responsive capacity
accommodation**—for example, local fan positioning with interaction-safe score
space while preserving card dimensions/content, or a capacity-based use of the
existing vertical fallback. Specify the affected owners and prove all selected,
focus, touch and resize states while retaining 12px, global zero intersections,
three visits, NON-ASSEMBLY and Composer semantics. These are decision options,
not implemented or validated solutions. No workaround or High prompt follows
this blocked Ultra run.

All earlier repairs remain unchanged. Original Batch-1 and Batch-2 diagnostic
records and the prior Projects STOP remain immutable. Four historical seals and
64 payloads were reverified against both Git baselines. Progress remains 7/92;
Human Geometry Approval is pending. Stage 2+, motion, commit, push and deploy
remain unauthorized.

## Blocked-checkpoint validation

Successor OpenSpec strict PASS; workspace strict 17/17 PASS; four canonical YAML
files, handoff YAML and active-change JSON PASS; `git diff --check` PASS.
All 543 runtime/test/script/public files remain byte-identical to this Ultra
run's initial inventory. Existing files changed in this run are only the derived
Stage-1 progress and CURRENT_HANDOFF; the two new lineage/capacity diagnostic
documents record the result. Four historical manifest/seal pairs and 64 payloads
remain byte-identical to Stage 0 and frozen Phase 9. No repair authorization,
task completion, human approval or safe High downgrade follows these checks.
