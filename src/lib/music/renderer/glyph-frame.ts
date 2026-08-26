import type { ScorePathFrame } from "../geometry/types";
import { dotVectors, leftNormal, scaleVector } from "../geometry/vectors";

/** Absolute tolerance for verifying the orthonormal ScorePath frame. */
export const GLYPH_FRAME_ALIGNMENT_EPSILON = 1e-7;

export interface GlyphLocalTransform {
  readonly mirrorX: boolean;
  readonly mirrorY: boolean;
  readonly rotationRadians: number;
}

const IDENTITY_GLYPH_TRANSFORM: GlyphLocalTransform = {
  mirrorX: false,
  mirrorY: false,
  rotationRadians: 0,
};

/**
 * Maps glyph-local +x to score progression T and glyph-local +y toward
 * decreasing pitch (-N). The reflection is derived from the full T/N frame,
 * so reversing traversal cannot silently flip pitch-relative glyph geometry.
 */
export function glyphTransformForFrame(
  frame: ScorePathFrame,
  localTransform: GlyphLocalTransform = IDENTITY_GLYPH_TRANSFORM,
): GlyphLocalTransform {
  const desiredGlyphY = scaleVector(frame.normal, -1);
  const unreflectedGlyphY = leftNormal(frame.tangent);
  const alignment = dotVectors(unreflectedGlyphY, desiredGlyphY);

  if (Math.abs(Math.abs(alignment) - 1) > GLYPH_FRAME_ALIGNMENT_EPSILON) {
    throw new RangeError(
      "ScorePath tangent and pitch normal must form an orthonormal glyph frame",
    );
  }

  const handedness = alignment >= 0 ? 1 : -1;
  const frameMirrorsY = handedness < 0;

  return {
    mirrorX: localTransform.mirrorX,
    mirrorY: frameMirrorsY !== localTransform.mirrorY,
    // A y-reflection conjugates a local rotation, reversing its sign.
    rotationRadians:
      Math.atan2(frame.tangent.y, frame.tangent.x) +
      handedness * localTransform.rotationRadians,
  };
}
