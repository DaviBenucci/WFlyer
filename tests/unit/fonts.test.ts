import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const fontChecksums = {
  "cormorant-garamond-latin-variable-italic.woff2":
    "6f2f5c3b1abc3d0bb035a927f66a90ca873f94fc31c4966c8d024142c2036e55",
  "cormorant-garamond-latin-variable.woff2":
    "d80df8ff5aecd299a61549f9e29ab1ed0b9b05f4ea71d50fe978e07d5240b235",
  "manrope-latin-variable.woff2":
    "a30ddcd349703aff7464c34bef3fffdff405ee50c113440d7c8693c02d210972",
} as const;

describe("fontes self-hosted", () => {
  it.each(Object.entries(fontChecksums))(
    "preserva o arquivo oficial %s",
    (filename, expectedChecksum) => {
      const font = readFileSync(
        resolve(process.cwd(), "src/assets/fonts", filename),
      );
      const checksum = createHash("sha256").update(font).digest("hex");

      expect(checksum).toBe(expectedChecksum);
      expect(font.subarray(0, 4).toString("ascii")).toBe("wOF2");
    },
  );

  it("versiona as duas licenças SIL OFL", () => {
    for (const filename of [
      "Cormorant-Garamond-OFL.txt",
      "Manrope-OFL.txt",
    ]) {
      const license = readFileSync(
        resolve(process.cwd(), "src/assets/fonts/licenses", filename),
        "utf8",
      );

      expect(license).toContain("SIL OPEN FONT LICENSE Version 1.1");
    }
  });
});
