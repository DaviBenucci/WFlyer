import { BreadcrumbStructuredData, ServiceStructuredData } from "@/components/seo";
import { ArrowIcon, LinkButton } from "@/components/ui";
import { pageSeo } from "@/config/seo";
import type {
  ServiceDetail,
  ServiceRoute,
} from "@/content/site-content";

import {
  AudienceList,
  ServiceDetailMark,
  StepSequence,
  type PageIconName,
} from "./archetypes";
import {
  Breadcrumbs,
  BulletList,
  CardGrid,
  ChapterPage,
  InfoCard,
  PageCallout,
  PageSection,
} from "./StaticPage";

const servicePresentation = {
  "/servicos/criacao-de-sites": {
    cta: "Falar sobre um site",
    icon: "sites",
    label: "Criação de sites",
  },
  "/servicos/criacao-de-aplicacoes": {
    cta: "Falar sobre uma aplicação",
    icon: "applications",
    label: "Criação de aplicações",
  },
  "/servicos/integracoes": {
    cta: "Falar sobre integração",
    icon: "integrations",
    label: "Integrações",
  },
  "/servicos/solucoes-sob-medida": {
    cta: "Apresentar necessidade",
    icon: "custom",
    label: "Soluções sob medida",
  },
} as const satisfies Record<
  ServiceRoute,
  {
    readonly cta: string;
    readonly icon: PageIconName;
    readonly label: string;
  }
>;

export function ServiceDetailPage({
  service,
}: {
  readonly service: ServiceDetail;
}) {
  const contactHref = `/contato?tipo=${encodeURIComponent(service.contactType)}`;
  const presentation = servicePresentation[service.route];

  return (
    <>
      <ServiceStructuredData
        description={pageSeo[service.route].description}
        name={pageSeo[service.route].title.replace(" — W_Flyer", "")}
        route={service.route}
      />
      <BreadcrumbStructuredData
        items={[
          { label: "Home", route: "/" },
          { label: "Serviços", route: "/servicos" },
          {
            label: pageSeo[service.route].title.replace(" — W_Flyer", ""),
            route: service.route,
          },
        ]}
      />
      <ChapterPage
        actions={
          <>
            <LinkButton
              href={contactHref}
              trailingIcon={<ArrowIcon />}
            >
              {presentation.cta}
            </LinkButton>
            <LinkButton href="/servicos" variant="secondary">
              Voltar aos serviços
            </LinkButton>
          </>
        }
        archetype="service-detail"
        auxiliary
        breadcrumbs={
          <Breadcrumbs
            items={[
              { href: "/", label: "Home" },
              { href: "/servicos", label: "Serviços" },
              {
                label: pageSeo[service.route].title.replace(" — W_Flyer", ""),
              },
            ]}
          />
        }
        chapterId="services"
        description={service.description}
        eyebrow={service.eyebrow}
        heroVisual={
          <ServiceDetailMark
            icon={presentation.icon}
            label={presentation.label}
          />
        }
        showChapterNavigation={false}
        title={service.title}
      >
        <PageSection
          description="O ponto de partida é compreender o problema antes de definir a forma da solução."
          id="adequacao"
          title="Quando este serviço faz sentido"
        >
          <AudienceList items={service.audience} />
        </PageSection>

        <PageSection
          description="A composição final depende das prioridades, dos acessos disponíveis e do recorte acordado."
          id="escopo"
          title="O trabalho pode incluir"
        >
          <CardGrid columns={2}>
            <InfoCard
              description="Possibilidades que podem fazer parte do projeto."
              title="Escopo possível"
            >
              <BulletList items={service.scope} />
            </InfoCard>
            <InfoCard
              description="Resultados concretos definidos conforme o escopo."
              title="Entregáveis possíveis"
            >
              <BulletList items={service.deliverables} />
            </InfoCard>
          </CardGrid>
        </PageSection>

        <PageSection
          description="As decisões avançam em partes verificáveis, com responsabilidades e critérios visíveis."
          id="processo"
          title="Processo de trabalho"
        >
          <StepSequence
            branch="institutional"
            steps={service.process}
          />
        </PageSection>

        <PageSection
          description="Qualidade também significa tornar claros os limites do que está sendo contratado."
          id="qualidade"
          title="Critérios, limites e responsabilidades"
        >
          <CardGrid columns={2}>
            <InfoCard
              description="Pontos usados para orientar implementação e validação."
              title="Critérios de qualidade"
            >
              <BulletList items={service.criteria} />
            </InfoCard>
            <InfoCard
              description="Condições que precisam permanecer explícitas durante o projeto."
              title="Limites e responsabilidades"
            >
              <BulletList items={service.limits} />
            </InfoCard>
          </CardGrid>
        </PageSection>

        <PageCallout
          action={
            <LinkButton
              href={contactHref}
              trailingIcon={<ArrowIcon />}
            >
              {presentation.cta}
            </LinkButton>
          }
          description="Conte o contexto, o objetivo e o processo atual. A conversa inicial ajuda a verificar se este é o serviço adequado."
          title="Vamos entender o seu projeto?"
        />
      </ChapterPage>
    </>
  );
}
