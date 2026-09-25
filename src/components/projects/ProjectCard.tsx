import type { ProjectRecord } from "@/content/public";

import styles from "./project-cards.module.css";

export interface ProjectCardProps {
  readonly onSelect: () => void;
  readonly position: number;
  readonly project: ProjectRecord;
  readonly selected: boolean;
  readonly total: number;
}

function formatPosition(value: number): string {
  return String(value).padStart(2, "0");
}

export function ProjectCard({
  onSelect,
  position,
  project,
  selected,
  total,
}: ProjectCardProps) {
  return (
    <article
      className={styles.card}
      data-project-card={project.slug}
    >
      <div
        aria-label={`Selecionar projeto ${project.title}`}
        aria-pressed={selected}
        className={styles.cardLink}
        data-project-card-link=""
        onClick={onSelect}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect();
          }
        }}
        role="button"
        tabIndex={0}
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
          Selecionar projeto
          <span className={styles.callToActionArrow}>→</span>
        </span>
      </div>
    </article>
  );
}
