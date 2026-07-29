import { describe, expect, it } from "vitest";

import {
  applicationHeaderLinks,
  getActiveHeaderItem,
  institutionalHeaderLinks,
  mobileHeaderLinks,
} from "@/config/navigation";

describe("navegação principal", () => {
  it("preserva quatro itens em cada lado do símbolo", () => {
    expect(applicationHeaderLinks.map(({ label }) => label)).toEqual([
      "Aplicação",
      "Como funciona",
      "Benefícios",
      "Acessar app",
    ]);
    expect(institutionalHeaderLinks.map(({ label }) => label)).toEqual([
      "Empresa",
      "Serviços",
      "Portfólio",
      "Contato",
    ]);
    expect(mobileHeaderLinks).toHaveLength(8);
  });

  it("mantém Processo como subcapítulo de Serviços", () => {
    expect(getActiveHeaderItem("process")).toBe("services");
    expect(institutionalHeaderLinks.map(({ id }) => id)).not.toContain("process");
  });

  it("expõe Acessar app como único link externo do header", () => {
    const externalLinks = mobileHeaderLinks.filter(
      (link) => "external" in link && link.external,
    );

    expect(externalLinks).toHaveLength(1);
    expect(externalLinks[0]?.href).toBe("https://app.wflyer.com.br");
  });
});
