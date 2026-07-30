import type { CSSProperties, ReactNode } from "react";

import { ChapterScore, Staff } from "@/components/music";
import {
  ArrowIcon,
  Card,
  Container,
  Eyebrow,
  Heading,
  LinkButton,
  Surface,
  Text,
} from "@/components/ui";
import {
  scoreChapterById,
  type ChapterId,
} from "@/config/chapters";
import {
  visualArchetypeByPage,
  type VisualArchetypeId,
} from "@/config/archetypes";
import { chapterLabels } from "@/content/site-content";

import styles from "./static-page.module.css";

export interface ChapterPageProps {
  readonly actions?: ReactNode;
  readonly archetype?: VisualArchetypeId;
  readonly auxiliary?: boolean;
  readonly breadcrumbs?: ReactNode;
  readonly chapterId: ChapterId;
  readonly children?: ReactNode;
  readonly description: string;
  readonly eyebrow: string;
  readonly heroVisual?: ReactNode;
  readonly scorePlacement?: "after-content" | "hero";
  readonly showChapterNavigation?: boolean;
  readonly status?: string;
  readonly title: string;
}

export function ChapterPage({
  actions,
  archetype,
  auxiliary = false,
  breadcrumbs,
  chapterId,
  children,
  description,
  eyebrow,
  heroVisual,
  scorePlacement = "hero",
  showChapterNavigation = true,
  status,
  title,
}: ChapterPageProps) {
  const chapter = scoreChapterById[chapterId];
  const isMainChapter = !auxiliary && chapter.branch !== "origin";
  const resolvedArchetype =
    archetype ?? visualArchetypeByPage[chapter.id];
  const score = isMainChapter ? (
    <ChapterScore
      branch={chapter.branch}
      className={styles.score}
      data-score-chapter={chapter.id}
      data-score-placement={scorePlacement}
      entryAnchorY={chapter.entry_anchor_y}
      entryEdge={chapter.entry_edge}
      exitAnchorY={chapter.exit_anchor_y}
      exitEdge={chapter.exit_edge}
    />
  ) : (
    <Staff
      className={styles.score}
      data-score-placement={scorePlacement}
      data-score-variant="auxiliary"
      density="quiet"
      direction="right"
    />
  );

  return (
    <main
      className={styles.page}
      data-archetype={resolvedArchetype}
      data-branch={chapter.branch}
      data-chapter={isMainChapter ? chapter.id : undefined}
      data-coordinate={isMainChapter ? chapter.coordinate : undefined}
      data-entry-anchor-y={
        isMainChapter ? chapter.entry_anchor_y : undefined
      }
      data-entry-edge={isMainChapter ? chapter.entry_edge : undefined}
      data-exit-anchor-y={isMainChapter ? chapter.exit_anchor_y : undefined}
      data-exit-edge={isMainChapter ? chapter.exit_edge : undefined}
      data-parent-chapter={auxiliary ? chapter.id : undefined}
      data-route-kind={auxiliary ? "auxiliary" : "chapter"}
      data-terminal={
        isMainChapter && chapter.terminal ? "true" : "false"
      }
      id="main-content"
      tabIndex={-1}
    >
      <Container>
        {breadcrumbs ? (
          <div className={styles.breadcrumbSlot}>{breadcrumbs}</div>
        ) : null}
        <header
          className={styles.hero}
          data-has-visual={heroVisual ? "true" : "false"}
        >
          <div className={styles.heroCopy}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <Heading as="h1" size="display">
              {title}
            </Heading>
            <Text size="lead" tone="muted">
              {description}
            </Text>
            {status ? <p className={styles.status}>{status}</p> : null}
            {actions ? (
              <div className={styles.heroActions}>{actions}</div>
            ) : null}
          </div>
          {heroVisual ? (
            <div className={styles.heroVisual}>{heroVisual}</div>
          ) : null}
          {scorePlacement === "hero" ? score : null}
        </header>

        {children}
        {scorePlacement === "after-content" ? score : null}

        {isMainChapter && showChapterNavigation ? (
          <ChapterNavigation chapterId={chapterId} />
        ) : null}
        {isMainChapter && chapter.terminal ? (
          <ChapterScore
            branch={chapter.branch}
            className={styles.terminalScore}
            data-score-chapter={chapter.id}
            entryAnchorY={chapter.entry_anchor_y}
            entryEdge={chapter.entry_edge}
            exitAnchorY={chapter.exit_anchor_y}
            exitEdge={chapter.exit_edge}
            terminal
          />
        ) : null}
      </Container>
    </main>
  );
}

export interface PageSectionProps {
  readonly children: ReactNode;
  readonly description?: string;
  readonly eyebrow?: string;
  readonly id?: string;
  readonly title: string;
}

