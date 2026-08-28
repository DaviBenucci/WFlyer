import type { CSSProperties } from "react";

import type { ProjectRecord } from "@/content/public";

import { ProjectCard } from "./ProjectCard";
import styles from "./project-cards.module.css";

export interface ProjectCardFanProps {
  readonly ariaLabel?: string;
  readonly className?: string;
  readonly projects: readonly ProjectRecord[];
}

type FanItemStyle = CSSProperties & {
  readonly "--project-card-rest-y": string;
  readonly "--project-card-rotation": string;
  readonly "--project-card-selected-z": number;
  readonly "--project-card-z": number;
};

function compactNumber(value: number): number {
  return Number(value.toFixed(3));
}

function getFanItemStyle(index: number, total: number): FanItemStyle {
  const center = (total - 1) / 2;
  const distanceFromCenter = index - center;
  const rotation = Math.max(-4, Math.min(4, distanceFromCenter * 2.25));
  const restY = Math.abs(distanceFromCenter) * 0.4;

  return {
    "--project-card-rest-y": `${compactNumber(restY)}rem`,
    "--project-card-rotation": `${compactNumber(rotation)}deg`,
    "--project-card-selected-z": total + 10,
    "--project-card-z": index + 1,
  };
}

export function ProjectCardFan({
  ariaLabel = "Projetos em destaque",
  className,
  projects,
}: ProjectCardFanProps) {
  const visibleProjects = projects.filter(
    (project) => project.publicationStatus === "public" && project.featured,
  );

  if (visibleProjects.length === 0) {
    return (
      <p
        className={
          className ? `${styles.emptyState} ${className}` : styles.emptyState
        }
        data-project-card-empty=""
        role="status"
      >
        Nenhum projeto público está disponível para esta seleção no momento.
      </p>
    );
  }

  return (
    <div
      className={className ? `${styles.viewport} ${className}` : styles.viewport}
      data-project-card-fan=""
    >
      <ol aria-label={ariaLabel} className={styles.fan} data-project-card-list="">
        {visibleProjects.map((project, index) => (
          <li
            className={styles.fanItem}
            data-project-card-item=""
            data-project-position={index + 1}
            key={project.slug}
            style={getFanItemStyle(index, visibleProjects.length)}
          >
            <ProjectCard
              position={index + 1}
              project={project}
              total={visibleProjects.length}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
