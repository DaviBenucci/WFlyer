import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  DESKTOP_TIMELINE_ORDER,
  GLOBAL_STORY_FOOTER,
  HEADER_NAVIGATION,
  HEADER_NAVIGATION_ORDER,
  MOBILE_DOCUMENT_ORDER,
  MOBILE_STORY_CHAPTERS,
  MOBILE_STORY_DOCUMENT,
  STORY_BRANCHES,
  STORY_CHAPTER_BY_ID,
  STORY_CHAPTERS,
  type StoryChapter,
} from "@/lib/story";
import { parseYamlSubset } from "../../helpers/parse-yaml-subset";

interface CanonicalChapter {
  readonly id: string;
  readonly label: string;
  readonly hash?: string;
  readonly branch: string;
  readonly timelineLabel: string;
  readonly header: boolean | string;
  readonly availabilityState?: string;
  readonly detailRoute?: string;
  readonly externalAction?: string;
  readonly finalBarlineBefore?: boolean;
}

interface CanonicalStoryManifest {
  readonly version: string;
  readonly status: string;
  readonly canonicalLanguage: string;
  readonly publicLanguage: string;
  readonly branches: Record<string, unknown>;
  readonly chapters: readonly CanonicalChapter[];
  readonly desktopTimelineOrder: readonly string[];
  readonly mobileDocumentOrder: readonly string[];
}

function readCanonicalManifest(): CanonicalStoryManifest {
  const manifestPath = resolve(
    process.cwd(),
    "docs/canonical-v2/manifests/story-chapters.v2.yaml",
  );

  return parseYamlSubset(
    readFileSync(manifestPath, "utf8"),
  ) as unknown as CanonicalStoryManifest;
}

function toCanonicalChapter(chapter: StoryChapter): CanonicalChapter {
  return {
    id: chapter.id,
    label: chapter.label,
    ...(chapter.hash === undefined ? {} : { hash: chapter.hash }),
    branch: chapter.branch,
    timelineLabel: chapter.timelineLabel,
    header: chapter.header,
    ...(chapter.availabilityState === undefined
      ? {}
      : { availabilityState: chapter.availabilityState }),
    ...(chapter.detailRoute === undefined
      ? {}
      : { detailRoute: chapter.detailRoute }),
    ...(chapter.externalAction === undefined
      ? {}
      : { externalAction: chapter.externalAction }),
    ...(chapter.finalBarlineBefore === undefined
      ? {}
      : { finalBarlineBefore: chapter.finalBarlineBefore }),
  };
}

