import type { Metadata } from "next";

import { ServiceDetailPage } from "@/components/pages";
import { createPageMetadata } from "@/config/seo";
import { getPublicServiceBySlug } from "@/content/public";

const route = "/servicos/integracoes";

export const metadata: Metadata = createPageMetadata(route);

export default function IntegrationsPage() {
  return <ServiceDetailPage service={getPublicServiceBySlug("integracoes")!} />;
}
