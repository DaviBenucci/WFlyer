import { describe, expect, it } from "vitest";

import { pageSeo, publicRoutes } from "@/config/seo";
import {
  legalDocuments,
  portfolioContent,
  serviceDetails,
} from "@/content/site-content";

const expectedRoutes = [
  "/",
  "/aplicacao-wflyer",
  "/aplicacao-wflyer/como-funciona",
  "/aplicacao-wflyer/beneficios",
  "/sobre",
  "/servicos",
  "/processo",
  "/portfolio",
  "/contato",
  "/servicos/criacao-de-sites",
  "/servicos/criacao-de-aplicacoes",
  "/servicos/integracoes",
  "/servicos/solucoes-sob-medida",
  "/politica-de-privacidade",
  "/politica-de-cookies",
  "/termos-de-uso",
  "/acessibilidade",
] as const;

describe("conteúdo público tipado", () => {
  it("mantém exatamente as 17 rotas públicas aprovadas", () => {
    expect(publicRoutes).toEqual(expectedRoutes);
    expect(Object.keys(pageSeo)).toEqual(expectedRoutes);
  });

  it("oferece título e descrição únicos para cada rota", () => {
    const entries = Object.values(pageSeo);
    const titles = entries.map(({ title }) => title);
    const descriptions = entries.map(({ description }) => description);

    expect(new Set(titles).size).toBe(expectedRoutes.length);
    expect(new Set(descriptions).size).toBe(expectedRoutes.length);

    for (const { description, title } of entries) {
      expect(title.trim().length).toBeGreaterThan(0);
      expect(description.trim().length).toBeGreaterThan(0);
    }
  });

  it("limita o portfólio aos três projetos autorizados", () => {
    expect(portfolioContent.projects.map(({ name }) => name)).toEqual([
      "W_Flyer",
      "MSN Distribuidora",
      "MSN Suprimentos",
    ]);
    expect(
      portfolioContent.projects.every(
        (project) => !("metrics" in project || "testimonial" in project),
      ),
    ).toBe(true);
  });

  it("mantém quatro detalhes de serviço e quatro documentos legais", () => {
    expect(Object.keys(serviceDetails)).toEqual([
      "/servicos/criacao-de-sites",
      "/servicos/criacao-de-aplicacoes",
      "/servicos/integracoes",
      "/servicos/solucoes-sob-medida",
    ]);
    expect(Object.keys(legalDocuments)).toEqual([
      "/politica-de-privacidade",
      "/politica-de-cookies",
      "/termos-de-uso",
      "/acessibilidade",
    ]);

    for (const document of Object.values(legalDocuments)) {
      expect(document.updatedAt).toBe("29 de julho de 2026");
      expect(document.sections.length).toBeGreaterThanOrEqual(4);
      expect(new Set(document.sections.map(({ id }) => id)).size).toBe(
        document.sections.length,
      );
    }
  });
});
