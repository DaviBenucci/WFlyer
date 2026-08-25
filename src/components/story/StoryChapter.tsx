import { LinkButton } from "@/components/ui";
import { Container, Eyebrow, Heading, Text } from "@/components/ui";
import { STORY_V2_CONTENT } from "@/content/story-v2";
import type { StoryChapter as StoryChapterModel } from "@/lib/story";

import styles from "./story.module.css";

export interface StoryChapterProps {
  readonly chapter: StoryChapterModel;
  readonly documentIndex: number;
}

function nativeLinkAttributes() {
  return {
    "data-score-transition": "native",
  } as const;
}

export function StoryChapter({ chapter, documentIndex }: StoryChapterProps) {
  const content = STORY_V2_CONTENT[chapter.id];
  const headingId = `${chapter.id}-heading`;
  const isHome = chapter.id === "home";
  const isTerminal = chapter.finalBarlineBefore === true;

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.chapter} ${isTerminal ? styles.terminal : ""}`}
      data-chapter-id={chapter.id}
      data-future-score-segment={chapter.scoreHook.segmentId}
      data-future-score-slot-count={chapter.scoreHook.semanticSlotIds.length}
      data-story-branch={chapter.branch}
      data-story-document-index={documentIndex}
      data-story-scene={chapter.sceneId}
      data-story-timeline-label={chapter.timelineLabel}
      id={chapter.hash?.slice(1)}
    >
      <Container className={styles.chapterInner} size="content">
        <div className={styles.copy}>
          {isTerminal ? (
            <div
              aria-hidden="true"
              className={styles.finalBarline}
              data-final-barline="decorative"
            />
          ) : null}
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Heading
            as={isHome ? "h1" : "h2"}
            id={headingId}
            size={isHome ? "display" : "xl"}
          >
            {content.title}
          </Heading>
          <Text className={styles.description} size="lead">
            {content.description}
          </Text>
          {content.note ? <p className={styles.note}>{content.note}</p> : null}
          {content.structuralPlaceholder ? (
            <p className={styles.placeholderStatus} role="note">
              <strong>{content.structuralPlaceholder.label}.</strong>{" "}
              {content.structuralPlaceholder.status}
            </p>
          ) : null}
          {content.detailLink || content.primaryAction ? (
            <div className={styles.actions}>
              {content.primaryAction ? (
                <LinkButton
                  {...nativeLinkAttributes()}
                  external={content.primaryAction.external === true}
                  href={content.primaryAction.href}
                >
                  {content.primaryAction.label}
                </LinkButton>
              ) : null}
              {content.detailLink ? (
                <a
                  {...nativeLinkAttributes()}
                  className={styles.detailLink}
                  href={content.detailLink.href}
                >
                  {content.detailLink.label}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        {content.items ? (
          <ol className={styles.itemGrid}>
            {content.items.map((item) => (
              <li className={styles.item} key={item.title}>
                {item.label ? (
                  <span className={styles.itemLabel}>{item.label}</span>
                ) : null}
                <h3 className={styles.itemTitle}>{item.title}</h3>
                {item.meta ? (
                  <p className={styles.itemMeta}>{item.meta}</p>
                ) : null}
                <p className={styles.itemDescription}>{item.description}</p>
                {item.link ? (
                  <a
                    {...nativeLinkAttributes()}
                    className={styles.itemLink}
                    href={item.link.href}
                  >
                    {item.link.label}
                  </a>
                ) : null}
              </li>
            ))}
          </ol>
        ) : null}

        {content.structuralPlaceholder ? (
          <div
            aria-hidden="true"
            className={styles.placeholder}
            data-structural-placeholder={chapter.id}
          >
            {content.structuralPlaceholder.label}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
