import { cp, lstat, mkdir, opendir, rm } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..");
const nextDirectory = resolve(repositoryRoot, ".next");
const standaloneDirectory = resolve(nextDirectory, "standalone");
const legacyMirrorNames = [
  "index.html",
  "404.html",
  "icon.svg",
  "robots.txt",
  "sitemap.xml",
  "_next",
];

const sources = [
  {
    label: "public assets",
    path: resolve(repositoryRoot, "public"),
    destination: resolve(standaloneDirectory, "public"),
    optional: false,
  },
  {
    label: "Next.js static assets",
    path: resolve(nextDirectory, "static"),
    destination: resolve(standaloneDirectory, ".next", "static"),
    optional: false,
  },
];

function assertInside(parent, candidate, label) {
  const relativePath = relative(parent, candidate);

  if (
    relativePath === "" ||
    relativePath === ".." ||
    relativePath.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`)
  ) {
    throw new Error(`${label} resolves outside its allowed directory.`);
  }
}

async function pathExists(path) {
  try {
    await lstat(path);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

async function assertRegularTree(root, label) {
  const rootStat = await lstat(root);

  if (rootStat.isSymbolicLink()) {
    throw new Error(`${label} must not be a symbolic link.`);
  }

  if (!rootStat.isDirectory()) {
    throw new Error(`${label} must be a directory.`);
  }

  const pending = [root];

  while (pending.length > 0) {
    const currentDirectory = pending.pop();
    const directory = await opendir(currentDirectory);

    for await (const entry of directory) {
      const entryPath = resolve(currentDirectory, entry.name);

      if (entry.isSymbolicLink()) {
        throw new Error(
          `${label} contains a symbolic link: ${relative(root, entryPath)}`,
        );
      }

      if (entry.isDirectory()) {
        pending.push(entryPath);
      }
    }
  }
}

async function assertRegularFile(path, label) {
  const stat = await lstat(path);

  if (stat.isSymbolicLink() || !stat.isFile()) {
    throw new Error(`${label} must be a regular file, not a symbolic link.`);
  }
}

async function copySource({ label, path, destination, optional }) {
  if (!(await pathExists(path))) {
    if (optional) {
      console.log(`Skipping absent ${label}.`);
      return;
    }

    throw new Error(`Required ${label} were not generated at ${path}.`);
  }

  assertInside(standaloneDirectory, destination, label);
  await assertRegularTree(path, label);

  await rm(destination, { recursive: true, force: true });
  await mkdir(dirname(destination), { recursive: true });
  await cp(path, destination, {
    recursive: true,
    force: true,
    errorOnExist: false,
    dereference: false,
    preserveTimestamps: true,
  });

  console.log(`Copied ${label} into the standalone package.`);
}

const serverPath = resolve(standaloneDirectory, "server.js");

if (!(await pathExists(serverPath))) {
  throw new Error(
    "Missing .next/standalone/server.js. Run a Next.js build with output: \"standalone\" first.",
  );
}
await assertRegularFile(serverPath, ".next/standalone/server.js");

for (const legacyMirrorName of legacyMirrorNames) {
  const legacyMirrorPath = resolve(standaloneDirectory, legacyMirrorName);
  assertInside(standaloneDirectory, legacyMirrorPath, legacyMirrorName);
  await rm(legacyMirrorPath, { force: true, recursive: true });
}

for (const source of sources) {
  await copySource(source);
}

const prohibitedReferencePath = resolve(
  standaloneDirectory,
  "docs",
  "design-reference",
);

if (await pathExists(prohibitedReferencePath)) {
  throw new Error(
    "The standalone package unexpectedly contains docs/design-reference.",
  );
}

console.log("Standalone package is ready.");
