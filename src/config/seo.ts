import type { Metadata } from "next";

import {
  PHASE3_ROUTE_SEO,
  PUBLIC_SERVICES,
  type PublicSeo,
  type ServiceRoute,
} from "@/content/public";

import { siteConfig } from "./site";

export type PageSeo = PublicSeo;

const servicePageSeo = Object.fromEntries(
  PUBLIC_SERVICES.map((service) => [service.route, service.seo]),
) as Readonly<Record<ServiceRoute, PageSeo>>;

export const pageSeo = {
  "/": {
    title: "W_Flyer — portfólio profissional",
    description:
      "Conheça o trabalho profissional da W_Flyer em sites, aplicações, integrações e soluções digitais sob medida.",
  },
  ...PHASE3_ROUTE_SEO,
  ...servicePageSeo,
  "/politica-de-privacidade": {
    title: "Política de privacidade — W_Flyer",
    description:
      "Saiba quais dados a W_Flyer recebe pelo contato, para que são usados e como solicitar informações sobre o tratamento.",
  },
  "/politica-de-cookies": {
    title: "Política de cookies — W_Flyer",
    description:
      "Entenda o uso da preferência local de tema e o processamento técnico necessário à segurança e à operação do site.",
  },
  "/termos-de-uso": {
    title: "Termos de uso — W_Flyer",
    description:
      "Consulte as condições gerais de uso do site W_Flyer e as regras aplicáveis a conteúdo e links externos.",
  },
  "/acessibilidade": {
    title: "Acessibilidade — W_Flyer",
    description:
      "Conheça os recursos e compromissos de acessibilidade do site W_Flyer e o canal para comunicar barreiras de uso.",
  },
} as const satisfies Readonly<Record<string, PageSeo>>;

export type PublicRoute = keyof typeof pageSeo;

export const publicRoutes = Object.freeze(
  Object.keys(pageSeo) as PublicRoute[],
);

export function absoluteUrl(
  route: PublicRoute | "/robots.txt" | "/sitemap.xml",
) {
  return new URL(route, siteConfig.url).toString();
}

export function createPageMetadata(route: PublicRoute): Metadata {
  const seo = pageSeo[route];

  return {
    title: {
      absolute: seo.title,
    },
    description: seo.description,
    alternates: {
      canonical: route,
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: siteConfig.name,
      title: seo.title,
      description: seo.description,
      url: route,
    },
    twitter: {
      card: "summary",
      title: seo.title,
      description: seo.description,
    },
  };
}
