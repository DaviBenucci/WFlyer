import { expect, test } from "@playwright/test";
import type { EventSafePlacementDiagnostics } from "@/lib/story/score/event-safe-placement";
import type { StoryScoreBranchProjection } from "@/lib/story/score/projection";
import { buildStoryScoreProjection } from "@/lib/story/score/projection";
import { inspectProjects, inspectRenderedGeometry, observeRuntime, requireCleanRuntime, strictIntersections } from "./helpers/assembly-stage1-audit";

// This covers only browser DOM-to-SVG coordinate quantization. Projection and
// intersection calculations below retain their full-precision guards.
const renderedFootprintCoordinateTolerance = 0.03;

const states = [
  { width: 1440, height: 900, mode: "capacity-selected" },
  { width: 1536, height: 900, mode: "capacity-selected" },
  { width: 1920, height: 917, mode: "capacity-selected" },
  { width: 1100, height: 640, mode: "capacity-selected" },
  { width: 900, height: 1024, mode: "vertical-wide" },
  { width: 390, height: 844, mode: "vertical-compact" },
  { width: 1440, height: 900, mode: "static" },
] as const;

const capacitySelectedModes = {
  chromium: {
    1100: "vertical-wide",
    1440: "horizontal-enhanced",
    1536: "horizontal-enhanced",
    1920: "vertical-wide",
  },
  firefox: {
    1100: "vertical-wide",
    1440: "vertical-wide",
    1536: "vertical-wide",
    1920: "vertical-wide",
  },
  webkit: {
    1100: "vertical-wide",
    1440: "horizontal-enhanced",
    1536: "horizontal-enhanced",
    1920: "vertical-wide",
  },
} as const;

