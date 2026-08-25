import { Container } from "@/components/ui";
import { siteConfig } from "@/config/site";

import styles from "./story.module.css";

const PROFESSIONAL_LINKS = [
  ["Sobre", "/sobre"],
  ["Serviços", "/servicos"],
  ["Projetos", "/portfolio"],
  ["Contato", "/contato"],
] as const;

const INFORMATION_LINKS = [
  ["Aplicação W_Flyer", "/aplicacao-wflyer"],
  ["Privacidade", "/politica-de-privacidade"],
  ["Cookies", "/politica-de-cookies"],
  ["Termos de uso", "/termos-de-uso"],
  ["Acessibilidade", "/acessibilidade"],
] as const;

const CHANNEL_LINKS = [
  ["E-mail", `mailto:${siteConfig.email}`],
  ["GitHub", siteConfig.social.github],
  ["Instagram", siteConfig.social.instagram],
] as const;

export function StoryGlobalFooter() {
  return (
    <footer
      aria-labelledby="story-global-footer-heading"
      className={styles.footer}
      data-story-document-node="global-footer"
      data-story-global-footer="phase-2"
      id="global-footer"
    >
      <Container className={styles.footerGrid} size="wide">
        <div className={styles.footerIntro}>
          <h2 id="story-global-footer-heading">W_Flyer</h2>
          <p>
            Portfólio profissional, serviços digitais e uma aplicação musical
            apresentados em uma narrativa acessível.
          </p>
        </div>
        <nav aria-label="Rodapé" className={styles.footerNavigation}>
          <div className={styles.footerGroup}>
            <h3>Trabalho profissional</h3>
            <ul>
              {PROFESSIONAL_LINKS.map(([label, href]) => (
                <li key={href}>
                  <a data-score-transition="native" href={href}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.footerGroup}>
            <h3>Informações</h3>
            <ul>
              {INFORMATION_LINKS.map(([label, href]) => (
                <li key={href}>
                  <a data-score-transition="native" href={href}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.footerGroup}>
            <h3>Canais</h3>
            <ul>
              {CHANNEL_LINKS.map(([label, href]) => (
                <li key={href}>
                  <a data-score-transition="native" href={href}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <p className={styles.copyright}>
          © 2026 W_Flyer. Todos os direitos reservados.
        </p>
      </Container>
    </footer>
  );
}
