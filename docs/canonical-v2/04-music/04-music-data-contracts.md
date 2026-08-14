# Music Data Contracts

```ts
export type StaffStep = number;
export type NoteDuration = "whole" | "half" | "quarter" | "eighth" | "sixteenth";
export type StemDirection = "auto" | "up" | "down";
export type Accidental = "sharp" | "flat" | "natural";

export interface ScoreNote {
  id: string;
  at: number; // normalized position inside semantic slot/segment
  staffStep: StaffStep;
  duration: NoteDuration;
  accidental?: Accidental;
  stemDirection?: StemDirection;
  beamGroupId?: string;
}

export interface ContinuousScoreConfig {
  branch: "application" | "professional";
  clef: "treble";
  keySignature: { fifths: -7|-6|-5|-4|-3|-2|-1|0|1|2|3|4|5|6|7 };
  semanticSlotIds: readonly string[];
}

export interface ComposedMotif {
  id: string;
  motifId: RhythmMotifId;
  slotId: string;
  notes: readonly { staffStep: StaffStep; duration: NoteDuration }[];
}

export interface ComposedScoreSegment {
  chapterId: string;
  seed: string;
  composerVersion: 1;
  motifs: readonly ComposedMotif[];
}
```

## Glyph required anchors

- treble clef: `gLine`;
- noteheads: `opticalCenter`, `stemUp`, `stemDown`;
- accidentals: `pitchCenter`;
- flags: `stemAttachment`.

## Render-layer order

```text
staff
key signature
ledger lines
accidentals
noteheads/stems/flags
beams/hooks/tuplets
barlines
scene masks/reveal layers
```

Each rendered event uses stable `wf-*` IDs/data attributes for debugging/motion, while the narrative SVG remains hidden from assistive technology.
