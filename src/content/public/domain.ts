import type { StoryChapterId } from "@/lib/story";

import type {
  ContactProjectType,
  ProcessStep,
  ProjectRecord,
  PublicChapterContent,
  PublicSeo,
  PublicationStatus,
  ServiceRecord,
} from "./types";

export const PHASE3_EDITORIAL_STATUS =
  "Conteúdo da Fase 3 · intenção semântica implementada · revisão editorial humana pendente";

export const PROCESS_STEPS = [
  {
    number: "01",
    title: "Descoberta e contexto",
    description:
      "Compreendo a necessidade, o público, o processo atual e os limites do projeto.",
  },
  {
    number: "02",
    title: "Escopo e direção",
    description:
      "Organizo prioridades, responsabilidades e critérios de qualidade para orientar o trabalho.",
  },
  {
    number: "03",
    title: "Implementação incremental",
    description:
      "Desenvolvo em etapas verificáveis para que decisões e riscos apareçam cedo.",
  },
  {
    number: "04",
    title: "Validação e evolução",
    description:
      "Valido o escopo acordado e avalio os próximos passos conforme a necessidade.",
  },
] as const satisfies readonly ProcessStep[];

const SERVICE_RECORDS = [
  {
    slug: "criacao-de-sites",
    route: "/servicos/criacao-de-sites",
    publicationStatus: "public",
    eyebrow: "Serviços · Sites",
    title: "Sites claros, rápidos e acessíveis.",
    shortLandingSummary:
      "Sites institucionais, landing pages e experiências web com conteúdo compreensível e base técnica sólida.",
    description:
      "Desenvolvo novas presenças digitais e modernizo sites existentes com atenção à informação, à acessibilidade, à responsividade e ao desempenho.",
    seo: {
      title: "Criação de sites — W_Flyer",
      description:
        "Criação e modernização de sites, landing pages e portais com conteúdo claro, acessibilidade, responsividade e base técnica sólida.",
    },
    audience: [
      "Projetos que precisam apresentar serviços, produtos ou conteúdo com clareza.",
      "Sites existentes que precisam de uma base mais acessível, responsiva ou sustentável.",
    ],
    scope: [
      "Sites institucionais e landing pages.",
      "Portais de conteúdo e modernização de sites.",
      "Responsividade, acessibilidade e desempenho.",
      "SEO técnico e integrações previstas no escopo.",
    ],
    deliverables: [
      "Estrutura de informação e páginas definidas no escopo.",
      "Interface responsiva implementada e testada.",
      "Metadados, documentação e orientações de continuidade acordadas.",
    ],
    process: PROCESS_STEPS,
    criteria: [
      "Conteúdo principal semanticamente organizado.",
      "Navegação por teclado e responsividade verificadas.",
      "Integrações e comportamentos cobertos por testes proporcionais ao risco.",
    ],
    limits: [
      "Posicionamento em busca e resultados comerciais não são garantidos.",
      "Prazo, manutenção, conteúdo e integrações dependem do escopo acordado.",
    ],
    contactType: "site-institucional",
  },
  {
    slug: "criacao-de-aplicacoes",
    route: "/servicos/criacao-de-aplicacoes",
    publicationStatus: "public",
    eyebrow: "Serviços · Aplicações",
    title: "Aplicações web para processos específicos.",
    shortLandingSummary:
      "Sistemas, portais e ferramentas web desenhados em torno de uma necessidade real.",
    description:
      "Desenvolvo aplicações web quando um processo precisa de regras, estados e uma experiência própria, com escopo e responsabilidades explícitos.",
    seo: {
      title: "Criação de aplicações — W_Flyer",
      description:
        "Desenvolvimento de aplicações, portais, dashboards e ferramentas web adequadas a processos e necessidades específicas.",
    },
    audience: [
      "Operações que dependem de tarefas manuais difíceis de acompanhar.",
      "Produtos e processos que precisam de uma experiência web própria.",
    ],
    scope: [
      "Sistemas internos e ferramentas de gestão.",
      "Portais, dashboards e fluxos operacionais.",
      "Produtos web e integrações necessárias ao escopo.",
    ],
    deliverables: [
      "Fluxos e requisitos priorizados.",
      "Interface e regras do escopo implementadas.",
      "Testes, documentação e procedimento de continuidade acordados.",
    ],
    process: PROCESS_STEPS,
    criteria: [
      "Fluxos principais claros e estados de erro compreensíveis.",
      "Entradas validadas e decisões técnicas relevantes registradas.",
      "Segurança e acessibilidade avaliadas conforme o contexto.",
    ],
    limits: [
      "Escopo, prazo e suporte são definidos para cada projeto.",
      "Serviços externos, licenças e migração de dados exigem avaliação específica.",
    ],
    contactType: "aplicacao-web",
  },
  {
    slug: "integracoes",
    route: "/servicos/integracoes",
    publicationStatus: "public",
    eyebrow: "Serviços · Integrações",
    title: "Ferramentas e dados conectados com controle.",
    shortLandingSummary:
      "Conexões entre APIs, ferramentas e fluxos para reduzir trabalho manual e tornar dependências visíveis.",
    description:
      "Integro serviços e dados com validação, tratamento de falhas e responsabilidades claras em cada fronteira.",
    seo: {
      title: "Integrações — W_Flyer",
      description:
        "Integração de APIs, dados, eventos e ferramentas com validação, tratamento de falhas e responsabilidades explícitas.",
    },
    audience: [
      "Processos que repetem a mesma informação em ferramentas diferentes.",
      "Produtos que dependem de APIs, eventos ou sincronização de dados.",
    ],
    scope: [
      "APIs, webhooks e processamento de eventos.",
      "Sincronização de dados e automações de fluxo.",
      "Monitoramento e sinais operacionais da integração.",
    ],
    deliverables: [
      "Mapeamento de origens, destinos e responsabilidades.",
      "Integração dos cenários acordados.",
      "Tratamento de falhas e documentação de configuração.",
    ],
    process: PROCESS_STEPS,
    criteria: [
      "Credenciais usam apenas o acesso necessário.",
      "Falhas previsíveis possuem resposta e registro adequados.",
      "Dados são validados nas fronteiras entre sistemas.",
    ],
    limits: [
      "A disponibilidade final também depende dos serviços integrados.",
      "Volume, frequência, retenção e mudanças de terceiros exigem avaliação específica.",
    ],
    contactType: "integracao",
  },
  {
    slug: "solucoes-sob-medida",
    route: "/servicos/solucoes-sob-medida",
    publicationStatus: "public",
    eyebrow: "Serviços · Soluções sob medida",
    title: "Uma direção adequada quando o problema não cabe no pronto.",
    shortLandingSummary:
      "Diagnóstico e desenvolvimento incremental para necessidades que não são bem atendidas por uma solução pronta.",
    description:
      "Investigo a necessidade, delimito o problema e desenvolvo uma solução proporcional ao contexto quando um produto pronto não atende bem ao caso.",
    seo: {
      title: "Soluções sob medida — W_Flyer",
      description:
        "Diagnóstico e desenvolvimento incremental de soluções digitais para necessidades que não cabem em produtos prontos.",
    },
    audience: [
      "Processos específicos sem uma ferramenta adequada.",
      "Necessidades que ainda precisam ser transformadas em requisitos verificáveis.",
    ],
    scope: [
      "Diagnóstico do processo e dos limites.",
      "Definição de requisitos, prioridades e riscos.",
      "Prototipação, implementação, testes e documentação.",
    ],
    deliverables: [
      "Recorte inicial do problema e direção proposta.",
      "Incrementos implementados conforme o escopo.",
      "Critérios de validação e plano de continuidade aplicáveis.",
    ],
    process: PROCESS_STEPS,
    criteria: [
      "A solução responde ao problema delimitado.",
      "Decisões e riscos relevantes permanecem rastreáveis.",
      "Experiência, segurança e manutenção são avaliadas no contexto real.",
    ],
    limits: [
      "O diagnóstico pode indicar que uma solução pronta é mais adequada.",
      "Preço, prazo e fases dependem da complexidade descoberta; resultados de negócio não são garantidos.",
    ],
    contactType: "solucao-personalizada",
  },
] as const satisfies readonly ServiceRecord[];

