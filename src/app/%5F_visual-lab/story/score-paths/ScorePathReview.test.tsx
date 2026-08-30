import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ScorePathReviewShell, ScorePathReviewSurface } from "./ScorePathReview";

vi.mock("@/components/pages/contact", () => ({
  ContactForm: () => <form aria-label="Formulário de contato" />,
  ContactFormFallback: () => <p>Carregando formulário</p>,
}));

describe("ScorePathReview task-33 surface", () => {
  it("renders both isolated branches against the real Phase-7/8 scene inventory", () => {
    const { container } = render(
      <ScorePathReviewSurface
        candidateId="organic-soft"
        mode="vertical-compact"
        theme="dark"
      />,
    );

    expect(container.querySelector("main")).toHaveAttribute(
      "data-phase-9-task-33-review",
      "candidate-only",
    );
    expect(container.querySelector("main")).toHaveAttribute(
      "data-review-theme",
      "dark",
    );
    expect(container.querySelectorAll("[data-review-branch]")).toHaveLength(2);
    expect(container.querySelectorAll("[data-review-chapter-id]")).toHaveLength(
      14,
    );
    expect(container.querySelectorAll("[data-professional-scene]")).toHaveLength(
      6,
    );
    expect(container.querySelectorAll("[data-application-scene]")).toHaveLength(
      6,
    );
    expect(container.querySelectorAll("[data-review-content-envelope]")).toHaveLength(
      14,
    );
    expect(container.querySelectorAll("[data-project-card]")).toHaveLength(3);
    expect(screen.getByRole("form", { name: "Formulário de contato" })).toBeInTheDocument();
    expect(container.querySelectorAll('[data-primary-app-access="true"]')).toHaveLength(
      1,
    );
    expect(container.querySelectorAll("[data-app04-deterministic-fallback]")).toHaveLength(
      1,
    );
  });

  it("renders approved score primitives plus explicit notation/connector evidence", () => {
    const { container } = render(
      <ScorePathReviewSurface
        candidateId="organic-flowing"
        mode="vertical-wide"
        theme="light"
      />,
    );

    expect(container.querySelectorAll("[data-review-score]")).toHaveLength(2);
    expect(container.querySelector("main")).toHaveAttribute(
      "data-review-status",
      "SELECTED_FOR_REVISION",
    );
    expect(container.querySelectorAll('[data-score-role="staff-line"]')).toHaveLength(
      10,
    );
    expect(container.querySelectorAll('[data-score-role="clef"]')).toHaveLength(2);
    expect(
      container.querySelectorAll('[data-score-role="final-barline-thin"]'),
    ).toHaveLength(2);
    expect(
      container.querySelectorAll('[data-score-role="final-barline-thick"]'),
    ).toHaveLength(2);
    expect(
      container.querySelectorAll('[data-review-zone-kind="notation-safe"]'),
    ).toHaveLength(14);
    expect(
      container.querySelectorAll('[data-review-zone-kind="connector"]'),
    ).toHaveLength(12);
    expect(container.querySelectorAll("[data-review-diagnostics]")).toHaveLength(
      2,
    );
    expect(
      container.querySelectorAll('[data-review-marker-only="true"]'),
    ).toHaveLength(26);
    expect(
      container.querySelectorAll("[data-review-zone-markers] polyline"),
    ).toHaveLength(0);
    expect(
      container.querySelectorAll('[data-review-terminal-invariant="pass"]'),
    ).toHaveLength(2);
    expect(
      Array.from(
        container.querySelectorAll("[data-review-primitive-span-violations]"),
      ).every(
        (branch) =>
          branch.getAttribute("data-review-primitive-span-violations") === "0",
      ),
    ).toBe(true);
    expect(
      Array.from(
        container.querySelectorAll<HTMLTableRowElement>(
          '[data-review-zone-kind="connector"]',
        ),
      ).every(
        (connector) =>
          connector.dataset.reviewEventCount === "0" &&
          connector.dataset.reviewSemanticSlotIds === "",
      ),
    ).toBe(true);
  });

  it("exposes the full eight-case review matrix and a capacity-sized iframe", () => {
    const { container } = render(
      <ScorePathReviewShell
        candidateId="organic-flowing"
        mode="vertical-compact"
        theme="dark"
      />,
    );
    const matrix = screen.getByRole("navigation", {
      name: "ScorePath candidate matrix",
    });
    const frame = screen.getByTitle(
      "Organic Flowing, vertical-compact, dark",
    );

    expect(matrix.querySelectorAll("a")).toHaveLength(8);
    expect(matrix.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
    expect(frame).toHaveAttribute("width", "430");
    expect(frame).toHaveAttribute("height", "844");
    expect(frame).toHaveAttribute(
      "src",
      "/__visual-lab/story/score-paths/preview?candidate=organic-flowing&mode=vertical-compact&theme=dark",
    );
    expect(
      container.querySelector('[data-phase-9-score-path-review-shell="task-33"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Organic Flowing — SELECTED_FOR_REVISION"),
    ).toBeInTheDocument();
  });
});
