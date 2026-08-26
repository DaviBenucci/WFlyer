import { describe, expect, it } from "vitest";

import {
  AUTOMATIC_MOTIF_IDS,
  getMotifDefinition,
  isMotifId,
  isTerminalMotif,
  TERMINAL_MOTIF_IDS,
} from "@/lib/music/composer/motifs";

describe("rhythmic motif whitelist", () => {
  it("contains exactly the thirteen approved automatic motif IDs", () => {
    expect(AUTOMATIC_MOTIF_IDS).toEqual([
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
    ]);
    expect(isMotifId("E8_E8")).toBe(true);
    expect(isMotifId("E8_E8_E8")).toBe(false);
  });

  it("defines triplet and mixed-hook topology explicitly", () => {
    expect(getMotifDefinition("E8_TRIPLET_3")).toMatchObject({
      durations: ["eighth", "eighth", "eighth"],
      primaryBeam: true,
      secondaryBeam: "none",
      tuplet: {
        bracket: true,
        count: 3,
        label: "3",
        labelPosition: "center",
      },
    });
    expect(getMotifDefinition("S16_E8_S16")).toMatchObject({
      durations: ["sixteenth", "eighth", "sixteenth"],
      primaryBeam: true,
      secondaryBeam: "left-and-right-hooks",
    });
    expect(getMotifDefinition("E8_S16_S16").secondaryBeam).toBe(
      "trailing-pair",
    );
    expect(getMotifDefinition("S16_S16_E8").secondaryBeam).toBe(
      "leading-pair",
    );
    expect(getMotifDefinition("S16_S16_S16_S16").durations).toHaveLength(4);
  });

  it("limits terminals to the approved calm simple motifs", () => {
    expect(TERMINAL_MOTIF_IDS).toEqual(["Q1", "Q2", "H1", "H2", "W1"]);

    for (const motifId of AUTOMATIC_MOTIF_IDS) {
      expect(isTerminalMotif(motifId)).toBe(
        TERMINAL_MOTIF_IDS.includes(
          motifId as (typeof TERMINAL_MOTIF_IDS)[number],
        ),
      );
    }
  });
});
