# Migration Notes

## Canonical filename mapping

| Legacy filename | Canonical asset |
|---|---|
| `Clave-de-sol-WFlyer.svg` | `wf-music-treble-clef` |
| `Notehead-preenchida.svg` | `wf-music-notehead-filled` |
| `Notehead-aberta.svg` | `wf-music-notehead-open` |
| `Sustenido.svg` | `wf-music-accidental-sharp` |
| `Bemol.svg` | `wf-music-accidental-flat` |
| `Bequadro.svg` | `wf-music-accidental-natural` |
| `Colchete.svg` | `wf-music-eighth-flag` |
| `Colchetes-duplos.svg` | `wf-music-sixteenth-double-flag` |

## Legacy primitive files intentionally removed

- `Conexao-primaria.svg`
- `Haste-musical-stem-downward.svg`
- `Pauta-Base.svg`
- `Pauta-Com-master-line.svg`

Do not restore these as production glyph assets. Their responsibilities belong to the deterministic renderer.

## Important correction

The master guide is logical `ScorePath` geometry. It is **not** a dashed replacement for the middle visible staff line. All five visible staff lines remain continuous and are offset from the master path by `staffSpace`.