export function PageSection({
  children,
  description,
  eyebrow,
  id,
  title,
}: PageSectionProps) {
  return (
    <section aria-labelledby={id ? `${id}-title` : undefined} className={styles.section} id={id}>
      <div className={styles.sectionHeader}>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <Heading as="h2" id={id ? `${id}-title` : undefined} size="lg">
          {title}
        </Heading>
        {description ? (
          <Text size="lead" tone="muted">
            {description}
          </Text>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function CardGrid({
  children,
  columns = 3,
}: {
  readonly children: ReactNode;
  readonly columns?: 2 | 3 | 4 | 5;
}) {
  return (
    <div
      className={styles.cardGrid}
      style={{ "--wf-card-columns": columns } as CSSProperties}
    >
      {children}
    </div>
  );
}

export interface InfoCardProps {
  readonly children?: ReactNode;
  readonly description: string;
  readonly eyebrow?: string;
  readonly href?: string;
  readonly linkLabel?: string;
  readonly title: string;
}

export function InfoCard({
  children,
  description,
  eyebrow,
  href,
  linkLabel,
  title,
}: InfoCardProps) {
  return (
    <Card className={styles.card} interactive={Boolean(href)}>
      {eyebrow ? <span className={styles.cardMeta}>{eyebrow}</span> : null}
      <Heading as="h3" size="sm">
        {title}
      </Heading>
      <Text tone="muted">{description}</Text>
      {children}
      {href && linkLabel ? (
        <a className={styles.cardLink} href={href}>
          {linkLabel}
        </a>
      ) : null}
    </Card>
  );
}

export interface StepCardProps {
  readonly description: string;
  readonly number: string;
  readonly title: string;
}

export function StepCard({ description, number, title }: StepCardProps) {
  return (
    <Card className={styles.card}>
      <span aria-hidden="true" className={styles.stepNumber}>
        {number}
      </span>
      <Heading as="h3" size="sm">
        {title}
      </Heading>
      <Text tone="muted">{description}</Text>
    </Card>
  );
}

export function BulletList({ items }: { readonly items: readonly string[] }) {
  return (
    <ul className={styles.cardList}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function TagList({ items }: { readonly items: readonly string[] }) {
  return (
    <ul className={styles.tagList}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function ExplorationCue({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <p className={styles.explorationCue} data-exploration-cue="">
      <span aria-hidden="true">↓</span>
      {children}
    </p>
  );
}

export function PageCallout({
  action,
  description,
  title,
}: {
  readonly action: ReactNode;
  readonly description: string;
  readonly title: string;
}) {
  return (
    <Surface className={styles.callout} elevation="raised" padding="large">
      <div className={styles.calloutCopy}>
        <Heading as="h2" size="md">
          {title}
        </Heading>
        <Text tone="muted">{description}</Text>
      </div>
      {action}
    </Surface>
  );
}

export function ChapterNavigation({
  chapterId,
}: {
  readonly chapterId: ChapterId;
}) {
  const chapter = scoreChapterById[chapterId];
  const previous = chapter.previous
    ? scoreChapterById[chapter.previous]
    : null;
  const next = chapter.next ? scoreChapterById[chapter.next] : null;

  if (!previous && !next) {
    return null;
  }

  const previousLink = previous ? (
    <LinkButton
      data-navigation-role="previous"
      href={previous.route}
      leadingIcon={
        chapter.branch === "institutional" ? (
          <ArrowIcon direction="left" />
        ) : undefined
      }
      trailingIcon={
        chapter.branch === "application" ? <ArrowIcon /> : undefined
      }
      variant="secondary"
    >
      Anterior: {chapterLabels[previous.id]}
    </LinkButton>
  ) : null;
  const nextLink = next ? (
    <LinkButton
      data-navigation-role="next"
      href={next.route}
      leadingIcon={
        chapter.branch === "application" ? (
          <ArrowIcon direction="left" />
        ) : undefined
      }
      trailingIcon={
        chapter.branch === "institutional" ? <ArrowIcon /> : undefined
      }
    >
      Próximo: {chapterLabels[next.id]}
    </LinkButton>
  ) : null;

  return (
    <nav
      aria-label="Navegação entre capítulos"
      className={styles.chapterNavigation}
      data-branch={chapter.branch}
    >
      {chapter.branch === "application" ? nextLink : previousLink}
      {chapter.branch === "application" ? previousLink : nextLink}
    </nav>
  );
}

export function Breadcrumbs({
  items,
}: {
  readonly items: readonly {
    readonly href?: string;
    readonly label: string;
  }[];
}) {
  return (
    <nav aria-label="Trilha de navegação">
      <ol className={styles.breadcrumbs}>
        {items.map((item) => (
          <li key={`${item.href ?? "current"}-${item.label}`}>
            {item.href ? <a href={item.href}>{item.label}</a> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function StatePage({
  actions,
  description,
  eyebrow,
  title,
}: {
  readonly actions: ReactNode;
  readonly description: string;
  readonly eyebrow: string;
  readonly title: string;
}) {
  return (
    <main className={styles.statePage} id="main-content" tabIndex={-1}>
      <Container className={styles.stateContent} size="content">
        <Eyebrow>{eyebrow}</Eyebrow>
        <Heading as="h1" size="display">
          {title}
        </Heading>
        <Text size="lead" tone="muted">
          {description}
        </Text>
        <div className={styles.stateActions}>{actions}</div>
      </Container>
    </main>
  );
}

export const staticPageStyles = {
  legalContent: styles.legalContent,
  legalLayout: styles.legalLayout,
  legalSection: styles.legalSection,
  legalToc: styles.legalToc,
  updatedAt: styles.updatedAt,
};
