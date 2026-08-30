import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect } from "react";
import { describe, expect, it, vi } from "vitest";

import {
  HEADER_NAVIGATION_ORDER,
  STORY_CHAPTER_BY_ID,
  type StoryChapterId,
} from "@/lib/story";

import {
  StoryNavigationProvider,
  useStoryNavigationBridge,
} from "./StoryNavigationContext";
import { StoryV2Header } from "./StoryV2Header";

function RegisterNavigation({
  activeChapterId,
  navigate,
}: {
  readonly activeChapterId: StoryChapterId;
  readonly navigate: (chapterId: StoryChapterId) => void;
}) {
  const { registerController, reportActiveChapter } =
    useStoryNavigationBridge();

  useEffect(() => {
    reportActiveChapter(activeChapterId);
    return registerController({ navigate });
  }, [activeChapterId, navigate, registerController, reportActiveChapter]);

  return null;
}

describe("StoryV2Header", () => {
  it("renders only the manifest-derived canonical targets in exact order", () => {
    render(<StoryV2Header />);
    const links = screen.getAllByRole("link");

    expect(links).toHaveLength(HEADER_NAVIGATION_ORDER.length);
    expect(
      links.map((link) => link.getAttribute("data-story-navigation-target")),
    ).toEqual(HEADER_NAVIGATION_ORDER);
    expect(links.map((link) => link.getAttribute("href"))).toEqual(
      HEADER_NAVIGATION_ORDER.map(
        (chapterId) => STORY_CHAPTER_BY_ID[chapterId].hash,
      ),
    );
  });

  it("publishes and cleans up its measured sticky block size without render state", () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    const originalResizeObserver = globalThis.ResizeObserver;
    let resizeCallback: ResizeObserverCallback | undefined;

    class ResizeObserverMock implements ResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        resizeCallback = callback;
      }

      disconnect = disconnect;
      observe = observe;
      unobserve = vi.fn();
    }

    globalThis.ResizeObserver = ResizeObserverMock;
    const { unmount } = render(<StoryV2Header />);
    const header = document.querySelector<HTMLElement>("[data-story-v2-header]");

    expect(header).not.toBeNull();
    vi.spyOn(header!, "getBoundingClientRect").mockReturnValue({
      bottom: 149.25,
      height: 149.25,
      left: 0,
      right: 390,
      top: 0,
      width: 390,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    resizeCallback?.([], {} as ResizeObserver);
    expect(observe).toHaveBeenCalledWith(header);
    expect(document.documentElement.style.getPropertyValue(
      "--wf-story-header-block-size",
    )).toBe("150px");
    expect(header).toHaveAttribute("data-story-header-block-size", "150");

    unmount();
    expect(disconnect).toHaveBeenCalledOnce();
    expect(document.documentElement.style.getPropertyValue(
      "--wf-story-header-block-size",
    )).toBe("");
    expect(header).not.toHaveAttribute("data-story-header-block-size");
    globalThis.ResizeObserver = originalResizeObserver;
  });

  it("uses the owned resize-listener fallback and removes it on unmount", () => {
    const originalResizeObserver = globalThis.ResizeObserver;
    const addEventListener = vi.spyOn(window, "addEventListener");
    const removeEventListener = vi.spyOn(window, "removeEventListener");

    globalThis.ResizeObserver = undefined as unknown as typeof ResizeObserver;
    const { unmount } = render(<StoryV2Header />);
    const header = document.querySelector<HTMLElement>("[data-story-v2-header]");

    expect(header).not.toBeNull();
    vi.spyOn(header!, "getBoundingClientRect").mockReturnValue({
      bottom: 149,
      height: 149,
      left: 0,
      right: 390,
      top: 0,
      width: 390,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    window.dispatchEvent(new Event("resize"));
    expect(addEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
    expect(document.documentElement.style.getPropertyValue(
      "--wf-story-header-block-size",
    )).toBe("149px");

    unmount();
    expect(removeEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
    expect(document.documentElement.style.getPropertyValue(
      "--wf-story-header-block-size",
    )).toBe("");
    expect(header).not.toHaveAttribute("data-story-header-block-size");

    window.dispatchEvent(new Event("resize"));
    expect(document.documentElement.style.getPropertyValue(
      "--wf-story-header-block-size",
    )).toBe("");
    globalThis.ResizeObserver = originalResizeObserver;
    addEventListener.mockRestore();
    removeEventListener.mockRestore();
  });

  it("delegates to the registered runtime, retains focus, and exposes the active target", async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();
    render(
      <StoryNavigationProvider>
        <StoryV2Header />
        <RegisterNavigation
          activeChapterId="professional-projects"
          navigate={navigate}
        />
      </StoryNavigationProvider>,
    );
    const projects = screen.getByRole("link", { name: "Projetos" });

    projects.focus();
    await user.keyboard("{Enter}");

    expect(navigate).toHaveBeenCalledOnce();
    expect(navigate).toHaveBeenCalledWith("professional-projects");
    expect(projects).toHaveFocus();
    expect(projects).toHaveAttribute("aria-current", "location");
    expect(
      screen.getByRole("link", { name: "Serviços" }),
    ).not.toHaveAttribute("aria-current");

    fireEvent.click(projects, { ctrlKey: true });
    expect(navigate).toHaveBeenCalledOnce();
  });
});
