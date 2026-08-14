# Continuous Dual-Score Visual System

## Visual principle

The score is not a horizontal stripe repeated per section. Each branch is a wide, organic, continuous five-line musical ribbon derived from the approved Home reference.

```text
Application score ← Home origin → Professional score
```

## Geometry

- one master guide per score segment;
- five coherent offsets from the master guide;
- uniform `staffSpace`;
- long smooth curves and few inflection points;
- locally stable tangents inside detailed music/composition zones;
- stronger curvature allowed only in connector zones where readability is not harmed.

## Segment structure

Initial structural set:

- 1 shared origin;
- 6 application segments: overview, how, benefits, demo, access, terminal;
- 6 professional segments: about, services, process, projects, contact, terminal.

Each segment defines:

```yaml
entry:
  point: [x, y]
  tangent: [x, y]
  staffSpace: number
compositionZones: []
reservedZones: []
exit:
  point: [x, y]
  tangent: [x, y]
  staffSpace: number
```

Adjacent exit/entry contracts must match. Seams are not accepted as intentional design.

## Scene relationship

- Persona, modules, cards, and device may pass in front of/behind/around the score.
- Scene elements may emerge from motifs or score geometry.
- No scene may replace or reset the branch score.
- Final barline precedes terminal/footer.

## Mobile

The same semantic slots/chapters map to a vertical/serpentine ScorePath. Music composition remains the same for the session; only spatial layout changes.

## Key signature

Each continuous branch may contain at most one configured key signature, after its clef and before first relevant rhythmic material. It is never repeated by chapter.
