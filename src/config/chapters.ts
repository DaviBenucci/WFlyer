export type ChapterBranch = "origin" | "application" | "institutional";
export type ScoreEdge = "center" | "left" | "right";

export type ChapterId =
  | "home"
  | "application"
  | "application-how-it-works"
  | "application-benefits"
  | "company"
  | "services"
  | "process"
  | "portfolio"
  | "contact";

export type ChapterRoute =
  | "/"
  | "/aplicacao-wflyer"
  | "/aplicacao-wflyer/como-funciona"
  | "/aplicacao-wflyer/beneficios"
  | "/sobre"
  | "/servicos"
  | "/processo"
  | "/portfolio"
  | "/contato";

export type AuxiliaryRoute =
  | "/servicos/criacao-de-sites"
  | "/servicos/criacao-de-aplicacoes"
  | "/servicos/integracoes"
  | "/servicos/solucoes-sob-medida"
  | "/politica-de-privacidade"
  | "/politica-de-cookies"
  | "/termos-de-uso"
  | "/acessibilidade";

export type HeaderItem =
  | "home"
  | "application"
  | "how-it-works"
  | "benefits"
  | "company"
  | "services"
  | "portfolio"
  | "contact";

export interface ScoreChapter {
  readonly id: ChapterId;
  readonly route: ChapterRoute;
  readonly branch: ChapterBranch;
  readonly order: number;
  readonly coordinate: number;
  readonly previous: ChapterId | null;
  readonly next: ChapterId | null;
  readonly choices?: readonly ChapterId[];
  readonly final_action?: string;
  readonly active_header_item: HeaderItem;
  readonly active_subchapter?: "process";
  readonly entry_edge: ScoreEdge;
  readonly exit_edge: ScoreEdge;
  readonly entry_anchor_y: number;
  readonly exit_anchor_y: number;
  readonly terminal: boolean;
  readonly final_barline: boolean;
}

export interface AuxiliaryRouteEntry {
  readonly route: AuxiliaryRoute;
  readonly parent_chapter: ChapterId | null;
}

export interface ScoreManifest {
  readonly version: "1.0";
  readonly status: "normative";
  readonly updated_at: "2026-07-29";
  readonly coordinate_system: {
    readonly origin: 0;
    readonly application_direction: "negative-left";
    readonly institutional_direction: "positive-right";
    readonly anchor_y_range: readonly [0, 1];
  };
  readonly chapters: readonly ScoreChapter[];
  readonly auxiliary_routes: readonly AuxiliaryRouteEntry[];
}

/**
 * Espelho tipado de docs/05-implementacao/11-manifesto-capitulos-partitura.yaml.
 * O teste normativo compara este objeto campo a campo com o YAML fonte.
 */
