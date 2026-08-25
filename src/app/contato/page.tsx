import {
  ChapterPage,
  ContactWorkspace,
} from "@/components/pages";
import { BreadcrumbStructuredData } from "@/components/seo";
import { createPageMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";
import {
  PHASE3_EDITORIAL_STATUS,
  PUBLIC_STORY_CONTENT,
} from "@/content/public";

const content = PUBLIC_STORY_CONTENT["professional-contact"];

export const metadata = createPageMetadata("/contato");

export default function ContactPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { label: "Home", route: "/" },
          { label: "Contato", route: "/contato" },
        ]}
      />
      <ChapterPage
        chapterId="contact"
        description={content.description}
        eyebrow={content.eyebrow}
        status={PHASE3_EDITORIAL_STATUS}
        title={content.title}
      >
        <ContactWorkspace
          email={siteConfig.email}
          githubUrl={siteConfig.social.github}
          instagramUrl={siteConfig.social.instagram}
        />
      </ChapterPage>
    </>
  );
}
