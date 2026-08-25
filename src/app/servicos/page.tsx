import {
  CardGrid,
  ChapterPage,
  InfoCard,
  PageSection,
  StepCard,
} from "@/components/pages";
import { BreadcrumbStructuredData } from "@/components/seo";
import { createPageMetadata } from "@/config/seo";
import {
  PHASE3_EDITORIAL_STATUS,
  PROCESS_STEPS,
  PUBLIC_SERVICES,
  PUBLIC_STORY_CONTENT,
} from "@/content/public";

const content = PUBLIC_STORY_CONTENT["professional-services"];

export const metadata = createPageMetadata("/servicos");

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { label: "Home", route: "/" },
          { label: "Serviços", route: "/servicos" },
        ]}
      />
      <ChapterPage
        chapterId="services"
        description={content.description}
        eyebrow={content.eyebrow}
        scorePlacement="after-content"
        status={PHASE3_EDITORIAL_STATUS}
        title={content.title}
      >
        <PageSection
          description="As quatro categorias iniciais permanecem explícitas e orientadas ao problema que precisa ser resolvido."
          id="categorias"
          title="Quatro frentes de trabalho"
        >
          <CardGrid columns={4}>
            {PUBLIC_SERVICES.map((service) => (
              <InfoCard
                description={service.shortLandingSummary}
                href={service.route}
                key={service.slug}
                linkLabel={`Conhecer ${service.eyebrow.replace("Serviços · ", "").toLocaleLowerCase("pt-BR")}`}
                title={service.eyebrow.replace("Serviços · ", "")}
              />
            ))}
          </CardGrid>
        </PageSection>

        <PageSection
          description="Processo é um capítulo narrativo próprio e também possui este ponto estável dentro da experiência de Serviços."
          id="processo"
          title="Processo de trabalho"
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
