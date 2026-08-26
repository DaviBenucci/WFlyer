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
- locally horizontal or gently inclined, left-to-right tangents inside
  notation-safe composition zones;
- stronger curvature, steep descent, and viewport-return movement allowed only
  in connector zones, which preserve all five lines but contain no musical
  events.

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

Mobile uses vertical document/narrative progression, not vertically rotated
musical engraving. The continuous ribbon alternates short, locally horizontal
or gently inclined, left-to-right notation-safe zones with event-free connector
zones that provide vertical displacement. A returning serpentine span is a
connector, never a 180-degree-reversed notation zone.

The approved treble clef remains upright in a notation-safe origin zone. The
final barline remains conventionally oriented in a notation-safe terminal zone.
The same semantic slots/chapters and session composition map into responsive
geometry; only ScorePath projection, physical grouping/spacing, local capacity,
and surrounding scene arrangement change.

The current piecewise quarter-turn/straight-span returning connector is a
validation-only noncanonical fixture. It proves continuity, safe offsets,
event-free connector zones, and conventional notation orientation; it is not
the final responsive visual design and must not be presented as such.

### Phase-9 final organic Score Path subgate

Before public integration, Phase 9 must produce `Organic Soft` and `Organic
Flowing` candidates for both `vertical-wide` and `vertical-compact`, with light
and dark evidence for each. Candidate master guides must use long, smooth,
asymmetric cubic Bézier curves with few inflections and tangent/curvature
continuity across joins. They must avoid repeated identical 180-degree U-turns,
mirrored hairpins, identical radii, rigid rectangular returns, and unnecessarily
long straight connector plateaus.

Vertical drop and lateral return must follow the real layouts and reserved zones
for headings/body, W_Flyer Persona, Services, Process, Project cards, Contact
form, application tablet/demo, and terminal areas. All five lines must remain
free of cusp, crossing, collapse, and self-intersection. Musical events remain
inside notation-safe zones, connector zones remain event-free, and semantic slot
IDs/composition remain unchanged. Candidate authoring stops for explicit human
Score Path approval before integration continues.

## Key signature

Each continuous branch may contain at most one configured key signature, after its clef and before first relevant rhythmic material. It is never repeated by chapter.
