import { createHash } from "node:crypto";
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  createReleaseManifest,
  writeReleaseManifestFromEnvironment,
} from "../../scripts/create-release-manifest.mjs";

const revision = "a".repeat(40);
const digest = "b".repeat(64);
const archiveName = `wflyer-standalone-staging-${revision}.tar.gz`;
const archive = `release/${archiveName}`;

const validInput = {
  archive,
  createdAt: "2026-07-31T18:45:00.000Z",
  environment: "staging",
  repository: "DaviBenucci/WFlyer",
  revision,
  runAttempt: "1",
  runId: "123456789",
  runUrl:
    "https://github.com/DaviBenucci/WFlyer/actions/runs/123456789",
  sourceRef: "develop/site-institucional",
};

describe("release candidate manifest", () => {
  const cleanupDirectories: string[] = [];

  afterEach(async () => {
    await Promise.all(
      cleanupDirectories.splice(0).map((directory) =>
        rm(directory, { force: true, recursive: true }),
      ),
    );
  });

  it("binds the candidate to one environment, revision, run, and checksum", () => {
    expect(
      createReleaseManifest(validInput, `${digest}  ${archiveName}\n`),
    ).toEqual({
      schemaVersion: 1,
      project: "wflyer.com.br",
      repository: "DaviBenucci/WFlyer",
      environment: "staging",
      revision,
      sourceRef: "develop/site-institucional",
      workflow: {
        runId: "123456789",
        runAttempt: "1",
        url: validInput.runUrl,
      },
      createdAt: "2026-07-31T18:45:00.000Z",
      artifact: {
        file: archiveName,
        sha256: digest,
      },
      deployment: {
        performed: false,
        target: "Napoleon Node.js application",
        handoff: "pending documented integration",
      },
    });
  });

  it.each([
    [{ ...validInput, environment: "preview" }, `${digest}  ${archiveName}`],
    [
      { ...validInput, environment: "production" },
      `${digest}  ${archiveName}`,
    ],
    [{ ...validInput, revision: "main" }, `${digest}  ${archiveName}`],
    [
      { ...validInput, sourceRef: "feature/unreviewed" },
      `${digest}  ${archiveName}`,
    ],
    [
      { ...validInput, sourceRef: "refs/tags/unapproved-v1" },
      `${digest}  ${archiveName}`,
    ],
    [{ ...validInput, sourceRef: "main" }, `${digest}  ${archiveName}`],
    [
      { ...validInput, sourceRef: "refs/tags/wflyer-v1.2.3" },
      `${digest}  ${archiveName}`,
    ],
    [
      { ...validInput, runUrl: "https://example.com/run/1" },
      `${digest}  ${archiveName}`,
    ],
    [
      { ...validInput, repository: "Other/Repository" },
      `${digest}  ${archiveName}`,
    ],
    [{ ...validInput, repository: "invalid" }, `${digest}  ${archiveName}`],
    [{ ...validInput, runAttempt: "0" }, `${digest}  ${archiveName}`],
    [{ ...validInput, runAttempt: "01" }, `${digest}  ${archiveName}`],
    [{ ...validInput, runId: "0" }, `${digest}  ${archiveName}`],
    [{ ...validInput, runId: "987654321" }, `${digest}  ${archiveName}`],
    [{ ...validInput, createdAt: "not-a-date" }, `${digest}  ${archiveName}`],
    [validInput, `invalid  ${archiveName}`],
    [validInput, `${digest}  release/${archiveName}`],
    [validInput, `${digest}  another.tar.gz`],
  ])("rejects an invalid or mismatched candidate", (input, checksum) => {
    expect(() => createReleaseManifest(input, checksum)).toThrow();
  });

  it("rejects a staging ref relabeled as a production candidate", () => {
    const productionArchiveName = `wflyer-standalone-production-${revision}.tar.gz`;
    const productionInput = {
      ...validInput,
      archive: `release/${productionArchiveName}`,
      environment: "production",
    };

    expect(() =>
      createReleaseManifest(
        productionInput,
        `${digest}  ${productionArchiveName}`,
      ),
    ).toThrow("Source ref is not approved for the release environment.");
  });

  it.each(["main", "refs/tags/wflyer-v1.2.3", "refs/tags/wflyer-v1.2.3-rc.4"])(
    "accepts the approved production ref %s",
    (sourceRef) => {
      const productionArchiveName = `wflyer-standalone-production-${revision}.tar.gz`;
      const productionInput = {
        ...validInput,
        archive: `release/${productionArchiveName}`,
        environment: "production",
        sourceRef,
      };

      expect(
        createReleaseManifest(
          productionInput,
          `${digest}  ${productionArchiveName}`,
        ),
      ).toMatchObject({ environment: "production", sourceRef });
    },
  );

  it("contains no provider secret or runtime configuration field", () => {
    const serialized = JSON.stringify(
      createReleaseManifest(validInput, `${digest} *${archiveName}`),
    );

    expect(serialized).not.toMatch(
      /api[_-]?key|secret|token|turnstile|resend|recipient|allowed[_-]?origin/iu,
    );
  });

  it("hashes the actual archive before writing a manifest", async () => {
    const releaseDirectory = join(process.cwd(), "release");
    await mkdir(releaseDirectory, { recursive: true });
    const testDirectory = await mkdtemp(
      join(releaseDirectory, "manifest-test-"),
    );
    cleanupDirectories.push(testDirectory);

    const archivePath = join(testDirectory, archiveName);
    const checksumPath = `${archivePath}.sha256`;
    const manifestPath = join(testDirectory, "manifest.json");
    const archiveContents = "immutable standalone archive";
    const actualDigest = createHash("sha256")
      .update(archiveContents)
      .digest("hex");
    await writeFile(archivePath, archiveContents);
    await writeFile(checksumPath, `${digest}  ${archiveName}\n`);

    const environment: NodeJS.ProcessEnv = {
      NODE_ENV: "test",
      RELEASE_ARCHIVE: relative(process.cwd(), archivePath),
      RELEASE_CHECKSUM_FILE: relative(process.cwd(), checksumPath),
      RELEASE_CREATED_AT: validInput.createdAt,
      RELEASE_ENVIRONMENT: validInput.environment,
      RELEASE_MANIFEST_PATH: relative(process.cwd(), manifestPath),
      RELEASE_REF: validInput.sourceRef,
      RELEASE_REPOSITORY: validInput.repository,
      RELEASE_RUN_ATTEMPT: validInput.runAttempt,
      RELEASE_RUN_ID: validInput.runId,
      RELEASE_RUN_URL: validInput.runUrl,
      RELEASE_SHA: revision,
    };

    await expect(
      writeReleaseManifestFromEnvironment(environment),
    ).rejects.toThrow("SHA-256 checksum does not match the release archive.");

    await writeFile(checksumPath, `${actualDigest}  ${archiveName}\n`);
    await expect(
      writeReleaseManifestFromEnvironment(environment),
    ).resolves.toBe(manifestPath);

    const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as {
      artifact: { file: string; sha256: string };
      environment: string;
    };
    expect(manifest).toMatchObject({
      artifact: { file: archiveName, sha256: actualDigest },
      environment: "staging",
    });
  });

  it("rejects an archive path that traverses a symbolic link", async () => {
    const releaseDirectory = join(process.cwd(), "release");
    await mkdir(releaseDirectory, { recursive: true });
    const testDirectory = await mkdtemp(
      join(releaseDirectory, "manifest-symlink-test-"),
    );
    const externalDirectory = await mkdtemp(
      join(tmpdir(), "wflyer-release-outside-"),
    );
    cleanupDirectories.push(testDirectory, externalDirectory);

    const linkDirectory = join(testDirectory, "outside");
    await symlink(externalDirectory, linkDirectory, "dir");

    const environment: NodeJS.ProcessEnv = {
      NODE_ENV: "test",
      RELEASE_ARCHIVE: relative(
        process.cwd(),
        join(linkDirectory, archiveName),
      ),
      RELEASE_CHECKSUM_FILE: relative(
        process.cwd(),
        join(testDirectory, `${archiveName}.sha256`),
      ),
      RELEASE_CREATED_AT: validInput.createdAt,
      RELEASE_ENVIRONMENT: validInput.environment,
      RELEASE_MANIFEST_PATH: relative(
        process.cwd(),
        join(testDirectory, "manifest.json"),
      ),
      RELEASE_REF: validInput.sourceRef,
      RELEASE_REPOSITORY: validInput.repository,
      RELEASE_RUN_ATTEMPT: validInput.runAttempt,
      RELEASE_RUN_ID: validInput.runId,
      RELEASE_RUN_URL: validInput.runUrl,
      RELEASE_SHA: revision,
    };

    await expect(
      writeReleaseManifestFromEnvironment(environment),
    ).rejects.toThrow("archive path must not traverse a symbolic link.");
  });
});
