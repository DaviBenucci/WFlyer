import type { AuxiliaryRoute, ChapterId, ChapterRoute } from "@/config/chapters";

export interface ContentCard {
  readonly description: string;
  readonly title: string;
}

export interface ContentStep extends ContentCard {
  readonly number: string;
}

export const chapterLabels = {
  home: "Home",
  application: "Aplicação",
  "application-how-it-works": "Como funciona",
  "application-benefits": "Benefícios",
  company: "Empresa",
  services: "Serviços",
  process: "Processo",
  portfolio: "Portfólio",
  contact: "Contato",
} as const satisfies Record<ChapterId, string>;

export const homeContent = {
  application: {
    eyebrow: "Aplicação musical",
    title: "A aplicação musical que transforma partituras em experiência.",
    description:
      "A W_Flyer está sendo criada para ajudar músicos a estudar, adaptar materiais e se conectar com a música de uma forma mais prática.",
    route: "/aplicacao-wflyer",
  },
  institutional: {
    eyebrow: "Soluções digitais",
    title: "Soluções digitais sob medida para impulsionar o seu negócio.",
    description:
      "Criamos sites, aplicações, integrações e soluções personalizadas com tecnologia, design e estratégia.",
    route: "/sobre",
  },
} as const satisfies Record<
  "application" | "institutional",
  {
    readonly description: string;
    readonly eyebrow: string;
    readonly route: ChapterRoute;
    readonly title: string;
  }
>;

export const applicationContent = {
  eyebrow: "Aplicação W_Flyer",
  title: "Sua música, em qualquer tom.",
  description:
    "Transponha partituras de forma inteligente e prática. Do estudo à performance, leve sua música para o contexto instrumental de que precisa. A aplicação é uma ferramenta de apoio: a revisão humana e a decisão musical permanecem com você.",
  status:
    "Produto em desenvolvimento. A apresentação deste site descreve a proposta pública da aplicação e não substitui a avaliação musical do usuário.",
  highlights: [
    {
      title: "Leitura inteligente",
      description:
        "Um fluxo organizado para compreender a partitura e preparar a adaptação.",
    },
    {
      title: "Transposição orientada",
      description:
        "Escolhas de instrumento e tonalidade apresentadas de forma clara e revisável.",
    },
    {
      title: "Essência musical preservada",
      description:
        "O resultado permanece sujeito à conferência e à interpretação de quem toca.",
    },
    {
      title: "Exportação versátil",
      description:
        "Continuidade do trabalho nos formatos que forem aprovados pelo produto.",
    },
    {
      title: "Acesso de qualquer lugar",
      description:
        "Uma experiência web pensada para acompanhar estudo e preparação musical.",
    },
  ],
} as const;

export const howItWorksContent = {
  eyebrow: "Aplicação · Como funciona",
  title: "Da partitura ao resultado, em um fluxo orientado.",
  description:
    "Cada etapa torna as escolhas visíveis e mantém um momento explícito de revisão antes de continuar.",
  steps: [
    {
      number: "01",
      title: "Escolha a partitura",
      description:
        "Insira ou selecione o material que será usado no fluxo da aplicação.",
    },
    {
      number: "02",
      title: "Informe o contexto de origem",
      description:
        "Indique o instrumento e a tonalidade de origem para contextualizar o material.",
    },
    {
      number: "03",
      title: "Defina o contexto de destino",
      description:
        "Escolha o instrumento e a tonalidade para os quais deseja adaptar a partitura.",
    },
    {
      number: "04",
      title: "Visualize e revise",
      description:
        "Confira o resultado apresentado e faça a avaliação musical necessária.",
    },
    {
      number: "05",
      title: "Exporte ou continue",
      description:
        "Siga com o resultado nos formatos aprovados ou continue trabalhando no aplicativo.",
    },
  ],
} as const satisfies {
  readonly description: string;
  readonly eyebrow: string;
  readonly steps: readonly ContentStep[];
  readonly title: string;
};

