import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SiteExperienceShell } from "./SiteExperienceShell";

const runtimeMocks = vi.hoisted(() => ({
  cancelAnimationFrame: vi.fn(),
  pathname: "/",
  push: vi.fn(),
  registerPlugin: vi.fn(),
  replace: vi.fn(),
  requestAnimationFrame: vi.fn(() => 1),
  set: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => runtimeMocks.pathname,
  useRouter: () => ({
    push: runtimeMocks.push,
    replace: runtimeMocks.replace,
  }),
}));

vi.mock("@gsap/react", () => ({
  useGSAP: () => ({
    contextSafe: <T extends (...args: never[]) => unknown>(callback: T) =>
      callback,
  }),
}));

vi.mock("gsap", () => ({
  default: {
    registerPlugin: runtimeMocks.registerPlugin,
    set: runtimeMocks.set,
    timeline: vi.fn(),
  },
}));

describe("SiteExperienceShell", () => {
  beforeEach(() => {
    runtimeMocks.pathname = "/";
    window.history.replaceState(null, "", "/");
    Object.defineProperties(window, {
      cancelAnimationFrame: {
        configurable: true,
        value: runtimeMocks.cancelAnimationFrame,
        writable: true,
      },
      requestAnimationFrame: {
        configurable: true,
        value: runtimeMocks.requestAnimationFrame,
        writable: true,
      },
    });
  });

  afterEach(() => {
    delete window.__WFLYER_TRANSITION_TEST__;
    vi.useRealTimers();
  });

  it("renders an idle, non-locking coordinator around real content", () => {
    const { container } = render(
      <SiteExperienceShell>
        <main id="main-content" tabIndex={-1}>
          <a href="/sobre">Destination</a>
        </main>
      </SiteExperienceShell>,
    );
    const shell = container.querySelector("[data-site-experience]");

    expect(shell).toHaveAttribute("data-transition-phase", "idle");
    expect(shell).toHaveAttribute("data-transition-active", "false");
    expect(shell).toHaveAttribute("data-active-timelines", "0");
    expect(shell).toHaveAttribute("data-scroll-locked", "false");
    expect(container.querySelector("main#main-content")).toBeInTheDocument();
    expect(
      container.querySelector("[data-score-transition-layer]"),
    ).toHaveAttribute("aria-hidden", "true");
  });

  it("exposes and removes the deterministic controller only in test mode", async () => {
    const { unmount } = render(
      <SiteExperienceShell testMode>
        <main id="main-content" tabIndex={-1} />
      </SiteExperienceShell>,
    );

    await waitFor(() => {
      expect(window.__WFLYER_TRANSITION_TEST__).toBeDefined();
    });
    expect(window.__WFLYER_TRANSITION_TEST__?.snapshot()).toMatchObject({
      active: false,
      checkpoint: null,
      direction: "none",
      mode: "neutral",
      phase: "idle",
      requestId: null,
    });

    unmount();

    expect(window.__WFLYER_TRANSITION_TEST__).toBeUndefined();
  });

  it("leaves modified activations to the browser", () => {
    const { container } = render(
      <SiteExperienceShell>
        <main id="main-content" tabIndex={-1}>
          <a href="/sobre">Destination</a>
        </main>
      </SiteExperienceShell>,
    );
    const link = container.querySelector<HTMLAnchorElement>("a")!;
    const click = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      ctrlKey: true,
    });
    let preventedByShell = true;
    link.addEventListener("click", (event) => {
      preventedByShell = event.defaultPrevented;
      event.preventDefault();
    });

    link.dispatchEvent(click);

    expect(preventedByShell).toBe(false);
    expect(runtimeMocks.push).not.toHaveBeenCalled();
  });

  it("enhances a valid chapter link and requests the route during prepare", () => {
    vi.useFakeTimers();
    const { container, unmount } = render(
      <SiteExperienceShell>
        <main id="main-content" tabIndex={-1}>
          <a href="/sobre">Destination</a>
        </main>
      </SiteExperienceShell>,
    );
    const link = container.querySelector<HTMLAnchorElement>("a")!;

    fireEvent.click(link);

    const shell = container.querySelector("[data-site-experience]");
    expect(shell).toHaveAttribute("data-transition-mode", "adjacent-score");
    expect(shell).toHaveAttribute("data-transition-direction", "right");
    expect(shell).toHaveAttribute("data-transition-active", "true");
    expect(shell).toHaveAttribute("data-transition-source", "/");
    expect(shell).toHaveAttribute("data-transition-destination", "/sobre");
    expect(runtimeMocks.push).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(56);
    });

    expect(runtimeMocks.push).toHaveBeenCalledWith("/sobre", {
      scroll: false,
    });

    unmount();
  });
});
