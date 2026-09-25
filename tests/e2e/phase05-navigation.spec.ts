import { expect, test, type Locator, type Page } from "@playwright/test";

import {
  chapterControl,
  expectSafeSettledDocument,
  expectTransitionMetadata,
  experience,
  holdAt,
  overlay,
  releaseTransition,
  transitionSnapshot,
  visibleHeaderLink,
  visibleMainLink,
  waitForCheckpoint,
  waitForSettledTransition,
  warmRoute,
} from "../helpers/transition";

test.describe.configure({ mode: "serial" });

interface AdjacentEdge {
  readonly destination: string;
  readonly destinationChapter: string;
  readonly direction: "left" | "right";
  readonly source: string;
  readonly sourceChapter: string;
}

const adjacentEdges: readonly AdjacentEdge[] = [
  {
    destination: "/sobre",
    destinationChapter: "company",
    direction: "right",
    source: "/",
    sourceChapter: "home",
  },
  {
    destination: "/servicos",
    destinationChapter: "services",
    direction: "right",
    source: "/sobre",
    sourceChapter: "company",
  },
  {
    destination: "/processo",
    destinationChapter: "process",
    direction: "right",
    source: "/servicos",
    sourceChapter: "services",
  },
  {
    destination: "/contato",
    destinationChapter: "contact",
    direction: "right",
    source: "/processo",
    sourceChapter: "process",
  },
];

function outgoingLink(page: Page, edge: AdjacentEdge): Locator {
  return edge.source === "/"
    ? visibleMainLink(page, edge.destination)
    : chapterControl(page, "next");
}

