import { describe, expect, it } from "vitest";

import { scoreChapters } from "@/config/chapters";

import { classifyScoreTransition, normalizePathname } from "./topology";

describe("normalizePathname", () => {
  it.each([
    ["", "/"],
    ["/", "/"],
    ["sobre", "/sobre"],
    [" /sobre///?campaign=phase-five#score ", "/sobre"],
    ["https://wflyer.com.br/processo?from=services#heading", "/processo"],
    [new URL("https://wflyer.com.br/contato/?from=portfolio"), "/contato"],
  ])("normalizes %s to %s", (input, expected) => {
    expect(normalizePathname(input)).toBe(expected);
  });
});

describe("classifyScoreTransition", () => {
  const forwardAdjacentRoutes = [
    ["/", "/aplicacao-wflyer", "left"],
    ["/aplicacao-wflyer", "/aplicacao-wflyer/como-funciona", "left"],
    [
      "/aplicacao-wflyer/como-funciona",
      "/aplicacao-wflyer/beneficios",
      "left",
    ],
    ["/", "/sobre", "right"],
    ["/sobre", "/servicos", "right"],
    ["/servicos", "/processo", "right"],
    ["/processo", "/portfolio", "right"],
    ["/portfolio", "/contato", "right"],
  ] as const;

  it.each(forwardAdjacentRoutes)(
    "classifies the adjacent edge %s -> %s",
    (source, destination, direction) => {
      expect(classifyScoreTransition(source, destination)).toMatchObject({
        mode: "adjacent-score",
        direction,
        coordinateDistance: 1,
        neutralReason: null,
      });
    },
  );

  it.each(forwardAdjacentRoutes)(
    "reverses direction for %s <- %s",
    (source, destination, forwardDirection) => {
      const expectedDirection = forwardDirection === "left" ? "right" : "left";

      expect(classifyScoreTransition(destination, source)).toMatchObject({
        mode: "adjacent-score",
        direction: expectedDirection,
        coordinateDistance: 1,
      });
    },
  );

  it.each([
    ["/", "/aplicacao-wflyer/beneficios", "left", "application", -3],
    ["/aplicacao-wflyer/beneficios", "/", "right", "application", 3],
    ["/", "/contato", "right", "institutional", 5],
    ["/contato", "/", "left", "institutional", -5],
    [
      "/aplicacao-wflyer",
      "/aplicacao-wflyer/beneficios",
      "left",
      "application",
      -2,
    ],
    ["/sobre", "/processo", "right", "institutional", 2],
  ] as const)(
    "uses a compressed jump for same-side travel %s -> %s",
    (source, destination, direction, effectiveBranch, coordinateDelta) => {
      expect(classifyScoreTransition(source, destination)).toMatchObject({
        mode: "compressed-score-jump",
        direction,
        effectiveBranch,
        coordinateDelta,
        coordinateDistance: Math.abs(coordinateDelta),
      });
    },
  );

  it.each([
    ["/aplicacao-wflyer", "/sobre", "right", 2],
    ["/aplicacao-wflyer/beneficios", "/contato", "right", 8],
    ["/contato", "/aplicacao-wflyer/como-funciona", "left", -7],
    ["/processo", "/aplicacao-wflyer", "left", -4],
  ] as const)(
    "uses Home as a conceptual pivot for %s -> %s",
    (source, destination, direction, coordinateDelta) => {
      expect(classifyScoreTransition(source, destination)).toMatchObject({
        mode: "home-pivot",
        direction,
        coordinateDelta,
        coordinateDistance: Math.abs(coordinateDelta),
        effectiveBranch: null,
        neutralReason: null,
      });
    },
  );

  it("never treats Home as a cross-branch endpoint", () => {
    for (const chapter of scoreChapters.filter(({ id }) => id !== "home")) {
      expect(classifyScoreTransition("/", chapter.route).mode).not.toBe(
        "home-pivot",
      );
      expect(classifyScoreTransition(chapter.route, "/").mode).not.toBe(
        "home-pivot",
      );
    }
  });

  it.each([
    ["/sobre", "/sobre/", "same-route"],
    ["/servicos/criacao-de-sites", "/sobre", "source-auxiliary"],
    ["/sobre", "/politica-de-privacidade", "destination-auxiliary"],
    ["/missing", "/sobre", "source-unknown"],
    ["/sobre", "/missing", "destination-unknown"],
    [
      "/politica-de-cookies",
      "/servicos/integracoes",
      "both-not-main-chapters",
    ],
    ["/missing-a", "/missing-b", "both-not-main-chapters"],
  ] as const)(
    "returns a neutral transition for %s -> %s",
    (source, destination, neutralReason) => {
      expect(classifyScoreTransition(source, destination)).toMatchObject({
        mode: "neutral",
        direction: "none",
        coordinateDelta: null,
        coordinateDistance: null,
        effectiveBranch: null,
        neutralReason,
      });
    },
  );

  it("returns manifest chapters instead of duplicating route metadata", () => {
    const transition = classifyScoreTransition("/servicos", "/processo");

    expect(transition.sourceChapter).toBe(
      scoreChapters.find(({ route }) => route === "/servicos"),
    );
    expect(transition.destinationChapter).toBe(
      scoreChapters.find(({ route }) => route === "/processo"),
    );
  });
});
