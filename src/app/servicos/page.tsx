import {
  ChapterPage,
  ServiceSolutionGrid,
} from "@/components/pages";
import { BreadcrumbStructuredData } from "@/components/seo";
import { ArrowIcon, LinkButton } from "@/components/ui";
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
        scorePlacement="after-content"
        title={servicesContent.title}
      >
        <section
          aria-labelledby="categorias-title"
          data-service-overview=""
          id="categorias"
        >
          <h2 className="wf-sr-only" id="categorias-title">
            Quatro categorias de solução
          </h2>
          <ServiceSolutionGrid
            action={
              <LinkButton
                href="#categorias"
                trailingIcon={<ArrowIcon />}
              >
                Ver todos os serviços
              </LinkButton>
            }
            services={servicesContent.services}
          />
        </section>
      </ChapterPage>
    </>
  );
}
