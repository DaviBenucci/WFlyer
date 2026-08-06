import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import HomePage from "./page";

vi.mock("@/components/brand-intro", () => ({
  BrandIntroController: () => null,
}));

describe("HomePage brand-opening targets", () => {
  it("annotates the existing score, origin, branch copy, actions, and cue", () => {
    const { container } = render(<HomePage />);

    expect(container.querySelector("main")).toHaveAttribute(
      "data-brand-intro-home-state",
      "pending",
    );
    expect(
      container.querySelector("[data-brand-intro-home-score]"),
    ).not.toBeNull();
    expect(
      container.querySelector("[data-brand-intro-home-origin]"),
    ).not.toBeNull();
    expect(
      container.querySelector("[data-brand-intro-home-clef]"),
    ).not.toBeNull();
    expect(
      container.querySelectorAll(
        '[data-brand-intro-home-copy="application"]',
      ),
    ).toHaveLength(4);
    expect(
      container.querySelectorAll(
        '[data-brand-intro-home-copy="institutional"]',
      ),
    ).toHaveLength(4);
    expect(
      container.querySelectorAll("[data-brand-intro-home-actions]"),
    ).toHaveLength(2);
    expect(
      container.querySelector("[data-brand-intro-home-cue]"),
    ).not.toBeNull();
  });
});
