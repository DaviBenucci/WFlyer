import { describe, expect, it } from "vitest";

import { EMPTY_COMPOSITION_HISTORY } from "@/lib/music/composer/anti-repetition";
import { composeMotifWithResolverForTesting } from "@/lib/music/composer/compose-motif";
import {
  ContourTranslationExhaustedError,
  instantiatePitchContour,
  PITCH_CONTOUR_TABLE,
  type TranslatedContour,
} from "@/lib/music/composer/pitch-contours";
import { APPROVED_COMPOSER_CALIBRATION_V1 } from "@/lib/music/composer/profiles";
import { Mulberry32 } from "@/lib/music/composer/prng";
import type {
  PitchContourId,
  SupportedNoteCount,
} from "@/lib/music/composer/types";

interface ResolverCall {
  readonly anchorStaffStep: number;
  readonly contourId: PitchContourId;
  readonly noteCount: SupportedNoteCount;
}

function composeAfterSyntheticUnfitContour(): {
  readonly calls: readonly ResolverCall[];
  readonly motif: ReturnType<typeof composeMotifWithResolverForTesting>;
  readonly rejectedContour: PitchContourId;
} {
  const calls: ResolverCall[] = [];
  let rejectedContour: PitchContourId | undefined;

  const motif = composeMotifWithResolverForTesting(
    {
      instanceId: "wf-test-deterministic-contour-fallback",
      slot: {
        id: "fallback-slot",
        start: 0,
        end: 0.2,
        density: "normal",
        allowedMotifFamilies: [
          "eighth",
          "half",
          "mixed",
          "quarter",
          "sixteenth",
          "triplet",
          "whole",
        ],
      },
      history: EMPTY_COMPOSITION_HISTORY,
      calibration: APPROVED_COMPOSER_CALIBRATION_V1.BALANCED,
      prng: new Mulberry32(0x5eed_cafe),
      terminalProfile: false,
    },
    (contourId, noteCount, anchorStaffStep): TranslatedContour => {
      calls.push({ contourId, noteCount, anchorStaffStep });

      if (rejectedContour === undefined) {
        rejectedContour = contourId;
        throw new ContourTranslationExhaustedError(0, 13, -2, 10);
      }

      return instantiatePitchContour(contourId, noteCount, anchorStaffStep);
    },
  );

  if (!rejectedContour) {
    throw new Error("Synthetic resolver did not reject its first contour.");
  }

  return { calls, motif, rejectedContour };
}

describe("deterministic contour candidate rejection", () => {
  it("advances to the next seeded contour after a synthetic unfit span", () => {
    const tableBefore = JSON.stringify(PITCH_CONTOUR_TABLE);
    const first = composeAfterSyntheticUnfitContour();
    const second = composeAfterSyntheticUnfitContour();

    expect(first).toStrictEqual(second);
    expect(first.calls).toHaveLength(2);
    expect(first.calls[0]?.contourId).toBe(first.rejectedContour);
    expect(first.calls[1]?.contourId).toBe(first.motif.contourId);
    expect(first.motif.contourId).not.toBe(first.rejectedContour);
    expect(first.motif.id).toBe("wf-test-deterministic-contour-fallback");
    expect(JSON.stringify(PITCH_CONTOUR_TABLE)).toBe(tableBefore);
  });
});
