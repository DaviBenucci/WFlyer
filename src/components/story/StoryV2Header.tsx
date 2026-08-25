import type { ReactNode } from "react";

import { Container } from "@/components/ui";
import { HEADER_NAVIGATION, STORY_CHAPTER_BY_ID } from "@/lib/story";

import styles from "./story.module.css";

export interface StoryV2HeaderProps {
  readonly themeControl?: ReactNode;
}

const HEADER_ORDER = [
  ...HEADER_NAVIGATION.application,
  HEADER_NAVIGATION.center,
  ...HEADER_NAVIGATION.professional,
] as const;

export function StoryV2Header({ themeControl }: StoryV2HeaderProps) {
  return (
    <header className={styles.header} data-story-v2-header="phase-2">
      <Container className={styles.headerInner} size="wide">
        <nav aria-label="Navegação da história vertical">
          <ul className={styles.navigationList}>
            {HEADER_ORDER.map((chapterId) => {
              const chapter = STORY_CHAPTER_BY_ID[chapterId];

              if (!chapter.hash) return null;

              return (
                <li key={chapter.id}>
                  <a
                    aria-label={
                      chapter.id === "home" ? "W_Flyer — Home" : undefined
                    }
                    className={
                      chapter.id === "home"
                        ? `${styles.navigationLink} ${styles.brand}`
                        : styles.navigationLink
                    }
                    data-score-transition="native"
                    href={chapter.hash}
                  >
                    {chapter.id === "home" ? "W_Flyer" : chapter.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className={styles.themeControl}>{themeControl}</div>
      </Container>
    </header>
  );
}
