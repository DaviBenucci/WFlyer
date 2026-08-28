import type { ProjectRecord } from "@/content/public";

import styles from "./project-cards.module.css";

export interface ProjectCardProps {
  readonly position: number;
  readonly project: ProjectRecord;
  readonly total: number;
}

function formatPosition(value: number): string {
  return String(value).padStart(2, "0");
}

export function ProjectCard({
  position,
  project,
  total,
}: ProjectCardProps) {
  return (
    <article
      className={styles.card}
      data-project-card={project.slug}
    >
      <a
        aria-label={`Conhecer o projeto ${project.title}`}
        className={styles.cardLink}
        data-project-card-link=""
        href={project.route}
      >
        <header className={styles.cardHeader}>
          <span aria-hidden="true" className={styles.position}>
            {formatPosition(position)}
            <span className={styles.positionDivider}>/</span>
            {formatPosition(total)}
          </span>
          <span className={styles.status} data-project-status="">
            <span>Status</span>
            {project.status}
          </span>
        </header>

        <div className={styles.cardBody}>
          <p className={styles.type}>{project.type}</p>
          <h3 className={styles.title}>{project.title}</h3>
          <p className={styles.summary}>{project.shortLandingSummary}</p>

          <dl className={styles.details}>
            <div>
              <dt>Atuação</dt>
              <dd>{project.role}</dd>
            </div>
            {project.areas.length > 0 ? (
              <div>
                <dt>Competências</dt>
                <dd>{project.areas.join(" · ")}</dd>
              </div>
            ) : null}
          </dl>
        </div>

        <span aria-hidden="true" className={styles.callToAction}>
          Conhecer projeto
          <span className={styles.callToActionArrow}>→</span>
        </span>
      </a>
    </article>
  );
}
