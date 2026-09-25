import { createElement } from "react";
import { flushSync } from "react-dom";
import { createRoot, type Root } from "react-dom/client";

import { ProjectCardFan } from "@/components/projects";
import { getFeaturedPublicProjects } from "@/content/public";

import {
  evaluateProjectsCapacity,
  type ProjectsCapacityResult,
} from "@/lib/story/score/projects-capacity";
import {
  buildStoryScoreProjection,
  type StoryScoreSceneMeasurements,
} from "@/lib/story/score/projection";

import { measureStoryScoreScenes } from "./measurement";

const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

export interface ProjectsHorizontalCandidateSnapshot {
  readonly height: number;
  readonly measurements: StoryScoreSceneMeasurements;
  readonly revision: string;
  readonly signature: string;
  readonly width: number;
}

function invalidCandidate(reason: string): ProjectsCapacityResult {
  return Object.freeze({
    reasons: Object.freeze([reason]),
    signature: `projects-capacity:invalid:${reason}`,
    status: "INVALID" as const,
    visits: Object.freeze([]),
  });
}

function sanitizeCandidate(root: HTMLElement): void {
  root.removeAttribute("data-motion-lab");
  root.setAttribute("aria-hidden", "true");
  root.setAttribute("inert", "");
  root.dataset.projectsCapacityCandidate = "";
  root.dataset.projectionMode = "horizontal-enhanced";

  root
    .querySelectorAll<HTMLElement>("[id]")
    .forEach((element) => element.removeAttribute("id"));
  root.querySelectorAll<HTMLAnchorElement>("a").forEach((anchor) => {
    anchor.removeAttribute("href");
    anchor.removeAttribute("target");
    anchor.tabIndex = -1;
  });
  root
    .querySelectorAll<HTMLInputElement | HTMLButtonElement | HTMLSelectElement | HTMLTextAreaElement>(
      "input, button, select, textarea",
    )
    .forEach((control) => {
      control.disabled = true;
      control.removeAttribute("name");
      control.tabIndex = -1;
    });
  root.querySelectorAll<HTMLImageElement>("img").forEach((image) => {
    image.removeAttribute("srcset");
    image.removeAttribute("sizes");
    image.src = TRANSPARENT_PIXEL;
  });
  root
    .querySelectorAll("iframe, audio, video, source, script")
    .forEach((element) => element.remove());
}

/**
 * Builds one inert horizontal candidate from the mounted production story.
 * The clone has no React/runtime owner and is removed in the same transaction.
 */
export function measureProjectsHorizontalCandidate(
  sourceRoot: HTMLElement,
  viewportWidth: number,
  viewportHeight: number,
  revision: string,
  publishSnapshot?: (snapshot: ProjectsHorizontalCandidateSnapshot) => void,
): ProjectsCapacityResult {
  const host = document.createElement("div");
  const candidate = sourceRoot.cloneNode(true) as HTMLElement;
  let fanRoot: Root | null = null;

  host.dataset.projectsCapacityHost = "";
  Object.assign(host.style, {
    contain: "strict",
    height: `${viewportHeight}px`,
    left: "0",
    overflow: "hidden",
    pointerEvents: "none",
    position: "fixed",
    top: "0",
    visibility: "hidden",
    width: `${viewportWidth}px`,
    zIndex: "-1",
  });
  sanitizeCandidate(candidate);
  Object.assign(candidate.style, {
    height: `${viewportHeight}px`,
    width: `${viewportWidth}px`,
  });
  host.append(candidate);
  document.body.append(host);

  try {
    const track = candidate.querySelector<HTMLElement>("[data-motion-track]");
    if (!track) return invalidCandidate("candidate-track-missing");

    const teaser = candidate.querySelector<HTMLElement>(
      "[data-project-teaser], [data-project-teaser-empty]",
    );
    if (!teaser) return invalidCandidate("candidate-project-teaser-missing");
    const fanMount = document.createElement("div");
    fanMount.style.display = "contents";
    teaser.replaceWith(fanMount);
    fanRoot = createRoot(fanMount);
    flushSync(() => {
      fanRoot?.render(
        createElement(ProjectCardFan, { projects: getFeaturedPublicProjects() }),
      );
    });

    const { measurements, signature } = measureStoryScoreScenes(track);
    const cards = measurements.professionalProjectCards;
    const envelopes = measurements.professionalProjectInteractionEnvelopes;
    const sweeps = measurements.professionalProjectInteractionSweeps;
    if (!cards || cards.length !== 3) {
      return invalidCandidate("candidate-project-cards-missing");
    }

    const projection = buildStoryScoreProjection("horizontal-enhanced", {
      sceneMeasurements: measurements,
      viewportHeight,
      viewportWidth,
    });
    const result = evaluateProjectsCapacity({
      cards: cards.map((idle, index) => {
        const projectIndex = (index + 1) as 1 | 2 | 3;
        const interactionEnvelope = envelopes?.[projectIndex];
        const interactionSweep = sweeps?.[projectIndex];

        return Object.freeze({
          idle,
          projectIndex,
          ...(interactionEnvelope ? { interactionEnvelope } : {}),
          ...(interactionSweep ? { interactionSweep } : {}),
        });
      }),
      clip: Object.freeze({
        height: viewportHeight,
        width: projection.width,
        x: 0,
        y: 0,
      }),
      projection,
      revision: `${revision}:${signature}`,
    });
    publishSnapshot?.(
      Object.freeze({
        height: viewportHeight,
        measurements,
        revision,
        signature,
        width: viewportWidth,
      }),
    );

    return result;
  } catch (error) {
    return invalidCandidate(
      error instanceof Error ? error.name : "candidate-build-failed",
    );
  } finally {
    fanRoot?.unmount();
    host.remove();
  }
}
