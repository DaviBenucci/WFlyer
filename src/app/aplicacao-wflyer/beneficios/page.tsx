import {
  CardGrid,
  ChapterPage,
  InfoCard,
  PageSection,
} from "@/components/pages";
import { BreadcrumbStructuredData } from "@/components/seo";
import { LinkButton } from "@/components/ui";
import { createPageMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { benefitsContent } from "@/content/site-content";

export const metadata = createPageMetadata(
  "/aplicacao-wflyer/beneficios",
);

export default function BenefitsPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { label: "Home", route: "/" },
          { label: "Aplicação", route: "/aplicacao-wflyer" },
          {
            label: "Benefícios",
            route: "/aplicacao-wflyer/beneficios",
          },
        ]}
      />
      <ChapterPage
        actions={
          <LinkButton
            external
            href={siteConfig.applicationUrl}
            target="_blank"
          >
            Acessar aplicação
          </LinkButton>
        }
        chapterId="application-benefits"
        description={benefitsContent.description}
        eyebrow={benefitsContent.eyebrow}
        title={benefitsContent.title}
      >
        <PageSection
          description="Valor prático com revisão humana e decisões musicais explícitas."
          id="beneficios"
          title="Benefícios para o trabalho musical"
        >
          <CardGrid columns={3}>
            {benefitsContent.benefits.map((benefit) => (
              <InfoCard key={benefit.title} {...benefit} />
            ))}
          </CardGrid>
        </PageSection>
      </ChapterPage>
    </>
  );
}
