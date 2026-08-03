import type { Metadata, MetadataRoute } from "next";

import { absoluteUrl } from "./seo";
import { siteConfig } from "./site";

export const deploymentEnvironmentVariable =
  "WFLYER_DEPLOYMENT_ENVIRONMENT" as const;

export type DeploymentEnvironment = "production" | "staging" | "unknown";

export function resolveDeploymentEnvironment(
  value = process.env.WFLYER_DEPLOYMENT_ENVIRONMENT,
): DeploymentEnvironment {
  if (value === "production" || value === "staging") return value;
  return "unknown";
}

export function isIndexableDeployment(
  value = process.env.WFLYER_DEPLOYMENT_ENVIRONMENT,
): boolean {
  return resolveDeploymentEnvironment(value) === "production";
}

export function createDeploymentRobotsMetadata(
  value = process.env.WFLYER_DEPLOYMENT_ENVIRONMENT,
): Metadata["robots"] {
  if (isIndexableDeployment(value)) return undefined;

  return {
    follow: false,
    index: false,
    nocache: true,
    googleBot: {
      follow: false,
      index: false,
      noimageindex: true,
    },
  };
}

export function createDeploymentRobotsHeader(
  value = process.env.WFLYER_DEPLOYMENT_ENVIRONMENT,
): string | undefined {
  return isIndexableDeployment(value)
    ? undefined
    : "noindex, nofollow, noarchive, noimageindex";
}

export function createDeploymentRobotsPolicy(
  value = process.env.WFLYER_DEPLOYMENT_ENVIRONMENT,
): MetadataRoute.Robots {
  if (!isIndexableDeployment(value)) {
    return {
      rules: {
        disallow: "/",
        userAgent: "*",
      },
    };
  }

  return {
    host: siteConfig.url,
    rules: {
      allow: "/",
      disallow: "/api/",
      userAgent: "*",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
