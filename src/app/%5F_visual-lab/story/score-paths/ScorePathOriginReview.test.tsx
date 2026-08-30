import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ScorePathOriginReview } from "./ScorePathOriginReview";

describe("ScorePathOriginReview task-33 surface", () => {
  it("renders the real approved clef and both isolated five-line departures", () => {
    const { container } = render(
      <ScorePathOriginReview mode="vertical-compact" theme="dark" />,
    );
    const root = container.querySelector("main");

    expect(root).toHaveAttribute(
      "data-phase-9-task-33-origin-review",
      "development-only",
    );
    expect(root).toHaveAttribute(
      "data-origin-review-status",
      "HUMAN_APPROVAL_PENDING",
    );
    expect(root).toHaveAttribute("data-origin-review-mode", "vertical-compact");
    expect(root).toHaveAttribute("data-origin-review-theme", "dark");
    expect(container.querySelectorAll("[data-origin-score-branch]")).toHaveLength(
      2,
    );
    expect(container.querySelectorAll('[data-score-role="staff-line"]')).toHaveLength(
      10,
    );
    expect(container.querySelectorAll('[data-score-role="clef"]')).toHaveLength(1);
    expect(container.querySelector('[data-score-role="clef"]')).toHaveAttribute(
      "data-score-glyph",
      "wf-music-treble-clef",
    );
    expect(container.querySelectorAll("[data-origin-zone-kind]")).toHaveLength(4);
    expect(container.querySelectorAll('[data-score-role*="barline"]')).toHaveLength(
      0,
    );
    expect(container.querySelectorAll('[data-score-role="notehead"]')).toHaveLength(
      0,
    );
  });

  it("keeps all six review links and the pending human status visible", () => {
    render(<ScorePathOriginReview mode="horizontal-enhanced" theme="light" />);

    expect(
      screen.getByRole("navigation", { name: "Origin review variants" })
        .querySelectorAll("a"),
    ).toHaveLength(6);
    expect(screen.getAllByText("ORIGIN_CURVE — HUMAN_APPROVAL_PENDING")).toHaveLength(
      2,
    );
    expect(
      screen.getByText("Task 34 integration is intentionally absent."),
    ).toBeInTheDocument();
  });
});
