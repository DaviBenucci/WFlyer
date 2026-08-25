import Link from "next/link";

import { OfficialBrandSymbol } from "@/components/brand";
import { StaffSegment } from "@/components/music";
import { Container } from "@/components/ui";
import { siteConfig } from "@/config/site";

import styles from "./site-footer.module.css";

const applicationLinks = [
  { href: "/aplicacao-wflyer", label: "Aplicação" },
  {
    href: "/aplicacao-wflyer/como-funciona",
    label: "Como funciona",
  },
  { href: "/aplicacao-wflyer/beneficios", label: "Benefícios" },
] as const;

const institutionalLinks = [
  { href: "/sobre", label: "Sobre" },
  { href: "/servicos", label: "Serviços" },
  { href: "/processo", label: "Processo" },
  { href: "/portfolio", label: "Projetos" },
  { href: "/contato", label: "Contato" },
] as const;

const legalLinks = [
  { href: "/politica-de-privacidade", label: "Privacidade" },
  { href: "/politica-de-cookies", label: "Cookies" },
  { href: "/termos-de-uso", label: "Termos de uso" },
  { href: "/acessibilidade", label: "Acessibilidade" },
] as const;

function FooterLinkList({
  links,
}: {
  readonly links: readonly {
    readonly href: string;
    readonly label: string;
  }[];
}) {
  return (
    <ul className={styles.linkList}>
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href}>{link.label}</a>
        </li>
      ))}
    </ul>
  );
}

function ExternalFooterLink({
  children,
  href,
}: {
  readonly children: string;
  readonly href: string;
}) {
  return (
    <a href={href} rel="noopener noreferrer" target="_blank">
      {children}
      <span className="wf-sr-only"> — abre em nova aba</span>
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <svg
        aria-hidden="true"
        className={styles.score}
        data-footer-score=""
        focusable="false"
        preserveAspectRatio="none"
        viewBox="0 0 1200 112"
      >
        <StaffSegment
          amplitude={12}
          baseY={28}
          endX={1200}
          lineGap={12}
        />
      </svg>

      <Container className={styles.inner}>
        <div className={styles.brand}>
          <Link
            aria-label="W_Flyer — página inicial"
            className={styles.brandLink}
            href="/"
          >
            <OfficialBrandSymbol decorative />
            <span>W_Flyer</span>
          </Link>
          <p className={styles.summary}>
            Tecnologia, design e música reunidos para construir experiências
            digitais claras, úteis e cuidadosamente executadas.
          </p>
        </div>

        <nav aria-label="Aplicação no rodapé" className={styles.column}>
          <h2>Aplicação</h2>
          <FooterLinkList links={applicationLinks} />
        </nav>

        <nav aria-label="Trabalho profissional no rodapé" className={styles.column}>
          <h2>Trabalho profissional</h2>
          <FooterLinkList links={institutionalLinks} />
        </nav>

        <nav aria-label="Políticas no rodapé" className={styles.column}>
          <h2>Informações</h2>
          <FooterLinkList links={legalLinks} />
        </nav>
      </Container>

      <Container className={styles.bottom}>
        <span>© W_Flyer. Portfólio profissional.</span>
        <span>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          {" · "}
          <ExternalFooterLink href={siteConfig.social.instagram}>
            Instagram
          </ExternalFooterLink>
          {" · "}
          <ExternalFooterLink href={siteConfig.social.github}>
            GitHub
          </ExternalFooterLink>
        </span>
      </Container>
    </footer>
  );
}
