import { readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

async function source(filePath: string) {
  return readFile(path.join(process.cwd(), filePath), "utf8");
}

describe("production security baseline", () => {
  it("keeps analytics and visitor persistence out of production dependencies", async () => {
    const packageJson = JSON.parse(await source("package.json")) as {
      dependencies: Record<string, string>;
    };
    const dependencyNames = Object.keys(packageJson.dependencies).join(" ");

    expect(dependencyNames).not.toMatch(
      /analytics|gtag|google|hotjar|mixpanel|posthog|segment|sentry/iu,
    );
    expect(dependencyNames).not.toMatch(
      /mongoose|prisma|redis|sequelize|supabase/iu,
    );
  });

  it("keeps contact secrets server-only and avoids payload logging or HTML", async () => {
    const contactSources = await Promise.all(
      [
        "src/app/api/contact/route.ts",
        "src/lib/contact/config.ts",
        "src/lib/contact/email.ts",
        "src/lib/contact/schema.ts",
        "src/lib/contact/turnstile.ts",
      ].map(source),
    );
    const combined = contactSources.join("\n");

    expect(combined).not.toMatch(/NEXT_PUBLIC_(?:RESEND|TURNSTILE_SECRET)/u);
    expect(combined).not.toMatch(/console\.(?:debug|error|info|log|warn)/u);
    expect(combined).not.toContain("dangerouslySetInnerHTML");
    expect(combined).not.toMatch(/attachment|database|prisma|redis/iu);
  });

  it("keeps the CSP report-only, frame-closed, and free of unsafe-eval", async () => {
    const configuration = await source("next.config.ts");

    expect(configuration).toContain("Content-Security-Policy-Report-Only");
    expect(configuration).toContain("frame-ancestors 'none'");
    expect(configuration).toContain("X-Frame-Options");
    expect(configuration).not.toContain("unsafe-eval");
    expect(configuration).not.toContain("Strict-Transport-Security");
  });
});
