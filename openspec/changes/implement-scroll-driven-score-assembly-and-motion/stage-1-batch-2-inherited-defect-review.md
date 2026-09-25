# Stage-1 Batch-2 inherited-defect supplement — 2026-09-09

Six distinct CLASS-C inherited defects have eight current viewport occurrences.
All are visible staff-line crossings in `horizontal-enhanced`; retained
2,049-sample center-path records detect zero crossings in these four inputs.
This is a sampled diagnostic, not a mathematical proof or final geometry PASS.

The original Batch-1 review/JSON remain unchanged. Their `ASM-SI-001..014`
identify 14 repaired defects; `015..018` are the original four static repeats.
Batch 2 uses the next six identities `ASM-SI-019..024`. No Batch-2 repair has
been performed. ADR-047 / ASM-IMP-DEC-011 authorizes their future local repair;
this governance run stops before implementation.

## Exact inventory

Coordinates below are intersections of the current full-precision rendered
staff edges in branch SVG user coordinates. Edge indices are zero-based, and
each edge i joins point i to i+1 in the complete 1,025-point staff line.
Exact endpoints, canonical DOM endpoints, full line/primitive IDs, positive
opacity, zone IDs, both predecessor records, and replay inputs are persisted in
[the diagnostic companion](stage-1-batch-2-inherited-defect-diagnostics.json).

| Stable defect ID | Transition / envelope | Viewport | Staff step | Current edges | Approximate crossing (x, y) |
|---|---|---|---:|---|---|
| `ASM-SI-019` | Demo → Launch | 1440x900 | 0 | 886 / 889 | (1033.400, 747.941) |
| `ASM-SI-019` | Demo → Launch | 1536x900 | 0 | 887 / 890 | (1097.614, 748.009) |
| `ASM-SI-019` | Demo → Launch | 1920x917 | 0 | 887 / 890 | (1370.810, 756.567) |
| `ASM-SI-020` | Home → About: first fold | 1100x640 | 0 | 102 / 106 | (7588.827, 393.270) |
| `ASM-SI-021` | Home → About: arrival fold | 1100x640 | 8 | 134 / 138 | (7706.373, 529.934) |
| `ASM-SI-022` | Services interaction lead-out | 1100x640 | 0 | 495 / 499 | (10201.156, 459.450) |
| `ASM-SI-023` | Services interaction → trailing shelf | 1100x640 | 8 | 498 / 508 | (10216.062, 413.826) |
| `ASM-SI-024` | Services trailing shelf → Process connector | 1100x640 | 0 | 510 / 523 | (10223.613, 461.274) |

`ASM-SI-019` has three viewport manifestations of one Demo→Launch local
return defect; they are not three repair authorizations. IDs `020..024` each
have one 1100x640 occurrence. About uses `connector:1`; Services ingress/exit
uses `connector:3`, `notation:professional-services:4`, and adjacent
`connector:4` / `professional-process`, as specified per occurrence in JSON.
Edge indices are diagnostic coordinates, not hard-coded runtime conditions.

## Inherited reproduction and limits

- Stage 0: `40e6ae1a8996c53ed2ec372c47f16bc073d6cee9`.
- Frozen Phase 9: `306ccb74da6c7bbf8f187e360c0776c571b5fc3d`.
- Both commits have identical `src` tree
  `3ba3c4f8b2935d9ce1120ba7ac7a9cb373bea21d`; archived Projection/geometry
  source bytes were checked directly against both Git objects.
- All six distinct defects reproduce through complete historical Projection
  at 1440x900 (Application) and 1100x640 (five Professional defects).
  Professional crossing endpoints/indices are exactly identical in Stage 0,
  Phase 9, pre-Batch-1 worktree, and current worktree.
- At 1536x900 and 1920x917, complete historical Projection rejects the current
  DOM inputs at its aggregate Task-34 invariant. Those error records remain in
  JSON. To establish the duplicate occurrences, an isolated diagnostic bundle
  exports the unchanged historical `buildBranchProjection` and
  `horizontalGeometry` functions. It reproduces only the already-discovered
  Application `connector:5` envelope at both widths. No repository export or
  acceptance guard was modified; this does not assert a historical global PASS.
