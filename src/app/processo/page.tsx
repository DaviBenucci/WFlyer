import { CardGrid, ChapterPage, PageSection, StepCard } from "@/components/pages";
import { BreadcrumbStructuredData } from "@/components/seo";
import { createPageMetadata } from "@/config/seo";
import { processContent } from "@/content/site-content";

export const metadata = createPageMetadata("/processo");

export default function ProcessPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { label: "Home", route: "/" },
          { label: processContent.eyebrow, route: "/processo" },
        ]}
      />
      <ChapterPage
        chapterId="process"
        description={processContent.description}
        eyebrow={processContent.eyebrow}
        title={processContent.title}
      >
        <PageSection id="etapas" title="Etapas do trabalho">
          <CardGrid columns={4}>
            {processContent.steps.map((step) => (
              <StepCard key={step.number} {...step} />
            ))}
          </CardGrid>
        </PageSection>
      </ChapterPage>
    </>
  );
}
