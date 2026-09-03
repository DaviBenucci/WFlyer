import type { StoryScoreMeasuredRect } from "@/lib/story/score/projection";

interface ViewportRect {
  readonly height: number;
  readonly left: number;
  readonly top: number;
  readonly width: number;
}

const roundMeasurement = (value: number) => Number(value.toFixed(2));

/**
 * Removes the viewport translation shared by the story track and its content.
 * The returned plain numbers are stable while native scroll or the GSAP track
 * transform moves both rectangles by the same amount.
 */
export function normalizeStoryScoreMeasuredRect(
  elementRect: ViewportRect,
  trackRect: ViewportRect,
): StoryScoreMeasuredRect {
  return Object.freeze({
    height: roundMeasurement(elementRect.height),
    width: roundMeasurement(elementRect.width),
    x: roundMeasurement(elementRect.left - trackRect.left),
    y: roundMeasurement(elementRect.top - trackRect.top),
  });
}
