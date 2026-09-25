import { Suspense, type ReactNode } from "react";

import { NarrativeClef, Staff } from "@/components/music";
import {
  ArrowIcon,
  Heading,
  LinkButton,
  Text,
} from "@/components/ui";
import { ContactForm, ContactFormFallback } from "@/components/pages/contact";
import {
  type ContentCard,
  type ContentStep,
  type ServiceSummary,
} from "@/content/site-content";

import { PageIcon, type PageIconName } from "./PageIcons";
import styles from "./archetypes.module.css";



export function StepSequence({
  branch,
  steps,
}: {
  readonly branch: "institutional";
  readonly steps: readonly ContentStep[];
}) {
  return (
    <div
      className={styles.stepSequence}
      data-step-sequence={branch}
    >
      <Staff
        className={styles.sequenceStaff}
        density="regular"
        direction="right"
      />
      <ol>
        {steps.map((step) => (
          <li key={step.number}>
            <div className={styles.stepMarker}>
              <PageIcon name={step.icon} />
              <span>{step.number}</span>
            </div>
            <Heading as="h3" size="sm">
              {step.title}
            </Heading>
            <Text size="small" tone="muted">
              {step.description}
            </Text>
          </li>
        ))}
      </ol>
    </div>
  );
}





export function CompanyMark() {
  return (
    <div className={styles.companyMark} data-company-mark="">
      <NarrativeClef />
      <p>
        <span>Tecnologia</span>
        <span>Design</span>
        <span>Música</span>
      </p>
    </div>
  );
}

export function EditorialPillars({
  items,
}: {
  readonly items: readonly ContentCard[];
}) {
  return (
    <ol
      aria-label="Missão, visão e valores"
      className={styles.pillarGrid}
      data-editorial-pillars=""
    >
      {items.map((item, index) => (
        <li key={item.title}>
          <span className={styles.pillarIndex}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <PageIcon name={item.icon} />
          <Heading as="h3" size="md">
            {item.title}
          </Heading>
          <Text tone="muted">{item.description}</Text>
        </li>
      ))}
    </ol>
  );
}

export function ServiceSolutionGrid({
  action,
  services,
}: {
  readonly action?: ReactNode;
  readonly services: readonly ServiceSummary[];
}) {
  return (
    <div className={styles.serviceComposition}>
      <ul
        aria-label="Categorias de serviços"
        className={styles.serviceGrid}
        data-service-grid=""
      >
        {services.map((service) => (
          <li key={service.route}>
            <article className={styles.serviceCard}>
              <PageIcon name={service.icon} />
              <Heading as="h3" size="sm">
                {service.title}
              </Heading>
              <Text size="small" tone="muted">
                {service.description}
              </Text>
              <a className={styles.serviceLink} href={service.route}>
                {service.cta}
                <span aria-hidden="true" className={styles.cardArrow}>
                  <ArrowIcon />
                </span>
              </a>
            </article>
          </li>
        ))}
      </ul>
      {action ? (
        <div className={styles.serviceAction}>{action}</div>
      ) : null}
    </div>
  );
}

export function ServiceDetailMark({
  icon,
  label,
}: {
  readonly icon: PageIconName;
  readonly label: string;
}) {
  return (
    <div className={styles.serviceDetailMark} data-service-detail-mark="">
      <Staff density="quiet" direction="right" />
      <div>
        <PageIcon name={icon} />
        <span>{label}</span>
      </div>
    </div>
  );
}

export function AudienceList({
  items,
}: {
  readonly items: readonly string[];
}) {
  return (
    <ol
      aria-label="Contextos em que o serviço pode ser adequado"
      className={styles.audienceList}
      data-audience-list=""
    >
      {items.map((item, index) => (
        <li key={item}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <p>{item}</p>
        </li>
      ))}
    </ol>
  );
}

export function ContactWorkspace({
  email,
  githubUrl,
  instagramUrl,
}: {
  readonly email: string;
  readonly githubUrl: string;
  readonly instagramUrl: string;
}) {
  return (
    <section
      aria-labelledby="contact-workspace-title"
      className={styles.contactWorkspace}
      data-contact-workspace=""
    >
      <div className={styles.contactChannels}>
        <span className={styles.sectionKicker}>Canais oficiais</span>
        <Heading as="h2" id="contact-workspace-title" size="lg">
          Comece pelo contexto.
        </Heading>
        <Text size="lead" tone="muted">
          Conte o que precisa resolver e qual é o momento do projeto. A
          conversa inicial serve para compreender o recorte antes de propor
          qualquer caminho.
        </Text>
        <LinkButton
          href={`mailto:${email}`}
          trailingIcon={<ArrowIcon />}
        >
          Enviar e-mail
        </LinkButton>
        <dl className={styles.channelList}>
          <div>
            <dt>E-mail</dt>
            <dd>
              <a href={`mailto:${email}`}>{email}</a>
            </dd>
          </div>
          <div>
            <dt>Instagram</dt>
            <dd>
              <a
                href={instagramUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                @davibenucci
                <span className="wf-sr-only"> — abre em nova aba</span>
              </a>
            </dd>
          </div>
          <div>
            <dt>GitHub</dt>
            <dd>
              <a
                href={githubUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                DaviBenucci
                <span className="wf-sr-only"> — abre em nova aba</span>
              </a>
            </dd>
          </div>
        </dl>
      </div>

      <Suspense fallback={<ContactFormFallback />}>
        <ContactForm siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""} />
      </Suspense>
    </section>
  );
}
