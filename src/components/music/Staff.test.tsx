import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Staff } from "./Staff";
import { getStaffPath } from "./StaffSegment";

describe("Staff", () => {
  it("renderiza cinco linhas determinísticas e silenciosas", () => {
    const { container } = render(<Staff direction="right" />);
    const staff = container.querySelector("[data-staff]");
    const lines = container.querySelectorAll("[data-staff-line]");

    expect(staff).toHaveAttribute("aria-hidden", "true");
    expect(lines).toHaveLength(5);
    expect(lines[0]).toHaveAttribute(
      "d",
      getStaffPath({
        amplitude: 14,
        direction: "right",
        endX: 640,
        startX: 0,
        y: 30,
      }),
    );
  });

  it("encerra o ramo institucional na borda direita", () => {
    const { container, rerender } = render(<Staff />);

    expect(container.querySelector("[data-final-barline]")).not.toBeInTheDocument();

    rerender(<Staff direction="right" terminal />);

    expect(container.querySelector("[data-final-barline]")).toHaveAttribute(
      "data-side",
      "end",
    );
    expect(
      container.querySelector("[data-final-barline] line:last-child"),
    ).toHaveAttribute("x1", "628");
    expect(container.querySelectorAll("[data-final-barline] line")).toHaveLength(2);
  });

  it("encerra o ramo da aplicação na borda esquerda", () => {
    const { container } = render(<Staff direction="left" terminal />);

    expect(container.querySelector("[data-final-barline]")).toHaveAttribute(
      "data-side",
      "start",
    );
    expect(
      container.querySelector("[data-final-barline] line:last-child"),
    ).toHaveAttribute("x1", "12");
    expect(
      container.querySelector("[data-measure-bar][x1='636']"),
    ).toBeInTheDocument();
  });

  it("reduz ornamentos sem alterar as cinco linhas", () => {
    const { container } = render(<Staff density="quiet" />);

    expect(container.querySelectorAll("[data-musical-note]")).toHaveLength(1);
    expect(container.querySelectorAll("[data-staff-line]")).toHaveLength(5);
  });
});
