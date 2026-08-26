import { APPROVED_COMPOSER_CALIBRATION_V1 } from "@/lib/music/composer/profiles";
import { hashSeedParts } from "@/lib/music/composer/prng";
import type {
  ComposedSegment,
  ComposerProfile,
} from "@/lib/music/composer/types";

import { APPROVED_RENDERER_TOKENS } from "./draft-calibration";
import { composeLabSegment } from "./lab-score-models";

export const GATE_C_SEMANTIC_PROJECTION_VERSION = 1 as const;
export const GATE_C_FIXED_SEED_CHAPTER_ID =
  "music-gate-c-fixed-seed-review";

export const GATE_C_PROFILES = Object.freeze([
  "CALM",
  "BALANCED",
  "ACTIVE",
  "TERMINAL",
] as const satisfies readonly ComposerProfile[]);

export const GATE_C_FIXED_SEEDS = Object.freeze([
  Object.freeze({
    id: "origin",
    label: "Origin",
    sessionSeed: "wflyer-music-gate-c-origin-v1",
  }),
  Object.freeze({
    id: "flight",
    label: "Flight",
    sessionSeed: "wflyer-music-gate-c-flight-v1",
  }),
  Object.freeze({
    id: "return",
    label: "Return",
    sessionSeed: "wflyer-music-gate-c-return-v1",
  }),
] as const);

export const GATE_C_APPROVED_STATUSES = Object.freeze({
  composerCalibration: "approved-external-human-review",
  rendererTokens: "approved-external-human-review",
} as const);

export const GATE_C_APPROVED_RENDERER_TOKEN_PAYLOAD = Object.freeze({
  status: GATE_C_APPROVED_STATUSES.rendererTokens,
  inheritedApprovedInputs: Object.freeze({
    noteFlagTransform: "approved-gate-b",
  }),
  tokens: APPROVED_RENDERER_TOKENS,
});

export const GATE_C_APPROVED_COMPOSER_CALIBRATION_PAYLOAD = Object.freeze({
  status: GATE_C_APPROVED_STATUSES.composerCalibration,
  profiles: APPROVED_COMPOSER_CALIBRATION_V1,
});

export interface GateCSemanticProjectionV1 {
  readonly schemaVersion: typeof GATE_C_SEMANTIC_PROJECTION_VERSION;
  readonly composerVersion: ComposedSegment["composerVersion"];
  readonly pitchContourTableVersion: ComposedSegment["pitchContourTableVersion"];
  readonly branchId: string;
  readonly chapterId: string;
  readonly derivedChapterSeed: string;
  readonly profile: ComposerProfile;
  readonly motifs: readonly {
    readonly slotId: string;
    readonly motifId: string;
    readonly family: string;
    readonly durations: readonly string[];
    readonly staffSteps: readonly number[];
    readonly contourId: string;
    readonly contourTranslation: number;
    readonly dense: boolean;
    readonly tuplet: ComposedSegment["motifs"][number]["tuplet"] | null;
  }[];
  readonly emptySlots: ComposedSegment["emptySlots"];
}

export interface GateCFixedSeedMatrixEntry {
  readonly seedId: (typeof GATE_C_FIXED_SEEDS)[number]["id"];
  readonly seedLabel: (typeof GATE_C_FIXED_SEEDS)[number]["label"];
  readonly sessionSeed: string;
  readonly profile: ComposerProfile;
  readonly segment: ComposedSegment;
  readonly projection: GateCSemanticProjectionV1;
  readonly canonicalJson: string;
  readonly semanticHash: string;
}

export function projectGateCComposerSemantics(
  segment: ComposedSegment,
): GateCSemanticProjectionV1 {
  return Object.freeze({
    schemaVersion: GATE_C_SEMANTIC_PROJECTION_VERSION,
    composerVersion: segment.composerVersion,
    pitchContourTableVersion: segment.pitchContourTableVersion,
    branchId: segment.branchId,
    chapterId: segment.chapterId,
    derivedChapterSeed: segment.seed,
    profile: segment.profile,
    motifs: Object.freeze(
      segment.motifs.map((motif) =>
        Object.freeze({
          slotId: motif.slotId,
          motifId: motif.motifId,
          family: motif.family,
          durations: motif.durations,
          staffSteps: motif.staffSteps,
          contourId: motif.contourId,
          contourTranslation: motif.contourTranslation,
          dense: motif.dense,
          tuplet: motif.tuplet ?? null,
        }),
      ),
    ),
    emptySlots: segment.emptySlots,
  });
}

export function canonicalizeGateCSemanticProjection(
  projection: GateCSemanticProjectionV1,
): string {
  return JSON.stringify(projection);
}

export function hashGateCSemanticProjection(
  canonicalJson: string,
): string {
  const hash = hashSeedParts([
    "wflyer-music-gate-c-semantic-projection",
    GATE_C_SEMANTIC_PROJECTION_VERSION,
    canonicalJson,
  ]);

  return `fnv1a32-v1-${hash.toString(16).padStart(8, "0")}`;
}

export function buildGateCFixedSeedMatrix(): readonly GateCFixedSeedMatrixEntry[] {
  return Object.freeze(
    GATE_C_FIXED_SEEDS.flatMap((seed) =>
      GATE_C_PROFILES.map((profile) => {
        const segment = composeLabSegment(
          profile,
          seed.sessionSeed,
          GATE_C_FIXED_SEED_CHAPTER_ID,
        );
        const projection = projectGateCComposerSemantics(segment);
        const canonicalJson = canonicalizeGateCSemanticProjection(projection);

        return Object.freeze({
          seedId: seed.id,
          seedLabel: seed.label,
          sessionSeed: seed.sessionSeed,
          profile,
          segment,
          projection,
          canonicalJson,
          semanticHash: hashGateCSemanticProjection(canonicalJson),
        });
      }),
    ),
  );
}

function findComposerOwnedKeySignatureFields(
  value: unknown,
  path = "$",
): readonly string[] {
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) =>
      findComposerOwnedKeySignatureFields(entry, `${path}[${index}]`),
    );
  }

  if (!value || typeof value !== "object") return [];

  return Object.entries(value).flatMap(([key, entry]) => {
    const entryPath = `${path}.${key}`;
    const ownMatch =
      key === "fifths" || key === "keySignature" ? [entryPath] : [];

    return [
      ...ownMatch,
      ...findComposerOwnedKeySignatureFields(entry, entryPath),
    ];
  });
}

export function buildComposerKeySignatureBoundaryEvidence() {
  const matrix = buildGateCFixedSeedMatrix();
  const forbiddenFieldPaths = matrix.flatMap((entry, index) =>
    findComposerOwnedKeySignatureFields(entry.segment, `$matrix[${index}]`),
  );

  return Object.freeze({
    composerCasesInspected: matrix.length,
    forbiddenFieldPaths: Object.freeze(forbiddenFieldPaths),
    keySignatureOwnership: "renderer-authored-outside-composer" as const,
  });
}