export const benefitsContent = {
  eyebrow: "Aplicação · Benefícios",
  title: "Mais tempo para interpretar, estudar e tocar.",
  description:
    "A proposta da W_Flyer é reduzir etapas repetitivas e tornar adaptações mais compreensíveis, sem retirar do músico a responsabilidade pela revisão.",
  benefits: [
    {
      title: "Menos etapas repetitivas",
      description:
        "Organize tarefas recorrentes em um fluxo único e orientado.",
    },
    {
      title: "Adaptação entre instrumentos",
      description:
        "Prepare materiais para diferentes contextos instrumentais com escolhas explícitas.",
    },
    {
      title: "Mudanças mais claras",
      description:
        "Visualize o contexto de origem, o destino e o resultado antes de seguir.",
    },
    {
      title: "Revisão humana",
      description:
        "Mantenha a interpretação, a conferência e a decisão musical com você.",
    },
    {
      title: "Acesso flexível",
      description:
        "Use a experiência web em diferentes dispositivos, conforme a disponibilidade do produto.",
    },
    {
      title: "Continuidade do trabalho",
      description:
        "Exporte o resultado nos formatos que forem aprovados para a aplicação.",
    },
  ],
} as const satisfies {
  readonly benefits: readonly ContentCard[];
  readonly description: string;
  readonly eyebrow: string;
  readonly title: string;
};

export const aboutContent = {
  eyebrow: "Empresa",
  title: "Sobre a W_Flyer",
  description:
    "A W_Flyer une tecnologia, design e música para construir experiências digitais claras, úteis e cuidadosamente executadas.",
  pillars: [
    {
      title: "Missão",
      description:
        "Transformar necessidades reais em experiências digitais que aproximem pessoas, processos e ideias.",
    },
    {
      title: "Visão",
      description:
        "Desenvolver produtos e serviços digitais com identidade, precisão e capacidade de evolução.",
    },
    {
      title: "Valores",
      description:
        "Clareza, responsabilidade, simplicidade, aprendizado contínuo e respeito por quem utiliza cada solução.",
    },
  ],
} as const satisfies {
  readonly description: string;
  readonly eyebrow: string;
  readonly pillars: readonly ContentCard[];
  readonly title: string;
};

export type ServiceRoute = Extract<AuxiliaryRoute, `/servicos/${string}`>;

export interface ServiceSummary extends ContentCard {
  readonly cta: string;
  readonly route: ServiceRoute;
}

export const servicesContent = {
  eyebrow: "Serviços",
  title: "Nossas soluções",
  description:
    "Tecnologia e criatividade para transformar ideias em experiências digitais.",
  services: [
    {
      title: "Criação de sites",
      description:
        "Sites institucionais, landing pages e experiências interativas com estrutura técnica sólida.",
      route: "/servicos/criacao-de-sites",
      cta: "Conhecer criação de sites",
    },
    {
      title: "Criação de aplicações",
      description:
        "Sistemas web e plataformas desenhados para processos específicos.",
      route: "/servicos/criacao-de-aplicacoes",
      cta: "Conhecer criação de aplicações",
    },
    {
      title: "Integrações",
      description:
        "Conexão entre APIs, ferramentas e fluxos para reduzir trabalho manual.",
      route: "/servicos/integracoes",
      cta: "Conhecer integrações",
    },
    {
      title: "Soluções sob medida",
      description:
        "Diagnóstico e desenvolvimento quando a necessidade não cabe em uma solução pronta.",
      route: "/servicos/solucoes-sob-medida",
      cta: "Conhecer soluções sob medida",
    },
  ],
} as const satisfies {
  readonly description: string;
  readonly eyebrow: string;
  readonly services: readonly ServiceSummary[];
  readonly title: string;
};

export const processContent = {
  eyebrow: "Processo",
  title: "Da necessidade à solução, com etapas claras.",
  description:
    "Cada projeto é conduzido de forma incremental, com decisões visíveis e espaço para validar o que está sendo construído.",
  steps: [
    {
      number: "01",
      title: "Descoberta e contexto",
      description:
        "Entendemos a necessidade, o público, o processo atual e os limites do projeto.",
    },
    {
      number: "02",
      title: "Escopo e direção",
      description:
        "Organizamos prioridades, critérios de qualidade, responsabilidades e uma direção para a solução.",
    },
    {
      number: "03",
      title: "Implementação incremental",
      description:
        "Construímos em etapas verificáveis para que decisões e riscos apareçam cedo.",
    },
    {
      number: "04",
      title: "Validação e evolução",
      description:
        "Testamos, entregamos o escopo acordado e avaliamos os próximos passos conforme a necessidade.",
    },
  ],
} as const satisfies {
  readonly description: string;
  readonly eyebrow: string;
  readonly steps: readonly ContentStep[];
  readonly title: string;
};

