import type { MotifDefinition, MotifId } from "./types";

const TRIPLET_METADATA = Object.freeze({
  bracket: true,
  count: 3,
  label: "3",
  labelPosition: "center",
} as const);

export const AUTOMATIC_MOTIF_IDS = Object.freeze([
  "Q1",
  "Q2",
  "Q3",
  "Q4",
  "H1",
  "H2",
  "W1",
  "E8_E8",
  "E8_TRIPLET_3",
  "S16_S16_S16_S16",
  "E8_S16_S16",
  "S16_S16_E8",
  "S16_E8_S16",
] as const satisfies readonly MotifId[]);

const definitions = {
  Q1: {
    id: "Q1",
    family: "quarter",
    durations: ["quarter"],
    dense: false,
    primaryBeam: false,
    secondaryBeam: "none",
  },
  Q2: {
    id: "Q2",
    family: "quarter",
    durations: ["quarter", "quarter"],
    dense: false,
    primaryBeam: false,
    secondaryBeam: "none",
  },
  Q3: {
    id: "Q3",
    family: "quarter",
    durations: ["quarter", "quarter", "quarter"],
    dense: false,
    primaryBeam: false,
    secondaryBeam: "none",
  },
  Q4: {
    id: "Q4",
    family: "quarter",
    durations: ["quarter", "quarter", "quarter", "quarter"],
    dense: false,
    primaryBeam: false,
    secondaryBeam: "none",
  },
  H1: {
    id: "H1",
    family: "half",
    durations: ["half"],
    dense: false,
    primaryBeam: false,
    secondaryBeam: "none",
  },
  H2: {
    id: "H2",
    family: "half",
    durations: ["half", "half"],
    dense: false,
    primaryBeam: false,
    secondaryBeam: "none",
  },
  W1: {
    id: "W1",
    family: "whole",
    durations: ["whole"],
    dense: false,
    primaryBeam: false,
    secondaryBeam: "none",
  },
  E8_E8: {
    id: "E8_E8",
    family: "eighth",
    durations: ["eighth", "eighth"],
    dense: false,
    primaryBeam: true,
    secondaryBeam: "none",
  },
  E8_TRIPLET_3: {
    id: "E8_TRIPLET_3",
    family: "triplet",
    durations: ["eighth", "eighth", "eighth"],
    dense: true,
    primaryBeam: true,
    secondaryBeam: "none",
    tuplet: TRIPLET_METADATA,
  },
  S16_S16_S16_S16: {
    id: "S16_S16_S16_S16",
    family: "sixteenth",
    durations: ["sixteenth", "sixteenth", "sixteenth", "sixteenth"],
    dense: true,
    primaryBeam: true,
    secondaryBeam: "continuous",
  },
  E8_S16_S16: {
    id: "E8_S16_S16",
    family: "mixed",
    durations: ["eighth", "sixteenth", "sixteenth"],
    dense: true,
    primaryBeam: true,
    secondaryBeam: "trailing-pair",
  },
  S16_S16_E8: {
    id: "S16_S16_E8",
    family: "mixed",
    durations: ["sixteenth", "sixteenth", "eighth"],
    dense: true,
    primaryBeam: true,
    secondaryBeam: "leading-pair",
  },
  S16_E8_S16: {
    id: "S16_E8_S16",
    family: "mixed",
    durations: ["sixteenth", "eighth", "sixteenth"],
    dense: true,
    primaryBeam: true,
    secondaryBeam: "left-and-right-hooks",
  },
} as const satisfies Record<MotifId, MotifDefinition>;

for (const definition of Object.values(definitions)) {
  Object.freeze(definition.durations);
  Object.freeze(definition);
}

export const MOTIF_DEFINITIONS: Readonly<Record<MotifId, MotifDefinition>> =
  Object.freeze(definitions);

const motifIds = new Set<string>(AUTOMATIC_MOTIF_IDS);

export function isMotifId(value: string): value is MotifId {
  return motifIds.has(value);
}

export function getMotifDefinition(motifId: MotifId): MotifDefinition {
  return MOTIF_DEFINITIONS[motifId];
}

export const TERMINAL_MOTIF_IDS = Object.freeze([
  "Q1",
  "Q2",
  "H1",
  "H2",
  "W1",
] as const satisfies readonly MotifId[]);

const terminalIds = new Set<MotifId>(TERMINAL_MOTIF_IDS);

export function isTerminalMotif(motifId: MotifId): boolean {
  return terminalIds.has(motifId);
}
