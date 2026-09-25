import type { Vec2 } from "@/lib/music/geometry/types";
import { DESKTOP_TIMELINE_ORDER } from "@/lib/story/manifest";
import type {
  StoryScoreMeasuredInteractionSweep,
  StoryScoreMeasuredRect,
  StoryScoreSceneMeasurements,
} from "@/lib/story/score/projection";

interface ViewportRect {
  readonly height: number;
  readonly left: number;
  readonly top: number;
  readonly width: number;
}

const roundMeasurement = (value: number) => Number(value.toFixed(2));

const ATOMIC_EXCLUSION_REASONS = new Set([
  "heading-and-body",
  "home-reading-envelope",
  "process-stages",
  "terminal-content",
]);

function exclusionMeasurementOwners(exclusion: HTMLElement): HTMLElement[] {
  const reason = exclusion.dataset.scoreContentExclusion ?? "";

  return ATOMIC_EXCLUSION_REASONS.has(reason)
    ? Array.from(exclusion.children).filter(
        (element): element is HTMLElement => element instanceof HTMLElement,
      )
    : [exclusion];
}

export function storyScoreMeasurementOwners(
  track: HTMLElement,
): readonly HTMLElement[] {
  const owners = new Set<HTMLElement>(
    track.querySelectorAll<HTMLElement>(
      "[data-service-module], [data-project-card-item]",
    ),
  );

  track
    .querySelectorAll<HTMLElement>("[data-score-content-exclusion]")
    .forEach((exclusion) => {
      exclusionMeasurementOwners(exclusion).forEach((owner) =>
        owners.add(owner),
      );
    });

  return Object.freeze([...owners]);
}

function measureElements(
  elements: readonly HTMLElement[],
  trackRect: DOMRect,
): readonly StoryScoreMeasuredRect[] {
  return Object.freeze(
    elements.flatMap((element) => {
      const rect = element.getBoundingClientRect();

      return rect.width > 0 && rect.height > 0
        ? [normalizeStoryScoreMeasuredRect(rect, trackRect)]
        : [];
    }),
  );
}

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

interface TransformState {
  readonly angle: number;
  readonly scale: number;
  readonly translateX: number;
  readonly translateY: number;
}

interface RectBounds {
  readonly bottom: number;
  readonly left: number;
  readonly right: number;
  readonly top: number;
}

interface ProjectRestGeometry {
  readonly height: number;
  readonly layoutLeft: number;
  readonly layoutTop: number;
  readonly normalizedIdle: StoryScoreMeasuredRect;
  readonly origin: { readonly x: number; readonly y: number };
  readonly start: TransformState;
  readonly width: number;
}

function matrixState(transform: string): TransformState {
  const matrix = new DOMMatrixReadOnly(transform === "none" ? undefined : transform);

  return Object.freeze({
    angle: Math.atan2(matrix.b, matrix.a),
    scale: Math.hypot(matrix.a, matrix.b),
    translateX: matrix.e,
    translateY: matrix.f,
  });
}

function transformedBounds(
  rect: RectBounds,
  origin: { readonly x: number; readonly y: number },
  state: TransformState,
): RectBounds {
  const points = transformedPolygon(rect, origin, state);

  return Object.freeze({
    bottom: Math.max(...points.map(({ y }) => y)),
    left: Math.min(...points.map(({ x }) => x)),
    right: Math.max(...points.map(({ x }) => x)),
    top: Math.min(...points.map(({ y }) => y)),
  });
}

function transformedPolygon(
  rect: RectBounds,
  origin: { readonly x: number; readonly y: number },
  state: TransformState,
): readonly Vec2[] {
  const cosine = Math.cos(state.angle);
  const sine = Math.sin(state.angle);

  return Object.freeze([
    { x: rect.left, y: rect.top },
    { x: rect.right, y: rect.top },
    { x: rect.right, y: rect.bottom },
    { x: rect.left, y: rect.bottom },
  ].map(({ x, y }) => {
    const localX = (x - origin.x) * state.scale;
    const localY = (y - origin.y) * state.scale;

    return {
      x:
        origin.x +
        localX * cosine -
        localY * sine +
        state.translateX,
      y:
        origin.y +
        localX * sine +
        localY * cosine +
        state.translateY,
    };
  }));
}

function restoreAttribute(
  element: HTMLElement,
  name: string,
  previous: string | null,
): void {
  if (previous === null) element.removeAttribute(name);
  else element.setAttribute(name, previous);
}

