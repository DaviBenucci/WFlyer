import type { ChapterId, ChapterRoute, HeaderItem } from "./chapters";
import { scoreChapterById } from "./chapters";

export interface InternalHeaderLink {
  readonly id: HeaderItem;
  readonly label: string;
  readonly href: ChapterRoute;
  readonly external?: false;
}

export type HeaderLink = InternalHeaderLink;

export const institutionalHeaderLinks = [
  {
    id: "company",
    label: "Sobre",
    href: scoreChapterById.company.route,
  },
  {
    id: "services",
    label: "Serviços",
    href: scoreChapterById.services.route,
  },
  {
    id: "contact",
    label: "Contato",
    href: scoreChapterById.contact.route,
  },
] as const satisfies readonly HeaderLink[];

export const mobileHeaderLinks = [
  ...institutionalHeaderLinks,
] as const;

export function getActiveHeaderItem(chapterId: ChapterId): HeaderItem {
  return scoreChapterById[chapterId].active_header_item;
}
