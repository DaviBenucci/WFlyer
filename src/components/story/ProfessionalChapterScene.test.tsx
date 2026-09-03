import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  PROCESS_STEPS,
  PUBLIC_SERVICES,
  getFeaturedPublicProjects,
} from "@/content/public";

import {
  isProfessionalChapterId,
  ProfessionalChapterScene,
  type ProfessionalChapterId,
} from "./ProfessionalChapterScene";
import { StoryGlobalFooter } from "./StoryGlobalFooter";

vi.mock("@/components/pages/contact", () => ({
  ContactForm: ({
    compact,
    deferVerificationUntilInteraction,
  }: {
    readonly compact?: boolean;
    readonly deferVerificationUntilInteraction?: boolean;
  }) => (
    <form
      aria-label="Formulário de contato"
      data-compact={compact ? "true" : "false"}
      data-deferred={deferVerificationUntilInteraction ? "true" : "false"}
    />
  ),
  ContactFormFallback: () => <p>Carregando formulário</p>,
}));

function renderScene(chapterId: ProfessionalChapterId) {
  return render(
    <ProfessionalChapterScene
      chapterId={chapterId}
      headingId={`${chapterId}-heading`}
    />,
  );
}

describe("ProfessionalChapterScene", () => {
  it("recognizes only the six professional chapter identities", () => {
    expect(isProfessionalChapterId("professional-about")).toBe(true);
    expect(isProfessionalChapterId("professional-terminal")).toBe(true);
    expect(isProfessionalChapterId("home")).toBe(false);
    expect(isProfessionalChapterId("application-overview")).toBe(false);
  });

  it("renders the mandatory pending Persona contract without invented media", () => {
    const { container } = renderScene("professional-about");

    expect(screen.getByRole("heading", { level: 2 })).toHaveAttribute(
      "id",
      "professional-about-heading",
    );
    expect(
      container.querySelector("[data-persona-integration-slot]"),
    ).toBeInTheDocument();
    expect(container.querySelector("img, svg, canvas, video")).toBeNull();
  });

  it("renders exactly four service modules from the typed public domain", () => {
    const { container } = renderScene("professional-services");
    const list = screen.getByRole("list", { name: "Quatro frentes de serviço" });

    expect(list.children).toHaveLength(4);
    expect(list).toHaveAttribute("data-service-module-count", "4");
    for (const service of PUBLIC_SERVICES) {
      expect(container.querySelector(`[data-service-module="${service.slug}"]`))
        .toBeInTheDocument();
      expect(screen.getByRole("link", { name: new RegExp(service.eyebrow.replace("Serviços · ", ""), "iu") }))
        .toHaveAttribute("href", service.route);
    }
  });

  it("keeps the four process stages in canonical order without controls", () => {
    renderScene("professional-process");
    const list = screen.getByRole("list", { name: "Quatro etapas do processo" });

    expect(list).toHaveAttribute("data-process-stage-count", "4");
    expect(
      within(list)
        .getAllByRole("listitem")
        .map((item) => item.querySelector("h3")?.textContent),
    ).toEqual(PROCESS_STEPS.map(({ title }) => title));
    expect(within(list).queryByRole("button")).toBeNull();
  });

  it("renders only featured public projects with their retained detail routes", () => {
    renderScene("professional-projects");

    for (const project of getFeaturedPublicProjects()) {
      expect(
        screen.getByRole("link", {
          name: new RegExp(`projeto ${project.title}`, "iu"),
        }),
      ).toHaveAttribute("href", project.route);
    }
  });

  it("embeds the protected Contact form and publishes the Persona exclusion", () => {
    const { container } = renderScene("professional-contact");
    const scene = container.querySelector('[data-professional-scene="contact"]');
    const form = screen.getByRole("form", { name: "Formulário de contato" });

    expect(scene).toHaveAttribute("data-persona-optional-appearance", "forbidden");
    expect(form).toHaveAttribute("data-compact", "true");
    expect(form).toHaveAttribute("data-deferred", "true");
    expect(screen.getByRole("link", { name: siteConfigEmailPattern() })).toHaveAttribute(
      "href",
      expect.stringMatching(/^mailto:/u),
    );
  });

  it("places the structural final barline before the professional terminal", () => {
    const { container } = renderScene("professional-terminal");
    const barline = container.querySelector(
      '[data-final-barline-before="professional-terminal"]',
    );
    const terminal = container.querySelector(
      '[data-branch-terminal="professional"]',
    );

    expect(barline).toHaveAttribute(
      "data-score-integration-status",
      "phase-9-integrated",
    );
    expect(terminal).toBeInTheDocument();
    expect(
      barline?.compareDocumentPosition(terminal as Node) ?? 0,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    const terminalNavigation = screen.getByRole("navigation", {
      name: "Conclusão do percurso profissional",
    });
    expect(terminalNavigation).toBeInTheDocument();

    render(<StoryGlobalFooter />);
    const globalFooterNavigation = screen.getByRole("navigation", {
      name: "Rodapé",
    });
    const linkSignature = (root: HTMLElement) =>
      within(root)
        .getAllByRole("link")
        .map((link) => [link.textContent, link.getAttribute("href")]);

    expect(linkSignature(terminalNavigation)).toEqual(
      linkSignature(globalFooterNavigation),
    );
  });
});

function siteConfigEmailPattern() {
  return /davi\.benucci@wflyer\.com\.br/iu;
}
