import {
  CardGrid,
  ChapterPage,
  PageSection,
  StepCard,
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
        <PageSection
          description="As escolhas permanecem visíveis e revisáveis antes de cada continuação."
          id="etapas"
          title="Cinco etapas claras"
        >
          <CardGrid columns={5}>
            {howItWorksContent.steps.map((step) => (
              <StepCard key={step.number} {...step} />
            ))}
          </CardGrid>
        </PageSection>
      </ChapterPage>
    </>
  );
}
