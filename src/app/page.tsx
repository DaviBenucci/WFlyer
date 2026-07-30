import type { Metadata } from "next";

import {
  ArrowIcon,
  Card,
  Container,
  Eyebrow,
  Heading,
  LinkButton,
  Text,
} from "@/components/ui";
import { createPageMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { homeContent } from "@/content/site-content";

import styles from "./page.module.css";

export const metadata: Metadata = createPageMetadata("/");

export default function HomePage() {
  return (
    <main className={styles.shell} id="main-content" tabIndex={-1}>
      <Container className={styles.content}>
        <header className={styles.intro}>
          <Eyebrow>W_Flyer</Eyebrow>
          <Heading as="h1" size="display">
            Música e tecnologia organizadas em dois caminhos.
          </Heading>
          <Text size="lead" tone="muted">
            Escolha entre conhecer a aplicação musical em desenvolvimento ou
            explorar as soluções digitais da W_Flyer.
          </Text>
        </header>

        <div className={styles.branches}>
          <Card className={styles.branch}>
            <Eyebrow>{homeContent.application.eyebrow}</Eyebrow>
            <Heading as="h2" size="lg">
              {homeContent.application.title}
            </Heading>
            <Text tone="muted">{homeContent.application.description}</Text>
            <div className={styles.actions}>
              <LinkButton
                href={homeContent.application.route}
                trailingIcon={<ArrowIcon direction="left" />}
              >
                Explorar a aplicação
              </LinkButton>
              <LinkButton
                external
                href={siteConfig.applicationUrl}
                target="_blank"
                variant="secondary"
              >
                Acessar aplicação
              </LinkButton>
            </div>
          </Card>

          <Card className={styles.branch}>
            <Eyebrow>{homeContent.institutional.eyebrow}</Eyebrow>
            <Heading as="h2" size="lg">
              {homeContent.institutional.title}
            </Heading>
            <Text tone="muted">{homeContent.institutional.description}</Text>
            <div className={styles.actions}>
              <LinkButton
                href={homeContent.institutional.route}
                trailingIcon={<ArrowIcon />}
              >
                Conhecer a empresa
              </LinkButton>
              <LinkButton href="/servicos" variant="secondary">
                Conheça nossos serviços
              </LinkButton>
            </div>
          </Card>
        </div>
      </Container>
    </main>
  );
}
