import { describe, expect, it } from "vitest";

import {
  evaluateLinkEligibility,
  isUnmodifiedPrimaryActivation,
  type LinkActivation,
  type LinkCandidate,
  type LinkIneligibilityReason,
} from "./eligibility";

const primaryActivation = {
  button: 0,
  defaultPrevented: false,
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
} as const satisfies LinkActivation;

function expectIneligible(
  activation: LinkActivation,
  link: LinkCandidate,
  reason: LinkIneligibilityReason,
  currentUrl = "https://wflyer.com.br/sobre",
) {
  expect(
    evaluateLinkEligibility(activation, link, currentUrl),
  ).toStrictEqual({ eligible: false, reason });
}

describe("isUnmodifiedPrimaryActivation", () => {
  it("accepts primary pointer and synthesized keyboard clicks", () => {
    expect(isUnmodifiedPrimaryActivation(primaryActivation)).toBe(true);
  });

  it.each(["metaKey", "ctrlKey", "shiftKey", "altKey"] as const)(
    "rejects the %s modifier",
    (modifier) => {
      expect(
        isUnmodifiedPrimaryActivation({
          ...primaryActivation,
          [modifier]: true,
        }),
      ).toBe(false);
    },
  );
});

describe("evaluateLinkEligibility", () => {
  it("accepts an unmodified pointer activation between main chapters", () => {
    expect(
      evaluateLinkEligibility(
        primaryActivation,
        { href: "/processo" },
        "https://wflyer.com.br/servicos?origin=header",
      ),
    ).toMatchObject({
      eligible: true,
      sourcePathname: "/servicos",
      destinationPathname: "/processo",
      destinationHref: "https://wflyer.com.br/processo",
      transition: {
        mode: "adjacent-score",
        direction: "right",
      },
    });
  });

  it("accepts the same click shape produced by keyboard Enter", () => {
    expect(
      evaluateLinkEligibility(
        { ...primaryActivation, button: 0 },
        { href: "/contato" },
        new URL("https://wflyer.com.br/processo"),
      ).eligible,
    ).toBe(true);
  });

  it.each([
    [
      { ...primaryActivation, defaultPrevented: true },
      { href: "/contato" },
      "default-prevented",
    ],
    [
      { ...primaryActivation, button: 1 },
      { href: "/contato" },
      "non-primary-button",
    ],
    [
      { ...primaryActivation, button: 2 },
      { href: "/contato" },
      "non-primary-button",
    ],
    [
      { ...primaryActivation, metaKey: true },
      { href: "/contato" },
      "modified-activation",
    ],
    [
      { ...primaryActivation, ctrlKey: true },
      { href: "/contato" },
      "modified-activation",
    ],
    [
      { ...primaryActivation, shiftKey: true },
      { href: "/contato" },
      "modified-activation",
    ],
    [
      { ...primaryActivation, altKey: true },
      { href: "/contato" },
      "modified-activation",
    ],
  ] as const)("keeps special activation native", (activation, link, reason) => {
    expectIneligible(activation, link, reason);
  });

  it.each([
    [{ href: null }, "missing-href"],
    [{ href: "  " }, "missing-href"],
    [{ href: "/contato", download: true }, "download"],
    [{ href: "/contato", enhancementOptOut: true }, "explicit-native"],
    [{ href: "/contato", target: "_blank" }, "new-context"],
    [{ href: "https://app.wflyer.com.br" }, "external-origin"],
    [{ href: "mailto:davi.benucci@wflyer.com.br" }, "unsupported-protocol"],
    [{ href: "#main-content" }, "hash-destination"],
    [{ href: "/contato#formulario" }, "hash-destination"],
    [{ href: "/sobre?variant=two" }, "same-pathname"],
    [{ href: "/servicos/criacao-de-sites" }, "destination-not-main-chapter"],
    [{ href: "/politica-de-privacidade" }, "destination-not-main-chapter"],
    [{ href: "/not-a-route" }, "destination-not-main-chapter"],
    [{ href: "http://[" }, "invalid-destination-url"],
  ] as const)("keeps %j native (%s)", (link, reason) => {
    expectIneligible(primaryActivation, link, reason);
  });

  it("enhances an explicit _self target in the current browsing context", () => {
    const result = evaluateLinkEligibility(
      primaryActivation,
      { href: "/contato", target: "_self" },
      "https://wflyer.com.br/sobre",
    );

    expect(result).toMatchObject({
      eligible: true,
      destinationPathname: "/contato",
    });
  });

  it("does not enhance links from auxiliary pages", () => {
    expectIneligible(
      primaryActivation,
      { href: "/servicos" },
      "source-not-main-chapter",
      "https://wflyer.com.br/servicos/integracoes",
    );
  });

  it("rejects an invalid browsing URL without throwing", () => {
    expectIneligible(
      primaryActivation,
      { href: "/servicos" },
      "invalid-current-url",
      "not-an-absolute-url",
    );
  });

  it("allows query data on a different main chapter without changing topology", () => {
    const result = evaluateLinkEligibility(
      primaryActivation,
      { href: "/contato?origin=portfolio" },
      "https://wflyer.com.br/processo",
    );

    expect(result).toMatchObject({
      eligible: true,
      destinationPathname: "/contato",
      destinationHref: "https://wflyer.com.br/contato?origin=portfolio",
    });
  });
});
