import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PUBLIC_STORY_CONTENT } from "@/content/public";

import {
  ApplicationChapterScene,
  isPhase8ApplicationChapterId,
  type Phase8ApplicationChapterId,
} from "./ApplicationChapterScene";
import { STORY_FOOTER_GROUPS } from "./story-footer-data";

function renderScene(chapterId: Phase8ApplicationChapterId) {
  return render(
    <ApplicationChapterScene
      chapterId={chapterId}
      headingId={`${chapterId}-heading`}
    />,
  );
}

describe("ApplicationChapterScene Phase-8 content scenes", () => {
  it("recognizes exactly the six Phase-8 Application chapter identities", () => {
    expect(isPhase8ApplicationChapterId("application-overview")).toBe(
      true,
    );
    expect(
      isPhase8ApplicationChapterId("application-how-it-works"),
    ).toBe(true);
    expect(isPhase8ApplicationChapterId("application-benefits")).toBe(
      true,
    );
    expect(isPhase8ApplicationChapterId("application-demo")).toBe(true);
    expect(isPhase8ApplicationChapterId("application-access")).toBe(true);
    expect(isPhase8ApplicationChapterId("application-terminal")).toBe(true);
    expect(isPhase8ApplicationChapterId("professional-about")).toBe(false);
  });

  it("renders the overview problem, proposition, and human-review flow from typed content", () => {
    const { container } = renderScene("application-overview");
    const content = PUBLIC_STORY_CONTENT["application-overview"];
    const flow = screen.getByRole("list", {
      name: "Problema, proposta e revisão da aplicação",
    });

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      content.title,
    );
    expect(flow).toHaveAttribute(
      "data-application-overview-concept-count",
      "3",
    );
    expect(
      within(flow)
        .getAllByRole("listitem")
        .map((item) => item.querySelector("h3")?.textContent),
    ).toEqual(content.items?.map(({ title }) => title));
    expect(
      container.querySelector('[data-primary-app-access="true"]'),
    ).toBeNull();
    expect(container.querySelector("button")).toBeNull();
  });

  it("renders the exact five approved How steps in canonical order", () => {
    renderScene("application-how-it-works");
    const content = PUBLIC_STORY_CONTENT["application-how-it-works"];
    const steps = screen.getByRole("list", {
      name: "Cinco etapas de como a aplicação funciona",
    });

    expect(steps).toHaveAttribute("data-application-how-step-count", "5");
    expect(
      within(steps)
        .getAllByRole("listitem")
        .map((item) => ({
          label: item.getAttribute("data-application-how-step"),
          title: item.querySelector("h3")?.textContent,
        })),
    ).toEqual(
      content.items?.map(({ label, title }) => ({ label, title })),
    );
    expect(within(steps).queryByRole("button")).toBeNull();
  });

  it("renders four approved benefit groups without unsupported claims or an Access CTA", () => {
    const { container } = renderScene("application-benefits");
    const content = PUBLIC_STORY_CONTENT["application-benefits"];
    const groups = screen.getByRole("list", {
      name: "Quatro grupos de benefícios da aplicação",
    });

    expect(groups).toHaveAttribute("data-application-benefit-count", "4");
    expect(
      within(groups)
        .getAllByRole("listitem")
        .map((item) => item.querySelector("h3")?.textContent),
    ).toEqual(content.items?.map(({ title }) => title));
    expect(groups.textContent).not.toMatch(/\d+%|garantia|precisão absoluta/iu);
    expect(
      container.querySelector('[data-primary-app-access="true"]'),
    ).toBeNull();
  });

  it("mounts APP-04 as an inert structural demonstration with missing-media fallback", () => {
    const { container } = renderScene("application-demo");

    expect(
      container.querySelector('[data-application-scene="demo"]'),
    ).not.toBeNull();
    expect(
      container.querySelector("[data-application-demo-device]"),
    ).toHaveAttribute("data-app04-media-contract", "missing");
    expect(container.querySelector("[data-app04-screen]")).toHaveAttribute(
      "data-simulated-application-ui",
      "inert",
    );
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("button")).toBeNull();
    expect(
      container.querySelector('[data-primary-app-access="true"]'),
    ).toBeNull();
  });

  it("renders the one primary app action only in Access", () => {
    const { container } = renderScene("application-access");
    const primaryActions = container.querySelectorAll<HTMLAnchorElement>(
      '[data-primary-app-access="true"]',
    );
    const primaryAction = primaryActions.item(0);

    expect(primaryActions).toHaveLength(1);
    expect(primaryAction).toHaveAttribute(
      "href",
      "https://app.wflyer.com.br",
    );
    expect(primaryAction).toHaveAttribute("target", "_blank");
    expect(primaryAction).toHaveAttribute(
      "rel",
      expect.stringContaining("noopener"),
    );
    expect(container.querySelector("form")).toBeNull();
  });

  it("places the structural application barline before a shared-data terminal", () => {
    const { container } = renderScene("application-terminal");
    const barline = container.querySelector(
      '[data-final-barline-before="application-terminal"]',
    );
    const terminal = container.querySelector(
      '[data-branch-terminal="application"]',
    );
    const navigation = screen.getByRole("navigation", {
      name: "Conclusão do percurso da aplicação",
    });

    expect(barline).toHaveAttribute(
      "data-score-integration-status",
      "phase-9-pending",
    );
    const terminalPosition =
      barline?.compareDocumentPosition(terminal!) ?? 0;
    expect(
      terminalPosition & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(navigation).toHaveAttribute(
      "data-shared-footer-source",
      "story-footer-groups",
    );
    expect(within(navigation).getAllByRole("heading", { level: 3 })).toHaveLength(
      STORY_FOOTER_GROUPS.length,
    );
    expect(within(navigation).getAllByRole("link")).toHaveLength(
      STORY_FOOTER_GROUPS.reduce((total, group) => total + group.links.length, 0),
    );
    expect(
      container.querySelector('[data-primary-app-access="true"]'),
    ).toBeNull();
  });
});
