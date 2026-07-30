import type { CSSProperties, ReactNode } from "react";

import { FinalBarline, StaffSegment } from "@/components/music";
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
  type ChapterBranch,
  type ChapterId,
} from "@/config/chapters";
import { chapterLabels } from "@/content/site-content";

import styles from "./static-page.module.css";

function StaticScore({
  branch,
  terminal = false,
}: {
  readonly branch: ChapterBranch;
  readonly terminal?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      className={terminal ? styles.terminalScore : styles.score}
      focusable="false"
      viewBox="0 0 760 112"
    >
      <StaffSegment
        amplitude={branch === "origin" ? 8 : 14}
        baseY={28}
        direction={branch === "application" ? "left" : "right"}
        endX={terminal ? 700 : 760}
        lineGap={12}
      />
      {terminal ? (
        <FinalBarline
          bottom={88}
          side={branch === "application" ? "start" : "end"}
          top={20}
          x={branch === "application" ? 26 : 734}
        />
      ) : null}
    </svg>
  );
}

export interface ChapterPageProps {
  readonly actions?: ReactNode;
  readonly chapterId: ChapterId;
  readonly children?: ReactNode;
  readonly description: string;
  readonly eyebrow: string;
  readonly showChapterNavigation?: boolean;
  readonly status?: string;
  readonly title: string;
}

export function ChapterPage({
  actions,
  chapterId,
  children,
  description,
  eyebrow,
  showChapterNavigation = true,
  status,
  title,
}: ChapterPageProps) {
  const chapter = scoreChapterById[chapterId];

  return (
    <main
      className={styles.page}
      data-branch={chapter.branch}
      data-chapter={chapter.id}
      data-coordinate={chapter.coordinate}
      data-terminal={chapter.terminal ? "true" : "false"}
      id="main-content"
      tabIndex={-1}
    >
      <Container>
        <header className={styles.hero}>
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
          <StaticScore branch={chapter.branch} />
        </header>

        {children}

        {chapter.terminal ? (
          <StaticScore branch={chapter.branch} terminal />
        ) : null}
        {showChapterNavigation ? (
          <ChapterNavigation chapterId={chapterId} />
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

  return (
    <nav
      aria-label="Navegação entre capítulos"
      className={`${styles.chapterNavigation} ${
        previous && next ? "" : styles.singleNavigation
      }`}
    >
      {previous ? (
        <LinkButton
          href={previous.route}
          leadingIcon={<ArrowIcon direction="left" />}
          variant="secondary"
        >
          Anterior: {chapterLabels[previous.id]}
        </LinkButton>
      ) : null}
      {next ? (
        <LinkButton href={next.route} trailingIcon={<ArrowIcon />}>
          Próximo: {chapterLabels[next.id]}
        </LinkButton>
      ) : null}
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
