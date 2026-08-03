import { readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { pageSeo, publicRoutes } from "@/config/seo";
import { siteConfig } from "@/config/site";
import {
  applicationContent,
  benefitsContent,
  contactProjectTypes,
  howItWorksContent,
  legalDocuments,
  processContent,
  portfolioContent,
  serviceDetails,
  servicesContent,
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

  it("matches the approved publication profile exactly", async () => {
    const profile = await readFile(
      path.join(
        process.cwd(),
        "docs",
        "04-conteudo",
        "08-perfil-publicacao.yaml",
      ),
      "utf8",
    );
    const approvedProjects = [
      ["W_Flyer", "https://wflyer.com.br"],
      ["MSN Distribuidora", "https://msndistribuidora.com.br"],
      ["MSN Suprimentos", "https://msnsuprimentos.com.br"],
    ] as const;

    expect(siteConfig).toMatchObject({
      applicationUrl: "https://app.wflyer.com.br",
      email: "davi.benucci@wflyer.com.br",
      name: "W_Flyer",
      social: {
        github: "https://github.com/DaviBenucci",
        instagram: "https://www.instagram.com/davibenucci/",
      },
      url: "https://wflyer.com.br",
    });
    expect(
      portfolioContent.projects.map(({ name, url }) => [name, url]),
    ).toEqual(approvedProjects);

    for (const approvedLine of [
      `public_name: ${siteConfig.name}`,
      `site_url: ${siteConfig.url}`,
      `app_url: ${siteConfig.applicationUrl}`,
      `public_email: ${siteConfig.email}`,
      `recipient_email: ${siteConfig.email}`,
      `url: ${siteConfig.social.instagram}`,
      `url: ${siteConfig.social.github}`,
      ...approvedProjects.flatMap(([title, url]) => [
        `title: ${title}`,
        `url: ${url}`,
      ]),
      "enabled: false",
      "marketing_cookies: false",
      "session_replay: false",
    ]) {
      expect(profile).toContain(approvedLine);
    }
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
      const wasUpdatedForContactAndStorage =
        document.route === "/politica-de-privacidade" ||
        document.route === "/politica-de-cookies";
      expect(document.updatedAt).toBe(
        wasUpdatedForContactAndStorage
          ? "31 de julho de 2026"
          : "29 de julho de 2026",
      );
      expect(document.updatedAtIso).toBe(
        wasUpdatedForContactAndStorage ? "2026-07-31" : "2026-07-29",
      );
      expect(document.sections.length).toBeGreaterThanOrEqual(4);
      expect(new Set(document.sections.map(({ id }) => id)).size).toBe(
        document.sections.length,
      );
    }
    expect(
      legalDocuments["/politica-de-cookies"].sections
        .flatMap(({ paragraphs }) => paragraphs)
        .join(" "),
    ).toMatch(/sessionStorage.+mesma sessão.+não identifica/iu);
  });

  it("associa ícones e tipos de contato por metadados estáveis", () => {
    const iconBearingCollections = [
      applicationContent.highlights,
      howItWorksContent.steps,
      benefitsContent.benefits,
      servicesContent.services,
      processContent.steps,
    ];

    for (const collection of iconBearingCollections) {
      expect(
        collection.every(({ icon }) => icon.trim().length > 0),
      ).toBe(true);
    }

    const allowedContactTypes = new Set(
      contactProjectTypes.map(({ value }) => value),
    );

    expect(
      Object.values(serviceDetails).every(({ contactType }) =>
        allowedContactTypes.has(contactType),
      ),
    ).toBe(true);
  });
});
