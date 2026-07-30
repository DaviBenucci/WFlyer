import { CardGrid, ChapterPage, InfoCard, PageSection } from "@/components/pages";
import { BreadcrumbStructuredData } from "@/components/seo";
import { createPageMetadata } from "@/config/seo";
import { servicesContent } from "@/content/site-content";

export const metadata = createPageMetadata("/servicos");

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { label: "Home", route: "/" },
          { label: servicesContent.title, route: "/servicos" },
        ]}
      />
      <ChapterPage
        chapterId="services"
        description={servicesContent.description}
        eyebrow={servicesContent.eyebrow}
        title={servicesContent.title}
      >
        <PageSection
          id="categorias"
          title="Quatro categorias de solução"
        >
          <CardGrid columns={4}>
            {servicesContent.services.map((service) => (
              <InfoCard
                description={service.description}
                href={service.route}
                key={service.route}
                linkLabel={service.cta}
                title={service.title}
              />
            ))}
          </CardGrid>
        </PageSection>
      </ChapterPage>
    </>
  );
}
