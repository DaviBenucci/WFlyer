import { STORY_V2_CONTENT_STATUS } from "@/content/story-v2";
import { MOBILE_DOCUMENT_ORDER, MOBILE_STORY_CHAPTERS } from "@/lib/story";

import { StoryChapter } from "./StoryChapter";
import styles from "./story.module.css";

export function StaticStorySkeleton() {
  return (
    <main
      className={styles.storyDocument}
      data-story-document-order={MOBILE_DOCUMENT_ORDER.join(" ")}
      data-story-mode="static-vertical"
      data-story-v2="phase-2"
      id="main-content"
      tabIndex={-1}
    >
      <p className={styles.phaseNotice}>{STORY_V2_CONTENT_STATUS}</p>
      {MOBILE_STORY_CHAPTERS.map((chapter, index) => (
        <StoryChapter
          chapter={chapter}
          documentIndex={index + 1}
          key={chapter.id}
        />
      ))}
    </main>
  );
}
