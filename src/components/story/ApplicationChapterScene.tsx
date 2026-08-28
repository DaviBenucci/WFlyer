import type { ReactNode } from "react";

import {
  ApplicationDemoDevice,
  type ApplicationDemoMediaContract,
} from "@/components/pages";
import { Eyebrow, Heading, Text } from "@/components/ui";
import { PUBLIC_STORY_CONTENT } from "@/content/public";
import type { StoryChapterId } from "@/lib/story";

import styles from "./application-chapter-scene.module.css";
import { STORY_FOOTER_GROUPS } from "./story-footer-data";

export type Phase8ApplicationChapterId = Extract<
  StoryChapterId,
  | "application-overview"
  | "application-how-it-works"
  | "application-benefits"
  | "application-demo"
  | "application-access"
  | "application-terminal"
>;

const PHASE8_APPLICATION_CHAPTER_IDS = new Set<StoryChapterId>([
  "application-overview",
  "application-how-it-works",
  "application-benefits",
  "application-demo",
  "application-access",
  "application-terminal",
]);

export function isPhase8ApplicationChapterId(
  chapterId: StoryChapterId,
): chapterId is Phase8ApplicationChapterId {
  return PHASE8_APPLICATION_CHAPTER_IDS.has(chapterId);
}

interface SceneIntroductionProps {
  readonly children?: ReactNode;
  readonly chapterId: Phase8ApplicationChapterId;
  readonly headingId: string;
}

function SceneIntroduction({
  children,
  chapterId,
  headingId,
}: SceneIntroductionProps) {
  const content = PUBLIC_STORY_CONTENT[chapterId];

  return (
    <header className={styles.introduction}>
      <Eyebrow>{content.eyebrow}</Eyebrow>
      <Heading as="h2" id={headingId} size="xl">
        {content.title}
      </Heading>
      <Text className={styles.description} size="lead" tone="muted">
        {content.description}
      </Text>
      {children}
      {content.detailLink ? (
        <a
          className={styles.detailLink}
          data-score-transition="native"
          href={content.detailLink.href}
        >
          {content.detailLink.label}
        </a>
      ) : null}
    </header>
  );
}

