import { defineConfig, devices } from "@playwright/test";

const localBaseUrl = "http://127.0.0.1:3000";
const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;
const baseURL = externalBaseUrl ?? localBaseUrl;

export default defineConfig({
  testDir: "./tests",
  testMatch: [
    "**/e2e/**/*.spec.ts",
    "**/a11y/**/*.spec.ts",
    "**/visual/**/*.spec.ts",
    "**/motion/**/*.spec.ts",
  ],
  outputDir: "test-results",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 2 } : {}),
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
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
            WFLYER_TRANSITION_TEST_MODE: "1",
          },
          reuseExistingServer: !process.env.CI,
          timeout: 180_000,
          url: localBaseUrl,
        },
      }),
});
