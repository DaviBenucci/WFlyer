import { defineConfig, devices } from "@playwright/test";
import { existsSync, lstatSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const configDirectory = dirname(fileURLToPath(import.meta.url));
const localBaseUrl = "http://127.0.0.1:3000";
const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;
const isCi = Boolean(process.env.CI);
const isStagingGate = process.env.WFLYER_STAGING_GATE === "1";

export function resolvePlaywrightEvidenceDirectory(
  value: string | undefined,
  root: string,
  variableName: string,
): string {
  const candidate = value || root;
  const rootPath = resolve(configDirectory, root);
  const candidatePath = resolve(configDirectory, candidate);
  const relativePath = relative(rootPath, candidatePath);

  if (
    relativePath === ".." ||
    relativePath.startsWith(`..${sep}`) ||
    isAbsolute(relativePath)
  ) {
    throw new Error(`${variableName} must resolve inside ${root}.`);
  }

  const pathParts = relativePath ? relativePath.split(sep) : [];
  let currentPath = rootPath;

  for (const part of ["", ...pathParts]) {
    currentPath = part ? resolve(currentPath, part) : currentPath;

    if (!existsSync(currentPath)) break;

    const statistics = lstatSync(currentPath);
    if (statistics.isSymbolicLink() || !statistics.isDirectory()) {
      throw new Error(`${variableName} must resolve inside ${root}.`);
    }
  }

  return candidate;
}

const outputDir = resolvePlaywrightEvidenceDirectory(
  process.env.WFLYER_PLAYWRIGHT_OUTPUT_DIR,
  "test-results",
  "WFLYER_PLAYWRIGHT_OUTPUT_DIR",
);
const reportDir = resolvePlaywrightEvidenceDirectory(
  process.env.WFLYER_PLAYWRIGHT_REPORT_DIR,
  "playwright-report",
  "WFLYER_PLAYWRIGHT_REPORT_DIR",
);

if (isStagingGate) {
  let stagingOrigin: URL | null = null;

  try {
    stagingOrigin = externalBaseUrl ? new URL(externalBaseUrl) : null;
  } catch {
    stagingOrigin = null;
  }

  const isLocalOrigin =
    stagingOrigin?.hostname === "127.0.0.1" ||
    stagingOrigin?.hostname === "localhost" ||
    stagingOrigin?.hostname === "[::1]";

  if (
    !stagingOrigin ||
    !["http:", "https:"].includes(stagingOrigin.protocol) ||
    stagingOrigin.origin !== externalBaseUrl?.replace(/\/$/u, "") ||
    (!isLocalOrigin && stagingOrigin.protocol !== "https:")
  ) {
    throw new Error(
      "test:staging requires an explicit HTTPS origin (HTTP is allowed only for loopback validation).",
    );
  }
}

const baseURL = externalBaseUrl ?? localBaseUrl;

export default defineConfig({
  testDir: "./tests",
  testMatch: [
    "**/e2e/**/*.spec.ts",
    "**/a11y/**/*.spec.ts",
    "**/visual/**/*.spec.ts",
    "**/motion/**/*.spec.ts",
    "**/staging/**/*.spec.ts",
  ],
  outputDir,
  fullyParallel: true,
  forbidOnly: isCi || isStagingGate,
  retries: isCi ? 2 : 0,
  ...(isCi ? { workers: 1 } : {}),
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: reportDir }],
  ],
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL,
    colorScheme: "light",
    contextOptions: {
      reducedMotion: "no-preference",
    },
    locale: "pt-BR",
    screenshot: {
      mode: "only-on-failure",
      fullPage: true,
    },
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  ...(externalBaseUrl
    ? {}
    : {
        webServer: {
          command: "pnpm dev --hostname 127.0.0.1",
          env: {
            NEXT_TELEMETRY_DISABLED: "1",
            NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
            WFLYER_DEPLOYMENT_ENVIRONMENT: isStagingGate
              ? "staging"
              : "production",
            ...(isStagingGate ? {} : { WFLYER_TRANSITION_TEST_MODE: "1" }),
          },
          reuseExistingServer: !isCi,
          timeout: 180_000,
          url: localBaseUrl,
        },
      }),
});
