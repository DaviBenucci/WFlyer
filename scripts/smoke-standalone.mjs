import { spawn } from "node:child_process";
import { lstat } from "node:fs/promises";
import { createServer } from "node:net";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..");
const standaloneDirectory = resolve(repositoryRoot, ".next", "standalone");
const serverPath = resolve(standaloneDirectory, "server.js");
const host = "127.0.0.1";
const startupTimeoutMs = 20_000;

function delay(durationMs) {
  return new Promise((resolveDelay) => {
    setTimeout(resolveDelay, durationMs);
  });
}

async function reserveAvailablePort() {
  const reservation = createServer();

  await new Promise((resolveListen, rejectListen) => {
    reservation.once("error", rejectListen);
    reservation.listen(0, host, resolveListen);
  });

  const address = reservation.address();

  if (address === null || typeof address === "string") {
    reservation.close();
    throw new Error("Unable to reserve a local TCP port.");
  }

  const { port } = address;

  await new Promise((resolveClose, rejectClose) => {
    reservation.close((error) => {
      if (error) {
        rejectClose(error);
      } else {
        resolveClose();
      }
    });
  });

  return port;
}

async function waitForHome(baseUrl, child, readLogs) {
  const deadline = Date.now() + startupTimeoutMs;
  let lastError;

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(
        `Standalone server exited with code ${child.exitCode}.\n${readLogs()}`,
      );
    }

    try {
      const response = await fetch(baseUrl, {
        cache: "no-store",
        signal: AbortSignal.timeout(2_000),
      });

      if (response.ok) {
        return response;
      }

      lastError = new Error(`Home responded with HTTP ${response.status}.`);
    } catch (error) {
      lastError = error;
    }

    await delay(125);
  }

  throw new Error(
    `Standalone server did not become ready: ${String(lastError)}\n${readLogs()}`,
  );
}

function referencedStaticAssets(html) {
  const assetUrls = new Set();
  const attributePattern = /(?:href|src)="([^"]+)"/gu;

  for (const match of html.matchAll(attributePattern)) {
    const assetUrl = match[1];

    if (assetUrl?.startsWith("/_next/static/")) {
      assetUrls.add(assetUrl);
    }
  }

  return [...assetUrls];
}

async function terminate(child) {
  if (child.exitCode !== null) {
    return;
  }

  const exited = new Promise((resolveExit) => {
    child.once("exit", resolveExit);
  });

  child.kill("SIGTERM");

  await Promise.race([
    exited,
    delay(3_000).then(() => {
      if (child.exitCode === null) {
        child.kill("SIGKILL");
      }
    }),
  ]);
}

await lstat(serverPath);

const port = await reserveAvailablePort();
const baseUrl = `http://${host}:${port}/`;
const logs = [];
const child = spawn(process.execPath, ["server.js"], {
  cwd: standaloneDirectory,
  env: {
    ...process.env,
    HOSTNAME: host,
    NODE_ENV: "production",
    PORT: String(port),
  },
  stdio: ["ignore", "pipe", "pipe"],
});
const captureLog = (chunk) => {
  logs.push(chunk.toString());

  if (logs.join("").length > 24_000) {
    logs.shift();
  }
};
const readLogs = () => logs.join("");

child.stdout.on("data", captureLog);
child.stderr.on("data", captureLog);

try {
  const homeResponse = await waitForHome(baseUrl, child, readLogs);
  const contentType = homeResponse.headers.get("content-type") ?? "";

  if (!contentType.includes("text/html")) {
    throw new Error(`Home returned unexpected Content-Type: ${contentType}`);
  }

  const html = await homeResponse.text();
  const assetUrls = referencedStaticAssets(html);

  if (!html.includes('id="main-content"')) {
    throw new Error("Home HTML is missing the main content landmark.");
  }

  for (const requiredExtension of [".css", ".js", ".woff2"]) {
    if (!assetUrls.some((assetUrl) => assetUrl.includes(requiredExtension))) {
      throw new Error(
        `Home HTML does not reference a ${requiredExtension} standalone asset.`,
      );
    }
  }

  const cssPayloads = [];

  for (const assetUrl of assetUrls) {
    const response = await fetch(new URL(assetUrl, baseUrl), {
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });

    if (!response.ok) {
      throw new Error(`${assetUrl} responded with HTTP ${response.status}.`);
    }

    const payload = await response.arrayBuffer();

    if (payload.byteLength === 0) {
      throw new Error(`${assetUrl} returned an empty response.`);
    }

    if (assetUrl.includes(".css")) {
      const assetContentType = response.headers.get("content-type") ?? "";

      if (!assetContentType.includes("text/css")) {
        throw new Error(
          `${assetUrl} returned unexpected Content-Type: ${assetContentType}`,
        );
      }

      cssPayloads.push(new TextDecoder().decode(payload));
    }
  }

  if (!cssPayloads.join("\n").includes("--wf-bg")) {
    throw new Error("Standalone CSS does not contain the W_Flyer token layer.");
  }

  console.log(
    `Standalone smoke passed: Home + ${assetUrls.length} static assets on ${baseUrl}`,
  );
} finally {
  await terminate(child);
}
