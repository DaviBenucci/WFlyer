import type { Metadata } from "next";

import { ServiceDetailPage } from "@/components/pages";
import { createPageMetadata } from "@/config/seo";
import { getPublicServiceBySlug } from "@/content/public";

const route = "/servicos/solucoes-sob-medida";

export const metadata: Metadata = createPageMetadata(route);

export default function CustomSolutionsPage() {
  return (
    <ServiceDetailPage service={getPublicServiceBySlug("solucoes-sob-medida")!} />
  );
}
