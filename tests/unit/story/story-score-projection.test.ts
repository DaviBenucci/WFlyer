import { describe, expect, it } from "vitest";

import { buildStoryScoreProjection, STORY_SCORE_CHAPTER_BARLINES, STORY_SCORE_PROJECTION_MODES } from "@/lib/story/score/projection";
import { STORY_SCORE_COMPOSITIONS, storyScoreCompositionDiagnostics } from "@/lib/story/score/composition";
import { DESKTOP_TIMELINE_ORDER } from "@/lib/story/manifest";
import { storyLandmarkTarget, storyProgressToCameraPosition, storyRegionAtProgress } from "@/lib/story/motion/geometry";

describe("portfolio score projection", () => {
  it("retains six segments, one final barline, and one approved clef", () => {
    const classifications = Object.entries(STORY_SCORE_CHAPTER_BARLINES);
    expect(classifications.filter(([id]) => !id.endsWith("-terminal"))).toHaveLength(6);
    expect(classifications.filter(([id]) => id.endsWith("-terminal"))).toHaveLength(1);
    const projection = buildStoryScoreProjection("horizontal-enhanced");
    expect(projection.evidence.segmentCount).toBe(6);
    expect(projection.evidence.ordinaryBarlineCount).toBe(0);
    expect(projection.evidence.finalBarlines).toEqual({ professional: "thin-gap-thick-and-physical-end" });
    expect(projection.evidence.clef).toMatchObject({ assetKey: "wf-music-treble-clef", count: 1, mirrorX: false, mirrorY: false });
    expect(Object.keys(projection.branches)).toEqual(["professional"]);
  });

  it.each(STORY_SCORE_PROJECTION_MODES)("renders the unchanged Professional composition safely in %s", (mode) => {
    const projection = buildStoryScoreProjection(mode, {
      viewportHeight: 900,
      viewportWidth: mode === "vertical-compact" ? 390 : 1440,
    });
    const branch = projection.branches.professional;
    const expectedSlots = [
      ...branch.composition.motifs.map(({ slotId }) => slotId),
      ...branch.composition.emptySlots.map(({ slotId }) => slotId),
    ].sort();
    expect(branch.composition).toBe(STORY_SCORE_COMPOSITIONS.professional);
    expect(branch.semanticSegmentIds).toHaveLength(6);
    expect(branch.zones.flatMap(({ semanticSlotIds }) => semanticSlotIds).sort()).toEqual(expectedSlots);
    expect(branch.model.staff.lines).toHaveLength(5);
    expect(branch.zones.at(-1)).toMatchObject({ endT: 1, kind: "notation-safe" });
    expect(branch.model.layers.at(-1)?.primitives.slice(-2).map(({ role }) => role)).toEqual(["final-barline-thin", "final-barline-thick"]);
    expect(projection.evidence.maximumNotationTangentAngleDeg).toBeLessThanOrEqual(18.0000001);
    expect(projection.evidence.connectorEventCount).toBe(0);
    expect(projection.evidence.continuity.maximumPointGap).toBeLessThanOrEqual(1e-7);
    expect(projection.evidence.pathSelfIntersections).toEqual({ professional: 0 });
    expect(projection.evidence.staffLineSelfIntersections).toEqual({ professional: 0 });
  });

  it("caches equivalent measured projections without recomposing", () => {
    const measurements = { chapterContentExclusions: { "professional-services": [{ height: 521.8, width: 330.03, x: 12_714.31, y: 189.09, reason: "heading-and-body" }] } } as const;
    const options = { sceneMeasurements: measurements, viewportHeight: 900, viewportWidth: 1536 };
    const first = buildStoryScoreProjection("horizontal-enhanced", options);
    const equivalent = buildStoryScoreProjection("horizontal-enhanced", { ...options, sceneMeasurements: structuredClone(measurements) });
    const changed = buildStoryScoreProjection("horizontal-enhanced", { ...options, sceneMeasurements: { chapterContentExclusions: { "professional-services": [{ ...measurements.chapterContentExclusions["professional-services"][0], x: 12_715.31 }] } } });
    expect(equivalent).toBe(first);
    expect(changed).not.toBe(first);
    expect(changed.branches.professional.composition).toBe(first.branches.professional.composition);
    expect(storyScoreCompositionDiagnostics().composerInvocationCount).toBe(1);
  });

  it("retains the three Projects visits and Services interaction in the Professional projection", () => {
    const projection = buildStoryScoreProjection("horizontal-enhanced", { viewportHeight: 900, viewportWidth: 1536 });
    expect(projection.evidence.cardScoreInteractions["professional-services"]).toMatchObject({ cardCount: 4, eventCount: 0 });
    expect(projection.evidence.projectSerpentine.visitAnchors).toHaveLength(3);
    expect(projection.evidence.projectSerpentine.connectorEventCounts).toEqual([0, 0, 0, 0]);
    expect(projection.evidence.projectSerpentine.pathSelfIntersections).toBe(0);
    expect(projection.evidence.projectSerpentine.staffLineSelfIntersections).toBe(0);
  });

  it("keeps Professional geometry crossing-free through responsive handoffs", () => {
    for (const [mode, width, height] of [
      ["horizontal-enhanced", 700, 900], ["vertical-compact", 700, 900],
      ["horizontal-enhanced", 768, 450], ["vertical-wide", 768, 450],
      ["horizontal-enhanced", 1920, 917],
    ] as const) {
      const projection = buildStoryScoreProjection(mode, { viewportWidth: width, viewportHeight: height });
      expect(projection.evidence.pathSelfIntersections).toEqual({ professional: 0 });
      expect(projection.evidence.staffLineSelfIntersections).toEqual({ professional: 0 });
    }
  }, 15_000);

  it("projects one continuous semantic story across landscape and portrait geometry", () => {
    const expanded = buildStoryScoreProjection("horizontal-enhanced", { viewportWidth: 1536, viewportHeight: 900 });
    const compact = buildStoryScoreProjection("vertical-wide", { viewportWidth: 1366, viewportHeight: 611 });
    const portrait = buildStoryScoreProjection("vertical-compact", { viewportWidth: 390, viewportHeight: 844 });
    const identities = [expanded, compact, portrait].map(({ spatialGeometry }) =>
      spatialGeometry.chapters.map(({ chapterId, stations }) => [chapterId, stations.map(({ id }) => id)]));
    expect(identities[1]).toEqual(identities[0]);
    expect(identities[2]).toEqual(identities[0]);
    expect(expanded.spatialGeometry.chapters.map(({ chapterId }) => chapterId)).toEqual(DESKTOP_TIMELINE_ORDER);
    expect(expanded.spatialGeometry.storySpan.end).not.toBe(compact.spatialGeometry.storySpan.end);
    expect(compact.spatialGeometry.storySpan.end).not.toBe(portrait.spatialGeometry.storySpan.end);
    expect(buildStoryScoreProjection("vertical-wide", {
      viewportWidth: 1366, viewportHeight: 611,
    }).spatialGeometry).toEqual(compact.spatialGeometry);

    for (const { spatialGeometry } of [expanded, compact, portrait]) {
      for (const [index, chapter] of spatialGeometry.chapters.entries()) {
        expect(chapter.entryAnchor).toBeGreaterThan(chapter.structuralStart);
        expect(chapter.contentSpan.start).toBe(chapter.structuralStart);
        expect(chapter.exitTransition?.end ?? spatialGeometry.storySpan.end)
          .toBe(spatialGeometry.chapters[index + 1]?.structuralStart ?? spatialGeometry.storySpan.end);
        expect(storyLandmarkTarget(spatialGeometry, chapter.chapterId).nativeScroll).toBeGreaterThanOrEqual(0);
      }
      expect(storyRegionAtProgress(spatialGeometry, 1).chapterId).toBe("professional-terminal");
    }
    expect(expanded.spatialGeometry.chapterById["professional-contact"].interactionSpans).toHaveLength(1);
    expect(expanded.spatialGeometry.cameraSegments.some(({ kind, from, to }) =>
      kind === "local-hold" && from.x === to.x)).toBe(true);
    expect(portrait.spatialGeometry.cameraSegments.some(({ kind, from, to }) =>
      kind === "local-hold" && from.x === to.x && from.y < to.y)).toBe(true);
    expect(storyProgressToCameraPosition(portrait.spatialGeometry, 1).x).toBe(0);
    expect(portrait.spatialGeometry.chapterById["professional-projects"].interactionSpans).toHaveLength(0);
    expect(expanded.spatialGeometry.chapterById["professional-projects"].interactionSpans).toHaveLength(1);
  }, 15_000);
});
