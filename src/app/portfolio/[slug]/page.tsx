import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  Breadcrumbs,
  ChapterPage,
  InfoCard,
  PageSection,
  TagList,
} from "@/components/pages";
import { BreadcrumbStructuredData } from "@/components/seo";
import { ArrowIcon, LinkButton } from "@/components/ui";
import { createPageMetadata } from "@/config/seo";
import {
  getPublicProjectBySlug,
  PHASE3_EDITORIAL_STATUS,
  PUBLIC_PROJECTS,
} from "@/content/public";

export function generateStaticParams() {
  return PUBLIC_PROJECTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getPublicProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return createPageMetadata(project.route);
}

export default async function ProjectDetailPage({
  params,
}: {
  readonly params: Promise<{ readonly slug: string }>;
}) {
  const { slug } = await params;
  const project = getPublicProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { label: "Home", route: "/" },
          { label: "Projetos", route: "/portfolio" },
          { label: project.title, route: project.route },
        ]}
      />
      <ChapterPage
        actions={
          <>
            {project.publicUrl ? (
              <LinkButton
                external
                href={project.publicUrl}
                target="_blank"
                trailingIcon={<ArrowIcon />}
              >
                Visitar endereço público
              </LinkButton>
            ) : null}
            <LinkButton href="/portfolio" variant="secondary">
              Voltar aos projetos
            </LinkButton>
          </>
        }
        auxiliary
        breadcrumbs={
          <Breadcrumbs
            items={[
              { href: "/", label: "Home" },
              { href: "/portfolio", label: "Projetos" },
              { label: project.title },
            ]}
          />
        }
        chapterId="portfolio"
        description={project.shortLandingSummary}
        eyebrow={`Projetos · ${project.type}`}
        showChapterNavigation={false}
        status={`${PHASE3_EDITORIAL_STATUS} · ${project.status}`}
        title={project.title}
      >
        <PageSection id="caso" title="Escopo público do projeto">
          <InfoCard description={project.whatItIs} title="O que é" />
        </PageSection>
        <PageSection id="contexto" title="Contexto e atuação">
          <InfoCard description={project.context} title="Contexto" />
          <InfoCard description={project.role} title="Atuação" />
        </PageSection>
        <PageSection id="areas" title="Áreas registradas">
          <TagList items={project.areas} />
        </PageSection>
      </ChapterPage>
    </>
  );
}
