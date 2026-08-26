import { describe, expect, it, vi } from "vitest";

import {
  AUTOMATIC_MOTIF_IDS,
  ComposerCandidateExhaustedError,
  composeSegment,
  APPROVED_COMPOSER_CALIBRATION_V1,
  getMotifDefinition,
  getPitchContourDeltas,
  hashSeedParts,
  isTerminalMotif,
  LANDING_STAFF_STEPS,
  PITCH_CONTOUR_IDS,
  PREFERRED_PITCH_RANGE,
  type ComposerCalibration,
  type ComposerProfile,
  type MotifId,
  type NoteDuration,
  type RhythmFamily,
  type ScoreCompositionSlot,
  type SecondaryBeamTopology,
} from "@/lib/music/composer";

const ALL_FAMILIES = Object.freeze([
  "eighth",
  "half",
  "mixed",
  "quarter",
  "sixteenth",
  "triplet",
  "whole",
] as const satisfies readonly RhythmFamily[]);

interface ExpectedMotifContract {
  readonly durations: readonly NoteDuration[];
  readonly primaryBeam: boolean;
  readonly secondaryBeam: SecondaryBeamTopology;
  readonly triplet: boolean;
}

const EXPECTED_MOTIF_CONTRACT = {
  Q1: { durations: ["quarter"], primaryBeam: false, secondaryBeam: "none", triplet: false },
  Q2: { durations: ["quarter", "quarter"], primaryBeam: false, secondaryBeam: "none", triplet: false },
  Q3: { durations: ["quarter", "quarter", "quarter"], primaryBeam: false, secondaryBeam: "none", triplet: false },
  Q4: { durations: ["quarter", "quarter", "quarter", "quarter"], primaryBeam: false, secondaryBeam: "none", triplet: false },
  H1: { durations: ["half"], primaryBeam: false, secondaryBeam: "none", triplet: false },
  H2: { durations: ["half", "half"], primaryBeam: false, secondaryBeam: "none", triplet: false },
  W1: { durations: ["whole"], primaryBeam: false, secondaryBeam: "none", triplet: false },
  E8_E8: { durations: ["eighth", "eighth"], primaryBeam: true, secondaryBeam: "none", triplet: false },
  E8_TRIPLET_3: { durations: ["eighth", "eighth", "eighth"], primaryBeam: true, secondaryBeam: "none", triplet: true },
  S16_S16_S16_S16: { durations: ["sixteenth", "sixteenth", "sixteenth", "sixteenth"], primaryBeam: true, secondaryBeam: "continuous", triplet: false },
  E8_S16_S16: { durations: ["eighth", "sixteenth", "sixteenth"], primaryBeam: true, secondaryBeam: "trailing-pair", triplet: false },
  S16_S16_E8: { durations: ["sixteenth", "sixteenth", "eighth"], primaryBeam: true, secondaryBeam: "leading-pair", triplet: false },
  S16_E8_S16: { durations: ["sixteenth", "eighth", "sixteenth"], primaryBeam: true, secondaryBeam: "left-and-right-hooks", triplet: false },
} as const satisfies Record<MotifId, ExpectedMotifContract>;

function arraysEqual<T>(left: readonly T[], right: readonly T[]): boolean {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function slots(count = 6): readonly ScoreCompositionSlot[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `slot-${String(index + 1).padStart(2, "0")}`,
    start: index / count,
    end: (index + 0.8) / count,
    density: index % 3 === 0 ? "sparse" : index % 3 === 1 ? "normal" : "dense",
    allowedMotifFamilies: ALL_FAMILIES,
    role: index === count - 1 ? "terminal" : "standard",
  }));
}

function input(seed = "fixed-composer-seed") {
  return {
    sessionSeed: seed,
    branchId: "professional",
    chapterId: "services",
    profile: "BALANCED" as const,
    slots: slots(),
  };
}

function hasTriplePitchRun(staffSteps: readonly number[]): boolean {
  return staffSteps.some(
    (staffStep, index) =>
      index >= 2 &&
      staffStep === staffSteps[index - 1] &&
      staffStep === staffSteps[index - 2],
  );
}

