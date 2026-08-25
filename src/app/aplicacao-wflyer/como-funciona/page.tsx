import {
  CardGrid,
  ChapterPage,
  PageSection,
  StepCard,
} from "@/components/pages";
import { BreadcrumbStructuredData } from "@/components/seo";
import { ArrowIcon, LinkButton } from "@/components/ui";
import { createPageMetadata } from "@/config/seo";
import {
  PHASE3_EDITORIAL_STATUS,
  PUBLIC_STORY_CONTENT,
} from "@/content/public";

const content = PUBLIC_STORY_CONTENT["application-how-it-works"];

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
            variant="secondary"
          >
            Conhecer os benefícios
          </LinkButton>
        }
        chapterId="application-how-it-works"
        description={content.description}
        eyebrow={content.eyebrow}
        status={PHASE3_EDITORIAL_STATUS}
        title={content.title}
      >
        <PageSection
          description="O fluxo descreve somente as cinco etapas públicas aprovadas e preserva uma revisão explícita antes de prosseguir."
          id="etapas"
          title="Cinco etapas claras"
        >
          <CardGrid columns={5}>
            {content.items?.map((step, index) => (
              <StepCard
                description={step.description}
                key={step.title}
                number={step.label ?? String(index + 1).padStart(2, "0")}
                title={step.title}
              />
            ))}
          </CardGrid>
        </PageSection>
      </ChapterPage>
    </>
  );
}
