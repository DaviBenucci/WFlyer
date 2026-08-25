import type { ProjectRecord } from "@/content/public";

import { CardGrid, InfoCard, TagList } from "./StaticPage";

export function ProjectListing({
  projects,
}: {
  readonly projects: readonly ProjectRecord[];
}) {
  if (projects.length === 0) {
    return (
      <p data-project-empty-state="" role="status">
        Nenhum projeto público está disponível para esta seleção no momento.
      </p>
    );
  }

  return (
    <div data-project-list="">
      <CardGrid columns={3}>
        {projects.map((project) => (
          <InfoCard
            description={project.shortLandingSummary}
            eyebrow={`${project.type} · ${project.status}`}
            href={project.route}
            key={project.slug}
            linkLabel={`Conhecer o projeto ${project.title}`}
            title={project.title}
          >
            <TagList items={project.areas} />
          </InfoCard>
        ))}
      </CardGrid>
    </div>
  );
}