export interface PortfolioProject {
  readonly description: string;
  readonly name: string;
  readonly scope: readonly string[];
  readonly status: "Em desenvolvimento" | "Publicado";
  readonly type: string;
  readonly url: string;
}

export const portfolioContent = {
  eyebrow: "Portfólio",
  title: "Projetos selecionados",
  description:
    "Uma seleção inicial apresentada com escopo e status verificáveis, sem métricas ou resultados não documentados.",
  projects: [
    {
      name: "W_Flyer",
      type: "Produto próprio",
      description:
        "Site institucional e experiência narrativa que organiza os dois ramos públicos da W_Flyer em uma dupla partitura.",
      scope: [
        "Identidade",
        "Documentação",
        "Arquitetura",
        "Desenvolvimento",
      ],
      status: "Em desenvolvimento",
      url: "https://wflyer.com.br",
    },
    {
      name: "MSN Distribuidora",
      type: "E-commerce",
      description:
        "Projeto real de comércio eletrônico da MSN Distribuidora, apresentado sem atribuir métricas ou resultados comerciais.",
      scope: ["E-commerce"],
      status: "Publicado",
      url: "https://msndistribuidora.com.br",
    },
    {
      name: "MSN Suprimentos",
      type: "Site comercial e institucional",
      description:
        "Site que organiza conteúdo, apresenta linhas de produtos e direciona o visitante para atendimento ou compra.",
      scope: [
        "Organização de conteúdo",
        "Apresentação de produtos",
        "Direcionamento de atendimento",
      ],
      status: "Publicado",
      url: "https://msnsuprimentos.com.br",
    },
  ],
} as const satisfies {
  readonly description: string;
  readonly eyebrow: string;
  readonly projects: readonly PortfolioProject[];
  readonly title: string;
};

export const contactContent = {
  eyebrow: "Contato",
  title: "Entre em contato",
  description:
    "Conte o contexto, o objetivo e o tipo de solução. A mensagem será usada somente para responder ao seu contato e avaliar o projeto apresentado.",
  emailCta: "Enviar e-mail",
} as const;

export interface ServiceDetail {
  readonly audience: readonly string[];
  readonly contactType: string;
  readonly criteria: readonly string[];
  readonly deliverables: readonly string[];
  readonly description: string;
  readonly eyebrow: string;
  readonly limits: readonly string[];
  readonly process: readonly ContentStep[];
  readonly route: ServiceRoute;
  readonly scope: readonly string[];
  readonly title: string;
}

const sharedServiceProcess = [
  {
    number: "01",
    title: "Entendimento",
    description:
      "Levantamento do contexto, dos objetivos, das pessoas envolvidas e dos limites do projeto.",
  },
  {
    number: "02",
    title: "Definição",
    description:
      "Organização de escopo, prioridades, entregáveis e critérios de validação.",
  },
  {
    number: "03",
    title: "Construção",
    description:
      "Implementação incremental com verificações técnicas e de experiência.",
  },
  {
    number: "04",
    title: "Entrega e evolução",
    description:
      "Validação do escopo acordado, documentação aplicável e definição dos próximos passos.",
  },
] as const satisfies readonly ContentStep[];

