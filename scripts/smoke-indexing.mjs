import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { createServer } from "node:net";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..");
const standaloneDirectory = resolve(repositoryRoot, ".next", "standalone");
const serverPath = resolve(standaloneDirectory, "server.js");
const deploymentEnvironment = process.env.WFLYER_DEPLOYMENT_ENVIRONMENT;
const expectsIndexing = deploymentEnvironment === "production";
const environmentLabel = deploymentEnvironment ?? "absent";

const productionRobots = [
  "User-Agent: *",
  "Allow: /",
  "Disallow: /api/",
  "",
  "Host: https://wflyer.com.br",
  "Sitemap: https://wflyer.com.br/sitemap.xml",
].join("\n");
const failClosedRobots = ["User-Agent: *", "Disallow: /"].join("\n");
const failClosedRobotsHeader =
  "noindex, nofollow, noarchive, noimageindex";

function normalizedBody(value) {
  return value.replaceAll("\r\n", "\n").trimEnd();
}

function robotsMetadataTokens(html) {
  const metaTags = html.match(/<meta\b[^>]*>/giu) ?? [];
  const robotsTag = metaTags.find((tag) =>
    /\bname\s*=\s*(["'])robots\1/iu.test(tag),
  );
  if (!robotsTag) return new Set();

  const content = robotsTag.match(/\bcontent\s*=\s*(["'])(.*?)\1/iu)?.[2];
  return new Set(
    (content ?? "")
      .toLowerCase()
      .split(/[\s,]+/u)
      .filter(Boolean),
  );
}

await access(serverPath);

const port = await new Promise((resolvePort, reject) => {
  const reservation = createServer();
  reservation.once("error", reject);
  reservation.listen(0, "127.0.0.1", () => {
    const address = reservation.address();
    if (!address || typeof address === "string") {
      reservation.close();
      reject(new Error("Unable to reserve a local indexing-smoke port."));
      return;
    }
    reservation.close((error) => {
      if (error) reject(error);
      else resolvePort(address.port);
    });
  });
});

const child = spawn(process.execPath, [serverPath], {
  cwd: standaloneDirectory,
  env: {
    ...process.env,
    HOSTNAME: "127.0.0.1",
    NODE_ENV: "production",
    PORT: String(port),
  },
  stdio: ["ignore", "pipe", "pipe"],
});

let logs = "";
for (const stream of [child.stdout, child.stderr]) {
  stream.setEncoding("utf8");
  stream.on("data", (chunk) => {
    logs = `${logs}${chunk}`.slice(-8_000);
  });
}

async function terminate() {
  if (child.exitCode !== null) return;
  child.kill("SIGTERM");
  await Promise.race([
    new Promise((resolveExit) => child.once("exit", resolveExit)),
    new Promise((resolveTimeout) => setTimeout(resolveTimeout, 2_000)),
  ]);
  if (child.exitCode === null) child.kill("SIGKILL");
}

try {
  const baseUrl = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + 20_000;
  let homeResponse;

  while (Date.now() < deadline) {
    try {
      const candidate = await fetch(`${baseUrl}/`, {
        cache: "no-store",
        signal: AbortSignal.timeout(2_000),
      });
      if (candidate.ok) {
        homeResponse = candidate;
        break;
      }
    } catch {
      // The server is still starting.
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 125));
  }

  if (!homeResponse) {
    throw new Error(`Standalone server did not become ready.\n${logs}`);
  }

  if (homeResponse.status !== 200) {
    throw new Error(`Home returned unexpected status ${homeResponse.status}.`);
  }
  if (!homeResponse.headers.get("content-type")?.includes("text/html")) {
    throw new Error("Home did not return an HTML content type.");
  }

  const [home, robotsResponse] = await Promise.all([
    homeResponse.text(),
    fetch(`${baseUrl}/robots.txt`, {
      cache: "no-store",
      signal: AbortSignal.timeout(2_000),
    }),
  ]);
  const robots = await robotsResponse.text();
  const robotsHeader = homeResponse.headers.get("x-robots-tag");
  const robotsTokens = robotsMetadataTokens(home);
  const expectedRobots = expectsIndexing ? productionRobots : failClosedRobots;

  if (!robotsResponse.ok || robotsResponse.status !== 200) {
    throw new Error(
      `robots.txt returned unexpected status ${robotsResponse.status}.`,
    );
  }
  if (!robotsResponse.headers.get("content-type")?.includes("text/plain")) {
    throw new Error("robots.txt did not return a plain-text content type.");
  }
  if (normalizedBody(robots) !== expectedRobots) {
    throw new Error(
      `robots.txt does not match the ${expectsIndexing ? "production" : "fail-closed"} policy.`,
    );
  }

  if (!expectsIndexing) {
    if (robotsHeader !== failClosedRobotsHeader) {
      throw new Error("Non-production response has an incorrect X-Robots-Tag.");
    }
    if (!robotsTokens.has("noindex") || !robotsTokens.has("nofollow")) {
      throw new Error(
        "Non-production HTML is missing robots noindex/nofollow metadata.",
      );
    }
  } else {
    if (robotsHeader !== null) {
      throw new Error("Production response contains a non-production robots header.");
    }
    if (robotsTokens.has("noindex") || robotsTokens.has("nofollow")) {
      throw new Error("Production HTML contains non-production robots metadata.");
    }
  }

  console.log(
    `Indexing smoke passed for ${environmentLabel} on ${baseUrl}/.`,
  );
} finally {
  await terminate();
}
