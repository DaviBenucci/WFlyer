import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  STORY_BOOTSTRAP_SESSION_KEY,
  type StoryPositioningAdapter,
} from "@/lib/story/bootstrap";

import { StoryBootstrapExperience } from "./StoryBootstrapExperience";

function storyDocument() {
  return (
    <main data-story-v2="phase-2" id="main-content" tabIndex={-1}>
      <section data-chapter-id="home">Home</section>
      <section data-chapter-id="professional-about">Sobre</section>
      <section data-chapter-id="professional-projects">Projetos</section>
    </main>
  );
}

function createAdapter() {
  const position = vi.fn<StoryPositioningAdapter["position"]>(
    async (chapterId) => ({
      fallbackToHome: false,
      positionedChapterId: chapterId,
      projectionMode: "static",
      requestedChapterId: chapterId,
    }),
  );

  return {
    adapter: { projectionMode: "static", position } satisfies StoryPositioningAdapter,
    position,
  };
}

const IMMEDIATE_TIMING = {
  FIRST_ELIGIBLE_REVEAL: 0,
  HARD_FAIL_OPEN: 100,
  REDUCED_MOTION: 0,
  REVEAL: 0,
  SESSION_REPEAT: 0,
} as const;

function bootstrapRoot(): HTMLElement {
  const root = document.querySelector<HTMLElement>("[data-story-bootstrap]");
  if (root === null) throw new Error("Bootstrap root was not rendered.");
  return root;
}

async function expectTerminalState(state: "REVEALED" | "DEGRADED") {
  await waitFor(() => {
    expect(bootstrapRoot()).toHaveAttribute("data-bootstrap-state", state);
  });
}

