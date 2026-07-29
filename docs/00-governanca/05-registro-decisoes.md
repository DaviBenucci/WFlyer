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

## ADR-017 — Golden reference como gate de página

**Status:** aprovado
A implementação visual final de uma página só pode começar quando houver golden reference individual aprovada, acompanhada por `.spec.yaml`. A referência é reconstruída com HTML, CSS e SVG; é proibido usar o PNG como fundo, textura ou substituto da interface.
