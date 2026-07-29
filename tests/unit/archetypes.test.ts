import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  visualArchetypeByPage,
  visualArchetypeManifest,
} from "@/config/archetypes";
import { parseYamlSubset } from "../helpers/parse-yaml-subset";

describe("manifesto de arquétipos visuais", () => {
  it("espelha campo a campo o YAML normativo", () => {
    const source = readFileSync(
      resolve(
        process.cwd(),
        "docs/design-reference/golden-pages/visual-archetypes.yaml",
      ),
      "utf8",
    );

    expect(visualArchetypeManifest).toEqual(parseYamlSubset(source));
  });

  it("atribui cada página a um único arquétipo", () => {
    const pages = Object.values(visualArchetypeManifest.archetypes).flatMap(
      ({ pages: archetypePages }) => archetypePages,
    );

    expect(new Set(pages).size).toBe(pages.length);

    for (const pageId of pages) {
      expect(visualArchetypeByPage[pageId]).toBeTypeOf("string");
    }
  });

  it("preserva a geometria entre temas e proíbe scroll horizontal obrigatório", () => {
    expect(visualArchetypeManifest.theme_derivation.dark).toBe(
      "preserve-geometry-and-apply-approved-dark-tokens",
    );
    expect(
      visualArchetypeManifest.responsive_derivation[
        "no_required_horizontal-scroll"
      ],
    ).toBe(true);
  });
});
