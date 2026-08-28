"use client";

import { Suspense, type ReactNode } from "react";

import { ContactForm, ContactFormFallback } from "@/components/pages/contact";
import { PersonaIntegrationSlot } from "@/components/persona";
import { ProjectCardFan } from "@/components/projects";
import { Eyebrow, Heading, Text } from "@/components/ui";
import { siteConfig } from "@/config/site";
import {
  getFeaturedPublicProjects,
  PROCESS_STEPS,
  PUBLIC_SERVICES,
  PUBLIC_STORY_CONTENT,
} from "@/content/public";
import type { StoryChapterId } from "@/lib/story";

import styles from "./professional-chapter-scene.module.css";
import { STORY_FOOTER_GROUPS } from "./story-footer-data";

export type ProfessionalChapterId = Extract<
  StoryChapterId,
  `professional-${string}`
>;

const PROFESSIONAL_CHAPTER_IDS = new Set<StoryChapterId>([
  "professional-about",
  "professional-services",
  "professional-process",
  "professional-projects",
  "professional-contact",
  "professional-terminal",
]);

export function isProfessionalChapterId(
  chapterId: StoryChapterId,
): chapterId is ProfessionalChapterId {
  return PROFESSIONAL_CHAPTER_IDS.has(chapterId);
}

interface SceneIntroductionProps {
  readonly children?: ReactNode;
  readonly chapterId: ProfessionalChapterId;
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

function AboutScene({ headingId }: { readonly headingId: string }) {
  return (
    <div
      className={`${styles.scene} ${styles.aboutScene}`}
      data-professional-scene="about"
      data-story-scene-contract="phase-7"
    >
      <SceneIntroduction
        chapterId="professional-about"
        headingId={headingId}
      />
      <PersonaIntegrationSlot />
    </div>
  );
}

function ServicesScene({ headingId }: { readonly headingId: string }) {
  return (
    <div
      className={styles.scene}
      data-professional-scene="services"
      data-story-scene-contract="phase-7"
    >
      <SceneIntroduction
        chapterId="professional-services"
        headingId={headingId}
      />
      <ul
        aria-label="Quatro frentes de serviço"
        className={styles.serviceModules}
        data-service-module-count={PUBLIC_SERVICES.length}
      >
        {PUBLIC_SERVICES.map((service, index) => (
          <li
            className={styles.serviceModule}
            data-service-module={service.slug}
            key={service.slug}
          >
            <article>
              <span aria-hidden="true" className={styles.moduleIndex}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{service.eyebrow.replace("Serviços · ", "")}</h3>
              <p>{service.shortLandingSummary}</p>
              <a data-score-transition="native" href={service.route}>
                Conhecer {service.eyebrow.replace("Serviços · ", "").toLocaleLowerCase("pt-BR")}
              </a>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProcessScene({ headingId }: { readonly headingId: string }) {
  return (
    <div
      className={styles.scene}
      data-professional-scene="process"
      data-story-scene-contract="phase-7"
    >
      <SceneIntroduction
        chapterId="professional-process"
        headingId={headingId}
      />
      <ol
        aria-label="Quatro etapas do processo"
        className={styles.processStages}
        data-process-stage-count={PROCESS_STEPS.length}
      >
        {PROCESS_STEPS.map((step) => (
          <li data-process-stage={step.number} key={step.number}>
            <span aria-hidden="true">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ProjectsScene({ headingId }: { readonly headingId: string }) {
  const projects = getFeaturedPublicProjects();

  return (
    <div
      className={`${styles.scene} ${styles.projectsScene}`}
      data-professional-scene="projects"
      data-story-scene-contract="phase-7"
    >
      <SceneIntroduction
        chapterId="professional-projects"
        headingId={headingId}
      />
      <ProjectCardFan projects={projects} />
    </div>
  );
}

function ContactScene({ headingId }: { readonly headingId: string }) {
  return (
    <div
      className={`${styles.scene} ${styles.contactScene}`}
      data-persona-optional-appearance="forbidden"
      data-professional-scene="contact"
      data-story-scene-contract="phase-7"
    >
      <div className={styles.contactIntroduction}>
        <SceneIntroduction
          chapterId="professional-contact"
          headingId={headingId}
        />
        <address className={styles.contactChannels}>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <a
            href={siteConfig.social.github}
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub<span className="wf-sr-only"> — abre em nova aba</span>
          </a>
          <a
            href={siteConfig.social.instagram}
            rel="noopener noreferrer"
            target="_blank"
          >
            Instagram<span className="wf-sr-only"> — abre em nova aba</span>
          </a>
        </address>
      </div>
      <Suspense fallback={<ContactFormFallback />}>
        <ContactForm
          compact
          deferVerificationUntilInteraction
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
        />
      </Suspense>
    </div>
  );
}

function ProfessionalTerminalScene({
  headingId,
}: {
  readonly headingId: string;
}) {
  const content = PUBLIC_STORY_CONTENT["professional-terminal"];

  return (
    <div
      className={`${styles.scene} ${styles.terminalScene}`}
      data-professional-scene="terminal"
      data-story-scene-contract="phase-7"
    >
      <div
        aria-hidden="true"
        className={styles.finalBarlineContract}
        data-final-barline-before="professional-terminal"
        data-score-integration-status="phase-9-pending"
      >
        <span />
        <span />
      </div>
      <div
        aria-labelledby={headingId}
        className={styles.terminalContent}
        data-branch-terminal="professional"
      >
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <Heading as="h2" id={headingId} size="xl">
          {content.title}
        </Heading>
        <Text className={styles.description} size="lead" tone="muted">
          {content.description}
        </Text>
        <nav
          aria-label="Conclusão do percurso profissional"
          className={styles.terminalNavigation}
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
                        <span className="wf-sr-only"> — abre em nova aba</span>
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

export interface ProfessionalChapterSceneProps {
  readonly chapterId: ProfessionalChapterId;
  readonly headingId: string;
}

export function ProfessionalChapterScene({
  chapterId,
  headingId,
}: ProfessionalChapterSceneProps) {
  switch (chapterId) {
    case "professional-about":
      return <AboutScene headingId={headingId} />;
    case "professional-services":
      return <ServicesScene headingId={headingId} />;
    case "professional-process":
      return <ProcessScene headingId={headingId} />;
    case "professional-projects":
      return <ProjectsScene headingId={headingId} />;
    case "professional-contact":
      return <ContactScene headingId={headingId} />;
    case "professional-terminal":
      return <ProfessionalTerminalScene headingId={headingId} />;
  }
}
