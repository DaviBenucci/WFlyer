import { describe, expect, it } from "vitest";

import { AUTOMATIC_MOTIF_IDS } from "@/lib/music/composer/motifs";
import { APPROVED_COMPOSER_CALIBRATION_V1 } from "@/lib/music/composer/profiles";

import { APPROVED_RENDERER_TOKENS } from "./draft-calibration";
import {
  buildComposerKeySignatureBoundaryEvidence,
  buildGateCFixedSeedMatrix,
  GATE_C_APPROVED_COMPOSER_CALIBRATION_PAYLOAD,
  GATE_C_APPROVED_RENDERER_TOKEN_PAYLOAD,
  GATE_C_FIXED_SEEDS,
  GATE_C_PROFILES,
} from "./gate-c-review";

describe("Gate-C fixed-seed review fixtures", () => {
  it("builds three named seeds across all four profiles", () => {
    const matrix = buildGateCFixedSeedMatrix();

    expect(GATE_C_FIXED_SEEDS.map(({ id }) => id)).toEqual([
      "origin",
      "flight",
      "return",
    ]);
    expect(GATE_C_PROFILES).toEqual([
      "CALM",
      "BALANCED",
      "ACTIVE",
      "TERMINAL",
    ]);
    expect(matrix).toHaveLength(12);
    expect(matrix.map(({ seedId, profile }) => `${seedId}:${profile}`)).toEqual(
      GATE_C_FIXED_SEEDS.flatMap(({ id }) =>
        GATE_C_PROFILES.map((profile) => `${id}:${profile}`),
      ),
    );
  });

  it("keeps canonical projections and versioned hashes deterministic", () => {
    const first = buildGateCFixedSeedMatrix();
    const second = buildGateCFixedSeedMatrix();

    expect(first.map(({ semanticHash }) => semanticHash)).toEqual([
      "fnv1a32-v1-a3b59d21",
      "fnv1a32-v1-57efa235",
      "fnv1a32-v1-ba51ae4c",
      "fnv1a32-v1-b639ebff",
      "fnv1a32-v1-9afa76b2",
      "fnv1a32-v1-92ebd37e",
      "fnv1a32-v1-46d3d40c",
      "fnv1a32-v1-b8706c1e",
      "fnv1a32-v1-6ea83d8b",
      "fnv1a32-v1-95b7e08d",
      "fnv1a32-v1-0dec3074",
      "fnv1a32-v1-d5b5a09a",
    ]);

    expect(second).toEqual(first);
    expect(
      first.map(({ canonicalJson, semanticHash }) => ({
        canonicalJson,
        semanticHash,
      })),
    ).toEqual(
      second.map(({ canonicalJson, semanticHash }) => ({
        canonicalJson,
        semanticHash,
      })),
    );
    expect(
      first.every(
        ({ canonicalJson, projection }) =>
          canonicalJson === JSON.stringify(projection),
      ),
    ).toBe(true);
  });

  it("shows controlled semantic variation for every profile", () => {
    const matrix = buildGateCFixedSeedMatrix();

    for (const profile of GATE_C_PROFILES) {
      const entries = matrix.filter((entry) => entry.profile === profile);
      const compositionSignatures = entries.map(({ projection }) =>
        JSON.stringify(
          projection.motifs.map(({ motifId, staffSteps }) => ({
            motifId,
            staffSteps,
          })),
        ),
      );

      expect(entries).toHaveLength(3);
      expect(new Set(entries.map(({ semanticHash }) => semanticHash)).size).toBe(
        3,
      );
      expect(new Set(compositionSignatures).size).toBeGreaterThanOrEqual(2);
    }
  });

  it("exposes every approved renderer token and per-profile composer weight", () => {
    expect(GATE_C_APPROVED_RENDERER_TOKEN_PAYLOAD).toEqual({
      status: "approved-external-human-review",
      inheritedApprovedInputs: {
        noteFlagTransform: "approved-gate-b",
      },
      tokens: APPROVED_RENDERER_TOKENS,
    });
    expect(GATE_C_APPROVED_COMPOSER_CALIBRATION_PAYLOAD).toEqual({
      status: "approved-external-human-review",
      profiles: APPROVED_COMPOSER_CALIBRATION_V1,
    });

    for (const profile of GATE_C_PROFILES) {
      expect(
        Object.keys(
          GATE_C_APPROVED_COMPOSER_CALIBRATION_PAYLOAD.profiles[profile]
            .motifWeights,
        ),
      ).toEqual(AUTOMATIC_MOTIF_IDS);
    }
  });

  it("keeps key signatures and fifths outside all fixed composer cases", () => {
    expect(buildComposerKeySignatureBoundaryEvidence()).toEqual({
      composerCasesInspected: 12,
      forbiddenFieldPaths: [],
      keySignatureOwnership: "renderer-authored-outside-composer",
    });
  });
});
