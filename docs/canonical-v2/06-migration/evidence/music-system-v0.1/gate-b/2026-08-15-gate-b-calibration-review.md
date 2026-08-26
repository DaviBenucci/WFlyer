# Music System v0.1 Gate B — approved calibration review

**Captured:** 2026-08-15 in the development-only Music Visual Lab  
**Status:** `approved` — **EXTERNAL HUMAN VISUAL REVIEW COMPLETE**  
**Approval date:** 2026-08-15  
**Approval authority:** external human reviewer / repository owner approval  
**Runtime/manifest approval performed:** Yes

This packet records the completed mandatory Gate B review. The external human reviewer
approved the exact draft values below and the proposed down-flag transform. The values
were promoted into the canonical calibration register and visual-library manifest,
and every glyph `runtimeStatus` became `approved`. The immutable source/runtime SVG
paths and their recorded checksums were not edited.

## Approved values

Coordinates are normalized to each immutable SVG viewBox. Dimensions are in
`staffSpace` units.

| Asset | Approved width × height | Approved anchors | Context screenshot |
|---|---:|---|---|
| `wf-music-treble-clef` | `2.614 × 6.400` | `gLine=(0.500, 0.620)` | `03-calibration-treble-clef.png` |
| `wf-music-notehead-filled` | `1.248 × 0.900` | `opticalCenter=(0.500, 0.500)`; `stemUp=(0.925, 0.340)`; `stemDown=(0.075, 0.660)` | `04-calibration-notehead-filled.png` |
| `wf-music-notehead-open` | `1.248 × 0.900` | `opticalCenter=(0.500, 0.500)`; `stemUp=(0.925, 0.340)`; `stemDown=(0.075, 0.660)` | `05-calibration-notehead-open.png` |
| `wf-music-accidental-sharp` | `1.164 × 2.000` | `pitchCenter=(0.500, 0.515)` | `06-calibration-accidental-sharp.png` |
| `wf-music-accidental-flat` | `0.869 × 2.400` | `pitchCenter=(0.500, 0.680)` | `07-calibration-accidental-flat.png` |
| `wf-music-accidental-natural` | `0.835 × 2.200` | `pitchCenter=(0.500, 0.500)` | `08-calibration-accidental-natural.png` |
| `wf-music-eighth-flag` | `1.431 × 2.250` | `stemAttachment=(0.105, 0.125)` | `09-calibration-eighth-flag.png` |
| `wf-music-sixteenth-double-flag` | `1.538 × 2.500` | `stemAttachment=(0.105, 0.125)` | `10-calibration-sixteenth-double-flag.png` |

The original machine-readable proposal, including both immutable asset checksums,
remains preserved as `draft-glyph-calibration.json`. It is historical review input;
the canonical approved runtime values now live in the visual-library manifest and
calibration register.

## Approved down-flag transform

The external human review approved the proposed transform for both flag glyphs:

```json
{
  "mirrorX": false,
  "mirrorY": true,
  "rotationRadians": 0
}
```

## Immutable checksum trace

| Asset | Source-master SHA-256 | Runtime-candidate SHA-256 |
|---|---|---|
| `wf-music-treble-clef` | `4d88345cb486a5f5aa5012adfa5b8ff5b373f30d5e51ce74c3236ac770e66f17` | `44a96b7cdcf968cf02c4f12673ed848fff387836f56e1fcb9a74070ae4c9064d` |
| `wf-music-notehead-filled` | `37f888799e03c4f2274b02275a7e742b69ef228683bdabbc142ca5485d82b8c1` | `026c358f82ef3e1f4c8532584570e7c9756748d823a02c6d03c8b0c437e0421f` |
| `wf-music-notehead-open` | `c0a69eba08fa256883469c96c63abede90074b0afa4cc613eb4ee8fb0578cc50` | `2655c9bfb810b223431aa2bf74e17902f223da24d1034c7708836d7b07693e1c` |
| `wf-music-accidental-sharp` | `1306551170b06814ae1874cfa7b759c1f3269878bd46516f0d1d4852e0f75227` | `63108db9625ded7c712c8a6cfca9ee644d166a2ab81ad62ea478ea89b1ac8222` |
| `wf-music-accidental-flat` | `2ac206d58b2c90709595653e79f56a5acb558f9e8379ec2db81f9c16909823ff` | `005894cfdc22e462302ec142dbb1b7fd6641f2e714e47481fcdcbfddf241cfcb` |
| `wf-music-accidental-natural` | `77ea774437b79958a86e61eddd98912cd4c350a2dab7015ce63329669750cb05` | `8e316378a06088afb4bd528b2b64f31424abc2282d60a632cdccd2b1d0d463af` |
| `wf-music-eighth-flag` | `ca10cf10414caf67584de93ab91b42b125f45848fe9d09beeb6491d0b74a04f3` | `b57a19e3a299abde7f300f5a32ed91bedf86d530cc7528eaef965394809e0bad` |
| `wf-music-sixteenth-double-flag` | `e69df994c6ec4369f80f57a08cb686cac8838f417a13798123d114cb650a7446` | `59df5110560ec9f8542c38cc4c7e2b84d11a9353f284958a45fa4d6674dd682f` |

