import type { Metadata } from "next";

import { LegalPage } from "@/components/pages";
import { createPageMetadata } from "@/config/seo";
import { legalDocuments } from "@/content/site-content";

const route = "/acessibilidade";

export const metadata: Metadata = createPageMetadata(route);

export default function AccessibilityPage() {
  return <LegalPage document={legalDocuments[route]} />;
}
