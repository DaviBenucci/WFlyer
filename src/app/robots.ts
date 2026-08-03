import type { MetadataRoute } from "next";

import { createDeploymentRobotsPolicy } from "@/config/deployment";

export default function robots(): MetadataRoute.Robots {
  return createDeploymentRobotsPolicy();
}
