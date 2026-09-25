import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SiteHeader } from "./SiteHeader";

const navigationMock = vi.hoisted(() => ({
  pathname: "/",
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigationMock.pathname,
}));

describe("SiteHeader", () => {
  beforeEach(() => {
    navigationMock.pathname = "/";
  });

  it("mantém os grupos, destinos e símbolo central normativos", () => {
    const { container } = render(<SiteHeader />);

    expect(screen.getByRole("navigation", { name: "Navegação profissional" })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Acessar (?:app|W_Flyer)/u }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Sobre" })[0]).toHaveAttribute(
      "href",
      "/sobre",
    );
    expect(screen.queryByRole("link", { name: "Projetos" })).toBeNull();
    expect(
      screen.getAllByRole("link", {
        name: "W_Flyer — voltar à página inicial",
      })[0],
    ).toHaveAttribute("href", "/");
    expect(container.querySelector("[data-brand-intro-header]")).not.toBeNull();
    expect(
      container.querySelectorAll("[data-brand-intro-header-pivot]"),
    ).toHaveLength(2);
    expect(
      container.querySelectorAll("[data-brand-intro-header-score]"),
    ).toHaveLength(4);
    expect(
      container.querySelectorAll("[data-brand-intro-header-score-lines]"),
    ).toHaveLength(4);
    expect(
      container.querySelectorAll("[data-brand-intro-header-score-detail]"),
    ).toHaveLength(12);
    expect(
      container.querySelectorAll("[data-brand-intro-header-label]"),
    ).toHaveLength(4);
  });

  it("indica Processo como subcompasso ativo de Serviços", () => {
    render(<SiteHeader pathname="/processo" />);

    const serviceLinks = screen.getAllByRole("link", {
      name: /Serviços.*Processo — etapa atual/u,
    });

    expect(serviceLinks[0]).toHaveAttribute("aria-current", "step");
    expect(
      screen.queryByRole("link", { name: "Processo" }),
    ).not.toBeInTheDocument();
  });

  it("fecha o menu por Escape e devolve foco ao disparador", async () => {
    const user = userEvent.setup();
    render(
      <SiteHeader
        themeControl={
          <button aria-label="Alternar tema" type="button">
            Tema
          </button>
        }
      />,
    );
    const trigger = screen.getByRole("button", { name: "Abrir menu" });

    await user.click(trigger);

    expect(
      screen.getByRole("dialog", { name: "Navegação W_Flyer" }),
    ).toBeInTheDocument();
    expect(
      screen
        .getByRole("dialog", { name: "Navegação W_Flyer" })
        .querySelector("button"),
    ).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("fecha o menu após seleção de rota", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    const dialog = screen.getByRole("dialog", { name: "Navegação W_Flyer" });
    const professionalLink = Array.from(
      dialog.querySelectorAll<HTMLAnchorElement>("a"),
    ).find((link) => link.textContent?.includes("Sobre"));

    expect(professionalLink).toBeDefined();
    professionalLink?.addEventListener("click", (event) => {
      event.preventDefault();
    });

    await user.click(professionalLink!);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
