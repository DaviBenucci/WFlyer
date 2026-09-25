# Projects visit-2 focus clearance: lineage and owner decision — 2026-09-11

Status: **BLOCKED_OWNER_DECISION**. Diagnosis/proposal only; no repair,
canonical registration, scope amendment or owner approval is recorded here.
Retain diagnostic-only alias `PROJECTS-VISIT-2-FOCUS-CLEARANCE`. No new
ASM-PC, ADR or ASM-IMP-DEC identifier is allocated.

HEAD / Stage 0: `40e6ae1a8996c53ed2ec372c47f16bc073d6cee9`;
branch `develop/site-institucional`; active change
`implement-scroll-driven-score-assembly-and-motion`; progress **7/92**;
Human Geometry Approval pending. HEAD does not include the dirty implementation.

## Finding and evidence levels

Classification: **C + E** — an interaction between the inherited visit-2 staff
reservation and its required focus envelope, constituting a distinct inherited
clearance defect under the successor's complete interaction contract. It is
not a Stage-1 regression (F), nor a necessary consequence of the unimplemented
ASM-PC-002 repair (D). No independent canonical accessibility/design violation
was found in the scoped focus styles; this is not a full accessibility audit.

The immutable `stage-1-projects-interaction-clearance-stop.md` and companion
JSON are the current Chromium DOM source. At actual keyboard-visible focus,
the outline is solid, width 4px and observed offset 6px; card transform is
identity and transition currentTime is zero. The bottom-center outline witness
includes rendered stroke and the actual SVG-to-track scale:

| Viewport | Current DOM gap, physical CSS px | Required |
| --- | ---: | ---: |
| 1440x900 | 9.134092525156348 | 12 |
| 1536x900 | 9.138670081197802 | 12 |
| 1920x917 | 9.142343177774706 | 12 |

These are sufficient failures away from rounded corners, not asserted global
minima. There are three proven viewport occurrences of this diagnostic root.

Focused replay executes the original Professional branch constructors from
Stage 0 and frozen Phase 9 (`306ccb74da6c7bbf8f187e360c0776c571b5fc3d`), plus
the current constructor, on the same immutable DOM-derived normalized inputs.
Only scratch import rebasing and diagnostic exports expose the original
owners; constructor logic and guards are unchanged. Relevant shared source
dependencies are byte-identical to both historical refs. The six inspected
Projects/render/style files, including transform, origin, easing, focus rule
and tokens, are also byte-identical across all three states.

| Viewport | Current constructor gap | Stage-0 constructor gap | Phase-9 constructor gap |
| --- | ---: | ---: | ---: |
| 1440x900 | 9.138750165829038 | 9.138750165829038 | 9.138750165829038 |
| 1536x900 | 9.138725981755215 | 9.138716234222443 | 9.138716234222443 |
| 1920x917 | 9.138685063093249 | 9.138685063093249 | 9.138685063093249 |

All eight local visit-2 shelf controls and protected normalized card rectangles
match exactly. Other Stage-1 repairs alter global knot count/sample phase at
1536x900, explaining the small replay difference without changing local spline
geometry. Raw DOM, two-decimal input normalization and SVG scaling likewise
explain small DOM/replay differences. None approaches the missing ~2.86px.

This is **historical constructor/style reproduction on saved inputs**, applying
the observed focus parameters to the identical historical rules. It is not a
fresh historical browser run, full historical aggregate PASS, or retroactive
invalidation of Phase-9 acceptance. No completed ASM-PC-001/002 investigation
was restarted. The companion lineage JSON persists source hashes, nine replay
records, raw DOM witness references and the scratch harness/configuration for
recovery without relying on `/tmp` alone.

## Root, full ink and transition envelope

