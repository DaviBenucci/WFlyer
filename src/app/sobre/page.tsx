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

const content = PUBLIC_STORY_CONTENT["professional-about"];

export const metadata = createPageMetadata("/sobre");

export default function AboutPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { label: "Home", route: "/" },
          { label: "Sobre", route: "/sobre" },
        ]}
      />
      <ChapterPage
        chapterId="company"
        description={content.description}
        eyebrow={content.eyebrow}
        status={PHASE3_EDITORIAL_STATUS}
        title={content.title}
      >
        <PageSection
          description="O conteúdo detalhado apresenta a responsabilidade profissional sem transformar esta página em currículo, lista genérica de tecnologias ou narrativa empresarial."
          id="perspectiva"
          title="Uma prática profissional orientada pelo contexto"
        >
          <CardGrid columns={3}>
            <InfoCard
              description="Cada trabalho parte de uma necessidade real, com decisões, limites e responsabilidades explícitos."
              title="Responsabilidade pessoal"
            />
            <InfoCard
              description="Software, produto e design são tratados como partes da mesma solução, não como uma lista de ferramentas."
              title="Visão integrada"
            />
            <InfoCard
              description="A direção é construída em etapas verificáveis, com espaço para revisar o que foi aprendido."
              title="Evolução consciente"
            />
          </CardGrid>
        </PageSection>

        <PageSection
          description={
            content.structuralPlaceholder?.status ??
            "Ativo final pendente de fornecimento e aprovação humana."
          }
          id="persona"
          title={content.structuralPlaceholder?.label ?? "Persona W_Flyer"}
        >
          <p>
            Este espaço registra somente o contrato de integração. Nenhuma
            ilustração final, aparência física ou ativo substituto foi inventado.
          </p>
        </PageSection>
      </ChapterPage>
    </>
  );
}
