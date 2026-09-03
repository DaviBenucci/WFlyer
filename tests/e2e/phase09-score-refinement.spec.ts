import { expect, test, type Page } from "@playwright/test";

const MOTION_ROUTE = "/__visual-lab/story/motion";

const SCENE_ORDER = [
  "home",
  "application-overview",
  "application-how-it-works",
  "application-benefits",
  "application-demo",
  "application-access",
  "application-terminal",
  "professional-about",
  "professional-services",
  "professional-process",
  "professional-projects",
  "professional-contact",
  "professional-terminal",
] as const;

async function openMeasuredStory(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.localStorage.setItem("wf-theme", "dark");
  });
  await page.setViewportSize({ height: 900, width: 1_536 });
  await page.emulateMedia({
    colorScheme: "dark",
    reducedMotion: "no-preference",
  });
  const response = await page.goto(MOTION_ROUTE, {
    waitUntil: "domcontentloaded",
  });

  expect(response?.ok()).toBe(true);
  await expect(page.locator("[data-story-bootstrap]")).toHaveAttribute(
    "data-bootstrap-state",
    "REVEALED",
    { timeout: 10_000 },
  );
  await expect(page.locator("[data-bootstrap-cover]")).toHaveCount(0);
  await expect(page.locator("main[data-motion-lab]")).toHaveAttribute(
    "data-motion-lifecycle",
    "mounted",
  );
  await expect(page.locator("main[data-motion-lab]")).toHaveAttribute(
    "data-projection-mode",
    "horizontal-enhanced",
  );
  const scoreLayer = page.locator("[data-story-score-layer]");
  await expect(scoreLayer).toHaveAttribute(
    "data-score-projection",
    "horizontal-enhanced",
  );
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
  await expect(scoreLayer).toHaveAttribute(
    "data-score-services-measurement-source",
    "dom-measured",
  );
  await expect(scoreLayer).toHaveAttribute(
    "data-score-how-measurement-source",
    "dom-measured",
  );
  await expect(scoreLayer).toHaveAttribute(
    "data-score-path-self-intersections",
    "0",
  );
  await expect(scoreLayer).toHaveAttribute(
    "data-score-staff-line-self-intersections",
    "0",
  );
  await expect
    .poll(async () => {
      const before = await scoreLayer.evaluate((element) =>
        JSON.stringify({
          howLeadIn: element.getAttribute("data-score-how-lead-in"),
          howLeadOut: element.getAttribute("data-score-how-lead-out"),
          servicesLeadIn: element.getAttribute("data-score-services-lead-in"),
          servicesLeadOut: element.getAttribute("data-score-services-lead-out"),
        }),
      );
      await page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      );
      const after = await scoreLayer.evaluate((element) =>
        JSON.stringify({
          howLeadIn: element.getAttribute("data-score-how-lead-in"),
          howLeadOut: element.getAttribute("data-score-how-lead-out"),
          servicesLeadIn: element.getAttribute("data-score-services-lead-in"),
          servicesLeadOut: element.getAttribute("data-score-services-lead-out"),
        }),
      );

      return before === after;
    })
    .toBe(true);
}

async function positionImmediately(page: Page, chapterId: string): Promise<void> {
  await page.evaluate(async (requestedChapterId) => {
    const controller = window.__WFLYER_PHASE5_MOTION__;
    if (controller === undefined) throw new Error("Missing motion controller");
    await controller.position(
      requestedChapterId as Parameters<typeof controller.position>[0],
    );
  }, chapterId);
  await expect(page.locator("main[data-motion-lab]")).toHaveAttribute(
    "data-motion-active-chapter",
    chapterId,
  );
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
}

