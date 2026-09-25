import { describe, expect, it } from "vitest";

import { buildStoryScoreProjection, type StoryScoreProjectionOptions } from "@/lib/story/score/projection";
import measurements from "../../fixtures/story-score/stage1-batch2-measurements.json";
import { strictIntersections } from "../../e2e/helpers/assembly-stage1-audit";
import { rebasePrePortfolioMeasurements } from "./rebase-pre-portfolio-measurements";

describe("Stage-1 registered Batch-2 measured geometry", () => {
  it.each(measurements)("has globally clean center and staff paths at $id", ({ options }) => {
    const projection = buildStoryScoreProjection("horizontal-enhanced", rebasePrePortfolioMeasurements(options as StoryScoreProjectionOptions).options);
    const crossings = Object.values(projection.branches).flatMap((branch) => [
      ...branch.model.staff.lines.flatMap((line) => strictIntersections(line.points).map((crossing) => ({
        branch: branch.branch, line: line.id, ...crossing,
      }))),
      ...strictIntersections(Array.from({ length: 2049 }, (_, i) => branch.path.pointAt(i / 2048)))
        .map((crossing) => ({ branch: branch.branch, line: "center", ...crossing })),
    ]);
    expect(crossings).toEqual([]);
    for (const branch of Object.values(projection.branches)) {
      expect(branch.path.continuity.maximumPointGap).toBe(0);
      expect(branch.path.continuity.minimumTangentAlignment).toBeGreaterThanOrEqual(0.999999);
      expect(branch.eventSafety.forbiddenEventCount).toBe(0);
      expect(branch.eventSafety.maximumTangentAngleDeg).toBeLessThanOrEqual(18);
      expect(branch.eventSafety.maximumTangentVariationDeg).toBeLessThanOrEqual(6);
    }
    expect(projection.evidence.finalBarlines).toEqual({
      professional: "thin-gap-thick-and-physical-end",
    });
  }, 15_000);
});
