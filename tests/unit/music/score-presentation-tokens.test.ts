import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const tokenSource = readFileSync(
  resolve(process.cwd(), "src/styles/tokens.css"),
  "utf8",
);
const scoreSource = readFileSync(
  resolve(process.cwd(), "src/components/score/score.module.css"),
  "utf8",
);

describe("Task 34 semantic score presentation", () => {
  it("uses warm theme roles and removes purple from default notation", () => {
    expect(tokenSource).toContain("--wf-score-primary: var(--wf-text)");
    expect(tokenSource).toContain("--wf-score-muted: var(--wf-text-muted)");
    expect(tokenSource).toContain("--wf-score-accent: var(--wf-emphasis)");
    expect(tokenSource).not.toContain("#933fff");
    expect(tokenSource).not.toContain("#7b5dda");
  });

  it("keeps copper selective instead of coloring the whole score", () => {
    expect(scoreSource).toContain(
      'data-score-role="final-barline-thick"',
    );
    expect(scoreSource).toContain('data-score-role="key-signature"');
    expect(scoreSource).toContain("var(--wf-score-accent, currentColor)");
    expect(scoreSource).toContain('data-score-role="staff-line"');
    expect(scoreSource).toContain("var(--wf-score-muted, currentColor)");
    expect(scoreSource).toContain(
      "var(--wf-score-primary, currentColor)",
    );
  });
});
