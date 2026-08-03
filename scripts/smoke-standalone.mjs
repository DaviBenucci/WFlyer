import { spawn } from "node:child_process";
import { lstat, readFile } from "node:fs/promises";
import { createServer } from "node:net";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..");
const standaloneDirectory = resolve(repositoryRoot, ".next", "standalone");
const serverPath = resolve(standaloneDirectory, "server.js");
const rootIndexPath = resolve(standaloneDirectory, "index.html");
const rootIconPath = resolve(standaloneDirectory, "icon.svg");
const rootRobotsPath = resolve(standaloneDirectory, "robots.txt");
const rootSitemapPath = resolve(standaloneDirectory, "sitemap.xml");
const rootNotFoundPath = resolve(standaloneDirectory, "404.html");
const host = "127.0.0.1";
const startupTimeoutMs = 20_000;
const publicRoutes = [
  "/",
  "/aplicacao-wflyer",
  "/aplicacao-wflyer/como-funciona",
  "/aplicacao-wflyer/beneficios",
  "/sobre",
  "/servicos",
  "/processo",
  "/portfolio",
  "/contato",
  "/servicos/criacao-de-sites",
  "/servicos/criacao-de-aplicacoes",
  "/servicos/integracoes",
  "/servicos/solucoes-sob-medida",
  "/politica-de-privacidade",
  "/politica-de-cookies",
  "/termos-de-uso",
  "/acessibilidade",
];

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

for (const [label, path] of [
  ["document-root index", rootIndexPath],
  ["document-root icon", rootIconPath],
  ["document-root robots", rootRobotsPath],
  ["document-root sitemap", rootSitemapPath],
  ["document-root 404", rootNotFoundPath],
]) {
  await lstat(path).catch(() => {
    throw new Error(`Missing ${label} in the standalone document root.`);
  });
}

const rootIndexHtml = await readFile(rootIndexPath, "utf8");
for (const requiredAsset of ["/_next/static/", "/icon.svg"]) {
  if (!rootIndexHtml.includes(requiredAsset)) {
    throw new Error(
      `Standalone document-root index is missing the ${requiredAsset} reference.`,
    );
  }
}

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
  const assetUrls = new Set(referencedStaticAssets(html));

  if (!html.includes('id="main-content"')) {
    throw new Error("Home HTML is missing the main content landmark.");
  }

  for (const requiredExtension of [".css", ".js", ".woff2"]) {
    if (
      ![...assetUrls].some((assetUrl) =>
        assetUrl.includes(requiredExtension),
      )
    ) {
      throw new Error(
        `Home HTML does not reference a ${requiredExtension} standalone asset.`,
      );
    }
  }

  for (const route of publicRoutes.slice(1)) {
    const response = await fetch(new URL(route, baseUrl), {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(5_000),
    });
    const routeContentType = response.headers.get("content-type") ?? "";

    if (!response.ok) {
      throw new Error(`${route} responded with HTTP ${response.status}.`);
    }

    if (!routeContentType.includes("text/html")) {
      throw new Error(
        `${route} returned unexpected Content-Type: ${routeContentType}`,
      );
    }

    const routeHtml = await response.text();

    if (!routeHtml.includes('id="main-content"')) {
      throw new Error(`${route} is missing the main content landmark.`);
    }

    if ((routeHtml.match(/<h1(?:\s|>)/gu) ?? []).length !== 1) {
      throw new Error(`${route} does not contain exactly one h1.`);
    }

    const canonicalUrl = `https://wflyer.com.br${route}`;

    if (!routeHtml.includes(`rel="canonical" href="${canonicalUrl}"`)) {
      throw new Error(`${route} is missing its canonical URL.`);
    }

    for (const assetUrl of referencedStaticAssets(routeHtml)) {
      assetUrls.add(assetUrl);
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
    `Standalone smoke passed: ${publicRoutes.length} public routes + ${assetUrls.size} static assets on ${baseUrl}`,
  );
} finally {
  await terminate(child);
}
