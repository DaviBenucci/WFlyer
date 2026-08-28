import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  DESKTOP_TIMELINE_ORDER,
  MOBILE_STORY_CHAPTERS,
  STORY_CHAPTER_BY_ID,
} from "@/lib/story";

import { MotionStoryLab } from "./MotionStoryLab";

vi.mock("@/components/pages/contact", () => ({
  ContactForm: () => <form aria-label="Formulário de contato" />,
  ContactFormFallback: () => <p>Carregando formulário</p>,
}));

describe("MotionStoryLab", () => {
  beforeEach(() => {
    vi.stubGlobal("scrollTo", vi.fn());
    delete window.__WFLYER_PHASE5_MOTION__;
    delete window.__WFLYER_PHASE5_MOTION_LIFECYCLE__;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders every chapter in canonical mobile DOM order with Phase-7 professional scenes", () => {
    const { container } = render(<MotionStoryLab />);
    const chapters = Array.from(
      container.querySelectorAll<HTMLElement>("[data-chapter-id]"),
    );

    expect(chapters.map(({ dataset }) => dataset.chapterId)).toEqual(
      MOBILE_STORY_CHAPTERS.map(({ id }) => id),
    );
    expect(chapters).toHaveLength(13);
    expect(container.querySelector("main")).toHaveAttribute(
      "data-projection-mode",
      "vertical-compact",
    );
    expect(container.querySelector("main")).toHaveAttribute(
      "data-professional-scenes",
      "phase-7",
    );
    expect(container.querySelectorAll("[data-professional-scene]")).toHaveLength(
      6,
    );
    expect(
      Array.from(
        container.querySelectorAll<HTMLElement>(
          "[data-structural-placeholder]",
        ),
      ).map(({ dataset }) => dataset.structuralPlaceholder),
    ).toEqual([
      "home",
      "application-overview",
      "application-how-it-works",
      "application-benefits",
      "application-demo",
      "application-access",
      "application-terminal",
    ]);
    expect(container.querySelectorAll("[data-project-card]")).toHaveLength(3);
    expect(
      container.querySelector(
        '[data-final-barline-before="professional-terminal"]',
      ),
    ).toBeInTheDocument();
  });

  it("exposes the exact desktop order and stable manifest labels", () => {
    render(<MotionStoryLab />);
    const labelList = screen.getByText("Inspecionar labels canônicos").parentElement;
    const expectedLabels = DESKTOP_TIMELINE_ORDER.map(
      (chapterId) => STORY_CHAPTER_BY_ID[chapterId].timelineLabel,
    );

    expect(labelList?.querySelector("ol")).toHaveAttribute(
      "data-motion-label-order",
      expectedLabels.join(" "),
    );
    for (const [index, chapterId] of DESKTOP_TIMELINE_ORDER.entries()) {
      expect(
        document.querySelector(`[data-chapter-id="${chapterId}"]`),
      ).toHaveAttribute("data-motion-desktop-index", String(index));
    }
  });

  it("cleans the debug owner and replaces it once during a React remount", () => {
    const { unmount } = render(<MotionStoryLab />);
    const initialController = window.__WFLYER_PHASE5_MOTION__;
    const initialSnapshot = initialController?.snapshot();

    expect(initialController).toBeDefined();
    expect(initialSnapshot).toBeDefined();

    act(() => {
      initialController?.remountForReview();
    });

    const replacementController = window.__WFLYER_PHASE5_MOTION__;
    const replacementSnapshot = replacementController?.snapshot();
    expect(replacementController).toBeDefined();
    expect(replacementController).not.toBe(initialController);
    expect(replacementSnapshot?.mountCount).toBe(
      (initialSnapshot?.mountCount ?? 0) + 1,
    );
    expect(replacementSnapshot?.destroyCount).toBe(
      (initialSnapshot?.destroyCount ?? 0) + 1,
    );

    unmount();
    expect(window.__WFLYER_PHASE5_MOTION__).toBeUndefined();
  });
});
