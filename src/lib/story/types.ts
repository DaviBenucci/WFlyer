export type StoryChapterId =
  | "home"
  | "application-overview"
  | "application-how-it-works"
  | "application-benefits"
  | "application-demo"
  | "application-access"
  | "application-terminal"
  | "professional-about"
  | "professional-services"
  | "professional-process"
  | "professional-projects"
  | "professional-contact"
  | "professional-terminal";

export type StoryDocumentNodeId = StoryChapterId | "global-footer";

export type StoryBranch = "origin" | "application" | "professional";

export type StoryTimelineLabel =
  | "home"
  | "app-overview"
  | "app-how"
  | "app-benefits"
  | "app-demo"
  | "app-access"
  | "app-terminal"
  | "pro-about"
  | "pro-services"
  | "pro-process"
  | "pro-projects"
  | "pro-contact"
  | "pro-terminal";

export type StoryHash =
  | "#home"
  | "#aplicacao"
  | "#como-funciona"
  | "#beneficios"
  | "#demonstracao"
  | "#lancamento"
  | "#sobre"
  | "#servicos"
  | "#processo"
  | "#projetos"
  | "#contato";

export type StoryDetailRoute =
  | "/"
  | "/aplicacao-wflyer"
  | "/aplicacao-wflyer/como-funciona"
  | "/aplicacao-wflyer/beneficios"
  | "/aplicacao-wflyer#demonstracao"
  | "/sobre"
  | "/servicos"
  | "/processo"
  | "/portfolio"
  | "/contato";

export type StoryExternalAction = "https://app.wflyer.com.br";

export type ApplicationAvailabilityState = "PRELAUNCH" | "LIVE";

export type StoryHeaderMembership = boolean | "center-brand";

export type StorySemanticSlotId = string;

export interface StoryScoreHook<
  TChapterId extends StoryChapterId = StoryChapterId,
> {
  readonly segmentId: TChapterId;
  /**
   * Phase 9 maps each real branch segment to the approved deterministic Music
   * slots. Home remains the shared origin rather than a thirteenth segment.
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
  readonly externalAction?: StoryExternalAction;
  readonly availabilityState?: ApplicationAvailabilityState;
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
  readonly desktopDirection: "left" | "right";
  readonly mobileOrder: 1 | 2;
}

export interface StoryHeaderNavigation {
  readonly application: readonly StoryChapterId[];
  readonly center: "home";
  readonly professional: readonly StoryChapterId[];
}
