import type { ConsoleMessage, Page } from "@playwright/test";
import type { StoryScoreProjectionOptions, StoryScoreProjectionMode } from "../../../src/lib/story/score/projection";

export interface Point { x: number; y: number }
export interface Crossing { left: number; right: number; a: Point; b: Point; c: Point; d: Point }

/** Record development-only report messages without treating them as app errors. */
export function isDevelopmentCspReport(text: string): boolean {
  return (
    /content.?security.?policy/iu.test(text) &&
    (/report.only/iu.test(text) || /too many csp reports/iu.test(text))
  );
}

/** Independent complete-segment oracle; no thinning or near-neighbor omission. */
export function strictIntersections(points: readonly Point[]): Crossing[] {
  const found: Crossing[] = [];
  const orientation = (a: Point, b: Point, c: Point) =>
    (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  for (let left = 0; left < points.length - 1; left += 1) {
    const a = points[left]!;
    const b = points[left + 1]!;
    for (let right = left + 2; right < points.length - 1; right += 1) {
      const c = points[right]!;
      const d = points[right + 1]!;
      if (Math.max(a.x, b.x) < Math.min(c.x, d.x) || Math.max(c.x, d.x) < Math.min(a.x, b.x) ||
          Math.max(a.y, b.y) < Math.min(c.y, d.y) || Math.max(c.y, d.y) < Math.min(a.y, b.y)) continue;
      if (orientation(a, b, c) * orientation(a, b, d) < -1e-7 &&
          orientation(c, d, a) * orientation(c, d, b) < -1e-7) found.push({ left, right, a, b, c, d });
    }
  }
  return found;
}

export function observeRuntime(page: Page) {
  const consoleMessages: { type: string; text: string; location: ReturnType<ConsoleMessage["location"]> }[] = [];
  const pageErrors: string[] = [];
  // Attach before goto: first-client hydration warnings otherwise escape review.
  page.on("console", (message) => {
    if (["warning", "error"].includes(message.type())) {
      consoleMessages.push({ type: message.type(), text: message.text(), location: message.location() });
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  return {
    snapshot: () => ({
      consoleMessages: [...consoleMessages],
      consoleWarningCount: consoleMessages.filter(({ type }) => type === "warning").length,
      consoleErrorCount: consoleMessages.filter(({ type }) => type === "error").length,
      relevantConsoleErrorCount: consoleMessages.filter(({ type, text }) => type === "error" && !isDevelopmentCspReport(text)).length,
      developmentCspReports: consoleMessages.filter(({ text }) => isDevelopmentCspReport(text)),
      hydrationWarningCount: consoleMessages.filter(({ text }) => /hydration|hydrated|did not match/i.test(text)).length,
      pageErrorCount: pageErrors.length,
      pageErrors: [...pageErrors],
    }),
  };
}

export async function inspectHomeEntry(page: Page, branchName: string) {
  return page.evaluate((requestedBranch) => {
    const owner = document.querySelector(`[data-score-branch="${requestedBranch}"]`);
    const entry = JSON.parse(owner?.getAttribute("data-score-home-entry") ?? "null") as {
      t: number; point: Point; tangent: Point; staffPoints: Point[]; eventFreeLeadIn: { startT: number; endT: number };
    } | null;
    const svg = owner?.querySelector("svg");
    const matrix = svg?.getScreenCTM();
    if (!entry || !matrix || !Number.isFinite(entry.t) || entry.staffPoints.length !== 5) throw new Error(`Missing actual Home entry: ${requestedBranch}`);
    const screen = (point: Point) => {
      const value = new DOMPoint(point.x, point.y).matrixTransform(matrix);
      return { x: value.x, y: value.y };
    };
    const screenStaffPoints = entry.staffPoints.map(screen);
    return {
      branch: requestedBranch, entry, screenPoint: screen(entry.point), screenStaffPoints,
      allStaffPointsInViewport: screenStaffPoints.every(({ x, y }) => x >= 0 && x <= innerWidth && y >= 0 && y <= innerHeight),
    };
  }, branchName);
}

function segmentDistance(point: Point, a: Point, b: Point) {
  const lengthSquared = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
  const t = lengthSquared ? Math.max(0, Math.min(1, ((point.x - a.x) * (b.x - a.x) + (point.y - a.y) * (b.y - a.y)) / lengthSquared)) : 0;
  const closest = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  return { distance: Math.hypot(point.x - closest.x, point.y - closest.y), closest, t };
}

export async function inspectProjects(page: Page, geometry: Awaited<ReturnType<typeof inspectRenderedGeometry>>) {
  const measured = await page.evaluate(() => {
    const layer = document.querySelector("[data-story-score-layer]");
    const chapter = document.querySelector('[data-chapter-id="professional-projects"]');
    const track = document.querySelector("[data-motion-track]");
    if (!layer || !chapter || !track) throw new Error("Missing Projects measurement owners.");
    const trackRect = track.getBoundingClientRect();
    const cards = Array.from(chapter.querySelectorAll<HTMLElement>("[data-project-card-item]"))
      .sort((left, right) => Number(left.dataset.projectPosition) - Number(right.dataset.projectPosition))
      .map((card) => {
        const rect = card.getBoundingClientRect();
        return { projectIndex: Number(card.dataset.projectPosition), rect: { x: rect.left - trackRect.left, y: rect.top - trackRect.top, width: rect.width, height: rect.height } };
      });
    const visits = JSON.parse(layer.getAttribute("data-score-project-visit-anchors") ?? "[]") as Array<{
      anchor: Point; cardRect: { x: number; y: number; width: number; height: number }; measurementSource: string; projectIndex: number;
    }>;
    return { cards, visits, trackOffset: { x: trackRect.left, y: trackRect.top }, viewport: { width: innerWidth, height: innerHeight } };
  });
  const professional = geometry.branches.find(({ branch }) => branch === "professional");
  if (!professional || measured.cards.length !== 3) throw new Error("Expected three Projects cards and complete Professional staff geometry.");
  if (geometry.replayInput.mode !== "horizontal-enhanced") {
    if (measured.visits.length !== 0) throw new Error("Vertical layout unexpectedly publishes horizontal visit anchors.");
    return { ...measured, visits: [], method: "three semantic cards in the static vertical layout; horizontal visit anchors are not projected" };
  }
  if (measured.visits.length !== 3) throw new Error("Expected three distinct horizontal Projects visit anchors.");
  const edges = professional.runs.flatMap((run) => run.trackPoints.slice(1).map((b, index) => ({
    a: run.trackPoints[index]!, b, id: run.id, originalId: run.originalId, radius: run.strokeWidth / 2,
  })));
  const visits = measured.visits.map((visit, index) => {
    const card = measured.cards[index]!;
    const rect = card.rect;
    const right = rect.x + rect.width;
    const bottom = rect.y + rect.height;
    const corners = [{ x: rect.x, y: rect.y }, { x: right, y: rect.y }, { x: right, y: bottom }, { x: rect.x, y: bottom }];
    const pointDistance = (point: Point) => {
      const dx = Math.max(rect.x - point.x, 0, point.x - right);
      const dy = Math.max(rect.y - point.y, 0, point.y - bottom);
      return dx || dy ? Math.hypot(dx, dy) : -Math.min(point.x - rect.x, right - point.x, point.y - rect.y, bottom - point.y);
    };
    const nearest = edges.filter(({ originalId }) => /:staff:4(?::|$)/u.test(originalId)).map((edge) => ({ ...edge, ...segmentDistance(visit.anchor, edge.a, edge.b) }))
      .sort((left, rightEdge) => left.distance - rightEdge.distance)[0];
    if (!nearest) throw new Error("Missing rendered center staff line for Projects.");
    const minimumClearance = Math.min(...edges.map(({ a, b, radius }) => {
      let enter = 0;
      let exit = 1;
      for (const [start, end, low, high] of [[a.x, b.x, rect.x, right], [a.y, b.y, rect.y, bottom]]) {
        const delta = end! - start!;
        if (delta === 0) { if (start! < low! || start! > high!) enter = 2; }
        else { const near = (low! - start!) / delta; const far = (high! - start!) / delta; enter = Math.max(enter, Math.min(near, far)); exit = Math.min(exit, Math.max(near, far)); }
      }
      const endpointDistance = Math.min(pointDistance(a), pointDistance(b));
      const distance = enter <= exit ? Math.min(0, endpointDistance) : Math.min(endpointDistance, ...corners.map((corner) => segmentDistance(corner, a, b).distance));
      return distance - radius;
    }));
    const tangentAngleDeg = Math.abs(Math.atan2(nearest.b.y - nearest.a.y, nearest.b.x - nearest.a.x) * 180 / Math.PI);
    const screenAnchor = { x: visit.anchor.x + measured.trackOffset.x, y: visit.anchor.y + measured.trackOffset.y };
    return {
      ...visit, renderedCardRect: rect, screenAnchor,
      anchorInViewport: screenAnchor.x >= 0 && screenAnchor.x <= measured.viewport.width && screenAnchor.y >= 0 && screenAnchor.y <= measured.viewport.height,
      distanceFromRenderedCenter: nearest.distance,
      nearestRenderedPoint: nearest.closest,
      localTangentAngleDeg: tangentAngleDeg,
      notationSafe: nearest.b.x > nearest.a.x && tangentAngleDeg <= 18,
      minimumClearance,
      classification: minimumClearance < 0 ? "COLLISION" : minimumClearance < 12 ? "TOO_CLOSE" : "CLEAR",
    };
  });
  return { ...measured, visits, method: "all rendered staff edges, exact segment-to-card clearance and nearest center segment" };
}

export function requireCleanRuntime(snapshot: ReturnType<ReturnType<typeof observeRuntime>["snapshot"]>) {
  if (snapshot.hydrationWarningCount || snapshot.pageErrorCount || snapshot.relevantConsoleErrorCount) {
    throw new Error(`Stage-1 runtime/hydration failed: ${JSON.stringify(snapshot)}`);
  }
}

/** Captures actual SVG vertices and the same DOM measurement owners as StoryScoreLayer. */
export async function inspectRenderedGeometry(page: Page) {
  const measured = await page.evaluate(() => {
    const root = document.querySelector<HTMLElement>("main[data-motion-lab]");
    const layer = document.querySelector<HTMLElement>("[data-story-score-layer]");
    const track = document.querySelector<HTMLElement>("[data-motion-track]");
    if (!root || !layer || !track) throw new Error("Missing Stage-1 measurement owners.");
    const trackRect = track.getBoundingClientRect();
    const rect = (element: Element) => {
      const value = element.getBoundingClientRect();
      return { x: value.left - trackRect.left, y: value.top - trackRect.top, width: value.width, height: value.height };
    };
    const normalize = (value: ReturnType<typeof rect>) => Object.fromEntries(
      Object.entries(value).map(([key, number]) => [key, Number(number.toFixed(2))]),
    ) as ReturnType<typeof rect>;
    const measure = (selector: string) => Array.from(track.querySelectorAll<HTMLElement>(selector))
      .map(rect).filter(({ width, height }) => width > 0 && height > 0);
    const atomicReasons = new Set(["heading-and-body", "home-reading-envelope", "process-stages", "terminal-content"]);
    const chapterContentExclusions = Object.fromEntries(Array.from(track.querySelectorAll<HTMLElement>("[data-chapter-id]")).map((chapter) => [
      chapter.dataset.chapterId!,
      Array.from(chapter.querySelectorAll<HTMLElement>("[data-score-content-exclusion]")).flatMap((exclusion) => {
        const reason = exclusion.dataset.scoreContentExclusion ?? "";
        const owners = atomicReasons.has(reason)
          ? Array.from(exclusion.children).filter((element): element is HTMLElement => element instanceof HTMLElement)
          : [exclusion];
        return owners.map(rect).filter(({ width, height }) => width > 0 && height > 0).map((value) => ({ ...value, reason }));
      }),
    ]));
    const rawMeasurements = {
      chapterContentExclusions,
      professionalProjectCards: measure('[data-professional-scene="projects"] [data-project-card-item]'),
      professionalServicesCards: measure('[data-professional-scene="services"] [data-service-module]'),
    };
    const sceneMeasurements = {
      chapterContentExclusions: Object.fromEntries(Object.entries(chapterContentExclusions).map(([id, values]) => [id, values.map(({ reason, ...value }) => ({ ...normalize(value), reason }))])),
      professionalProjectCards: rawMeasurements.professionalProjectCards.map(normalize),
      professionalServicesCards: rawMeasurements.professionalServicesCards.map(normalize),
    };
    const mode = layer.dataset.scoreProjection as StoryScoreProjectionMode;
    const options: StoryScoreProjectionOptions = {
      viewportWidth: Math.max(320, Math.round(root.getBoundingClientRect().width || innerWidth)),
      viewportHeight: Math.max(320, Math.round(innerHeight)),
      ...(mode === "horizontal-enhanced" ? { sceneMeasurements } : {}),
    };
    const branches = Array.from(layer.querySelectorAll<HTMLElement>("[data-score-branch]")).map((branch) => {
      const svg = branch.querySelector("svg");
      if (!svg) throw new Error("Missing score SVG.");
      const runs = Array.from(branch.querySelectorAll<SVGPolylineElement>('[data-score-role="staff-line"]')).map((line) => {
        if (line.tagName.toLowerCase() !== "polyline") throw new Error("Unrecognized visible staff primitive: audit must be extended, never sampled silently.");
        const id = line.getAttribute("data-score-primitive-id")!;
        const originalId = id.replace(/:(?:canonical:\d+|card-score-interaction:[^:]+:\d+)$/u, "");
        const serializedPoints = line.getAttribute("points") ?? "";
        // Read the serialized DOM numbers rather than SVGPointList's float32 conversion.
        const coordinates = serializedPoints.trim().split(/[\s,]+/u).map(Number);
        if (coordinates.length < 4 || coordinates.length % 2 || coordinates.some((value) => !Number.isFinite(value))) throw new Error(`Invalid staff vertices: ${id}`);
        const points = Array.from({ length: coordinates.length / 2 }, (_, index) => ({ x: coordinates[index * 2]!, y: coordinates[index * 2 + 1]! }));
        const matrix = line.getScreenCTM();
        if (!matrix) throw new Error(`Missing staff transform: ${id}`);
        const style = getComputedStyle(line);
        if (style.display === "none" || style.visibility !== "visible" || Number(style.opacity) <= 0) throw new Error(`Hidden staff run requires explicit visibility ownership: ${id}`);
        return {
          id, originalId, serializedPoints, points,
          opacity: Number(style.opacity), strokeWidth: Number(line.getAttribute("stroke-width")),
          screenMatrix: { a: matrix.a, b: matrix.b, c: matrix.c, d: matrix.d, e: matrix.e, f: matrix.f },
          trackPoints: points.map((point) => {
            const screen = new DOMPoint(point.x, point.y).matrixTransform(matrix);
            return { x: screen.x - trackRect.left, y: screen.y - trackRect.top };
          }),
        };
      });
      return { branch: branch.dataset.scoreBranch!, viewBox: svg.getAttribute("viewBox"), runs };
    });
    return {
      coordinateSpace: "SVG serialized coordinates; full original polylines; no viewport clipping",
      replayInput: { mode, options },
      measurementOwner: "src/components/story-score/StoryScoreLayer.tsx:measureScoreScenes",
      measurementNormalizationOwner: "src/components/story-score/measurement.ts:normalizeStoryScoreMeasuredRect (2 decimals)",
      rawMeasurements,
      trackBounds: { left: trackRect.left, top: trackRect.top, width: trackRect.width, height: trackRect.height },
      branches,
    };
  });
  const branches = measured.branches.map((branch) => {
    const grouped = new Map<string, { id: string; points: Point[]; runs: { id: string; firstEdge: number; edgeCount: number }[] }>();
    for (const run of branch.runs) {
      const line = grouped.get(run.originalId) ?? { id: run.originalId, points: [], runs: [] };
      const prior = line.points.at(-1);
      const first = run.points[0]!;
      if (prior && (prior.x !== first.x || prior.y !== first.y)) throw new Error(`Split staff run is discontinuous or out of order: ${run.id}`);
      line.runs.push({ id: run.id, firstEdge: Math.max(0, line.points.length - 1), edgeCount: run.points.length - 1 });
      line.points.push(...(prior ? run.points.slice(1) : run.points));
      grouped.set(run.originalId, line);
    }
    if (grouped.size !== 5) throw new Error(`Expected all five complete staff lines for ${branch.branch}; found ${grouped.size}.`);
    const lines = Array.from(grouped.values()).map((line) => ({ ...line, crossings: strictIntersections(line.points) }));
    return { ...branch, lines, staffIntersectionCount: lines.reduce((count, line) => count + line.crossings.length, 0) };
  });
  return {
    ...measured, branches,
    staffIntersectionCount: branches.reduce((count, branch) => count + branch.staffIntersectionCount, 0),
    validator: { source: "independent complete DOM segment validation", minimumRightIndex: "left + 2", orientationProductThreshold: -1e-7, splitRunPolicy: "merge by original ID, preserve every edge and compare across runs", usesProjectionIntersectionAttributes: false },
    centerPathValidation: { status: "requires Projection replay with replayInput", requiredSampleCount: 2049, projectionAttributesAreGlobalValidator: false },
  };
}