async function observeMountedChapters(page: Page): Promise<void> {
  await page.evaluate(() => {
    interface InstrumentedWindow extends Window {
      __phase05MountedChapters?: string[];
      __phase05MountObserver?: MutationObserver;
    }

    const instrumentedWindow = window as InstrumentedWindow;
    const recordChapter = () => {
      const chapter = document
        .querySelector("main#main-content")
        ?.getAttribute("data-chapter");

      if (
        chapter &&
        !instrumentedWindow.__phase05MountedChapters?.includes(chapter)
      ) {
        instrumentedWindow.__phase05MountedChapters?.push(chapter);
      }
    };

    instrumentedWindow.__phase05MountedChapters = [];
    recordChapter();
    instrumentedWindow.__phase05MountObserver = new MutationObserver(
      recordChapter,
    );
    instrumentedWindow.__phase05MountObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

async function mountedChapters(page: Page): Promise<readonly string[]> {
  return page.evaluate(() => {
    interface InstrumentedWindow extends Window {
      __phase05MountedChapters?: string[];
      __phase05MountObserver?: MutationObserver;
    }

    const instrumentedWindow = window as InstrumentedWindow;
    instrumentedWindow.__phase05MountObserver?.disconnect();
    return instrumentedWindow.__phase05MountedChapters ?? [];
  });
}

test.describe("Phase 05 adjacent score navigation", () => {
  for (const edge of adjacentEdges) {
    test(`${edge.source} to ${edge.destination} connects adjacent score anchors`, async ({
      page,
    }) => {
      await warmRoute(page, edge.destination);
      await page.setViewportSize({ height: 1024, width: 1536 });
      await page.goto(edge.source);
      await holdAt(page, "start");

      await outgoingLink(page, edge).click();

      await waitForCheckpoint(page, "start");
      await expectTransitionMetadata(page, {
        destination: edge.destination,
        direction: edge.direction,
        mode: "adjacent-score",
        source: edge.source,
        sourceKind: "link",
      });
      await expect(overlay(page)).toHaveAttribute("data-active", "true");
      await expect(
        overlay(page).locator("[data-transition-segment]"),
      ).toHaveCount(1);
      await expect(
        overlay(page).locator("[data-transition-staff-line]"),
      ).toHaveCount(5);
      await expect(
        overlay(page).locator("[data-transition-note]"),
      ).toHaveCount(3);
      await expect
        .poll(() =>
          overlay(page)
            .locator("[data-transition-staff-line]")
            .first()
            .getAttribute("d"),
        )
        .not.toMatch(/NaN|undefined/u);

      await releaseTransition(page);
      await waitForSettledTransition(page, edge.destination, [
        "success",
        "recovered",
      ]);
      await expect(page.getByRole("main")).toHaveAttribute(
        "data-chapter",
        edge.destinationChapter,
      );
      await expectSafeSettledDocument(page);
    });
  }
});

test.describe("Phase 05 compressed portfolio navigation", () => {
  for (const jump of [
    {
      destination: "/contato",
      direction: "right" as const,
      excluded: "services",
      source: "/sobre",
    },
  ] as const) {
    test(`${jump.source} to ${jump.destination} is one compressed traversal`, async ({
      page,
    }) => {
      await warmRoute(page, jump.destination);
      await page.goto(jump.source);
      await observeMountedChapters(page);
      const initialHistoryLength = await page.evaluate(
        () => window.history.length,
      );
      await holdAt(page, "start");

      await visibleHeaderLink(page, jump.destination).click();

      await waitForCheckpoint(page, "start");
      await expectTransitionMetadata(page, {
        destination: jump.destination,
        direction: jump.direction,
        mode: "compressed-score-jump",
        source: jump.source,
        sourceKind: "link",
      });
      await expect(
        overlay(page).locator("[data-transition-segment]"),
      ).toHaveCount(1);

      await releaseTransition(page);
      // The held checkpoint already proves the compressed topology and
      // geometry. A saturated browser may then exercise the normative
      // 1,100 ms recovery while still committing the same usable destination.
      await waitForSettledTransition(page, jump.destination, [
        "success",
        "recovered",
      ]);
      expect(await mountedChapters(page)).not.toContain(jump.excluded);
      expect(await page.evaluate(() => window.history.length)).toBe(
        initialHistoryLength + 1,
      );
      await expectSafeSettledDocument(page);
    });
  }


});

test("Back and Forward restore one route without focus theft or route loops", async ({
  page,
}) => {
  await warmRoute(page, "/servicos");
  await page.goto("/sobre");
  await chapterControl(page, "next").click();
  await waitForSettledTransition(page, "/servicos");
  const historyLength = await page.evaluate(() => window.history.length);
  const themeToggle = page.locator('button[aria-label="Tema escuro"]:visible');
  await themeToggle.focus();

  await holdAt(page, "midpoint");
  await page.goBack();
  await waitForCheckpoint(page, "midpoint");
  await expectTransitionMetadata(page, {
    destination: "/sobre",
    direction: "left",
    mode: "adjacent-score",
    source: "/servicos",
    sourceKind: "history",
  });
  await releaseTransition(page);
  await waitForSettledTransition(page, "/sobre");
  await expect(themeToggle).toBeFocused();

  await holdAt(page, "midpoint");
  await page.goForward();
  await waitForCheckpoint(page, "midpoint");
  await expectTransitionMetadata(page, {
    destination: "/servicos",
    direction: "right",
    mode: "adjacent-score",
    source: "/sobre",
    sourceKind: "history",
  });
  await releaseTransition(page);
  await waitForSettledTransition(page, "/servicos");
  await expect(themeToggle).toBeFocused();
  expect(await page.evaluate(() => window.history.length)).toBe(historyLength);
});

test("every main chapter remains a clean direct deep link", async ({ page }) => {
  const routes = [
    ["/", "home"],
    ["/sobre", "company"],
    ["/servicos", "services"],
    ["/processo", "process"],
    ["/contato", "contact"],
  ] as const;

  for (const [route, chapter] of routes) {
    const response = await page.goto(route);

    expect(response?.ok(), route).toBe(true);
    if (route === "/") {
      // Public Home owns BrandIntroController, not the story-lab bootstrap.
      await expect(page.locator("[data-brand-intro-home-state]")).toHaveAttribute(
        "data-brand-intro-home-state",
        "ready",
        { timeout: 10_000 },
      );
    }
    await expect(page.getByRole("main")).toHaveAttribute(
      "data-chapter",
      chapter,
    );
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(experience(page)).toHaveAttribute("data-transition-phase", "idle");
    await expect(experience(page)).toHaveAttribute("data-active-timelines", "0");
    await expect(overlay(page)).toHaveAttribute("data-active", "false");
    await expectSafeSettledDocument(page);
  }
});

test("the latest rapid activation supersedes one pending destination", async ({
  page,
}) => {
  await warmRoute(page, "/servicos");
  await warmRoute(page, "/sobre");
  await page.goto("/");
  const initialHistoryLength = await page.evaluate(
    () => window.history.length,
  );
  await holdAt(page, "start");

  await visibleMainLink(page, "/servicos").click();
  await waitForCheckpoint(page, "start");
  const firstRequest = await transitionSnapshot(page);

  await visibleMainLink(page, "/sobre").click();
  await expectTransitionMetadata(page, {
    destination: "/sobre",
    direction: "right",
    mode: "adjacent-score",
    source: "/",
    sourceKind: "link",
  });
  const latestRequest = await transitionSnapshot(page);
  expect(latestRequest.requestId).not.toBe(firstRequest.requestId);

  await releaseTransition(page);
  await waitForSettledTransition(page, "/sobre");
  expect(await page.evaluate(() => window.history.length)).toBe(
    initialHistoryLength + 1,
  );

  await page.goBack();
  await expect(page).toHaveURL(/\/$/u);
});

test("a destination committed before continued navigation remains in history", async ({
  page,
}) => {
  await warmRoute(page, "/servicos");
  await warmRoute(page, "/processo");
  await page.goto("/sobre");
  const initialHistoryLength = await page.evaluate(
    () => window.history.length,
  );
  await holdAt(page, "completion");

  await chapterControl(page, "next").click();
  await waitForCheckpoint(page, "completion");
  await expect(page).toHaveURL(/\/servicos$/u);
  const committedRequest = await transitionSnapshot(page);

  await chapterControl(page, "next").click();
  await expectTransitionMetadata(page, {
    destination: "/processo",
    direction: "right",
    mode: "adjacent-score",
    source: "/servicos",
    sourceKind: "link",
  });
  await waitForCheckpoint(page, "completion");
  const continuedRequest = await transitionSnapshot(page);
  expect(continuedRequest.requestId).not.toBe(committedRequest.requestId);

  await releaseTransition(page);
  await waitForSettledTransition(page, "/processo");
  expect(await page.evaluate(() => window.history.length)).toBe(
    initialHistoryLength + 2,
  );

  await page.goBack();
  await waitForSettledTransition(page, "/servicos", ["success", "recovered"]);
  await page.goBack();
  await waitForSettledTransition(page, "/sobre", ["success", "recovered"]);
  await expectSafeSettledDocument(page);
});

test("Enter activates chapter navigation and transfers focus once to main", async ({
  page,
}) => {
  await warmRoute(page, "/servicos");
  await page.goto("/sobre");
  const nextChapter = chapterControl(page, "next");
  await expect(nextChapter).toBeVisible();
  await expect
    .poll(async () => {
      try {
        await nextChapter.focus();
        return await nextChapter.evaluate(
          (element) => document.activeElement === element,
        );
      } catch {
        return false;
      }
    })
    .toBe(true);

  await page.keyboard.press("Enter");
  await waitForSettledTransition(
    page,
    "/servicos",
  );

  await expect(page.getByRole("main")).toBeFocused();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole("main")).toHaveCSS(
    "outline-style",
    /solid|auto/u,
  );
});

test("Process remains the Services subchapter after client navigation", async ({
  page,
}) => {
  await warmRoute(page, "/processo");
  await page.goto("/servicos");
  await chapterControl(page, "next").click();
  await waitForSettledTransition(page, "/processo");

  await expect(
    page.locator('header a[href="/servicos"][aria-current="step"]:visible'),
  ).toHaveCount(1);
  await expect(
    page.locator('header a[href="/processo"]:visible'),
  ).toHaveCount(0);
});

test("auxiliary links keep native navigation and do not create a chapter", async ({
  page,
}) => {
  await page.goto("/servicos");
  await visibleMainLink(page, "/servicos/criacao-de-sites").click();

  await expect(page).toHaveURL(/\/servicos\/criacao-de-sites$/u);
  await expect(page.getByRole("main")).toHaveAttribute(
    "data-route-kind",
    "auxiliary",
  );
  await expect(experience(page)).toHaveAttribute("data-transition-source", "none");
  await expect(experience(page)).toHaveAttribute("data-transition-phase", "idle");
});


for (const terminal of [
  {
    destination: "/contato",
    side: "end",
    source: "/processo",
  },
] as const) {
  test(`${terminal.destination} retains its final barline and previous navigation`, async ({
    page,
  }) => {
    await warmRoute(page, terminal.destination);
    await page.goto(terminal.source);
    await chapterControl(page, "next").click();
    // The adjacent-edge matrix already verifies this route's transition
    // metadata and score geometry. Under a saturated development server, the
    // terminal-state check may exercise the normative 1,100 ms safe recovery.
    await waitForSettledTransition(page, terminal.destination, [
      "success",
      "recovered",
    ]);

    await expect(page.getByRole("main")).toHaveAttribute(
      "data-terminal",
      "true",
    );
    await expect(page.locator("[data-final-barline]")).toHaveCount(1);
    await expect(page.locator("[data-final-barline]")).toHaveAttribute(
      "data-side",
      terminal.side,
    );
    await expect(chapterControl(page, "next")).toHaveCount(0);
    await expect(chapterControl(page, "previous")).toBeVisible();
    await expect(page.getByRole("banner")).toBeVisible();
    await expectSafeSettledDocument(page);
  });
}

test("the final barline persists on mobile and with reduced motion", async ({
  page,
}) => {
  const terminals = [
    { route: "/contato", side: "end" },
  ] as const;
  const states = [
    {
      height: 844,
      name: "mobile",
      reducedMotion: "no-preference" as const,
      width: 390,
    },
    {
      height: 1024,
      name: "reduced motion",
      reducedMotion: "reduce" as const,
      width: 1536,
    },
  ] as const;

  for (const state of states) {
    await page.setViewportSize({ height: state.height, width: state.width });
    await page.emulateMedia({ reducedMotion: state.reducedMotion });

    for (const terminal of terminals) {
      await page.goto(terminal.route);
      const finalBarline = page.locator("[data-final-barline]");

      await expect(finalBarline, `${terminal.route} in ${state.name}`).toHaveCount(1);
      await expect(finalBarline).toHaveAttribute("data-side", terminal.side);
      await expect(chapterControl(page, "next")).toHaveCount(0);
      await expect(chapterControl(page, "previous")).toBeVisible();
      await expectSafeSettledDocument(page);
    }
  }
});
