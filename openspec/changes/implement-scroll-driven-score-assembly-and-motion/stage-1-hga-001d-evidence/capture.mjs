import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium, firefox } from "playwright";

const evidenceDir = path.dirname(fileURLToPath(import.meta.url));
const repoDir = path.resolve(evidenceDir, "../../../..");
const baseURL = "http://127.0.0.1:43139";
const cases = [
  { id: "HGA001D-01", browser: "firefox", width: 1366, height: 611, mode: "vertical-wide", teaser: 1, fan: 0 },
  { id: "HGA001D-02", browser: "chromium", width: 1366, height: 639, mode: "vertical-wide", teaser: 1, fan: 0 },
  { id: "HGA001D-03", browser: "chromium", width: 390, height: 844, mode: "vertical-compact", teaser: 1, fan: 0 },
  { id: "HGA001D-04", browser: "chromium", width: 1536, height: 900, mode: "horizontal-enhanced", teaser: 0, fan: 3 },
];

const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", "43139"], {
  cwd: repoDir,
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: "1",
    WFLYER_DEPLOYMENT_ENVIRONMENT: "production",
    WFLYER_TRANSITION_TEST_MODE: "1",
  },
  stdio: "ignore",
});

async function waitForServer() {
  for (let attempt = 0; attempt < 90; attempt += 1) {
    try {
      const response = await fetch(baseURL);
      if (response.ok) return;
    } catch { /* server is still starting */ }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error("Motion Lab evidence server did not become ready");
}

const browserCache = new Map();
try {
  await waitForServer();
  await mkdir(path.join(evidenceDir, "screenshots"), { recursive: true });
  const results = [];
  for (const item of cases) {
    let browser = browserCache.get(item.browser);
    if (!browser) {
      browser = await (item.browser === "firefox" ? firefox : chromium).launch();
      browserCache.set(item.browser, browser);
    }
    const context = await browser.newContext({
      viewport: { width: item.width, height: item.height },
      locale: "pt-BR",
      reducedMotion: "no-preference",
    });
    try {
      const page = await context.newPage();
      const response = await page.goto(`${baseURL}/__visual-lab/story/motion#projetos`, { waitUntil: "domcontentloaded" });
      if (!response?.ok()) throw new Error(`${item.id}: Motion Lab returned ${response?.status()}`);
      const root = page.locator("main[data-motion-lab]");
      await page.waitForFunction(() => document.querySelector("[data-story-bootstrap]")?.getAttribute("data-bootstrap-state") === "REVEALED");
      await page.waitForFunction((mode) => document.querySelector("main[data-motion-lab]")?.getAttribute("data-projection-mode") === mode, item.mode);
      const target = root.locator(item.teaser ? "[data-project-teaser]" : "[data-project-card-fan]");
      await target.scrollIntoViewIfNeeded();
      await page.evaluate(async () => {
        await document.fonts.ready;
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      });
      const state = await root.evaluate((element) => ({
        mode: element.dataset.projectionMode,
        presentation: element.dataset.storyPresentation,
        capacity: element.dataset.motionProjectsCapacity ?? null,
        projectionReason: element.dataset.projectionReason ?? null,
        teaserCount: element.querySelectorAll("[data-project-teaser]").length,
        fanCardCount: element.querySelectorAll("[data-project-card-item]").length,
        fanFocusableCount: element.querySelectorAll("[data-project-card-link]").length,
        teaserHeight: element.querySelector("[data-project-teaser]")?.getBoundingClientRect().height ?? null,
        fanHeight: element.querySelector("[data-project-card-fan]")?.getBoundingClientRect().height ?? null,
        projectsSceneHeight: element.querySelector('[data-professional-scene="projects"]')?.getBoundingClientRect().height ?? null,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      }));
      if (state.mode !== item.mode || state.teaserCount !== item.teaser || state.fanCardCount !== item.fan || state.overflow) {
        throw new Error(`${item.id}: unexpected stable state ${JSON.stringify(state)}`);
      }
      const screenshot = `${item.id.toLowerCase()}-${item.browser}-${item.width}x${item.height}.png`;
      const bytes = await page.screenshot({ path: path.join(evidenceDir, "screenshots", screenshot), fullPage: false });
      results.push({
        evidence_id: item.id,
        browser: item.browser,
        viewport_width: item.width,
        viewport_height: item.height,
        route: "/__visual-lab/story/motion#projetos",
        chapter: "professional-projects",
        responsive_mode: state.mode,
        presentation_class: state.presentation,
        projects_capacity_result: state.capacity,
        safe_fallback: state.projectionReason === "insufficient-layout-capacity" || state.projectionReason === "insufficient-capacity",
        motion_preference: "no-preference",
        ...state,
        screenshot,
        sha256: createHash("sha256").update(bytes).digest("hex"),
      });
    } finally {
      await context.close();
    }
  }
  await writeFile(path.join(evidenceDir, "manifest.json"), `${JSON.stringify(results, null, 2)}\n`);
} finally {
  await Promise.all([...browserCache.values()].map((browser) => browser.close()));
  server.kill("SIGTERM");
}
