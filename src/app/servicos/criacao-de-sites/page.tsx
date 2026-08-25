import type { Metadata } from "next";

import { ServiceDetailPage } from "@/components/pages";
import { createPageMetadata } from "@/config/seo";
import { getPublicServiceBySlug } from "@/content/public";

const route = "/servicos/criacao-de-sites";

export const metadata: Metadata = createPageMetadata(route);

export default function SiteCreationPage() {
  return <ServiceDetailPage service={getPublicServiceBySlug("criacao-de-sites")!} />;
}
