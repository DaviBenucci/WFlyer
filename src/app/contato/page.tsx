import {
  ChapterPage,
  ContactWorkspace,
} from "@/components/pages";
import { BreadcrumbStructuredData } from "@/components/seo";
import { createPageMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { contactContent } from "@/content/site-content";

export const metadata = createPageMetadata("/contato");

export default function ContactPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { label: "Home", route: "/" },
          { label: contactContent.title, route: "/contato" },
        ]}
      />
      <ChapterPage
        chapterId="contact"
        description={contactContent.description}
        eyebrow={contactContent.eyebrow}
        title={contactContent.title}
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