const PROJECT_RECORDS = [
  {
    slug: "w-flyer",
    route: "/portfolio/w-flyer",
    title: "W_Flyer",
    type: "Produto próprio",
    shortLandingSummary:
      "Site profissional e aplicação musical apresentados sob uma mesma marca.",
    whatItIs:
      "Um projeto que reúne o portfólio profissional deste site e uma aplicação musical separada, ainda em desenvolvimento.",
    context:
      "O site organiza serviços, projetos e a proposta pública do produto musical sem misturar o ambiente da aplicação com o site institucional.",
    role:
      "Concepção, documentação, arquitetura, design e desenvolvimento do projeto público.",
    areas: ["Identidade", "Documentação", "Arquitetura", "Desenvolvimento"],
    status: "Em desenvolvimento",
    publicationStatus: "public",
    featured: true,
    publicMedia: [],
    publicUrl: "https://wflyer.com.br",
    seo: {
      title: "Projeto W_Flyer — Projetos",
      description:
        "Conheça o escopo público do W_Flyer, projeto próprio que reúne portfólio profissional e uma aplicação musical separada.",
    },
  },
  {
    slug: "msn-distribuidora",
    route: "/portfolio/msn-distribuidora",
    title: "MSN Distribuidora",
    type: "E-commerce",
    shortLandingSummary:
      "Projeto real de comércio eletrônico apresentado dentro do escopo público autorizado.",
    whatItIs:
      "Uma experiência de comércio eletrônico da MSN Distribuidora.",
    context:
      "O caso é apresentado de forma factual, sem métricas, depoimentos ou resultados comerciais não documentados.",
    role:
      "Atuação descrita somente pelos elementos autorizados para o portfólio público.",
    areas: ["E-commerce"],
    status: "Publicado",
    publicationStatus: "public",
    featured: true,
    publicMedia: [],
    publicUrl: "https://msndistribuidora.com.br",
    seo: {
      title: "MSN Distribuidora — Projetos",
      description:
        "Conheça o registro público autorizado do projeto de e-commerce MSN Distribuidora, sem métricas ou resultados inventados.",
    },
  },
  {
    slug: "msn-suprimentos",
    route: "/portfolio/msn-suprimentos",
    title: "MSN Suprimentos",
    type: "Site comercial e institucional",
    shortLandingSummary:
      "Site que organiza conteúdo, linhas de produtos e caminhos de atendimento.",
    whatItIs:
      "Uma presença digital comercial e institucional para a MSN Suprimentos.",
    context:
      "O caso público se limita à organização do conteúdo, à apresentação de produtos e ao direcionamento para atendimento ou compra.",
    role:
      "Atuação descrita somente pelos elementos autorizados para o portfólio público.",
    areas: [
      "Organização de conteúdo",
      "Apresentação de produtos",
      "Direcionamento de atendimento",
    ],
    status: "Publicado",
    publicationStatus: "public",
    featured: true,
    publicMedia: [],
    publicUrl: "https://msnsuprimentos.com.br",
    seo: {
      title: "MSN Suprimentos — Projetos",
      description:
        "Conheça o registro público autorizado do site MSN Suprimentos e seu escopo de conteúdo, produtos e atendimento.",
    },
  },
] as const satisfies readonly ProjectRecord[];

