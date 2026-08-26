import { readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";

import { describe, expect, it } from "vitest";

function sourceFiles(
  directory: string,
  excludedDirectoryNames: ReadonlySet<string>,
): readonly string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && excludedDirectoryNames.has(entry.name)) {
      return [];
    }

    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return sourceFiles(path, excludedDirectoryNames);
    }

    return [".ts", ".tsx"].includes(extname(path)) ? [path] : [];
  });
}

describe("isolated music-system public boundary", () => {
  it("keeps public app and legacy components disconnected from the new renderer", () => {
    const roots = [
      ...sourceFiles(
        join(process.cwd(), "src/app"),
        new Set(["%5F_visual-lab"]),
      ),
      ...sourceFiles(
        join(process.cwd(), "src/components"),
        new Set(["score"]),
      ),
    ];
    const violations: string[] = [];

    for (const path of roots) {
      const source = readFileSync(path, "utf8");

      if (
        /(?:@\/lib\/music|@\/components\/score|__visual-lab\/music)/u.test(
          source,
        )
      ) {
        violations.push(relative(process.cwd(), path));
      }
    }

    expect(violations).toEqual([]);
  });

  it("does not expose the Visual Lab through sitemap configuration", () => {
    const sitemap = readFileSync(
      join(process.cwd(), "src/app/sitemap.ts"),
      "utf8",
    );
    const seo = readFileSync(join(process.cwd(), "src/config/seo.ts"), "utf8");

    expect(`${sitemap}\n${seo}`).not.toContain("__visual-lab");
  });
});
