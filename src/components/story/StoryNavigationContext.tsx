"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import type { StoryChapterId } from "@/lib/story";

export interface StoryNavigationController {
  navigate(chapterId: StoryChapterId): Promise<unknown> | void;
}

interface StoryNavigationStateContextValue {
  readonly activeChapterId: StoryChapterId | null;
  readonly requestNavigation: (chapterId: StoryChapterId) => boolean;
}

interface StoryNavigationBridgeContextValue {
  readonly registerController: (
    controller: StoryNavigationController,
  ) => () => void;
  readonly reportActiveChapter: (chapterId: StoryChapterId) => void;
}

const DEFAULT_STORY_NAVIGATION_STATE_CONTEXT: StoryNavigationStateContextValue = {
  activeChapterId: null,
  requestNavigation: () => false,
};

const DEFAULT_STORY_NAVIGATION_BRIDGE_CONTEXT: StoryNavigationBridgeContextValue = {
  registerController: () => () => undefined,
  reportActiveChapter: () => undefined,
};

const StoryNavigationStateContext =
  createContext<StoryNavigationStateContextValue>(
    DEFAULT_STORY_NAVIGATION_STATE_CONTEXT,
  );
const StoryNavigationBridgeContext =
  createContext<StoryNavigationBridgeContextValue>(
    DEFAULT_STORY_NAVIGATION_BRIDGE_CONTEXT,
  );

export function StoryNavigationProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const controllerRef = useRef<StoryNavigationController | null>(null);
  const [activeChapterId, setActiveChapterId] =
    useState<StoryChapterId | null>(null);

  const reportActiveChapter = useCallback((chapterId: StoryChapterId) => {
    setActiveChapterId((currentChapterId) =>
      currentChapterId === chapterId ? currentChapterId : chapterId,
    );
  }, []);

  const registerController = useCallback(
    (controller: StoryNavigationController) => {
      controllerRef.current = controller;
      let released = false;

      return () => {
        if (released) return;
        released = true;
        if (controllerRef.current === controller) {
          controllerRef.current = null;
          setActiveChapterId(null);
        }
      };
    },
    [],
  );

  const requestNavigation = useCallback((chapterId: StoryChapterId) => {
    const controller = controllerRef.current;
    if (controller === null) return false;

    void Promise.resolve(controller.navigate(chapterId)).catch(() => undefined);
    return true;
  }, []);

  const stateValue = useMemo<StoryNavigationStateContextValue>(
    () => ({
      activeChapterId,
      requestNavigation,
    }),
    [activeChapterId, requestNavigation],
  );
  const bridgeValue = useMemo<StoryNavigationBridgeContextValue>(
    () => ({ registerController, reportActiveChapter }),
    [registerController, reportActiveChapter],
  );

  return (
    <StoryNavigationBridgeContext.Provider value={bridgeValue}>
      <StoryNavigationStateContext.Provider value={stateValue}>
        {children}
      </StoryNavigationStateContext.Provider>
    </StoryNavigationBridgeContext.Provider>
  );
}

export function useStoryNavigation(): StoryNavigationStateContextValue {
  return useContext(StoryNavigationStateContext);
}

export function useStoryNavigationBridge(): StoryNavigationBridgeContextValue {
  return useContext(StoryNavigationBridgeContext);
}