describe("deterministic semantic segment composition", () => {
  it("returns deep-equal semantic composition for identical inputs", () => {
    const first = composeSegment(input());
    const second = composeSegment(input());

    expect(first).toStrictEqual(second);
    expect(first.composerVersion).toBe(1);
    expect(first.pitchContourTableVersion).toBe(1);
    expect(first.seed).toMatch(/^wf-chapter-seed-v1-[0-9a-f]{8}$/u);
    expect(hashSeedParts([JSON.stringify(first)])).toBe(3_581_856_897);

    for (const motif of first.motifs) {
      expect(motif.id).toMatch(/^wf-/u);
      expect(motif.notes).toEqual(
        motif.staffSteps.map((staffStep, index) => ({
          staffStep,
          duration: motif.durations[index],
        })),
      );
      expect(Object.isFrozen(motif.notes)).toBe(true);
      expect(motif.notes.every((note) => Object.isFrozen(note))).toBe(true);
    }
  });

  it("produces nontrivial seeded variation while structural wf-* IDs stay stable", () => {
    const segments = Array.from({ length: 64 }, (_, index) =>
      composeSegment(input(`variation-seed-${index}`)),
    );
    const semanticVariations = new Set(
      segments.map((segment) =>
        JSON.stringify(
          segment.motifs.map(({ motifId, staffSteps }) => ({
            motifId,
            staffSteps,
          })),
        ),
      ),
    );
    const stableIds = segments[0]?.motifs.map(({ id }) => id);

    expect(semanticVariations.size).toBeGreaterThan(16);
    expect(stableIds).toBeDefined();
    expect(
      segments.every(
        (segment) =>
          JSON.stringify(segment.motifs.map(({ id }) => id)) ===
          JSON.stringify(stableIds),
      ),
    ).toBe(true);
    expect(new Set(segments.map(({ seed }) => seed)).size).toBe(64);
  });

  it("ignores responsive geometry changes while stable semantic slots remain", () => {
    const horizontal = input();
    const vertical = {
      ...horizontal,
      slots: horizontal.slots.map((slot, index) => ({
        ...slot,
        start: index / 10,
        end: (index + 0.5) / 10,
      })),
    };

    expect(composeSegment(vertical)).toStrictEqual(composeSegment(horizontal));
  });

  it("keeps reserved zones empty and uses half-open boundary overlap", () => {
    const segment = composeSegment({
      ...input(),
      slots: [
        {
          id: "before",
          start: 0,
          end: 0.2,
          density: "normal",
          allowedMotifFamilies: ALL_FAMILIES,
        },
        {
          id: "reserved",
          start: 0.2,
          end: 0.4,
          density: "normal",
          allowedMotifFamilies: ALL_FAMILIES,
        },
      ],
      reservedZones: [{ start: 0.2, end: 0.3, reason: "persona" }],
    });

    expect(segment.motifs.map(({ slotId }) => slotId)).toEqual(["before"]);
    expect(segment.emptySlots).toEqual([
      {
        slotId: "reserved",
        reason: "reserved-zone",
        reservedReason: "persona",
      },
    ]);
  });

  it("enforces terminal grammar regardless of a non-terminal profile", () => {
    const segment = composeSegment(input());
    const terminal = segment.motifs.find(({ slotId }) => slotId === "slot-06");

    expect(terminal).toBeDefined();
    expect(isTerminalMotif(terminal?.motifId ?? "E8_E8")).toBe(true);
    expect(terminal?.dense).toBe(false);
  });

  it("accepts explicit alternate calibration weights instead of freezing profile numbers", () => {
    const calm = APPROVED_COMPOSER_CALIBRATION_V1.CALM;
    const calibration: ComposerCalibration = {
      ...APPROVED_COMPOSER_CALIBRATION_V1,
      CALM: {
        ...calm,
        motifWeights: Object.fromEntries(
          AUTOMATIC_MOTIF_IDS.map((motifId) => [
            motifId,
            motifId === "Q1" ? 1 : 0,
          ]),
        ) as unknown as typeof calm.motifWeights,
        contourWeights: Object.fromEntries(
          PITCH_CONTOUR_IDS.map((contourId) => [
            contourId,
            contourId === "step-up" ? 1 : 0,
          ]),
        ) as unknown as typeof calm.contourWeights,
        pitchAnchorWeights: { 4: 1 },
      },
    };
    const segment = composeSegment({
      ...input(),
      profile: "CALM",
      calibration,
      slots: [
        {
          id: "forced-alternate-fixture",
          start: 0,
          end: 0.2,
          density: "normal",
          allowedMotifFamilies: ["quarter"],
        },
      ],
    });

    expect(segment.motifs).toEqual([
      expect.objectContaining({
        motifId: "Q1",
        contourId: "step-up",
        staffSteps: [4],
      }),
    ]);
  });

  it("approved anchor weights favor the optical range while keeping ledgers occasional", () => {
    const calibration = APPROVED_COMPOSER_CALIBRATION_V1.BALANCED;
    const preferredSteps = LANDING_STAFF_STEPS.filter(
      (staffStep) =>
        staffStep >= PREFERRED_PITCH_RANGE.minimum &&
        staffStep <= PREFERRED_PITCH_RANGE.maximum,
    );
    const ledgerSteps = LANDING_STAFF_STEPS.filter(
      (staffStep) =>
        staffStep < PREFERRED_PITCH_RANGE.minimum ||
        staffStep > PREFERRED_PITCH_RANGE.maximum,
    );
    const minimumPreferredWeight = Math.min(
      ...preferredSteps.map(
        (staffStep) => calibration.pitchAnchorWeights[staffStep] ?? 0,
      ),
    );
    const maximumLedgerWeight = Math.max(
      ...ledgerSteps.map(
        (staffStep) => calibration.pitchAnchorWeights[staffStep] ?? 0,
      ),
    );
    let preferredPitchCount = 0;
    let ledgerPitchCount = 0;

    for (let index = 0; index < 512; index += 1) {
      const segment = composeSegment(input(`optical-range-${index}`));

      for (const staffStep of segment.motifs.flatMap(({ staffSteps }) => staffSteps)) {
        if (
          staffStep >= PREFERRED_PITCH_RANGE.minimum &&
          staffStep <= PREFERRED_PITCH_RANGE.maximum
        ) {
          preferredPitchCount += 1;
        } else {
          ledgerPitchCount += 1;
        }
      }
    }

    expect(minimumPreferredWeight).toBeGreaterThan(maximumLedgerWeight);
    expect(ledgerPitchCount).toBeGreaterThan(0);
    expect(preferredPitchCount).toBeGreaterThan(ledgerPitchCount);
  });

  it("uses only calm simple motifs throughout the TERMINAL profile", () => {
    const segment = composeSegment({ ...input(), profile: "TERMINAL" });

    expect(segment.motifs).not.toHaveLength(0);
    expect(segment.motifs.every(({ motifId }) => isTerminalMotif(motifId))).toBe(
      true,
    );
  });

  it("raises typed deterministic exhaustion when no family is allowed", () => {
    const compose = () =>
      composeSegment({
        ...input(),
        slots: [
          {
            id: "blocked",
            start: 0,
            end: 0.2,
            density: "normal",
            allowedMotifFamilies: [],
          },
        ],
      });

    expect(compose).toThrow(ComposerCandidateExhaustedError);

    try {
      compose();
    } catch (error) {
      expect(error).toMatchObject({
        code: "COMPOSER_CANDIDATE_EXHAUSTED",
        slotId: "blocked",
        attempts: 0,
      });
    }
  });

  it("keeps key signatures completely outside composer state", () => {
    const segment = composeSegment(input());

    expect(segment).not.toHaveProperty("keySignature");
    expect(segment.motifs.every((motif) => !("keySignature" in motif))).toBe(
      true,
    );
  });
});

