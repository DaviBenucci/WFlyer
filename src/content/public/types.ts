import type { StoryBranch, StoryChapterId } from "@/lib/story";

export type PublicationStatus = "public" | "unpublished";

export interface PublicSeo {
  readonly description: string;
  readonly title: string;
}

export interface PublicContentLink {
  readonly external?: boolean;
  readonly href: string;
  readonly label: string;
}

export interface PublicContentItem {
  readonly description: string;
  readonly label?: string;
  readonly link?: PublicContentLink;
  readonly meta?: string;
  readonly title: string;
}

export interface PublicChapterContent {
  readonly branch: StoryBranch;
  readonly chapterId: StoryChapterId;
  readonly description: string;
  readonly detailLink?: PublicContentLink;
  readonly eyebrow: string;
  readonly items?: readonly PublicContentItem[];
  readonly note?: string;
  readonly primaryAction?: PublicContentLink;
  readonly publicationStatus: PublicationStatus;
  readonly secondaryAction?: PublicContentLink;
  readonly seo?: PublicSeo;
  readonly structuralPlaceholder?: {
    readonly label: string;
    readonly status: string;
  };
  readonly title: string;
}

export interface ProcessStep {
  readonly description: string;
  readonly number: "01" | "02" | "03" | "04";
  readonly title: string;
}

export type ContactProjectType =
  | "site-institucional"
  | "landing-page"
  | "aplicacao-web"
  | "integracao"
  | "automacao"
  | "solucao-personalizada"
  | "outro";

export type ServiceSlug =
  | "criacao-de-sites"
  | "criacao-de-aplicacoes"
  | "integracoes"
  | "solucoes-sob-medida";

export type ServiceRoute = `/servicos/${ServiceSlug}`;

export interface ServiceRecord {
  readonly audience: readonly string[];
  readonly contactType: ContactProjectType;
  readonly criteria: readonly string[];
  readonly deliverables: readonly string[];
  readonly description: string;
  readonly eyebrow: string;
  readonly limits: readonly string[];
  readonly process: readonly ProcessStep[];
  readonly publicationStatus: PublicationStatus;
  readonly route: ServiceRoute;
  readonly scope: readonly string[];
  readonly seo: PublicSeo;
  readonly shortLandingSummary: string;
  readonly slug: ServiceSlug;
  readonly title: string;
}

export type ProjectSlug =
  | "w-flyer"
  | "msn-distribuidora"
  | "msn-suprimentos";

export type ProjectRoute = `/portfolio/${ProjectSlug}`;

export interface ProjectRecord {
  readonly areas: readonly string[];
  readonly context: string;
  readonly featured: boolean;
  readonly publicMedia: readonly string[];
  readonly publicUrl?: string;
  readonly publicationStatus: PublicationStatus;
  readonly role: string;
  readonly route: ProjectRoute;
  readonly seo: PublicSeo;
  readonly shortLandingSummary: string;
  readonly slug: ProjectSlug;
  readonly status: "Em desenvolvimento" | "Publicado";
  readonly title: string;
  readonly type: string;
  readonly whatItIs: string;
}

export type Phase3StaticRoute =
  | "/aplicacao-wflyer"
  | "/aplicacao-wflyer/como-funciona"
  | "/aplicacao-wflyer/beneficios"
  | "/sobre"
  | "/servicos"
  | ServiceRoute
  | "/processo"
  | "/portfolio"
  | "/contato";

export type Phase3PublicRoute = Phase3StaticRoute | ProjectRoute;
