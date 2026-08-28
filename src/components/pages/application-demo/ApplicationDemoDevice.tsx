"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import {
  createApplicationDemoInitialState,
  reduceApplicationDemoState,
} from "./application-demo-state";
import styles from "./application-demo-device.module.css";

export interface ApplicationDemoMediaContract {
  readonly finalFrameSrc: string;
  readonly mp4Src: string;
  readonly posterSrc: string;
  readonly webmSrc: string;
}

export interface ApplicationDemoDeviceProps {
  readonly isActive?: boolean | undefined;
  readonly media?: ApplicationDemoMediaContract | undefined;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onStoreChange: () => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

function subscribeToDocumentVisibility(onStoreChange: () => void): () => void {
  document.addEventListener("visibilitychange", onStoreChange);
  return () => document.removeEventListener("visibilitychange", onStoreChange);
}

function getDocumentVisibilitySnapshot(): boolean {
  return !document.hidden;
}

function getDocumentVisibilityServerSnapshot(): boolean {
  return true;
}

function hasCompleteMediaContract(
  media: ApplicationDemoMediaContract | undefined,
): media is ApplicationDemoMediaContract {
  return Boolean(
    media?.webmSrc.trim() &&
      media.mp4Src.trim() &&
      media.posterSrc.trim() &&
      media.finalFrameSrc.trim(),
  );
}

export function ApplicationDemoDevice({
  isActive,
  media,
}: ApplicationDemoDeviceProps) {
  const rootRef = useRef<HTMLElement>(null);
  const resolvedMedia = hasCompleteMediaContract(media) ? media : undefined;
  const completeMediaContract = resolvedMedia !== undefined;
  const subscribeToCanonicalActivity = useCallback(
    (onStoreChange: () => void): (() => void) => {
      if (isActive !== undefined || !completeMediaContract) {
        return () => undefined;
      }

      const motionRoot = rootRef.current?.closest<HTMLElement>(
        "main[data-motion-lab]",
      );
      if (motionRoot === undefined || motionRoot === null) return () => undefined;

      const observer = new MutationObserver((records) => {
        if (
          records.some(
            (record) => record.attributeName === "data-motion-active-chapter",
          )
        ) {
          onStoreChange();
        }
      });
      observer.observe(motionRoot, {
        attributeFilter: ["data-motion-active-chapter"],
        attributes: true,
      });
      return () => observer.disconnect();
    },
    [completeMediaContract, isActive],
  );
  const getCanonicalActivitySnapshot = useCallback(
    () => {
      if (isActive !== undefined) return isActive;
      if (!completeMediaContract) return false;

      return (
        rootRef.current?.closest<HTMLElement>("main[data-motion-lab]")?.dataset
          .motionActiveChapter === "application-demo"
      );
    },
    [completeMediaContract, isActive],
  );
  const canonicalActivity = useSyncExternalStore(
    subscribeToCanonicalActivity,
    getCanonicalActivitySnapshot,
    () => false,
  );
  const active = isActive ?? canonicalActivity;
  const [state, dispatch] = useReducer(
    reduceApplicationDemoState,
    completeMediaContract,
    createApplicationDemoInitialState,
  );
  const [staticAssetFailed, setStaticAssetFailed] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const documentVisible = useSyncExternalStore(
    subscribeToDocumentVisibility,
    getDocumentVisibilitySnapshot,
    getDocumentVisibilityServerSnapshot,
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const playRequestIdRef = useRef(0);
  const explicitPlaybackRef = useRef(false);

  useEffect(() => {
    if (
      completeMediaContract &&
      !reducedMotion &&
      !window.matchMedia(REDUCED_MOTION_QUERY).matches &&
      documentVisible &&
      active
    ) {
      dispatch({ type: "ACTIVE_CHAPTER_REACHED" });
    }
  }, [
    completeMediaContract,
    documentVisible,
    active,
    reducedMotion,
  ]);

  const renderedState =
    state === "NOT_STARTED" && reducedMotion ? "REDUCED_STATIC" : state;

  useEffect(() => {
    const video = videoRef.current;
    if (video === null) return;

    video.defaultMuted = true;
    video.muted = true;

    const explicitReducedPlayback = reducedMotion && explicitPlaybackRef.current;
    const shouldPlay =
      renderedState === "PLAYING" &&
      active &&
      documentVisible &&
      (!reducedMotion || explicitReducedPlayback);

    if (!shouldPlay) {
      playRequestIdRef.current += 1;
      video.pause();
      return;
    }

    const requestId = playRequestIdRef.current + 1;
    playRequestIdRef.current = requestId;

    try {
      const playResult = video.play();
      if (playResult !== undefined) {
        void playResult.catch(() => {
          if (
            playRequestIdRef.current === requestId &&
            active &&
            !document.hidden
          ) {
            explicitPlaybackRef.current = false;
            dispatch({ type: "MEDIA_FAILED" });
          }
        });
      }
    } catch {
      if (playRequestIdRef.current === requestId) {
        explicitPlaybackRef.current = false;
        dispatch({ type: "MEDIA_FAILED" });
      }
    }
  }, [active, documentVisible, reducedMotion, renderedState]);

  useEffect(
    () => () => {
      playRequestIdRef.current += 1;
      videoRef.current?.pause();
    },
    [],
  );

  const handleMediaFailure = (): void => {
    playRequestIdRef.current += 1;
    explicitPlaybackRef.current = false;
    setStaticAssetFailed(true);
    videoRef.current?.pause();
    dispatch({ type: "MEDIA_FAILED" });
  };

  const handleEnded = (): void => {
    explicitPlaybackRef.current = false;
    dispatch({ type: "MEDIA_ENDED" });
  };

  const handleReplay = (): void => {
    const video = videoRef.current;
    if (!completeMediaContract || video === null) return;

    setStaticAssetFailed(false);
    explicitPlaybackRef.current = true;
    playRequestIdRef.current += 1;

    try {
      video.currentTime = 0;
      dispatch({ type: "REPLAY_REQUESTED" });
    } catch {
      handleMediaFailure();
    }
  };

  const showPoster =
    completeMediaContract &&
    !staticAssetFailed &&
    (renderedState === "NOT_STARTED" ||
      renderedState === "REDUCED_STATIC" ||
      renderedState === "ERROR_STATIC");
  const showFinalFrame =
    completeMediaContract &&
    !staticAssetFailed &&
    renderedState === "FINAL_FRAME";
  const showReplay =
    completeMediaContract &&
    (renderedState === "FINAL_FRAME" ||
      renderedState === "REDUCED_STATIC" ||
      renderedState === "ERROR_STATIC");
  const fallbackMessage = !completeMediaContract
    ? "WebM, MP4, poster e quadro final aguardam fornecimento e aprovação humana."
    : "A demonstração em vídeo não pôde ser reproduzida. A navegação continua disponível.";

  return (
    <figure
      className={styles.device}
      data-app04-active={active ? "true" : "false"}
      data-app04-document-visible={documentVisible ? "true" : "false"}
      data-app04-media-contract={completeMediaContract ? "complete" : "missing"}
      data-app04-state={renderedState}
      data-application-demo-device="phase-8"
      ref={rootRef}
    >
      <div className={styles.perspective}>
        <div className={styles.shell} data-app04-device-shell="">
          <span aria-hidden="true" className={styles.camera} />
          <div
            aria-label="Tela da demonstração visual da aplicação"
            className={styles.screen}
            data-app04-screen=""
            data-simulated-application-ui="inert"
            role="group"
          >
            {completeMediaContract ? (
              <video
                aria-hidden="true"
                className={`${styles.media} ${
                  renderedState === "PLAYING"
                    ? styles.mediaVisible
                    : styles.mediaHidden
                }`}
                controls={false}
                loop={false}
                muted
                onEnded={handleEnded}
                onError={handleMediaFailure}
                playsInline
                preload="none"
                ref={videoRef}
                tabIndex={-1}
              >
                <source src={resolvedMedia.webmSrc} type="video/webm" />
                <source src={resolvedMedia.mp4Src} type="video/mp4" />
              </video>
            ) : null}

            {showPoster ? (
              <Image
                alt=""
                aria-hidden="true"
                className={styles.media}
                data-app04-static-media="poster"
                fill
                onError={handleMediaFailure}
                sizes="(max-width: 48rem) 100vw, 66vw"
                src={resolvedMedia.posterSrc}
                unoptimized
              />
            ) : null}

            {showFinalFrame ? (
              <Image
                alt=""
                aria-hidden="true"
                className={styles.media}
                data-app04-static-media="final-frame"
                fill
                onError={handleMediaFailure}
                sizes="(max-width: 48rem) 100vw, 66vw"
                src={resolvedMedia.finalFrameSrc}
                unoptimized
              />
            ) : null}

            {renderedState === "ERROR_STATIC" &&
            (!completeMediaContract || staticAssetFailed) ? (
              <div
                className={styles.fallback}
                data-app04-deterministic-fallback=""
              >
                <span aria-hidden="true" className={styles.fallbackMark}>
                  APP-04
                </span>
                <p>{fallbackMessage}</p>
              </div>
            ) : null}

            {showReplay ? (
              <button
                aria-label={
                  renderedState === "FINAL_FRAME"
                    ? "Reproduzir demonstração novamente"
                    : "Reproduzir demonstração"
                }
                className={styles.replay}
                data-app04-replay-control=""
                onClick={handleReplay}
                type="button"
              >
                <span aria-hidden="true">↻</span>
                {renderedState === "FINAL_FRAME" ? "Rever" : "Reproduzir"}
              </button>
            ) : null}

            <p aria-live="polite" className="wf-sr-only" role="status">
              {renderedState === "NOT_STARTED"
                ? "Demonstração pronta e ainda não iniciada."
                : renderedState === "PLAYING"
                  ? "Demonstração em reprodução."
                  : renderedState === "FINAL_FRAME"
                    ? "Demonstração concluída."
                    : renderedState === "REDUCED_STATIC"
                      ? "Demonstração estática por preferência de movimento reduzido."
                      : fallbackMessage}
            </p>
          </div>
        </div>
        <span aria-hidden="true" className={styles.reflection} />
        <span aria-hidden="true" className={styles.shadow} />
      </div>
      <figcaption>
        Demonstração visual ilustrativa. A tela simulada é inerte; somente o
        controle de reprodução pode receber interação.
      </figcaption>
    </figure>
  );
}