function OverviewScene({ headingId }: { readonly headingId: string }) {
  const content = PUBLIC_STORY_CONTENT["application-overview"];

  return (
    <div
      className={`${styles.scene} ${styles.overviewScene}`}
      data-application-scene="overview"
      data-score-integration-status="phase-9-pending"
      data-story-scene-contract="phase-8"
    >
      <SceneIntroduction
        chapterId="application-overview"
        headingId={headingId}
      />
      <ol
        aria-label="Problema, proposta e revisão da aplicação"
        className={styles.overviewFlow}
        data-application-overview-concept-count={content.items?.length ?? 0}
      >
        {content.items?.map((item, index) => (
          <li data-application-overview-concept={index + 1} key={item.title}>
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function HowItWorksScene({ headingId }: { readonly headingId: string }) {
  const content = PUBLIC_STORY_CONTENT["application-how-it-works"];

  return (
    <div
      className={`${styles.scene} ${styles.howScene}`}
      data-application-scene="how-it-works"
      data-score-integration-status="phase-9-pending"
      data-story-scene-contract="phase-8"
    >
      <SceneIntroduction
        chapterId="application-how-it-works"
        headingId={headingId}
      />
      <ol
        aria-label="Cinco etapas de como a aplicação funciona"
        className={styles.howSteps}
        data-application-how-step-count={content.items?.length ?? 0}
      >
        {content.items?.map((item) => (
          <li data-application-how-step={item.label} key={item.title}>
            <span aria-hidden="true">{item.label}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function BenefitsScene({ headingId }: { readonly headingId: string }) {
  const content = PUBLIC_STORY_CONTENT["application-benefits"];

  return (
    <div
      className={`${styles.scene} ${styles.benefitsScene}`}
      data-application-scene="benefits"
      data-score-integration-status="phase-9-pending"
      data-story-scene-contract="phase-8"
    >
      <SceneIntroduction
        chapterId="application-benefits"
        headingId={headingId}
      />
      <ul
        aria-label="Quatro grupos de benefícios da aplicação"
        className={styles.benefitGroups}
        data-application-benefit-count={content.items?.length ?? 0}
      >
        {content.items?.map((item, index) => (
          <li data-application-benefit={index + 1} key={item.title}>
            <span aria-hidden="true" className={styles.benefitMotif} />
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DemoScene({
  active,
  headingId,
  media,
}: {
  readonly active?: boolean | undefined;
  readonly headingId: string;
  readonly media?: ApplicationDemoMediaContract | undefined;
}) {
  return (
    <div
      className={`${styles.scene} ${styles.demoScene}`}
      data-application-scene="demo"
      data-score-integration-status="phase-9-pending"
      data-story-scene-contract="phase-8"
    >
      <SceneIntroduction
        chapterId="application-demo"
        headingId={headingId}
      />
      <ApplicationDemoDevice isActive={active} media={media} />
    </div>
  );
}

function AccessScene({ headingId }: { readonly headingId: string }) {
  const content = PUBLIC_STORY_CONTENT["application-access"];
  const primaryAction = content.primaryAction;

  if (primaryAction === undefined) {
    throw new Error("The canonical Application Access action is missing.");
  }

  return (
    <div
      className={`${styles.scene} ${styles.accessScene}`}
      data-application-scene="access"
      data-persona-optional-appearance="forbidden"
      data-score-integration-status="phase-9-pending"
      data-story-scene-contract="phase-8"
    >
      <SceneIntroduction
        chapterId="application-access"
        headingId={headingId}
      />
      <a
        className={styles.primaryAccess}
        data-primary-app-access="true"
        href={primaryAction.href}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span>{primaryAction.label}</span>
        <span aria-hidden="true" className={styles.accessArrow}>
          ↗
        </span>
        <span className="wf-sr-only"> — abre em nova aba</span>
      </a>
    </div>
  );
}

function ApplicationTerminalScene({
  headingId,
}: {
  readonly headingId: string;
}) {
  const content = PUBLIC_STORY_CONTENT["application-terminal"];

  return (
    <div
      className={`${styles.scene} ${styles.terminalScene}`}
      data-application-scene="terminal"
      data-story-scene-contract="phase-8"
    >
      <div
        aria-hidden="true"
        className={styles.finalBarlineContract}
        data-final-barline-before="application-terminal"
        data-score-integration-status="phase-9-pending"
      >
        <span />
        <span />
      </div>
      <div
        aria-labelledby={headingId}
        className={styles.terminalContent}
        data-branch-terminal="application"
      >
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <Heading as="h2" id={headingId} size="xl">
          {content.title}
        </Heading>
        <Text className={styles.description} size="lead" tone="muted">
          {content.description}
        </Text>
        <nav
          aria-label="Conclusão do percurso da aplicação"
          className={styles.terminalNavigation}
          data-shared-footer-source="story-footer-groups"
        >
          {STORY_FOOTER_GROUPS.map((group) => (
            <div key={group.label}>
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
                        <span className="wf-sr-only">
                          {" "}— abre em nova aba
                        </span>
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}

export interface ApplicationChapterSceneProps {
  readonly chapterId: Phase8ApplicationChapterId;
  readonly demoActive?: boolean;
  readonly demoMedia?: ApplicationDemoMediaContract | undefined;
  readonly headingId: string;
}

export function ApplicationChapterScene({
  chapterId,
  demoActive,
  demoMedia,
  headingId,
}: ApplicationChapterSceneProps) {
  switch (chapterId) {
    case "application-overview":
      return <OverviewScene headingId={headingId} />;
    case "application-how-it-works":
      return <HowItWorksScene headingId={headingId} />;
    case "application-benefits":
      return <BenefitsScene headingId={headingId} />;
    case "application-demo":
      return (
        <DemoScene
          active={demoActive}
          headingId={headingId}
          media={demoMedia}
        />
      );
    case "application-access":
      return <AccessScene headingId={headingId} />;
    case "application-terminal":
      return <ApplicationTerminalScene headingId={headingId} />;
  }
}
