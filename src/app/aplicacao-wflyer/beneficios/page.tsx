import {
  CardGrid,
  ChapterPage,
  InfoCard,
  PageSection,
} from "@/components/pages";
import { BreadcrumbStructuredData } from "@/components/seo";
import { createPageMetadata } from "@/config/seo";
import {
  PHASE3_EDITORIAL_STATUS,
  PUBLIC_STORY_CONTENT,
} from "@/content/public";

const content = PUBLIC_STORY_CONTENT["application-benefits"];

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
        chapterId="application-benefits"
        description={content.description}
        eyebrow={content.eyebrow}
        status={PHASE3_EDITORIAL_STATUS}
        title={content.title}
      >
        <PageSection
          description="Os grupos abaixo permanecem qualitativos. Não há números, garantias de precisão ou promessas de resultado."
          id="beneficios"
          title="Quatro benefícios públicos"
        >
          <CardGrid columns={4}>
            {content.items?.map((benefit) => (
              <InfoCard
                description={benefit.description}
                key={benefit.title}
                title={benefit.title}
              />
            ))}
          </CardGrid>
        </PageSection>
      </ChapterPage>
    </>
  );
}
