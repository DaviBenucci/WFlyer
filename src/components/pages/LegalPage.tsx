import { BreadcrumbStructuredData } from "@/components/seo";
import { Staff } from "@/components/music";
import { ArrowIcon, Container, Eyebrow, Heading, LinkButton, Text } from "@/components/ui";
import type { LegalDocument } from "@/content/site-content";

import {
  Breadcrumbs,
  staticPageStyles,
} from "./StaticPage";
import styles from "./static-page.module.css";

export function LegalPage({
  document,
}: {
  readonly document: LegalDocument;
}) {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { label: "Home", route: "/" },
          { label: document.title, route: document.route },
        ]}
      />
      <main
        className={styles.page}
        data-archetype="legal-editorial"
        data-branch="origin"
        data-route-kind="auxiliary"
        id="main-content"
        tabIndex={-1}
      >
        <Container>
          <header className={styles.hero}>
            <Breadcrumbs
              items={[
                { href: "/", label: "Home" },
                { label: document.title },
              ]}
            />
            <div className={styles.heroCopy}>
              <Eyebrow>{document.eyebrow}</Eyebrow>
              <Heading as="h1" size="display">
                {document.title}
              </Heading>
              <Text size="lead" tone="muted">
                {document.description}
              </Text>
              <p className={staticPageStyles.updatedAt}>
                Última atualização:{" "}
                <time dateTime={document.updatedAtIso}>
                  {document.updatedAt}
                </time>
              </p>
            </div>
            <Staff
              className={styles.score}
              data-score-variant="auxiliary"
              density="quiet"
              direction="right"
            />
          </header>

          <div className={staticPageStyles.legalLayout}>
            <nav
              aria-label={`Índice de ${document.title}`}
              className={staticPageStyles.legalToc}
            >
              <p>Nesta página</p>
              <ol>
                {document.sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.title}</a>
                  </li>
                ))}
              </ol>
            </nav>

            <article className={staticPageStyles.legalContent}>
              {document.sections.map((section) => (
                <section
                  aria-labelledby={`${section.id}-title`}
                  className={staticPageStyles.legalSection}
                  id={section.id}
                  key={section.id}
                  tabIndex={-1}
                >
                  <Heading as="h2" id={`${section.id}-title`} size="md">
                    {section.title}
                  </Heading>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.items ? (
                    <ul>
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
              <LinkButton
                href="/"
                leadingIcon={<ArrowIcon direction="left" />}
                variant="secondary"
              >
                Voltar ao site
              </LinkButton>
            </article>
          </div>
        </Container>
      </main>
    </>
  );
}
