"use client";

import type { ReactNode } from "react";

import { Container } from "@/components/ui";
import { HEADER_NAVIGATION_ORDER, STORY_CHAPTER_BY_ID } from "@/lib/story";

import { useStoryNavigation } from "./StoryNavigationContext";
import styles from "./story.module.css";

export interface StoryV2HeaderProps {
  readonly themeControl?: ReactNode;
}

export function StoryV2Header({ themeControl }: StoryV2HeaderProps) {
  const { activeChapterId, requestNavigation } = useStoryNavigation();

  return (
    <header className={styles.header} data-story-v2-header="phase-6">
      <Container className={styles.headerInner} size="wide">
        <nav aria-label="Navegação da história W_Flyer">
          <ul className={styles.navigationList}>
            {HEADER_NAVIGATION_ORDER.map((chapterId) => {
              const chapter = STORY_CHAPTER_BY_ID[chapterId];

              if (!chapter.hash) return null;

              return (
                <li key={chapter.id}>
                  <a
                    aria-current={
                      activeChapterId === chapter.id ? "location" : undefined
                    }
                    aria-label={
                      chapter.id === "home" ? "W_Flyer — Home" : undefined
                    }
                    className={
                      chapter.id === "home"
                        ? `${styles.navigationLink} ${styles.brand}`
                        : styles.navigationLink
                    }
                    data-story-active={
                      activeChapterId === chapter.id ? "true" : "false"
                    }
                    data-story-navigation-target={chapter.id}
                    data-score-transition="native"
                    href={chapter.hash}
                    onClick={(event) => {
                      if (
                        event.defaultPrevented ||
                        event.button !== 0 ||
                        event.altKey ||
                        event.ctrlKey ||
                        event.metaKey ||
                        event.shiftKey
                      ) {
                        return;
                      }
                      if (requestNavigation(chapter.id)) {
                        event.preventDefault();
                      }
                    }}
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