export function selectPublishedRecords<
  TRecord extends { readonly publicationStatus: PublicationStatus },
>(records: readonly TRecord[]): readonly TRecord[] {
  return records.filter(({ publicationStatus }) => publicationStatus === "public");
}

export const PUBLIC_SERVICES: readonly ServiceRecord[] = Object.freeze(
  selectPublishedRecords(SERVICE_RECORDS),
);

export const PUBLIC_PROJECTS: readonly ProjectRecord[] = Object.freeze(
  selectPublishedRecords(PROJECT_RECORDS),
);

export function getPublicServiceBySlug(slug: string): ServiceRecord | undefined {
  return PUBLIC_SERVICES.find((service) => service.slug === slug);
}

export function getPublicProjectBySlug(slug: string): ProjectRecord | undefined {
  return PUBLIC_PROJECTS.find((project) => project.slug === slug);
}

export function getFeaturedPublicProjects(
  records: readonly ProjectRecord[] = PUBLIC_PROJECTS,
): readonly ProjectRecord[] {
  return selectPublishedRecords(records).filter(({ featured }) => featured);
}

export const CONTACT_PROJECT_TYPES = [
  { label: "Site institucional", value: "site-institucional" },
  { label: "Landing page", value: "landing-page" },
  { label: "Aplicação web", value: "aplicacao-web" },
  { label: "Integração", value: "integracao" },
  { label: "Automação", value: "automacao" },
  { label: "Solução personalizada", value: "solucao-personalizada" },
  { label: "Outro", value: "outro" },
] as const satisfies readonly {
  readonly label: string;
  readonly value: ContactProjectType;
}[];

