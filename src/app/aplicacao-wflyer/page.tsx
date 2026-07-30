import {
  CardGrid,
  ChapterPage,
  InfoCard,
  PageSection,
} from "@/components/pages";
import { BreadcrumbStructuredData } from "@/components/seo";
import { ArrowIcon, LinkButton } from "@/components/ui";
import { createPageMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { applicationContent } from "@/content/site-content";

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
          <>
            <LinkButton
              external
              href={siteConfig.applicationUrl}
              target="_blank"
            >
              Acessar aplicação
            </LinkButton>
            <LinkButton
              href="/aplicacao-wflyer/como-funciona"
              trailingIcon={<ArrowIcon />}
              variant="secondary"
            >
              Saiba mais
            </LinkButton>
          </>
        }
        chapterId="application"
        description={applicationContent.description}
        eyebrow={applicationContent.eyebrow}
        status={applicationContent.status}
        title={applicationContent.title}
      >
        <PageSection
          description="Uma visão pública dos benefícios previstos para a experiência."
          id="beneficios-em-destaque"
          title="Benefícios em destaque"
        >
          <CardGrid columns={5}>
            {applicationContent.highlights.map((highlight) => (
              <InfoCard key={highlight.title} {...highlight} />
            ))}
          </CardGrid>
        </PageSection>
      </ChapterPage>
    </>
  );
}
