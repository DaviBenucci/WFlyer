import { describe, expect, it } from "vitest";

import { DESKTOP_TIMELINE_ORDER } from "@/lib/story";
import {
  closestStoryChapter,
  measureStoryTimelineGeometry,
  nativeScrollToStoryProgress,
  projectStoryTimelineGeometry,
  restoreStoryStation,
  spatialStoryProgressToNativeScroll,
  storyLandmarkTarget,
  storyProgressToCameraPosition,
  storyRegionAtProgress,
  storyProgressToNativeScroll,
  type StorySpatialProjection,
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
  it("derives Home from the start of the portfolio geometry", () => {
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
    expect(geometry.homeProgress).toBe(0);
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

function spatialInput(contactLength = 1): StorySpatialProjection {
  let boundary = 0;
  const chapters = DESKTOP_TIMELINE_ORDER.map((chapterId, index) => {
    const start = boundary;
    const end = start + (chapterId === "professional-contact" ? contactLength : 1);
    const length = end - start;
    boundary = end + (index === DESKTOP_TIMELINE_ORDER.length - 1 ? 0 : 1);
    return {
      chapterId,
      structuralStart: start,
      entryAnchor: start + length / 4,
      contentSpan: { start, end },
      interactionSpans: chapterId === "professional-contact"
        ? [{ start: start + length / 4, end: end - length / 4 }]
        : [],
      exitTransition: index === DESKTOP_TIMELINE_ORDER.length - 1
        ? null
        : { start: end, end: end + 1 },
      stations: [{ id: "main", span: { start, end } }],
    };
  });
  return {
    chapters,
    cameraSegments: [
      { kind: "traverse", span: { start: 0, end: 2 }, from: { x: 0, y: 0 }, to: { x: 20, y: 0 } },
      { kind: "local-hold", span: { start: 2, end: 3 }, from: { x: 20, y: 0 }, to: { x: 20, y: 100 } },
      { kind: "traverse", span: { start: 3, end: boundary }, from: { x: 20, y: 100 }, to: { x: 100, y: 100 } },
    ],
    nativeScrollSpan: { start: 100, end: 100 + 100 * boundary },
    trackWidth: 200,
    viewportWidth: 100,
  };
}

describe("continuous spatial story contract", () => {
  it("maps native endpoints and shared boundaries through one ordered story", () => {
    const geometry = projectStoryTimelineGeometry(spatialInput());
    expect(nativeScrollToStoryProgress(geometry, 100)).toBe(0);
    expect(nativeScrollToStoryProgress(geometry, 1400)).toBe(1);
    expect(spatialStoryProgressToNativeScroll(geometry, 0)).toBe(100);
    expect(spatialStoryProgressToNativeScroll(geometry, 1)).toBe(1400);
    expect(storyProgressToCameraPosition(geometry, 0)).toEqual({ x: 0, y: 0, localProgress: null });
    expect(storyProgressToCameraPosition(geometry, 1)).toEqual({ x: 100, y: 100, localProgress: null });
    expect(storyRegionAtProgress(geometry, 1 / 13)).toEqual({ chapterId: "home", kind: "exit-transition" });
    expect(storyRegionAtProgress(geometry, 2 / 13)).toEqual({ chapterId: "professional-about", kind: "content" });
    expect(storyRegionAtProgress(geometry, 1)).toEqual({ chapterId: "professional-terminal", kind: "content" });
    expect(storyProgressToCameraPosition(geometry, 2 / 13)).toEqual({ x: 20, y: 0, localProgress: 0 });
    for (const progress of [0, 1 / 13, 2 / 13, 2.5 / 13, 3 / 13, 1]) {
      expect(nativeScrollToStoryProgress(geometry, spatialStoryProgressToNativeScroll(geometry, progress)))
        .toBeCloseTo(progress, 12);
    }
  });

  it("keeps semantic entry distinct from scene start and restores stations across lengths", () => {
    const short = projectStoryTimelineGeometry(spatialInput());
    const long = projectStoryTimelineGeometry(spatialInput(2));
    const chapter = short.chapterById["professional-about"];
    expect(chapter.structuralStart).toBe(2);
    expect(chapter.entryAnchor).toBe(2.25);
    expect(chapter.progress).toBeCloseTo(2.25 / 13);
    expect(storyLandmarkTarget(short, "professional-about")).toEqual({
      progress: chapter.progress,
      nativeScroll: 325,
      camera: { x: 20, y: 25, localProgress: 0.25 },
    });
    const shortProgress = restoreStoryStation(short, "professional-contact", "main", 0.6);
    const longProgress = restoreStoryStation(long, "professional-contact", "main", 0.6);
    expect(shortProgress).not.toBeCloseTo(longProgress);
    expect(spatialStoryProgressToNativeScroll(long, longProgress)).not.toBeCloseTo(
      spatialStoryProgressToNativeScroll(short, shortProgress),
    );
    expect(long.chapterById["professional-contact"].stations[0]?.span.end)
      .not.toBe(short.chapterById["professional-contact"].stations[0]?.span.end);
  });

  it("advances local vertical content while lateral camera travel holds", () => {
    const input = spatialInput();
    const geometry = projectStoryTimelineGeometry(input);
    expect(storyProgressToCameraPosition(geometry, 2.5 / 13))
      .toEqual({ x: 20, y: 50, localProgress: 0.5 });
    expect(storyProgressToCameraPosition(geometry, 3 / 13))
      .toEqual({ x: 20, y: 100, localProgress: null });
    expect(storyProgressToCameraPosition(geometry, 4 / 13).x).toBeGreaterThan(20);
    (input.cameraSegments[1]?.to as { y: number }).y = 999;
    (input.chapters[1]?.contentSpan as { end: number }).end = 999;
    expect(storyProgressToCameraPosition(geometry, 2.5 / 13).y).toBe(50);
    expect(geometry.chapterById["professional-about"].contentSpan.end).toBe(3);
  });

  it("has deterministic zero-travel fallback", () => {
    const input = spatialInput();
    const geometry = projectStoryTimelineGeometry({
      ...input,
      nativeScrollSpan: { start: 100, end: 100 },
    });
    expect(nativeScrollToStoryProgress(geometry, 100)).toBe(0);
    expect(spatialStoryProgressToNativeScroll(geometry, 1)).toBe(100);
    const stationary = projectStoryTimelineGeometry({
      ...input,
      trackWidth: 100,
      viewportWidth: 100,
      cameraSegments: input.cameraSegments.map((segment) => ({
        ...segment,
        from: { ...segment.from, x: 0 },
        to: { ...segment.to, x: 0 },
      })),
    });
    expect(storyProgressToCameraPosition(stationary, 1).x).toBe(0);
    expect(nativeScrollToStoryProgress(stationary, 750)).toBe(0.5);
  });

  it("rejects non-finite, reversed, unordered, uncovered and invalid semantic geometry", () => {
    const input = spatialInput();
    expect(() => projectStoryTimelineGeometry({ ...input, trackWidth: Number.NaN })).toThrow();
    expect(() => projectStoryTimelineGeometry({ ...input, nativeScrollSpan: { start: 10, end: 9 } })).toThrow();
    expect(() => projectStoryTimelineGeometry({ ...input, chapters: [...input.chapters].reverse() })).toThrow();
    expect(() => projectStoryTimelineGeometry({ ...input, cameraSegments: input.cameraSegments.slice(1) })).toThrow();
    expect(() => projectStoryTimelineGeometry({
      ...input,
      cameraSegments: input.cameraSegments.map((segment, index) => index === 1
        ? { ...segment, from: { x: 21, y: 0 } }
        : segment),
    })).toThrow();
    expect(() => projectStoryTimelineGeometry({
      ...input,
      chapters: input.chapters.map((chapter, index) => index === 1
        ? { ...chapter, entryAnchor: chapter.contentSpan.start - 0.1 }
        : chapter),
    })).toThrow();
    expect(() => projectStoryTimelineGeometry({
      ...input,
      chapters: input.chapters.map((chapter, index) => index === 0
        ? { ...chapter, exitTransition: { start: 1, end: 1.5 } }
        : chapter),
    })).toThrow();
    expect(() => projectStoryTimelineGeometry({
      ...input,
      chapters: input.chapters.map((chapter) => chapter.chapterId === "professional-contact"
        ? { ...chapter, interactionSpans: [{ start: 9.5, end: 10.5 }] }
        : chapter),
    })).toThrow();
    const geometry = projectStoryTimelineGeometry(input);
    expect(() => nativeScrollToStoryProgress(geometry, Number.NaN)).toThrow();
    expect(() => storyProgressToCameraPosition(geometry, Number.POSITIVE_INFINITY)).toThrow();
    expect(() => restoreStoryStation(geometry, "home", "missing", 0.5)).toThrow();
    expect(() => restoreStoryStation(geometry, "home", "main", Number.POSITIVE_INFINITY)).toThrow();
  });
});
