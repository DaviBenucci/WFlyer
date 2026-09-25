import { describe, expect, it } from "vitest";

import {
  getActiveHeaderItem,
  institutionalHeaderLinks,
  mobileHeaderLinks,
} from "@/config/navigation";

describe("navegação principal", () => {
  it("preserva apenas os alvos profissionais", () => {
    expect(institutionalHeaderLinks.map(({ label }) => label)).toEqual([
      "Sobre",
      "Serviços",
      "Projetos",
      "Contato",
    ]);
    expect(mobileHeaderLinks).toHaveLength(4);
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
