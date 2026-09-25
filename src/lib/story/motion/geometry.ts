import { DESKTOP_TIMELINE_ORDER, STORY_CHAPTER_BY_ID } from "../manifest";
import type { StoryChapterId, StoryTimelineLabel } from "../types";

export interface StoryChapterGeometry {
  readonly centerPx: number;
  readonly chapterId: StoryChapterId;
  readonly progress: number;
  readonly timelineLabel: StoryTimelineLabel;
  readonly structuralStart?: number;
  readonly entryAnchor?: number;
  readonly contentSpan?: StorySpan;
  readonly interactionSpans?: readonly StorySpan[];
  readonly exitTransition?: StorySpan | null;
  readonly stations?: readonly StoryContentStation[];
}

export interface StoryTimelineGeometry {
  readonly chapterById: Readonly<Record<StoryChapterId, StoryChapterGeometry>>;
  readonly chapters: readonly StoryChapterGeometry[];
  readonly homeProgress: number;
  readonly trackWidth: number;
  readonly travel: number;
  readonly viewportWidth: number;
  readonly storySpan?: StorySpan;
  readonly nativeScrollSpan?: StorySpan;
  readonly cameraSegments?: readonly StoryCameraSegment[];
}

export interface StorySpan {
  readonly start: number;
  readonly end: number;
}

export interface StoryContentStation {
  readonly id: string;
  readonly span: StorySpan;
}

export interface StoryCameraPosition {
  readonly x: number;
  readonly y: number;
  readonly localProgress: number | null;
}

export interface StoryCameraSegment {
  readonly span: StorySpan;
  readonly kind: "traverse" | "local-hold";
  readonly from: Pick<StoryCameraPosition, "x" | "y">;
  readonly to: Pick<StoryCameraPosition, "x" | "y">;
}

export interface StorySpatialChapterGeometry extends StoryChapterGeometry {
  readonly structuralStart: number;
  readonly entryAnchor: number;
  readonly contentSpan: StorySpan;
  readonly interactionSpans: readonly StorySpan[];
  readonly exitTransition: StorySpan | null;
  readonly stations: readonly StoryContentStation[];
}

export interface StorySpatialTimelineGeometry extends StoryTimelineGeometry {
  readonly chapterById: Readonly<Record<StoryChapterId, StorySpatialChapterGeometry>>;
  readonly chapters: readonly StorySpatialChapterGeometry[];
  readonly storySpan: StorySpan;
  readonly nativeScrollSpan: StorySpan;
  readonly cameraSegments: readonly StoryCameraSegment[];
}

export interface StorySpatialProjection {
  readonly chapters: readonly Omit<StorySpatialChapterGeometry, "centerPx" | "progress" | "timelineLabel">[];
  readonly cameraSegments: readonly StoryCameraSegment[];
  readonly nativeScrollSpan: StorySpan;
  readonly trackWidth: number;
  readonly viewportWidth: number;
}

function assertSpan(span: StorySpan, name: string, positive = true): void {
  if (!Number.isFinite(span.start) || !Number.isFinite(span.end) ||
      (positive ? span.end <= span.start : span.end < span.start)) {
    throw new Error(`Invalid ${name} span.`);
  }
}

function assertFinite(value: number, name: string): void {
  if (!Number.isFinite(value)) throw new Error(`Invalid ${name}.`);
}

function frozenSpan(span: StorySpan): StorySpan {
  return Object.freeze({ start: span.start, end: span.end });
}

