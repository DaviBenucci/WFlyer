import { afterEach, describe, expect, it, vi } from "vitest";

const validBuildId = "51e8e626c9a3cc9ac1c9db5d4f118630d179a013";

async function loadNextConfiguration(buildId: string) {
  vi.resetModules();
  vi.stubEnv("WFLYER_BUILD_ID", buildId);
  return import("../../next.config");
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("Next.js build identity", () => {
  it("uses one exact full lowercase Git SHA as the build ID", async () => {
    const { default: configuration } = await loadNextConfiguration(
      validBuildId,
    );

    await expect(configuration.generateBuildId?.()).resolves.toBe(
      validBuildId,
    );
  });

  it.each([
    ` ${validBuildId}`,
    `${validBuildId} `,
    validBuildId.toUpperCase(),
    validBuildId.slice(0, 39),
  ])("rejects a non-canonical build ID: %s", async (buildId) => {
    await expect(loadNextConfiguration(buildId)).rejects.toThrow(
      "WFLYER_BUILD_ID must be a full lowercase Git SHA.",
    );
  });
});
