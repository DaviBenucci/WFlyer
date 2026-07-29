import type { ChapterId, ChapterRoute, HeaderItem } from "./chapters";
import { scoreChapterById } from "./chapters";
import { siteConfig } from "./site";

export interface InternalHeaderLink {
  readonly id: HeaderItem;
  readonly label: string;
  readonly href: ChapterRoute;
  readonly external?: false;
}

export interface ExternalHeaderLink {
  readonly id: "application-access";
  readonly label: "Acessar app";
  readonly href: typeof siteConfig.applicationUrl;
  readonly external: true;
}

export type HeaderLink = InternalHeaderLink | ExternalHeaderLink;

export const applicationHeaderLinks = [
  {
    id: "application",
    label: "Aplicação",
    href: scoreChapterById.application.route,
  },
  {
    id: "how-it-works",
    label: "Como funciona",
    href: scoreChapterById["application-how-it-works"].route,
  },
  {
    id: "benefits",
    label: "Benefícios",
    href: scoreChapterById["application-benefits"].route,
  },
  {
    id: "application-access",
    label: "Acessar app",
    href: siteConfig.applicationUrl,
    external: true,
  },
] as const satisfies readonly HeaderLink[];

export const institutionalHeaderLinks = [
  {
    id: "company",
    label: "Empresa",
    href: scoreChapterById.company.route,
  },
  {
    id: "services",
    label: "Serviços",
    href: scoreChapterById.services.route,
  },
  {
    id: "portfolio",
    label: "Portfólio",
    href: scoreChapterById.portfolio.route,
  },
  {
    id: "contact",
    label: "Contato",
    href: scoreChapterById.contact.route,
  },
] as const satisfies readonly HeaderLink[];

export const mobileHeaderLinks = [
  ...applicationHeaderLinks,
  ...institutionalHeaderLinks,
] as const;

export function getActiveHeaderItem(chapterId: ChapterId): HeaderItem {
  return scoreChapterById[chapterId].active_header_item;
}
