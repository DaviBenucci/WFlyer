import {
  CardGrid,
  ChapterPage,
  InfoCard,
  PageSection,
  TagList,
} from "@/components/pages";
import { BreadcrumbStructuredData } from "@/components/seo";
import { LinkButton } from "@/components/ui";
import { createPageMetadata } from "@/config/seo";
import { portfolioContent } from "@/content/site-content";

export const metadata = createPageMetadata("/portfolio");

export default function PortfolioPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { label: "Home", route: "/" },
          { label: portfolioContent.title, route: "/portfolio" },
        ]}
      />
      <ChapterPage
        chapterId="portfolio"
        description={portfolioContent.description}
        eyebrow={portfolioContent.eyebrow}
        title={portfolioContent.title}
      >
        <PageSection
          id="projetos"
          title="Projetos aprovados para a versão inicial"
        >
          <CardGrid columns={3}>
            {portfolioContent.projects.map((project) => (
              <InfoCard
                description={project.description}
                eyebrow={`${project.type} · ${project.status}`}
                key={project.name}
                title={project.name}
              >
                <TagList items={project.scope} />
                <LinkButton
                  external
                  href={project.url}
                  target="_blank"
                  variant="ghost"
                >
                  Visitar {project.name}
                </LinkButton>
              </InfoCard>
            ))}
          </CardGrid>
        </PageSection>
      </ChapterPage>
    </>
  );
}
