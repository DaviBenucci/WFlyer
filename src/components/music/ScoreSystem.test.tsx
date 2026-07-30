import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ChapterScore, getChapterScorePath } from "./ChapterScore";
import { NarrativeClef } from "./NarrativeClef";
import { getOriginStaffPath, OriginScore } from "./OriginScore";

describe("sistema de dupla partitura", () => {
  it("origina dois ramos determinísticos no centro da Home", () => {
    const { container } = render(<OriginScore />);
    const score = container.querySelector("[data-origin-score]");
    const desktop = container.querySelector(
      '[data-origin-score-layout="desktop"]',
    );
    const compact = container.querySelector(
      '[data-origin-score-layout="compact"]',
    );

    expect(score).toHaveAttribute("aria-hidden", "true");
    expect(
      desktop?.querySelectorAll('[data-score-branch="application"]'),
    ).toHaveLength(1);
    expect(
      desktop?.querySelectorAll('[data-score-branch="institutional"]'),
    ).toHaveLength(1);
    expect(desktop?.querySelectorAll("[data-origin-staff-line]")).toHaveLength(
      10,
    );
    expect(compact?.querySelectorAll("[data-origin-staff-line]")).toHaveLength(
      10,
    );
    expect(
      desktop?.querySelector(
        '[data-score-branch="application"] [data-origin-staff-line="1"]',
      ),
    ).toHaveAttribute(
      "d",
      getOriginStaffPath("application", "desktop", 0),
    );
  });

  it("mantém a clave narrativa separada da marca", () => {
    const { container } = render(<NarrativeClef />);
    const clef = container.querySelector("[data-narrative-clef]");

    expect(clef).toHaveAttribute("aria-hidden", "true");
    expect(clef).toHaveAttribute("viewBox", "0 0 220 420");
    expect(clef?.querySelectorAll("path")).toHaveLength(3);
    expect(
      clef?.querySelector('[data-asset-name="wflyer-header-symbol"]'),
    ).not.toBeInTheDocument();
  });

  it("liga anchors distintos com cinco linhas paralelas", () => {
    const props = {
      branch: "institutional" as const,
      entryAnchorY: 0.46,
      entryEdge: "left" as const,
      exitAnchorY: 0.68,
      exitEdge: "right" as const,
    };
    const { container } = render(<ChapterScore {...props} />);
    const score = container.querySelector("[data-score-segment]");

    expect(score).toHaveAttribute("data-entry-edge", "left");
    expect(score).toHaveAttribute("data-entry-anchor-y", "0.46");
    expect(score).toHaveAttribute("data-exit-edge", "right");
    expect(score).toHaveAttribute("data-exit-anchor-y", "0.68");
    expect(
      container.querySelectorAll("[data-chapter-staff-line]"),
    ).toHaveLength(5);
    expect(
      container.querySelector('[data-chapter-staff-line="1"]'),
    ).toHaveAttribute("d", getChapterScorePath(props));
    expect(
      container.querySelector("[data-final-barline]"),
    ).not.toBeInTheDocument();
  });

  it("encerra cada ramo exatamente na borda de saída", () => {
    const { container, rerender } = render(
      <ChapterScore
        branch="application"
        entryAnchorY={0.56}
        entryEdge="right"
        exitAnchorY={0.64}
        exitEdge="left"
        terminal
      />,
    );

    expect(container.querySelector("[data-final-barline]")).toHaveAttribute(
      "data-side",
      "start",
    );
    expect(
      container.querySelector("[data-final-barline] line:last-child"),
    ).toHaveAttribute("x1", "14");

    rerender(
      <ChapterScore
        branch="institutional"
        entryAnchorY={0.72}
        entryEdge="left"
        exitAnchorY={0.64}
        exitEdge="right"
        terminal
      />,
    );

    expect(container.querySelector("[data-final-barline]")).toHaveAttribute(
      "data-side",
      "end",
    );
    expect(
      container.querySelector("[data-final-barline] line:last-child"),
    ).toHaveAttribute("x1", "986");
  });
});