describe("StoryBootstrapExperience", () => {
  beforeEach(() => {
    sessionStorage.clear();
    window.history.replaceState(
      {},
      "",
      "/__visual-lab/story/bootstrap",
    );
    document.documentElement.removeAttribute("data-story-bootstrap-active");
    document.body.style.removeProperty("overflow");
  });

  afterEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
    document.documentElement.removeAttribute("data-story-bootstrap-active");
    document.body.style.removeProperty("overflow");
    delete window.__WFLYER_PHASE4_BOOTSTRAP__;
  });

  it("resolves Home, positions before reveal, and enriches only the current history entry", async () => {
    const { adapter, position } = createAdapter();
    const originalLength = window.history.length;

    render(
      <StoryBootstrapExperience
        positioningAdapter={adapter}
        timing={IMMEDIATE_TIMING}
      >
        {storyDocument()}
      </StoryBootstrapExperience>,
    );

    await expectTerminalState("REVEALED");
    expect(position).toHaveBeenCalledTimes(1);
    expect(position).toHaveBeenCalledWith("home", expect.any(Object));
    expect(bootstrapRoot()).toHaveAttribute(
      "data-bootstrap-source",
      "default-home",
    );
    expect(bootstrapRoot()).toHaveAttribute(
      "data-bootstrap-position-status",
      "positioned",
    );
    expect(document.querySelector("[data-bootstrap-cover]")).toBeNull();
    expect(window.history.length).toBe(originalLength);
    expect(window.history.state).toMatchObject({
      __wflyerStoryV2: { chapterId: "home", version: 1 },
    });
    expect(sessionStorage.getItem(STORY_BOOTSTRAP_SESSION_KEY)).toBe("1");
  });

  it("honors an allowlisted deep link and preserves foreign history state", async () => {
    window.history.replaceState(
      { routerOwned: "preserved" },
      "",
      "/__visual-lab/story/bootstrap#projetos",
    );
    const { adapter, position } = createAdapter();

    render(
      <StoryBootstrapExperience
        positioningAdapter={adapter}
        timing={IMMEDIATE_TIMING}
      >
        {storyDocument()}
      </StoryBootstrapExperience>,
    );

    await expectTerminalState("REVEALED");
    expect(position).toHaveBeenCalledWith(
      "professional-projects",
      expect.any(Object),
    );
    expect(bootstrapRoot()).toHaveAttribute(
      "data-bootstrap-destination",
      "professional-projects",
    );
    expect(bootstrapRoot()).toHaveAttribute(
      "data-bootstrap-source",
      "explicit-hash",
    );
    expect(window.history.state).toMatchObject({
      routerOwned: "preserved",
      __wflyerStoryV2: {
        chapterId: "professional-projects",
        version: 1,
      },
    });
  });

  it("falls an invalid nonempty hash directly back to semantic Home", async () => {
    window.history.replaceState(
      { __wflyerStoryV2: { chapterId: "professional-about", version: 1 } },
      "",
      "/__visual-lab/story/bootstrap#not-a-story-target",
    );
    const { adapter, position } = createAdapter();

    render(
      <StoryBootstrapExperience
        positioningAdapter={adapter}
        timing={IMMEDIATE_TIMING}
      >
        {storyDocument()}
      </StoryBootstrapExperience>,
    );

    await expectTerminalState("REVEALED");
    expect(position).toHaveBeenCalledWith("home", expect.any(Object));
    expect(bootstrapRoot()).toHaveAttribute(
      "data-bootstrap-source",
      "invalid-hash-fallback",
    );
  });

  it("releases through skip, restores exact isolation, and focuses main", async () => {
    const { adapter } = createAdapter();

    render(
      <>
        <a className="wf-skip-link" href="#main-content">
          Pular para conteúdo
        </a>
        <header aria-hidden="false" data-story-v2-header="phase-2" inert />
        <StoryBootstrapExperience
          positioningAdapter={adapter}
          scenario="slow-critical"
          timing={IMMEDIATE_TIMING}
        >
          {storyDocument()}
        </StoryBootstrapExperience>
        <footer data-story-global-footer="phase-2" />
      </>,
    );

    const header = document.querySelector<HTMLElement>("[data-story-v2-header]");
    const main = document.querySelector<HTMLElement>("main#main-content");
    expect(header).toHaveAttribute("aria-hidden", "true");
    expect(header).toHaveAttribute("inert");
    expect(main).toHaveAttribute("aria-hidden", "true");
    expect(main).toHaveAttribute("inert");
    expect(document.body.style.overflow).toBe("hidden");

    const skip = screen.getByRole("button", { name: "Pular introdução" });
    skip.focus();
    fireEvent.click(skip);

    await expectTerminalState("REVEALED");
    expect(bootstrapRoot()).toHaveAttribute("data-bootstrap-release-cause", "skip");
    expect(header).toHaveAttribute("aria-hidden", "false");
    expect(header).toHaveAttribute("inert");
    expect(main).not.toHaveAttribute("aria-hidden");
    expect(main).not.toHaveAttribute("inert");
    expect(main).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });

  it("supports Escape as an immediate semantic exit", async () => {
    const { adapter, position } = createAdapter();
    render(
      <StoryBootstrapExperience
        positioningAdapter={adapter}
        scenario="slow-critical"
        timing={IMMEDIATE_TIMING}
      >
        {storyDocument()}
      </StoryBootstrapExperience>,
    );

    fireEvent.keyDown(window, { key: "Escape" });
    await expectTerminalState("REVEALED");
    expect(position).toHaveBeenCalledWith("home", expect.any(Object));
    expect(bootstrapRoot()).toHaveAttribute(
      "data-bootstrap-release-cause",
      "escape",
    );
  });

  it("keeps one positioning owner when Escape interrupts a pending projection", async () => {
    let finishPosition: (() => void) | undefined;
    const position = vi.fn<StoryPositioningAdapter["position"]>(
      (chapterId) =>
        new Promise((resolve) => {
          finishPosition = () =>
            resolve({
              fallbackToHome: false,
              positionedChapterId: chapterId,
              projectionMode: "static",
              requestedChapterId: chapterId,
            });
        }),
    );
    const adapter = {
      projectionMode: "static",
      position,
    } satisfies StoryPositioningAdapter;

    render(
      <StoryBootstrapExperience
        positioningAdapter={adapter}
        timing={IMMEDIATE_TIMING}
      >
        {storyDocument()}
      </StoryBootstrapExperience>,
    );

    await waitFor(() => expect(position).toHaveBeenCalledTimes(1));
    expect(bootstrapRoot()).toHaveAttribute(
      "data-bootstrap-state",
      "POSITIONING",
    );
    fireEvent.keyDown(window, { key: "Escape" });
    await act(async () => Promise.resolve());
    expect(position).toHaveBeenCalledTimes(1);

    await act(async () => {
      finishPosition?.();
      await Promise.resolve();
    });
    await expectTerminalState("REVEALED");
    expect(bootstrapRoot()).toHaveAttribute(
      "data-bootstrap-release-cause",
      "escape",
    );
  });

  it("keeps reduced motion semantic while omitting the visual hold", async () => {
    const listeners = new Set<(event: MediaQueryListEvent) => void>();
    vi.stubGlobal(
      "matchMedia",
      vi.fn(
        (query: string): MediaQueryList =>
          ({
            addEventListener: (
              _type: string,
              listener: EventListenerOrEventListenerObject,
            ) =>
              listeners.add(listener as (event: MediaQueryListEvent) => void),
            addListener: vi.fn(),
            dispatchEvent: vi.fn().mockReturnValue(true),
            matches: true,
            media: query,
            onchange: null,
            removeEventListener: (
              _type: string,
              listener: EventListenerOrEventListenerObject,
            ) =>
              listeners.delete(listener as (event: MediaQueryListEvent) => void),
            removeListener: vi.fn(),
          }) as MediaQueryList,
      ),
    );
    window.history.replaceState(
      {},
      "",
      "/__visual-lab/story/bootstrap#sobre",
    );
    const { adapter, position } = createAdapter();

    render(
      <StoryBootstrapExperience positioningAdapter={adapter}>
        {storyDocument()}
      </StoryBootstrapExperience>,
    );

    await expectTerminalState("REVEALED");
    expect(position).toHaveBeenCalledWith(
      "professional-about",
      expect.any(Object),
    );
    expect(bootstrapRoot()).toHaveAttribute(
      "data-bootstrap-reduced-motion",
      "true",
    );
    expect(bootstrapRoot()).toHaveAttribute(
      "data-bootstrap-release-cause",
      "reduced-motion",
    );
  });

  it("does not replay the visual hold in-session but still repositions", async () => {
    sessionStorage.setItem(STORY_BOOTSTRAP_SESSION_KEY, "1");
    window.history.replaceState(
      {},
      "",
      "/__visual-lab/story/bootstrap#projetos",
    );
    const { adapter, position } = createAdapter();

    render(
      <StoryBootstrapExperience positioningAdapter={adapter}>
        {storyDocument()}
      </StoryBootstrapExperience>,
    );

    await expectTerminalState("REVEALED");
    expect(position).toHaveBeenCalledWith(
      "professional-projects",
      expect.any(Object),
    );
    expect(bootstrapRoot()).toHaveAttribute(
      "data-bootstrap-session-repeated",
      "true",
    );
    expect(bootstrapRoot()).toHaveAttribute(
      "data-bootstrap-release-cause",
      "session-repeat",
    );
  });

  it("fails open at the hard deadline and leaves the semantic page usable", async () => {
    const { adapter, position } = createAdapter();

    render(
      <StoryBootstrapExperience
        positioningAdapter={adapter}
        scenario="timeout"
        timing={{ ...IMMEDIATE_TIMING, HARD_FAIL_OPEN: 20 }}
      >
        {storyDocument()}
      </StoryBootstrapExperience>,
    );

    await expectTerminalState("DEGRADED");
    expect(bootstrapRoot()).toHaveAttribute(
      "data-bootstrap-degraded-reason",
      "hard-timeout",
    );
    expect(position).toHaveBeenCalledWith("home", expect.any(Object));
    expect(screen.queryByRole("button", { name: "Pular introdução" })).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });

  it("remains covered at 4999ms and enters DEGRADED at the 5000ms bound", async () => {
    vi.useFakeTimers();
    const { adapter } = createAdapter();

    render(
      <StoryBootstrapExperience
        positioningAdapter={adapter}
        scenario="timeout"
        timing={{ ...IMMEDIATE_TIMING, HARD_FAIL_OPEN: 5_000 }}
      >
        {storyDocument()}
      </StoryBootstrapExperience>,
    );

    await act(async () => Promise.resolve());
    await act(async () => vi.advanceTimersByTimeAsync(4_999));
    expect(bootstrapRoot()).toHaveAttribute(
      "data-bootstrap-state",
      "WAITING_CRITICAL",
    );
    expect(document.querySelector("[data-bootstrap-cover]")).not.toBeNull();

    await act(async () => vi.advanceTimersByTimeAsync(1));
    expect(bootstrapRoot()).toHaveAttribute("data-bootstrap-state", "DEGRADED");
    expect(bootstrapRoot()).toHaveAttribute(
      "data-bootstrap-degraded-reason",
      "hard-timeout",
    );
    expect(document.querySelector("[data-bootstrap-cover]")).toBeNull();
  });

  it("honors the server-cover animation deadline before a later JavaScript timer", async () => {
    const { adapter, position } = createAdapter();

    render(
      <StoryBootstrapExperience
        positioningAdapter={adapter}
        scenario="timeout"
        timing={{ ...IMMEDIATE_TIMING, HARD_FAIL_OPEN: 10_000 }}
      >
        {storyDocument()}
      </StoryBootstrapExperience>,
    );

    const cover = document.querySelector<HTMLElement>("[data-bootstrap-cover]");
    if (cover === null) throw new Error("The server cover is unavailable.");
    fireEvent.animationEnd(cover);

    await expectTerminalState("DEGRADED");
    expect(position).toHaveBeenCalledWith("home", expect.any(Object));
    expect(bootstrapRoot()).toHaveAttribute(
      "data-bootstrap-degraded-reason",
      "hard-timeout",
    );
    expect(bootstrapRoot()).toHaveAttribute(
      "data-bootstrap-release-cause",
      "css-fail-open",
    );
    expect(document.body.style.overflow).toBe("");
  });

  it("fails open on a hidden tab and stays usable when visibility returns", async () => {
    const visibility = vi.spyOn(document, "visibilityState", "get");
    visibility.mockReturnValue("visible");
    const { adapter, position } = createAdapter();

    render(
      <StoryBootstrapExperience
        positioningAdapter={adapter}
        scenario="slow-critical"
        timing={IMMEDIATE_TIMING}
      >
        {storyDocument()}
      </StoryBootstrapExperience>,
    );

    expect(bootstrapRoot()).toHaveAttribute(
      "data-bootstrap-state",
      "WAITING_CRITICAL",
    );
    visibility.mockReturnValue("hidden");
    fireEvent(document, new Event("visibilitychange"));

    await expectTerminalState("DEGRADED");
    expect(position).toHaveBeenCalledWith("home", expect.any(Object));
    expect(bootstrapRoot()).toHaveAttribute(
      "data-bootstrap-degraded-reason",
      "hidden-document",
    );
    expect(document.body.style.overflow).toBe("");

    visibility.mockReturnValue("visible");
    fireEvent(document, new Event("visibilitychange"));
    expect(bootstrapRoot()).toHaveAttribute("data-bootstrap-state", "DEGRADED");
    expect(document.querySelector("[data-bootstrap-cover]")).toBeNull();
  });

  it("does not let a noncritical resource failure delay eligibility", async () => {
    const { adapter, position } = createAdapter();

    render(
      <StoryBootstrapExperience
        positioningAdapter={adapter}
        scenario="noncritical-failure"
        timing={IMMEDIATE_TIMING}
      >
        {storyDocument()}
      </StoryBootstrapExperience>,
    );

    await expectTerminalState("REVEALED");
    expect(position).toHaveBeenCalledTimes(1);
    expect(bootstrapRoot()).toHaveAttribute(
      "data-bootstrap-degraded-reason",
      "none",
    );
  });

  it("fails open through the semantic adapter when a critical resource fails", async () => {
    const { adapter, position } = createAdapter();

    render(
      <StoryBootstrapExperience
        positioningAdapter={adapter}
        scenario="critical-failure"
        timing={IMMEDIATE_TIMING}
      >
        {storyDocument()}
      </StoryBootstrapExperience>,
    );

    await expectTerminalState("DEGRADED");
    expect(position).toHaveBeenCalledWith("home", expect.any(Object));
    expect(bootstrapRoot()).toHaveAttribute(
      "data-bootstrap-degraded-reason",
      "critical-resource-error",
    );
    await waitFor(() => {
      expect(bootstrapRoot()).toHaveAttribute(
        "data-bootstrap-position-status",
        "positioned",
      );
    });
  });

  it("treats a missing official intro SVG probe as a recoverable critical failure", async () => {
    const { adapter, position } = createAdapter();

    render(
      <StoryBootstrapExperience
        criticalProbe={() => {
          throw new Error("The official intro SVG is unavailable.");
        }}
        positioningAdapter={adapter}
        timing={IMMEDIATE_TIMING}
      >
        {storyDocument()}
      </StoryBootstrapExperience>,
    );

    await expectTerminalState("DEGRADED");
    expect(position).toHaveBeenCalledWith("home", expect.any(Object));
    expect(bootstrapRoot()).toHaveAttribute(
      "data-bootstrap-degraded-reason",
      "critical-resource-error",
    );
    expect(document.body.style.overflow).toBe("");
  });

  it("uses a fresh static adapter before releasing a failed projection", async () => {
    const scrollIntoView = vi.fn();
    const originalScrollIntoView = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "scrollIntoView",
    );
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    });
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => {
        callback(performance.now());
        return 1;
      }),
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    window.history.replaceState(
      {},
      "",
      "/__visual-lab/story/bootstrap#projetos",
    );
    const { adapter, position } = createAdapter();

    try {
      render(
        <StoryBootstrapExperience
          positioningAdapter={adapter}
          scenario="projection-failure"
          timing={IMMEDIATE_TIMING}
        >
          {storyDocument()}
        </StoryBootstrapExperience>,
      );

      await expectTerminalState("DEGRADED");
      expect(position).not.toHaveBeenCalled();
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      expect(bootstrapRoot()).toHaveAttribute(
        "data-bootstrap-degraded-reason",
        "positioning-error",
      );
      expect(bootstrapRoot()).toHaveAttribute(
        "data-bootstrap-position-status",
        "failed",
      );
      expect(
        window.__WFLYER_PHASE4_BOOTSTRAP__?.positionCalls.map(
          ({ trigger }) => trigger,
        ),
      ).toEqual(["initial", "fail-open-static:positioning-error"]);
    } finally {
      if (originalScrollIntoView === undefined) {
        delete (HTMLElement.prototype as Partial<HTMLElement>).scrollIntoView;
      } else {
        Object.defineProperty(
          HTMLElement.prototype,
          "scrollIntoView",
          originalScrollIntoView,
        );
      }
    }
  });

  it("coalesces hashchange and popstate into one semantic reconciliation without writes", async () => {
    const { adapter, position } = createAdapter();
    const replaceState = vi.spyOn(window.history, "replaceState");

    render(
      <StoryBootstrapExperience
        positioningAdapter={adapter}
        timing={IMMEDIATE_TIMING}
      >
        {storyDocument()}
      </StoryBootstrapExperience>,
    );
    await expectTerminalState("REVEALED");
    expect(replaceState).toHaveBeenCalledTimes(1);

    window.history.replaceState(
      { __wflyerStoryV2: { chapterId: "professional-about", version: 1 } },
      "",
      "/__visual-lab/story/bootstrap#sobre",
    );
    replaceState.mockClear();
    fireEvent(window, new HashChangeEvent("hashchange"));
    fireEvent(
      window,
      new PopStateEvent("popstate", { state: window.history.state }),
    );

    await waitFor(() => expect(position).toHaveBeenCalledTimes(2));
    expect(position).toHaveBeenLastCalledWith(
      "professional-about",
      expect.objectContaining({ intent: "semantic-navigation" }),
    );
    expect(replaceState).not.toHaveBeenCalled();
    expect(window.__WFLYER_PHASE4_BOOTSTRAP__?.positionCalls).toHaveLength(2);
  });

  it("marks viewport positioning as an active-chapter preservation intent", async () => {
    const { adapter, position } = createAdapter();

    render(
      <StoryBootstrapExperience
        positioningAdapter={adapter}
        timing={IMMEDIATE_TIMING}
      >
        {storyDocument()}
      </StoryBootstrapExperience>,
    );
    await expectTerminalState("REVEALED");

    fireEvent(window, new Event("resize"));

    await waitFor(() => expect(position).toHaveBeenCalledTimes(2));
    expect(position).toHaveBeenLastCalledWith(
      "home",
      expect.objectContaining({ intent: "preserve-active-chapter" }),
    );
  });

  it("cleans timers, listeners, locks, and pending work across Strict Mode remounts", async () => {
    const { adapter } = createAdapter();
    const add = vi.spyOn(window, "addEventListener");
    const remove = vi.spyOn(window, "removeEventListener");
    const mediaAdd = vi.fn();
    const mediaRemove = vi.fn();
    vi.stubGlobal(
      "matchMedia",
      vi.fn(
        (query: string): MediaQueryList =>
          ({
            addEventListener: mediaAdd,
            addListener: vi.fn(),
            dispatchEvent: vi.fn().mockReturnValue(true),
            matches: false,
            media: query,
            onchange: null,
            removeEventListener: mediaRemove,
            removeListener: vi.fn(),
          }) as MediaQueryList,
      ),
    );

    const { unmount } = render(
      <StrictMode>
        <StoryBootstrapExperience
          positioningAdapter={adapter}
          scenario="slow-critical"
          timing={IMMEDIATE_TIMING}
        >
          {storyDocument()}
        </StoryBootstrapExperience>
      </StrictMode>,
    );

    expect(document.documentElement).toHaveAttribute(
      "data-story-bootstrap-active",
      "true",
    );
    unmount();

    expect(document.documentElement).not.toHaveAttribute(
      "data-story-bootstrap-active",
    );
    expect(document.body.style.overflow).toBe("");
    for (const eventType of [
      "keydown",
      "hashchange",
      "popstate",
      "resize",
      "orientationchange",
    ]) {
      expect(
        remove.mock.calls.filter(([type]) => type === eventType),
      ).toHaveLength(add.mock.calls.filter(([type]) => type === eventType).length);
    }
    expect(mediaRemove).toHaveBeenCalledTimes(mediaAdd.mock.calls.length);
    await act(async () => Promise.resolve());
    expect(window.__WFLYER_PHASE4_BOOTSTRAP__).toBeUndefined();
  });
});
