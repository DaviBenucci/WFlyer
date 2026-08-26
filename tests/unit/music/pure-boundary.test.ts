import { readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";

import { describe, expect, it } from "vitest";

const MUSIC_ROOT = join(process.cwd(), "src/lib/music");

function sourceFiles(directory: string): readonly string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) return sourceFiles(path);
    return extname(path) === ".ts" ? [path] : [];
  });
}

describe("pure music module boundary", () => {
  it("contains no React, DOM/browser global, GSAP, or unseeded-random dependency", () => {
    const violations: string[] = [];
    const forbiddenPackage =
      /(?:\bfrom\s*|\bimport\s*\(\s*|\brequire\s*\(\s*|\bimport\s*)["'](?:react(?:-dom)?|gsap|@gsap\/react)(?:\/[^"']*)?["']/u;
    const browserGlobal =
      /\b(?:DOMParser|HTMLElement|SVGElement|cancelAnimationFrame|crypto|document|globalThis|localStorage|location|navigator|performance|requestAnimationFrame|sessionStorage|window)\b/u;

    for (const path of sourceFiles(MUSIC_ROOT)) {
      const source = readFileSync(path, "utf8");
      const file = relative(process.cwd(), path);

      if (forbiddenPackage.test(source)) {
        violations.push(`${file}:forbidden-import`);
      }

      if (browserGlobal.test(source)) {
        violations.push(`${file}:browser-global`);
      }

      if (/Math\s*\.\s*random\s*\(/u.test(source)) {
        violations.push(`${file}:unseeded-random`);
      }
    }

    expect(violations).toEqual([]);
  });
});