export const PHASE3_ROUTE_SEO = {
  "/aplicacao-wflyer": {
    title: "Aplicação musical W_Flyer",
    description:
      "Conheça a proposta pública da aplicação W_Flyer para apoiar adaptações musicais com escolhas visíveis e revisão humana.",
  },
  "/aplicacao-wflyer/como-funciona": {
    title: "Como funciona a aplicação W_Flyer",
    description:
      "Veja as cinco etapas públicas da aplicação W_Flyer, da seleção da partitura à revisão e continuidade do resultado.",
  },
  "/aplicacao-wflyer/beneficios": {
    title: "Benefícios da aplicação W_Flyer",
    description:
      "Conheça os quatro benefícios públicos da aplicação W_Flyer sem promessas quantitativas ou garantias musicais.",
  },
  "/sobre": {
    title: "Sobre o trabalho profissional — W_Flyer",
    description:
      "Conheça a perspectiva profissional por trás da W_Flyer e a relação entre software, produto, design e resolução de problemas.",
  },
  "/servicos": {
    title: "Serviços digitais — W_Flyer",
    description:
      "Sites, aplicações, integrações e soluções sob medida desenvolvidos com responsabilidade pessoal e critérios verificáveis.",
  },
  "/processo": {
    title: "Processo de trabalho — W_Flyer",
    description:
      "Conheça as etapas de descoberta, direção, implementação incremental, validação e evolução usadas no trabalho profissional.",
  },
  "/portfolio": {
    title: "Projetos selecionados — W_Flyer",
    description:
      "Conheça os projetos públicos autorizados W_Flyer, MSN Distribuidora e MSN Suprimentos, sem métricas ou resultados inventados.",
  },
  "/contato": {
    title: "Contato profissional — W_Flyer",
    description:
      "Compartilhe o contexto e o objetivo do seu projeto digital para iniciar uma conversa profissional.",
  },
} as const satisfies Readonly<Record<string, PublicSeo>>;

const serviceItems = PUBLIC_SERVICES.map((service) => ({
  title: service.title,
  description: service.shortLandingSummary,
  link: {
    href: service.route,
    label: `Conhecer ${service.eyebrow.replace("Serviços · ", "").toLocaleLowerCase("pt-BR")}`,
  },
}));

const projectItems = PUBLIC_PROJECTS.map((project) => ({
  title: project.title,
  meta: `${project.type} · ${project.status.toLocaleLowerCase("pt-BR")}`,
  description: project.shortLandingSummary,
  link: { href: project.route, label: `Conhecer o projeto ${project.title}` },
}));

export const PUBLIC_STORY_CONTENT: Readonly<
  Record<StoryChapterId, PublicChapterContent>
