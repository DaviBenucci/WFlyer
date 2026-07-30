import type { PublicRoute } from "@/config/seo";
import { absoluteUrl } from "@/config/seo";
import { siteConfig } from "@/config/site";

type JsonLdPrimitive = boolean | null | number | string;
type JsonLdValue =
  | JsonLdPrimitive
  | JsonLdValue[]
  | { readonly [key: string]: JsonLdValue };

export interface StructuredDataProps {
  readonly data: JsonLdValue;
}

export function StructuredData({ data }: StructuredDataProps) {
  const serializedData = JSON.stringify(data).replaceAll("<", "\\u003c");

  return (
    <script
      dangerouslySetInnerHTML={{ __html: serializedData }}
      type="application/ld+json"
    />
  );
}

export function SiteStructuredData() {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${siteConfig.url}/#organization`,
            name: siteConfig.name,
            url: siteConfig.url,
            email: siteConfig.email,
            sameAs: [siteConfig.social.instagram, siteConfig.social.github],
          },
          {
            "@type": "WebSite",
            "@id": `${siteConfig.url}/#website`,
            name: siteConfig.name,
            url: siteConfig.url,
            inLanguage: "pt-BR",
            publisher: {
              "@id": `${siteConfig.url}/#organization`,
            },
          },
        ],
      }}
    />
  );
}

export interface BreadcrumbItem {
  readonly label: string;
  readonly route: PublicRoute;
}

export function BreadcrumbStructuredData({
  items,
}: {
  readonly items: readonly BreadcrumbItem[];
}) {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label,
          item: absoluteUrl(item.route),
        })),
      }}
    />
  );
}

export interface ServiceStructuredDataProps {
  readonly description: string;
  readonly name: string;
  readonly route: PublicRoute;
}

export function ServiceStructuredData({
  description,
  name,
  route,
}: ServiceStructuredDataProps) {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name,
        description,
        url: absoluteUrl(route),
        provider: {
          "@id": `${siteConfig.url}/#organization`,
        },
      }}
    />
  );
}
