import { describe, expect, it } from "vitest";

import { classifyScoreTransition } from "./topology";
import {
  createScoreTransitionPath,
  DEFAULT_TRANSITION_VIEWPORT,
  destinationAnchorKind,
  normalizeViewport,
  pointBetween,
  resolveTransitionGeometry,
  resolveTransitionSegments,
  sourceAnchorKind,
  type ScoreTransitionGeometry,
} from "./geometry";

describe("runtime transition geometry", () => {
  it("uses deterministic viewport defaults for invalid dimensions", () => {
    expect(normalizeViewport({ width: 0, height: Number.NaN })).toStrictEqual(
      DEFAULT_TRANSITION_VIEWPORT,
    );
  });

  it("selects exit-to-entry while moving away and entry-to-exit while returning", () => {
    const away = classifyScoreTransition("/servicos", "/processo");
    const returning = classifyScoreTransition("/processo", "/servicos");


    expect([sourceAnchorKind(away), destinationAnchorKind(away)]).toEqual([
      "exit",
      "entry",
    ]);
    expect([
      sourceAnchorKind(returning),
      destinationAnchorKind(returning),
    ]).toEqual(["entry", "exit"]);
  });

  it("uses the runtime manifest anchors", () => {
    const transition = classifyScoreTransition("/servicos", "/processo");

    expect(
      resolveTransitionGeometry(transition, { width: 1_000, height: 800 }),
    ).toStrictEqual({
      height: 800,
      source: { x: 1_000, y: 592 },
      target: { x: 0, y: 592 },
      width: 1_000,
    });
  });

  it("prefers finite DOM measurements without applying a second clamp", () => {
    const transition = classifyScoreTransition("/sobre", "/servicos");

    expect(
      resolveTransitionGeometry(
        transition,
        { width: 1_000, height: 800 },
        {
          destination: { x: 1_040, y: 900 },
          source: { x: -20, y: 320 },
        },
      ),
    ).toStrictEqual({
      height: 800,
      source: { x: -20, y: 320 },
      target: { x: 1_040, y: 900 },
      width: 1_000,
    });
  });

  it("replaces invalid DOM points with current manifest fallbacks", () => {
    const transition = classifyScoreTransition("/sobre", "/servicos");
    const geometry = resolveTransitionGeometry(
      transition,
      { width: 1_000, height: 800 },
      {
        destination: { x: 10, y: Number.NaN },
        source: { x: Number.NaN, y: 20 },
      },
    );

    expect(geometry).toMatchObject({
      source: { x: 1_000, y: 544 },
      target: { x: 0, y: 544 },
    });
  });
});

describe("runtime transition drawing", () => {
  const geometry = {
    height: 600,
      source: { x: 100, y: 200 },
    target: { x: 900, y: 400 },
    width: 1_000,
  } satisfies ScoreTransitionGeometry;

  it("creates the exact direct segment rendered for adjacent and compressed travel", () => {
    expect(resolveTransitionSegments(geometry, "adjacent-score")).toEqual([
      {
        end: geometry.target,
        id: "direct",
        start: geometry.source,
      },
    ]);
    expect(resolveTransitionSegments(geometry, "compressed-score-jump")).toEqual(
      resolveTransitionSegments(geometry, "adjacent-score"),
    );
    expect(
      createScoreTransitionPath(
        geometry.source,
        geometry.target,
        -12,
        0,
      ),
    ).toBe("M 100 188 C 356 260, 644 316, 900 388");
    expect(pointBetween(geometry.source, geometry.target, 0.28)).toEqual({
      x: 324,
      y: 256,
    });
  });

  it("creates no decorative segment for neutral replacement", () => {
    expect(resolveTransitionSegments(geometry, "neutral")).toEqual([]);
  });
});
