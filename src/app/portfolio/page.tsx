import {
  ChapterPage,
  ProjectGrid,
} from "@/components/pages";
import { BreadcrumbStructuredData } from "@/components/seo";
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
        <section
          aria-labelledby="projetos-title"
          data-compact-archetype-section=""
          id="projetos"
        >
          <h2 className="wf-sr-only" id="projetos-title">
            Projetos aprovados para a versão inicial
          </h2>
          <ProjectGrid projects={portfolioContent.projects} />
        </section>
      </ChapterPage>
    </>
  );
}