for (const state of states) {
  test(`Stage-1 complete footprints and Home entries ${state.width}x${state.height} ${state.mode}`, async ({ browserName, page }, testInfo) => {
    const expectedMode =
      state.mode === "capacity-selected"
        ? capacitySelectedModes[browserName][state.width]
        : state.mode;
    const runtime = observeRuntime(page);
    await page.setViewportSize({ width: state.width, height: state.height });
    await page.emulateMedia({ reducedMotion: expectedMode === "static" ? "reduce" : "no-preference", colorScheme: "dark" });
    await page.goto("/__visual-lab/story/motion", { waitUntil: "domcontentloaded" });
    const activeRoot = page.locator("main[data-motion-lab]:not([inert])");
    await expect.poll(async () => {
      if (await page.getByRole("heading", { name: "Algo não saiu como esperado" }).isVisible()) {
        await page.getByRole("button", { name: "Open issues overlay" }).click();
        const failure = await page.locator("nextjs-portal").evaluateAll((portals) => portals.map((portal) =>
          Array.from(portal.shadowRoot?.querySelectorAll("[data-nextjs-dialog-body], [data-nextjs-error-message]") ?? []).map((element) => element.textContent).join("\n")).join("\n"));
        throw new Error(failure || "The scene reached its error boundary.");
      }
      requireCleanRuntime(runtime.snapshot());
      return activeRoot.getAttribute("data-motion-lifecycle");
    }, { timeout: 30_000 }).toBe("mounted");
    if (state.mode === "capacity-selected") {
      await expect(activeRoot).toHaveAttribute(
        "data-motion-projects-capacity",
        /^(?:PASS|INSUFFICIENT_CAPACITY)$/u,
        { timeout: 30_000 },
      );
    }
    await page.evaluate(async () => { await document.fonts.ready; await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))); });
    const layer = page.locator("[data-story-score-layer]");
    await expect(layer).toHaveAttribute("data-score-projection", expectedMode, { timeout: 20_000 });
    const runtimeBeforeGeometry = runtime.snapshot();
    requireCleanRuntime(runtimeBeforeGeometry);
    const geometry = await inspectRenderedGeometry(page);
    const replay = buildStoryScoreProjection(geometry.replayInput.mode, geometry.replayInput.options);
    const centerPaths = Object.values(replay.branches).map((branch) => {
      const points = Array.from({ length: 2049 }, (_, index) => branch.path.pointAt(index / 2048));
      return { branch: branch.branch, points, crossings: strictIntersections(points) };
    });
    const projects = await inspectProjects(page, geometry);
    const runtimeAfterGeometry = runtime.snapshot();
    await testInfo.attach("stage-1-independent-rendered-geometry", {
      body: JSON.stringify({ state, geometry, centerPaths, projects, runtimeBeforeGeometry, runtimeAfterGeometry }, null, 2),
      contentType: "application/json",
    });
    requireCleanRuntime(runtimeAfterGeometry);
    expect(geometry.staffIntersectionCount, "all original rendered staff segments, including cross-run pairs").toBe(0);
    expect(centerPaths.flatMap(({ crossings }) => crossings), "2049-sample center paths replayed from the actual DOM geometry inputs").toEqual([]);
    expect(projects.cards).toHaveLength(3);
    if (expectedMode === "horizontal-enhanced") {
      expect(projects.visits).toHaveLength(3);
      expect(new Set(projects.visits.map(({ projectIndex }) => projectIndex)).size).toBe(3);
      for (const visit of projects.visits) {
        expect(visit.measurementSource).toBe("dom-measured");
        expect(visit.classification).toBe("CLEAR");
        expect(visit.minimumClearance).toBeGreaterThanOrEqual(12);
        expect(visit.distanceFromRenderedCenter).toBeLessThanOrEqual(1);
        expect(visit.notationSafe).toBe(true);
      }
    }
    // Retain the existing attributes as supplemental telemetry only; the
    // complete DOM/replayed center validators above own the global gate.
    await expect(layer).toHaveAttribute("data-score-path-self-intersections", "0");
    await expect(layer).toHaveAttribute("data-score-staff-line-self-intersections", "0");
    const branches = await page.locator("[data-score-branch]").evaluateAll((owners) => owners.map((owner) => ({
      branch: owner.getAttribute("data-score-branch")!,
      safety: JSON.parse(owner.getAttribute("data-score-event-safety")!) as EventSafePlacementDiagnostics,
      entry: JSON.parse(owner.getAttribute("data-score-home-entry")!) as StoryScoreBranchProjection["homeEntry"],
      ids: Array.from(owner.querySelectorAll("[data-score-primitive-id]")).map((element) => element.getAttribute("data-score-primitive-id")!),
      noteheads: owner.querySelectorAll('[data-score-role="notehead"]').length,
      footprints: (() => {
        const safety = JSON.parse(owner.getAttribute("data-score-event-safety")!) as EventSafePlacementDiagnostics;
        const matrix = owner.querySelector("svg")!.getScreenCTM()!.inverse();
        return safety.groups.map(({ slotId }) => {
          const primitives = Array.from(owner.querySelectorAll<SVGGraphicsElement>("[data-score-primitive-id]"))
            .filter((element) => element.getAttribute("data-score-primitive-id")!.startsWith(`wf-${slotId}:`));
          const points = primitives.flatMap((element) => {
            const rect = element.getBoundingClientRect();
            return [rect.left, rect.right].flatMap((x) => [rect.top, rect.bottom].map((y) => new DOMPoint(x, y).matrixTransform(matrix)));
          });
          return { slotId, primitiveCount: primitives.length,
            left: Math.min(...points.map(({ x }) => x)), right: Math.max(...points.map(({ x }) => x)),
            top: Math.min(...points.map(({ y }) => y)), bottom: Math.max(...points.map(({ y }) => y)) };
        });
      })(),
    })));
    expect(branches.map(({ branch }) => branch)).toEqual(["professional"]);
    for (const { branch, safety, entry, ids, noteheads, footprints } of branches) {
      expect(safety.forbiddenEventCount).toBe(0);
      expect(safety.maximumTangentAngleDeg).toBeLessThanOrEqual(18);
      expect(safety.maximumTangentVariationDeg).toBeLessThanOrEqual(6);
      expect(safety.groups.reduce((count, group) => count + group.eventCount, 0)).toBe(safety.eventCount);
      expect(noteheads).toBe(safety.eventCount);
      expect(new Set(ids).size).toBe(ids.length);
      expect(new Set(safety.groups.map(({ slotId }) => slotId)).size).toBe(safety.groups.length);
      expect(entry.t).toBeGreaterThan(0);
      expect(entry.t).toBeLessThan(entry.eventFreeLeadIn.endT);
      for (const [index, group] of safety.groups.entries()) {
        const shelf = safety.shelves[group.shelfIndex]!;
        const footprint = footprints[index]!;
        expect(footprint.slotId).toBe(group.slotId);
        expect(footprint.primitiveCount).toBeGreaterThan(0);
        expect(footprint.left).toBeGreaterThanOrEqual(group.footprintBounds.left - renderedFootprintCoordinateTolerance);
        expect(footprint.right).toBeLessThanOrEqual(group.footprintBounds.right + renderedFootprintCoordinateTolerance);
        expect(footprint.top).toBeGreaterThanOrEqual(group.footprintBounds.top - renderedFootprintCoordinateTolerance);
        expect(footprint.bottom).toBeLessThanOrEqual(group.footprintBounds.bottom + renderedFootprintCoordinateTolerance);
        expect(shelf.classification).toBe("EVENT_SAFE_STRAIGHT");
        expect(group.marginStartT).toBeGreaterThanOrEqual(shelf.startT - 1e-6);
        expect(group.marginEndT).toBeLessThanOrEqual(shelf.endT + 1e-6);
        expect(group.clearanceBefore).toBeGreaterThanOrEqual(1.5 * safety.staffSpace - 1e-6);
        expect(group.clearanceAfter).toBeGreaterThanOrEqual(1.5 * safety.staffSpace - 1e-6);
        expect(group.marginStartT).toBeGreaterThanOrEqual(entry.eventFreeLeadIn.endT - 1e-6);
        if (index) expect(group.marginStartT).toBeGreaterThanOrEqual(safety.groups[index - 1]!.marginEndT - 1e-6);
      }
      expect(safety.relocations.every(({ semanticOrderPreserved }) => semanticOrderPreserved)).toBe(true);
      await expect(layer).toHaveAttribute(`data-score-${branch}-fingerprint`, "fnv1a32:039bce10");
    }
    requireCleanRuntime(runtime.snapshot());
    await testInfo.attach("stage-1-event-and-entry-diagnostics", { body: JSON.stringify({ state, branches, runtime: runtime.snapshot() }, null, 2), contentType: "application/json" });
  });
}