`projection.ts:horizontalChapterShelves` sets each Projects anchor to
`min(viewportHeight - 84, cardBottom + 42)`. Visit 2 is uncapped in these inputs.
The five staff center offsets are -24, -12, 0, 12 and 24, each stroke 0.72;
the full straight staff band is therefore 48.72px, not merely its center path.
The gently shaped shelf midpoint lies about 0.5px below its anchor. The upper
ink is about 18.14px below the idle card bottom. The link's 1px inset combined
with 4px outline and 6px used offset extends focus ink 9px beyond the card,
leaving about 9.14px. Visit 2 retains `professional-projects:reserved`, zero
events and no event primitives; empty music is not permission to omit staff.

For this unrotated middle card, let its idle bounds be `(x,y,W,H)`,
`B=y+H`, `cx=x+W/2`, and eased transform progress `e` range from 0 to 1.
With the observed 16px root, the unchanged production transition has scale
`s=1+0.025e`, upward translation `-24e` and origin `(50%,100%)`:

```text
focus left/right = cx +/- s * (W/2 + 9)
focus top        = B - 24e - s * (H + 9)
focus bottom     = B + 9 - 23.775e
```

The easing is monotone without overshoot. Thus maximum bottom occurs at
transition start, maximum horizontal reach and minimum top at its end. Their
union bounds the whole transition conservatively, including reverse traversal
while focus ink remains present. The JSON retains the resulting swept outer
rectangles. This is an analytical bound from production parameters, not a
measurement of every frame or a claim about other rotated cards/all engines.
Actual used outline/scale/root values must feed future production measurement;
do not hardcode this observed 6px offset as a cross-engine rule. Rounded-corner
outer boxes are conservative; the direct midpoint failure does not rely on
their conservative corners. Settled-only measurements miss the proven start.

## Local geometry constraints and relationship to ASM-PC-002

**No:** ASM-PC-002's authorized minimum visit-1-to-2 continuity does not
necessarily or sufficiently repair this failure while visit 2's own geometry
is held fixed. `organic-flowing.ts:buildCubicSplineSegments` builds local
uniform cubic B-spline segments from four neighboring controls, not a globally
solved spline. The current witness is in segment 190, using knots 189–192,
strictly inside visit 2's knots 187–194. The incoming connector ends before
187; the outgoing one starts after 194. At historical 1536x900 these indices
are two lower, with identical coordinates and support. Changing incoming
controls alone cannot move the physical interior locus or its staff normal.
Changing only global parameter/sample phase is not a physical clearance repair.

The existing horizontal runs between shelf endpoints are approximately
175.5042/175.5042px, 175.3434/175.3334px and 174.7372/174.7372px respectively.
Both adjacent event-free valleys use positive left-to-right connector spans.
Moving visit 2's endpoint controls would require recomputing its two local
joins, including visit 2→3, without moving visit 1/3 boundary anchors or
propagating a shared valley-rule change into unrelated geometry. A shape that
retains endpoints may need less join work; the minimum must be demonstrated
during an authorized implementation, not presumed here.

The existing cap leaves the following **straight-shelf reservation bands** for
an anchor whose full staff ink lies below the conservative focus bottom:

| Viewport | Focus bottom + 12 + 24 + 0.36 | Existing anchor cap | Available band |
| --- | ---: | ---: | ---: |
| 1440x900 | 792.094375 | 816 | 23.905625 |
| 1536x900 | 795.11 | 816 | 20.89 |
| 1920x917 | 807.51625 | 833 | 25.48375 |

These are analytical vertical room bounds, **not a proved admissible interval
for repaired spline controls**. The cap alone does not make a shelf candidate
safe. Full transition width, actual curve normals, <=18° tangent / <=6°
variation, event-free joins, unaffected neighbors and global visible geometry
can narrow the range. There is no immediate height-only impossibility, making
a bounded local geometry proposal reasonable; no candidate was implemented or
proved to satisfy the complete contract. A fixed ~3px shift is not the proposal.

The existing replay has zero proper crossings in its focused Professional
2049-point center and five 1025-point line samples; local x progression is
positive. Sampled local `24 * abs(curvature)` is about 0.855–0.857. These are
baseline diagnostics, not complete visible-run/cross-line certification or a
guarantee after movement. Changed joins can create offset cusps or crossings;
the existing global visible-segment/cross-run validator and numerical guards
must remain enabled. No final global/browser acceptance is claimed.