export const serviceDetails = {
  "/servicos/criacao-de-sites": {
    route: "/servicos/criacao-de-sites",
    eyebrow: "Serviços · Criação de sites",
    title: "Presença digital clara, rápida e acessível.",
    description:
      "Criar presença digital clara, rápida, acessível e coerente com a identidade do negócio. O escopo pode abranger uma nova experiência ou a modernização de um site existente.",
    audience: [
      "Negócios que precisam apresentar serviços, produtos ou informações institucionais.",
      "Equipes que desejam modernizar um site existente.",
      "Projetos que precisam de uma landing page ou portal de conteúdo.",
    ],
    scope: [
      "Sites institucionais e landing pages.",
      "Portais de conteúdo e modernização de sites.",
      "Responsividade, acessibilidade e performance.",
      "SEO técnico e integrações com serviços externos.",
    ],
    deliverables: [
      "Estrutura de informação e páginas definidas no escopo.",
      "Interface responsiva implementada e testada.",
      "Configuração técnica de metadados e indexação acordada.",
      "Documentação necessária para operação e continuidade.",
    ],
    process: sharedServiceProcess,
    criteria: [
      "Conteúdo principal compreensível e semanticamente organizado.",
      "Navegação por teclado e contraste aplicável.",
      "Desempenho e responsividade verificados nos cenários acordados.",
      "Comportamentos e integrações cobertos por testes proporcionais ao risco.",
    ],
    limits: [
      "Posicionamento em mecanismos de busca e crescimento comercial não são garantidos.",
      "Prazo, manutenção e integrações dependem do escopo formalmente acordado.",
      "Conteúdo, acessos e autorizações de terceiros são responsabilidades compartilhadas conforme o projeto.",
    ],
    contactType: "site-institucional",
  },
  "/servicos/criacao-de-aplicacoes": {
    route: "/servicos/criacao-de-aplicacoes",
    eyebrow: "Serviços · Criação de aplicações",
    title: "Sistemas web desenhados para processos específicos.",
    description:
      "Desenvolver sistemas web e ferramentas específicas para processos que não são bem atendidos por soluções prontas.",
    audience: [
      "Operações que dependem de planilhas ou tarefas manuais difíceis de acompanhar.",
      "Equipes que precisam de portais, dashboards ou sistemas internos.",
      "Produtos digitais que exigem uma experiência web própria.",
    ],
    scope: [
      "Sistemas internos e ferramentas de gestão.",
      "Portais de clientes e dashboards.",
      "Fluxos operacionais e produtos web específicos.",
      "Integrações necessárias ao escopo da aplicação.",
    ],
    deliverables: [
      "Mapa do fluxo e requisitos priorizados.",
      "Interface e regras do escopo implementadas.",
      "Testes e documentação proporcionais ao risco.",
      "Procedimento de entrega e continuidade acordado.",
    ],
    process: sharedServiceProcess,
    criteria: [
      "Fluxos principais claros para as pessoas usuárias.",
      "Validação de entradas e estados de erro compreensíveis.",
      "Segurança, acessibilidade e observabilidade avaliadas conforme o contexto.",
      "Decisões técnicas registradas quando afetam evolução e operação.",
    ],
    limits: [
      "Escopo, prazo e suporte são definidos para cada projeto.",
      "Licenças, serviços externos e migração de dados precisam de avaliação específica.",
      "Novas funcionalidades após o escopo acordado são tratadas como evolução.",
    ],
    contactType: "aplicacao-web",
  },
  "/servicos/integracoes": {
    route: "/servicos/integracoes",
    eyebrow: "Serviços · Integrações",
    title: "Ferramentas e dados conectados com controle.",
    description:
      "Conectar ferramentas e dados de forma controlada para reduzir retrabalho e melhorar a rastreabilidade.",
    audience: [
      "Equipes que repetem a mesma informação em ferramentas diferentes.",
      "Operações que precisam reagir a eventos ou sincronizar dados.",
      "Produtos que dependem de APIs e serviços externos.",
    ],
    scope: [
      "APIs, webhooks e processamento de eventos.",
      "Sincronização de dados entre ferramentas.",
      "Automações de fluxo.",
      "Monitoramento e observabilidade da integração.",
    ],
    deliverables: [
      "Mapeamento de origens, destinos e responsabilidades.",
      "Integração implementada para os cenários acordados.",
      "Tratamento de falhas e sinais operacionais definidos.",
      "Documentação de configuração e dependências externas.",
    ],
    process: sharedServiceProcess,
    criteria: [
      "Credenciais e permissões tratadas com o menor acesso necessário.",
      "Falhas previsíveis possuem comportamento e registro adequados.",
      "Dados são validados nos limites de cada sistema.",
      "Dependências e responsabilidades de terceiros ficam explícitas.",
    ],
    limits: [
      "A disponibilidade final também depende dos serviços integrados.",
      "Volume, frequência e retenção de dados exigem definição específica.",
      "Mudanças em APIs de terceiros podem exigir manutenção adicional.",
    ],
    contactType: "integracao",
  },
  "/servicos/solucoes-sob-medida": {
    route: "/servicos/solucoes-sob-medida",
    eyebrow: "Serviços · Soluções sob medida",
    title: "Uma solução adequada quando o problema não cabe no pronto.",
    description:
      "Investigar a necessidade e construir uma solução adequada quando o problema não cabe em um produto pronto.",
    audience: [
      "Negócios com processos específicos sem ferramenta adequada.",
      "Equipes que ainda precisam transformar uma necessidade em requisitos.",
      "Projetos que combinam interface, automação e integração.",
    ],
    scope: [
      "Diagnóstico do processo atual e dos gargalos.",
      "Definição de requisitos, limites e prioridades.",
      "Prototipação e implementação incremental.",
      "Testes, entrega e acompanhamento da evolução acordada.",
    ],
    deliverables: [
      "Diagnóstico e recorte inicial do problema.",
      "Proposta de solução e critérios de validação.",
      "Incrementos implementados conforme o escopo.",
      "Documentação e plano de continuidade aplicáveis.",
    ],
    process: [
      {
        number: "01",
        title: "Investigar",
        description:
          "Entender o processo atual, as pessoas envolvidas e os gargalos observados.",
      },
      {
        number: "02",
        title: "Delimitar",
        description:
          "Definir requisitos, limites, riscos, responsabilidades e prioridade.",
      },
      {
        number: "03",
        title: "Prototipar e construir",
        description:
          "Validar a direção e implementar a solução em partes verificáveis.",
      },
      {
        number: "04",
        title: "Testar e evoluir",
        description:
          "Conferir o resultado, entregar o escopo e acompanhar os próximos passos acordados.",
      },
    ],
    criteria: [
      "A solução responde ao problema delimitado, não a uma promessa genérica.",
      "Decisões e riscos relevantes permanecem rastreáveis.",
      "A experiência, a segurança e a manutenção são avaliadas no contexto real.",
      "A evolução respeita prioridades e capacidade operacional.",
    ],
    limits: [
      "O diagnóstico pode indicar que uma solução pronta é mais adequada.",
      "Preço, prazo e fases dependem da complexidade descoberta.",
      "Resultados de negócio não são garantidos pela implementação técnica.",
    ],
    contactType: "solucao-personalizada",
  },
} as const satisfies Record<ServiceRoute, ServiceDetail>;

