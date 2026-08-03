import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { lstat, mkdir, readFile, writeFile } from "node:fs/promises";
import {
  basename,
  dirname,
  isAbsolute,
  relative,
  resolve,
  sep,
} from "node:path";
import { fileURLToPath } from "node:url";

const shaPattern = /^[0-9a-f]{40}$/u;
const digestPattern = /^[0-9a-f]{64}$/u;
const refPattern = /^(?:main|develop\/site-institucional|refs\/tags\/wflyer-v[0-9]+\.[0-9]+\.[0-9]+(?:-rc\.[0-9]+)?)$/u;
const productionRefPattern = /^(?:main|refs\/tags\/wflyer-v[0-9]+\.[0-9]+\.[0-9]+(?:-rc\.[0-9]+)?)$/u;
const repositoryPattern = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u;
const positiveIntegerPattern = /^[1-9][0-9]*$/u;

function requireText(value, name, pattern) {
  if (typeof value !== "string" || !pattern.test(value)) {
    throw new Error(`Invalid ${name}.`);
  }
  return value;
}

function resolveReleaseFile(value, name, pattern) {
  const releaseDirectory = resolve(process.cwd(), "release");
  const filePath = resolve(requireText(value, name, pattern));
  const relativePath = relative(releaseDirectory, filePath);

  if (
    relativePath === "" ||
    relativePath === ".." ||
    relativePath.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`) ||
    isAbsolute(relativePath)
  ) {
    throw new Error(`${name} must resolve inside the release directory.`);
  }

  return filePath;
}

async function assertSafeReleasePath(filePath, name) {
  const releaseDirectory = resolve(process.cwd(), "release");
  const relativePath = relative(releaseDirectory, filePath);
  const pathParts = relativePath.split(sep);
  let currentPath = releaseDirectory;

  for (const part of ["", ...pathParts]) {
    currentPath = part ? resolve(currentPath, part) : currentPath;

    let statistics;
    try {
      statistics = await lstat(currentPath);
    } catch (error) {
      if (error?.code === "ENOENT") return;
      throw error;
    }

    const isFinalPath = currentPath === filePath;
    if (
      statistics.isSymbolicLink() ||
      (!isFinalPath && !statistics.isDirectory())
    ) {
      throw new Error(`${name} must not traverse a symbolic link.`);
    }
  }
}

export function createReleaseManifest(input, checksumFile) {
  const environment = requireText(
    input.environment,
    "release environment",
    /^(?:staging|production)$/u,
  );
  const revision = requireText(input.revision, "release revision", shaPattern);
  const sourceRef = requireText(input.sourceRef, "source ref", refPattern);
  if (
    (environment === "staging" &&
      sourceRef !== "develop/site-institucional") ||
    (environment === "production" && !productionRefPattern.test(sourceRef))
  ) {
    throw new Error("Source ref is not approved for the release environment.");
  }

  const repository = requireText(
    input.repository,
    "workflow repository",
    repositoryPattern,
  );
  const runId = requireText(
    input.runId,
    "workflow run id",
    positiveIntegerPattern,
  );
  const runAttempt = requireText(
    input.runAttempt,
    "workflow run attempt",
    positiveIntegerPattern,
  );
  const runUrl = requireText(
    input.runUrl,
    "workflow run URL",
    /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/actions\/runs\/[0-9]+$/u,
  );
  if (runUrl !== `https://github.com/${repository}/actions/runs/${runId}`) {
    throw new Error(
      "Workflow run URL does not match the repository and workflow run id.",
    );
  }
  const archive = basename(
    requireText(
      input.archive,
      "archive path",
      /^[A-Za-z0-9_./-]+\.tar\.gz$/u,
    ),
  );
  const expectedArchive = `wflyer-standalone-${environment}-${revision}.tar.gz`;
  if (archive !== expectedArchive) {
    throw new Error(
      "Archive name does not match the release environment and immutable revision.",
    );
  }

  const createdAt = new Date(input.createdAt);
  if (
    Number.isNaN(createdAt.valueOf()) ||
    createdAt.toISOString() !== input.createdAt
  ) {
    throw new Error("Invalid release creation time.");
  }

  const checksumLine = checksumFile.trim();
  const checksumMatch = checksumLine.match(/^([0-9a-f]{64})\s+\*?(.+)$/u);
  if (!checksumMatch) throw new Error("Invalid SHA-256 checksum file.");

  const [, digest, checksumArchive] = checksumMatch;
  requireText(digest, "SHA-256 digest", digestPattern);
  if (checksumArchive !== archive) {
    throw new Error("Checksum target does not match the release archive.");
  }

  return {
    schemaVersion: 1,
    project: "wflyer.com.br",
    repository,
    environment,
    revision,
    sourceRef,
    workflow: {
      runId,
      runAttempt,
      url: runUrl,
    },
    createdAt: input.createdAt,
    artifact: {
      file: archive,
      sha256: digest,
    },
    deployment: {
      performed: false,
      target: "Napoleon Node.js application",
      handoff: "pending documented integration",
    },
  };
}

export async function writeReleaseManifestFromEnvironment(environment) {
  const archivePath = resolveReleaseFile(
    environment.RELEASE_ARCHIVE,
    "archive path",
    /^[A-Za-z0-9_./-]+\.tar\.gz$/u,
  );
  const checksumPath = resolveReleaseFile(
    environment.RELEASE_CHECKSUM_FILE,
    "checksum path",
    /^[A-Za-z0-9_./-]+\.sha256$/u,
  );
  const outputPath = resolveReleaseFile(
    environment.RELEASE_MANIFEST_PATH,
    "manifest path",
    /^[A-Za-z0-9_./-]+\.json$/u,
  );
  await Promise.all([
    assertSafeReleasePath(archivePath, "archive path"),
    assertSafeReleasePath(checksumPath, "checksum path"),
    assertSafeReleasePath(outputPath, "manifest path"),
  ]);
  const checksumFile = await readFile(checksumPath, "utf8");
  const manifest = createReleaseManifest(
    {
      archive: environment.RELEASE_ARCHIVE,
      createdAt: environment.RELEASE_CREATED_AT,
      environment: environment.RELEASE_ENVIRONMENT,
      repository: environment.RELEASE_REPOSITORY,
      revision: environment.RELEASE_SHA,
      runAttempt: environment.RELEASE_RUN_ATTEMPT,
      runId: environment.RELEASE_RUN_ID,
      runUrl: environment.RELEASE_RUN_URL,
      sourceRef: environment.RELEASE_REF,
    },
    checksumFile,
  );

  const archiveHash = createHash("sha256");
  for await (const chunk of createReadStream(archivePath)) {
    archiveHash.update(chunk);
  }
  if (archiveHash.digest("hex") !== manifest.artifact.sha256) {
    throw new Error("SHA-256 checksum does not match the release archive.");
  }

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, {
    encoding: "utf8",
    flag: "wx",
    mode: 0o600,
  });

  return outputPath;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  try {
    const outputPath = await writeReleaseManifestFromEnvironment(process.env);
    console.log(`Release manifest created at ${outputPath}.`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Manifest failed.");
    process.exitCode = 1;
  }
}
