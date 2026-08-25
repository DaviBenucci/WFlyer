import {
  CardGrid,
  ChapterPage,
  PageSection,
  StepCard,
} from "@/components/pages";
import { BreadcrumbStructuredData } from "@/components/seo";
import { createPageMetadata } from "@/config/seo";
import {
  PHASE3_EDITORIAL_STATUS,
  PROCESS_STEPS,
  PUBLIC_STORY_CONTENT,
} from "@/content/public";

const content = PUBLIC_STORY_CONTENT["professional-process"];

export const metadata = createPageMetadata("/processo");

export default function ProcessPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { label: "Home", route: "/" },
          { label: "Processo", route: "/processo" },
        ]}
      />
      <ChapterPage
        chapterId="process"
        description={content.description}
        eyebrow={content.eyebrow}
        status={PHASE3_EDITORIAL_STATUS}
        title={content.title}
      >
        <PageSection
          description="As quatro etapas explicam como o trabalho avança sem prometer resultado comercial nem esconder limites do escopo."
          id="etapas"
          title="Quatro etapas verificáveis"
        >
          <CardGrid columns={4}>
            {PROCESS_STEPS.map((step) => (
              <StepCard key={step.number} {...step} />
            ))}
          </CardGrid>
        </PageSection>
      </ChapterPage>
    </>
  );
}
