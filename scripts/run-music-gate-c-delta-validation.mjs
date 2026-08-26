import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const repositoryRoot = process.cwd();
const evidenceDirectory = path.resolve(
  repositoryRoot,
  "docs/canonical-v2/06-migration/evidence/music-system-v0.1/gate-c/delta-2026-08-17/validation",
);
const requestedPhase = process.argv[2] ?? "all";
const supportedPhases = new Set([
  "all",
  "browser",
  "capture",
  "post",
  "production",
  "source",
]);

if (!supportedPhases.has(requestedPhase)) {
  throw new Error(
    `Unsupported validation phase ${JSON.stringify(requestedPhase)}.`,
  );
}

const commonEnvironment = {
  ...process.env,
  CI: "1",
  NEXT_TELEMETRY_DISABLED: "1",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
  WFLYER_TRANSITION_TEST_MODE: "1",
};
let activeChild;
let interrupted = false;

const steps = [
  {
    phase: "capture",
    id: "delta-evidence-capture",
    command: "node",
    args: ["scripts/capture-music-gate-c-delta-evidence.mjs"],
    timeoutMs: 600_000,
  },
  {
    phase: "source",
    id: "dependency-validation",
    command: "pnpm",
    args: ["validate:dependencies"],
    timeoutMs: 300_000,
  },
  {
    phase: "source",
    id: "lint",
    command: "pnpm",
    args: ["lint"],
    timeoutMs: 600_000,
  },
  {
    phase: "source",
    id: "typecheck",
    command: "pnpm",
    args: ["typecheck"],
    timeoutMs: 600_000,
  },
  {
    phase: "source",
    id: "focused-music-tests",
    command: "pnpm",
    args: [
      "exec",
      "vitest",
      "run",
      "--project=unit",
      "tests/unit/music/geometry",
      "tests/unit/music/renderer",
      "tests/unit/music/composer",
      "tests/unit/music/presentation/score-svg.test.tsx",
      "src/app/%5F_visual-lab/music/_fixtures/lab-score-models.test.ts",
      "src/app/%5F_visual-lab/music/_fixtures/gate-c-review.test.ts",
    ],
    timeoutMs: 600_000,
  },
  {
    phase: "source",
    id: "unit-tests",
    command: "pnpm",
    args: ["test"],
    timeoutMs: 900_000,
  },
  {
    phase: "source",
    id: "storybook-build",
    command: "pnpm",
    args: ["build:storybook"],
    timeoutMs: 900_000,
  },
  {
    phase: "source",
    id: "storybook-tests",
    command: "pnpm",
    args: ["test:storybook"],
    env: {
      CHOKIDAR_USEPOLLING: "1",
    },
    timeoutMs: 900_000,
  },
  {
    phase: "source",
    id: "openspec-strict-validation",
    command: "pnpm",
    args: [
      "exec",
      "openspec",
      "validate",
      "implement-music-system-v0-1",
      "--strict",
    ],
    timeoutMs: 300_000,
  },
  {
    phase: "source",
    id: "format-diff-check",
    command: "git",
    args: ["diff", "--check"],
    timeoutMs: 120_000,
  },
  {
    phase: "browser",
    id: "dev-lab-cross-engine",
    command: "pnpm",
    args: [
      "exec",
      "playwright",
      "test",
      "tests/e2e/music-visual-lab.spec.ts",
      "tests/a11y/music-visual-lab.a11y.spec.ts",
      "--project=chromium",
      "--project=firefox",
      "--project=webkit",
      "--workers=1",
      "--retries=0",
    ],
    env: {
      WFLYER_PLAYWRIGHT_OUTPUT_DIR:
        "test-results/music-gate-c-delta/dev-lab",
      WFLYER_PLAYWRIGHT_REPORT_DIR:
        "playwright-report/music-gate-c-delta/dev-lab",
    },
    timeoutMs: 900_000,
  },
  {
    phase: "production",
    id: "production-build",
    command: "pnpm",
    args: ["build"],
    timeoutMs: 900_000,
  },
  {
    phase: "production",
    id: "prepare-standalone",
    command: "pnpm",
    args: ["prepare:standalone"],
    timeoutMs: 300_000,
  },
  {
    phase: "production",
    id: "production-lab-404-cross-engine",
    command: "pnpm",
    args: [
      "exec",
      "playwright",
      "test",
      "tests/e2e/music-visual-lab.spec.ts",
      "--grep",
      "production build returns 404",
      "--project=chromium",
      "--project=firefox",
      "--project=webkit",
      "--workers=1",
      "--retries=0",
    ],
    env: {
      PLAYWRIGHT_BASE_URL: "http://127.0.0.1:3000",
      WFLYER_PLAYWRIGHT_OUTPUT_DIR:
        "test-results/music-gate-c-delta/production-404",
      WFLYER_PLAYWRIGHT_REPORT_DIR:
        "playwright-report/music-gate-c-delta/production-404",
      WFLYER_PLAYWRIGHT_TEST_SERVER: "production",
    },
    timeoutMs: 900_000,
  },
  {
    phase: "post",
    id: "music-boundary-tests",
    command: "pnpm",
    args: [
      "exec",
      "vitest",
      "run",
      "--project=unit",
      "tests/unit/music/public-isolation.test.ts",
      "tests/unit/music/pure-boundary.test.ts",
    ],
    timeoutMs: 300_000,
  },
  {
    phase: "post",
    id: "public-functional-regression",
    command: "pnpm",
    args: [
      "exec",
      "playwright",
      "test",
      "tests/e2e/home.spec.ts",
      "tests/e2e/phase05-navigation.spec.ts",
      "tests/e2e/score-continuity.spec.ts",
      "tests/e2e/phase08-contact-security.spec.ts",
      "tests/e2e/phase06-application-demo.spec.ts",
      "--project=chromium",
      "--project=firefox",
      "--project=webkit",
      "--workers=1",
      "--retries=0",
    ],
    env: {
      PLAYWRIGHT_BASE_URL: "http://127.0.0.1:3000",
      WFLYER_PLAYWRIGHT_OUTPUT_DIR:
        "test-results/music-gate-c-delta/public-regression",
      WFLYER_PLAYWRIGHT_REPORT_DIR:
        "playwright-report/music-gate-c-delta/public-regression",
      WFLYER_PLAYWRIGHT_TEST_SERVER: "production",
    },
    timeoutMs: 1_200_000,
  },
  {
    phase: "post",
    id: "committed-snapshot-diff",
    command: "git",
    args: ["diff", "--exit-code", "--", "tests/visual"],
    timeoutMs: 120_000,
  },
  {
    phase: "post",
    id: "committed-snapshot-pinned-manifest",
    command: "sha256sum",
    args: [
      "--check",
      "--strict",
      "docs/canonical-v2/06-migration/evidence/music-system-v0.1/gate-c/2026-08-17-post-gate-c-committed-snapshots.sha256",
    ],
    timeoutMs: 120_000,
  },
  {
    phase: "post",
    id: "approved-svg-diff",
    command: "git",
    args: [
      "diff",
      "--exit-code",
      "--",
      "src/assets/visuals/musical",
      "docs/design-reference/visual-library/musical/glyphs/source",
    ],
    timeoutMs: 120_000,
  },
  {
    phase: "post",
    id: "approved-svg-pinned-manifest",
    command: "sha256sum",
    args: [
      "--check",
      "--strict",
      "docs/canonical-v2/06-migration/evidence/music-system-v0.1/gate-c/2026-08-17-post-gate-c-approved-svg-files.sha256",
    ],
    timeoutMs: 120_000,
  },
];

