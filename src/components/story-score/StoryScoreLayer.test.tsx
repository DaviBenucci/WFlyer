import { act, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";

const testSpies = vi.hoisted(() => ({
  projectionBuild: vi.fn(),
  scoreRender: vi.fn(),
  candidateCountDelta: 0,
}));

vi.mock("@/lib/story/score/projection", async (importOriginal) => {
  const actual = await importOriginal<
    typeof import("@/lib/story/score/projection")
  >();

  return {
    ...actual,
    buildStoryScoreProjection: (
      ...args: Parameters<typeof actual.buildStoryScoreProjection>
    ) => {
      testSpies.projectionBuild();
      const projection = actual.buildStoryScoreProjection(...args);
      return {
        ...projection,
        branches: {
          ...projection.branches,
          professional: {
            ...projection.branches.professional,
            eventSafety: { ...projection.branches.professional.eventSafety,
              candidateCount: projection.branches.professional.eventSafety.candidateCount + testSpies.candidateCountDelta },
          },
        },
      };
    },
  };
});

vi.mock("@/components/score/ScoreSvg", () => ({
  ScoreSvg: () => {
    testSpies.scoreRender();
    return <svg aria-hidden="true" />;
  },
}));

import { StoryScoreLayer } from "./StoryScoreLayer";

class TestResizeObserver {
  disconnect = vi.fn();
  observe = vi.fn();
  unobserve = vi.fn();
}

describe("StoryScoreLayer measurement lifecycle", () => {
  beforeEach(() => {
    testSpies.projectionBuild.mockClear();
    testSpies.scoreRender.mockClear();
    testSpies.candidateCountDelta = 0;
    vi.stubGlobal("ResizeObserver", TestResizeObserver);
    vi.stubGlobal("innerHeight", 900);
    vi.stubGlobal("innerWidth", 1_536);
  });

  afterEach(() => {
    testSpies.candidateCountDelta = 0;
    vi.unstubAllGlobals();
  });

  it("hydrates equal canonical metadata when only internal search effort differs", async () => {
    vi.stubGlobal("innerWidth", 1440);
    const view = <main data-projection-mode="static" data-story-v2=""><div data-motion-track=""><StoryScoreLayer /></div></main>;
    const container = document.createElement("div");
    container.innerHTML = renderToString(view);
    document.body.append(container);
    const server = container.querySelector('[data-score-branch="professional"]')!;
    const serverMetadata = server.getAttribute("data-score-event-safety");
    expect(JSON.parse(serverMetadata!)).not.toHaveProperty("candidateCount");
    expect(server.hasAttribute("data-score-candidate-count")).toBe(false);
    // Reproduce the observed count discrepancy without changing any semantic
    // or raw geometric input. The real engines are covered by Playwright.
    testSpies.candidateCountDelta = -4;
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const onRecoverableError = vi.fn();
    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => { root = hydrateRoot(container, view, { onRecoverableError }); });
    expect(server.getAttribute("data-score-event-safety")).toBe(serverMetadata);
    expect(server).toHaveAttribute("data-score-candidate-count", "17216");
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
    await act(async () => root!.unmount());
    container.remove();
  });

  it("does not measure, reproject, recompose, or rerender during ordinary scroll", async () => {
    const rectSpy = vi
      .spyOn(Element.prototype, "getBoundingClientRect")
      .mockImplementation(function getTestRect(this: Element) {
        if (this instanceof HTMLElement && this.dataset.storyV2 !== undefined) {
          return new DOMRect(0, 0, 1_536, 900);
        }
        if (
          this instanceof HTMLElement &&
          this.dataset.motionTrack !== undefined
        ) {
          return new DOMRect(-2_000, 64, 20_000, 900);
        }
        if (
          this instanceof HTMLElement &&
          this.dataset.scoreContentExclusion !== undefined
        ) {
          return new DOMRect(320, 180, 480, 260);
        }
        return new DOMRect(0, 0, 0, 0);
      });
    const { container } = render(
      <main data-projection-mode="horizontal-enhanced" data-story-v2="">
        <div data-motion-track="">
          <section data-chapter-id="professional-services">
            <div data-score-content-exclusion="services-modules" />
          </section>
          <StoryScoreLayer />
        </div>
      </main>,
    );

    await waitFor(() =>
      expect(
        container.querySelector("[data-story-score-layer]"),
      ).toHaveAttribute("data-score-projection", "horizontal-enhanced"),
    );

    const beforeScroll = {
      composerInvocations: container
        .querySelector<HTMLElement>("[data-story-score-layer]")
        ?.dataset.scoreComposerInvocations,
      measurements: rectSpy.mock.calls.length,
      projections: testSpies.projectionBuild.mock.calls.length,
      scoreRenders: testSpies.scoreRender.mock.calls.length,
    };

    act(() => window.dispatchEvent(new Event("scroll")));
    await Promise.resolve();

    expect(rectSpy.mock.calls).toHaveLength(beforeScroll.measurements);
    expect(testSpies.projectionBuild.mock.calls).toHaveLength(
      beforeScroll.projections,
    );
    expect(testSpies.scoreRender.mock.calls).toHaveLength(
      beforeScroll.scoreRenders,
    );
    expect(
      container.querySelector<HTMLElement>("[data-story-score-layer]")
        ?.dataset.scoreComposerInvocations,
    ).toBe(beforeScroll.composerInvocations);
    expect(beforeScroll.composerInvocations).toBe("1");
  });
});
