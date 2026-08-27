"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { StoryNavigationProvider } from "@/components/story";

import { SiteExperienceShell } from "./SiteExperienceShell";

const STORY_VISUAL_LAB_PATH = "/__visual-lab/story";

export interface RouteAwareExperienceBoundaryProps {
  readonly children: ReactNode;
  readonly legacyFooter: ReactNode;
  readonly legacyHeader: ReactNode;
  readonly legacyPrelude?: ReactNode;
  readonly storyFooter: ReactNode;
  readonly storyHeader: ReactNode;
  readonly storyVisualLabEnabled?: boolean;
  readonly testMode?: boolean;
}

function isStoryVisualLabPath(pathname: string): boolean {
  return (
    pathname === STORY_VISUAL_LAB_PATH ||
    pathname.startsWith(`${STORY_VISUAL_LAB_PATH}/`)
  );
}

export function RouteAwareExperienceBoundary({
  children,
  legacyFooter,
  legacyHeader,
  legacyPrelude,
  storyFooter,
  storyHeader,
  storyVisualLabEnabled = false,
  testMode = false,
}: RouteAwareExperienceBoundaryProps) {
  const pathname = usePathname();
  const skipLink = (
    <a className="wf-skip-link" href="#main-content">
      Pular para o conteúdo principal
    </a>
  );

  if (storyVisualLabEnabled && isStoryVisualLabPath(pathname)) {
    return (
      <StoryNavigationProvider>
        {skipLink}
        {storyHeader}
        {children}
        {storyFooter}
      </StoryNavigationProvider>
    );
  }

  return (
    <SiteExperienceShell testMode={testMode}>
      {legacyPrelude}
      {skipLink}
      {legacyHeader}
      {children}
      {legacyFooter}
    </SiteExperienceShell>
  );
}
