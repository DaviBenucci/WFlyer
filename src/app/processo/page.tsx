import {
  ChapterPage,
  StepSequence,
} from "@/components/pages";
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
        <section
          aria-labelledby="etapas-title"
          data-compact-archetype-section=""
          id="etapas"
        >
          <h2 className="wf-sr-only" id="etapas-title">
            Etapas do trabalho
          </h2>
          <StepSequence
            branch="institutional"
            steps={processContent.steps}
          />
        </section>
      </ChapterPage>
    </>
  );
}
