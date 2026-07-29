import { ArrowIcon, Container, Eyebrow, Heading, LinkButton, Text } from "@/components/ui";

import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.shell} id="main-content" tabIndex={-1}>
      <Container className={styles.content} size="content">
        <Eyebrow>W_Flyer</Eyebrow>
        <Heading as="h1" size="display">
          Uma experiência digital pensada em dois movimentos.
        </Heading>
        <Text size="lead" tone="muted">
          Conheça a aplicação musical em desenvolvimento ou acompanhe o trabalho
          institucional da W_Flyer.
        </Text>
        <nav aria-label="Escolha um caminho" className={styles.actions}>
          <LinkButton
            href="/aplicacao-wflyer"
            trailingIcon={<ArrowIcon direction="left" />}
          >
            Explorar a aplicação
          </LinkButton>
          <LinkButton
            href="/sobre"
            trailingIcon={<ArrowIcon />}
            variant="secondary"
          >
            Conhecer a empresa
          </LinkButton>
        </nav>
      </Container>
    </main>
  );
}
