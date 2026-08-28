"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { CSSProperties } from "react";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { StoryBootstrapExperience } from "@/components/story-bootstrap";
import {
  isProfessionalChapterId,
  ProfessionalChapterScene,
  useStoryNavigationBridge,
} from "@/components/story";
import { Container } from "@/components/ui";
import {
  DESKTOP_TIMELINE_ORDER,
  MOBILE_DOCUMENT_ORDER,
  STORY_CHAPTER_BY_ID,
} from "@/lib/story";
import {
  MOTION_LAB_DESKTOP_LABELS,
  MOTION_LAB_PLACEHOLDER_CHAPTERS,
  createMotionStoryPositioningAdapter,
  createMotionStoryRuntime,
  type MotionStoryRuntime,
} from "@/lib/story/motion";

import styles from "./motion-story-lab.module.css";

type MotionLabChapterStyle = CSSProperties & {
  readonly "--motion-lab-chapter-span": string;
};

interface MotionStoryRuntimeRegistry {
  readonly get: () => MotionStoryRuntime | null;
  readonly set: (runtime: MotionStoryRuntime | null) => void;
}

function createMotionStoryRuntimeRegistry(): MotionStoryRuntimeRegistry {
  let current: MotionStoryRuntime | null = null;

  return Object.freeze({
    get: () => current,
    set: (runtime: MotionStoryRuntime | null) => {
      current = runtime;
    },
  });
}

export function MotionStoryLab() {
  const [runtimeRegistry] = useState(createMotionStoryRuntimeRegistry);
  const [runtimeGeneration, setRuntimeGeneration] = useState(0);
  const [positioningAdapter] = useState(() =>
      createMotionStoryPositioningAdapter({
        getRuntime: runtimeRegistry.get,
      }),
  );
  const requestRuntimeRemount = useCallback(() => {
    setRuntimeGeneration((generation) => generation + 1);
  }, []);

  return (
    <StoryBootstrapExperience positioningAdapter={positioningAdapter}>
      <MotionStorySurface
        key={runtimeGeneration}
        onRequestRemount={requestRuntimeRemount}
        runtimeRegistry={runtimeRegistry}
      />
    </StoryBootstrapExperience>
  );
}

interface MotionStorySurfaceProps {
  readonly onRequestRemount: () => void;
  readonly runtimeRegistry: MotionStoryRuntimeRegistry;
}