function withProjectMeasurementState<T>(
  item: HTMLElement,
  link: HTMLElement,
  state: "interaction" | "rest",
  measure: () => T,
): T {
  const previousInteractionProbe = item.getAttribute(
    "data-score-interaction-measurement",
  );
  const previousRestProbe = item.getAttribute("data-score-rest-measurement");
  const previousFocusProbe = link.getAttribute("data-score-focus-measurement");
  const previousStyle = item.getAttribute("style");

  item.style.setProperty("transition", "none", "important");
  if (state === "rest") {
    item.removeAttribute("data-score-interaction-measurement");
    link.removeAttribute("data-score-focus-measurement");
    item.setAttribute("data-score-rest-measurement", "active");
  } else {
    item.removeAttribute("data-score-rest-measurement");
    item.setAttribute("data-score-interaction-measurement", "active");
    link.setAttribute("data-score-focus-measurement", "active");
  }

  try {
    return measure();
  } finally {
    restoreAttribute(
      item,
      "data-score-interaction-measurement",
      previousInteractionProbe,
    );
    restoreAttribute(item, "data-score-rest-measurement", previousRestProbe);
    restoreAttribute(link, "data-score-focus-measurement", previousFocusProbe);

    // Commit the restored state while transition suppression is still active.
    // Otherwise the browser can batch restoration with transition re-enabling
    // and start a reverse animation that contaminates a later generation.
    void getComputedStyle(item).transform;
    void item.getBoundingClientRect();
    restoreAttribute(item, "style", previousStyle);
  }
}

function measureProjectRestGeometry(
  item: HTMLElement,
  link: HTMLElement,
  trackRect: DOMRect,
): ProjectRestGeometry | undefined {
  return withProjectMeasurementState(item, link, "rest", () => {
    const idleViewportRect = item.getBoundingClientRect();
    if (idleViewportRect.width <= 0 || idleViewportRect.height <= 0) {
      return undefined;
    }

    const idleStyle = getComputedStyle(item);
    const start = matrixState(idleStyle.transform);
    const absoluteA = Math.abs(Math.cos(start.angle) * start.scale);
    const absoluteB = Math.abs(Math.sin(start.angle) * start.scale);
    const determinant = absoluteA ** 2 - absoluteB ** 2;
    const previousTransform = item.style.getPropertyValue("transform");
    const previousTransformPriority =
      item.style.getPropertyPriority("transform");
    item.style.setProperty("transform", "none", "important");
    const layoutViewportRect = item.getBoundingClientRect();
    if (previousTransform) {
      item.style.setProperty(
        "transform",
        previousTransform,
        previousTransformPriority,
      );
    } else {
      item.style.removeProperty("transform");
    }
    void getComputedStyle(item).transform;
    const layoutRect = normalizeStoryScoreMeasuredRect(
      layoutViewportRect,
      trackRect,
    );
    const width =
      Math.abs(determinant) > 1e-7 ? layoutRect.width : item.offsetWidth;
    const height =
      Math.abs(determinant) > 1e-7 ? layoutRect.height : item.offsetHeight;
    const originParts = idleStyle.transformOrigin
      .split(" ")
      .map(Number.parseFloat);
    const origin = {
      x: Number.isFinite(originParts[0]) ? originParts[0]! : width / 2,
      y: Number.isFinite(originParts[1]) ? originParts[1]! : height,
    };
    const idleLocalBounds = transformedBounds(
      { bottom: height, left: 0, right: width, top: 0 },
      origin,
      start,
    );
    const normalizedIdle = Object.freeze({
      height: roundMeasurement(idleLocalBounds.bottom - idleLocalBounds.top),
      width: roundMeasurement(idleLocalBounds.right - idleLocalBounds.left),
      x: roundMeasurement(layoutRect.x + idleLocalBounds.left),
      y: roundMeasurement(layoutRect.y + idleLocalBounds.top),
    });

    return Object.freeze({
      height,
      layoutLeft: layoutRect.x,
      layoutTop: layoutRect.y,
      normalizedIdle,
      origin: Object.freeze(origin),
      start,
      width,
    });
  });
}

/**
 * Measures a conservative union of the production idle/hover/focus transition.
 * The bound samples the actual CSS transform endpoints and expands every sample
 * by a derivative bound, so engine/root-size differences remain input data.
 */
