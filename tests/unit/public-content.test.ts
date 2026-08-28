import { readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  getPublicProjectBySlug,
  getPublicServiceBySlug,
  PHASE3_ROUTE_SEO,
  PROCESS_STEPS,
  PUBLIC_PROJECTS,
  PUBLIC_SERVICES,
  PUBLIC_STORY_CONTENT,
  selectPublishedRecords,
  type ProjectRecord,
  type ServiceRecord,
} from "@/content/public";

describe("Phase-3 public content domain", () => {
  it("keeps semantic content independent from layout, motion, and music geometry", async () => {
    const directory = path.join(process.cwd(), "src", "content", "public");
    const source = (
      await Promise.all(
        ["types.ts", "domain.ts", "index.ts"].map((file) =>
          readFile(path.join(directory, file), "utf8"),
        ),
      )
    ).join("\n");

    expect(source).not.toMatch(
      /\b(?:react|gsap|ScrollTrigger|ScorePath|staffSpace|timelineProgress)\b/u,
    );
  });

  it("defines every story chapter with stable identity, branch, and publication state", () => {
    expect(Object.keys(PUBLIC_STORY_CONTENT)).toHaveLength(13);

    for (const [chapterId, content] of Object.entries(PUBLIC_STORY_CONTENT)) {
      expect(content.chapterId).toBe(chapterId);
      expect(["origin", "professional", "application"]).toContain(
        content.branch,
      );
      expect(content.publicationStatus).toBe("public");
      expect(content.title.trim()).not.toBe("");
      expect(content.description.trim()).not.toBe("");
    }
  });

  it("keeps exactly four services and the four approved process stages", () => {
    expect(PUBLIC_SERVICES.map(({ slug }) => slug)).toEqual([
      "criacao-de-sites",
      "criacao-de-aplicacoes",
      "integracoes",
      "solucoes-sob-medida",
    ]);
    expect(PROCESS_STEPS.map(({ title }) => title)).toEqual([
      "Descoberta e contexto",
      "Escopo e direção",
      "Implementação incremental",
      "Validação e evolução",
    ]);
    expect(getPublicServiceBySlug("integracoes")?.route).toBe(
      "/servicos/integracoes",
    );
    expect(getPublicServiceBySlug("nao-publicado")).toBeUndefined();
  });

  it("fails closed for absent and unpublished project records", () => {
    const unpublishedFixture = {
      ...PUBLIC_PROJECTS[0]!,
      publicationStatus: "unpublished",
    } satisfies ProjectRecord;

    expect(selectPublishedRecords([unpublishedFixture])).toEqual([]);
    expect(getPublicProjectBySlug("projeto-interno")).toBeUndefined();
    expect(PUBLIC_PROJECTS.map(({ title }) => title)).toEqual([
      "W_Flyer",
      "MSN Distribuidora",
      "MSN Suprimentos",
    ]);
    expect(
      PUBLIC_PROJECTS.every(
        (project) =>
          project.publicationStatus === "public" &&
          !("metrics" in project) &&
          !("testimonial" in project),
      ),
    ).toBe(true);
  });

  it("fails closed for unpublished service records", () => {
    const unpublishedFixture = {
      ...PUBLIC_SERVICES[0]!,
      publicationStatus: "unpublished",
    } satisfies ServiceRecord;

    expect(selectPublishedRecords([unpublishedFixture])).toEqual([]);
    expect(getPublicServiceBySlug("servico-nao-publicado")).toBeUndefined();
    expect(
      PUBLIC_SERVICES.every(
        ({ publicationStatus }) => publicationStatus === "public",
      ),
    ).toBe(true);
  });

  it("preserves the exact public application flow and terminal-only access action", () => {
    expect(PUBLIC_STORY_CONTENT["application-overview"].items).toHaveLength(3);
    expect(PUBLIC_STORY_CONTENT["application-how-it-works"].items).toHaveLength(
      5,
    );
    expect(PUBLIC_STORY_CONTENT["application-benefits"].items).toHaveLength(4);
    expect(PUBLIC_STORY_CONTENT["application-demo"].description).toContain(
      "A tela simulada permanece inerte",
    );
    expect(PUBLIC_STORY_CONTENT["application-demo"].description).not.toMatch(
      /Fase 3/u,
    );

    const accessActions = Object.values(PUBLIC_STORY_CONTENT).filter(
      ({ primaryAction }) =>
        primaryAction?.href === "https://app.wflyer.com.br",
    );
    expect(accessActions.map(({ chapterId }) => chapterId)).toEqual([
      "application-access",
    ]);
  });

  it("provides unique metadata for every Phase-3 static chapter route", () => {
    const entries = Object.entries(PHASE3_ROUTE_SEO);
    expect(entries.map(([route]) => route)).toEqual([
      "/aplicacao-wflyer",
      "/aplicacao-wflyer/como-funciona",
      "/aplicacao-wflyer/beneficios",
      "/sobre",
      "/servicos",
      "/processo",
      "/portfolio",
      "/contato",
    ]);
    expect(new Set(entries.map(([, seo]) => seo.title)).size).toBe(
      entries.length,
    );
    expect(new Set(entries.map(([, seo]) => seo.description)).size).toBe(
      entries.length,
    );
  });
});
