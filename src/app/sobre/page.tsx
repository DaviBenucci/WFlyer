import { ChapterPage, CardGrid, InfoCard, PageSection } from "@/components/pages";
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
        title={aboutContent.title}
      >
        <PageSection
          id="principios"
          title="Missão, visão e valores"
        >
          <CardGrid columns={3}>
            {aboutContent.pillars.map((pillar) => (
              <InfoCard key={pillar.title} {...pillar} />
            ))}
          </CardGrid>
        </PageSection>
      </ChapterPage>
    </>
  );
}
