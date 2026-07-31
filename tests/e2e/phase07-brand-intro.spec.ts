import { expect, test } from "@playwright/test";

test("eligible Home exposes skip, completes the session, and does not replay", async ({
  page,
}) => {
  await page.goto("/?intro=1");

  const skip = page.getByRole("button", { name: "Pular introdução" });
  await expect(skip).toBeVisible();
  await expect(skip).toHaveCSS("min-height", "44px");
  await skip.click();

  await expect(page.locator("[data-brand-intro]")).toHaveCount(0);
  expect(
    await page.evaluate(() =>
      sessionStorage.getItem("wflyer.brand-intro.completed.v1"),
    ),
  ).toBe("1");
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(page.getByRole("main")).toBeVisible();

  await page.reload();
  await expect(page.locator("[data-brand-intro]")).toHaveCount(0);
});

test("Escape applies the same fail-open final state without moving focus", async ({
  page,
}) => {
  await page.goto("/?intro=1");
  const skip = page.getByRole("button", { name: "Pular introdução" });
  await skip.focus();
  await page.keyboard.press("Escape");

  await expect(page.locator("[data-brand-intro]")).toHaveCount(0);
  await expect(page.getByRole("main")).not.toBeFocused();
  await expect(page.getByRole("link", { name: "Acessar aplicação" })).toBeVisible();
});

test("reduced motion uses the direct final Home state", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?intro=1");
  await expect(page.locator("[data-brand-intro]")).toHaveCount(0);
  await expect(page.getByRole("main")).toBeVisible();
  await expect.poll(() =>
    page.evaluate(() =>
      sessionStorage.getItem("wflyer.brand-intro.completed.v1"),
    ),
  ).toBe("1");
});

test("asset failure releases Home without waiting for the deadline", async ({
  page,
}) => {
  await page.route("**/brand/wflyer-intro-master.svg", (route) => route.abort());
  await page.goto("/?intro=1");

  await expect(page.locator("[data-brand-intro]")).toHaveCount(0);
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("hard deadline releases Home when the asset request stalls", async ({ page }) => {
  await page.route("**/brand/wflyer-intro-master.svg", async () => {
    await new Promise<void>(() => undefined);
  });
  await page.goto("/?intro=1");
  await expect(page.locator("[data-brand-intro]")).toBeVisible();

  await expect(page.locator("[data-brand-intro]")).toHaveCount(0, {
    timeout: 8_500,
  });
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect.poll(() =>
    page.evaluate(() =>
      sessionStorage.getItem("wflyer.brand-intro.completed.v1"),
    ),
  ).toBe("1");
});

test("viewport changes fail open without leaving a page lock", async ({ page }) => {
  await page.goto("/?intro=1&introCheckpoint=1");
  await expect(page.locator("[data-brand-intro]")).toBeVisible();

  await page.setViewportSize({ height: 800, width: 1200 });

  await expect(page.locator("[data-brand-intro]")).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(page.getByRole("main")).toBeVisible();
});

test("handoff converges on the visible Home header pivot", async ({ page }) => {
  await page.goto("/?intro=1&introCheckpoint=1");
  await page.waitForFunction(
    () =>
      Boolean(
        (window as typeof window & { __wfBrandIntroTimeline?: unknown })
          .__wfBrandIntroTimeline,
      ),
  );
  const centers = await page.evaluate(() => {
    (
      window as typeof window & {
        __wfBrandIntroTimeline: { pause: (at: number) => void };
      }
    ).__wfBrandIntroTimeline.pause(4.84);
    const symbol = document.querySelector<SVGSVGElement>("[data-intro-symbol]")!;
    const pivot = Array.from(
      document.querySelectorAll<HTMLElement>("[data-home-pivot]"),
    ).find((candidate) => candidate.getBoundingClientRect().width > 0)!;
    const from = symbol.getBoundingClientRect();
    const to = pivot.getBoundingClientRect();
    return {
      symbol: { x: from.left + from.width / 2, y: from.top + from.height / 2 },
      target: { x: to.left + to.width / 2, y: to.top + to.height / 2 },
    };
  });

  expect(Math.abs(centers.symbol.x - centers.target.x)).toBeLessThan(8);
  expect(Math.abs(centers.symbol.y - centers.target.y)).toBeLessThan(8);
});
