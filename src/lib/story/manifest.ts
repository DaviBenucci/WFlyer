import type {
  StoryBranchDefinition,
  StoryChapter,
  StoryChapterId,
  StoryDocumentNode,
  StoryDocumentNodeId,
  StoryGlobalFooter,
  StoryHeaderNavigation,
  StoryScoreHook,
  StorySemanticSlotId,
} from "./types";

const EMPTY_SEMANTIC_SLOT_IDS: readonly StorySemanticSlotId[] = Object.freeze(
  [],
);

function defineChapter<const TChapterId extends StoryChapterId>(
  chapter: Omit<StoryChapter<TChapterId>, "scoreHook"> & {
    readonly scoreHook: StoryScoreHook<TChapterId>;
  },
): Readonly<StoryChapter<TChapterId>> {
  return Object.freeze({
    ...chapter,
    scoreHook: Object.freeze(chapter.scoreHook),
  });
}

function scoreHook<const TChapterId extends StoryChapterId>(
  segmentId: TChapterId,
): StoryScoreHook<TChapterId> {
  return {
    segmentId,
    semanticSlotIds:
      segmentId === "home"
        ? EMPTY_SEMANTIC_SLOT_IDS
        : Object.freeze([
            `${segmentId}:primary`,
            `${segmentId}:reserved`,
          ]),
  };
}

export const STORY_BRANCHES = Object.freeze({
  professional: Object.freeze({
    desktopDirection: "right",
    mobileOrder: 1,
  }),
}) satisfies Readonly<Record<"professional", StoryBranchDefinition>>;

/**
 * Chapter records follow the source order in story-chapters.v2.yaml. Rendering
 * order is intentionally explicit in MOBILE_DOCUMENT_ORDER and
 * DESKTOP_TIMELINE_ORDER rather than inferred from this array.
 */
export const STORY_CHAPTERS = Object.freeze([
  defineChapter({
    kind: "chapter",
    id: "home",
    label: "Home",
    hash: "#home",
    branch: "origin",
    timelineLabel: "home",
    header: "center-brand",
    detailRoute: "/",
    sceneId: "home",
    scoreHook: scoreHook("home"),
  }),
  defineChapter({
    kind: "chapter",
    id: "professional-about",
    label: "Sobre",
    hash: "#sobre",
    branch: "professional",
    timelineLabel: "pro-about",
    header: true,
    detailRoute: "/sobre",
    sceneId: "professional-about",
    scoreHook: scoreHook("professional-about"),
  }),
  defineChapter({
    kind: "chapter",
    id: "professional-services",
    label: "Serviços",
    hash: "#servicos",
    branch: "professional",
    timelineLabel: "pro-services",
    header: true,
    detailRoute: "/servicos",
    sceneId: "professional-services",
    scoreHook: scoreHook("professional-services"),
  }),
  defineChapter({
    kind: "chapter",
    id: "professional-process",
    label: "Processo",
    hash: "#processo",
    branch: "professional",
    timelineLabel: "pro-process",
    header: true,
    detailRoute: "/processo",
    sceneId: "professional-process",
    scoreHook: scoreHook("professional-process"),
  }),
  defineChapter({
    kind: "chapter",
    id: "professional-projects",
    label: "Projetos",
    hash: "#projetos",
    branch: "professional",
    timelineLabel: "pro-projects",
    header: true,
    sceneId: "professional-projects",
    scoreHook: scoreHook("professional-projects"),
  }),
  defineChapter({
    kind: "chapter",
    id: "professional-contact",
    label: "Contato",
    hash: "#contato",
    branch: "professional",
    timelineLabel: "pro-contact",
    header: true,
    detailRoute: "/contato",
    sceneId: "professional-contact",
    scoreHook: scoreHook("professional-contact"),
  }),
  defineChapter({
    kind: "chapter",
    id: "professional-terminal",
    label: "Professional terminal",
    branch: "professional",
    timelineLabel: "pro-terminal",
    header: false,
    finalBarlineBefore: true,
    sceneId: "professional-terminal",
    scoreHook: scoreHook("professional-terminal"),
  }),
] as const satisfies readonly StoryChapter[]);

export const STORY_CHAPTER_BY_ID = Object.freeze(
  Object.fromEntries(STORY_CHAPTERS.map((chapter) => [chapter.id, chapter])),
) as Readonly<Record<StoryChapterId, StoryChapter>>;

export const DESKTOP_TIMELINE_ORDER = Object.freeze([
  "home",
  "professional-about",
  "professional-services",
  "professional-process",
  "professional-projects",
  "professional-contact",
  "professional-terminal",
] as const satisfies readonly StoryChapterId[]);

export const MOBILE_DOCUMENT_ORDER = Object.freeze([
  "home",
  "professional-about",
  "professional-services",
  "professional-process",
  "professional-projects",
  "professional-contact",
  "professional-terminal",
  "global-footer",
] as const satisfies readonly StoryDocumentNodeId[]);

export const GLOBAL_STORY_FOOTER: StoryGlobalFooter = Object.freeze({
  kind: "global-footer",
  id: "global-footer",
});

export const MOBILE_STORY_CHAPTERS: readonly StoryChapter[] = Object.freeze(
  MOBILE_DOCUMENT_ORDER.filter(
    (nodeId): nodeId is StoryChapterId => nodeId !== "global-footer",
  ).map((chapterId) => STORY_CHAPTER_BY_ID[chapterId]),
);

export const MOBILE_STORY_DOCUMENT: readonly StoryDocumentNode[] = Object.freeze(
  MOBILE_DOCUMENT_ORDER.map((nodeId) =>
    nodeId === "global-footer"
      ? GLOBAL_STORY_FOOTER
      : STORY_CHAPTER_BY_ID[nodeId],
  ),
);

/** Header targets only; consumers resolve labels/hashes through the chapter map. */
export const HEADER_NAVIGATION: StoryHeaderNavigation = Object.freeze({
  center: "home",
  professional: Object.freeze([
    "professional-about",
    "professional-services",
    "professional-process",
    "professional-projects",
    "professional-contact",
  ] as const satisfies readonly StoryChapterId[]),
});

/** Exact canonical header order, derived from the branch-owned target lists. */
export const HEADER_NAVIGATION_ORDER = Object.freeze([
  HEADER_NAVIGATION.center,
  ...HEADER_NAVIGATION.professional,
] as const satisfies readonly StoryChapterId[]);
