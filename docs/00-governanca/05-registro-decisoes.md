# Registro de decisões

## ADR-001 — Repositório separado

**Status:** aprovado
O site institucional e a aplicação musical permanecem separados.

## ADR-002 — Arquitetura static-first

**Status:** aprovado
Páginas estáticas no build; somente o endpoint de contato utiliza runtime de servidor.

## ADR-003 — Sem banco de dados

**Status:** aprovado
Não utilizar banco, Redis, KV, CMS ou persistência de leads na primeira versão.

## ADR-004 — Motor único de animação

**Status:** aprovado
GSAP, ScrollTrigger e `@gsap/react` são o único conjunto de animação programática.

## ADR-005 — Cena horizontal monolítica controlada por scroll

**Status:** substituído pela ADR-014
A proposta anterior colocava Aplicação, Como funciona, Benefícios, centro W_Flyer, Empresa e Serviços em uma única cena horizontal fixada. A nova decisão preserva a linguagem lateral, mas distribui a composição em páginas/capítulos independentes, ligados por transições direcionais e por uma partitura contínua.

## ADR-006 — Header em compassos

**Status:** aprovado
Compassos da aplicação à esquerda, símbolo oficial W_Flyer ao centro e compassos da empresa à direita.

## ADR-007 — Partitura ondulada

**Status:** aprovado
A pauta principal usa curvas suaves em SVG, com amplitude moderada. Não usar linha totalmente reta nem ondulação extrema.

## ADR-008 — Identidade e direção visual

**Status:** aprovado e atualizado
O símbolo e o wordmark W_Flyer são oficiais. A prancha mestra aprovada fixa a linguagem marfim/marrom no modo claro e azul-marinho/violeta no modo escuro. Tokens permanecem versionados, mas não são mais tratados como identidade provisória.

## ADR-009 — Formulário por Route Handler

**Status:** aprovado
`POST /api/contact`, Zod, Turnstile, WAF Rate Limiting e Resend. Sem armazenamento.

## ADR-010 — Sem token CSRF customizado na versão inicial

**Status:** aprovado
O endpoint não usa sessão, autenticação, cookies de autoridade ou mutação de dados do usuário. Serão usados `Origin`, Content-Type restrito, Turnstile, rate limit e CORS fechado. A decisão deve ser revista se forem introduzidos login, sessão ou cookies autenticados.

## ADR-011 — Sem framework de IA no runtime

**Status:** aprovado
Ferramentas de IA são apenas de desenvolvimento. O site publicado não terá chatbot, geração dinâmica ou agente.

## ADR-012 — Abertura vetorial programática

**Status:** aprovado
A abertura da homepage será implementada com SVG oficial, GSAP e `@gsap/react`. Não usar vídeo generativo, Lottie, Canvas, WebGL ou segundo motor de animação. A duração alvo segue a especificação dedicada, com execução uma vez por sessão, skip acessível, reduced motion e handoff direto para o header e a Home.

## ADR-013 — Prancha visual mestra aprovada

**Status:** aprovado
`docs/design-reference/golden-pages/master/wflyer-approved-master-board.png` é a referência visual global. Ela fixa a divisão do header, o uso do símbolo, a linguagem editorial, os dois temas, os cards, os botões, as pautas onduladas e a densidade decorativa. Não deve ser incorporada como imagem no frontend.

## ADR-014 — Home como origem de duas partituras

**Status:** aprovado
A Home é o ponto central da composição. A clave de sol narrativa origina dois caminhos:

- esquerda: Aplicação → Como funciona → Benefícios → acesso ao app → barra final;
- direita: Empresa → Serviços → Processo → Portfólio → Contato → barra final.

Cada etapa principal é uma rota/capítulo independente. O deslocamento lateral é usado como transição narrativa; o conteúdo da página continua com scroll vertical nativo.

## ADR-015 — Continuidade e encerramento musical

**Status:** aprovado
Toda página principal deve declarar entrada, saída, ramo, ordem, rota anterior, rota seguinte e estado terminal. Benefícios encerra o ramo da aplicação após o CTA para o aplicativo. Contato encerra o ramo institucional após o formulário. Ambos usam barra dupla final inequívoca.

