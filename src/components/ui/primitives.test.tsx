import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button, LinkButton } from "./button";
import { ArrowIcon, SunIcon } from "./icons";
import { Card, Container, Surface } from "./layout";
import { Eyebrow, Heading, Text } from "./typography";

describe("Button", () => {
  it("preserva a semântica nativa, o tipo seguro e o ref", () => {
    const ref = createRef<HTMLButtonElement>();

    render(
      <Button ref={ref} name="action">
        Continuar
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Continuar" });

    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("name", "action");
    expect(ref.current).toBe(button);
  });

  it("expõe disabled nativo e impede ação com aria-disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <>
        <Button disabled>Indisponível</Button>
        <Button aria-disabled onClick={onClick}>
          Sem ação
        </Button>
      </>,
    );

    expect(
      screen.getByRole("button", { name: "Indisponível" }),
    ).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Sem ação" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("mantém botão somente com ícone nomeado", () => {
    render(
      <Button aria-label="Avançar" iconOnly>
        <ArrowIcon />
      </Button>,
    );

    expect(screen.getByRole("button", { name: "Avançar" })).toBeVisible();
  });
});

describe("LinkButton", () => {
  it("continua sendo link real e sinaliza destino externo", () => {
    render(
      <LinkButton external href="https://app.wflyer.com.br">
        Acessar aplicação
      </LinkButton>,
    );

    const link = screen.getByRole("link", { name: "Acessar aplicação" });

    expect(link).toHaveAttribute("href", "https://app.wflyer.com.br");
    expect(link).toHaveAttribute("data-external", "true");
  });

  it("protege destinos que abrem uma nova aba", () => {
    render(
      <LinkButton href="https://example.com" target="_blank">
        Referência
      </LinkButton>,
    );

    const link = screen.getByRole("link", { name: "Referência" });
    const rel = link.getAttribute("rel");

    expect(rel?.split(" ")).toEqual(
      expect.arrayContaining(["noopener", "noreferrer"]),
    );
    expect(link).toHaveAccessibleDescription("Abre em nova aba");
  });
});

describe("layout primitives", () => {
  it("mantém Card como article e encaminha atributos", () => {
    render(
      <Card aria-labelledby="card-title" interactive>
        <h2 id="card-title">Serviço</h2>
      </Card>,
    );

    const card = screen.getByRole("article", { name: "Serviço" });

    expect(card).toHaveAttribute("data-interactive", "true");
  });

  it("encaminha refs de Surface e Container", () => {
    const surfaceRef = createRef<HTMLDivElement>();
    const containerRef = createRef<HTMLDivElement>();

    render(
      <Container ref={containerRef}>
        <Surface ref={surfaceRef}>Conteúdo</Surface>
      </Container>,
    );

    expect(surfaceRef.current).toHaveTextContent("Conteúdo");
    expect(containerRef.current).toContainElement(surfaceRef.current);
  });
});

describe("typography primitives", () => {
  it("permite escolher o nível semântico do heading", () => {
    render(
      <>
        <Eyebrow>Capítulo</Eyebrow>
        <Heading as="h1">Título editorial</Heading>
        <Text tone="muted">Texto de apoio.</Text>
      </>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Título editorial" }),
    ).toBeVisible();
    expect(screen.getByText("Capítulo").tagName).toBe("P");
    expect(screen.getByText("Texto de apoio.").tagName).toBe("P");
  });
});

describe("icons", () => {
  it("é decorativo por padrão e informativo quando recebe título", () => {
    const { container } = render(
      <>
        <ArrowIcon data-testid="decorative-icon" />
        <SunIcon title="Tema claro" />
      </>,
    );

    expect(screen.getByTestId("decorative-icon")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.getByRole("img", { name: "Tema claro" })).toBeVisible();
    expect(container.querySelectorAll("svg")).toHaveLength(2);
  });
});
