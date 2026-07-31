import { describe, expect, it } from "vitest";

import { classifyScoreTransition } from "./topology";
import {
  anchorPointFromRect,
  createTransitionSegments,
  DEFAULT_TRANSITION_VIEWPORT,
  getTransitionTravelDistance,
  normalizeViewport,
  resolveTransitionGeometry,
} from "./geometry";

describe("anchor geometry", () => {
  it.each([
    ["left", { x: 100, y: 100 }],
    ["center", { x: 200, y: 100 }],
    ["right", { x: 300, y: 100 }],
  ] as const)("resolves the %s edge from a DOM rectangle", (edge, expected) => {
    expect(
      anchorPointFromRect(
        { left: 100, top: 50, width: 200, height: 100 },
        edge,
        0.5,
      ),
    ).toStrictEqual(expected);
  });

  it("clamps anchor ratios and rejects invalid measurements", () => {
    expect(
      anchorPointFromRect(
        { left: 10, top: 20, width: 40, height: 60 },
        "center",
        2,
      ),
    ).toStrictEqual({ x: 30, y: 80 });
    expect(
      anchorPointFromRect(
        { left: 0, top: 0, width: Number.NaN, height: 20 },
        "left",
        0.5,
      ),
    ).toBeNull();
  });

  it("uses deterministic viewport defaults for invalid dimensions", () => {
    expect(normalizeViewport({ width: 0, height: Number.NaN })).toStrictEqual(
      DEFAULT_TRANSITION_VIEWPORT,
    );
  });
});

describe("transition geometry", () => {
  it("falls back to manifest exit and entry anchors", () => {
    const transition = classifyScoreTransition("/servicos", "/processo");
    const geometry = resolveTransitionGeometry(transition, {
      width: 1_000,
      height: 800,
    });

    expect(geometry.source).toStrictEqual({
      x: 1_000,
      y: 592,
      source: "manifest",
    });
    expect(geometry.destination).toStrictEqual({
      x: 0,
      y: 592,
      source: "manifest",
    });
    expect(geometry.pivot).toStrictEqual({ x: 500, y: 400 });
    expect(geometry.travelDistance).toBe(100);
  });

  it("prefers measured anchors and clamps them to the viewport", () => {
    const transition = classifyScoreTransition("/sobre", "/servicos");
    const geometry = resolveTransitionGeometry(
      transition,
      { width: 1_000, height: 800 },
      {
        source: { x: -20, y: 320 },
        destination: { x: 1_040, y: 900 },
      },
    );

    expect(geometry.source).toStrictEqual({
      x: 0,
      y: 320,
      source: "measured",
    });
    expect(geometry.destination).toStrictEqual({
      x: 1_000,
      y: 800,
      source: "measured",
    });
  });

  it("replaces invalid measured points with manifest geometry", () => {
    const transition = classifyScoreTransition("/sobre", "/servicos");
    const geometry = resolveTransitionGeometry(
      transition,
      { width: 1_000, height: 800 },
      { source: { x: Number.NaN, y: 20 } },
    );

    expect(geometry.source?.source).toBe("manifest");
  });

  it.each([
    ["adjacent-score", 1_000, 100],
    ["compressed-score-jump", 1_000, 140],
    ["home-pivot", 1_000, 180],
    ["neutral", 1_000, 0],
    ["adjacent-score", 390, 31.2],
    ["compressed-score-jump", 390, 39],
    ["home-pivot", 390, 46.8],
  ] as const)(
    "uses bounded deterministic travel for %s at %d px",
    (mode, width, expected) => {
      expect(getTransitionTravelDistance(mode, { width, height: 800 })).toBeCloseTo(
        expected,
      );
    },
  );

  it("creates one deterministic segment for adjacent continuity", () => {
    const transition = classifyScoreTransition("/sobre", "/servicos");
    const geometry = resolveTransitionGeometry(transition, {
      width: 1_000,
      height: 800,
    });

    expect(createTransitionSegments(transition, geometry)).toStrictEqual([
      {
        id: "primary",
        path: "M 1000 544 C 900 544 100 544 0 544",
        start: geometry.source,
        end: geometry.destination,
      },
    ]);
  });

  it("creates one segment for a compressed jump, independent of distance", () => {
    const shortJump = classifyScoreTransition("/sobre", "/processo");
    const longJump = classifyScoreTransition("/", "/contato");
    const viewport = { width: 1_000, height: 800 };

    const shortGeometry = resolveTransitionGeometry(shortJump, viewport);
    const longGeometry = resolveTransitionGeometry(longJump, viewport);

    expect(createTransitionSegments(shortJump, shortGeometry)).toHaveLength(1);
    expect(createTransitionSegments(longJump, longGeometry)).toHaveLength(1);
    expect(shortGeometry.travelDistance).toBe(longGeometry.travelDistance);
  });

  it("creates exactly two paths around the Home pivot", () => {
    const transition = classifyScoreTransition(
      "/aplicacao-wflyer/beneficios",
      "/contato",
    );
    const geometry = resolveTransitionGeometry(transition, {
      width: 1_000,
      height: 800,
    });
    const segments = createTransitionSegments(transition, geometry);

    expect(segments).toHaveLength(2);
    expect(segments.map(({ id }) => id)).toEqual(["pivot-in", "pivot-out"]);
    expect(segments[0]?.end).toStrictEqual({ x: 500, y: 400 });
    expect(segments[1]?.start).toStrictEqual({ x: 500, y: 400 });
  });

  it("does not create decorative segments for neutral replacement", () => {
    const transition = classifyScoreTransition("/sobre", "/sobre");
    const geometry = resolveTransitionGeometry(transition, {
      width: 1_000,
      height: 800,
    });

    expect(createTransitionSegments(transition, geometry)).toEqual([]);
  });
});