describe("10,000-segment composer stress validation", () => {
  it("produces zero grammar, contour, reservation, or determinism violations", () => {
    const profiles: readonly ComposerProfile[] = [
      "CALM",
      "BALANCED",
      "ACTIVE",
      "TERMINAL",
    ];
    const violations: string[] = [];
    const randomSpy = vi.spyOn(Math, "random");
    let unseededRandomCallCount = 0;

    try {
      for (let index = 0; index < 10_000; index += 1) {
        const profile = profiles[index % profiles.length] ?? "BALANCED";
        const stressInput = {
          sessionSeed: `stress-seed-${index}`,
          branchId: index % 2 === 0 ? "professional" : "application",
          chapterId: `stress-chapter-${index % 17}`,
          profile,
          slots: slots(5),
          reservedZones: [
            { start: 0.42, end: 0.54, reason: "transition" as const },
          ],
        };
        const segment = composeSegment(stressInput);
        const repeatedSegment = composeSegment(stressInput);
        const flatPitches = segment.motifs.flatMap(
          ({ staffSteps }) => staffSteps,
        );

        if (
          hashSeedParts([JSON.stringify(segment)]) !==
          hashSeedParts([JSON.stringify(repeatedSegment)])
        ) {
          violations.push(`determinism:${index}`);
        }

        if (
          "keySignature" in segment ||
          segment.motifs.some((motif) => "keySignature" in motif)
        ) {
          violations.push(`key-signature:${index}`);
        }

        if (
          segment.motifs.some(({ slotId }) => slotId === "slot-03") ||
          segment.emptySlots.length !== 1 ||
          segment.emptySlots[0]?.slotId !== "slot-03" ||
          segment.emptySlots[0]?.reservedReason !== "transition"
        ) {
          violations.push(`reserved:${index}`);
        }

        if (
          !segment.seed.startsWith("wf-chapter-seed-v1-") ||
          new Set(segment.motifs.map(({ id }) => id)).size !==
            segment.motifs.length ||
          segment.motifs.some(({ id }) => !id.startsWith("wf-"))
        ) {
          violations.push(`identity:${index}`);
        }

        for (const [motifIndex, motif] of segment.motifs.entries()) {
          if (!AUTOMATIC_MOTIF_IDS.includes(motif.motifId)) {
            violations.push(`motif:${index}:${motif.motifId}`);
          }

          const definition = getMotifDefinition(motif.motifId);
          const expectedContract = EXPECTED_MOTIF_CONTRACT[motif.motifId];
          const expectedNotes = motif.staffSteps.map((staffStep, noteIndex) => ({
            staffStep,
            duration: motif.durations[noteIndex],
          }));
          const contourDeltas = getPitchContourDeltas(
            motif.contourId,
            motif.staffSteps.length as 1 | 2 | 3 | 4,
          );
          const firstPitch = motif.staffSteps[0];
          const normalizedContour = motif.staffSteps.map(
            (staffStep) => staffStep - (firstPitch ?? 0),
          );

          if (
            !arraysEqual(motif.durations, expectedContract.durations) ||
            !arraysEqual(definition.durations, expectedContract.durations) ||
            definition.primaryBeam !== expectedContract.primaryBeam ||
            definition.secondaryBeam !== expectedContract.secondaryBeam
          ) {
            violations.push(`contract:${index}:${motif.motifId}`);
          }

          if (
            motif.durations.length !== motif.staffSteps.length ||
            !arraysEqual(normalizedContour, contourDeltas)
          ) {
            violations.push(`arity:${index}:${motif.motifId}`);
          }

          if (
            JSON.stringify(motif.notes) !== JSON.stringify(expectedNotes) ||
            !Object.isFrozen(motif.notes) ||
            motif.notes.some((note) => !Object.isFrozen(note))
          ) {
            violations.push(`notes:${index}:${motif.motifId}`);
          }

          if (
            expectedContract.triplet
              ? JSON.stringify(motif.tuplet) !==
                JSON.stringify({
                  bracket: true,
                  count: 3,
                  label: "3",
                  labelPosition: "center",
                })
              : motif.tuplet !== undefined
          ) {
            violations.push(`triplet:${index}:${motif.motifId}`);
          }

          if (motif.staffSteps.some((pitch) => pitch < -2 || pitch > 10)) {
            violations.push(`pitch:${index}:${motif.motifId}`);
          }

          if (
            motifIndex > 0 &&
            motif.motifId === segment.motifs[motifIndex - 1]?.motifId
          ) {
            violations.push(`repeat:${index}:${motif.motifId}`);
          }

          if (
            (motif.slotId === "slot-05" || profile === "TERMINAL") &&
            !isTerminalMotif(motif.motifId)
          ) {
            violations.push(`terminal:${index}:${motif.motifId}`);
          }
        }

        if (hasTriplePitchRun(flatPitches)) {
          violations.push(`triple-pitch:${index}`);
        }
      }
    } finally {
      unseededRandomCallCount = randomSpy.mock.calls.length;
      randomSpy.mockRestore();
    }

    const countViolations = (...prefixes: readonly string[]) =>
      violations.filter((violation) =>
        prefixes.some((prefix) => violation.startsWith(prefix)),
      ).length;
    const result = Object.freeze({
      generatedSegments: 10_000,
      illegalMotifCount: countViolations("motif:"),
      illegalRhythmicGroupingCount: countViolations(
        "arity:",
        "contract:",
        "notes:",
      ),
      invalidTripletCount: countViolations("triplet:"),
      unseededRandomCallCount,
      outOfRangePitchCount: countViolations("pitch:"),
      immediateRepetitionCount: countViolations("repeat:"),
      nondeterminismCount: countViolations("determinism:"),
      reservedZoneViolationCount: countViolations("reserved:"),
      keySignatureMutationCount: countViolations("key-signature:"),
      contourMutationCount: countViolations("arity:"),
      terminalGrammarViolationCount: countViolations("terminal:"),
      pitchRunViolationCount: countViolations("triple-pitch:"),
      identityViolationCount: countViolations("identity:"),
    });

    console.info(`MUSIC_COMPOSER_STRESS_RESULT ${JSON.stringify(result)}`);

    expect(result).toEqual({
      generatedSegments: 10_000,
      illegalMotifCount: 0,
      illegalRhythmicGroupingCount: 0,
      invalidTripletCount: 0,
      unseededRandomCallCount: 0,
      outOfRangePitchCount: 0,
      immediateRepetitionCount: 0,
      nondeterminismCount: 0,
      reservedZoneViolationCount: 0,
      keySignatureMutationCount: 0,
      contourMutationCount: 0,
      terminalGrammarViolationCount: 0,
      pitchRunViolationCount: 0,
      identityViolationCount: 0,
    });
    expect(violations).toEqual([]);
  }, 30_000);
});
