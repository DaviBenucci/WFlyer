import { cp, lstat, mkdir, opendir, rm } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..");
const nextDirectory = resolve(repositoryRoot, ".next");
const standaloneDirectory = resolve(nextDirectory, "standalone");

const sources = [
  {
    label: "public assets",
    path: resolve(repositoryRoot, "public"),
    destination: resolve(standaloneDirectory, "public"),
    kind: "directory",
    optional: true,
  },
  {
    label: "Next.js static assets",
    path: resolve(nextDirectory, "static"),
    destination: resolve(standaloneDirectory, ".next", "static"),
    kind: "directory",
    optional: false,
  },
  {
    label: "document-root index",
    path: resolve(nextDirectory, "server", "app", "index.html"),
    destination: resolve(standaloneDirectory, "index.html"),
    kind: "file",
    optional: false,
  },
  {
    label: "document-root icon",
    path: resolve(nextDirectory, "server", "app", "icon.svg.body"),
    destination: resolve(standaloneDirectory, "icon.svg"),
    kind: "file",
    optional: false,
  },
  {
    label: "document-root robots",
    path: resolve(nextDirectory, "server", "app", "robots.txt.body"),
    destination: resolve(standaloneDirectory, "robots.txt"),
    kind: "file",
    optional: false,
  },
  {
    label: "document-root sitemap",
    path: resolve(nextDirectory, "server", "app", "sitemap.xml.body"),
    destination: resolve(standaloneDirectory, "sitemap.xml"),
    kind: "file",
    optional: false,
  },
  {
    label: "document-root 404 page",
    path: resolve(nextDirectory, "server", "pages", "404.html"),
    destination: resolve(standaloneDirectory, "404.html"),
    kind: "file",
    optional: false,
  },
  {
    label: "root asset mirror",
    path: resolve(nextDirectory, "static"),
    destination: resolve(standaloneDirectory, "_next", "static"),
    kind: "directory",
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
  const fileStat = await lstat(path);

  if (fileStat.isSymbolicLink()) {
    throw new Error(`${label} must not be a symbolic link.`);
  }

  if (!fileStat.isFile()) {
    throw new Error(`${label} must be a file.`);
  }
}

async function copySource({ label, path, destination, kind, optional }) {
  if (!(await pathExists(path))) {
    if (optional) {
      console.log(`Skipping absent ${label}.`);
      return;
    }

    throw new Error(`Required ${label} were not generated at ${path}.`);
  }

  assertInside(standaloneDirectory, destination, label);
  if (kind === "directory") {
    await assertRegularTree(path, label);
  } else {
    await assertRegularFile(path, label);
  }

  await rm(destination, { recursive: kind === "directory", force: true });
  await mkdir(dirname(destination), { recursive: true });
  await cp(path, destination, {
    recursive: kind === "directory",
    force: true,
    errorOnExist: false,
    dereference: false,
    preserveTimestamps: true,
  });

  console.log(`Copied ${label} into the standalone package.`);
}

if (!(await pathExists(resolve(standaloneDirectory, "server.js")))) {
  throw new Error(
    "Missing .next/standalone/server.js. Run a Next.js build with output: \"standalone\" first.",
  );
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
