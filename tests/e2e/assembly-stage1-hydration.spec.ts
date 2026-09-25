import { expect, test } from "@playwright/test";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { runInThisContext } from "node:vm";
import type { snapshotStage1Projection } from "../helpers/assembly-stage1-determinism";
import { STORY_SCORE_PROJECTION_MODES } from "@/lib/story/score/projection";
import { isDevelopmentCspReport } from "./helpers/assembly-stage1-audit";

const requireFromProject = createRequire(resolve("package.json"));
const { JSDOM } = requireFromProject("jsdom") as {
  JSDOM: new (html: string) => { window: { document: Document } };
};
const esbuild = createRequire(requireFromProject.resolve("vite"))("esbuild") as {
  build(options: Record<string, unknown>): Promise<{ outputFiles: { text: string }[] }>;
};

test.describe("Stage-1 numerical determinism and initial hydration", () => {
  test("keeps semantic allocation, canonical geometry and SVG identical to Node", async ({ page }, testInfo) => {
    test.setTimeout(120_000);
    const bundle = await esbuild.build({
      stdin: {
        contents: 'import { snapshotStage1Projection } from "./tests/helpers/assembly-stage1-determinism"; globalThis.__stage1ProjectionSnapshot = snapshotStage1Projection;',
        resolveDir: process.cwd(), loader: "ts",
      },
      bundle: true, platform: "browser", format: "iife", write: false,
      loader: { ".svg": "dataurl" },
      alias: { "@": resolve("src") }, define: { "process.env.NODE_ENV": '"production"' },
      plugins: [{ name: "geometry-only-css", setup(build: {
        onLoad(filter: { filter: RegExp }, callback: () => { contents: string; loader: string }): void;
      }) {
        build.onLoad({ filter: /\.module\.css$/ }, () => ({ contents: "export default {}", loader: "js" }));
      } }],
    });
    runInThisContext(bundle.outputFiles[0]!.text);
    const nodeProbe = (globalThis as typeof globalThis & {
      __stage1ProjectionSnapshot: typeof snapshotStage1Projection;
    }).__stage1ProjectionSnapshot;
    await page.goto("about:blank");
    await page.addScriptTag({ content: bundle.outputFiles[0]!.text });
    const results = [];
    for (const mode of STORY_SCORE_PROJECTION_MODES) {
      const node = nodeProbe(mode);
      const client = await page.evaluate(mode => {
        const probe = globalThis as typeof globalThis & { __stage1ProjectionSnapshot: typeof snapshotStage1Projection };
        return probe.__stage1ProjectionSnapshot(mode);
      }, mode);
      expect(client.fingerprints).toEqual({ professional: "fnv1a32:039bce10" });
      expect(client.fingerprints).toEqual(node.fingerprints);
      for (const branch of ["professional"]) {
        const serverBranch = node.branches[branch]!;
        const browserBranch = client.branches[branch]!;
        expect(browserBranch.semantic, `${mode}/${branch}: semantics`).toEqual(serverBranch.semantic);
        expect(browserBranch.semantic.rejectedGroups).toEqual([]);
        expect(browserBranch.canonicalSafety, `${mode}/${branch}: canonical safety`).toBe(serverBranch.canonicalSafety);
        expect(browserBranch.canonicalModel, `${mode}/${branch}: canonical geometry`).toBe(serverBranch.canonicalModel);
        // CSS is excluded only from this pure geometric comparison; the live
        // hydration case below renders the complete application with its CSS.
        const withoutClass = (svg: string) => svg.replace(/ class="[^"]*"/gu, "");
        expect(withoutClass(browserBranch.svg), `${mode}/${branch}: actual SVG`).toBe(withoutClass(serverBranch.svg));
        expect(browserBranch.safetyFailures).toEqual([]);
        expect(serverBranch.safetyFailures).toEqual([]);
        expect(browserBranch.forbiddenEventCount).toBe(0);
        expect(JSON.parse(browserBranch.canonicalSafety)).not.toHaveProperty("candidateCount");
        const maximumRawCoordinateDelta = Math.max(0, ...serverBranch.rawCenters.flatMap((note, index) => {
          const other = browserBranch.rawCenters[index]!;
          return [Math.abs(note.x - other.x), Math.abs(note.y - other.y)];
        }));
        results.push({ mode, branch, nodeCandidateCount: serverBranch.candidateCount,
          browserCandidateCount: browserBranch.candidateCount, maximumRawCoordinateDelta,
          semanticEqual: true, canonicalModelEqual: true, canonicalSafetyEqual: true, svgEqual: true });
      }
    }
    await testInfo.attach("numerical-determinism", { body: JSON.stringify(results, null, 2), contentType: "application/json" });
  });

  test("matches SSR metadata on the first render and reprojects after hydration", async ({ browserName, page }, testInfo) => {
    test.setTimeout(120_000);
    const consoleMessages: { type: string; text: string }[] = [];
    const pageErrors: string[] = [];
    page.on("console", message => {
      if (["error", "warning"].includes(message.type())) consoleMessages.push({ type: message.type(), text: message.text() });
    });
    page.on("pageerror", error => pageErrors.push(error.message));
    await page.addInitScript(() => {
      const original = JSON.stringify;
      const probe = window as typeof window & { __stage1InitialSafety: { value: string; stack: string | undefined }[] };
      probe.__stage1InitialSafety = [];
      JSON.stringify = function (...args: Parameters<typeof JSON.stringify>) {
        const value = original.apply(JSON, args);
        const input = args[0] as { shelves?: unknown; groups?: unknown } | null;
        if (input && Array.isArray(input.shelves) && Array.isArray(input.groups)) {
          probe.__stage1InitialSafety.push({ value, stack: new Error().stack });
        }
        return value;
      } as typeof JSON.stringify;
    });
    await page.setViewportSize({ width: 1440, height: 900 });
    const response = await page.goto("/__visual-lab/story/motion");
    expect(response?.ok()).toBe(true);
    const serverDocument = new JSDOM(await response!.text()).window.document;
    const serverBranches = Array.from(serverDocument.querySelectorAll("[data-score-branch]"));
    expect(serverBranches).toHaveLength(1);
    const ssr = serverBranches.map(element => {
      expect(element.hasAttribute("data-score-candidate-count")).toBe(false);
      return { branch: element.getAttribute("data-score-branch"), value: element.getAttribute("data-score-event-safety") };
    });
    await expect(page.locator("[data-story-score-layer]")).toHaveAttribute(
      "data-score-projection",
      browserName === "firefox" ? "vertical-wide" : "horizontal-enhanced",
      { timeout: 30_000 },
    );
    const initial = await page.evaluate((branchCount) => (window as typeof window & {
      __stage1InitialSafety: { value: string; stack: string | undefined }[];
    }).__stage1InitialSafety.slice(0, branchCount), serverBranches.length);
    expect(initial).toHaveLength(serverBranches.length);
    ssr.forEach((server, index) => {
      expect(initial[index]!.stack).toContain("StoryScoreLayer");
      expect(initial[index]!.value).toBe(server.value);
      expect(JSON.parse(server.value!)).not.toHaveProperty("candidateCount");
    });
    for (const branch of ["professional"]) {
      await expect(page.locator(`[data-score-branch="${branch}"]`)).toHaveAttribute("data-score-candidate-count", /^[1-9]\d*$/u);
    }
    await page.setViewportSize({ width: 414, height: 900 });
    await expect(page.locator("[data-story-score-layer]")).toHaveAttribute("data-score-projection", "vertical-compact", { timeout: 30_000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator("[data-story-score-layer]")).toHaveAttribute("data-score-projection", "static", { timeout: 30_000 });
    await expect(page.locator("[data-story-score-layer]")).toHaveAttribute("data-score-professional-fingerprint", "fnv1a32:039bce10");
    const hydrationMessages = consoleMessages.filter(({ text }) => /hydrat|did not match|Minified React error #(418|423|425)/iu.test(text));
    const relevantConsoleErrors = consoleMessages.filter(({ type, text }) => type === "error" && !isDevelopmentCspReport(text));
    await testInfo.attach("hydration-diagnostics", { body: JSON.stringify({ ssr, initial, consoleMessages, relevantConsoleErrors, hydrationMessages, pageErrors }, null, 2), contentType: "application/json" });
    expect(hydrationMessages).toEqual([]);
    expect(relevantConsoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });
});
