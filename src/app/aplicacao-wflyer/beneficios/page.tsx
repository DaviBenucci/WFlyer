import {
  BenefitsGrid,
  ChapterPage,
  PageCallout,
} from "@/components/pages";
import { BreadcrumbStructuredData } from "@/components/seo";
import { LinkButton } from "@/components/ui";
import { createPageMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { benefitsContent } from "@/content/site-content";

export const metadata = createPageMetadata(
  "/aplicacao-wflyer/beneficios",
);

export default function BenefitsPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { label: "Home", route: "/" },
          { label: "Aplicação", route: "/aplicacao-wflyer" },
          {
            label: "Benefícios",
            route: "/aplicacao-wflyer/beneficios",
          },
        ]}
      />
      <ChapterPage
        chapterId="application-benefits"
        description={benefitsContent.description}
        eyebrow={benefitsContent.eyebrow}
        title={benefitsContent.title}
      >
        <section
          aria-labelledby="beneficios-title"
          data-compact-archetype-section=""
          id="beneficios"
        >
          <h2 className="wf-sr-only" id="beneficios-title">
            Benefícios para o trabalho musical
          </h2>
          <BenefitsGrid items={benefitsContent.benefits} />
        </section>
        <PageCallout
          action={
            <LinkButton
              external
              href={siteConfig.applicationUrl}
              target="_blank"
            >
              Acessar aplicação
            </LinkButton>
          }
          description="Continue no ambiente separado da aplicação quando quiser conhecer a experiência disponível."
          title="Pronto para seguir para a aplicação?"
        />
      </ChapterPage>
    </>
  );
}
