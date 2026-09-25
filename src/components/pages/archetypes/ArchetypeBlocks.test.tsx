import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  servicesContent,
} from "@/content/site-content";

import {
  ContactWorkspace,
  ServiceSolutionGrid,
} from "./ArchetypeBlocks";
import { PageIcon } from "./PageIcons";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("blocos visuais dos arquétipos", () => {
  it("expõe serviços profissionais com links acessíveis", () => {
    render(<ServiceSolutionGrid services={servicesContent.services} />);
    expect(screen.getAllByRole("link")).toHaveLength(4);
    expect(screen.getByRole("link", { name: "Conhecer criação de sites" })).toHaveAttribute("href", "/servicos/criacao-de-sites");
  });

  it("mantém o formulário operável e falha fechado sem Turnstile", () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", undefined);

    render(
      <ContactWorkspace
        email="davi.benucci@wflyer.com.br"
        githubUrl="https://github.com/DaviBenucci"
        instagramUrl="https://www.instagram.com/davibenucci/"
      />,
    );

    const form = screen.getByRole("form", {
      name: "Formulário de contato",
    });

    expect(within(form).getByLabelText("Nome")).toBeEnabled();
    expect(within(form).getByLabelText("E-mail")).toBeEnabled();
    expect(
      within(form).getByRole("button", { name: "Enviar mensagem" }),
    ).toBeDisabled();
    expect(
      within(form).getByText(/verificação de segurança está indisponível/u),
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
