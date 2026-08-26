import { getMusicGlyph } from "./registry";
import { MUSIC_GLYPH_KEYS } from "./types";
import type {
  DraftGlyphCalibration,
  GlyphAnchorsFor,
  GlyphMetrics,
  MusicGlyphKey,
  NormalizedGlyphPoint,
  RuntimeApprovedGlyphCalibration,
  RuntimeApprovedGlyphCalibrationSet,
} from "./types";

export interface GlyphCalibrationIssue {
  readonly field: string;
  readonly reason: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNormalizedPoint(point: unknown): point is NormalizedGlyphPoint {
  return (
    isRecord(point) &&
    typeof point.x === "number" &&
    typeof point.y === "number" &&
    Number.isFinite(point.x) &&
    Number.isFinite(point.y) &&
    point.x >= 0 &&
    point.x <= 1 &&
    point.y >= 0 &&
    point.y <= 1
  );
}

function isMusicGlyphKey(value: unknown): value is MusicGlyphKey {
  return (
    typeof value === "string" &&
    (MUSIC_GLYPH_KEYS as readonly string[]).includes(value)
  );
}

function isFinitePositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export function createDraftGlyphCalibration<TKey extends MusicGlyphKey>(
  assetKey: TKey,
  metrics: GlyphMetrics,
  anchors: GlyphAnchorsFor<TKey>,
): DraftGlyphCalibration<GlyphAnchorsFor<TKey>> {
  const entry = getMusicGlyph(assetKey);

  return {
    assetKey,
    status: "draft-calibration",
    coordinateSpace: "normalized-view-box",
    metrics: { ...metrics },
    anchors: { ...anchors },
    sourceSha256: { ...entry.sha256 },
  };
}

export function validateDraftGlyphCalibration(
  draft: DraftGlyphCalibration,
): readonly GlyphCalibrationIssue[] {
  const issues: GlyphCalibrationIssue[] = [];
  const { nominalHeightSp, nominalWidthSp } = draft.metrics;
  const registryEntry = getMusicGlyph(draft.assetKey);

  if (draft.status !== "draft-calibration") {
    issues.push({
      field: "status",
      reason: "must remain draft-calibration until explicit human approval",
    });
  }

  if (
    nominalWidthSp === null ||
    !Number.isFinite(nominalWidthSp) ||
    nominalWidthSp <= 0
  ) {
    issues.push({
      field: "metrics.nominalWidthSp",
      reason: "must be a finite positive staff-space value",
    });
  }

  if (
    nominalHeightSp === null ||
    !Number.isFinite(nominalHeightSp) ||
    nominalHeightSp <= 0
  ) {
    issues.push({
      field: "metrics.nominalHeightSp",
      reason: "must be a finite positive staff-space value",
    });
  }

  const expectedAnchorNames = Object.keys(registryEntry.requiredAnchors);
  const actualAnchorNames = Object.keys(draft.anchors);

  for (const name of expectedAnchorNames) {
    if (!Object.hasOwn(draft.anchors, name)) {
      issues.push({
        field: `anchors.${name}`,
        reason: "is required by the canonical glyph manifest",
      });
    }
  }

  for (const name of actualAnchorNames) {
    if (!expectedAnchorNames.includes(name)) {
      issues.push({
        field: `anchors.${name}`,
        reason: "is not declared by the canonical glyph manifest",
      });
    }
  }

  for (const [name, value] of Object.entries(draft.anchors)) {
    if (!isNormalizedPoint(value)) {
      issues.push({
        field: `anchors.${name}`,
        reason: "must be a point inside the normalized SVG viewBox",
      });
    }
  }

  if (
    draft.sourceSha256.sourceMaster !== registryEntry.sha256.sourceMaster ||
    draft.sourceSha256.runtimeCandidate !==
      registryEntry.sha256.runtimeCandidate
  ) {
    issues.push({
      field: "sourceSha256",
      reason: "must match the immutable registry checksum trace",
    });
  }

  return issues;
}

export function isCompleteDraftGlyphCalibration(
  draft: DraftGlyphCalibration,
): boolean {
  return validateDraftGlyphCalibration(draft).length === 0;
}

/**
 * Validates untrusted/imported calibration data before any runtime use.
 * Status alone never makes incomplete metrics or anchors acceptable.
 */
export function validateRuntimeGlyphCalibration(
  candidate: unknown,
): readonly GlyphCalibrationIssue[] {
  const issues: GlyphCalibrationIssue[] = [];

  if (!isRecord(candidate)) {
    return [
      {
        field: "calibration",
        reason: "must be an object",
      },
    ];
  }

  if (candidate.status !== "runtime-approved") {
    issues.push({
      field: "status",
      reason: "must be runtime-approved before runtime use",
    });
  }

  if (candidate.coordinateSpace !== "normalized-view-box") {
    issues.push({
      field: "coordinateSpace",
      reason: "must be normalized-view-box",
    });
  }

  const metrics = isRecord(candidate.metrics) ? candidate.metrics : null;

  if (!isFinitePositiveNumber(metrics?.nominalWidthSp)) {
    issues.push({
      field: "metrics.nominalWidthSp",
      reason: "must be a finite positive staff-space value",
    });
  }

  if (!isFinitePositiveNumber(metrics?.nominalHeightSp)) {
    issues.push({
      field: "metrics.nominalHeightSp",
      reason: "must be a finite positive staff-space value",
    });
  }

  if (!isMusicGlyphKey(candidate.assetKey)) {
    issues.push({
      field: "assetKey",
      reason: "must identify a canonical music glyph",
    });

    return issues;
  }

  const registryEntry = getMusicGlyph(candidate.assetKey);

  if (registryEntry.runtimeStatus !== "approved") {
    issues.push({
      field: "registry.runtimeStatus",
      reason: "canonical glyph registry entry must be approved",
    });
  }

  if (
    isFinitePositiveNumber(metrics?.nominalWidthSp) &&
    metrics.nominalWidthSp !== registryEntry.metrics.nominalWidthSp
  ) {
    issues.push({
      field: "metrics.nominalWidthSp",
      reason: "must match the canonical approved staff-space value",
    });
  }

  if (
    isFinitePositiveNumber(metrics?.nominalHeightSp) &&
    metrics.nominalHeightSp !== registryEntry.metrics.nominalHeightSp
  ) {
    issues.push({
      field: "metrics.nominalHeightSp",
      reason: "must match the canonical approved staff-space value",
    });
  }

  const expectedAnchorNames = Object.keys(registryEntry.requiredAnchors);
  const anchors = isRecord(candidate.anchors) ? candidate.anchors : null;

  for (const name of expectedAnchorNames) {
    if (!anchors || !Object.hasOwn(anchors, name)) {
      issues.push({
        field: `anchors.${name}`,
        reason: "is required by the canonical glyph manifest",
      });
      continue;
    }

    const candidateAnchor = anchors[name];
    const approvedAnchor = (
      registryEntry.requiredAnchors as unknown as Readonly<
        Record<string, NormalizedGlyphPoint | null>
      >
    )[name];

    if (!isNormalizedPoint(candidateAnchor)) {
      issues.push({
        field: `anchors.${name}`,
        reason: "must be a point inside the normalized SVG viewBox",
      });
    } else if (
      !isNormalizedPoint(approvedAnchor) ||
      candidateAnchor.x !== approvedAnchor.x ||
      candidateAnchor.y !== approvedAnchor.y
    ) {
      issues.push({
        field: `anchors.${name}`,
        reason: "must match the canonical approved normalized point",
      });
    }
  }

  if (anchors) {
    for (const name of Object.keys(anchors)) {
      if (!expectedAnchorNames.includes(name)) {
        issues.push({
          field: `anchors.${name}`,
          reason: "is not declared by the canonical glyph manifest",
        });
      }
    }
  }

  const sourceSha256 = isRecord(candidate.sourceSha256)
    ? candidate.sourceSha256
    : null;

  if (
    sourceSha256?.sourceMaster !== registryEntry.sha256.sourceMaster ||
    sourceSha256.runtimeCandidate !== registryEntry.sha256.runtimeCandidate
  ) {
    issues.push({
      field: "sourceSha256",
      reason: "must match the immutable registry checksum trace",
    });
  }

  return issues;
}

export function isRuntimeApprovedGlyphCalibration(
  candidate: unknown,
): candidate is RuntimeApprovedGlyphCalibration {
  return validateRuntimeGlyphCalibration(candidate).length === 0;
}

function approvedCalibrationFromRegistry<TKey extends MusicGlyphKey>(
  assetKey: TKey,
): RuntimeApprovedGlyphCalibration<TKey> {
  const entry = getMusicGlyph(assetKey);
  const anchors = Object.freeze(
    Object.fromEntries(
      Object.entries(entry.requiredAnchors).map(([name, point]) => [
        name,
        isNormalizedPoint(point) ? Object.freeze({ ...point }) : point,
      ]),
    ),
  );
  const candidate = Object.freeze({
    assetKey,
    status: "runtime-approved",
    coordinateSpace: "normalized-view-box",
    metrics: Object.freeze({ ...entry.metrics }),
    anchors,
    sourceSha256: Object.freeze({ ...entry.sha256 }),
  } as const);
  const issues = validateRuntimeGlyphCalibration(candidate);

  if (issues.length > 0) {
    throw new TypeError(
      `Invalid approved glyph calibration for ${assetKey}: ${issues
        .map(({ field, reason }) => `${field} ${reason}`)
        .join("; ")}`,
    );
  }

  return candidate as unknown as RuntimeApprovedGlyphCalibration<TKey>;
}

/**
 * Canonical Gate-B-approved runtime payloads. Every entry is built from the
 * immutable registry and validated on module initialization, so stale or
 * incomplete registry data fails closed before renderer use.
 */
export const APPROVED_GLYPH_CALIBRATIONS = Object.freeze({
  "wf-music-treble-clef": approvedCalibrationFromRegistry(
    "wf-music-treble-clef",
  ),
  "wf-music-notehead-filled": approvedCalibrationFromRegistry(
    "wf-music-notehead-filled",
  ),
  "wf-music-notehead-open": approvedCalibrationFromRegistry(
    "wf-music-notehead-open",
  ),
  "wf-music-accidental-sharp": approvedCalibrationFromRegistry(
    "wf-music-accidental-sharp",
  ),
  "wf-music-accidental-flat": approvedCalibrationFromRegistry(
    "wf-music-accidental-flat",
  ),
  "wf-music-accidental-natural": approvedCalibrationFromRegistry(
    "wf-music-accidental-natural",
  ),
  "wf-music-eighth-flag": approvedCalibrationFromRegistry(
    "wf-music-eighth-flag",
  ),
  "wf-music-sixteenth-double-flag": approvedCalibrationFromRegistry(
    "wf-music-sixteenth-double-flag",
  ),
} satisfies RuntimeApprovedGlyphCalibrationSet);

export const APPROVED_DOWN_FLAG_TRANSFORM = Object.freeze({
  mirrorX: false,
  mirrorY: true,
  rotationRadians: 0,
});

/** Up-master and approved down-direction transforms used by renderer tokens. */
export const APPROVED_FLAG_TRANSFORM = Object.freeze({
  up: Object.freeze({
    mirrorX: false,
    mirrorY: false,
    rotationRadians: 0,
  }),
  down: APPROVED_DOWN_FLAG_TRANSFORM,
});