function MotionStorySurface({
  onRequestRemount,
  runtimeRegistry,
}: MotionStorySurfaceProps) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const renderCount = useRef(0);
  const { registerController, reportActiveChapter } =
    useStoryNavigationBridge();

  useLayoutEffect(() => {
    renderCount.current += 1;
    if (rootRef.current !== null) {
      rootRef.current.dataset.motionLabRenderCount = String(
        renderCount.current,
      );
    }
  });

  useGSAP(
    () => {
      const root = rootRef.current;
      const stage = stageRef.current;
      const track = trackRef.current;

      if (root === null || stage === null || track === null) return;

      const runtime = createMotionStoryRuntime({
        forceBuildFailure:
          new URLSearchParams(window.location.search).get("scenario") ===
          "motion-failure",
        onRequestRemount,
        onActiveChapterChange: reportActiveChapter,
        root,
        stage,
        track,
      });
      runtimeRegistry.set(runtime);
      const unregisterController = registerController(runtime);

      return () => {
        unregisterController();
        if (runtimeRegistry.get() === runtime) runtimeRegistry.set(null);
        runtime.destroy();
      };
    },
    {
      dependencies: [
        onRequestRemount,
        registerController,
        reportActiveChapter,
        runtimeRegistry,
      ],
      scope: rootRef,
    },
  );

  return (
    <main
      className={styles.root}
      data-motion-lab="phase-5"
      data-professional-scenes="phase-7"
      data-story-header-traversal="phase-6"
      data-projection-mode="static"
      data-story-document-order={MOBILE_DOCUMENT_ORDER.join(" ")}
      data-story-v2="phase-5-motion-lab"
      id="main-content"
      ref={rootRef}
      tabIndex={-1}
    >
      <aside aria-label="Diagnóstico do Motion Lab" className={styles.inspector}>
        <Container className={styles.inspectorInner} size="wide">
          <div>
            <p className={styles.eyebrow}>Phases 5–7 · Development only</p>
            <h1 className={styles.title}>Desktop Motion Lab</h1>
          </div>
          <dl className={styles.metrics}>
            <div>
              <dt>Projeção</dt>
              <dd data-motion-diagnostic="projection">static</dd>
            </div>
            <div>
              <dt>Progresso</dt>
              <dd data-motion-diagnostic="progress">0.0000</dd>
            </div>
            <div>
              <dt>Home</dt>
              <dd data-motion-diagnostic="home-progress">pending</dd>
            </div>
            <div>
              <dt>Capítulo ativo</dt>
              <dd data-motion-diagnostic="active-chapter">home</dd>
            </div>
            <div>
              <dt>Lifecycle</dt>
              <dd data-motion-diagnostic="lifecycle">not-mounted</dd>
            </div>
          </dl>
          <details className={styles.labelInspection}>
            <summary>Inspecionar labels canônicos</summary>
            <ol data-motion-label-order={MOTION_LAB_DESKTOP_LABELS.join(" ")}>
              {DESKTOP_TIMELINE_ORDER.map((chapterId) => {
                const chapter = STORY_CHAPTER_BY_ID[chapterId];
                return (
                  <li key={chapter.id}>
                    <code>{chapter.timelineLabel}</code> · {chapter.label}
                  </li>
                );
              })}
            </ol>
          </details>
        </Container>
      </aside>

      <div className={styles.stage} data-motion-stage="" ref={stageRef}>
        <div className={styles.track} data-motion-track="" ref={trackRef}>
          {MOTION_LAB_PLACEHOLDER_CHAPTERS.map(
            ({ chapter, desktopIndex, draftSpan }, documentIndex) => {
              const headingId = `${chapter.id}-motion-lab-heading`;
              const isProfessional = isProfessionalChapterId(chapter.id);
              const chapterStyle: MotionLabChapterStyle = {
                "--motion-lab-chapter-span": `${draftSpan * 100}vw`,
                order: desktopIndex,
              };

              return (
                <section
                  aria-labelledby={headingId}
                  className={`${styles.chapter} ${
                    isProfessional ? styles.professionalChapter : ""
                  }`}
                  data-chapter-id={chapter.id}
                  data-motion-desktop-index={desktopIndex}
                  data-motion-draft-span={draftSpan}
                  data-story-branch={chapter.branch}
                  data-story-document-index={documentIndex + 1}
                  data-story-timeline-label={chapter.timelineLabel}
                  id={chapter.hash?.slice(1)}
                  key={chapter.id}
                  style={chapterStyle}
                >
                  {isProfessional ? (
                    <ProfessionalChapterScene
                      chapterId={chapter.id}
                      headingId={headingId}
                    />
                  ) : (
                    <div
                      className={styles.chapterGrid}
                      data-structural-placeholder={chapter.id}
                    >
                      <p className={styles.chapterIndex}>
                        {String(desktopIndex + 1).padStart(2, "0")} / 13
                      </p>
                      <p className={styles.chapterBranch}>{chapter.branch}</p>
                      <h2 id={headingId}>{chapter.label}</h2>
                      <code>{chapter.timelineLabel}</code>
                      <p>
                        Placeholder estrutural. A cena final pertence à fase de
                        implementação do respectivo ramo.
                      </p>
                    </div>
                  )}
                </section>
              );
            },
          )}
        </div>
      </div>
    </main>
  );
}

gsap.registerPlugin(useGSAP);
