import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ScoreTransitionLayer,
  type ScoreTransitionGeometry,
  type ScoreTransitionLayerProps,
} from "./ScoreTransitionLayer";

const geometry = {
  height: 600,
  pivot: { x: 500, y: 100 },
  source: { x: 100, y: 200 },
  target: { x: 900, y: 400 },
  width: 1_000,
} satisfies ScoreTransitionGeometry;

const defaultProps = {
  active: true,
  checkpoint: null,
  direction: "right",
  geometry,
  mode: "adjacent-score",
  reducedMotion: false,
} satisfies ScoreTransitionLayerProps;

function renderLayer(
  overrides: Partial<ScoreTransitionLayerProps> = {},
) {
  return render(<ScoreTransitionLayer {...defaultProps} {...overrides} />);
}

describe("ScoreTransitionLayer", () => {
  it("stays outside the accessibility and interaction surfaces", () => {
    const { container } = renderLayer();
    const layer = container.querySelector<HTMLElement>(
      "[data-score-transition-layer]",
    );
    const svg = layer?.querySelector("svg");

    expect(layer).toHaveAttribute("aria-hidden", "true");
    expect(layer).toHaveAttribute("inert");
    expect(layer).toHaveAttribute("data-active", "true");
    expect(layer).toHaveAttribute("data-transition-mode", "adjacent-score");
    expect(layer?.className).toContain("transitionLayer");
    expect(svg).toHaveAttribute("focusable", "false");
    expect(svg).toHaveAttribute("preserveAspectRatio", "none");
  });

  it("renders one deterministic segment for adjacent travel", () => {
    const { container } = renderLayer();
    const segment = container.querySelector("[data-transition-segment]");
    const firstStaffLine = segment?.querySelector(
      "[data-transition-staff-line]",
    );

    expect(container.querySelector("svg")).toHaveAttribute(
      "viewBox",
      "0 0 1000 600",
    );
    expect(container.querySelectorAll("[data-transition-segment]")).toHaveLength(
      1,
    );
    expect(segment).toHaveAttribute("data-segment-id", "direct");
    expect(
      segment?.querySelectorAll("[data-transition-staff-line]"),
    ).toHaveLength(5);
    expect(segment?.querySelectorAll("[data-transition-note]")).toHaveLength(3);
    expect(firstStaffLine).toHaveAttribute(
      "d",
      "M 100 188 C 356 260, 644 316, 900 388",
    );
    expect(segment?.querySelector("[data-transition-note]")).toHaveAttribute(
      "transform",
      "translate(324 256)",
    );
  });

  it("uses the same bounded representation for a compressed jump", () => {
    const { container } = renderLayer({
      direction: "left",
      mode: "compressed-score-jump",
    });

    expect(container.querySelectorAll("[data-transition-segment]")).toHaveLength(
      1,
    );
    expect(container.querySelectorAll("[data-transition-note]")).toHaveLength(3);
    expect(
      container.querySelector("[data-score-transition-layer]"),
    ).toHaveAttribute("data-direction", "left");
  });

  it("represents cross-branch travel with at most two segments and six notes", () => {
    const { container } = renderLayer({ mode: "home-pivot" });
    const segments = container.querySelectorAll("[data-transition-segment]");

    expect(segments).toHaveLength(2);
    expect(segments[0]).toHaveAttribute("data-segment-id", "to-home");
    expect(segments[1]).toHaveAttribute("data-segment-id", "from-home");
    expect(container.querySelectorAll("[data-transition-staff-line]")).toHaveLength(
      10,
    );
    expect(container.querySelectorAll("[data-transition-note]")).toHaveLength(6);
  });

  it.each([
    ["idle", { active: false }],
    ["neutral", { mode: "neutral" }],
    ["reduced motion", { reducedMotion: true }],
    ["missing geometry", { geometry: null }],
  ] satisfies ReadonlyArray<
    readonly [string, Partial<ScoreTransitionLayerProps>]
  >)("suppresses animated score marks for %s", (_state, overrides) => {
    const { container } = renderLayer(overrides);

    expect(container.querySelectorAll("[data-transition-segment]")).toHaveLength(
      0,
    );
    expect(container.querySelectorAll("[data-transition-note]")).toHaveLength(0);
  });

  it("exposes deterministic checkpoint metadata without adding live semantics", () => {
    const { container } = renderLayer({ checkpoint: "midpoint" });
    const layer = container.querySelector("[data-score-transition-layer]");

    expect(layer).toHaveAttribute("data-checkpoint", "midpoint");
    expect(layer).not.toHaveAttribute("role");
    expect(layer).not.toHaveAttribute("aria-live");
  });
});
