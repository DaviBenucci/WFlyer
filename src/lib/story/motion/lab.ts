import {
  DESKTOP_TIMELINE_ORDER,
  MOBILE_STORY_CHAPTERS,
  STORY_CHAPTER_BY_ID,
} from "../manifest";
import type { StoryChapterId } from "../types";

/**
 * Provisional Motion-Lab-only spans. They intentionally keep the two branches
 * asymmetric so Home is measured from real rendered geometry. These are not
 * canonical scene weights and remain subject to the documented calibration
 * gate before public integration.
 */
export const MOTION_LAB_DRAFT_CHAPTER_SPANS = Object.freeze({
  "application-terminal": 0.72,
  "application-access": 0.82,
  "application-demo": 1.05,
  "application-benefits": 0.92,
  "application-how-it-works": 1,
  "application-overview": 0.92,
  home: 1.15,
  "professional-about": 1.1,
  "professional-services": 1.05,
  "professional-process": 1,
  "professional-projects": 1.25,
  "professional-contact": 1.1,
  "professional-terminal": 0.85,
} as const satisfies Readonly<Record<StoryChapterId, number>>);

const DESKTOP_ORDER_INDEX = Object.freeze(
  Object.fromEntries(
    DESKTOP_TIMELINE_ORDER.map((chapterId, index) => [chapterId, index]),
  ),
) as Readonly<Record<StoryChapterId, number>>;

export const MOTION_LAB_PLACEHOLDER_CHAPTERS = Object.freeze(
  MOBILE_STORY_CHAPTERS.map((chapter) =>
    Object.freeze({
      chapter,
      desktopIndex: DESKTOP_ORDER_INDEX[chapter.id],
      draftSpan: MOTION_LAB_DRAFT_CHAPTER_SPANS[chapter.id],
    }),
  ),
);

export const MOTION_LAB_DESKTOP_LABELS = Object.freeze(
  DESKTOP_TIMELINE_ORDER.map(
    (chapterId) => STORY_CHAPTER_BY_ID[chapterId].timelineLabel,
  ),
);
