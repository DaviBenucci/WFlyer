import { buildStoryScoreProjection, type StoryScoreProjectionOptions } from "@/lib/story/score/projection";

/**
 * Old Stage-1 Professional measurements were recorded after the removed
 * Application chapters. Translate only their horizontal coordinates for
 * continuity tests; these are not fresh portfolio validation captures.
 */
export function rebasePrePortfolioMeasurements(options: StoryScoreProjectionOptions) {
  const { viewportWidth, viewportHeight, sceneMeasurements } = options;
  if (!viewportWidth || !viewportHeight || !sceneMeasurements) throw new Error("Complete legacy measurements required");
  const oldHomeX = sceneMeasurements.chapterContentExclusions?.home?.[0]?.x;
  const currentHomeX = buildStoryScoreProjection("horizontal-enhanced", { viewportWidth, viewportHeight })
    .branches.professional.chapters.find(({ chapterId }) => chapterId === "home")!.contentRect.x;
  if (oldHomeX === undefined) throw new Error("Legacy Home anchor required");
  const shift = oldHomeX - currentHomeX;
  const move = <T extends { readonly x: number }>(rect: T): T => ({ ...rect, x: rect.x - shift });
  const chapterContentExclusions = Object.fromEntries(
    Object.entries(sceneMeasurements.chapterContentExclusions ?? {})
      .filter(([chapterId]) => chapterId === "home" || chapterId.startsWith("professional-"))
      .map(([chapterId, rects]) => [chapterId, rects?.map(move)]),
  );
  const professionalProjectCards = sceneMeasurements.professionalProjectCards?.map(move);
  const professionalServicesCards = sceneMeasurements.professionalServicesCards?.map(move);
  if (!professionalProjectCards || !professionalServicesCards) throw new Error("Professional card measurements required");
  return {
    options: {
      ...options,
      sceneMeasurements: {
        chapterContentExclusions,
        professionalProjectCards,
        professionalServicesCards,
        ...(sceneMeasurements.professionalProjectInteractionEnvelopes ? {
          professionalProjectInteractionEnvelopes: Object.fromEntries(Object.entries(sceneMeasurements.professionalProjectInteractionEnvelopes).map(([index, rect]) => [index, rect ? move(rect) : rect])),
        } : {}),
        ...(sceneMeasurements.professionalProjectInteractionSweeps ? {
          professionalProjectInteractionSweeps: sceneMeasurements.professionalProjectInteractionSweeps,
        } : {}),
      },
    } satisfies StoryScoreProjectionOptions,
    shift,
  };
}
