import { describe, expect, it } from "vitest";

import { buildStoryScoreProjection, type StoryScoreProjectionOptions } from "@/lib/story/score/projection";
import {
  evaluateProjectsCapacity,
  projectsSegmentClearance,
  projectsSegmentPolygonClearance,
  type ProjectsCapacityInput,
} from "@/lib/story/score/projects-capacity";
import negative from "../../fixtures/story-score/stage1-projects-capacity-negative.json";
import measured from "../../fixtures/story-score/stage1-batch2-measurements.json";
import interactionStop from "../../../openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-projects-interaction-clearance-stop-diagnostics.json";
import interactionLineage from "../../../openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-projects-interaction-lineage-diagnostics.json";
import fullInkStop from "../../../openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-projects-full-ink-stop-diagnostics.json";
import visit3Classification from "../../../openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-projects-visit3-classification-diagnostics.json";
import { rebasePrePortfolioMeasurements } from "./rebase-pre-portfolio-measurements";

function inputFor(options: StoryScoreProjectionOptions): ProjectsCapacityInput {
  const rebased = rebasePrePortfolioMeasurements(options).options;
  const projection = buildStoryScoreProjection("horizontal-enhanced", rebased);
  return {
    projection,
    revision: "focused-fixture",
    clip: { x: 0, y: 0, width: projection.width, height: options.viewportHeight! },
    cards: rebased.sceneMeasurements!.professionalProjectCards!.map(
      (idle, index) => {
        const projectIndex = (index + 1) as 1 | 2 | 3;
        const interactionEnvelope =
          rebased.sceneMeasurements!
            .professionalProjectInteractionEnvelopes?.[projectIndex];
        const interactionSweep =
          rebased.sceneMeasurements!
            .professionalProjectInteractionSweeps?.[projectIndex];

        return {
          projectIndex,
          idle,
          ...(interactionEnvelope ? { interactionEnvelope } : {}),
          ...(interactionSweep ? { interactionSweep } : {}),
        };
      },
    ),
  };
}

describe("ASM-PC-001 independent candidate capacity", () => {
  it("preserves visit-3 contour correlation instead of occupying the sweep AABB corners", () => {
    const diagnostic = visit3Classification.continuousTransitionDiagnostic;
    const current = diagnostic.results.find(
      ({ revision }) => revision === "current",
    )!;
    const edge = current.witness.edge;
    const polygon = current.witness.polygon.map((point) => ({
      x: point[0]!,
      y: point[1]!,
    }));
    const enclosingRect = visit3Classification.browser.result.visits[2]!
      .protectedRect;

    expect(
      projectsSegmentClearance(edge.a, edge.b, enclosingRect, edge.radius),
    ).toBeLessThan(12);
    expect(
      projectsSegmentPolygonClearance(
        edge.a,
        edge.b,
        polygon,
        edge.radius,
        diagnostic.padding,
      ),
    ).toBeCloseTo(current.continuousLowerBound, 10);
    expect(current.continuousLowerBound).toBeGreaterThanOrEqual(12);
  });

  it("rejects the exact inherited three-card input without any viewport policy exception", () => {
    const input = inputFor(negative.replayInput.options as StoryScoreProjectionOptions);
    const shift = rebasePrePortfolioMeasurements(negative.replayInput.options as StoryScoreProjectionOptions).shift;
    const cards = negative.cards.map((card) => ({ ...card, idle: { ...card.idle, x: card.idle.x - shift } })) as ProjectsCapacityInput["cards"];
    const result = evaluateProjectsCapacity({ ...input, cards });
    expect(result.status).toBe("INSUFFICIENT_CAPACITY");
    expect(result.visits).toHaveLength(3);
    expect(result.visits.every(({ minimumClearance }) => minimumClearance < 12)).toBe(true);
  });

  it.each(measured.slice(0, 3))(
    "retains inherited first-event evidence while the repaired idle-only $id fixture stays unqualified",
    ({ options }) => {
    const input = inputFor(options as StoryScoreProjectionOptions);
    const result = evaluateProjectsCapacity(input);
    const inherited = fullInkStop.currentPredicateDiagnostics.find(
      ({ viewport }) =>
        viewport[0] === options.viewportWidth &&
        viewport[1] === options.viewportHeight,
    )!;
    const ledger = inherited.primitives.find(
      ({ primitive }) =>
        primitive.id ===
        "wf-professional-projects:primary:note:0:ledger:0",
    )!;

    expect(result.status).toBe("NOT_READY");
    expect(result.visits[0]!.minimumClearance).toBeGreaterThanOrEqual(12);
    expect(inherited.result.status).toBe("INSUFFICIENT_CAPACITY");
    expect(inherited.result.visits[0]!.minimumClearance).toBeLessThan(12);
    const ledgerClearance =
      Math.min(...ledger.footprint.map(({ y }) => y)) -
      inherited.rect.y -
      inherited.rect.height;
    expect(ledgerClearance).toBeGreaterThan(5);
    expect(ledgerClearance).toBeLessThan(12);
    },
    15_000,
  );

  it("rejects missing, non-finite or inconsistent measurement inputs", () => {
    const input = inputFor(negative.replayInput.options as StoryScoreProjectionOptions);
    expect(evaluateProjectsCapacity({ ...input, cards: [] }).status).toBe("NOT_READY");
    expect(evaluateProjectsCapacity({ ...input, clip: { ...input.clip, height: NaN } }).status).toBe("INVALID");
    expect(evaluateProjectsCapacity({ ...input, cards: [input.cards[0]!, input.cards[0]!, input.cards[2]!] }).status).toBe("INVALID");
  });
});

