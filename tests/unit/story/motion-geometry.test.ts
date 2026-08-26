import { describe, expect, it } from "vitest";

import { DESKTOP_TIMELINE_ORDER } from "@/lib/story";
import {
  closestStoryChapter,
  measureStoryTimelineGeometry,
  storyProgressToNativeScroll,
} from "@/lib/story/motion/geometry";

function measuredElement(offsetLeft: number, offsetWidth: number): HTMLElement {
  const element = document.createElement("section");
  Object.defineProperties(element, {
    offsetLeft: { configurable: true, value: offsetLeft },
    offsetWidth: { configurable: true, value: offsetWidth },
  });
  return element;
}

describe("Phase-5 master-story geometry", () => {
  it("derives Home from asymmetric rendered branch geometry", () => {
    const widths = [720, 820, 1050, 920, 1000, 920, 1150, 1100, 1050, 1000, 1250, 1100, 850];
    const chapterElements = new Map();
    let offset = 0;

    for (const [index, chapterId] of DESKTOP_TIMELINE_ORDER.entries()) {
      const width = widths[index];
      if (width === undefined) throw new Error("Missing test chapter width.");
      chapterElements.set(chapterId, measuredElement(offset, width));
      offset += width;
    }

    const geometry = measureStoryTimelineGeometry({
      chapterElements,
      trackWidth: offset,
      viewportWidth: 1000,
    });
    const expectedHome = (5430 + 575 - 500) / (12930 - 1000);

    expect(geometry.homeProgress).toBeCloseTo(expectedHome, 8);
    expect(geometry.homeProgress).not.toBe(0.5);
    expect(geometry.chapters.map(({ chapterId }) => chapterId)).toEqual(
      DESKTOP_TIMELINE_ORDER,
    );
    expect(closestStoryChapter(geometry, geometry.homeProgress)).toBe("home");
  });

  it("maps normalized progress into the native ScrollTrigger interval", () => {
    expect(storyProgressToNativeScroll(0, 320, 2320)).toBe(320);
    expect(storyProgressToNativeScroll(0.25, 320, 2320)).toBe(820);
    expect(storyProgressToNativeScroll(1, 320, 2320)).toBe(2320);
    expect(storyProgressToNativeScroll(2, 320, 2320)).toBe(2320);
  });
});
