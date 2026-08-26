# Gate-C final triplet numeral comparison — 2026-08-24

Status: final optical candidate; human Gate-C approval and task `7.7` remain
pending.

## Exact delta

| Metric at `staffSpace=16` | Previous candidate | Final candidate |
| --- | ---: | ---: |
| `tupletNumeralSizeSp` | `0.75` (`12 px`) | `0.85` (`13.6 px`) |
| rendered numeral width | `12 px` | `13.6 px` |
| `tupletNumeralSideGapSp` | `0.18` (`2.88 px`) | unchanged |
| central bracket opening | `17.76 px` | `19.36 px` |

The opening remains `renderedNumeralWidth + 2 * sideGap`, split symmetrically
around the numeral centered on the complete beam-group span.

The following values are unchanged: `bracketClearanceSp=0.65`,
`bracketEndCapSp=0.30`, and `bracketThicknessSp=0.07`. Notes, stems, beams,
bracket placement/spacing, renderer arithmetic, SVG primitives, and approved
Gate-B glyph geometry are unchanged.

## Image comparison

| Capture | Previous `0.75` candidate SHA-256 | Final `0.85` candidate SHA-256 |
| --- | --- | --- |
| `01-motif-matrix-light.png` | `18a849d4952fead97ec2274987a775db396c6bcaf67ed2e7fad79e2f66af2027` | `e869028f378f69549977392900867b1c36f0ca1eaa192886e32ad836e4628a48` |
| `02-motif-matrix-dark.png` | `e2b6ba40501ecfe541fa1c6fac2e951a80e4bdc52ec39fb7a3692f0debce5485` | `ddf553d1a2a74494650e5cfb739c293b40da947ffb24a297b7197bfda5e0f44a` |
| `10-triplet-detail-light.png` | `60989f764cf258623cfd26cf3aafcba49d0229c97fd79f02d1263f27cd4c7f9a` | `fc59e1e6d9739c772c7f557ee24357a1da3d009239571c93c1678f823d13334d` |
| `11-triplet-detail-dark.png` | `6d5d136406f0d628104a47d06e54cbe6b39694a76a52be8291a236bf8aac552f` | `e1946a8a8641637a88c5155e7421c65886be411b08280c161b105355e7e2c913` |

The previous files remain sealed in `../delta-2026-08-17/`; the final files
are stored only in this directory. Responsive captures `08`, `12`, and `13`
were not recaptured or modified.