/** Half-open ranges own shared boundaries; only Terminal owns the final endpoint. */
export function projectStoryTimelineGeometry({
  chapters: inputs,
  cameraSegments: inputSegments,
  nativeScrollSpan,
  trackWidth,
  viewportWidth,
}: StorySpatialProjection): StorySpatialTimelineGeometry {
  assertFinite(trackWidth, "track width");
  assertFinite(viewportWidth, "viewport width");
  if (viewportWidth <= 0 || trackWidth < viewportWidth) {
    throw new Error("Invalid projected track size.");
  }
  assertSpan(nativeScrollSpan, "native scroll", false);
  if (inputs.length !== DESKTOP_TIMELINE_ORDER.length) {
    throw new Error("Incomplete story chapter geometry.");
  }

  const first = inputs[0];
  const last = inputs.at(-1);
  if (!first || !last) throw new Error("Empty story geometry.");
  const storySpan = { start: first.contentSpan.start, end: last.contentSpan.end };
  assertSpan(storySpan, "story");
  const travel = trackWidth - viewportWidth;
  const chapters = inputs.map((input, index): StorySpatialChapterGeometry => {
    if (input.chapterId !== DESKTOP_TIMELINE_ORDER[index]) {
      throw new Error("Invalid semantic landmark order.");
    }
    assertSpan(input.contentSpan, `${input.chapterId} content`);
    assertFinite(input.structuralStart, `${input.chapterId} structural start`);
    assertFinite(input.entryAnchor, `${input.chapterId} entry anchor`);
    if (input.structuralStart !== input.contentSpan.start ||
        input.entryAnchor < input.contentSpan.start ||
        input.entryAnchor >= input.contentSpan.end) {
      throw new Error(`Invalid ${input.chapterId} landmark entry.`);
    }
    const previous = inputs[index - 1];
    if (previous && previous.exitTransition?.end !== input.contentSpan.start) {
      throw new Error(`Uncovered boundary before ${input.chapterId}.`);
    }
    if (index === inputs.length - 1) {
      if (input.exitTransition !== null) throw new Error("Terminal must have a settled end.");
    } else {
      if (!input.exitTransition) throw new Error(`Missing ${input.chapterId} exit transition.`);
      assertSpan(input.exitTransition, `${input.chapterId} exit transition`);
      if (input.exitTransition.start !== input.contentSpan.end) {
        throw new Error(`Invalid ${input.chapterId} exit boundary.`);
      }
    }
    let previousEnd = input.contentSpan.start;
    for (const span of input.interactionSpans) {
      assertSpan(span, `${input.chapterId} interaction`);
      if (span.start < previousEnd || span.end > input.contentSpan.end) {
        throw new Error(`Invalid ${input.chapterId} interaction order.`);
      }
      previousEnd = span.end;
    }
    previousEnd = input.contentSpan.start;
    const ids = new Set<string>();
    for (const station of input.stations) {
      assertSpan(station.span, `${input.chapterId} station`);
      if (!station.id || ids.has(station.id) || station.span.start < previousEnd ||
          station.span.end > input.contentSpan.end) {
        throw new Error(`Invalid ${input.chapterId} station order or identity.`);
      }
      ids.add(station.id);
      previousEnd = station.span.end;
    }
    if (!input.stations.some(({ span }) =>
      input.entryAnchor >= span.start && input.entryAnchor < span.end)) {
      throw new Error(`No ${input.chapterId} entry station.`);
    }
    const progress = (input.entryAnchor - storySpan.start) /
      (storySpan.end - storySpan.start);
    const camera = cameraAt(inputSegments, input.entryAnchor, storySpan);
    return Object.freeze({
      ...input,
      centerPx: camera.x + viewportWidth / 2,
      progress,
      timelineLabel: STORY_CHAPTER_BY_ID[input.chapterId].timelineLabel,
      contentSpan: frozenSpan(input.contentSpan),
      interactionSpans: Object.freeze(input.interactionSpans.map(frozenSpan)),
      exitTransition: input.exitTransition ? frozenSpan(input.exitTransition) : null,
      stations: Object.freeze(input.stations.map(({ id, span }) =>
        Object.freeze({ id, span: frozenSpan(span) }))),
    });
  });

  if (inputSegments.length === 0) throw new Error("Missing camera segments.");
  let boundary = storySpan.start;
  let previousCamera: StoryCameraSegment | undefined;
  const cameraSegments = inputSegments.map((segment) => {
    assertSpan(segment.span, "camera");
    for (const pose of [segment.from, segment.to]) {
      assertFinite(pose.x, "camera x");
      assertFinite(pose.y, "camera y");
      if (pose.x < 0 || pose.x > travel) throw new Error("Camera exceeds track travel.");
    }
    if ((segment.kind !== "traverse" && segment.kind !== "local-hold") ||
        segment.span.start !== boundary ||
        (previousCamera && (previousCamera.to.x !== segment.from.x ||
                            previousCamera.to.y !== segment.from.y)) ||
        (segment.kind === "local-hold" && segment.from.x !== segment.to.x)) {
      throw new Error("Camera segments have an invalid join or hold.");
    }
    boundary = segment.span.end;
    previousCamera = segment;
    return Object.freeze({
      kind: segment.kind,
      span: frozenSpan(segment.span),
      from: Object.freeze({ x: segment.from.x, y: segment.from.y }),
      to: Object.freeze({ x: segment.to.x, y: segment.to.y }),
    });
  });
  if (boundary !== storySpan.end) throw new Error("Camera does not cover the story.");
  const chapterById = Object.freeze(Object.fromEntries(
    chapters.map((chapter) => [chapter.chapterId, chapter]),
  )) as Readonly<Record<StoryChapterId, StorySpatialChapterGeometry>>;
  return Object.freeze({
    chapterById,
    chapters: Object.freeze(chapters),
    homeProgress: chapterById.home.progress,
    trackWidth,
    travel,
    viewportWidth,
    storySpan: Object.freeze(storySpan),
    nativeScrollSpan: frozenSpan(nativeScrollSpan),
    cameraSegments: Object.freeze(cameraSegments),
  });
}