export const scoreManifest = {
  version: "1.0",
  status: "normative",
  updated_at: "2026-07-29",
  coordinate_system: {
    origin: 0,
    application_direction: "negative-left",
    institutional_direction: "positive-right",
    anchor_y_range: [0, 1],
  },
  chapters: [
    {
      id: "home",
      route: "/",
      branch: "origin",
      order: 0,
      coordinate: 0,
      previous: null,
      next: null,
      choices: ["application", "company"],
      active_header_item: "home",
      entry_edge: "center",
      exit_edge: "center",
      entry_anchor_y: 0.5,
      exit_anchor_y: 0.5,
      terminal: false,
      final_barline: false,
    },
    {
      id: "application",
      route: "/aplicacao-wflyer",
      branch: "application",
      order: 1,
      coordinate: -1,
      previous: "home",
      next: "application-how-it-works",
      active_header_item: "application",
      entry_edge: "right",
      exit_edge: "left",
      entry_anchor_y: 0.46,
      exit_anchor_y: 0.68,
      terminal: false,
      final_barline: false,
    },
    {
      id: "application-how-it-works",
      route: "/aplicacao-wflyer/como-funciona",
      branch: "application",
      order: 2,
      coordinate: -2,
      previous: "application",
      next: "application-benefits",
      active_header_item: "how-it-works",
      entry_edge: "right",
      exit_edge: "left",
      entry_anchor_y: 0.68,
      exit_anchor_y: 0.56,
      terminal: false,
      final_barline: false,
    },
    {
      id: "application-benefits",
      route: "/aplicacao-wflyer/beneficios",
      branch: "application",
      order: 3,
      coordinate: -3,
      previous: "application-how-it-works",
      next: null,
      final_action: "https://app.wflyer.com.br",
      active_header_item: "benefits",
      entry_edge: "right",
      exit_edge: "left",
      entry_anchor_y: 0.56,
      exit_anchor_y: 0.64,
      terminal: true,
      final_barline: true,
    },
    {
      id: "company",
      route: "/sobre",
      branch: "institutional",
      order: 1,
      coordinate: 1,
      previous: "home",
      next: "services",
      active_header_item: "company",
      entry_edge: "left",
      exit_edge: "right",
      entry_anchor_y: 0.46,
      exit_anchor_y: 0.68,
      terminal: false,
      final_barline: false,
    },
    {
      id: "services",
      route: "/servicos",
      branch: "institutional",
      order: 2,
      coordinate: 2,
      previous: "company",
      next: "process",
      active_header_item: "services",
      entry_edge: "left",
      exit_edge: "right",
      entry_anchor_y: 0.68,
      exit_anchor_y: 0.74,
      terminal: false,
      final_barline: false,
    },
    {
      id: "process",
      route: "/processo",
      branch: "institutional",
      order: 3,
      coordinate: 3,
      previous: "services",
      next: "portfolio",
      active_header_item: "services",
      active_subchapter: "process",
      entry_edge: "left",
      exit_edge: "right",
      entry_anchor_y: 0.74,
      exit_anchor_y: 0.56,
      terminal: false,
      final_barline: false,
    },
    {
      id: "portfolio",
      route: "/portfolio",
      branch: "institutional",
      order: 4,
      coordinate: 4,
      previous: "process",
      next: "contact",
      active_header_item: "portfolio",
      entry_edge: "left",
      exit_edge: "right",
      entry_anchor_y: 0.56,
      exit_anchor_y: 0.72,
      terminal: false,
      final_barline: false,
    },
    {
      id: "contact",
      route: "/contato",
      branch: "institutional",
      order: 5,
      coordinate: 5,
      previous: "portfolio",
      next: null,
      final_action: "submit-contact-or-return-home",
      active_header_item: "contact",
      entry_edge: "left",
      exit_edge: "right",
      entry_anchor_y: 0.72,
      exit_anchor_y: 0.64,
      terminal: true,
      final_barline: true,
    },
  ],
  auxiliary_routes: [
    {
      route: "/servicos/criacao-de-sites",
      parent_chapter: "services",
    },
    {
      route: "/servicos/criacao-de-aplicacoes",
      parent_chapter: "services",
    },
    {
      route: "/servicos/integracoes",
      parent_chapter: "services",
    },
    {
      route: "/servicos/solucoes-sob-medida",
      parent_chapter: "services",
    },
    {
      route: "/politica-de-privacidade",
      parent_chapter: null,
    },
    {
      route: "/politica-de-cookies",
      parent_chapter: null,
    },
    {
      route: "/termos-de-uso",
      parent_chapter: null,
    },
    {
      route: "/acessibilidade",
      parent_chapter: null,
    },
  ],
} as const satisfies ScoreManifest;

export const scoreChapters = scoreManifest.chapters;
export const auxiliaryRoutes = scoreManifest.auxiliary_routes;

export const scoreChapterById = Object.fromEntries(
  scoreChapters.map((chapter) => [chapter.id, chapter]),
) as Record<ChapterId, (typeof scoreChapters)[number]>;

export const scoreChapterByPath = Object.fromEntries(
  scoreChapters.map((chapter) => [chapter.route, chapter]),
) as Record<ChapterRoute, (typeof scoreChapters)[number]>;

export const auxiliaryRouteByPath = Object.fromEntries(
  auxiliaryRoutes.map((entry) => [entry.route, entry]),
) as Record<AuxiliaryRoute, (typeof auxiliaryRoutes)[number]>;
