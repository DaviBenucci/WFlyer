import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  auxiliaryRouteByPath,
  auxiliaryRoutes,
  scoreChapterById,
  scoreChapterByPath,
  scoreChapters,
  scoreManifest,
} from "@/config/chapters";

function parseYamlScalar(source: string): unknown {
  const value = source.trim();

  if (value === "null") {
    return null;
  }

  if (value === "true" || value === "false") {
    return value === "true";
  }

  if (/^-?\d+(?:\.\d+)?$/u.test(value)) {
    return Number(value);
  }

  if (value.startsWith("[") && value.endsWith("]")) {
    const entries = value.slice(1, -1).trim();
    return entries.length === 0
      ? []
      : entries.split(",").map((entry) => parseYamlScalar(entry));
  }

  if (value.startsWith('"') && value.endsWith('"')) {
    return JSON.parse(value) as unknown;
  }

  return value;
}

function findSectionLines(lines: readonly string[], section: string): string[] {
  const startIndex = lines.findIndex((line) => line === `${section}:`);

  if (startIndex < 0) {
    throw new Error(`Seção YAML ausente: ${section}`);
  }

  const nextSectionOffset = lines
    .slice(startIndex + 1)
    .findIndex((line) => /^[a-z_]+:/u.test(line));
  const endIndex =
    nextSectionOffset < 0 ? lines.length : startIndex + 1 + nextSectionOffset;

  return lines.slice(startIndex + 1, endIndex);
}

function parseMappingSection(
  lines: readonly string[],
  section: string,
): Record<string, unknown> {
  return Object.fromEntries(
    findSectionLines(lines, section)
      .filter((line) => line.trim().length > 0)
      .map((line) => {
        const match = /^  ([a-z_]+):\s*(.+)$/u.exec(line);

        if (!match?.[1] || match[2] === undefined) {
          throw new Error(`Linha inválida em ${section}: ${line}`);
        }

        return [match[1], parseYamlScalar(match[2])];
      }),
  );
}

function parseSequenceSection(
  lines: readonly string[],
  section: string,
): Record<string, unknown>[] {
  const items: Record<string, unknown>[] = [];

  for (const line of findSectionLines(lines, section)) {
    if (line.trim().length === 0) {
      continue;
    }

    const firstEntry = /^  - ([a-z_]+):\s*(.+)$/u.exec(line);

    if (firstEntry?.[1] && firstEntry[2] !== undefined) {
      items.push({
        [firstEntry[1]]: parseYamlScalar(firstEntry[2]),
      });
      continue;
    }

    const property = /^    ([a-z_]+):\s*(.+)$/u.exec(line);
    const currentItem = items.at(-1);

    if (!property?.[1] || property[2] === undefined || !currentItem) {
      throw new Error(`Linha inválida em ${section}: ${line}`);
    }

    currentItem[property[1]] = parseYamlScalar(property[2]);
  }

  return items;
}

function readNormativeManifest(): Record<string, unknown> {
  const manifestPath = resolve(
    process.cwd(),
    "docs/05-implementacao/11-manifesto-capitulos-partitura.yaml",
  );
  const lines = readFileSync(manifestPath, "utf8").split(/\r?\n/u);

  const topLevelEntry = (key: string): unknown => {
    const line = lines.find((candidate) => candidate.startsWith(`${key}:`));

    if (!line) {
      throw new Error(`Chave YAML ausente: ${key}`);
    }

    return parseYamlScalar(line.slice(key.length + 1));
  };

  return {
    version: topLevelEntry("version"),
    status: topLevelEntry("status"),
    updated_at: topLevelEntry("updated_at"),
    coordinate_system: parseMappingSection(lines, "coordinate_system"),
    chapters: parseSequenceSection(lines, "chapters"),
    auxiliary_routes: parseSequenceSection(lines, "auxiliary_routes"),
  };
}

