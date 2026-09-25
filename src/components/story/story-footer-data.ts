import { siteConfig } from "@/config/site";

export interface StoryFooterLink {
  readonly external?: boolean;
  readonly href: string;
  readonly label: string;
}

export interface StoryFooterGroup {
  readonly label: string;
  readonly links: readonly StoryFooterLink[];
}

/**
 * One shared source for the global story footer and Professional terminal.
 */
export const STORY_FOOTER_GROUPS: readonly StoryFooterGroup[] = Object.freeze([
  Object.freeze({
    label: "Trabalho profissional",
    links: Object.freeze([
      { href: "/sobre", label: "Sobre" },
      { href: "/servicos", label: "Serviços" },
      { href: "/contato", label: "Contato" },
    ]),
  }),
  Object.freeze({
    label: "Informações",
    links: Object.freeze([
      { href: "/politica-de-privacidade", label: "Privacidade" },
      { href: "/politica-de-cookies", label: "Cookies" },
      { href: "/termos-de-uso", label: "Termos de uso" },
      { href: "/acessibilidade", label: "Acessibilidade" },
    ]),
  }),
  Object.freeze({
    label: "Canais",
    links: Object.freeze([
      { href: `mailto:${siteConfig.email}`, label: "E-mail" },
      { external: true, href: siteConfig.social.github, label: "GitHub" },
      {
        external: true,
        href: siteConfig.social.instagram,
        label: "Instagram",
      },
    ]),
  }),
]);
