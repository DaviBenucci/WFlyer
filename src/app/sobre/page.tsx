import {
  ChapterPage,
  CompanyMark,
  EditorialPillars,
} from "@/components/pages";
import { BreadcrumbStructuredData } from "@/components/seo";
import { createPageMetadata } from "@/config/seo";
import { aboutContent } from "@/content/site-content";

export const metadata = createPageMetadata("/sobre");

export default function AboutPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { label: "Home", route: "/" },
          { label: aboutContent.title, route: "/sobre" },
        ]}
      />
      <ChapterPage
        chapterId="company"
        description={aboutContent.description}
        eyebrow={aboutContent.eyebrow}
        heroVisual={<CompanyMark />}
        title={aboutContent.title}
      >
        <section
          aria-labelledby="principios-title"
          data-compact-archetype-section=""
          id="principios"
        >
          <h2 className="wf-sr-only" id="principios-title">
            Missão, visão e valores
          </h2>
          <EditorialPillars items={aboutContent.pillars} />
        </section>
      </ChapterPage>
    </>
  );
}