describe("v2 story manifest", () => {
  it("mirrors the canonical chapter, branch, and order mappings exactly", () => {
    const canonical = readCanonicalManifest();

    expect(canonical).toMatchObject({
      version: "2.0",
      status: "approved",
      canonicalLanguage: "en",
      publicLanguage: "pt-BR",
    });
    expect(STORY_BRANCHES).toEqual(canonical.branches);
    expect(STORY_CHAPTERS.map(toCanonicalChapter)).toEqual(canonical.chapters);
    expect(DESKTOP_TIMELINE_ORDER).toEqual(canonical.desktopTimelineOrder);
    expect(MOBILE_DOCUMENT_ORDER).toEqual(canonical.mobileDocumentOrder);
  });

  it("keeps every canonical chapter unique and addressable", () => {
    const ids = STORY_CHAPTERS.map(({ id }) => id);
    const hashes = STORY_CHAPTERS.flatMap(({ hash }) =>
      hash === undefined ? [] : [hash],
    );

    expect(STORY_CHAPTERS).toHaveLength(13);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(hashes).size).toBe(hashes.length);
    expect(Object.keys(STORY_CHAPTER_BY_ID).sort()).toEqual([...ids].sort());
  });

  it("builds the vertical document with thirteen chapters and one separate footer", () => {
    expect(MOBILE_STORY_CHAPTERS.map(({ id }) => id)).toEqual(
      MOBILE_DOCUMENT_ORDER.slice(0, -1),
    );
    expect(MOBILE_STORY_DOCUMENT.map(({ id }) => id)).toEqual(
      MOBILE_DOCUMENT_ORDER,
    );
    expect(MOBILE_STORY_DOCUMENT.at(-1)).toBe(GLOBAL_STORY_FOOTER);
    expect(GLOBAL_STORY_FOOTER).toEqual({
      kind: "global-footer",
      id: "global-footer",
    });
  });

  it("exposes only the approved header targets", () => {
    expect(HEADER_NAVIGATION).toEqual({
      application: [
        "application-overview",
        "application-how-it-works",
        "application-benefits",
        "application-access",
      ],
      center: "home",
      professional: [
        "professional-about",
        "professional-services",
        "professional-process",
        "professional-projects",
        "professional-contact",
      ],
    });

    const targetIds = [
      ...HEADER_NAVIGATION.application,
      HEADER_NAVIGATION.center,
      ...HEADER_NAVIGATION.professional,
    ];

    expect(
      STORY_CHAPTERS.filter(({ header }) => header !== false).map(({ id }) => id),
    ).toEqual(expect.arrayContaining(targetIds));
    expect(new Set(targetIds).size).toBe(targetIds.length);
    expect(HEADER_NAVIGATION_ORDER).toEqual(targetIds);
  });

  it("keeps terminals unaddressed and places them after future final barlines", () => {
    for (const terminalId of [
      "application-terminal",
      "professional-terminal",
    ] as const) {
      expect(STORY_CHAPTER_BY_ID[terminalId]).toMatchObject({
        header: false,
        finalBarlineBefore: true,
      });
      expect(STORY_CHAPTER_BY_ID[terminalId]).not.toHaveProperty("hash");
      expect(STORY_CHAPTER_BY_ID[terminalId]).not.toHaveProperty(
        "detailRoute",
      );
      expect(STORY_CHAPTER_BY_ID[terminalId]).not.toHaveProperty(
        "externalAction",
      );
    }
  });

  it("maps geometry-free scene seams to the approved Phase-9 semantic slots", () => {
    const forbiddenGeometryFields = [
      "coordinate",
      "x",
      "y",
      "width",
      "height",
      "entryAnchor",
      "exitAnchor",
      "staffSpace",
    ];

    for (const chapter of STORY_CHAPTERS) {
      expect(chapter.sceneId).toBe(chapter.id);
      expect(chapter.scoreHook.segmentId).toBe(chapter.id);
      expect(chapter.scoreHook.semanticSlotIds).toEqual(
        chapter.id === "home"
          ? []
          : [`${chapter.id}:primary`, `${chapter.id}:reserved`],
      );

      for (const field of forbiddenGeometryFields) {
        expect(chapter).not.toHaveProperty(field);
      }
    }
  });

  it("freezes exported collections and records", () => {
    expect(Object.isFrozen(STORY_CHAPTERS)).toBe(true);
    expect(Object.isFrozen(STORY_CHAPTER_BY_ID)).toBe(true);
    expect(Object.isFrozen(DESKTOP_TIMELINE_ORDER)).toBe(true);
    expect(Object.isFrozen(MOBILE_DOCUMENT_ORDER)).toBe(true);
    expect(Object.isFrozen(MOBILE_STORY_CHAPTERS)).toBe(true);
    expect(Object.isFrozen(MOBILE_STORY_DOCUMENT)).toBe(true);
    expect(Object.isFrozen(HEADER_NAVIGATION)).toBe(true);
    expect(Object.isFrozen(HEADER_NAVIGATION_ORDER)).toBe(true);

    for (const chapter of STORY_CHAPTERS) {
      expect(Object.isFrozen(chapter)).toBe(true);
      expect(Object.isFrozen(chapter.scoreHook)).toBe(true);
      expect(Object.isFrozen(chapter.scoreHook.semanticSlotIds)).toBe(true);
    }
  });
});
