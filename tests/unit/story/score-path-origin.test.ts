import { describe, expect, it } from "vitest";

import {
  buildScorePathOriginReviewFixture,
  resolveScorePathOriginReviewSelection,
  SCORE_PATH_ORIGIN_REVIEW_ASSET,
  SCORE_PATH_ORIGIN_REVIEW_BRANCHES,
  SCORE_PATH_ORIGIN_REVIEW_LABEL,
  SCORE_PATH_ORIGIN_REVIEW_MODES,
  SCORE_PATH_ORIGIN_REVIEW_STATUS,
  SCORE_PATH_ORIGIN_REVIEW_THEMES,
  scorePathOriginReviewUrl,
} from "@/app/%5F_visual-lab/story/score-paths/_fixtures/score-path-origin";

describe("Phase-9 task-33 real origin review fixture", () => {
  it("keeps the origin-only mode and theme matrix separate from candidate modes", () => {
    expect(SCORE_PATH_ORIGIN_REVIEW_MODES).toEqual([
      "horizontal-enhanced",
      "vertical-wide",
      "vertical-compact",
    ]);
    expect(SCORE_PATH_ORIGIN_REVIEW_THEMES).toEqual(["light", "dark"]);
    expect(SCORE_PATH_ORIGIN_REVIEW_STATUS).toBe("HUMAN_APPROVAL_PENDING");
    expect(SCORE_PATH_ORIGIN_REVIEW_LABEL).toBe(
      "ORIGIN_CURVE — HUMAN_APPROVAL_PENDING",
    );
  });

  it("uses the retained origin envelope ratios at canonical staff-space values", () => {
    const horizontal = buildScorePathOriginReviewFixture("horizontal-enhanced");
    const wide = buildScorePathOriginReviewFixture("vertical-wide");
    const compact = buildScorePathOriginReviewFixture("vertical-compact");

    expect(horizontal.geometry).toMatchObject({
      amplitude: 108,
      height: 280,
      origin: { x: 720, y: 82 },
      pathWidth: 1440,
      staffSpace: 12,
    });
    expect(wide.geometry).toMatchObject({
      amplitude: 40.5,
      height: 105,
      origin: { x: 270, y: 30.75 },
      pathWidth: 540,
      staffSpace: 4.5,
    });
    expect(compact.geometry).toMatchObject({
      amplitude: 15.75,
      height: 54,
      origin: { x: 73.125, y: 15.75 },
      pathWidth: 146.25,
      staffSpace: 3,
    });
  });

  it("renders exactly one immutable approved upright treble clef over ten continuous staff lines", () => {
    expect(SCORE_PATH_ORIGIN_REVIEW_ASSET).toEqual({
      assetId: "MUS-GLYPH-001",
      assetKey: "wf-music-treble-clef",
      runtimePath: "src/assets/visuals/musical/wf-music-treble-clef.svg",
      sha256:
        "44a96b7cdcf968cf02c4f12673ed848fff387836f56e1fcb9a74070ae4c9064d",
    });

    for (const mode of SCORE_PATH_ORIGIN_REVIEW_MODES) {
      const fixture = buildScorePathOriginReviewFixture(mode);
      const primitives = SCORE_PATH_ORIGIN_REVIEW_BRANCHES.flatMap(
        (branch) => fixture.branches[branch].model.primitives,
      );
      const clefs = primitives.filter(({ role }) => role === "clef");

      expect(
        SCORE_PATH_ORIGIN_REVIEW_BRANCHES.reduce(
          (count, branch) =>
            count + fixture.branches[branch].model.staff.lines.length,
          0,
        ),
      ).toBe(10);
      expect(clefs).toHaveLength(1);
      expect(fixture.evidence.clef).toMatchObject({
        anchorInGlyph: { x: 0.5, y: 0.62 },
        assetKey: "wf-music-treble-clef",
        mirrorX: false,
        mirrorY: false,
        rotationDegrees: 0,
      });
      expect(fixture.evidence.clef.width).toBeCloseTo(
        2.614 * fixture.geometry.staffSpace,
        9,
      );
      expect(fixture.evidence.clef.height).toBeCloseTo(
        6.4 * fixture.geometry.staffSpace,
        9,
      );
      expect(primitives.filter(({ role }) => role.includes("barline"))).toEqual(
        [],
      );
      expect(
        SCORE_PATH_ORIGIN_REVIEW_BRANCHES.every(
          (branch) => fixture.branches[branch].model.motifs.length === 0,
        ),
      ).toBe(true);
    }
  });

  it("shares one origin, departs left/right on horizontal tangents, and exposes event-free first zones", () => {
    for (const mode of SCORE_PATH_ORIGIN_REVIEW_MODES) {
      const fixture = buildScorePathOriginReviewFixture(mode);

      expect(fixture.evidence.commonOriginGap).toBe(0);
      expect(fixture.evidence.fiveLineContinuity).toBe(true);
      expect(fixture.evidence.maximumStaffSpaceDelta).toBeLessThan(1e-9);
      expect(fixture.evidence.minimumFrameContentClearance).toBeGreaterThan(0);
      expect(fixture.evidence.connectorEventCount).toBe(0);
      expect(fixture.evidence.downstreamGrammar).toBe(
        "ORGANIC_FLOWING_ALTERNATING_S_APPROVED_UNCHANGED",
      );
      expect(fixture.branches.application.initialTangent).toEqual({
        x: -1,
        y: 0,
      });
      expect(fixture.branches.professional.initialTangent).toEqual({
        x: 1,
        y: 0,
      });

      for (const branch of SCORE_PATH_ORIGIN_REVIEW_BRANCHES) {
        const [notation, connector] = fixture.branches[branch].zones;

        expect(notation.kind).toBe("notation-safe");
        expect(notation.startT).toBe(0);
        expect(notation.endT).toBeGreaterThan(0);
        expect(notation.endT).toBeLessThan(1);
        expect(notation.maximumReadableTangentAngleDeg).toBeLessThanOrEqual(9.001);
        expect(connector.kind).toBe("connector");
        expect(connector.startT).toBe(notation.endT);
        expect(connector.endT).toBe(1);
        expect(connector.eventCount).toBe(0);
        expect(connector.semanticSlotIds).toEqual([]);
      }
    }
  });

  it("resolves deterministic review URLs and fails unknown values closed to the default review", () => {
    expect(
      resolveScorePathOriginReviewSelection({
        mode: "vertical-compact",
        theme: "dark",
      }),
    ).toEqual({ mode: "vertical-compact", theme: "dark" });
    expect(
      resolveScorePathOriginReviewSelection({
        mode: "unknown",
        theme: "system",
      }),
    ).toEqual({ mode: "horizontal-enhanced", theme: "light" });
    expect(scorePathOriginReviewUrl("vertical-wide", "light")).toBe(
      "/__visual-lab/story/score-paths/origin?mode=vertical-wide&theme=light",
    );
  });
});