test.describe("Phase-9 human choreography refinement", () => {
  test.skip(
    process.env.WFLYER_PLAYWRIGHT_TEST_SERVER === "production",
    "Development-only rendered measurement surface",
  );

  test("proves the live 13-scene rendered-clearance audit", async ({
    page,
  }, testInfo) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });
    await openMeasuredStory(page);

    const audit = await page.evaluate((sceneOrder) => {
      type Branch = "application" | "professional";
      type NumericRect = {
        readonly bottom: number;
        readonly height: number;
        readonly left: number;
        readonly right: number;
        readonly top: number;
        readonly width: number;
      };
      type ScorePoint = {
        readonly branch: Branch;
        readonly id: string;
        readonly role: string;
        readonly strokeRadius: number;
        readonly x: number;
        readonly y: number;
      };
      type ScoreRectangle = {
        readonly branch: Branch;
        readonly id: string;
        readonly rect: NumericRect;
        readonly role: string;
      };

      const track = document.querySelector<HTMLElement>("[data-motion-track]");
      if (!track) throw new Error("Missing motion track");
      const trackRect = track.getBoundingClientRect();
      const round = (value: number) => Number(value.toFixed(2));
      const normalizeRect = (rect: DOMRect): NumericRect => {
        const left = rect.left - trackRect.left;
        const top = rect.top - trackRect.top;
        return {
          bottom: round(top + rect.height),
          height: round(rect.height),
          left: round(left),
          right: round(left + rect.width),
          top: round(top),
          width: round(rect.width),
        };
      };
      const branchForScene = (sceneId: string): readonly Branch[] =>
        sceneId === "home"
          ? ["application", "professional"]
          : sceneId.startsWith("application-")
            ? ["application"]
            : ["professional"];
      const atomicReasons = new Set([
        "application-benefits",
        "application-overview",
        "heading-and-body",
        "home-reading-envelope",
        "process-stages",
        "terminal-content",
      ]);
      const scorePoints: ScorePoint[] = [];
      const scoreRectangles: ScoreRectangle[] = [];

      document
        .querySelectorAll<SVGGeometryElement>(
          '[data-score-role="staff-line"]',
        )
        .forEach((primitive) => {
          const branchOwner = primitive.closest<HTMLElement>(
            "[data-score-branch]",
          );
          const branch = branchOwner?.dataset.scoreBranch as Branch | undefined;
          const matrix = primitive.getScreenCTM();
          if (!branch || !matrix) return;
          const length = primitive.getTotalLength();
          const strokeRadius =
            Number(primitive.getAttribute("stroke-width") ?? 0) / 2;
          const sampleCount = Math.max(1, Math.ceil(length / 3));

          for (let index = 0; index <= sampleCount; index += 1) {
            const point = primitive.getPointAtLength(
              (length * index) / sampleCount,
            );
            const viewportPoint = new DOMPoint(point.x, point.y).matrixTransform(
              matrix,
            );
            scorePoints.push({
              branch,
              id: primitive.dataset.scorePrimitiveId ?? "staff-line",
              role: "staff-line",
              strokeRadius,
              x: viewportPoint.x - trackRect.left,
              y: viewportPoint.y - trackRect.top,
            });
          }
        });

      document
        .querySelectorAll<SVGGraphicsElement>(
          "[data-score-role]:not([data-score-role='staff-line'])",
        )
        .forEach((primitive) => {
          const branchOwner = primitive.closest<HTMLElement>(
            "[data-score-branch]",
          );
          const branch = branchOwner?.dataset.scoreBranch as Branch | undefined;
          const rect = primitive.getBoundingClientRect();
          if (!branch || (!rect.width && !rect.height)) return;
          scoreRectangles.push({
            branch,
            id: primitive.dataset.scorePrimitiveId ?? "score-primitive",
            rect: normalizeRect(rect),
            role: primitive.dataset.scoreRole ?? "unknown",
          });
        });

      const signedPointDistance = (
        point: ScorePoint,
        rect: NumericRect,
      ): number => {
        const dx = Math.max(rect.left - point.x, 0, point.x - rect.right);
        const dy = Math.max(rect.top - point.y, 0, point.y - rect.bottom);
        if (dx || dy) return Math.hypot(dx, dy) - point.strokeRadius;
        return (
          -Math.min(
            point.x - rect.left,
            rect.right - point.x,
            point.y - rect.top,
            rect.bottom - point.y,
          ) - point.strokeRadius
        );
      };
      const signedRectangleDistance = (
        scoreRect: NumericRect,
        contentRect: NumericRect,
      ): number => {
        const dx = Math.max(
          contentRect.left - scoreRect.right,
          0,
          scoreRect.left - contentRect.right,
        );
        const dy = Math.max(
          contentRect.top - scoreRect.bottom,
          0,
          scoreRect.top - contentRect.bottom,
        );
        if (dx || dy) return Math.hypot(dx, dy);
        return -Math.min(
          scoreRect.right - contentRect.left,
          contentRect.right - scoreRect.left,
          scoreRect.bottom - contentRect.top,
          contentRect.bottom - scoreRect.top,
        );
      };

      return sceneOrder.map((sceneId) => {
        const chapter = document.querySelector<HTMLElement>(
          `[data-chapter-id="${sceneId}"]`,
        );
        if (!chapter) throw new Error(`Missing chapter ${sceneId}`);
        const owners: Array<{ element: HTMLElement; reason: string }> = [];

        chapter
          .querySelectorAll<HTMLElement>("[data-score-content-exclusion]")
          .forEach((exclusion) => {
            const reason = exclusion.dataset.scoreContentExclusion ?? "unknown";
            const elements = atomicReasons.has(reason)
              ? Array.from(exclusion.children).filter(
                  (element): element is HTMLElement =>
                    element instanceof HTMLElement,
                )
              : [exclusion];
            elements.forEach((element) => owners.push({ element, reason }));
          });

        if (sceneId === "professional-contact") {
          const channels = chapter.querySelector<HTMLElement>("address");
          if (channels) owners.push({ element: channels, reason: "contact-channels" });
        }

        const branches = branchForScene(sceneId);
        const relevantPoints = scorePoints.filter(({ branch }) =>
          branches.includes(branch),
        );
        const relevantRectangles = scoreRectangles.filter(({ branch }) =>
          branches.includes(branch),
        );
        const regions = owners.map(({ element, reason }, index) => {
          const rect = normalizeRect(element.getBoundingClientRect());
          let minimumClearance = Number.POSITIVE_INFINITY;
          let nearest: {
            id: string;
            rect?: NumericRect;
            role: string;
            x?: number;
            y?: number;
          } = { id: "none", role: "none" };

          relevantPoints.forEach((point) => {
            const clearance = signedPointDistance(point, rect);
            if (clearance < minimumClearance) {
              minimumClearance = clearance;
              nearest = {
                id: point.id,
                role: point.role,
                x: round(point.x),
                y: round(point.y),
              };
            }
          });
          relevantRectangles.forEach((primitive) => {
            const clearance = signedRectangleDistance(primitive.rect, rect);
            if (clearance < minimumClearance) {
              minimumClearance = clearance;
              nearest = {
                id: primitive.id,
                rect: primitive.rect,
                role: primitive.role,
              };
            }
          });

          return {
            classification:
              minimumClearance < 0
                ? "COLLISION"
                : minimumClearance < 12
                  ? "TOO_CLOSE"
                  : "CLEAR",
            minimumClearance: round(minimumClearance),
            nearest,
            reason,
            rect,
            regionIndex: index + 1,
            tagName: element.tagName.toLowerCase(),
          };
        });

        return {
          sceneId,
          sceneMinimumClearance: round(
            Math.min(...regions.map(({ minimumClearance }) => minimumClearance)),
          ),
          status: regions.some(({ classification }) => classification === "COLLISION")
            ? "COLLISION"
            : regions.some(({ classification }) => classification === "TOO_CLOSE")
              ? "TOO_CLOSE"
              : "CLEAR",
          regions,
        };
      });
    }, SCENE_ORDER);

    await testInfo.attach("rendered-clearance-audit.json", {
      body: JSON.stringify(audit, null, 2),
      contentType: "application/json",
    });

    for (const [index, sceneId] of SCENE_ORDER.entries()) {
      await positionImmediately(page, sceneId);
      const screenshotName = `${String(index + 1).padStart(2, "0")}-${sceneId}-dark-1536x900.png`;
      const screenshotPath = testInfo.outputPath(screenshotName);
      await page.screenshot({ path: screenshotPath });
      await testInfo.attach(screenshotName, {
        contentType: "image/png",
        path: screenshotPath,
      });
    }

    expect(audit.map(({ sceneId }) => sceneId)).toEqual(SCENE_ORDER);
    expect(audit.every(({ regions }) => regions.length > 0)).toBe(true);
    expect(
      audit.map(({ sceneId, sceneMinimumClearance, status }) => ({
        sceneId,
        sceneMinimumClearance,
        status,
      })),
    ).toEqual(
      SCENE_ORDER.map((sceneId) => ({
        sceneId,
        sceneMinimumClearance: expect.any(Number),
        status: "CLEAR",
      })),
    );
    expect(pageErrors).toEqual([]);
  });

  test("proves the shared Services and How It Works card interaction in rendered geometry", async ({
    page,
  }, testInfo) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await openMeasuredStory(page);

    const familyBScenes = [
      {
        attributePrefix: "services",
        branch: "professional",
        cardSelector: "[data-service-module]",
        direction: "left-to-right",
        expectedCardCount: 4,
        sceneId: "professional-services",
      },
      {
        attributePrefix: "how",
        branch: "application",
        cardSelector: "[data-application-how-step]",
        direction: "right-to-left",
        expectedCardCount: 5,
        sceneId: "application-how-it-works",
      },
    ] as const;
    const audit = await page.evaluate((sceneSpecifications) => {
      type NumericRect = {
        readonly bottom: number;
        readonly height: number;
        readonly left: number;
        readonly right: number;
        readonly top: number;
        readonly width: number;
      };
      type ScorePoint = {
        readonly id: string;
        readonly strokeRadius: number;
        readonly x: number;
        readonly y: number;
      };

      const track = document.querySelector<HTMLElement>("[data-motion-track]");
      const scoreLayer = document.querySelector<HTMLElement>(
        "[data-story-score-layer]",
      );
      if (!track || !scoreLayer) throw new Error("Missing measured score owners");
      const trackRect = track.getBoundingClientRect();
      const round = (value: number) => Number(value.toFixed(3));
      const normalizeRect = (rect: DOMRect): NumericRect => ({
        bottom: rect.bottom - trackRect.top,
        height: rect.height,
        left: rect.left - trackRect.left,
        right: rect.right - trackRect.left,
        top: rect.top - trackRect.top,
        width: rect.width,
      });
      const roundedRect = (rect: NumericRect): NumericRect => ({
        bottom: round(rect.bottom),
        height: round(rect.height),
        left: round(rect.left),
        right: round(rect.right),
        top: round(rect.top),
        width: round(rect.width),
      });
      const transformPoint = (
        point: DOMPointReadOnly,
        matrix: DOMMatrix,
      ): Readonly<{ x: number; y: number }> => {
        const transformed = new DOMPoint(point.x, point.y).matrixTransform(matrix);
        return Object.freeze({
          x: transformed.x - trackRect.left,
          y: transformed.y - trackRect.top,
        });
      };
      const runNumber = (element: SVGPolylineElement): number =>
        Number(element.dataset.scorePrimitiveId?.split(":").at(-1));
      const signedPointDistance = (
        point: ScorePoint,
        rect: NumericRect,
      ): number => {
        const dx = Math.max(rect.left - point.x, 0, point.x - rect.right);
        const dy = Math.max(rect.top - point.y, 0, point.y - rect.bottom);
        if (dx || dy) return Math.hypot(dx, dy) - point.strokeRadius;
        return (
          -Math.min(
            point.x - rect.left,
            rect.right - point.x,
            point.y - rect.top,
            rect.bottom - point.y,
          ) - point.strokeRadius
        );
      };
      const containsPoint = (rect: NumericRect, point: ScorePoint): boolean =>
        point.x >= rect.left &&
        point.x <= rect.right &&
        point.y >= rect.top &&
        point.y <= rect.bottom;
      const colorAlpha = (color: string): number => {
        const slashAlpha = color.match(/\/\s*([\d.]+)\s*\)$/u)?.[1];
        if (slashAlpha !== undefined) return Number(slashAlpha);
        const rgbaAlpha = color.match(
          /^rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)$/u,
        )?.[1];
        return rgbaAlpha === undefined ? 1 : Number(rgbaAlpha);
      };
      const classify = (clearance: number) =>
        clearance < 0
          ? ("COLLISION" as const)
          : clearance < 12
            ? ("TOO_CLOSE" as const)
            : ("CLEAR" as const);

      const scenes = sceneSpecifications.map((specification) => {
        const chapter = document.querySelector<HTMLElement>(
          `[data-chapter-id="${specification.sceneId}"]`,
        );
        const branch = document.querySelector<HTMLElement>(
          `[data-score-branch="${specification.branch}"]`,
        );
        const scene = chapter?.firstElementChild;
        const foreground = chapter?.querySelector<HTMLElement>(
          "[data-score-interaction-foreground]",
        );
        const introduction = chapter?.querySelector<HTMLElement>(
          '[data-score-content-exclusion="heading-and-body"]',
        );
        if (
          !chapter ||
          !branch ||
          !(scene instanceof HTMLElement) ||
          !foreground ||
          !introduction
        ) {
          throw new Error(`Missing Family-B scene owners: ${specification.sceneId}`);
        }

        const cardElements = Array.from(
          chapter.querySelectorAll<HTMLElement>(specification.cardSelector),
        ).sort(
          (left, right) =>
            left.getBoundingClientRect().left - right.getBoundingClientRect().left,
        );
        const cardRects = cardElements.map((card) =>
          normalizeRect(card.getBoundingClientRect()),
        );
        const phaseMetric = (
          phase: "expanded" | "post-transition" | "pre-transition",
        ) => {
          const elements = Array.from(
            branch.querySelectorAll<SVGPolylineElement>(
              `[data-score-role="staff-line"][data-score-primitive-id*=":staff:4:card-score-interaction:${phase}:"]`,
            ),
          ).sort((left, right) => runNumber(left) - runNumber(right));
          const points = elements.flatMap((element) => {
            const matrix = element.getScreenCTM();
            if (!matrix) throw new Error("Missing Family-B staff matrix");
            return Array.from(element.points, (point) =>
              transformPoint(point, matrix),
            );
          });
          const first = points[0];
          const last = points.at(-1);
          if (!first || !last) throw new Error(`Missing ${phase} center points`);

          return Object.freeze({
            first: Object.freeze({ x: round(first.x), y: round(first.y) }),
            last: Object.freeze({ x: round(last.x), y: round(last.y) }),
            runCount: elements.length,
          });
        };
        const preTransition = phaseMetric("pre-transition");
        const expanded = phaseMetric("expanded");
        const postTransition = phaseMetric("post-transition");
        const interactionLines = Array.from(
          branch.querySelectorAll<SVGPolylineElement>(
            '[data-score-role="staff-line"][data-score-primitive-id*="card-score-interaction"]',
          ),
        );
        const samples: ScorePoint[] = [];

        interactionLines.forEach((line) => {
          const matrix = line.getScreenCTM();
          if (!matrix) throw new Error("Missing rendered interaction matrix");
          const length = line.getTotalLength();
          const sampleCount = Math.max(1, Math.ceil(length / 2));
          const strokeRadius = Number(line.getAttribute("stroke-width") ?? 0) / 2;

          for (let index = 0; index <= sampleCount; index += 1) {
            const point = transformPoint(
              line.getPointAtLength((length * index) / sampleCount),
              matrix,
            );
            samples.push({
              id: line.dataset.scorePrimitiveId ?? "staff-line",
              strokeRadius,
              x: point.x,
              y: point.y,
            });
          }
        });

        const visibleSamples = samples.filter(
          (point) => !cardRects.some((rect) => containsPoint(rect, point)),
        );
        const introductionRegions = Array.from(introduction.children)
          .filter(
            (element): element is HTMLElement => element instanceof HTMLElement,
          )
          .map((element) => {
            const rect = normalizeRect(element.getBoundingClientRect());
            const nearest = visibleSamples.reduce(
              (candidate, point) =>
                signedPointDistance(point, rect) <
                signedPointDistance(candidate, rect)
                  ? point
                  : candidate,
              visibleSamples[0]!,
            );
            const minimumClearance = signedPointDistance(nearest, rect);

            return Object.freeze({
              classification: classify(minimumClearance),
              minimumClearance: round(minimumClearance),
              nearest: Object.freeze({
                id: nearest.id,
                x: round(nearest.x),
                y: round(nearest.y),
              }),
              rect: roundedRect(rect),
              tagName: element.tagName.toLowerCase(),
            });
          });
        const scoreZIndex = Number(getComputedStyle(scoreLayer).zIndex);
        const sceneZIndex = Number(getComputedStyle(scene).zIndex);
        const scorePointerEvents = getComputedStyle(scoreLayer).pointerEvents;
        const cardRegions = cardElements.map((card, index) => {
          const rect = cardRects[index]!;
          const surfaceAlpha = colorAlpha(getComputedStyle(card).backgroundColor);
          const intendedOcclusionSamples = samples.filter((point) =>
            containsPoint(rect, point),
          ).length;
          const foregroundContract =
            scoreZIndex < sceneZIndex &&
            scorePointerEvents === "none" &&
            foreground.dataset.scoreInteractionForeground === "true" &&
            surfaceAlpha >= 0.9;

          return Object.freeze({
            classification: foregroundContract ? ("CLEAR" as const) : ("COLLISION" as const),
            foregroundContract,
            intendedOcclusionSamples,
            rect: roundedRect(rect),
            surfaceAlpha: round(surfaceAlpha),
          });
        });
        const outerExpandedLine = (staffStep: 0 | 8) => {
          const line = branch.querySelector<SVGPolylineElement>(
            `[data-score-role="staff-line"][data-score-primitive-id*=":staff:${staffStep}:card-score-interaction:expanded:"]`,
          );
          const matrix = line?.getScreenCTM();
          if (!line || !matrix) throw new Error("Missing expanded outer staff line");
          return { line, matrix };
        };
        const outerTop = outerExpandedLine(0);
        const outerBottom = outerExpandedLine(8);
        const outerTopLength = outerTop.line.getTotalLength();
        const outerBottomLength = outerBottom.line.getTotalLength();
        let maximumFiveLineSpread = 0;

        for (let index = 0; index <= 256; index += 1) {
          const top = transformPoint(
            outerTop.line.getPointAtLength((outerTopLength * index) / 256),
            outerTop.matrix,
          );
          const bottom = transformPoint(
            outerBottom.line.getPointAtLength(
              (outerBottomLength * index) / 256,
            ),
            outerBottom.matrix,
          );
          maximumFiveLineSpread = Math.max(
            maximumFiveLineSpread,
            Math.hypot(top.x - bottom.x, top.y - bottom.y),
          );
        }

        const minimumOpacity = Math.min(
          ...interactionLines.map((line) =>
            Number(line.getAttribute("opacity") ?? 1),
          ),
        );
        const sceneMinimumClearance = Math.min(
          ...introductionRegions.map(({ minimumClearance }) => minimumClearance),
        );
        const status = introductionRegions.some(
          ({ classification }) => classification === "COLLISION",
        )
          ? ("COLLISION" as const)
          : introductionRegions.some(
                ({ classification }) => classification === "TOO_CLOSE",
              ) ||
              cardRegions.some(
                ({ classification }) => classification !== "CLEAR",
              )
            ? ("TOO_CLOSE" as const)
            : ("CLEAR" as const);
        const firstCard = cardRects[0]!;
        const lastCard = cardRects.at(-1)!;

        return Object.freeze({
          branch: specification.branch,
          cardRegions,
          direction: specification.direction,
          expandedSpan: Number(
            scoreLayer.getAttribute(
              `data-score-${specification.attributePrefix}-expanded-span`,
            ),
          ),
          finalCardGroupBoundary:
            specification.direction === "left-to-right"
              ? round(lastCard.right)
              : round(firstCard.left),
          firstCardGroupBoundary:
            specification.direction === "left-to-right"
              ? round(firstCard.left)
              : round(lastCard.right),
          fullExpansionEnd: expanded.last,
          fullExpansionStart: expanded.first,
          interactionEnd: postTransition.last,
          interactionStart: preTransition.first,
          introductionRegions,
          layering: Object.freeze({
            foregroundMarker: foreground.dataset.scoreInteractionForeground,
            sceneZIndex,
            scorePointerEvents,
            scoreZIndex,
          }),
          leadInLength: Number(
            scoreLayer.getAttribute(
              `data-score-${specification.attributePrefix}-lead-in`,
            ),
          ),
          leadOutLength: Number(
            scoreLayer.getAttribute(
              `data-score-${specification.attributePrefix}-lead-out`,
            ),
          ),
          maximumFiveLineSpread: round(maximumFiveLineSpread),
          measurementSource: scoreLayer.getAttribute(
            `data-score-${specification.attributePrefix}-measurement-source`,
          ),
          minimumOpacity: round(minimumOpacity),
          sceneId: specification.sceneId,
          sceneMinimumClearance: round(sceneMinimumClearance),
          status,
          unsafeEventCount: Number(
            scoreLayer.getAttribute(
              `data-score-${specification.attributePrefix}-unsafe-events`,
            ),
          ),
        });
      });

      const howOwner = document.querySelector<HTMLElement>(
        '[data-score-branch="application"]',
      );
      if (!howOwner) throw new Error("Missing Application score owner");
      const howPrimitives = Array.from(
        howOwner.querySelectorAll<SVGGraphicsElement>(
          '[data-score-role][data-score-primitive-id*="wf-application-how-it-works"]',
        ),
      );
      const howNoteheads = howPrimitives
        .filter(({ dataset }) => dataset.scoreRole === "notehead")
        .map((notehead) => ({
          id: notehead.dataset.scorePrimitiveId ?? "notehead",
          left: round(notehead.getBoundingClientRect().left - trackRect.left),
          transform: notehead.getAttribute("transform") ?? "",
        }));
      const rotations = howNoteheads.map(({ transform }) =>
        Math.abs(Number(transform.match(/rotate\((-?[\d.]+)/u)?.[1] ?? 0)),
      );

      return Object.freeze({
        connectorEventCount: Number(
          scoreLayer.getAttribute("data-score-connector-events"),
        ),
        howReadability: Object.freeze({
          beamCount: howPrimitives.filter(
            ({ dataset }) => dataset.scoreRole === "beam",
          ).length,
          maximumRenderedRotation: round(Math.max(...rotations)),
          noteheadCount: howNoteheads.length,
          noteheads: howNoteheads,
          stemCount: howPrimitives.filter(
            ({ dataset }) => dataset.scoreRole === "stem",
          ).length,
          strictlyLeftToRight: howNoteheads.every(
            ({ left }, index) =>
              index === 0 || left > howNoteheads[index - 1]!.left,
          ),
          xMirrored: howNoteheads.some(({ transform }) =>
            /scale\(\s*-/u.test(transform),
          ),
        }),
        maximumNotationTangent: Number(
          scoreLayer.getAttribute("data-score-maximum-notation-tangent"),
        ),
        scenes,
      });
    }, familyBScenes);

    await testInfo.attach("family-b-card-score-interaction-audit.json", {
      body: JSON.stringify(audit, null, 2),
      contentType: "application/json",
    });

    expect(audit.connectorEventCount).toBe(0);
    expect(audit.maximumNotationTangent).toBeLessThanOrEqual(18);
    expect(audit.howReadability).toMatchObject({
      beamCount: 0,
      noteheadCount: 4,
      stemCount: 4,
      strictlyLeftToRight: true,
      xMirrored: false,
    });
    expect(audit.howReadability.maximumRenderedRotation).toBeLessThanOrEqual(18);

    for (const [index, scene] of audit.scenes.entries()) {
      const specification = familyBScenes[index]!;
      const entryCard =
        scene.direction === "left-to-right"
          ? scene.cardRegions[0]!.rect
          : scene.cardRegions.at(-1)!.rect;
      const exitCard =
        scene.direction === "left-to-right"
          ? scene.cardRegions.at(-1)!.rect
          : scene.cardRegions[0]!.rect;

      expect(scene.measurementSource).toBe("dom-measured");
      expect(scene.cardRegions).toHaveLength(specification.expectedCardCount);
      expect(scene.status).toBe("CLEAR");
      expect(scene.sceneMinimumClearance).toBeGreaterThanOrEqual(12);
      expect(
        scene.introductionRegions.every(
          ({ classification }) => classification === "CLEAR",
        ),
      ).toBe(true);
      expect(
        scene.cardRegions.every(
          ({
            classification,
            foregroundContract,
            intendedOcclusionSamples,
            surfaceAlpha,
          }) =>
            classification === "CLEAR" &&
            foregroundContract &&
            intendedOcclusionSamples > 0 &&
            surfaceAlpha >= 0.9,
        ),
      ).toBe(true);
      expect(scene.layering).toEqual({
        foregroundMarker: "true",
        sceneZIndex: 2,
        scorePointerEvents: "none",
        scoreZIndex: 1,
      });
      expect(scene.leadInLength).toBeGreaterThanOrEqual(96);
      expect(scene.expandedSpan).toBeGreaterThan(0);
      expect(scene.leadOutLength).toBeGreaterThanOrEqual(96);
      expect(scene.maximumFiveLineSpread).toBeGreaterThan(112);
      expect(scene.maximumFiveLineSpread).toBeLessThan(120);
      expect(scene.minimumOpacity).toBe(0.34);
      expect(scene.unsafeEventCount).toBe(0);

      if (scene.direction === "left-to-right") {
        expect(scene.interactionStart.x).toBeLessThan(entryCard.left);
        expect(scene.interactionEnd.x).toBeGreaterThan(exitCard.right);
      } else {
        expect(scene.interactionStart.x).toBeGreaterThan(entryCard.right);
        expect(scene.interactionEnd.x).toBeLessThan(exitCard.left);
      }
      expect(scene.fullExpansionStart.x).toBeGreaterThanOrEqual(
        entryCard.left - 4,
      );
      expect(scene.fullExpansionStart.x).toBeLessThanOrEqual(
        entryCard.right + 4,
      );
      expect(scene.fullExpansionEnd.x).toBeGreaterThanOrEqual(exitCard.left - 4);
      expect(scene.fullExpansionEnd.x).toBeLessThanOrEqual(exitCard.right + 4);
    }
    expect(pageErrors).toEqual([]);
  });

  test("preserves the accepted Family-A tablet and Launch-form clearances", async ({
    page,
  }, testInfo) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await openMeasuredStory(page);

    const audit = await page.evaluate(() => {
      type NumericRect = {
        readonly bottom: number;
        readonly left: number;
        readonly right: number;
        readonly top: number;
      };
      type ScorePoint = {
        readonly id: string;
        readonly radius: number;
        readonly role: string;
        readonly x: number;
        readonly y: number;
      };

      const track = document.querySelector<HTMLElement>("[data-motion-track]");
      const branch = document.querySelector<HTMLElement>(
        '[data-score-branch="application"]',
      );
      if (!track || !branch) throw new Error("Missing Family-A score owners");
      const trackRect = track.getBoundingClientRect();
      const normalizeRect = (rect: DOMRect): NumericRect => ({
        bottom: rect.bottom - trackRect.top,
        left: rect.left - trackRect.left,
        right: rect.right - trackRect.left,
        top: rect.top - trackRect.top,
      });
      const signedPointDistance = (
        point: ScorePoint,
        rect: NumericRect,
      ): number => {
        const dx = Math.max(rect.left - point.x, 0, point.x - rect.right);
        const dy = Math.max(rect.top - point.y, 0, point.y - rect.bottom);
        if (dx || dy) return Math.hypot(dx, dy) - point.radius;
        return (
          -Math.min(
            point.x - rect.left,
            rect.right - point.x,
            point.y - rect.top,
            rect.bottom - point.y,
          ) - point.radius
        );
      };
      const signedRectangleDistance = (
        scoreRect: NumericRect,
        contentRect: NumericRect,
      ): number => {
        const dx = Math.max(
          contentRect.left - scoreRect.right,
          0,
          scoreRect.left - contentRect.right,
        );
        const dy = Math.max(
          contentRect.top - scoreRect.bottom,
          0,
          scoreRect.top - contentRect.bottom,
        );
        if (dx || dy) return Math.hypot(dx, dy);
        return -Math.min(
          scoreRect.right - contentRect.left,
          contentRect.right - scoreRect.left,
          scoreRect.bottom - contentRect.top,
          contentRect.bottom - scoreRect.top,
        );
      };
      const points: ScorePoint[] = [];

      branch
        .querySelectorAll<SVGGeometryElement>('[data-score-role="staff-line"]')
        .forEach((line) => {
          const matrix = line.getScreenCTM();
          if (!matrix) throw new Error("Missing Family-A staff matrix");
          const length = line.getTotalLength();
          const sampleCount = Math.max(1, Math.ceil(length / 3));
          const radius = Number(line.getAttribute("stroke-width") ?? 0) / 2;

          for (let index = 0; index <= sampleCount; index += 1) {
            const point = line.getPointAtLength((length * index) / sampleCount);
            const transformed = new DOMPoint(point.x, point.y).matrixTransform(
              matrix,
            );
            points.push({
              id: line.dataset.scorePrimitiveId ?? "staff-line",
              radius,
              role: "staff-line",
              x: transformed.x - trackRect.left,
              y: transformed.y - trackRect.top,
            });
          }
        });
      const rectangles = Array.from(
        branch.querySelectorAll<SVGGraphicsElement>(
          '[data-score-role]:not([data-score-role="staff-line"])',
        ),
      ).flatMap((primitive) => {
        const rect = normalizeRect(primitive.getBoundingClientRect());
        return rect.right > rect.left || rect.bottom > rect.top
          ? [
              Object.freeze({
                id: primitive.dataset.scorePrimitiveId ?? "score-primitive",
                rect,
                role: primitive.dataset.scoreRole ?? "unknown",
              }),
            ]
          : [];
      });
      const measure = (
        sceneId: "application-access" | "application-demo",
        reason: "access-action" | "application-tablet-demo",
      ) => {
        const target = document.querySelector<HTMLElement>(
          `[data-chapter-id="${sceneId}"] [data-score-content-exclusion="${reason}"]`,
        );
        if (!target) throw new Error(`Missing Family-A target: ${reason}`);
        const rect = normalizeRect(target.getBoundingClientRect());
        let minimumClearance = Number.POSITIVE_INFINITY;
        let nearest: Readonly<{ id: string; role: string }> = Object.freeze({
          id: "none",
          role: "none",
        });

        points.forEach((point) => {
          const clearance = signedPointDistance(point, rect);
          if (clearance < minimumClearance) {
            minimumClearance = clearance;
            nearest = Object.freeze({ id: point.id, role: point.role });
          }
        });
        rectangles.forEach((primitive) => {
          const clearance = signedRectangleDistance(primitive.rect, rect);
          if (clearance < minimumClearance) {
            minimumClearance = clearance;
            nearest = Object.freeze({ id: primitive.id, role: primitive.role });
          }
        });

        return Object.freeze({
          classification:
            minimumClearance < 0
              ? ("COLLISION" as const)
              : minimumClearance < 12
                ? ("TOO_CLOSE" as const)
                : ("CLEAR" as const),
          minimumClearance: Number(minimumClearance.toFixed(3)),
          minimumClearanceRounded: Number(minimumClearance.toFixed(2)),
          nearest,
          reason,
          sceneId,
        });
      };

      return Object.freeze({
        demonstration: measure(
          "application-demo",
          "application-tablet-demo",
        ),
        launch: measure("application-access", "access-action"),
      });
    });

    await testInfo.attach("family-a-regression-audit.json", {
      body: JSON.stringify(audit, null, 2),
      contentType: "application/json",
    });

    expect(audit.demonstration).toMatchObject({
      classification: "CLEAR",
    });
    expect(audit.demonstration.minimumClearanceRounded).toBeGreaterThanOrEqual(
      12.64,
    );
    expect(audit.launch).toMatchObject({
      classification: "CLEAR",
    });
    expect(audit.launch.minimumClearanceRounded).toBeGreaterThanOrEqual(23.64);
    expect(pageErrors).toEqual([]);
  });

  test("proves the rendered three-card Projects visits", async ({
    page,
  }, testInfo) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await openMeasuredStory(page);

    const audit = await page.evaluate(() => {
      type NumericRect = {
        readonly bottom: number;
        readonly height: number;
        readonly left: number;
        readonly right: number;
        readonly top: number;
        readonly width: number;
      };
      type RenderedPoint = {
        readonly id: string;
        readonly length: number;
        readonly line: SVGGeometryElement;
        readonly matrix: DOMMatrix;
        readonly radius: number;
        readonly x: number;
        readonly y: number;
      };

      const scoreLayer = document.querySelector<HTMLElement>(
        "[data-story-score-layer]",
      );
      const track = document.querySelector<HTMLElement>("[data-motion-track]");
      const branch = document.querySelector<HTMLElement>(
        '[data-score-branch="professional"]',
      );
      const chapter = document.querySelector<HTMLElement>(
        '[data-chapter-id="professional-projects"]',
      );
      if (!scoreLayer || !track || !branch || !chapter) {
        throw new Error("Missing rendered Projects owners");
      }
      const trackRect = track.getBoundingClientRect();
      const round = (value: number) => Number(value.toFixed(3));
      const normalizeRect = (rect: DOMRect): NumericRect => ({
        bottom: rect.bottom - trackRect.top,
        height: rect.height,
        left: rect.left - trackRect.left,
        right: rect.right - trackRect.left,
        top: rect.top - trackRect.top,
        width: rect.width,
      });
      const roundedRect = (rect: NumericRect): NumericRect => ({
        bottom: round(rect.bottom),
        height: round(rect.height),
        left: round(rect.left),
        right: round(rect.right),
        top: round(rect.top),
        width: round(rect.width),
      });
      const signedPointDistance = (
        point: Readonly<{ radius: number; x: number; y: number }>,
        rect: NumericRect,
      ): number => {
        const dx = Math.max(rect.left - point.x, 0, point.x - rect.right);
        const dy = Math.max(rect.top - point.y, 0, point.y - rect.bottom);
        if (dx || dy) return Math.hypot(dx, dy) - point.radius;
        return (
          -Math.min(
            point.x - rect.left,
            rect.right - point.x,
            point.y - rect.top,
            rect.bottom - point.y,
          ) - point.radius
        );
      };
      const transformPoint = (
        line: SVGGeometryElement,
        matrix: DOMMatrix,
        length: number,
      ) => {
        const point = line.getPointAtLength(length);
        const transformed = new DOMPoint(point.x, point.y).matrixTransform(matrix);
        return Object.freeze({
          x: transformed.x - trackRect.left,
          y: transformed.y - trackRect.top,
        });
      };
      const centerSamples: RenderedPoint[] = [];
      const staffSamples: RenderedPoint[] = [];

      branch
        .querySelectorAll<SVGGeometryElement>('[data-score-role="staff-line"]')
        .forEach((line) => {
          const matrix = line.getScreenCTM();
          if (!matrix) throw new Error("Missing Projects staff matrix");
          const lineLength = line.getTotalLength();
          const sampleCount = Math.max(1, Math.ceil(lineLength / 1.5));
          const radius = Number(line.getAttribute("stroke-width") ?? 0) / 2;
          const isCenterLine = line.dataset.scorePrimitiveId?.includes(
            ":staff:4:",
          );

          for (let index = 0; index <= sampleCount; index += 1) {
            const length = (lineLength * index) / sampleCount;
            const point = transformPoint(line, matrix, length);
            const sample = Object.freeze({
              id: line.dataset.scorePrimitiveId ?? "staff-line",
              length,
              line,
              matrix,
              radius,
              x: point.x,
              y: point.y,
            });
            staffSamples.push(sample);
            if (isCenterLine) centerSamples.push(sample);
          }
        });

      const cardElements = Array.from(
        chapter.querySelectorAll<HTMLElement>("[data-project-card-item]"),
      ).sort(
        (left, right) =>
          Number(left.dataset.projectPosition) -
          Number(right.dataset.projectPosition),
      );
      const declaredVisits = JSON.parse(
        scoreLayer.getAttribute("data-score-project-visit-anchors") ?? "[]",
      ) as Array<{
        readonly anchor: { readonly x: number; readonly y: number };
        readonly cardRect: {
          readonly height: number;
          readonly width: number;
          readonly x: number;
          readonly y: number;
        };
        readonly measurementSource: string;
        readonly projectIndex: number;
      }>;
      const scoreZIndex = Number(getComputedStyle(scoreLayer).zIndex);
      const scene = chapter.firstElementChild;
      if (!(scene instanceof HTMLElement)) throw new Error("Missing Projects scene");
      const sceneZIndex = Number(getComputedStyle(scene).zIndex);

      const visits = cardElements.map((card, index) => {
        const renderedRect = normalizeRect(card.getBoundingClientRect());
        const visit = declaredVisits[index];
        if (!visit) throw new Error(`Missing Project ${index + 1} visit`);
        const nearestCenter = centerSamples.reduce((candidate, point) =>
          Math.hypot(
            point.x - visit.anchor.x,
            point.y - visit.anchor.y,
          ) <
          Math.hypot(
            candidate.x - visit.anchor.x,
            candidate.y - visit.anchor.y,
          )
            ? point
            : candidate,
        );
        const lineLength = nearestCenter.line.getTotalLength();
        const tangentSampleRadius = Math.min(3, lineLength / 8);
        const before = transformPoint(
          nearestCenter.line,
          nearestCenter.matrix,
          Math.max(0, nearestCenter.length - tangentSampleRadius),
        );
        const after = transformPoint(
          nearestCenter.line,
          nearestCenter.matrix,
          Math.min(lineLength, nearestCenter.length + tangentSampleRadius),
        );
        const tangentAngle = Math.abs(
          (Math.atan2(after.y - before.y, after.x - before.x) * 180) / Math.PI,
        );
        const nearestStaff = staffSamples.reduce((candidate, point) =>
          signedPointDistance(point, renderedRect) <
          signedPointDistance(candidate, renderedRect)
            ? point
            : candidate,
        );
        const minimumClearance = signedPointDistance(
          nearestStaff,
          renderedRect,
        );
        const cardSurface = (() => {
          const style = getComputedStyle(
            card.querySelector<HTMLElement>("[data-project-card]") ?? card,
          );
          const color = style.backgroundColor;
          const slashAlpha = color.match(/\/\s*([\d.]+)\s*\)$/u)?.[1];
          const rgbaAlpha = color.match(
            /^rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)$/u,
          )?.[1];
          const colorAlpha = Number(slashAlpha ?? rgbaAlpha ?? 1);

          return Object.freeze({
            colorAlpha,
            hasBackgroundImage: style.backgroundImage !== "none",
          });
        })();
        const intendedOcclusion =
          minimumClearance < 0 &&
          (cardSurface.colorAlpha >= 0.9 || cardSurface.hasBackgroundImage) &&
          scoreZIndex < sceneZIndex;

        return Object.freeze({
          cardSurfaceAlpha: round(cardSurface.colorAlpha),
          cardSurfaceHasBackgroundImage: cardSurface.hasBackgroundImage,
          classification: intendedOcclusion
            ? ("INTENDED_OCCLUDED_BEHIND_CARD" as const)
            : minimumClearance < 0
              ? ("COLLISION" as const)
              : minimumClearance < 12
                ? ("TOO_CLOSE" as const)
                : ("CLEAR" as const),
          declaredCardRect: Object.freeze({
            height: round(visit.cardRect.height),
            left: round(visit.cardRect.x),
            top: round(visit.cardRect.y),
            width: round(visit.cardRect.width),
          }),
          distanceFromDeclaredAnchor: round(
            Math.hypot(
              nearestCenter.x - visit.anchor.x,
              nearestCenter.y - visit.anchor.y,
            ),
          ),
          localTangentAngleDeg: round(tangentAngle),
          measurementSource: visit.measurementSource,
          minimumClearance: round(minimumClearance),
          nearestPathPoint: Object.freeze({
            id: nearestCenter.id,
            x: round(nearestCenter.x),
            y: round(nearestCenter.y),
          }),
          nearestStaffPoint: Object.freeze({
            id: nearestStaff.id,
            x: round(nearestStaff.x),
            y: round(nearestStaff.y),
          }),
          notationSafe:
            after.x > before.x && tangentAngle <= 18 + Number.EPSILON,
          projectIndex: visit.projectIndex,
          renderedBounds: roundedRect(renderedRect),
          visitAnchor: Object.freeze({
            x: round(visit.anchor.x),
            y: round(visit.anchor.y),
          }),
        });
      });

      return Object.freeze({
        connectorEventCounts: (
          scoreLayer.getAttribute("data-score-project-connector-events") ?? ""
        )
          .split(" ")
          .filter(Boolean)
          .map(Number),
        maximumVisitTangentDeg: Number(
          scoreLayer.getAttribute("data-score-project-maximum-tangent"),
        ),
        pathSelfIntersections: Number(
          scoreLayer.getAttribute("data-score-path-self-intersections"),
        ),
        scorePointerEvents: getComputedStyle(scoreLayer).pointerEvents,
        scoreZIndex,
        sceneZIndex,
        staffLineSelfIntersections: Number(
          scoreLayer.getAttribute("data-score-staff-line-self-intersections"),
        ),
        visits,
      });
    });

    await testInfo.attach("projects-rendered-visit-audit.json", {
      body: JSON.stringify(audit, null, 2),
      contentType: "application/json",
    });
    await positionImmediately(page, "professional-projects");
    const screenshotPath = testInfo.outputPath("projects-current-dark-1536x900.png");
    await page.screenshot({
      animations: "disabled",
      path: screenshotPath,
    });
    await testInfo.attach("projects-current-dark-1536x900.png", {
      contentType: "image/png",
      path: screenshotPath,
    });

    expect(audit.visits).toHaveLength(3);
    expect(audit.connectorEventCounts).toEqual([0, 0, 0, 0]);
    expect(audit.maximumVisitTangentDeg).toBeLessThanOrEqual(18);
    expect(audit.pathSelfIntersections).toBe(0);
    expect(audit.staffLineSelfIntersections).toBe(0);
    expect(audit.scorePointerEvents).toBe("none");
    expect(audit.scoreZIndex).toBeLessThan(audit.sceneZIndex);
    for (const [index, visit] of audit.visits.entries()) {
      expect(visit.projectIndex).toBe(index + 1);
      expect(visit.measurementSource).toBe("dom-measured");
      expect(visit.classification).toBe("CLEAR");
      expect(visit.minimumClearance).toBeGreaterThanOrEqual(12);
      expect(visit.distanceFromDeclaredAnchor).toBeLessThanOrEqual(1);
      expect(visit.localTangentAngleDeg).toBeLessThanOrEqual(18);
      expect(visit.notationSafe).toBe(true);
      expect(visit.visitAnchor.x).toBeGreaterThan(visit.renderedBounds.left);
      expect(visit.visitAnchor.x).toBeLessThan(visit.renderedBounds.right);
      expect(visit.visitAnchor.y).toBeGreaterThan(visit.renderedBounds.bottom);
      expect(visit.declaredCardRect.left).toBeCloseTo(
        visit.renderedBounds.left,
        1,
      );
      expect(visit.declaredCardRect.top).toBeCloseTo(
        visit.renderedBounds.top,
        1,
      );
      expect(visit.declaredCardRect.width).toBeCloseTo(
        visit.renderedBounds.width,
        1,
      );
      expect(visit.declaredCardRect.height).toBeCloseTo(
        visit.renderedBounds.height,
        1,
      );
    }
    expect(pageErrors).toEqual([]);
  });
});
