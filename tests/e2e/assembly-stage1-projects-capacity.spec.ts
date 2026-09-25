import { expect, test } from "@playwright/test";

const candidates = [
  {
    height: 900,
    width: 1440,
  },
  {
    height: 900,
    width: 1536,
  },
  {
    height: 917,
    width: 1920,
  },
] as const;

const candidateExpectations = {
  chromium: {
    1440: "PASS",
    1536: "PASS",
    1920: "INSUFFICIENT_CAPACITY",
  },
  firefox: {
    1440: "INSUFFICIENT_CAPACITY",
    1536: "INSUFFICIENT_CAPACITY",
    1920: "INSUFFICIENT_CAPACITY",
  },
  webkit: {
    1440: "PASS",
    1536: "PASS",
    1920: "INSUFFICIENT_CAPACITY",
  },
} as const;

test("interaction probes cannot precede canonical Projects rest-bound reads", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.addInitScript(() => {
    const originalGetBoundingClientRect =
      Element.prototype.getBoundingClientRect;
    const originalSetAttribute = Element.prototype.setAttribute;
    const probedItems = new WeakSet<Element>();
    const postProbeRestReads: number[] = [];

    Element.prototype.setAttribute = function setAttribute(name, value) {
      if (
        name === "data-score-interaction-measurement" &&
        this instanceof HTMLElement &&
        this.matches("[data-project-card-item]")
      ) {
        probedItems.add(this);
      }

      return originalSetAttribute.call(this, name, value);
    };
    Element.prototype.getBoundingClientRect = function getBoundingClientRect() {
      if (
        this instanceof HTMLElement &&
        this.matches("[data-project-card-item]") &&
        probedItems.has(this) &&
        !this.hasAttribute("data-score-interaction-measurement") &&
        !this.hasAttribute("data-score-rest-measurement") &&
        this.style.getPropertyValue("transition") !== "none"
      ) {
        postProbeRestReads.push(
          Number(this.dataset.projectCardItem ?? postProbeRestReads.length + 1),
        );
      }

      return originalGetBoundingClientRect.call(this);
    };
    Object.defineProperty(window, "__WFLYER_PROJECT_REST_READS__", {
      configurable: true,
      value: postProbeRestReads,
    });
  });
  await page.setViewportSize({ height: 900, width: 1536 });
  await page.goto("/__visual-lab/story/motion", {
    waitUntil: "domcontentloaded",
  });

  const root = page.locator("main[data-motion-lab]:not([inert])");
  await expect(root).toHaveAttribute(
    "data-motion-projects-capacity",
    /^(?:PASS|INSUFFICIENT_CAPACITY|INVALID)$/u,
    { timeout: 40_000 },
  );
  const lifecycle = await page.evaluate(() => ({
    postProbeRestReads: (
      window as typeof window & { __WFLYER_PROJECT_REST_READS__?: number[] }
    ).__WFLYER_PROJECT_REST_READS__ ?? [],
    probeState: Array.from(
      document.querySelectorAll<HTMLElement>("[data-project-card-item]"),
      (item) => ({
        animations: item.getAnimations().length,
        interactionProbe: item.getAttribute(
          "data-score-interaction-measurement",
        ),
        restProbe: item.getAttribute("data-score-rest-measurement"),
        transitionOverride: item.style.getPropertyValue("transition"),
      }),
    ),
  }));

  expect(lifecycle.postProbeRestReads).toEqual([]);
  expect(lifecycle.probeState).toEqual(
    lifecycle.probeState.map(() => ({
      animations: 0,
      interactionProbe: null,
      restProbe: null,
      transitionOverride: "",
    })),
  );
});

