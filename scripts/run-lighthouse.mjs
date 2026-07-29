import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..");
const chromePath = chromium.executablePath();
const executableName = process.platform === "win32" ? "lhci.cmd" : "lhci";
const lhciPath = resolve(repositoryRoot, "node_modules", ".bin", executableName);

await Promise.all([access(chromePath), access(lhciPath)]);

const child = spawn(
  lhciPath,
  ["autorun", "--config=./lighthouserc.json"],
  {
    cwd: repositoryRoot,
    env: {
      ...process.env,
      CHROME_PATH: chromePath,
    },
    stdio: "inherit",
  },
);

child.on("error", (error) => {
  console.error("Não foi possível iniciar o Lighthouse CI.", error);
  process.exitCode = 1;
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`Lighthouse CI foi encerrado pelo sinal ${signal}.`);
    process.exitCode = 1;
    return;
  }

  process.exitCode = code ?? 1;
});
