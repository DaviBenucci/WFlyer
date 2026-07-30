import { CardGrid, ChapterPage, InfoCard, PageSection } from "@/components/pages";
import { BreadcrumbStructuredData } from "@/components/seo";
import { LinkButton } from "@/components/ui";
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
        actions={
          <LinkButton href={`mailto:${siteConfig.email}`}>
            {contactContent.emailCta}
          </LinkButton>
        }
        chapterId="contact"
        description={contactContent.description}
        eyebrow={contactContent.eyebrow}
        title={contactContent.title}
      >
        <PageSection
          description="Escolha o canal mais adequado para iniciar uma conversa."
          id="canais"
          title="Canais de contato"
        >
          <CardGrid columns={3}>
            <InfoCard
              description="Envie o contexto, o objetivo e o tipo de solução por e-mail."
              title="E-mail"
            >
              <LinkButton
                href={`mailto:${siteConfig.email}`}
                variant="ghost"
              >
                {siteConfig.email}
              </LinkButton>
            </InfoCard>
            <InfoCard
              description="Acompanhe o perfil público de Davi Benucci no Instagram."
              title="Instagram"
            >
              <LinkButton
                external
                href={siteConfig.social.instagram}
                target="_blank"
                variant="ghost"
              >
                @davibenucci
              </LinkButton>
            </InfoCard>
            <InfoCard
              description="Conheça os repositórios públicos de Davi Benucci no GitHub."
              title="GitHub"
            >
              <LinkButton
                external
                href={siteConfig.social.github}
                target="_blank"
                variant="ghost"
              >
                DaviBenucci
              </LinkButton>
            </InfoCard>
          </CardGrid>
        </PageSection>
      </ChapterPage>
    </>
  );
}
