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
    ["/", "/sobre", "right"],
    ["/sobre", "/servicos", "right"],
    ["/servicos", "/processo", "right"],
    ["/processo", "/contato", "right"],
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
    (source, destination) => {
      expect(classifyScoreTransition(destination, source)).toMatchObject({
        mode: "adjacent-score",
        direction: "left",
        coordinateDistance: 1,
      });
    },
  );

  it.each([
    ["/", "/contato", "right", "institutional", 4],
    ["/contato", "/", "left", "institutional", -4],
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

  it("treats removed institutional routes as unknown", () => {
    expect(classifyScoreTransition("/aplicacao-wflyer", "/sobre")).toMatchObject({
      mode: "neutral",
      neutralReason: "source-unknown",
    });
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
