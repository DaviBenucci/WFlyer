import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createDeploymentRobotsHeader,
  createDeploymentRobotsMetadata,
  createDeploymentRobotsPolicy,
  isIndexableDeployment,
  resolveDeploymentEnvironment,
} from "@/config/deployment";

afterEach(() => {
  vi.unstubAllEnvs();
});

beforeEach(() => {
  vi.stubEnv("WFLYER_DEPLOYMENT_ENVIRONMENT", undefined);
});

describe("deployment indexing environment", () => {
  it.each([
    ["production", "production", true],
    ["staging", "staging", false],
    [undefined, "unknown", false],
    ["preview", "unknown", false],
    [" production ", "unknown", false],
  ] as const)("resolves %s without unsafe inference", (input, result, indexable) => {
    expect(resolveDeploymentEnvironment(input)).toBe(result);
    expect(isIndexableDeployment(input)).toBe(indexable);
  });

  it("keeps production indexable and exposes the approved sitemap", () => {
    expect(createDeploymentRobotsMetadata("production")).toBeUndefined();
    expect(createDeploymentRobotsHeader("production")).toBeUndefined();
    expect(createDeploymentRobotsPolicy("production")).toEqual({
      host: "https://wflyer.com.br",
      rules: {
        allow: "/",
        disallow: "/api/",
        userAgent: "*",
      },
      sitemap: "https://wflyer.com.br/sitemap.xml",
    });
  });

  it.each(["staging", undefined, "invalid"])(
    "fails %s closed at metadata, header, and robots layers",
    (environment) => {
      expect(createDeploymentRobotsMetadata(environment)).toEqual({
        follow: false,
        googleBot: {
          follow: false,
          index: false,
          noimageindex: true,
        },
        index: false,
        nocache: true,
      });
      expect(createDeploymentRobotsHeader(environment)).toBe(
        "noindex, nofollow, noarchive, noimageindex",
      );
      expect(createDeploymentRobotsPolicy(environment)).toEqual({
        rules: {
          disallow: "/",
          userAgent: "*",
        },
      });
    },
  );

  it("reads the explicit process environment when no argument is provided", () => {
    vi.stubEnv("WFLYER_DEPLOYMENT_ENVIRONMENT", "production");
    expect(resolveDeploymentEnvironment()).toBe("production");

    vi.stubEnv("WFLYER_DEPLOYMENT_ENVIRONMENT", "staging");
    expect(resolveDeploymentEnvironment()).toBe("staging");
  });
});
