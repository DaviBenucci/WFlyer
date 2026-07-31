import {
  ApplicationDemoTablet,
  ApplicationFeatureStrip,
  ChapterPage,
  ExplorationCue,
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
        heroVisual={<ApplicationDemoTablet />}
        status={applicationContent.status}
        title={applicationContent.title}
      >
        <section
          aria-labelledby="beneficios-em-destaque"
          data-application-features=""
        >
          <h2 className="wf-sr-only" id="beneficios-em-destaque">
            Benefícios em destaque
          </h2>
          <ApplicationFeatureStrip items={applicationContent.highlights} />
        </section>
        <ExplorationCue>Role para explorar a experiência</ExplorationCue>
      </ChapterPage>
    </>
  );
}
