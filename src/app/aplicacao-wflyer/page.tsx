import {
  CardGrid,
  ChapterPage,
  InfoCard,
  PageSection,
} from "@/components/pages";
import { BreadcrumbStructuredData } from "@/components/seo";
import { ArrowIcon, LinkButton } from "@/components/ui";
import { createPageMetadata } from "@/config/seo";
import {
  PHASE3_EDITORIAL_STATUS,
  PUBLIC_STORY_CONTENT,
} from "@/content/public";

const content = PUBLIC_STORY_CONTENT["application-overview"];
const demo = PUBLIC_STORY_CONTENT["application-demo"];

export const metadata = createPageMetadata("/aplicacao-wflyer");

export default function ApplicationPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { label: "Home", route: "/" },
          { label: "Aplicação", route: "/aplicacao-wflyer" },
        ]}
      />
      <ChapterPage
        actions={
          <LinkButton
            href="/aplicacao-wflyer/como-funciona"
            trailingIcon={<ArrowIcon />}
            variant="secondary"
          >
            Entender o fluxo público
          </LinkButton>
        }
        chapterId="application"
        description={content.description}
        eyebrow={content.eyebrow}
        status={PHASE3_EDITORIAL_STATUS}
        title={content.title}
      >
        <PageSection
          description="A explicação permanece no limite público do produto e não expõe OCR, OMR, modelos, provedores, prompts, banco de dados ou detalhes de segurança."
          id="proposta"
          title="Problema e proposta"
        >
          <CardGrid columns={3}>
            <InfoCard
              description="A partitura parte de um instrumento e de um contexto tonal conhecidos."
              title="Contexto de origem"
            />
            <InfoCard
              description="A pessoa informa o instrumento e o contexto tonal para os quais deseja adaptar o material."
              title="Contexto de destino"
            />
            <InfoCard
              description="O resultado é apresentado para conferência; a decisão musical não é automatizada nem garantida."
              title="Revisão humana"
            />
          </CardGrid>
        </PageSection>

        <PageSection
          description={
            demo.structuralPlaceholder?.status ??
            "Mídia final pendente de fornecimento e aprovação humana."
          }
          id="demonstracao"
          title={demo.title}
        >
          <p>{demo.description}</p>
        </PageSection>
      </ChapterPage>
    </>
  );
}
