import type { NextConfig } from "next";

import { createDeploymentRobotsHeader } from "./src/config/deployment";

const requestedBuildId = process.env.WFLYER_BUILD_ID;
const configuredBuildId = requestedBuildId;

if (
  requestedBuildId !== undefined &&
  !/^[0-9a-f]{40}$/u.test(configuredBuildId ?? "")
) {
  throw new Error("WFLYER_BUILD_ID must be a full lowercase Git SHA.");
}

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "connect-src 'self' https://challenges.cloudflare.com",
  "font-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src https://challenges.cloudflare.com",
  "img-src 'self' data: blob:",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
].join("; ");

const nextConfig: NextConfig = {
  ...(configuredBuildId
    ? { generateBuildId: async () => configuredBuildId }
    : {}),
  async headers() {
    const robotsHeader = createDeploymentRobotsHeader();

    return [
      {
        headers: [
          {
            key: "Content-Security-Policy-Report-Only",
            value: contentSecurityPolicy,
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          ...(robotsHeader
            ? [{ key: "X-Robots-Tag", value: robotsHeader }]
            : []),
        ],
        source: "/:path*",
      },
    ];
  },
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  typedRoutes: true,
};

export default nextConfig;
