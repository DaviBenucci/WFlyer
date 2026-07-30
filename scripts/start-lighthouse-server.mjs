import { access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..");
const standaloneDirectory = resolve(repositoryRoot, ".next", "standalone");
const serverPath = resolve(standaloneDirectory, "server.js");
const host = "127.0.0.1";
const port = 3000;
const baseUrl = `http://${host}:${port}/`;
const deadline = Date.now() + 20_000;

await access(serverPath);

process.env.HOSTNAME = host;
process.env.NODE_ENV = "production";
process.env.PORT = String(port);
process.chdir(standaloneDirectory);

await import(pathToFileURL(serverPath).href);

let lastError;
let ready = false;

while (Date.now() < deadline) {
  try {
    const response = await fetch(baseUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(2_000),
    });

    if (response.ok) {
      ready = true;
      console.log("LIGHTHOUSE_SERVER_READY");
      break;
    }

    lastError = new Error(`Home respondeu com HTTP ${response.status}.`);
  } catch (error) {
    lastError = error;
  }

  await new Promise((resolveDelay) => {
    setTimeout(resolveDelay, 125);
  });
}

if (!ready) {
  throw new Error(
    `Servidor standalone não ficou pronto para o Lighthouse: ${String(lastError)}`,
  );
}
