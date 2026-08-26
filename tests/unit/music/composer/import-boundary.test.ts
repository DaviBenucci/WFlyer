import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const COMPOSER_FILES = [
  "anti-repetition.ts",
  "compose-motif.ts",
  "compose-segment.ts",
  "index.ts",
  "motifs.ts",
  "pitch-contours.ts",
  "prng.ts",
  "profiles.ts",
  "session-seed.ts",
  "types.ts",
] as const;

describe("pure composer import boundary", () => {
  it("contains no React, DOM-global, GSAP, or unseeded-random dependency", () => {
    const violations: string[] = [];

    for (const file of COMPOSER_FILES) {
      const source = readFileSync(
        resolve(process.cwd(), "src/lib/music/composer", file),
        "utf8",
      );

      if (/from\s+["'](?:react|react-dom|gsap|@gsap\/react)["']/u.test(source)) {
        violations.push(`${file}:forbidden-import`);
      }

      if (/\b(?:window|document)\b/u.test(source)) {
        violations.push(`${file}:browser-global`);
      }

      if (/Math\s*\.\s*random\s*\(/u.test(source)) {
        violations.push(`${file}:unseeded-random`);
      }
    }

    expect(violations).toEqual([]);
  });
});
