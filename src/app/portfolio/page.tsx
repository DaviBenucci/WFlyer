import {
  ChapterPage,
  PageSection,
  ProjectListing,
} from "@/components/pages";
import { BreadcrumbStructuredData } from "@/components/seo";
import { createPageMetadata } from "@/config/seo";
import {
  getFeaturedPublicProjects,
  PHASE3_EDITORIAL_STATUS,
  PUBLIC_STORY_CONTENT,
} from "@/content/public";

const content = PUBLIC_STORY_CONTENT["professional-projects"];

export const metadata = createPageMetadata("/portfolio");

export default function PortfolioPage() {
  const projects = getFeaturedPublicProjects();

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { label: "Home", route: "/" },
          { label: "Projetos", route: "/portfolio" },
        ]}
      />
      <ChapterPage
        chapterId="portfolio"
        description={content.description}
        eyebrow={content.eyebrow}
        status={PHASE3_EDITORIAL_STATUS}
        title={content.title}
      >
        <PageSection
          description="A listagem é derivada somente do allowlist público. Registros ausentes ou não publicados não geram cartões, sitemap ou páginas detalhadas."
          id="projetos"
          title="Projetos aprovados para publicação"
        >
          <ProjectListing projects={projects} />
        </PageSection>
      </ChapterPage>
    </>
  );
}
