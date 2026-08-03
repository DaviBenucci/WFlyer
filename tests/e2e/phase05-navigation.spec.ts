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
    destination: "/aplicacao-wflyer",
    destinationChapter: "application",
    direction: "left",
    source: "/",
    sourceChapter: "home",
  },
  {
    destination: "/aplicacao-wflyer/como-funciona",
    destinationChapter: "application-how-it-works",
    direction: "left",
    source: "/aplicacao-wflyer",
    sourceChapter: "application",
  },
  {
    destination: "/aplicacao-wflyer/beneficios",
    destinationChapter: "application-benefits",
    direction: "left",
    source: "/aplicacao-wflyer/como-funciona",
    sourceChapter: "application-how-it-works",
  },
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
    destination: "/portfolio",
    destinationChapter: "portfolio",
    direction: "right",
    source: "/processo",
    sourceChapter: "process",
  },
  {
    destination: "/contato",
    destinationChapter: "contact",
    direction: "right",
    source: "/portfolio",
    sourceChapter: "portfolio",
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
      await page.setViewportSize({ height: 1024, width: 1536 });
      await page.goto(edge.source);
      await warmRoute(page, edge.destination);
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

test.describe("Phase 05 compressed and cross-branch navigation", () => {
  for (const jump of [
    {
      destination: "/aplicacao-wflyer/beneficios",
      direction: "left" as const,
      excluded: "application-how-it-works",
      source: "/aplicacao-wflyer",
    },
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
      await page.goto(jump.source);
      await warmRoute(page, jump.destination);
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
      await waitForSettledTransition(page, jump.destination);
      expect(await mountedChapters(page)).not.toContain(jump.excluded);
      expect(await page.evaluate(() => window.history.length)).toBe(
        initialHistoryLength + 1,
      );
    });
  }

  for (const crossing of [
    {
      destination: "/sobre",
      direction: "right" as const,
      source: "/aplicacao-wflyer",
    },
    {
      destination: "/aplicacao-wflyer",
      direction: "left" as const,
      source: "/sobre",
    },
  ] as const) {
    test(`${crossing.source} to ${crossing.destination} pivots through Home without adding it to history`, async ({
      page,
    }) => {
      await page.goto(crossing.source);
      await warmRoute(page, crossing.destination);
      await holdAt(page, "midpoint");

      await visibleHeaderLink(page, crossing.destination).click();

      await waitForCheckpoint(page, "midpoint");
      await expectTransitionMetadata(page, {
        destination: crossing.destination,
        direction: crossing.direction,
        mode: "home-pivot",
        source: crossing.source,
        sourceKind: "link",
      });
      await expect(
        overlay(page).locator("[data-transition-segment]"),
      ).toHaveCount(2);
      await expect(
        overlay(page).locator('[data-segment-id="to-home"]'),
      ).toHaveCount(1);
      await expect(
        overlay(page).locator('[data-segment-id="from-home"]'),
      ).toHaveCount(1);

      await releaseTransition(page);
      await waitForSettledTransition(page, crossing.destination);

      await holdAt(page, "midpoint");
      await page.goBack();
      await waitForCheckpoint(page, "midpoint");
      await expectTransitionMetadata(page, {
        destination: crossing.source,
        direction: crossing.direction === "left" ? "right" : "left",
        mode: "home-pivot",
        source: crossing.destination,
        sourceKind: "history",
      });
      await releaseTransition(page);
      await waitForSettledTransition(page, crossing.source);
    });
  }
});

test("Back and Forward restore one route without focus theft or route loops", async ({
  page,
}) => {
  await page.goto("/sobre");
  await warmRoute(page, "/servicos");
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
    ["/aplicacao-wflyer", "application"],
    ["/aplicacao-wflyer/como-funciona", "application-how-it-works"],
    ["/aplicacao-wflyer/beneficios", "application-benefits"],
    ["/sobre", "company"],
    ["/servicos", "services"],
    ["/processo", "process"],
    ["/portfolio", "portfolio"],
    ["/contato", "contact"],
  ] as const;

  for (const [route, chapter] of routes) {
    const response = await page.goto(route);

    expect(response?.ok(), route).toBe(true);
    await expect(page.getByRole("main")).toHaveAttribute(
      "data-chapter",
      chapter,
    );
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(experience(page)).toHaveAttribute("data-transition-phase", "idle");
    await expect(experience(page)).toHaveAttribute("data-active-timelines", "0");
    await expect(overlay(page)).toHaveAttribute("data-active", "false");
  }
});

test("the latest rapid activation supersedes one pending destination", async ({
  page,
}) => {
  await page.goto("/");
  await warmRoute(page, "/aplicacao-wflyer");
  await warmRoute(page, "/sobre");
  const initialHistoryLength = await page.evaluate(
    () => window.history.length,
  );
  await holdAt(page, "start");

  await visibleMainLink(page, "/aplicacao-wflyer").click();
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
  await page.goto("/sobre");
  await warmRoute(page, "/servicos");
  await warmRoute(page, "/processo");
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
  await page.goto("/aplicacao-wflyer");
  await warmRoute(page, "/aplicacao-wflyer/como-funciona");
  const nextChapter = chapterControl(page, "next");
  await nextChapter.scrollIntoViewIfNeeded();
  await nextChapter.focus();
  await expect(nextChapter).toBeFocused();

  await page.keyboard.press("Enter");
  await waitForSettledTransition(
    page,
    "/aplicacao-wflyer/como-funciona",
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
  await page.goto("/servicos");
  await warmRoute(page, "/processo");
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

test("the public application CTA remains an external new-context link", async ({
  page,
}) => {
  await page.goto("/");
  const applicationCta = page.getByRole("link", {
    name: /Acessar aplicação/u,
  });

  await expect(applicationCta).toHaveAttribute(
    "href",
    "https://app.wflyer.com.br",
  );
  await expect(applicationCta).toHaveAttribute("target", "_blank");
  await applicationCta.dispatchEvent("click", { ctrlKey: true });
  await expect(page).toHaveURL(/\/$/u);
  await expect(experience(page)).toHaveAttribute("data-transition-source", "none");
});

for (const terminal of [
  {
    destination: "/aplicacao-wflyer/beneficios",
    side: "start",
    source: "/aplicacao-wflyer/como-funciona",
  },
  {
    destination: "/contato",
    side: "end",
    source: "/portfolio",
  },
] as const) {
  test(`${terminal.destination} retains its final barline and previous navigation`, async ({
    page,
  }) => {
    await page.goto(terminal.source);
    await warmRoute(page, terminal.destination);
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

test("both final barlines persist on mobile and with reduced motion", async ({
  page,
}) => {
  const terminals = [
    {
      route: "/aplicacao-wflyer/beneficios",
      side: "start",
    },
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
