import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { beforeAll, describe, expect, it } from "vitest";

import { resolvePlaywrightEvidenceDirectory } from "../../playwright.config";

async function workflow(name: string) {
  return readFile(path.join(process.cwd(), ".github", "workflows", name), "utf8");
}

function step(source: string, name: string) {
  const start = source.indexOf(`      - name: ${name}`);
  if (start < 0) throw new Error(`Missing workflow step: ${name}`);
  const next = source.indexOf("\n      - name:", start + 1);
  return source.slice(start, next < 0 ? undefined : next);
}

function job(source: string, name: string) {
  const marker = `  ${name}:\n`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Missing workflow job: ${name}`);
  const remaining = source.slice(start + marker.length);
  const next = remaining.search(/^  [a-z][a-z0-9-]+:\n/mu);
  return source.slice(start, next < 0 ? undefined : start + marker.length + next);
}

describe("release workflows", () => {
  let ci = "";
  let release = "";
  let packageJson = "";
  let nextConfiguration = "";
  let playwrightConfiguration = "";
  let environmentExample = "";
  let indexingSmoke = "";

  beforeAll(async () => {
    [
      ci,
      release,
      packageJson,
      nextConfiguration,
      playwrightConfiguration,
      environmentExample,
      indexingSmoke,
    ] = await Promise.all([
      workflow("ci.yml"),
      workflow("deploy.yml"),
      readFile(path.join(process.cwd(), "package.json"), "utf8"),
      readFile(path.join(process.cwd(), "next.config.ts"), "utf8"),
      readFile(path.join(process.cwd(), "playwright.config.ts"), "utf8"),
      readFile(path.join(process.cwd(), ".env.example"), "utf8"),
      readFile(
        path.join(process.cwd(), "scripts", "smoke-indexing.mjs"),
        "utf8",
      ),
    ]);
  });

  it("runs supported-browser suites with the stable worker profile", () => {
    const scripts = (JSON.parse(packageJson) as {
      scripts: Record<string, string>;
    }).scripts;

    for (const scriptName of [
      "test:e2e",
      "test:a11y",
      "test:motion",
      "test:visual",
    ]) {
      expect(scripts[scriptName]).toContain("--workers=1");
      expect(scripts[scriptName]).not.toContain("--project=chromium");
    }

    expect(ci).toContain(
      "pnpm exec playwright install --with-deps chromium firefox webkit",
    );
    expect(ci).toContain("pnpm audit --prod");
    expect(ci).toContain("pnpm peers check");
    expect(ci).toContain("pnpm smoke:indexing");
  });

  it("forbids focused tests in CI and in the public staging gate", () => {
    const scripts = (JSON.parse(packageJson) as {
      scripts: Record<string, string>;
    }).scripts;

    expect(scripts["test:staging"]).toContain("WFLYER_STAGING_GATE=1");
    expect(playwrightConfiguration).toContain(
      "forbidOnly: isCi || isStagingGate",
    );
  });

  it("keeps configurable Playwright evidence inside its safe roots", () => {
    expect(
      resolvePlaywrightEvidenceDirectory(
        undefined,
        "test-results",
        "WFLYER_PLAYWRIGHT_OUTPUT_DIR",
      ),
    ).toBe("test-results");
    expect(
      resolvePlaywrightEvidenceDirectory(
        "test-results/e2e",
        "test-results",
        "WFLYER_PLAYWRIGHT_OUTPUT_DIR",
      ),
    ).toBe("test-results/e2e");

    for (const unsafePath of [
      "../test-results",
      "test-results/../../outside",
      "test-results-sibling/e2e",
      "/tmp/wflyer-playwright-output",
    ]) {
      expect(() =>
        resolvePlaywrightEvidenceDirectory(
          unsafePath,
          "test-results",
          "WFLYER_PLAYWRIGHT_OUTPUT_DIR",
        ),
      ).toThrow(
        "WFLYER_PLAYWRIGHT_OUTPUT_DIR must resolve inside test-results.",
      );
    }
  });

  it("rejects a symbolic-link escape below a Playwright evidence root", async () => {
    const evidenceRoot = path.join(process.cwd(), "test-results");
    const linkPath = path.join(
      evidenceRoot,
      `.phase09-symlink-${process.pid}`,
    );
    const externalDirectory = await mkdtemp(
      path.join(tmpdir(), "wflyer-playwright-evidence-"),
    );

    await mkdir(evidenceRoot, { recursive: true });

    try {
      await symlink(externalDirectory, linkPath, "dir");
      expect(() =>
        resolvePlaywrightEvidenceDirectory(
          path.relative(process.cwd(), linkPath),
          "test-results",
          "WFLYER_PLAYWRIGHT_OUTPUT_DIR",
        ),
      ).toThrow(
        "WFLYER_PLAYWRIGHT_OUTPUT_DIR must resolve inside test-results.",
      );
    } finally {
      await rm(linkPath, { force: true });
      await rm(externalDirectory, { force: true, recursive: true });
    }
  });

  it("preserves separate Playwright evidence for every browser suite", () => {
    expect(playwrightConfiguration).toContain(
      "process.env.WFLYER_PLAYWRIGHT_OUTPUT_DIR",
    );
    expect(playwrightConfiguration).toContain(
      "process.env.WFLYER_PLAYWRIGHT_REPORT_DIR",
    );

    const suites = [
      {
        ciStep: "Run end-to-end tests",
        releaseStep: "Run supported-browser functional gate",
        slug: "e2e",
      },
      {
        ciStep: "Run accessibility tests",
        releaseStep: "Run supported-browser accessibility gate",
        slug: "a11y",
      },
      {
        ciStep: "Run visual regression tests",
        releaseStep: "Run supported-browser visual gate",
        slug: "visual",
      },
      {
        ciStep: "Run motion tests",
        releaseStep: "Run supported-browser motion gate",
        slug: "motion",
      },
    ] as const;

    for (const { ciStep, releaseStep, slug } of suites) {
      for (const source of [step(ci, ciStep), step(release, releaseStep)]) {
        expect(source).toContain(
          `WFLYER_PLAYWRIGHT_OUTPUT_DIR: test-results/${slug}`,
        );
        expect(source).toContain(
          `WFLYER_PLAYWRIGHT_REPORT_DIR: playwright-report/${slug}`,
        );
      }
    }

    expect(step(ci, "Upload browser test evidence")).toContain(
      "playwright-report/\n            test-results/",
    );
    expect(step(release, "Upload candidate browser evidence")).toContain(
      "playwright-report/\n            test-results/",
    );
  });

  it("distinguishes immutable artifacts and manifests across run attempts", () => {
    const artifactNames = [
      [
        step(ci, "Upload Storybook"),
        "storybook-${{ github.sha }}-attempt-${{ github.run_attempt }}",
      ],
      [
        step(ci, "Upload browser test evidence"),
        "playwright-${{ github.sha }}-attempt-${{ github.run_attempt }}",
      ],
      [
        step(ci, "Upload Lighthouse evidence"),
        "lighthouse-${{ github.sha }}-attempt-${{ github.run_attempt }}",
      ],
      [
        step(release, "Upload candidate browser evidence"),
        "candidate-browser-${{ inputs.environment }}-${{ needs.validate-request.outputs.release_sha }}-attempt-${{ github.run_attempt }}",
      ],
      [
        step(release, "Upload deployment candidate"),
        "wflyer-${{ inputs.environment }}-${{ needs.validate-request.outputs.release_sha }}-attempt-${{ github.run_attempt }}",
      ],
    ] as const;

    for (const [uploadStep, artifactName] of artifactNames) {
      expect(uploadStep).toContain(`name: ${artifactName}`);
    }

    expect(step(release, "Create non-secret release manifest")).toContain(
      "RELEASE_RUN_ATTEMPT: ${{ github.run_attempt }}",
    );
  });

  it("accepts release preparation only through a manual dispatch", () => {
    const triggers = release.slice(0, release.indexOf("permissions:"));

    expect(triggers).toContain("workflow_dispatch:");
    expect(triggers).not.toMatch(/\n\s+(?:pull_request|push):/u);
    expect(release).toContain('cancel-in-progress: false');
    expect(release).toContain('contents: read');
  });

  it("pins every external action to the reviewed immutable revision", () => {
    const approvedPins = new Map([
      ["actions/checkout", "3d3c42e5aac5ba805825da76410c181273ba90b1"],
      ["actions/setup-node", "820762786026740c76f36085b0efc47a31fe5020"],
      [
        "actions/upload-artifact",
        "043fb46d1a93c77aae656e7c1c64a875d1fc6a0a",
      ],
      ["pnpm/action-setup", "0977fd99725f1db4007ccb2928dbb4e90d06cc86"],
    ]);

    for (const workflowSource of [ci, release]) {
      const actionReferences = workflowSource.matchAll(
        /^\s+uses:\s+([^@\s]+)@([^\s]+)(?:\s+#.*)?$/gmu,
      );

      for (const [, action, revision] of actionReferences) {
        if (action === undefined || revision === undefined) {
          throw new Error("Malformed action reference");
        }

        const approvedRevision = approvedPins.get(action);

        if (approvedRevision === undefined) {
          throw new Error(`Unreviewed action reference: ${action}`);
        }

        expect(revision).toMatch(/^[0-9a-f]{40}$/u);
        expect(revision).toBe(approvedRevision);
      }
    }
  });

  it("gates packaging on full quality and environment protection", () => {
    expect(release).toContain("candidate-quality:");
    expect(release).toContain("candidate-browser:");
    expect(release).toMatch(
      /package-candidate:[\s\S]*needs:[\s\S]*candidate-quality[\s\S]*candidate-browser/u,
    );
    expect(release).toContain("name: ${{ inputs.environment }}");
    expect(release).toContain("HOMOLOGADO_POR_DAVI");
    expect(release).toContain(
      "^refs/tags/wflyer-v[0-9]+\\.[0-9]+\\.[0-9]+(-rc\\.[0-9]+)?$",
    );
  });

  it("resolves the requested ref once and reuses its immutable SHA", () => {
    const validation = job(release, "validate-request");
    const immutableCheckout =
      "ref: ${{ needs.validate-request.outputs.release_sha }}";

    expect(
      validation.match(/ref: \$\{\{ inputs\.release_ref \}\}/gu),
    ).toHaveLength(1);
    expect(
      release.match(/git rev-parse --verify HEAD\^\{commit\}/gu),
    ).toHaveLength(1);
    expect(release.split(immutableCheckout)).toHaveLength(4);
    expect(job(release, "candidate-quality")).toContain(immutableCheckout);
    expect(job(release, "candidate-browser")).toContain(immutableCheckout);
    expect(job(release, "package-candidate")).toContain(immutableCheckout);
    expect(release).not.toContain("steps.revision.outputs.sha");
  });

  it("uses candidate-equivalent public configuration and reproducible build IDs", () => {
    const quality = job(release, "candidate-quality");
    const packaging = job(release, "package-candidate");

    expect(quality).toContain(
      "NEXT_PUBLIC_TURNSTILE_SITE_KEY: 1x00000000000000000000AA",
    );
    expect(quality).toContain(
      "WFLYER_BUILD_ID: ${{ needs.validate-request.outputs.release_sha }}",
    );
    expect(packaging).toContain(
      "WFLYER_BUILD_ID: ${{ needs.validate-request.outputs.release_sha }}",
    );
    expect(ci).toContain("WFLYER_BUILD_ID: ${{ github.sha }}");
    expect(nextConfiguration).toContain("generateBuildId");
    expect(nextConfiguration).toContain("WFLYER_BUILD_ID");
    expect(nextConfiguration).toContain("requestedBuildId !== undefined");
    expect(nextConfiguration).toContain("^[0-9a-f]{40}$");
  });

  it("runs Lighthouse on a production baseline before a requested staging indexing build", () => {
    const quality = job(release, "candidate-quality");
    const productionBaseline = step(
      release,
      "Validate standalone runtime and production quality baseline",
    );
    const stagingIndexing = step(
      release,
      "Validate staging indexing when requested",
    );

    expect(quality).toContain("WFLYER_DEPLOYMENT_ENVIRONMENT: production");
    expect(quality).not.toContain(
      "WFLYER_DEPLOYMENT_ENVIRONMENT: ${{ inputs.environment }}",
    );
    expect(productionBaseline).toContain("pnpm lighthouse");
    expect(stagingIndexing).toContain(
      "if: ${{ inputs.environment == 'staging' }}",
    );
    expect(stagingIndexing).toContain(
      "WFLYER_DEPLOYMENT_ENVIRONMENT: staging",
    );
    expect(stagingIndexing).toContain("pnpm build");
    expect(stagingIndexing).toContain("pnpm prepare:standalone");
    expect(stagingIndexing).toContain("pnpm smoke:indexing");
    expect(stagingIndexing).not.toContain("pnpm lighthouse");
  });

  it("validates production, staging, absent, and invalid indexing artifacts", () => {
    const productionBuild = step(ci, "Build application");
    const productionSmoke = step(
      ci,
      "Smoke standalone server and production indexing",
    );
    const lighthouse = step(ci, "Run Lighthouse budgets");
    const stagingBuild = step(ci, "Validate fail-closed staging build");
    const absentBuild = step(
      ci,
      "Validate fail-closed build without an environment selector",
    );
    const invalidBuild = step(
      ci,
      "Validate fail-closed build with an invalid environment selector",
    );

    expect(ci).toContain("WFLYER_DEPLOYMENT_ENVIRONMENT: production");
    expect(productionBuild).toContain("pnpm build");
    expect(productionSmoke).toContain("pnpm smoke:standalone");
    expect(productionSmoke).toContain("pnpm smoke:indexing");
    expect(lighthouse).toContain("pnpm lighthouse");
    expect(stagingBuild).toContain("WFLYER_DEPLOYMENT_ENVIRONMENT: staging");
    expect(absentBuild).toContain(
      "env -u WFLYER_DEPLOYMENT_ENVIRONMENT pnpm build",
    );
    expect(absentBuild).toContain(
      "env -u WFLYER_DEPLOYMENT_ENVIRONMENT pnpm smoke:indexing",
    );
    expect(invalidBuild).toContain("WFLYER_DEPLOYMENT_ENVIRONMENT: preview");
    for (const buildStep of [stagingBuild, absentBuild, invalidBuild]) {
      expect(buildStep).toContain("pnpm prepare:standalone");
      expect(buildStep).toContain("pnpm smoke:indexing");
    }

    expect(indexingSmoke).toContain(
      'const expectsIndexing = deploymentEnvironment === "production"',
    );
    expect(indexingSmoke).not.toContain(
      "WFLYER_DEPLOYMENT_ENVIRONMENT must be staging or production",
    );
    expect(indexingSmoke).toContain(
      '"noindex, nofollow, noarchive, noimageindex"',
    );
    expect(indexingSmoke).toContain('"User-Agent: *"');
    expect(indexingSmoke).toContain('"Disallow: /"');
    expect(indexingSmoke).toContain('includes("text/plain")');
    expect(indexingSmoke).toContain('robotsTokens.has("noindex")');
    expect(indexingSmoke).toContain('robotsTokens.has("nofollow")');
  });

  it("uses exactly six environment-scoped release values and safe local defaults", () => {
    const validation = step(release, "Validate required Environment secrets");
    const requiredBlock = validation.match(/required=\(\s*([\s\S]*?)\s*\)/u)?.[1];

    expect(requiredBlock?.trim().split(/\s+/u)).toEqual([
      "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
      "TURNSTILE_SECRET_KEY",
      "RESEND_API_KEY",
      "CONTACT_FROM_EMAIL",
      "CONTACT_RECIPIENT_EMAIL",
      "CONTACT_ALLOWED_ORIGINS",
    ]);
    expect(`${ci}\n${release}\n${environmentExample}`).not.toMatch(
      /NEXT_PUBLIC_(?:SITE|APP)_URL/u,
    );
    expect(environmentExample).toContain(
      "WFLYER_DEPLOYMENT_ENVIRONMENT=staging",
    );
    expect(environmentExample).toContain(
      "CONTACT_ALLOWED_ORIGINS=http://127.0.0.1:3000,http://localhost:3000",
    );
    expect(environmentExample).not.toContain("https://staging.wflyer.com.br");
    expect(environmentExample).not.toContain("https://wflyer.com.br");
    expect(release).toContain(
      "Configure the ${TARGET_ENVIRONMENT} environment selector, public Turnstile build key, and five Contact server values explicitly in Napoleon",
    );
    expect(release).not.toContain(
      "inject the five Contact server values into its Node.js runtime",
    );
  });

  it("packages deployable candidates only in the protected manual workflow", () => {
    const ciTriggers = ci.slice(0, ci.indexOf("permissions:"));
    const candidateArchive = step(
      release,
      "Create checksummed release archive",
    );
    const candidateManifest = step(
      release,
      "Create non-secret release manifest",
    );
    const candidateUpload = step(release, "Upload deployment candidate");

    expect(ciTriggers).toContain("push:");
    expect(ciTriggers).toContain("pull_request:");
    expect(ci).not.toContain("wflyer-standalone-");
    expect(ci).not.toContain("steps.archive.outputs.path");
    expect(ci).not.toContain("-czf");
    expect(ci).not.toContain("Upload production standalone archive");
    expect(candidateArchive).toContain(
      "wflyer-standalone-${RELEASE_ENVIRONMENT}-${RELEASE_SHA}.tar.gz",
    );
    expect(candidateArchive).toContain(
      'build_id="$(cat .next/standalone/.next/BUILD_ID)"',
    );
    expect(candidateArchive).toContain(
      '[[ "${build_id}" != "${RELEASE_SHA}" ]]',
    );
    expect(candidateArchive).toContain("--sort=name");
    expect(candidateArchive).toContain('--mtime="UTC 1970-01-01"');
    expect(candidateArchive).toContain(
      'sha256sum "$(basename "${archive}")" >"$(basename "${archive}").sha256"',
    );
    expect(candidateArchive).not.toContain('sha256sum "${archive}"');
    expect(candidateManifest).toContain("pnpm release:manifest");
    expect(candidateManifest).toContain(
      "wflyer-release-${{ inputs.environment }}-${{ needs.validate-request.outputs.release_sha }}.json",
    );
    expect(candidateUpload).toContain("steps.archive.outputs.path");
    expect(candidateUpload).toContain("steps.manifest.outputs.path");
    expect(step(release, "Validate candidate document root")).toContain(
      "test -f .next/standalone/index.html",
    );
    expect(step(release, "Validate candidate document root")).toContain(
      "test -f .next/standalone/icon.svg",
    );
    expect(step(release, "Validate standalone runtime and production quality baseline")).toContain(
      "test -f .next/standalone/index.html",
    );
  });

  it("keeps the Napoleon Git branch handoff read-only and SHA-bound", () => {
    const ciTriggers = ci.slice(0, ci.indexOf("permissions:"));
    const requestGate = step(release, "Enforce branch and homologation gates");
    const handoff = step(release, "Record Napoleon handoff");

    expect(ciTriggers).toContain("- develop/site-institucional");
    expect(requestGate).toContain(
      '"${RELEASE_REF}" != "develop/site-institucional"',
    );
    expect(requestGate).toContain(
      "Staging candidates must use develop/site-institucional.",
    );

    for (const workflowSource of [ci, release]) {
      expect(workflowSource).toMatch(/^permissions:\n  contents: read$/mu);
      expect(workflowSource).not.toMatch(/^\s+[\w-]+:\s*write\s*$/mu);
      const checkoutCount =
        workflowSource.match(/uses: actions\/checkout@/gu)?.length ?? 0;
      const nonPersistedCredentialCount =
        workflowSource.match(/persist-credentials: false/gu)?.length ?? 0;
      expect(nonPersistedCredentialCount).toBe(checkoutCount);
      expect(workflowSource).not.toMatch(/^\s*git (?:commit|push)\b/mu);
    }

    expect(handoff).toContain("RELEASE_REF: ${{ inputs.release_ref }}");
    expect(handoff).toContain(
      "GitHub Actions did not create/push a commit or call a deployment endpoint.",
    );
    expect(handoff).toContain(
      "selected branch head, this green run, and the manifest identify",
    );
    expect(handoff).toContain(
      "Keep that branch head unchanged until Napoleon records the same selected SHA",
    );
    expect(handoff).toContain("GitHub Environment values are not transferred");
  });

  it("uses the packageManager pnpm version in every workflow job", () => {
    const packageManager = (JSON.parse(packageJson) as {
      packageManager: string;
    }).packageManager;
    const version = packageManager.match(/^pnpm@([^+]+)/u)?.[1];

    expect(version).toBe("11.18.0");
    expect(`${ci}\n${release}`).not.toContain("version: 11.15.1");
    for (const workflowSource of [ci, release]) {
      const setupActions =
        workflowSource.match(/uses: pnpm\/action-setup@/gu) ?? [];
      const installations = workflowSource.match(/version: 11\.18\.0/gu) ?? [];
      expect(installations).toHaveLength(setupActions.length);
    }
  });

  it("keeps server secrets out of the build and release artifacts", () => {
    const buildStep = step(release, "Build application");
    const archiveStep = step(release, "Create checksummed release archive");
    const manifestStep = step(release, "Create non-secret release manifest");
    const uploadStep = step(release, "Upload deployment candidate");
    const serverRuntimeValues =
      /TURNSTILE_SECRET_KEY|RESEND_API_KEY|CONTACT_FROM_EMAIL|CONTACT_RECIPIENT_EMAIL|CONTACT_ALLOWED_ORIGINS/u;

    expect(buildStep).not.toMatch(serverRuntimeValues);
    expect(`${archiveStep}${manifestStep}${uploadStep}`).not.toMatch(
      serverRuntimeValues,
    );
    expect(`${archiveStep}${manifestStep}${uploadStep}`).not.toMatch(/secrets\./u);
    expect(manifestStep).toContain("pnpm release:manifest");
    expect(manifestStep).toContain(
      "RELEASE_REPOSITORY: ${{ github.repository }}",
    );
    expect(uploadStep).toContain("steps.manifest.outputs.path");
  });

  it("performs no invented Napoleon, SSH, webhook, or DNS deployment", () => {
    expect(release).toContain(
      "GitHub Actions did not create/push a commit or call a deployment endpoint.",
    );
    expect(release).not.toMatch(
      /NAPOLEON_(?:DEPLOY|SSH)|\bssh\b|\bscp\b|deploy[_-]?webhook|cloudflare.*(?:put|post|delete)/iu,
    );
  });
});
