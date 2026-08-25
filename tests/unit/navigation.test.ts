import { describe, expect, it } from "vitest";

import {
  applicationHeaderLinks,
  getActiveHeaderItem,
  institutionalHeaderLinks,
  mobileHeaderLinks,
} from "@/config/navigation";

describe("navegação principal", () => {
  it("preserva os alvos canônicos sem antecipar o acesso ao app", () => {
    expect(applicationHeaderLinks.map(({ label }) => label)).toEqual([
      "Aplicação",
      "Como funciona",
      "Benefícios",
    ]);
    expect(institutionalHeaderLinks.map(({ label }) => label)).toEqual([
      "Sobre",
      "Serviços",
      "Projetos",
      "Contato",
    ]);
    expect(mobileHeaderLinks).toHaveLength(7);
  });

  it("mantém Processo como subcapítulo de Serviços", () => {
    expect(getActiveHeaderItem("process")).toBe("services");
    expect(institutionalHeaderLinks.map(({ id }) => id)).not.toContain("process");
  });

  it("não expõe links externos no header principal", () => {
    const externalLinks = mobileHeaderLinks.filter(
      (link) => "external" in link && link.external,
    );

    expect(externalLinks).toHaveLength(0);
  });
});
