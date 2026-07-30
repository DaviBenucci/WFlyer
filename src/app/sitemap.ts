import type { MetadataRoute } from "next";

import { absoluteUrl, publicRoutes } from "@/config/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: absoluteUrl(route),
  }));
}
