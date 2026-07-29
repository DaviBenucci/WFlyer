import { readFile } from "node:fs/promises";

const packageJsonUrl = new URL("../package.json", import.meta.url);
const packageJson = JSON.parse(await readFile(packageJsonUrl, "utf8"));
const dependencyGroups = ["dependencies", "devDependencies"];
const invalidEntries = [];

for (const group of dependencyGroups) {
  for (const [name, version] of Object.entries(packageJson[group] ?? {})) {
    if (
      typeof version !== "string" ||
      version.startsWith("^") ||
      version.startsWith("~") ||
      version === "*" ||
      version.includes("latest")
    ) {
      invalidEntries.push(`${group}.${name}=${String(version)}`);
    }
  }
}

if (invalidEntries.length > 0) {
  console.error(
    `Dependências sem versão exata:\n${invalidEntries.map((entry) => `- ${entry}`).join("\n")}`,
  );
  process.exitCode = 1;
} else {
  console.log("Todas as dependências usam versões exatas.");
}
