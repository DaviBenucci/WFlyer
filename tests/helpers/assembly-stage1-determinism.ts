import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ScoreSvg } from "@/components/score/ScoreSvg";
import { SCORE_REVIEW_SVG_PRECISION } from "@/components/score/svg-number";
import { storyScoreCompositionDiagnostics } from "@/lib/story/score/composition";
import { buildStoryScoreProjection, type StoryScoreProjectionMode } from "@/lib/story/score/projection";
import { serializeStoryScoreGeometry, serializeStoryScoreEventSafety } from "@/components/story-score/projection-metadata";

/** Runs the real allocator/renderer in Node and each browser, without DOM measurements. */
export function snapshotStage1Projection(mode: StoryScoreProjectionMode) {
  const projection = buildStoryScoreProjection(mode);
  return {
    fingerprints: storyScoreCompositionDiagnostics().fingerprints,
    branches: Object.fromEntries(Object.entries(projection.branches).map(([branch, value]) => {
      const safety = value.eventSafety;
      const safetyFailures = safety.groups.flatMap((group, index) => {
        const shelf = safety.shelves[group.shelfIndex]!;
        const previous = safety.groups[index - 1];
        return shelf.classification !== "EVENT_SAFE_STRAIGHT" ||
          group.maximumTangentAngleDeg > 18 || group.tangentVariationDeg > 6 ||
          group.clearanceBefore < 1.5 * value.staffSpace - 1e-7 ||
          group.clearanceAfter < 1.5 * value.staffSpace - 1e-7 ||
          group.marginStartT < shelf.startT - 1e-7 ||
          group.marginEndT > shelf.endT + 1e-7 ||
          (previous && group.marginStartT < previous.marginEndT - 1e-7) ||
          value.model.motifs[index]!.notes.some(note => value.path.tangentAt(note.t).x <= 0)
          ? [group.slotId] : [];
      });
      return [branch, {
        semantic: {
          composition: value.composition,
          groups: safety.groups.map(({ slotId, originalZoneId, zoneId, shelfIndex, eventCount }) =>
            ({ slotId, originalZoneId, zoneId, shelfIndex, eventCount })),
          rejectedGroups: value.composition.motifs.filter(motif => !safety.groups.some(group => group.slotId === motif.slotId)).map(motif => motif.slotId),
          intervals: safety.shelves.map(({ zoneId, classification }) => ({ zoneId, classification })),
          zones: value.zones.map(({ id, kind, semanticSlotIds, eventCount }) => ({ id, kind, semanticSlotIds, eventCount })),
          structural: value.model.primitives.filter(p => p.layer === "structural" || p.layer === "barlines").map(({ id, role }) => ({ id, role })),
        },
        candidateCount: safety.candidateCount,
        canonicalSafety: serializeStoryScoreEventSafety(safety),
        canonicalModel: serializeStoryScoreGeometry(value.model),
        svg: renderToStaticMarkup(createElement(ScoreSvg, {
          model: value.model, numericPrecision: SCORE_REVIEW_SVG_PRECISION, viewBox: value.viewBox,
        })),
        rawCenters: value.model.motifs.flatMap(motif => motif.notes.map(note => ({ id: note.id, t: note.t, ...note.center }))),
        safetyFailures,
        forbiddenEventCount: safety.forbiddenEventCount,
      }];
    })),
  };
}
