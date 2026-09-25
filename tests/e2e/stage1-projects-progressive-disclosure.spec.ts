import { expect, test } from "@playwright/test";

const motionRoute = "/__visual-lab/story/motion#projetos";

for (const profile of [
  { name: "owner Firefox height", width: 1366, height: 611, mode: "vertical-wide" },
  { name: "owner Chromium height", width: 1366, height: 639, mode: "vertical-wide" },
  { name: "mobile", width: 390, height: 844, mode: "vertical-compact" },
] as const) {
  test(`${profile.name} has one Projects teaser without fan DOM`, async ({ page }) => {
    await page.setViewportSize({ width: profile.width, height: profile.height });
    await page.goto(motionRoute);
    const root = page.locator("[data-motion-lab]");
    await expect(root).toHaveAttribute("data-projection-mode", profile.mode);
    await expect(root.locator("[data-project-teaser]")).toHaveCount(1);
    await expect(root.locator("[data-project-card-fan], [data-project-card-item], [data-project-card-link]")).toHaveCount(0);
    await expect(root.locator("[data-project-teaser] h3")).toHaveText("W_Flyer");
    const teaser = root.locator("[data-project-teaser]");
    await expect(teaser.locator("a, button, [tabindex]")).toHaveCount(0);
    await teaser.scrollIntoViewIfNeeded();
    const teaserBounds = await teaser.boundingBox();
    const headerBounds = await page.locator("header[data-story-v2-header]").boundingBox();
    expect(teaserBounds).not.toBeNull();
    expect(headerBounds).not.toBeNull();
    expect(teaserBounds!.y).toBeGreaterThanOrEqual(headerBounds!.y + headerBounds!.height);
    expect(teaserBounds!.y + teaserBounds!.height).toBeLessThanOrEqual(profile.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    await expect(page.locator("[data-projects-capacity-host]")).toHaveCount(0);
  });
}

test("horizontal fan is active only when the canonical candidate passes", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 1536, height: 900 });
  await page.goto(motionRoute);
  const root = page.locator("[data-motion-lab]");
  if (browserName === "firefox") {
    await expect(root).toHaveAttribute("data-motion-projects-capacity", "INSUFFICIENT_CAPACITY", { timeout: 30_000 });
    await expect(root).toHaveAttribute("data-motion-projects-capacity-reasons", /projects-protected-clearance-or-clip/u);
    await expect(root).toHaveAttribute("data-projection-mode", "vertical-wide");
    await expect(root.locator("[data-project-card-item]")).toHaveCount(0);
    await expect(root.locator("[data-project-teaser]")).toHaveCount(1);
    return;
  }
  await expect(root).toHaveAttribute("data-motion-projects-capacity", "PASS", { timeout: 30_000 });
  await expect(root).toHaveAttribute("data-projection-mode", "horizontal-enhanced");
  await expect(root.locator("[data-project-card-item]")).toHaveCount(3);
  await expect(root.locator("[data-project-teaser]")).toHaveCount(0);
  await expect(root.locator("[data-score-project-visit-card]")).toHaveCount(3);
});