describe("manifesto da dupla partitura", () => {
  it("espelha campo a campo o YAML normativo", () => {
    expect(scoreManifest).toEqual(readNormativeManifest());
  });

  it("mantém IDs, rotas e coordenadas únicos", () => {
    const ids = scoreChapters.map(({ id }) => id);
    const routes = scoreChapters.map(({ route }) => route);
    const coordinates = scoreChapters.map(({ coordinate }) => coordinate);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(routes).size).toBe(routes.length);
    expect(new Set(coordinates).size).toBe(coordinates.length);
  });

  it("declara a Home como origem e ordena os dois ramos", () => {
    expect(scoreChapterById.home).toMatchObject({
      branch: "origin",
      coordinate: 0,
      route: "/",
    });

    const applicationCoordinates = scoreChapters
      .filter(({ branch }) => branch === "application")
      .sort((left, right) => left.order - right.order)
      .map(({ coordinate }) => coordinate);
    const institutionalCoordinates = scoreChapters
      .filter(({ branch }) => branch === "institutional")
      .sort((left, right) => left.order - right.order)
      .map(({ coordinate }) => coordinate);

    expect(applicationCoordinates).toEqual([-1, -2, -3]);
    expect(institutionalCoordinates).toEqual([1, 2, 3, 4, 5]);
  });

  it("preserva as rotas normativas aninhadas do ramo da aplicação", () => {
    expect(scoreChapterById.application.route).toBe("/aplicacao-wflyer");
    expect(scoreChapterById["application-how-it-works"].route).toBe(
      "/aplicacao-wflyer/como-funciona",
    );
    expect(scoreChapterById["application-benefits"].route).toBe(
      "/aplicacao-wflyer/beneficios",
    );
  });

  it("mantém anterior e próximo recíprocos dentro de cada ramo", () => {
    for (const chapter of scoreChapters) {
      if (chapter.next) {
        expect(scoreChapterById[chapter.next].previous).toBe(chapter.id);
      }

      if (chapter.previous && chapter.previous !== "home") {
        expect(scoreChapterById[chapter.previous].next).toBe(chapter.id);
      }
    }
  });

  it("conecta a altura de saída à entrada do próximo capítulo", () => {
    for (const chapter of scoreChapters) {
      if (!chapter.next) {
        continue;
      }

      const nextChapter = scoreChapterById[chapter.next];

      expect(chapter.exit_anchor_y).toBe(nextChapter.entry_anchor_y);
    }
  });

  it("preserva bordas direcionais e a exceção central da origem", () => {
    expect(scoreChapterById.home).toMatchObject({
      entry_anchor_y: 0.5,
      entry_edge: "center",
      exit_anchor_y: 0.5,
      exit_edge: "center",
      final_barline: false,
      next: null,
      previous: null,
      terminal: false,
    });

    for (const chapter of scoreChapters.filter(
      ({ branch }) => branch === "application",
    )) {
      expect(chapter.entry_edge).toBe("right");
      expect(chapter.exit_edge).toBe("left");
    }

    for (const chapter of scoreChapters.filter(
      ({ branch }) => branch === "institutional",
    )) {
      expect(chapter.entry_edge).toBe("left");
      expect(chapter.exit_edge).toBe("right");
    }
  });

  it("usa a Home somente como pivô inicial dos dois ramos", () => {
    const chaptersStartingAtHome = scoreChapters.filter(
      ({ previous }) => previous === "home",
    );

    expect(chaptersStartingAtHome.map(({ id }) => id).sort()).toEqual([
      "application",
      "company",
    ]);
    expect(chaptersStartingAtHome.map(({ coordinate }) => Math.abs(coordinate))).toEqual([
      1,
      1,
    ]);
  });

  it("encerra somente Benefícios e Contato com barra final", () => {
    const terminalIds = scoreChapters
      .filter(({ terminal, final_barline }) => terminal && final_barline)
      .map(({ id }) => id)
      .sort();

    expect(terminalIds).toEqual(["application-benefits", "contact"]);
    expect(scoreChapterById["application-benefits"].next).toBeNull();
    expect(scoreChapterById.contact.next).toBeNull();
  });

  it("expõe índices consistentes por ID, rota e rota auxiliar", () => {
    for (const chapter of scoreChapters) {
      expect(scoreChapterById[chapter.id]).toBe(chapter);
      expect(scoreChapterByPath[chapter.route]).toBe(chapter);
    }

    for (const entry of auxiliaryRoutes) {
      expect(auxiliaryRouteByPath[entry.route]).toBe(entry);
    }
  });
});