export interface ProjectInteractionMeasurement {
  readonly envelope: StoryScoreMeasuredRect;
  readonly sweep: StoryScoreMeasuredInteractionSweep;
}

export function measureProjectInteractionGeometry(
  item: HTMLElement,
  trackRect: DOMRect,
  knownRestGeometry?: ProjectRestGeometry,
): ProjectInteractionMeasurement | undefined {
  const card = item.querySelector<HTMLElement>("[data-project-card]");
  const link = item.querySelector<HTMLElement>("[data-project-card-link]");
  if (!card || !link) return undefined;

  const restGeometry =
    knownRestGeometry ?? measureProjectRestGeometry(item, link, trackRect);
  if (!restGeometry) return undefined;
  const {
    height,
    layoutLeft,
    layoutTop,
    normalizedIdle,
    origin,
    start,
    width,
  } = restGeometry;
  const interaction = withProjectMeasurementState(
    item,
    link,
    "interaction",
    () => {
      const end = matrixState(getComputedStyle(item).transform);
      const cardStyle = getComputedStyle(card);
      const focusStyle = getComputedStyle(link);

      return Object.freeze({
        borderBottom: Number.parseFloat(cardStyle.borderBottomWidth),
        borderLeft: Number.parseFloat(cardStyle.borderLeftWidth),
        borderRight: Number.parseFloat(cardStyle.borderRightWidth),
        borderTop: Number.parseFloat(cardStyle.borderTopWidth),
        end,
        outlineExtent:
          Number.parseFloat(focusStyle.outlineWidth) +
          Number.parseFloat(focusStyle.outlineOffset),
      });
    },
  );
  const {
    borderBottom,
    borderLeft,
    borderRight,
    borderTop,
    end,
    outlineExtent,
  } = interaction;

  if (
    ![
      width,
      height,
      outlineExtent,
      borderLeft,
      borderRight,
      borderTop,
      borderBottom,
      ...Object.values(start),
      ...Object.values(end),
    ].every(Number.isFinite)
  ) {
    return undefined;
  }

  const focusRect = {
    bottom: height - borderBottom + outlineExtent,
    left: borderLeft - outlineExtent,
    right: width - borderRight + outlineExtent,
    top: borderTop - outlineExtent,
  };
  const sampleCount = 257;
  const samples = Array.from({ length: sampleCount }, (_, index) => {
    const progress = index / (sampleCount - 1);
    return transformedPolygon(focusRect, origin, {
      angle: start.angle + (end.angle - start.angle) * progress,
      scale: start.scale + (end.scale - start.scale) * progress,
      translateX:
        start.translateX +
        (end.translateX - start.translateX) * progress,
      translateY:
        start.translateY +
        (end.translateY - start.translateY) * progress,
    });
  });
  const sampleBounds = samples.map((polygon) => ({
    bottom: Math.max(...polygon.map(({ y }) => y)),
    left: Math.min(...polygon.map(({ x }) => x)),
    right: Math.max(...polygon.map(({ x }) => x)),
    top: Math.min(...polygon.map(({ y }) => y)),
  }));
  const maximumRadius = Math.max(
    ...[
      { x: focusRect.left, y: focusRect.top },
      { x: focusRect.right, y: focusRect.top },
      { x: focusRect.right, y: focusRect.bottom },
      { x: focusRect.left, y: focusRect.bottom },
    ].map(({ x, y }) => Math.hypot(x - origin.x, y - origin.y)),
  );
  const derivativeBound =
    Math.hypot(
      end.translateX - start.translateX,
      end.translateY - start.translateY,
    ) +
    Math.abs(end.scale - start.scale) * maximumRadius +
    Math.max(start.scale, end.scale) *
      Math.abs(end.angle - start.angle) *
      maximumRadius;
  const sampledIntervalPadding = derivativeBound / (2 * (sampleCount - 1));
  const coordinateMagnitude = Math.max(
    1,
    Math.abs(layoutLeft),
    Math.abs(layoutTop),
    Math.abs(layoutLeft + width),
    Math.abs(layoutTop + height),
  );
  const numericPadding = coordinateMagnitude * 2 ** -21;
  const padding = sampledIntervalPadding + numericPadding;
  const left = Math.min(normalizedIdle.x, layoutLeft + Math.min(...sampleBounds.map((bound) => bound.left))) - padding;
  const right = Math.max(normalizedIdle.x + normalizedIdle.width, layoutLeft + Math.max(...sampleBounds.map((bound) => bound.right))) + padding;
  const top = Math.min(normalizedIdle.y, layoutTop + Math.min(...sampleBounds.map((bound) => bound.top))) - padding;
  const bottom = Math.max(normalizedIdle.y + normalizedIdle.height, layoutTop + Math.max(...sampleBounds.map((bound) => bound.bottom))) + padding;
  const idlePolygon = Object.freeze([
    Object.freeze({ x: normalizedIdle.x, y: normalizedIdle.y }),
    Object.freeze({ x: normalizedIdle.x + normalizedIdle.width, y: normalizedIdle.y }),
    Object.freeze({ x: normalizedIdle.x + normalizedIdle.width, y: normalizedIdle.y + normalizedIdle.height }),
    Object.freeze({ x: normalizedIdle.x, y: normalizedIdle.y + normalizedIdle.height }),
  ]);
  const polygons = Object.freeze([
    idlePolygon,
    ...samples.map((polygon) =>
      Object.freeze(
        polygon.map(({ x, y }) =>
          Object.freeze({ x: layoutLeft + x, y: layoutTop + y }),
        ),
      ),
    ),
  ]);

  return Object.freeze({
    envelope: Object.freeze({
      height: roundMeasurement(bottom - top),
      width: roundMeasurement(right - left),
      x: roundMeasurement(left),
      y: roundMeasurement(top),
    }),
    sweep: Object.freeze({
      interpolationPadding: padding,
      polygons,
    }),
  });
}

