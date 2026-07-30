import type { Metadata } from "next";

import type { AuxiliaryRoute, ChapterRoute } from "./chapters";
import { siteConfig } from "./site";

export type PublicRoute = ChapterRoute | AuxiliaryRoute;

export interface PageSeo {
  readonly description: string;
  readonly title: string;
}

export const pageSeo = {
  "/": {
    title: "W_Flyer — música e soluções digitais",
    description:
      "Conheça a aplicação musical W_Flyer em desenvolvimento e os serviços digitais de sites, aplicações, integrações e soluções sob medida.",
  },
  "/aplicacao-wflyer": {
    title: "Aplicação musical W_Flyer",
    description:
      "Conheça a aplicação W_Flyer, uma ferramenta musical em desenvolvimento para apoiar a adaptação e a revisão de partituras.",
  },
  "/aplicacao-wflyer/como-funciona": {
    title: "Como funciona a aplicação W_Flyer",
    description:
      "Veja o fluxo público e orientado da aplicação W_Flyer, da escolha da partitura à revisão e exportação do resultado.",
  },
  "/aplicacao-wflyer/beneficios": {
    title: "Benefícios da aplicação W_Flyer",
    description:
      "Descubra como a aplicação W_Flyer pretende reduzir etapas repetitivas sem retirar do músico a decisão e a revisão musical.",
  },
  "/sobre": {
    title: "Sobre a W_Flyer",
    description:
      "Conheça a W_Flyer, seu propósito e a forma como tecnologia, design e música orientam experiências digitais claras e úteis.",
  },
  "/servicos": {
    title: "Serviços digitais da W_Flyer",
    description:
      "Sites, aplicações web, integrações e soluções sob medida desenvolvidos com clareza, acessibilidade e base técnica sólida.",
  },
  "/processo": {
    title: "Processo de desenvolvimento da W_Flyer",
    description:
      "Entenda as etapas de descoberta, definição, implementação, validação e evolução adotadas nos projetos digitais da W_Flyer.",
  },
  "/portfolio": {
    title: "Portfólio W_Flyer",
    description:
      "Conheça projetos selecionados da W_Flyer, apresentados com escopo, status e informações verificáveis.",
  },
  "/contato": {
    title: "Contato W_Flyer",
    description:
      "Apresente o contexto e o objetivo do seu projeto digital e inicie uma conversa com a W_Flyer.",
  },
  "/servicos/criacao-de-sites": {
    title: "Criação de sites — W_Flyer",
    description:
      "Criação e modernização de sites institucionais, landing pages e portais com foco em clareza, performance e acessibilidade.",
  },
  "/servicos/criacao-de-aplicacoes": {
    title: "Criação de aplicações — W_Flyer",
    description:
      "Desenvolvimento de sistemas web, portais, dashboards e ferramentas adequadas a processos específicos.",
  },
  "/servicos/integracoes": {
    title: "Integrações — W_Flyer",
    description:
      "Integração de APIs, dados, eventos e ferramentas para reduzir retrabalho e melhorar a rastreabilidade dos fluxos.",
  },
  "/servicos/solucoes-sob-medida": {
    title: "Soluções sob medida — W_Flyer",
    description:
      "Diagnóstico e desenvolvimento de soluções digitais para necessidades que não são atendidas por produtos prontos.",
  },
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
      "Consulte as condições gerais de uso do site institucional W_Flyer e as regras aplicáveis a conteúdo e links externos.",
  },
  "/acessibilidade": {
    title: "Acessibilidade — W_Flyer",
    description:
      "Conheça os recursos e compromissos de acessibilidade do site W_Flyer e o canal para comunicar barreiras de uso.",
  },
} as const satisfies Record<PublicRoute, PageSeo>;

export const publicRoutes = Object.keys(pageSeo) as PublicRoute[];

export function absoluteUrl(route: PublicRoute | "/robots.txt" | "/sitemap.xml") {
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