export type LegalRoute = Extract<
  AuxiliaryRoute,
  | "/acessibilidade"
  | "/politica-de-cookies"
  | "/politica-de-privacidade"
  | "/termos-de-uso"
>;

export interface LegalSection {
  readonly id: string;
  readonly paragraphs: readonly string[];
  readonly title: string;
  readonly items?: readonly string[];
}

export interface LegalDocument {
  readonly description: string;
  readonly eyebrow: string;
  readonly route: LegalRoute;
  readonly sections: readonly LegalSection[];
  readonly title: string;
  readonly updatedAt: string;
}

export const legalDocuments = {
  "/politica-de-privacidade": {
    route: "/politica-de-privacidade",
    eyebrow: "Transparência",
    title: "Política de privacidade",
    description:
      "Esta política explica quais dados podem ser enviados voluntariamente à W_Flyer, como são usados e quais canais estão disponíveis para solicitações.",
    updatedAt: "29 de julho de 2026",
    sections: [
      {
        id: "escopo",
        title: "Escopo desta política",
        paragraphs: [
          "Esta política se aplica ao site institucional wflyer.com.br e ao contato iniciado por seus canais. A aplicação disponível em app.wflyer.com.br é um ambiente separado e pode possuir termos próprios.",
          "O site institucional não cria conta, área de cliente, banco de leads ou perfil de marketing.",
        ],
      },
      {
        id: "dados",
        title: "Dados recebidos",
        paragraphs: [
          "Ao usar o formulário de contato, você pode informar nome, e-mail, empresa opcional, tipo de projeto, mensagem e consentimento. Esses dados são fornecidos voluntariamente.",
          "Cloudflare, Turnstile e a hospedagem podem processar dados técnicos necessários à segurança e à operação, como endereço IP, data, hora e características básicas da requisição.",
        ],
      },
      {
        id: "finalidade",
        title: "Finalidade",
        paragraphs: [
          "Os dados do contato são usados exclusivamente para responder à mensagem, compreender o contexto apresentado e avaliar a possibilidade de conduzir o projeto.",
          "A W_Flyer não vende dados pessoais e não usa o contato para criar audiência de publicidade comportamental.",
        ],
      },
      {
        id: "fluxo",
        title: "Envio e operação",
        paragraphs: [
          "A mensagem validada é enviada pelo serviço Resend ao e-mail institucional davi.benucci@wflyer.com.br. O site não grava uma cópia em banco de dados.",
          "Cloudflare fornece proteções de borda e o Turnstile ajuda a reduzir envios automatizados. A Napoleon executa a aplicação do site. Esses fornecedores podem manter registros técnicos conforme suas próprias obrigações e políticas.",
        ],
      },
      {
        id: "logs",
        title: "Registros técnicos",
        paragraphs: [
          "Os registros da aplicação devem ser mínimos e sanitizados. O corpo integral da mensagem, o e-mail completo, tokens e segredos não são registrados pelos logs do site.",
          "O site não executa retenção em banco de leads. A mensagem segue para os sistemas de e-mail e do provedor, sujeitos às respectivas políticas e aos controles operacionais aplicáveis.",
        ],
      },
      {
        id: "direitos",
        title: "Solicitações e direitos",
        paragraphs: [
          "Você pode pedir informações sobre o tratamento, acesso, correção ou eliminação de dados, observados os limites e as hipóteses previstos na legislação aplicável.",
          "Envie a solicitação para davi.benucci@wflyer.com.br. Para proteger o titular, pode ser necessário confirmar a identidade antes do atendimento.",
        ],
      },
      {
        id: "alteracoes",
        title: "Alterações",
        paragraphs: [
          "Esta política pode ser atualizada quando a implementação ou os canais mudarem. A data exibida no início identifica a versão vigente.",
          "Uma revisão jurídica profissional é recomendada antes do uso comercial definitivo.",
        ],
      },
    ],
  },
  "/politica-de-cookies": {
    route: "/politica-de-cookies",
    eyebrow: "Transparência",
    title: "Política de cookies",
    description:
      "O lançamento do site não utiliza analytics, pixels, replay de sessão ou cookies de marketing.",
    updatedAt: "29 de julho de 2026",
    sections: [
      {
        id: "resumo",
        title: "Resumo",
        paragraphs: [
          "O site W_Flyer não utiliza Google Analytics, Meta Pixel, ferramentas de replay de sessão ou cookies de publicidade no lançamento.",
          "Por não haver cookie não essencial controlado pela W_Flyer, o site não apresenta um banner genérico de consentimento.",
        ],
      },
      {
        id: "tema",
        title: "Preferência de tema",
        paragraphs: [
          "A escolha entre tema claro e escuro pode ser guardada no localStorage do navegador. Esse recurso fica no dispositivo, serve apenas para lembrar a aparência escolhida e não cria um perfil de navegação.",
          "Você pode remover essa preferência apagando os dados locais do site no navegador.",
        ],
      },
      {
        id: "seguranca",
        title: "Segurança e operação",
        paragraphs: [
          "Cloudflare, Turnstile e Napoleon podem processar identificadores e dados técnicos necessários para entregar, proteger e operar o site.",
          "No formulário, o Turnstile pode usar mecanismos próprios para distinguir interações legítimas de tráfego automatizado. Esse processamento é destinado à segurança do envio.",
        ],
      },
      {
        id: "controle",
        title: "Controles do navegador",
        paragraphs: [
          "O navegador permite visualizar e remover cookies, armazenamento local e outros dados do site. O bloqueio de recursos estritamente necessários pode afetar segurança ou funcionamento.",
          "Dúvidas sobre esta política podem ser enviadas para davi.benucci@wflyer.com.br.",
        ],
      },
      {
        id: "alteracoes",
        title: "Alterações",
        paragraphs: [
          "Se novos recursos passarem a usar tecnologias não essenciais, esta política e os controles de consentimento deverão ser revistos antes da ativação.",
          "Uma revisão jurídica profissional é recomendada antes do uso comercial definitivo.",
        ],
      },
    ],
  },
  "/termos-de-uso": {
    route: "/termos-de-uso",
    eyebrow: "Uso do site",
    title: "Termos de uso",
    description:
      "Estes termos apresentam as condições gerais de uso do site institucional W_Flyer.",
    updatedAt: "29 de julho de 2026",
    sections: [
      {
        id: "natureza",
        title: "Natureza institucional",
        paragraphs: [
          "wflyer.com.br apresenta a W_Flyer, seus serviços digitais, projetos selecionados e a proposta pública de uma aplicação musical em desenvolvimento.",
          "O conteúdo do site é informativo. Escopo, preço, prazo, suporte e responsabilidades de um projeto somente são definidos em instrumento específico entre as partes.",
        ],
      },
      {
        id: "aplicacao",
        title: "Aplicação W_Flyer",
        paragraphs: [
          "A aplicação musical é apresentada como produto em desenvolvimento e como ferramenta de apoio. O conteúdo não promete precisão absoluta nem substitui revisão, interpretação ou avaliação musical profissional.",
          "O ambiente app.wflyer.com.br é separado deste site e pode disponibilizar condições próprias de acesso e uso.",
        ],
      },
      {
        id: "propriedade",
        title: "Propriedade intelectual",
        paragraphs: [
          "Textos, identidade visual, código, ilustrações e demais materiais próprios do site são protegidos pela legislação aplicável, ressalvadas licenças expressamente indicadas.",
          "O acesso ao site não transfere direitos de propriedade nem autoriza reprodução comercial sem permissão.",
        ],
      },
      {
        id: "links",
        title: "Links externos",
        paragraphs: [
          "O site contém links para a aplicação, redes e projetos externos. Cada destino possui operação e políticas próprias.",
          "A W_Flyer não controla alterações, indisponibilidade ou práticas de ambientes externos, embora procure indicar claramente quando um link abre outro site.",
        ],
      },
      {
        id: "disponibilidade",
        title: "Disponibilidade e alterações",
        paragraphs: [
          "O site pode passar por manutenção, atualização ou indisponibilidade temporária. Não há garantia de funcionamento ininterrupto.",
          "Conteúdo e estes termos podem ser atualizados para refletir mudanças reais. A data do início identifica a versão vigente.",
        ],
      },
      {
        id: "contato",
        title: "Contato",
        paragraphs: [
          "Dúvidas sobre o site e estes termos podem ser enviadas para davi.benucci@wflyer.com.br.",
          "Uma revisão jurídica profissional é recomendada antes do uso comercial definitivo.",
        ],
      },
    ],
  },
  "/acessibilidade": {
    route: "/acessibilidade",
    eyebrow: "Acesso para todas as pessoas",
    title: "Acessibilidade",
    description:
      "A W_Flyer busca oferecer uma experiência perceptível, operável, compreensível e robusta em diferentes formas de navegação.",
    updatedAt: "29 de julho de 2026",
    sections: [
      {
        id: "compromisso",
        title: "Compromisso",
        paragraphs: [
          "O site é desenvolvido com o objetivo de atender aos critérios aplicáveis das WCAG 2.2 no nível AA. Essa declaração expressa uma meta contínua de qualidade, não uma certificação independente.",
          "Conteúdo, navegação e movimento são avaliados para que a experiência não dependa apenas de visão, cor, mouse ou animação.",
        ],
      },
      {
        id: "recursos",
        title: "Recursos implementados",
        paragraphs: [
          "A estrutura utiliza headings e landmarks semânticos, link para pular ao conteúdo, foco visível, links reais e ordem de leitura lógica.",
          "O menu é operável por teclado, as imagens e ilustrações recebem tratamento semântico adequado e a preferência por movimento reduzido é respeitada.",
        ],
        items: [
          "Navegação por teclado e foco visível.",
          "Temas claro e escuro com contraste verificável.",
          "Conteúdo essencial disponível sem depender de animação.",
          "Textos alternativos ou ocultação semântica para elementos visuais.",
          "Formulários com labels, instruções e feedback associados.",
        ],
      },
      {
        id: "compatibilidade",
        title: "Compatibilidade",
        paragraphs: [
          "O site é projetado para navegadores modernos, diferentes tamanhos de tela e tecnologias assistivas que interpretam padrões atuais da web.",
          "Configurações de contraste, tamanho de texto e redução de movimento do sistema são consideradas sempre que aplicáveis.",
        ],
      },
      {
        id: "barreiras",
        title: "Comunique uma barreira",
        paragraphs: [
          "Se encontrar dificuldade para acessar conteúdo ou operar um recurso, envie uma descrição para davi.benucci@wflyer.com.br.",
          "Quando possível, informe a página, o navegador, o dispositivo e a tecnologia assistiva utilizada. Esses detalhes ajudam a reproduzir e corrigir o problema.",
        ],
      },
      {
        id: "evolucao",
        title: "Evolução contínua",
        paragraphs: [
          "Acessibilidade faz parte dos critérios de implementação, testes e revisão do site. Novas páginas e interações devem preservar os mesmos requisitos.",
          "Uma auditoria independente pode ser realizada antes ou após a publicação para complementar os testes internos.",
        ],
      },
    ],
  },
} as const satisfies Record<LegalRoute, LegalDocument>;
