# Gate-C final triplet correction validation — 2026-08-24

Completed at `2026-08-24T14:15:12-03:00` on branch
`develop/site-institucional`, baseline commit
`784856b5b34ef87c8be24ab666d5d37756573ded`.

This is automated candidate evidence, not human Gate-C approval. OpenSpec task
`7.7` remains unchecked.

## Implemented geometry

- `tupletNumeralSizeSp`: `0.75 -> 0.85`.
- At `staffSpace=16`, numeral size and forced rendered width: `13.6 px`.
- Preserved `tupletNumeralSideGapSp=0.18`: `2.88 px` per side.
- Derived central opening: `13.6 + 2 * 2.88 = 19.36 px`.
- Preserved `bracketClearanceSp=0.65`, `bracketEndCapSp=0.30`, and
  `bracketThicknessSp=0.07`.
- The numeral remains centered on the complete beam-group span. Renderer
  arithmetic, notes, stems, beams, bracket placement, production SVG
  presentation, Composer values, approved glyph geometry, and responsive
  projection implementation are unchanged.

## Executed validation

| Check | Result |
| --- | --- |
| Focused Vitest renderer/presentation/Visual Lab payload suite | PASS — 8 files, 99 tests |
| Guarded `--final-triplet` evidence capture | PASS — 4 PNG, 0 JSON, 4 immutable manifests |
| Visual inspection of captures `01`, `02`, `10`, `11` | PASS — light/dark matrices and details coherent; not a substitute for human approval |
| Visual Lab + relevant axe suite, Chromium/Firefox/WebKit | PASS — 64 passed, 5 contract-intentional skips |
| Strict OpenSpec validation | PASS — `implement-music-system-v0-1` valid |
| Canonical YAML parse | PASS — 2 manifests |
| Capture CLI fail-closed checks | PASS — zero arguments and `--legacy-full` each exit `1` before server/write work |
| `git diff --check` | PASS |
| Committed visual snapshot scoped diff | PASS — clean |
| Pinned committed visual snapshots | PASS — 84/84 |
| Approved SVG scoped diff | PASS — clean |
| Pinned approved SVGs | PASS — 16/16 |
| Historical `delta-2026-08-17` seal | PASS — 40/40 |
| Graphify refresh/validation | PASS — durable graph outputs refreshed and validated |
| Graphify multigraph diagnostic | PASS — no missing/dangling endpoints, self-loops, collapsed edges, or duplicate edges |
| Graphify public-isolation paths | PASS — no path from `ScoreSvg.tsx` or `responsive-score-projection.ts` to `SiteExperienceShell.tsx` |

The 84-entry snapshot-manifest aggregate is
`ba4f23c08613c1c1c9a1481fa6d8466dd7bfa0641cf3b6ae898424966ccc6b63`.
The 16-entry SVG-manifest aggregate is
`38ad23abbd642bac57bae9781f66124a46efde90b2921de2c0811966d93bab65`.
No snapshot update command was used.

## Final capture hashes

| File | SHA-256 |
| --- | --- |
| `01-motif-matrix-light.png` | `e869028f378f69549977392900867b1c36f0ca1eaa192886e32ad836e4628a48` |
| `02-motif-matrix-dark.png` | `ddf553d1a2a74494650e5cfb739c293b40da947ffb24a297b7197bfda5e0f44a` |
| `10-triplet-detail-light.png` | `fc59e1e6d9739c772c7f557ee24357a1da3d009239571c93c1678f823d13334d` |
| `11-triplet-detail-dark.png` | `e1946a8a8641637a88c5155e7421c65886be411b08280c161b105355e7e2c913` |

## Responsive and historical immutability

No responsive image or JSON was recaptured. The retained hashes are:

- `08-responsive-vertical-mobile.png`:
  `ea3c1d1ac72107da914f9a038a703e9e61612d7aaec21d41dfd8d622e57820d4`;
- `12-responsive-orientation-light.png`:
  `75d758326b4d462f561d21594a0a189cb490c4e9e04741bd78bc0a5a99b2fb03`;
- `13-responsive-orientation-dark.png`:
  `772bc737f69eb538a36b94d7616fe1dfdc68323997136558e9b3342a6e9193e6`;
- `gate-c-delta-semantic-equivalence.json`:
  `ba25e7ebde9fb59679a78b5847000fa32d489ee26278a166fe35f79456d8e25a`.

The responsive source and test hashes also remain unchanged:

- `responsive-score-projection.ts`:
  `9c2afce254af56380afe549ddb392da790cb609795f56739f37a26dc0e71c3a6`;
- `lab-score-models.ts`:
  `1c67d3e8ee71ec229a501781473121bd575ebaa572b3268aa70005a679f3bc3e`;
- `responsive-score-projection.test.ts`:
  `0215ef1f196beb34c1f29427d33c380c87572f077ff3fe0abf6bf79d5c1f9740`.

## Deferred human work

Gate C and task `7.7` remain open only for explicit human optical approval of
the `0.85` numeral candidate. Phase 9 remains blocked on separate human review
of final public `Organic Soft` and `Organic Flowing` Score Path candidates for
`vertical-wide` and `vertical-compact`, in light and dark, authored against the
real chapter and reserved-content layouts. The current piecewise returning
connector remains a validation-only noncanonical fixture.
