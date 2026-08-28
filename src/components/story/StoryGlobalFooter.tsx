import { Container } from "@/components/ui";

import { STORY_FOOTER_GROUPS } from "./story-footer-data";
import styles from "./story.module.css";

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
          {STORY_FOOTER_GROUPS.map((group) => (
            <div className={styles.footerGroup} key={group.label}>
              <h3>{group.label}</h3>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      data-score-transition="native"
                      href={link.href}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      target={link.external ? "_blank" : undefined}
                    >
                      {link.label}
                      {link.external ? (
                        <span className="wf-sr-only"> — abre em nova aba</span>
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <p className={styles.copyright}>
          © 2026 W_Flyer. Todos os direitos reservados.
        </p>
      </Container>
    </footer>
  );
}
