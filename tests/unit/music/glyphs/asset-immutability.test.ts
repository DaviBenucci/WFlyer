import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { MUSIC_GLYPH_REGISTRY } from "@/lib/music/glyphs/registry";

function sha256(path: string): string {
  return createHash("sha256")
    .update(readFileSync(resolve(process.cwd(), path)))
    .digest("hex");
}

function source(path: string): string {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("approved glyph asset immutability", () => {
  it("keeps every source master and runtime candidate byte-identical to its registry trace", () => {
    for (const entry of MUSIC_GLYPH_REGISTRY) {
      expect(sha256(entry.sourceMaster), entry.sourceMaster).toBe(
        entry.sha256.sourceMaster,
      );
      expect(sha256(entry.runtimeCandidate), entry.runtimeCandidate).toBe(
        entry.sha256.runtimeCandidate,
      );
    }
  });

  it("keeps repository-controlled SVGs free of active or remote content", () => {
    for (const entry of MUSIC_GLYPH_REGISTRY) {
      for (const path of [entry.sourceMaster, entry.runtimeCandidate]) {
        const svg = source(path);

        expect(svg, path).not.toMatch(/<(?:foreignObject|script)\b/iu);
        expect(svg, path).not.toMatch(/\son[a-z]+\s*=/iu);
        expect(svg, path).not.toMatch(
          /\b(?:href|src)\s*=\s*["'](?:https?:|\/\/)/iu,
        );
        expect(svg, path).not.toMatch(/(?:@import|url\(\s*["']?https?:)/iu);
      }
    }
  });
});
