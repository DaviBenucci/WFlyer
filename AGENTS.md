# AGENTS.md — regras normativas para agentes de implementação

## 1. Escopo

Este repositório pertence exclusivamente ao site institucional `wflyer.com.br`.

É proibido:

- importar código ou regras internas do aplicativo musical;
- implementar OCR, OMR, transposição real, harmonização, banco, autenticação ou painel administrativo;
- alterar `app.wflyer.com.br`;
- inventar métricas, clientes, depoimentos, equipe ou resultados;
- usar a clave narrativa como logo;
- incorporar screenshots ou golden references como interface produtiva;
- adicionar analytics na versão inicial.

## 2. Fonte da verdade

A ordem de precedência é:

1. decisões aprovadas em `docs/00-governanca/05-registro-decisoes.md`;
2. bloqueio tecnológico;
3. requisitos de produto;
4. especificação de páginas e dupla partitura;
5. autorização visual e arquétipos;
6. referência individual aprovada, quando existir;
7. painel aprovado na prancha mestra;
8. tokens, motion, responsividade e critérios de aceite.

A imagem controla linguagem, proporção e densidade. A documentação controla conteúdo, comportamento, acessibilidade, segurança e herança entre páginas.

## 3. Stack bloqueada

Usar:

- Next.js App Router;
- React;
- TypeScript estrito;
- Tailwind CSS 4 e CSS Custom Properties;
- GSAP, ScrollTrigger e `@gsap/react`;
- SVG original;
- conteúdo local em MDX/TypeScript;
- Zod, Resend e Cloudflare Turnstile;
- Vitest, Testing Library, Storybook, Playwright, axe-core e Lighthouse CI.

Não usar Anime.js, Motion/Framer Motion, React Spring, Lenis, Three.js, React Three Fiber, WebGL, Lottie, biblioteca de partículas, CMS ou sistema geral de componentes.

## 4. Referências visuais

O conjunto atual é suficiente para implementação integral.

- prancha mestra: sistema visual e painéis canônicos;
- Aplicação desktop claro: composição canônica da página de produto e tablet;
- `visual-archetypes.yaml`: herança das páginas sem imagem própria;
- `page-matrix.yaml`: status de autorização por estado;
- specs textuais: estrutura, conteúdo e continuidade.

Uma página `authorized-derived` deve ser implementada a partir do arquétipo indicado, sem criar uma linguagem nova. Referências adicionais podem ser geradas durante QA para comparação, mas não são pré-condição.

Proibido:

- usar PNG como background ou textura;
- recortar elementos de screenshots;
- transformar o tablet em imagem achatada;
- atualizar baseline para ocultar divergências;
- copiar erros de texto presentes em imagens.

## 5. Dupla partitura

- Home é a origem;
- aplicação avança para a esquerda;
- institucional avança para a direita;
- cada rota principal declara ramo, ordem, anterior, seguinte, entrada, saída e terminal;
- Benefícios e Contato terminam com barra dupla final;
- deep links renderizam diretamente;
- troca entre ramos usa a Home como pivô conceitual;
- páginas auxiliares não criam capítulos falsos.

## 6. Motion e tablet

- GSAP para timelines e transições coordenadas;
- CSS para estados simples e profundidade estrutural;
- scroll nativo;
- nenhuma animação infinita obrigatória;
- respeitar `prefers-reduced-motion`;
- tablet em DOM, operável por teclado, com tilt máximo documentado;
- demonstração local e determinística, sem rede ou motor musical.

## 7. Conteúdo oficial

Usar `docs/04-conteudo/08-perfil-publicacao.yaml`.

- e-mail público e destinatário: `davi.benucci@wflyer.com.br`;
- Instagram: `@davibenucci`;
- GitHub: `DaviBenucci`;
- portfólio: W_Flyer, MSN Distribuidora e MSN Suprimentos;
- não criar métricas para esses projetos;
- analytics permanece desabilitado.

## 8. Infraestrutura e deploy

- repositório no GitHub sob a conta `DaviBenucci`;
- origem na Napoleon como aplicação Node.js conectada ao GitHub;
- Cloudflare permanece na borda;
- não criar VPS, EasyPanel ou dependência obrigatória de Docker;
- preparar build Next.js standalone compatível com Node.js;
- armazenar segredos em GitHub Actions Secrets;
- garantir que os segredos sejam injetados no runtime da Napoleon; não presumir que secrets do Actions aparecem automaticamente no processo Node;
- preservar zona, nameservers, e-mail e `app.wflyer.com.br`.

## 9. Segurança

- formulário somente por `POST /api/contact`;
- validar Content-Type, tamanho, origem, Turnstile, honeypot e Zod;
- sem anexos, HTML do visitante ou persistência;
- não registrar mensagem, e-mail completo, token ou segredo;
- falhar de forma fechada.

## 10. Regra sequencial

Uma fase só é `CONCLUÍDA` com:

- implementação prevista;
- testes verdes;
- comparação visual com referência ou arquétipo autorizado;
- acessibilidade auditada;
- documentação e evidências atualizadas;
- nenhuma pendência bloqueadora.

## 11. Estado de execução

`PRE-CODE-STATUS.md` está em `READY_FOR_IMPLEMENTATION`. O Codex pode iniciar e concluir o código. A publicação só pode ocorrer após:

- cadastro dos GitHub Actions Secrets;
- configuração da aplicação Node.js na Napoleon;
- validação de staging;
- homologação por Davi Benucci;
- smoke test de produção e confirmação de que `app.wflyer.com.br` permaneceu operacional.
