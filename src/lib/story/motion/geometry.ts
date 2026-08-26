import { DESKTOP_TIMELINE_ORDER, STORY_CHAPTER_BY_ID } from "../manifest";
import type { StoryChapterId, StoryTimelineLabel } from "../types";

export interface StoryChapterGeometry {
  readonly centerPx: number;
  readonly chapterId: StoryChapterId;
  readonly progress: number;
  readonly timelineLabel: StoryTimelineLabel;
}

export interface StoryTimelineGeometry {
  readonly chapterById: Readonly<Record<StoryChapterId, StoryChapterGeometry>>;
  readonly chapters: readonly StoryChapterGeometry[];
  readonly homeProgress: number;
  readonly trackWidth: number;
  readonly travel: number;
  readonly viewportWidth: number;
}

export interface StoryTrackMeasurement {
  readonly chapterElements: ReadonlyMap<StoryChapterId, HTMLElement>;
  readonly trackWidth: number;
  readonly viewportWidth: number;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

export function measureStoryTimelineGeometry({
  chapterElements,
  trackWidth,
  viewportWidth,
}: StoryTrackMeasurement): StoryTimelineGeometry {
  const safeViewportWidth = Math.max(1, viewportWidth);
  const safeTrackWidth = Math.max(safeViewportWidth, trackWidth);
  const travel = Math.max(0, safeTrackWidth - safeViewportWidth);

  const chapters = DESKTOP_TIMELINE_ORDER.map((chapterId) => {
    const element = chapterElements.get(chapterId);

    if (element === undefined) {
      throw new Error(`Motion story chapter "${chapterId}" is not mounted.`);
    }

    const centerPx = element.offsetLeft + element.offsetWidth / 2;
    const targetTravel = clamp(
      centerPx - safeViewportWidth / 2,
      0,
      travel,
    );
    const progress = travel === 0 ? 0 : targetTravel / travel;

    return Object.freeze({
      centerPx,
      chapterId,
      progress,
      timelineLabel: STORY_CHAPTER_BY_ID[chapterId].timelineLabel,
    });
  });
  const chapterById = Object.freeze(
    Object.fromEntries(chapters.map((chapter) => [chapter.chapterId, chapter])),
  ) as Readonly<Record<StoryChapterId, StoryChapterGeometry>>;

  return Object.freeze({
    chapterById,
    chapters: Object.freeze(chapters),
    homeProgress: chapterById.home.progress,
    trackWidth: safeTrackWidth,
    travel,
    viewportWidth: safeViewportWidth,
  });
}

export function closestStoryChapter(
  geometry: StoryTimelineGeometry,
  progress: number,
): StoryChapterId {
  const normalizedProgress = clamp(progress, 0, 1);
  const firstChapter = geometry.chapters[0];
  if (firstChapter === undefined) {
    throw new Error("The motion story geometry contains no chapters.");
  }
  let closest = firstChapter;

  for (const chapter of geometry.chapters.slice(1)) {
    if (
      Math.abs(chapter.progress - normalizedProgress) <
      Math.abs(closest.progress - normalizedProgress)
    ) {
      closest = chapter;
    }
  }

  return closest.chapterId;
}

export function storyProgressToNativeScroll(
  progress: number,
  scrollStart: number,
  scrollEnd: number,
): number {
  return (
    scrollStart +
    clamp(progress, 0, 1) * Math.max(0, scrollEnd - scrollStart)
  );
}
