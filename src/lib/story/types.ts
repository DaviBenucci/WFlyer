export type StoryChapterId =
  | "home"
  | "professional-about"
  | "professional-services"
  | "professional-process"
  | "professional-projects"
  | "professional-contact"
  | "professional-terminal";

export type StoryDocumentNodeId = StoryChapterId | "global-footer";

export type StoryBranch = "origin" | "professional";

export type StoryTimelineLabel =
  | "home"
  | "pro-about"
  | "pro-services"
  | "pro-process"
  | "pro-projects"
  | "pro-contact"
  | "pro-terminal";

export type StoryHash =
  | "#home"
  | "#sobre"
  | "#servicos"
  | "#processo"
  | "#projetos"
  | "#contato";

export type StoryDetailRoute =
  | "/"
  | "/sobre"
  | "/servicos"
  | "/processo"
  | "/contato";

export type StoryHeaderMembership = boolean | "center-brand";

export type StorySemanticSlotId = string;

export interface StoryScoreHook<
  TChapterId extends StoryChapterId = StoryChapterId,
> {
  readonly segmentId: TChapterId;
  /**
   * Phase 9 maps each Professional segment to approved deterministic Music
   * slots. Home remains the narrative origin.
   */
  readonly semanticSlotIds: readonly StorySemanticSlotId[];
}

export interface StoryChapter<
  TChapterId extends StoryChapterId = StoryChapterId,
> {
  readonly kind: "chapter";
  readonly id: TChapterId;
  readonly label: string;
  readonly branch: StoryBranch;
  readonly timelineLabel: StoryTimelineLabel;
  readonly header: StoryHeaderMembership;
  readonly hash?: StoryHash;
  readonly detailRoute?: StoryDetailRoute;
  readonly finalBarlineBefore?: true;
  /** Stable, geometry-free hook for later scene integration. */
  readonly sceneId: TChapterId;
  /** Stable, content-free hook for later continuous-score integration. */
  readonly scoreHook: StoryScoreHook<TChapterId>;
}

export interface StoryGlobalFooter {
  readonly kind: "global-footer";
  readonly id: "global-footer";
}

export type StoryDocumentNode = StoryChapter | StoryGlobalFooter;

export interface StoryBranchDefinition {
  readonly desktopDirection: "right";
  readonly mobileOrder: 1;
}

export interface StoryHeaderNavigation {
  readonly center: "home";
  readonly professional: readonly StoryChapterId[];
}