function cameraAt(segments: readonly StoryCameraSegment[], coordinate: number, storySpan: StorySpan): StoryCameraPosition {
  const segment = segments.find(({ span }) => coordinate < span.end) ??
    (coordinate === storySpan.end ? segments.at(-1) : undefined);
  if (!segment || coordinate < segment.span.start || coordinate > segment.span.end) {
    throw new Error("Camera does not cover the landmark entry.");
  }
  const fraction = (coordinate - segment.span.start) /
    (segment.span.end - segment.span.start);
  return {
    x: segment.from.x + (segment.to.x - segment.from.x) * fraction,
    y: segment.from.y + (segment.to.y - segment.from.y) * fraction,
    localProgress: segment.kind === "local-hold" ? fraction : null,
  };
}

export function nativeScrollToStoryProgress(geometry: StorySpatialTimelineGeometry, offset: number): number {
  assertFinite(offset, "native offset");
  const { start, end } = geometry.nativeScrollSpan;
  return end === start ? 0 : clamp((offset - start) / (end - start), 0, 1);
}

export function spatialStoryProgressToNativeScroll(geometry: StorySpatialTimelineGeometry, progress: number): number {
  assertFinite(progress, "story progress");
  const { start, end } = geometry.nativeScrollSpan;
  return start + clamp(progress, 0, 1) * (end - start);
}

export function storyProgressToCameraPosition(geometry: StorySpatialTimelineGeometry, progress: number): StoryCameraPosition {
  assertFinite(progress, "story progress");
  const { start, end } = geometry.storySpan;
  return cameraAt(geometry.cameraSegments, start + clamp(progress, 0, 1) * (end - start), geometry.storySpan);
}

export function storyLandmarkTarget(
  geometry: StorySpatialTimelineGeometry,
  chapterId: StoryChapterId,
): { readonly progress: number; readonly nativeScroll: number; readonly camera: StoryCameraPosition } {
  const chapter = geometry.chapterById[chapterId];
  if (!chapter) throw new Error(`Unknown story landmark ${chapterId}.`);
  return {
    progress: chapter.progress,
    nativeScroll: spatialStoryProgressToNativeScroll(geometry, chapter.progress),
    camera: storyProgressToCameraPosition(geometry, chapter.progress),
  };
}

export function storyRegionAtProgress(
  geometry: StorySpatialTimelineGeometry,
  progress: number,
): { readonly chapterId: StoryChapterId; readonly kind: "content" | "exit-transition" } {
  assertFinite(progress, "story progress");
  const { start, end } = geometry.storySpan;
  const coordinate = start + clamp(progress, 0, 1) * (end - start);
  for (const chapter of geometry.chapters) {
    if (coordinate < chapter.contentSpan.end ||
        (chapter.exitTransition === null && coordinate === end)) {
      return { chapterId: chapter.chapterId, kind: "content" };
    }
    if (chapter.exitTransition && coordinate < chapter.exitTransition.end) {
      return { chapterId: chapter.chapterId, kind: "exit-transition" };
    }
  }
  throw new Error("Story region is uncovered.");
}

export function restoreStoryStation(
  geometry: StorySpatialTimelineGeometry,
  chapterId: StoryChapterId,
  stationId: string,
  localFraction: number,
): number {
  assertFinite(localFraction, "station fraction");
  if (localFraction < 0 || localFraction > 1) throw new Error("Invalid station fraction.");
  const station = geometry.chapterById[chapterId]?.stations.find(({ id }) => id === stationId);
  if (!station) throw new Error(`Unknown story station ${chapterId}:${stationId}.`);
  const coordinate = station.span.start + localFraction *
    (station.span.end - station.span.start);
  return (coordinate - geometry.storySpan.start) /
    (geometry.storySpan.end - geometry.storySpan.start);
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