function shellQuote(value) {
  return /^[A-Za-z0-9_./:=+-]+$/u.test(value)
    ? value
    : `'${value.replaceAll("'", `'\\''`)}'`;
}

function terminateOwnedProcess(child, signal) {
  if (!child.pid) return;

  try {
    process.kill(-child.pid, signal);
  } catch {
    child.kill(signal);
  }
}

for (const [signal, exitCode] of [
  ["SIGINT", 130],
  ["SIGTERM", 143],
]) {
  process.once(signal, () => {
    interrupted = true;
    if (activeChild) terminateOwnedProcess(activeChild, "SIGTERM");
    setTimeout(() => {
      if (activeChild) terminateOwnedProcess(activeChild, "SIGKILL");
      process.exit(exitCode);
    }, 5_000).unref();
  });
}

async function runStep(step) {
  const startedAt = new Date();
  const commandLine = [step.command, ...step.args].map(shellQuote).join(" ");
  let output = "";
  let timedOut = false;

  const child = spawn(step.command, step.args, {
    cwd: repositoryRoot,
    detached: true,
    env: { ...commonEnvironment, ...step.env },
    stdio: ["ignore", "pipe", "pipe"],
  });
  activeChild = child;

  const append = (chunk) => {
    const text = chunk.toString();
    output += text;
    process.stdout.write(text);
  };

  child.stdout.on("data", append);
  child.stderr.on("data", append);

  const timeout = setTimeout(() => {
    timedOut = true;
    output += `\n[timeout] ${step.timeoutMs}ms elapsed; terminating owned process group.\n`;
    terminateOwnedProcess(child, "SIGTERM");
    setTimeout(() => terminateOwnedProcess(child, "SIGKILL"), 5_000).unref();
  }, step.timeoutMs);

  const exit = await new Promise((resolve) => {
    let spawnError = null;

    child.once("error", (error) => {
      spawnError = error;
    });
    child.once("close", (code, signal) =>
      resolve({ code, error: spawnError, signal }),
    );
  });
  clearTimeout(timeout);
  activeChild = undefined;

  const finishedAt = new Date();
  const elapsedMs = finishedAt.getTime() - startedAt.getTime();
  const header = [
    `command: ${commandLine}`,
    `phase: ${step.phase}`,
    "environmentBoundary: local-worktree/noncanonical-visual-host",
    `repositoryRoot: ${repositoryRoot}`,
    `platform: ${process.platform}`,
    `architecture: ${process.arch}`,
    `osRelease: ${os.release()}`,
    `nodeVersion: ${process.version}`,
    `testServerMode: ${step.env?.WFLYER_PLAYWRIGHT_TEST_SERVER ?? "development-or-not-applicable"}`,
    `playwrightBaseUrl: ${step.env?.PLAYWRIGHT_BASE_URL ?? "playwright-config-default-or-not-applicable"}`,
    `startedAt: ${startedAt.toISOString()}`,
    `finishedAt: ${finishedAt.toISOString()}`,
    `elapsedMs: ${elapsedMs}`,
    `timeoutMs: ${step.timeoutMs}`,
    `timedOut: ${timedOut}`,
    `exitCode: ${exit.code ?? "null"}`,
    `signal: ${exit.signal ?? "none"}`,
    `spawnError: ${exit.error?.stack ?? "none"}`,
    "",
  ].join("\n");
  const logPath = path.join(
    evidenceDirectory,
    `2026-08-17-${step.id}.log`,
  );
  await writeFile(logPath, `${header}${output}`, "utf8");

  if (timedOut || exit.error || exit.code !== 0) {
    throw new Error(
      `${step.id} failed; diagnostic output preserved at ${logPath}`,
    );
  }

  if (interrupted) {
    throw new Error(`${step.id} was interrupted; diagnostic output was preserved`);
  }
}

await mkdir(evidenceDirectory, { recursive: true });

const selectedSteps = steps.filter(
  ({ phase }) => requestedPhase === "all" || requestedPhase === phase,
);

for (const step of selectedSteps) {
  process.stdout.write(`\n[gate-c-delta] ${step.id}\n`);
  await runStep(step);
}

process.stdout.write(
  `\n[gate-c-delta] ${selectedSteps.length} validation steps passed.\n`,
);
