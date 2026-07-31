import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  applicationContent,
  benefitsContent,
  howItWorksContent,
  servicesContent,
} from "@/content/site-content";

import {
  ApplicationFeatureStrip,
  BenefitsGrid,
  ContactWorkspace,
  ServiceSolutionGrid,
  StepSequence,
} from "./ArchetypeBlocks";
import { PageIcon } from "./PageIcons";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

describe("blocos visuais dos arquétipos", () => {
  it("entrega a faixa de cinco benefícios como lista semântica", () => {
    render(
      <ApplicationFeatureStrip items={applicationContent.highlights} />,
    );

    const list = screen.getByRole("list", {
      name: "Benefícios em destaque",
    });

    expect(within(list).getAllByRole("listitem")).toHaveLength(5);
    expect(within(list).getAllByRole("heading", { level: 3 })).toHaveLength(
      5,
    );
  });

  it("preserva a ordem acessível das cinco etapas da aplicação", () => {
    render(
      <StepSequence
        branch="application"
        steps={howItWorksContent.steps}
      />,
    );

    const sequence = screen.getByRole("list");
    const items = within(sequence).getAllByRole("listitem");

    expect(sequence.tagName).toBe("OL");
    expect(items).toHaveLength(5);
    expect(items[0]).toHaveTextContent("01");
    expect(items[4]).toHaveTextContent("05");
    expect(items[0]).toHaveTextContent("Escolha a partitura");
    expect(items[4]).toHaveTextContent("Exporte ou continue");
  });

  it("expõe benefícios e serviços com ícones decorativos originais", () => {
    const { container, rerender } = render(
      <BenefitsGrid items={benefitsContent.benefits} />,
    );

    expect(
      container.querySelectorAll("[data-page-icon]"),
    ).toHaveLength(6);
    expect(
      Array.from(container.querySelectorAll("[data-page-icon]")).every(
        (icon) => icon.getAttribute("aria-hidden") === "true",
      ),
    ).toBe(true);

    rerender(
      <ServiceSolutionGrid services={servicesContent.services} />,
    );

    expect(screen.getAllByRole("link")).toHaveLength(4);
    expect(
      screen.getByRole("link", {
        name: "Conhecer criação de sites",
      }),
    ).toHaveAttribute("href", "/servicos/criacao-de-sites");
  });

  it("mantém o shell de contato honestamente indisponível", () => {
    render(
      <ContactWorkspace
        email="davi.benucci@wflyer.com.br"
        githubUrl="https://github.com/DaviBenucci"
        instagramUrl="https://www.instagram.com/davibenucci/"
      />,
    );

    const form = screen.getByRole("form", {
      name: "Formulário de contato em preparação",
    });

    expect(within(form).getByLabelText("Nome")).toBeDisabled();
    expect(within(form).getByLabelText("E-mail")).toBeDisabled();
    expect(
      within(form).getByRole("button", { name: "Enviar mensagem" }),
    ).toBeDisabled();
    expect(
      within(form).getByText(/use o e-mail oficial/u),
    ).toBeVisible();
  });

  it("mantém o catálogo de ícones estritamente decorativo", () => {
    const { container } = render(<PageIcon name="integrations" />);
    const icon = container.querySelector("svg");

    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveAttribute("focusable", "false");
    expect(icon).toHaveAttribute("data-page-icon", "integrations");
    expect(icon?.querySelectorAll("circle")).toHaveLength(3);
  });
});
