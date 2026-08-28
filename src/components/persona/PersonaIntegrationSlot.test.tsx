import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PersonaIntegrationSlot } from "./PersonaIntegrationSlot";

describe("PersonaIntegrationSlot", () => {
  it("exposes the required pending About contract and static fallback", () => {
    const { container } = render(<PersonaIntegrationSlot />);
    const slot = screen.getByRole("region", {
      name: "Contrato de integração da Persona W_Flyer",
    });

    expect(slot).toHaveAttribute("data-persona-integration-slot", "");
    expect(slot).toHaveAttribute("data-persona-slot", "required");
    expect(slot).toHaveAttribute(
      "data-persona-status",
      "pending-owner-approval",
    );
    expect(slot).toHaveAttribute("data-persona-static-fallback", "active");
    expect(slot).toHaveAttribute("data-persona-phase-10", "deferred");
    expect(screen.getByRole("status")).toHaveTextContent(
      /obrigatória na seção Sobre.*aprovação do titular/u,
    );
    expect(screen.getByText("Alternativa estática ativa")).toBeVisible();
    expect(screen.getByText(/sem imagem, movimento ou JavaScript/u)).toBeVisible();
    expect(screen.getByText(/adiados para a Fase 10/u)).toBeVisible();

    expect(container.querySelector("img, svg, canvas")).toBeNull();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("accepts a layout class without changing the stable contract", () => {
    render(<PersonaIntegrationSlot className="about-layout-slot" />);

    const slot = screen.getByRole("region", {
      name: "Contrato de integração da Persona W_Flyer",
    });
    expect(slot).toHaveClass("about-layout-slot");
    expect(slot).toHaveAttribute("data-persona-slot", "required");
  });
});