export function measureProjectInteractionEnvelope(
  item: HTMLElement,
  trackRect: DOMRect,
): StoryScoreMeasuredRect | undefined {
  return measureProjectInteractionGeometry(item, trackRect)?.envelope;
}

export function measureStoryScoreScenes(track: HTMLElement): {
  readonly measurements: StoryScoreSceneMeasurements;
  readonly signature: string;
} {
  const trackRect = track.getBoundingClientRect();
  const professionalProjectElements = Array.from(
    track.querySelectorAll<HTMLElement>(
      '[data-professional-scene="projects"] [data-project-card-item]',
    ),
  );
  const projectRestGeometries = professionalProjectElements.map((element) => {
    const link = element.querySelector<HTMLElement>("[data-project-card-link]");
    return link
      ? measureProjectRestGeometry(element, link, trackRect)
      : undefined;
  });
  const professionalProjectCards = Object.freeze(
    projectRestGeometries.flatMap((geometry) =>
      geometry ? [geometry.normalizedIdle] : [],
    ),
  );
  const chapterContentExclusions = Object.freeze(
    Object.fromEntries(
      DESKTOP_TIMELINE_ORDER.map((chapterId) => {
        const chapter = track.querySelector<HTMLElement>(
          `[data-chapter-id="${chapterId}"]`,
        );
        if (!chapter) return [chapterId, Object.freeze([])] as const;

        const rectangles = Array.from(
          chapter.querySelectorAll<HTMLElement>(
            "[data-score-content-exclusion]",
          ),
        ).flatMap((exclusion) => {
          const reason = exclusion.dataset.scoreContentExclusion ?? "";

          return measureElements(
            exclusionMeasurementOwners(exclusion),
            trackRect,
          ).map((rect) => Object.freeze({ ...rect, reason }));
        });

        return [chapterId, Object.freeze(rectangles)] as const;
      }),
    ),
  );
  const projectInteractions = professionalProjectElements.map((element, index) =>
    measureProjectInteractionGeometry(
      element,
      trackRect,
      projectRestGeometries[index],
    ),
  );
  const measurements = Object.freeze({
    chapterContentExclusions,
    professionalProjectCards,
    professionalProjectInteractionEnvelopes: Object.freeze(
      Object.fromEntries(
        projectInteractions.flatMap((interaction, index) => {
          return interaction ? [[index + 1, interaction.envelope]] : [];
        }),
      ),
    ),
    professionalProjectInteractionSweeps: Object.freeze(
      Object.fromEntries(
        projectInteractions.flatMap((interaction, index) => {
          return interaction ? [[index + 1, interaction.sweep]] : [];
        }),
      ),
    ),
    professionalServicesCards: measureElements(
      Array.from(
        track.querySelectorAll<HTMLElement>(
          '[data-professional-scene="services"] [data-service-module]',
        ),
      ),
      trackRect,
    ),
  });

  return Object.freeze({
    measurements,
    signature: JSON.stringify(measurements),
  });
}
