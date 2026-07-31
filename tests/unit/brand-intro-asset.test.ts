import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

describe("official brand intro asset", () => {
  it("ships the approved SVG byte-for-byte without geometry reconstruction", async () => {
    const [approved, publicAsset] = await Promise.all([
      readFile("svg/wflyer-intro-master.svg", "utf8"),
      readFile("public/brand/wflyer-intro-master.svg", "utf8"),
    ]);

    expect(publicAsset).toBe(approved);
    expect(publicAsset).toContain('id="wf-intro-master"');
    expect(publicAsset).toContain('id="wf-wordmark-reveal"');
    expect(publicAsset).toContain('id="wf-symbol"');
  });
});