- The full 28-knot Demo→Launch connector neighborhood is byte-equivalent
  between current, Stage 0, and Phase 9 at each of the three widths. Its
  hashes and points are retained. Historical 1440 edges 887/890 become current
  886/889 because global path sampling reflects earlier authorized changes;
  the local connector geometry itself is unchanged. At the other two widths
  both use 887/890. All eight current crossings are unchanged by Batch-1 repairs.
- Existing four Chromium failure attachments were recovered; no browser was
  rerun and no final evidence was generated in this governance run.

## Geometry ownership and bounded next action

`src/lib/story/score/projection.ts` owns the affected geometry. The known
Application owner is `horizontalApplicationReturn`, selected through
`pushHorizontalConnector` for Demo→Launch; `horizontalGeometry` supplies its
chapter shelves/lane. Professional About is selected by
`prependApprovedOrigin` between `horizontalProfessionalBridge` and
`horizontalProfessionalAboutBoundaryBridge`; the exact selected helper must
be confirmed against the saved 1100x640 input before a local edit. Services
uses the measured card-interaction bridge, trailing shelf, and Process departure
in this same Projection owner. `choreographModel` owns staff spreading; it is
not an authorization to change global spread or visibility.

The first next-run action is to turn the three saved `ASM-SI-019` inputs into
focused regression fixtures using the existing independent complete-segment
validator, then change only the Demo→Launch crossing envelope and minimum
adjacent continuity support in `projection.ts`. Preserve the 14 Batch-1 repairs
and completed ADR-046 hydration solution. Next repair `020..024` from their
saved measured input, grouping shared control-point owners without broad
branch reshaping. No algorithm or repair is prescribed by this diagnostic.

The authorized scope is exactly these six local envelopes, plus minimum
adjacent geometry needed to remove each crossing and preserve continuity.
The global zero center-path/visible-staff contract, complete visible-segment
validator, positive-opacity runs, existing `1e-7` guards, event footprint and
protected-content thresholds remain unchanged. No changed-zone validator,
ignore list, coarser sampling, hidden crossing, dimension-specific bypass,
Composer change, aesthetic redesign, Stage-3 metadata, or motion is allowed.
Anything newly inherited outside Batch 1 + Batch 2 triggers another explicit
STOP. A repair requiring material expansion also stops before that expansion.

## Preserved checkpoints and remaining implementation validation

Before this governance run, all eight branch/default-mode records had zero
center/staff crossings, focused tests passed 49/49, and the serial full unit
run passed 97 files / 774 tests. These retained results preserve Batch-1 status;
they do not establish global acceptance for the measured Batch-2 inputs.
Default-fixture locality records retain zero point/tangent changes outside
changed spline support and unchanged group mappings/clearance minima.

The completed numerical/hydration checkpoint remains in
`stage-1-numeric-determinism-diagnostics.json`: six focused three-engine cases
PASS, SSR/first-client canonical metadata/SVG and semantic equality, zero
hydration warnings/page errors, unchanged allocator semantics and full-precision
safety. No rounding of safety inputs or new allocator behavior is authorized.

The interrupted final matrix is not PASS. Final lint is also pending: the
capture draft has one unused `historicalProjectsReferences` warning; the later
raw TypeScript run found conflicting generated Next route types. Re-run the
repository `pnpm typecheck` owner after the later implementation environment
is refreshed. The capture draft still needs actual center-path replay from
measured inputs instead of a pending-replay label. These are bounded validation/
evidence completion tasks for the High run, not permission for new geometry.

Successor task accounting remains 7/92; 2.7–2.10 remain unchecked. After focused
repairs, deterministic global geometry must be clean before the final serial
Chromium/Firefox/WebKit matrix and successor-only inspected captures. Evidence
must separately retain inherited baseline, local correction, and final clean
state for both batches. STOP at Human Geometry Approval; no Stage 2+, refreeze,
motion, commit, push, deploy, or historical-evidence mutation.

## Historical integrity

All four Phase-9 manifest/seal pairs and all 64 payloads were compared directly
with both frozen Phase-9 and Stage-0 Git blobs, in addition to SHA-256 checks.
All are byte-identical. Per-payload hashes and verification results are in the
JSON companion. Phase 9 remains CLOSED and historically valid under its
contemporary validator/evidence. The stronger successor discovery does not
rewrite those historical acceptance statements.
