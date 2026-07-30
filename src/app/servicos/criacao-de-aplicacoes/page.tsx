import type { Metadata } from "next";

import { ServiceDetailPage } from "@/components/pages";
import { createPageMetadata } from "@/config/seo";
import { serviceDetails } from "@/content/site-content";

const route = "/servicos/criacao-de-aplicacoes";

export const metadata: Metadata = createPageMetadata(route);

export default function ApplicationCreationPage() {
  return <ServiceDetailPage service={serviceDetails[route]} />;
}
