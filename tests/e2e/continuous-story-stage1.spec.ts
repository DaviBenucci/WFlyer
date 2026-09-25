import { expect, test } from "@playwright/test";

const route = "/__visual-lab/story/motion";
const profiles = [
  { name: "owner Firefox-equivalent", width: 1366, height: 611, presentation: "COMPACT_LANDSCAPE" },
  { name: "owner Chromium-equivalent", width: 1366, height: 639, presentation: "COMPACT_LANDSCAPE" },
  { name: "1366 control", width: 1366, height: 768, presentation: "COMPACT_LANDSCAPE" },
  { name: "1440 desktop", width: 1440, height: 900, presentation: "COMPACT_LANDSCAPE" },
  { name: "large landscape", width: 1536, height: 900, presentation: "EXPANDED_LANDSCAPE" },
  { name: "tablet landscape", width: 1024, height: 768, presentation: "COMPACT_LANDSCAPE" },
  { name: "tablet portrait", width: 820, height: 1180, presentation: "PORTRAIT_TRAVERSE" },
  { name: "mobile portrait", width: 390, height: 844, presentation: "PORTRAIT_TRAVERSE" },
] as const;

for (const profile of profiles) {
  test(`${profile.name} keeps one reachable continuous score story`, async ({ page, browserName }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: profile.width, height: profile.height });
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const root = page.locator("main[data-motion-lab]:not([inert])");
    await expect(root).toHaveAttribute("data-motion-lifecycle", "mounted", { timeout: 30_000 });
    if (profile.name === "large landscape" || profile.name === "1440 desktop") {
      await expect.poll(async () => root.getAttribute("data-motion-projects-capacity"), {
        timeout: 45_000,
      }).toMatch(/^(PASS|INSUFFICIENT_CAPACITY|INVALID)$/u);
      await expect.poll(async () => {
        const status = await root.getAttribute("data-motion-projects-capacity");
        const currentMode = await root.getAttribute("data-projection-mode");
        return status === "PASS"
          ? currentMode === "horizontal-enhanced"
          : currentMode === "vertical-wide";
      }, { timeout: 45_000 }).toBe(true);
    }
    const mode = await root.getAttribute("data-projection-mode");
    const presentation = await root.getAttribute("data-story-presentation");
    if (mode === "horizontal-enhanced") {
      expect(presentation).toBe("EXPANDED_LANDSCAPE");
    } else {
      expect(presentation).toBe(profile.name === "large landscape"
        ? "COMPACT_LANDSCAPE"
        : profile.presentation);
    }
    if (profile.width === 1366 && profile.height < 640) {
      expect(mode).toBe("vertical-wide");
    }
    const layer = root.locator("[data-story-score-layer]");
    await expect(layer).toHaveAttribute("data-story-spatial-projection", "continuous-story");
    await expect(layer).toHaveAttribute("data-score-path-self-intersections", "0");
    await expect(layer).toHaveAttribute("data-score-staff-line-self-intersections", "0");
    await expect(layer).toHaveAttribute("data-score-connector-events", "0");
    const spatial = await layer.evaluate((element) => ({
      landmarks: JSON.parse(element.getAttribute("data-story-spatial-landmarks") ?? "[]") as Array<{
        chapterId: string;
        contentSpan: { start: number; end: number };
        entryAnchor: number;
        exitTransition: { start: number; end: number } | null;
        interactionSpans: Array<{ start: number; end: number }>;
        stations: Array<{ id: string; span: { start: number; end: number } }>;
        structuralStart: number;
      }>,
      camera: JSON.parse(element.getAttribute("data-story-spatial-camera") ?? "[]") as Array<{
        kind: string;
        from: { x: number; y: number };
        to: { x: number; y: number };
      }>,
    }));
    expect(spatial.landmarks.map(({ chapterId }) => chapterId)).toEqual([
      "home", "professional-about", "professional-services", "professional-process",
      "professional-projects", "professional-contact", "professional-terminal",
    ]);
    for (const [index, landmark] of spatial.landmarks.entries()) {
      expect(landmark.entryAnchor).toBeGreaterThan(landmark.structuralStart);
      expect(landmark.entryAnchor).toBeLessThan(landmark.contentSpan.end);
      expect(landmark.exitTransition?.end ?? landmark.contentSpan.end)
        .toBe(spatial.landmarks[index + 1]?.structuralStart ?? landmark.contentSpan.end);
      expect(landmark.stations.length).toBeGreaterThan(0);
    }
    expect(spatial.landmarks[5]?.interactionSpans.length).toBe(1);
    if (presentation === "PORTRAIT_TRAVERSE") {
      expect(spatial.camera.some(({ kind, from, to }) =>
        kind === "local-hold" && from.x === to.x && from.y < to.y)).toBe(true);
      const about = root.locator('[data-professional-scene="about"]');
      const intro = await about.locator('[data-score-content-exclusion="heading-and-body"]').boundingBox();
      const persona = await about.locator('[data-score-content-exclusion="persona-slot"]').boundingBox();
      expect(intro).not.toBeNull();
      expect(persona).not.toBeNull();
      expect(persona!.y).toBeGreaterThan(intro!.y);
    }
    const projects = root.locator('[data-professional-scene="projects"]');
    if (mode === "horizontal-enhanced") {
      await expect(projects.locator("[data-project-card-item]")).toHaveCount(3);
    } else {
      await expect(projects.locator("[data-project-teaser]")).toHaveCount(1);
      await expect(projects.locator("[data-project-card-item]")).toHaveCount(0);
    }
    expect(await page.evaluate(() =>
      document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

    if (mode !== "horizontal-enhanced") {
      for (const chapterId of spatial.landmarks.map(({ chapterId }) => chapterId)) {
        const heading = root.locator(`[data-chapter-id="${chapterId}"] h2`).first();
        await heading.scrollIntoViewIfNeeded();
        const bounds = await heading.boundingBox();
        expect(bounds, chapterId).not.toBeNull();
        expect(bounds!.y + bounds!.height, chapterId).toBeGreaterThan(0);
        expect(bounds!.y, chapterId).toBeLessThan(profile.height);
      }
      const input = root.locator('[data-professional-scene="contact"] input').first();
      await input.focus();
      await input.scrollIntoViewIfNeeded();
      const bounds = await input.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.y).toBeGreaterThanOrEqual(0);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(profile.height);
      for (const selector of [
        '[data-professional-scene="about"] [data-score-content-exclusion="persona-slot"]',
        '[data-professional-scene="services"] [data-service-module]',
        '[data-professional-scene="process"] [data-process-stage]',
        '[data-professional-scene="projects"] [data-project-teaser]',
        '[data-professional-scene="contact"] textarea',
        '[data-professional-scene="contact"] button[type="submit"]',
      ]) {
        for (const station of await root.locator(selector).all()) {
          await station.scrollIntoViewIfNeeded();
          const box = await station.boundingBox();
          expect(box, selector).not.toBeNull();
          expect(box!.y + box!.height, selector).toBeGreaterThan(0);
          expect(box!.y, selector).toBeLessThan(profile.height);
        }
      }
    } else {
      const targets = [
        ...spatial.landmarks.map(({ chapterId }) => `[data-chapter-id="${chapterId}"] h2`),
        '[data-professional-scene="projects"] [data-project-card-item]',
        '[data-professional-scene="contact"] input',
        '[data-professional-scene="contact"] textarea',
        '[data-professional-scene="contact"] button[type="submit"]',
      ];
      for (const selector of targets) {
        const elements = await root.locator(selector).all();
        for (const [index, target] of elements.entries()) {
          await page.evaluate(({ selector, index }) => {
            const stage = document.querySelector<HTMLElement>("[data-motion-stage]")!;
            const track = document.querySelector<HTMLElement>("[data-motion-track]")!;
            const target = document.querySelectorAll<HTMLElement>(selector)[index]!;
            const stageTop = stage.parentElement!.getBoundingClientRect().top + window.scrollY;
            const localX = target.getBoundingClientRect().left - track.getBoundingClientRect().left;
            const travel = Math.max(0, track.scrollWidth - stage.clientWidth);
            window.scrollTo(0, stageTop + Math.min(travel, Math.max(0, localX - stage.clientWidth / 3)));
          }, { selector, index });
          await expect.poll(async () => {
            const box = await target.boundingBox();
            return box !== null && box.x < profile.width && box.x + box.width > 0;
          }).toBe(true);
        }
      }
      const input = root.locator('[data-professional-scene="contact"] input').first();
      await input.focus();
      const bounds = await input.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(profile.width);
      expect(bounds!.y).toBeGreaterThanOrEqual(0);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(profile.height);
    }
    if (browserName === "chromium" && profile.name === "large landscape") {
      await expect(root).toHaveAttribute("data-motion-projects-capacity", "PASS");
      await expect(root).toHaveAttribute("data-projection-mode", "horizontal-enhanced");
    }
  });
}