## Minimum proposed owner decision — approval absent

Recommend a **distinct inherited defect registration**, retaining this alias
and exactly the three proven viewport occurrences. Allocate the next valid
canonical diagnostic/ADR/ASM-IMP-DEC IDs only after explicit owner approval.

Proposed repair authority: only the second horizontal Projects notation shelf
and the minimum adjacent visit-1→2 / visit-2→3 control geometry demonstrated
necessary for continuous, event-free joins. Projection remains the geometry
owner. Derive reservation from complete rendered staff/event ink and production
idle/hover/focus/touch-equivalent envelopes over transitions, with >=12 physical
CSS pixels. Freeze card/section sizes, content, fan position/interaction,
focus styling and unrelated geometry. Visits 1 and 3 own shelves stay protected
under their existing authority; the new decision does not expand ASM-PC-002's
first-shelf scope or grant a shared/global valley redesign. No viewport branch,
fixture-specific offset, new layout solver, ink hiding or accessibility change.

On approval, normalize only the necessary canonical/OpenSpec scope references
and the candidate-qualification clauses in 012(I.B)/013(C) to evaluate the
explicitly combined, separately named envelopes. Preserve the existing rule:
at least one appropriate corrected candidate from 1440x900, 1536x900 or
1920x917 must pass the complete predicate. Old fixtures remain negative, and
universal fallback cannot manufacture completion. If no such candidate can
pass within the approved envelopes, STOP again. Governance normalization and
bounded validation must finish before a separate implementation handoff;
approval would not authorize a runtime repair in this Ultra run.

Alternatives: an explicit named amendment to 013 could authorize exactly the
same second-shelf/two-join envelope, but must identify this independent root
separately and amend the first-shelf-only wording; mere continuity clarification
is insufficient. Deferring authorization keeps Stage 1 blocked. A fallback-only
completion route would require a larger owner change to the horizontal-candidate
acceptance clause; it is not available under existing 012/013 and is not
recommended. Focus-style reduction is excluded, not an equivalent repair option.

## Preserved work, validation and next action

This run changes only this diagnostic review/JSON, the derived current handoff
and an appended progress entry. Canonical decisions, normative OpenSpec artifacts,
all 546 existing runtime/test/script/public files and prior dirty edits remain
byte-identical to the start of this run. The JSON records exact final Git status,
source digests and bounded strict/structured/diff/integrity results.

The partial `projects-capacity.ts` remains unintegrated. Preserve its original
five tests, three added pending ASM-PC-002 repair assertions and negative fixture;
the prior High result remains 5 PASS / 3 expected FAIL, not a new suite result.
Preserve ASM-PC-001 fallback/vertical/lifecycle authority, ASM-PC-002, five
existing deltas, 14 Batch-1 repairs/18 occurrences, six Batch-2 repairs/eight
occurrences, ADR-046 hydration/numeric determinism, seed/Composer semantics and
fingerprints `fnv1a32:039bce10` / `fnv1a32:1fe3356b`, approved glyphs, all three
visits, reserved/empty slots, Projects NON-ASSEMBLY, full visible ink, 12px,
zero global intersections, all validators and historical evidence.

Only the focused diagnostic replay and bounded documentation/integrity checks
run here. No repair candidate, browser matrix, final captures, broad audit,
Stage 2+, refreeze, successor motion, archive, commit, push, deploy, public
cutover or human approval. No task checkbox changes.

Next action is the owner's explicit decision on the quoted envelope above.
AI-MRP-001 and ASM-IMP-DEC-013(B–D) require the STOP; model escalation grants no
additional authority. No implementation prompt or safe downgrade is issued.

```text
ROUTING_STATUS=BLOCKED_OWNER_DECISION
SAFE_TO_DOWNGRADE=false
HUMAN_AUTHORIZATION_REQUIRED=true
SAFE_TO_CONTINUE_IMPLEMENTATION=false
```