## Evidence index

- `01-glyph-gallery-light.png` and `02-glyph-gallery-dark.png`: all eight immutable
  glyph candidates at 25%, 50%, 100%, and 200%.
- `03-glyph-calibration-composites-light.png` and
  `04-glyph-calibration-composites-dark.png`: the complete review surface in both
  themes, with five-line staff context, visible glyph bounds, named anchors, note
  connections, and the proposed draft-only placements described below.
- `03`–`10-calibration-*.png`: per-glyph controls, visible viewBox, every required
  anchor, five-line staff context, and paired light/dark views.
- `11-calibration-accidentals-line-space.png`: sharp, flat, and natural on both a line
  and a space.
- `12-pitches-ledgers-stems-flags.png`: C4–A5 ladder, A3–E6 extended ledgers, and
  isolated up/down stem/flag fixtures.
- `13-beams-triplets-hooks.png`: every whitelisted linked topology, triplet in both
  stem directions, bracket/centered `3`, and mixed hooks.
- `14-key-signatures-and-barlines.png`: fifths `-7..+7`, ordinary barline, and ordered
  thin-gap-thick final barline.
- `15-straight-arc-s-curve-score-paths.png`: straight, gentle arc, and gentle S-curve
  using the B4 middle-line master guide.
- `16-composer-four-profiles-explicit-seed.png`: CALM, BALANCED, ACTIVE, and TERMINAL
  with explicit seed/chapter, reserved slot, and enabled debug overlay.
- `SHA256SUMS.txt`: hashes for 19 PNGs and the exported JSON;
  `sha256sum --check --strict SHA256SUMS.txt` passes 20/20. Its final SHA-256 is
  `e2c086d1b61491e95f6c5e1df30f24569d8209b98ffc6ee6d5b8e0fb9e51a9f8`.

## Composite review map

The light and dark composite screenshots are the mandatory visual review surfaces.
They show the same draft geometry against both governed themes:

| Review criterion | Visible composite evidence |
|---|---|
| Treble clef | A five-line staff, the G4 second line, and the named `gLine` anchor aligned on that line. |
| Noteheads | Filled and open noteheads on line and space positions, each shown with stem-up and stem-down connections plus named `opticalCenter`, `stemUp`, and `stemDown` anchors. |
| Accidentals | Sharp, flat, and natural on both line and space positions beside a notehead, with each named `pitchCenter` visible. |
| Flags | Eighth and sixteenth flags attached to stems in both directions, with each named `stemAttachment` visible. |

These images formed the reviewed Gate B evidence. The reviewer approved the metrics,
anchors, down-flag transform, canonical-register promotion, and isolated runtime use
of these glyph calibrations. They are not Gate C visual goldens.

The evidence was captured with:

```bash
node scripts/capture-music-gate-b-evidence.mjs
```

At capture time the script started a loopback development server only when needed,
asserted draft-only status and fixture counts, exported the draft envelope, captured
the evidence, then stopped the server it owned. The draft JSON and screenshots remain
unchanged as the inputs that were actually reviewed.

The final capture completed with all draft-only and fixture assertions, and all 20
manifest entries verify locally. Earlier cold Chromium development runs showed minor
PNG hash variance, so cross-host byte identity is not claimed and these images are
review evidence rather than approved visual goldens.

## External human decision record

The reviewer approved all eight glyph calibrations exactly as proposed and recorded
these findings:

- the treble-clef `gLine` anchor aligns correctly with G4 on the second staff line;
- filled and open noteheads have consistent optical scale;
- stem-up and stem-down connections show no visible gaps or excessive intrusion;
- sharp, flat, and natural pitch centers align correctly on line and space fixtures;
- eighth and sixteenth flags attach correctly in both stem directions;
- all glyphs remain coherent and legible in the supplied light/dark and scale fixtures.

## Approval boundary

Gate B approves only the exact glyph metrics/anchors and down-flag transform recorded
above. It does not approve final Gate C visual goldens or final optical tuning of
renderer primitives and composer presentation. Beam thickness/slope/spacing, hooks,
triplet bracket clearance, key-signature spacing, final-barline tokens, ScorePath
composition, composer profile weights, and canonical cross-host snapshot decisions
remain Gate C responsibilities. The public landing and legacy score implementation
remain untouched, and Gate C still requires its own explicit human approval.
