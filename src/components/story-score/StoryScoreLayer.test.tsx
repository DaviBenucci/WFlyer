import { act, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const testSpies = vi.hoisted(() => ({
  projectionBuild: vi.fn(),
  scoreRender: vi.fn(),
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
      return actual.buildStoryScoreProjection(...args);
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
    vi.stubGlobal("ResizeObserver", TestResizeObserver);
    vi.stubGlobal("innerHeight", 900);
    vi.stubGlobal("innerWidth", 1_536);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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
          <section data-chapter-id="application-demo">
            <div data-score-content-exclusion="application-tablet-demo" />
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
    expect(beforeScroll.composerInvocations).toBe("2");
  });
});