> = {
  home: {
    chapterId: "home",
    branch: "origin",
    publicationStatus: "public",
    eyebrow: "Uma origem, duas expressões",
    title: "W_Flyer",
    description:
      "A W_Flyer reúne meu trabalho profissional em tecnologia e a proposta pública de uma aplicação musical, em percursos independentes e complementares.",
    note:
      "Na leitura vertical, o percurso profissional aparece primeiro e a aplicação musical vem em seguida.",
  },
  "professional-about": {
    chapterId: "professional-about",
    branch: "professional",
    publicationStatus: "public",
    eyebrow: "Sobre",
    title: "Tecnologia, produto e design com responsabilidade pessoal.",
    description:
      "Combino desenvolvimento de software, organização de produto e cuidado visual para transformar necessidades reais em soluções digitais compreensíveis.",
    detailLink: { href: "/sobre", label: "Conhecer o trabalho profissional" },
    seo: PHASE3_ROUTE_SEO["/sobre"],
    structuralPlaceholder: {
      label: "Espaço estrutural da Persona W_Flyer",
      status: "Ativo final pendente de fornecimento e aprovação humana.",
    },
  },
  "professional-services": {
    chapterId: "professional-services",
    branch: "professional",
    publicationStatus: "public",
    eyebrow: "Serviços",
    title: "Soluções digitais para necessidades concretas.",
    description:
      "Quatro frentes organizam o que posso desenvolver, sempre com escopo, limites e critérios de qualidade explícitos.",
    detailLink: { href: "/servicos", label: "Ver todos os serviços" },
    seo: PHASE3_ROUTE_SEO["/servicos"],
    items: serviceItems,
  },
  "professional-process": {
    chapterId: "professional-process",
    branch: "professional",
    publicationStatus: "public",
    eyebrow: "Processo",
    title: "Da necessidade à evolução, em etapas visíveis.",
    description:
      "O processo preserva decisões verificáveis e espaço para validar o que está sendo construído.",
    detailLink: { href: "/processo", label: "Conhecer o processo" },
    seo: PHASE3_ROUTE_SEO["/processo"],
    items: PROCESS_STEPS,
  },
  "professional-projects": {
    chapterId: "professional-projects",
    branch: "professional",
    publicationStatus: "public",
    eyebrow: "Projetos",
    title: "Trabalhos selecionados com escopo verificável.",
    description:
      "A seleção apresenta somente projetos autorizados, sem métricas, resultados ou estudos de caso inventados.",
    detailLink: { href: "/portfolio", label: "Ver projetos selecionados" },
    seo: PHASE3_ROUTE_SEO["/portfolio"],
    items: projectItems,
  },
  "professional-contact": {
    chapterId: "professional-contact",
    branch: "professional",
    publicationStatus: "public",
    eyebrow: "Contato",
    title: "Vamos conversar sobre o seu projeto?",
    description:
      "Compartilhe o contexto, o objetivo e o tipo de solução. O formulário detalhado preserva validação e controles de segurança no servidor.",
    primaryAction: { href: "/contato", label: "Enviar mensagem" },
    seo: PHASE3_ROUTE_SEO["/contato"],
  },
  "professional-terminal": {
    chapterId: "professional-terminal",
    branch: "professional",
    publicationStatus: "public",
    eyebrow: "Conclusão profissional",
    title: "Fim do percurso profissional.",
    description:
      "Uma barra final encerra visualmente este ramo. Na leitura vertical, ela é uma transição para a aplicação, não um segundo rodapé.",
  },
  "application-overview": {
    chapterId: "application-overview",
    branch: "application",
    publicationStatus: "public",
    eyebrow: "Aplicação W_Flyer",
    title: "Adaptação musical com escolhas visíveis e revisão humana.",
    description:
      "A proposta é apoiar a adaptação de partituras entre instrumentos e contextos tonais. A conferência e a decisão musical permanecem com quem usa a aplicação.",
    detailLink: {
      href: "/aplicacao-wflyer",
      label: "Conhecer a proposta da aplicação",
    },
    seo: PHASE3_ROUTE_SEO["/aplicacao-wflyer"],
    items: [
      {
        title: "Contexto de origem",
        description:
          "A partitura parte de um instrumento e de um contexto tonal conhecidos.",
      },
      {
        title: "Contexto de destino",
        description:
          "A pessoa informa o instrumento e o contexto tonal para os quais deseja adaptar o material.",
      },
      {
        title: "Revisão humana",
        description:
          "O resultado é apresentado para conferência; a decisão musical não é automatizada nem garantida.",
      },
    ],
  },
  "application-how-it-works": {
    chapterId: "application-how-it-works",
    branch: "application",
    publicationStatus: "public",
    eyebrow: "Como funciona",
    title: "Um fluxo orientado da partitura ao resultado.",
    description:
      "Cada etapa torna as escolhas compreensíveis e preserva um momento explícito de revisão antes de continuar.",
    detailLink: {
      href: "/aplicacao-wflyer/como-funciona",
      label: "Ver como funciona em detalhes",
    },
    seo: PHASE3_ROUTE_SEO["/aplicacao-wflyer/como-funciona"],
    items: [
      {
        label: "01",
        title: "Insira ou selecione a partitura",
        description: "Escolha o material que será usado no fluxo.",
      },
      {
        label: "02",
        title: "Informe instrumento e tonalidade de origem",
        description: "Contextualize o material de partida.",
      },
      {
        label: "03",
        title: "Defina instrumento e tonalidade de destino",
        description: "Indique o contexto para o qual deseja adaptar.",
      },
      {
        label: "04",
        title: "Visualize e revise",
        description: "Confira o resultado e faça a avaliação musical necessária.",
      },
      {
        label: "05",
        title: "Exporte ou continue",
        description: "Siga com o resultado ou continue o trabalho na aplicação.",
      },
    ],
  },
  "application-benefits": {
    chapterId: "application-benefits",
    branch: "application",
    publicationStatus: "public",
    eyebrow: "Benefícios",
    title: "Mais clareza para revisar e continuar.",
    description:
      "Quatro grupos traduzem a proposta pública em valor sem promessas quantitativas ou garantias.",
    detailLink: {
      href: "/aplicacao-wflyer/beneficios",
      label: "Conhecer os benefícios",
    },
    seo: PHASE3_ROUTE_SEO["/aplicacao-wflyer/beneficios"],
    items: [
      {
        title: "Menos trabalho repetitivo",
        description: "Organize tarefas recorrentes em um fluxo orientado.",
      },
      {
        title: "Diferentes contextos",
        description:
          "Prepare materiais para outros instrumentos ou contextos tonais com escolhas explícitas.",
      },
      {
        title: "Revisão antes de prosseguir",
        description:
          "Mantenha a interpretação, a conferência e a decisão musical com você.",
      },
      {
        title: "Continuidade do fluxo",
        description:
          "Exporte o resultado nos formatos aprovados ou continue na aplicação.",
      },
    ],
  },
  "application-demo": {
    chapterId: "application-demo",
    branch: "application",
    publicationStatus: "public",
    eyebrow: "Demonstração",
    title: "Veja um percurso ilustrativo pela aplicação.",
    description:
      "A tela simulada permanece inerte. A reprodução ocorre somente quando esta etapa está ativa, e o único controle disponível é o de mídia.",
    detailLink: {
      href: "/aplicacao-wflyer#demonstracao",
      label: "Ver o contrato da demonstração",
    },
    structuralPlaceholder: {
      label: "Espaço estrutural APP-04",
      status:
        "WebM, MP4, poster e quadro final dependem de fornecimento e aprovação humana.",
    },
  },
  "application-access": {
    chapterId: "application-access",
    branch: "application",
    publicationStatus: "public",
    eyebrow: "Lançamento",
    title: "A aplicação está em desenvolvimento.",
    description:
      "Quer saber quando ela estiver disponível? Cadastre seu e-mail para receber apenas este aviso.",
  },
  "application-terminal": {
    chapterId: "application-terminal",
    branch: "application",
    publicationStatus: "public",
    eyebrow: "Conclusão da aplicação",
    title: "Fim da narrativa vertical.",
    description:
      "A barra final encerra o ramo da aplicação e a navegação institucional conclui a experiência sem duplicar um segundo rodapé.",
  },
};
