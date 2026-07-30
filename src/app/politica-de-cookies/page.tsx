import type { Metadata } from "next";

import { LegalPage } from "@/components/pages";
import { createPageMetadata } from "@/config/seo";
import { legalDocuments } from "@/content/site-content";

const route = "/politica-de-cookies";

export const metadata: Metadata = createPageMetadata(route);

export default function CookiePolicyPage() {
  return <LegalPage document={legalDocuments[route]} />;
}
