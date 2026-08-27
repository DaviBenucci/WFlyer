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
