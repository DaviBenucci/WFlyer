import {
  ChapterPage,
  StepSequence,
} from "@/components/pages";
import { BreadcrumbStructuredData } from "@/components/seo";
import { ArrowIcon, LinkButton } from "@/components/ui";
import { createPageMetadata } from "@/config/seo";
import { howItWorksContent } from "@/content/site-content";

export const metadata = createPageMetadata(
  "/aplicacao-wflyer/como-funciona",
);

export default function HowItWorksPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { label: "Home", route: "/" },
          { label: "Aplicação", route: "/aplicacao-wflyer" },
          {
            label: "Como funciona",
            route: "/aplicacao-wflyer/como-funciona",
          },
        ]}
      />
      <ChapterPage
        actions={
          <LinkButton
            href="/aplicacao-wflyer/beneficios"
            trailingIcon={<ArrowIcon />}
          >
            Ver benefícios
          </LinkButton>
        }
        chapterId="application-how-it-works"
        description={howItWorksContent.description}
        eyebrow={howItWorksContent.eyebrow}
        title={howItWorksContent.title}
      >
        <section
          aria-labelledby="etapas-title"
          data-compact-archetype-section=""
          id="etapas"
        >
          <h2 className="wf-sr-only" id="etapas-title">
            Cinco etapas claras
          </h2>
          <StepSequence
            branch="application"
            steps={howItWorksContent.steps}
          />
        </section>
      </ChapterPage>
    </>
  );
}