test("focused and repeated generations preserve canonical rest Projection inputs", async ({
  browserName,
  page,
}, testInfo) => {
  test.setTimeout(90_000);
  const expectedStatus =
    browserName === "firefox" ? "INSUFFICIENT_CAPACITY" : "PASS";
  const expectedMode =
    expectedStatus === "PASS" ? "horizontal-enhanced" : "vertical-wide";
  await page.setViewportSize({ height: 900, width: 1536 });
  await page.goto("/__visual-lab/story/motion", {
    waitUntil: "domcontentloaded",
  });

  const root = page.locator("main[data-motion-lab]:not([inert])");
  await expect(root).toHaveAttribute(
    "data-motion-projects-capacity",
    expectedStatus,
    { timeout: 40_000 },
  );
  const professionalScore = page.locator(
    '[data-score-branch="professional"] [data-integrated-score="professional"]',
  );
  await expect(page.locator("[data-story-score-layer]")).toHaveAttribute(
    "data-score-projection",
    expectedMode,
    { timeout: 40_000 },
  );
  const baseline = await page.evaluate(() => {
    const scorePoints = Array.from(
      document.querySelectorAll(
        '[data-score-branch="professional"] [data-integrated-score="professional"] polyline',
      ),
      (polyline) => polyline.getAttribute("points"),
    ).join("|");
    let scoreHash = 0x811c9dc5;
    for (let index = 0; index < scorePoints.length; index += 1) {
      scoreHash = Math.imul(scoreHash ^ scorePoints.charCodeAt(index), 0x01000193);
    }

    return {
      capacitySignature:
        window.__WFLYER_PHASE5_MOTION__?.snapshot()
          .projectsCapacitySignature,
      scoreHash: scoreHash >>> 0,
      visitAnchors: document
        .querySelector<HTMLElement>("[data-story-score-layer]")
        ?.getAttribute("data-score-project-visit-anchors"),
    };
  });

  await page.evaluate(async () => {
    await window.__WFLYER_PHASE5_MOTION__?.position("professional-projects");
  });
  await page
    .locator("[data-project-card-item]")
    .nth(1)
    .locator("[data-project-card-link]")
    .focus();
  await page.locator("[data-project-card-item]").nth(2).hover();

  for (let index = 0; index < 2; index += 1) {
    const previousGeneration = await page.evaluate(
      () =>
        window.__WFLYER_PHASE5_MOTION__?.snapshot()
          .projectsCapacityGeneration ?? 0,
    );
    await page.evaluate(async () => {
      window.dispatchEvent(new Event("resize"));
      await window.__WFLYER_PHASE5_MOTION__?.rebuild();
    });
    await expect
      .poll(
        () =>
          page.evaluate(
            () =>
              window.__WFLYER_PHASE5_MOTION__?.snapshot()
                .projectsCapacityGeneration ?? 0,
          ),
        { timeout: 40_000 },
      )
      .toBeGreaterThan(previousGeneration);
    await expect(root).toHaveAttribute(
      "data-motion-projects-capacity",
      expectedStatus,
      { timeout: 40_000 },
    );
    await expect
      .poll(
        () =>
          page.evaluate(
            () =>
              window.__WFLYER_PHASE5_MOTION__?.snapshot()
                .projectsCapacitySignature,
          ),
        { timeout: 40_000 },
      )
      .toBe(baseline.capacitySignature);
  }

  await expect(professionalScore).toBeVisible();
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const scorePoints = Array.from(
            document.querySelectorAll(
              '[data-score-branch="professional"] [data-integrated-score="professional"] polyline',
            ),
            (polyline) => polyline.getAttribute("points"),
          ).join("|");
          let scoreHash = 0x811c9dc5;
          for (let index = 0; index < scorePoints.length; index += 1) {
            scoreHash = Math.imul(
              scoreHash ^ scorePoints.charCodeAt(index),
              0x01000193,
            );
          }

          return {
            scoreHash: scoreHash >>> 0,
            visitAnchors: document
              .querySelector<HTMLElement>("[data-story-score-layer]")
              ?.getAttribute("data-score-project-visit-anchors"),
          };
        }),
      { timeout: 40_000 },
    )
    .toEqual({
      scoreHash: baseline.scoreHash,
      visitAnchors: baseline.visitAnchors,
    });
  const repeated = await page.evaluate(() => {
    const scorePoints = Array.from(
      document.querySelectorAll(
        '[data-score-branch="professional"] [data-integrated-score="professional"] polyline',
      ),
      (polyline) => polyline.getAttribute("points"),
    ).join("|");
    let scoreHash = 0x811c9dc5;
    for (let index = 0; index < scorePoints.length; index += 1) {
      scoreHash = Math.imul(scoreHash ^ scorePoints.charCodeAt(index), 0x01000193);
    }

    return {
      capacitySignature:
        window.__WFLYER_PHASE5_MOTION__?.snapshot()
          .projectsCapacitySignature,
      probeState: Array.from(
      document.querySelectorAll<HTMLElement>("[data-project-card-item]"),
      (item) => ({
        interaction: item.getAttribute("data-score-interaction-measurement"),
        rest: item.getAttribute("data-score-rest-measurement"),
        transition: item.style.getPropertyValue("transition"),
      }),
      ),
      scoreHash: scoreHash >>> 0,
      visitAnchors: document
        .querySelector<HTMLElement>("[data-story-score-layer]")
        ?.getAttribute("data-score-project-visit-anchors"),
    };
  });

  await testInfo.attach("projects-capacity-generation-comparison", {
    body: JSON.stringify({ baseline, repeated }, null, 2),
    contentType: "application/json",
  });
  expect(repeated.capacitySignature).toBe(baseline.capacitySignature);
  expect(repeated.scoreHash).toBe(baseline.scoreHash);
  expect(repeated.visitAnchors).toBe(baseline.visitAnchors);
  expect(repeated.probeState).toEqual(
    repeated.probeState.map(() => ({
      interaction: null,
      rest: null,
      transition: "",
    })),
  );
});