describe("ASM-PC-002 authorized first horizontal shelf", () => {
  it.each(measured.slice(0, 3))("reserves complete first-visit ink at $id", ({ options }) => {
    const input = inputFor(options as StoryScoreProjectionOptions);
    const result = evaluateProjectsCapacity(input);
    const first = result.visits.find(({ projectIndex }) => projectIndex === 1)!;
    // Idle clearance is necessary, never proof of complete interaction capacity.
    expect(first.minimumClearance).toBeGreaterThanOrEqual(12);
    expect(first.visible).toBe(true);
    expect(result.status).not.toBe("PASS");
    expect(input.projection.evidence.projectSerpentine.connectorEventCount).toBe(0);
    expect(input.projection.branches.professional.path.continuity.maximumPointGap).toBe(0);
  });
});

describe("ASM-PC-003 authorized second horizontal shelf", () => {
  it.each(interactionStop.occurrences)(
    "retains the immutable $diagnosticOccurrence focus-start failure",
    (occurrence) => {
      expect(occurrence.projectIndex).toBe(2);
      expect(occurrence.measurement.focusVisible).toBe(true);
      expect(occurrence.measurement.outlineStyle).toBe("solid");
      expect(occurrence.measurement.animations[0]).toEqual({
        time: 0,
        state: "running",
      });
      expect(occurrence.witness.verticalGapIncludingStrokeCssPx).toBeLessThan(
        interactionStop.requiredClearanceCssPx,
      );
    },
  );

  it.each(measured.slice(0, 3))(
    "reserves the complete visit-2 focus transition at $id",
    ({ id, options }) => {
      const replay = interactionLineage.replays.find(
        (candidate) =>
          candidate.revision === "current" && candidate.fixture === id,
      )!;
      const measuredOptions = options as StoryScoreProjectionOptions;
      const input = inputFor({
        ...measuredOptions,
        sceneMeasurements: {
          ...measuredOptions.sceneMeasurements,
          professionalProjectInteractionEnvelopes: {
            2: replay.constraints.fullTransitionOuterBounds,
          },
        },
      });
      const result = evaluateProjectsCapacity(input);
      const second = result.visits.find(
        ({ projectIndex }) => projectIndex === 2,
      )!;
      const visits = input.projection.evidence.projectSerpentine.visitAnchors;

      expect(second.minimumClearance).toBeGreaterThanOrEqual(12);
      expect(second.visible).toBe(true);
      expect(result.status).not.toBe("PASS");
      expect(visits[2]!.anchor.x).toBeCloseTo(replay.joins[2]!.anchor.x - rebasePrePortfolioMeasurements(options as StoryScoreProjectionOptions).shift, 5);
      expect(visits[2]!.cardRect).toEqual(rebasePrePortfolioMeasurements(options as StoryScoreProjectionOptions).options.sceneMeasurements!.professionalProjectCards![2]);
      expect(
        input.projection.branches.professional.zones
          .filter(
            ({ chapterId, kind }) =>
              chapterId === "professional-projects" && kind === "connector",
          )
          .every(({ eventCount }) => eventCount === 0),
      ).toBe(true);
      expect(
        input.projection.branches.professional.path.continuity.maximumPointGap,
      ).toBe(0);
    },
  );
});
