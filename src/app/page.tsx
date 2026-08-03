import type { Metadata } from "next";

import { BrandIntroController } from "@/components/brand-intro";
import { NarrativeClef, OriginScore } from "@/components/music";
import {
  ArrowIcon,
  Container,
  Eyebrow,
  Heading,
  LinkButton,
  Text,
} from "@/components/ui";
import { scoreChapterById } from "@/config/chapters";
import { createPageMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { homeContent } from "@/content/site-content";

import styles from "./page.module.css";

export const metadata: Metadata = createPageMetadata("/");

const homeChapter = scoreChapterById.home;

export default function HomePage() {
  return (
    <>
      <BrandIntroController
        testMode={process.env.WFLYER_TRANSITION_TEST_MODE === "1"}
      />
      <main
        className={styles.shell}
        data-branch={homeChapter.branch}
        data-chapter={homeChapter.id}
        data-coordinate={homeChapter.coordinate}
        data-entry-anchor-y={homeChapter.entry_anchor_y}
        data-entry-edge={homeChapter.entry_edge}
        data-exit-anchor-y={homeChapter.exit_anchor_y}
        data-exit-edge={homeChapter.exit_edge}
        data-terminal="false"
        id="main-content"
        tabIndex={-1}
      >
        <Container className={styles.content}>
        <section
          aria-labelledby="home-title"
          className={styles.hero}
          data-home-bifurcation=""
        >
          <h1 className="wf-sr-only" id="home-title">
            Música e tecnologia organizadas em duas experiências
            complementares
          </h1>

          <OriginScore
            className={styles.score}
            data-brand-intro-home-score=""
          />

          <div
            className={styles.origin}
            data-brand-intro-home-origin=""
            data-home-origin=""
          >
            <NarrativeClef
              className={styles.clef}
              data-brand-intro-home-clef=""
            />
            <p className={styles.originLabel}>Dois caminhos, uma origem</p>
          </div>

          <section
            aria-labelledby="application-branch-title"
            className={`${styles.branch} ${styles.applicationBranch}`}
            data-home-branch="application"
          >
            <Eyebrow
              className={styles.eyebrow}
              data-brand-intro-home-copy="application"
            >
              {homeContent.application.eyebrow}
            </Eyebrow>
            <p
              className={styles.mobileDirection}
              data-brand-intro-home-copy="application"
            >
              Ramo da aplicação · avance para a esquerda
            </p>
            <Heading
              as="h2"
              className={styles.branchTitle}
              data-brand-intro-home-copy="application"
              id="application-branch-title"
              size="lg"
            >
              {homeContent.application.title}
            </Heading>
            <Text
              className={styles.description}
              data-brand-intro-home-copy="application"
              tone="muted"
            >
              {homeContent.application.description}
            </Text>
            <div
              className={styles.actions}
              data-brand-intro-home-actions="application"
            >
              <LinkButton
                external
                href={siteConfig.applicationUrl}
                target="_blank"
              >
                Acessar aplicação
              </LinkButton>
              <LinkButton
                href={homeContent.application.route}
                leadingIcon={<ArrowIcon direction="left" />}
                variant="ghost"
              >
                Saiba mais
              </LinkButton>
            </div>
          </section>

          <section
            aria-labelledby="institutional-branch-title"
            className={`${styles.branch} ${styles.institutionalBranch}`}
            data-home-branch="institutional"
          >
            <Eyebrow
              className={styles.eyebrow}
              data-brand-intro-home-copy="institutional"
            >
              {homeContent.institutional.eyebrow}
            </Eyebrow>
            <p
              className={styles.mobileDirection}
              data-brand-intro-home-copy="institutional"
            >
              Ramo institucional · avance para a direita
            </p>
            <Heading
              as="h2"
              className={styles.branchTitle}
              data-brand-intro-home-copy="institutional"
              id="institutional-branch-title"
              size="lg"
            >
              {homeContent.institutional.title}
            </Heading>
            <Text
              className={styles.description}
              data-brand-intro-home-copy="institutional"
              tone="muted"
            >
              {homeContent.institutional.description}
            </Text>
            <div
              className={styles.actions}
              data-brand-intro-home-actions="institutional"
            >
              <LinkButton
                href="/servicos"
                trailingIcon={<ArrowIcon />}
              >
                Conheça nossos serviços
              </LinkButton>
              <LinkButton
                href={homeContent.institutional.route}
                variant="ghost"
              >
                Conhecer a empresa
              </LinkButton>
            </div>
          </section>

          <div
            className={styles.explorationCue}
            data-brand-intro-home-cue=""
          >
            <svg
              aria-hidden="true"
              className={styles.explorationIcon}
              fill="none"
              viewBox="0 0 24 34"
            >
              <rect height="30" rx="10" width="18" x="3" y="2" />
              <path d="M12 8v5" />
              <path d="m9 25 3 3 3-3" />
            </svg>
            <span>Escolha um caminho para explorar</span>
          </div>
        </section>
        </Container>
      </main>
    </>
  );
}