## ADR-016 — Tablet interativo sem motor real

**Status:** aprovado
A página Aplicação usa um tablet com profundidade por CSS 3D e movimento coordenado por GSAP. A tela é HTML interativo e acessível, não uma textura raster. A demonstração usa dados locais determinísticos e não executa upload, OCR/OMR, transposição real, rede, autenticação ou processamento do aplicativo.

## ADR-017 — Referência visual e herança por arquétipo

**Status:** aprovado e atualizado
O conjunto visual existente é suficiente para a implementação integral. Uma página pode ser `approved-individual`, `approved-master-panel` ou `authorized-derived`. Estados derivados usam obrigatoriamente o arquétipo, os tokens, a especificação textual e as regras responsivas. PNGs nunca são usados como frontend.

## ADR-018 — Cloudflare e DNS já provisionados

**Status:** aprovado com inventário pendente  
O proprietário confirmou que a propriedade da W_Flyer já existe na Cloudflare e que o DNS já aponta para a Cloudflare. O projeto não deve recriar a zona nem trocar nameservers. `app.wflyer.com.br` é uma aplicação existente e deve permanecer operacional e intocável. Antes de mudanças, o Codex deve realizar inventário somente leitura e identificar o produto Cloudflare, registros, origem, SSL, cache, WAF e regras atuais.

## ADR-019 — Implementação integral somente após freeze pré-código

**Status:** aprovado  
O Codex poderá implementar as Fases 0 a 9 em sequência após o checklist `15-checklist-prontidao-pre-codigo.md` atingir `READY_FOR_IMPLEMENTATION`. Antes disso, não pode inventar páginas pendentes, publicar uma versão parcial no domínio principal nem alterar infraestrutura da aplicação.


## ADR-020 — Hospedagem Napoleon conectada ao GitHub

**Status:** aprovado  
O site será mantido no GitHub e executado como aplicação Node.js na Napoleon, atrás da Cloudflare. VPS, EasyPanel e Docker deixam de ser requisitos normativos de produção. O build deve gerar saída Next.js standalone e possuir procedimento de inicialização compatível com o ambiente Node.js da Napoleon.

## ADR-021 — GitHub Actions Secrets como fonte de segredos

**Status:** aprovado; mecanismo de entrega esclarecido pelo ADR-024
Turnstile e Resend ficam em GitHub Environment Secrets para validar e empacotar
o candidato. Os valores equivalentes de runtime devem ser configurados
explicitamente na Napoleon; o GitHub Actions não os transporta nem os
sincroniza. A integração por branch não exige credencial de deploy no workflow,
e é proibido presumir que secrets do Actions aparecem automaticamente no
processo hospedado.

## ADR-022 — Canais, portfólio e analytics

**Status:** aprovado  
O e-mail público e destinatário é `davi.benucci@wflyer.com.br`. As únicas redes são Instagram `@davibenucci` e GitHub `DaviBenucci`. O portfólio inicial contém W_Flyer, MSN Distribuidora e MSN Suprimentos. Analytics e cookies de marketing não serão utilizados no lançamento.

## ADR-023 — Homologação pelo proprietário

**Status:** aprovado  
Davi Benucci é o responsável pela homologação final. O Codex executa desenvolvimento e QA, mas somente a aprovação registrada pelo responsável libera a produção.

## ADR-024 — Napoleon Git branch handoff

**Status:** approved on 2026-08-03
The owner confirmed that Napoleon can pull and build a selected branch from the
GitHub repository. Staging uses `develop/site-institucional`; production may
use `main` only after Davi Benucci's explicit homologation. GitHub Actions
validates and packages the selected commit but remains read-only: it does not
create or push a deployment commit. Before Napoleon is attached or restarted,
the branch head, green CI run, and release manifest must identify the same full
commit SHA. That branch head remains frozen until Napoleon records the same
selected SHA; any intervening advance invalidates the handoff and requires a
new CI/manifest cycle. Provider values must still be configured explicitly in
Napoleon; GitHub Environment values do not appear there automatically.