for (const viewport of candidates) {
  test(`complete Projects candidate ${viewport.width}x${viewport.height}`, async ({
    browserName,
    page,
  }) => {
    test.setTimeout(60_000);
    const status = candidateExpectations[browserName][viewport.width];
    const reasons =
      status === "PASS"
        ? "none"
        : "projects-protected-clearance-or-clip";
    const mode =
      status === "PASS" ? "horizontal-enhanced" : "vertical-wide";
    await page.setViewportSize(viewport);
    await page.goto("/__visual-lab/story/motion", {
      waitUntil: "domcontentloaded",
    });

    const root = page.locator("main[data-motion-lab]:not([inert])");
    await expect(root).toHaveAttribute(
      "data-motion-projects-capacity",
      /^(?:PASS|INSUFFICIENT_CAPACITY|INVALID)$/u,
      {
        timeout: 40_000,
      },
    );
    const capacity = await root.evaluate((element) => ({
      reasons: element.dataset.motionProjectsCapacityReasons,
      status: element.dataset.motionProjectsCapacity,
      visits: JSON.parse(
        element.dataset.motionProjectsCapacityVisits ?? "[]",
      ) as unknown,
    }));
    expect(capacity, JSON.stringify(capacity, null, 2)).toMatchObject({
      reasons,
      status,
    });
    await expect(root).toHaveAttribute(
      "data-motion-projects-capacity",
      status,
      { timeout: 40_000 },
    );
    await expect(root).toHaveAttribute(
      "data-projection-mode",
      mode,
      { timeout: 40_000 },
    );
    await expect(page.locator("[data-projects-capacity-host]")).toHaveCount(0);
    await expect(root).toHaveAttribute(
      "data-motion-projects-capacity-reasons",
      reasons,
    );
  });
}

test("the registered 1100x640 candidate selects whole-story fallback", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ height: 640, width: 1100 });
  await page.goto("/__visual-lab/story/motion", {
    waitUntil: "domcontentloaded",
  });

  const root = page.locator("main[data-motion-lab]:not([inert])");
  await expect(root).toHaveAttribute(
    "data-motion-projects-capacity",
    "INSUFFICIENT_CAPACITY",
    { timeout: 40_000 },
  );
  await expect(root).toHaveAttribute("data-projection-mode", "vertical-wide");
  await expect(page.locator("[data-projects-capacity-host]")).toHaveCount(0);
});
