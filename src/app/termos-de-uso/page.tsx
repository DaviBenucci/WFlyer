import type { Metadata } from "next";

import { LegalPage } from "@/components/pages";
import { createPageMetadata } from "@/config/seo";
import { legalDocuments } from "@/content/site-content";

const route = "/termos-de-uso";

export const metadata: Metadata = createPageMetadata(route);

export default function TermsOfUsePage() {
  return <LegalPage document={legalDocuments[route]} />;
}
