# Critérios de aceite da versão inicial

## Produto

- [x] Home apresenta claramente os dois ramos;
- [x] Aplicação, Como funciona e Benefícios estão disponíveis como páginas;
- [x] Empresa, Serviços, Processo, Portfólio e Contato estão disponíveis como páginas;
- [x] detalhes dos quatro serviços estão disponíveis;
- [x] portfólio não contém informação fictícia;
- [x] contato e políticas estão disponíveis;
- [ ] acesso ao aplicativo funciona;
- [x] site e aplicativo permanecem separados.

## Narrativa da partitura

- [x] Home é a origem visual das duas pautas;
- [x] ramo da aplicação avança para a esquerda;
- [x] ramo institucional avança para a direita;
- [x] cada capítulo possui manifesto correto;
- [x] anterior/próximo corresponde ao grafo;
- [x] deep links renderizam diretamente;
- [x] saltos no mesmo ramo não montam capítulos intermediários;
- [x] trocas entre ramos usam o pivô conceitual da Home sem conectar as pautas diretamente;
- [x] Benefícios termina com barra dupla à esquerda;
- [x] Contato termina com barra dupla à direita;
- [x] páginas auxiliares não criam capítulos falsos.

## Design

- [x] símbolo oficial está centralizado no header;
- [x] clave narrativa não é usada como logo;
- [x] pauta principal é ondulada e moderada;
- [x] temas correspondem aos tokens visuais v1;
- [x] imagens de inspiração não foram publicadas;
- [x] cada página segue referência individual, painel ou arquétipo autorizado;
- [x] golden references não entram no bundle;
- [x] nenhuma página usa screenshot como interface;
- [x] claro e escuro preservam geometria;
- [x] nenhuma métrica, cliente, depoimento ou canal foi inventado.

## Motion

- [x] transições seguem a coordenada do destino;
- [x] header permanece estável;
- [x] continuidade da pauta não apresenta salto perceptível;
- [x] não existe segundo motor de animação;
- [x] modo reduzido remove viagem lateral, tilt e abertura extensa;
- [x] final-current-revision performance remains within budget;
- [x] abertura usa SVG oficial e executa uma vez por sessão;
- [x] skip, Escape e reduced motion funcionam;
- [x] lockup final mantém geometria oficial;
- [x] handoff para o símbolo do header não apresenta corte perceptível;
- [x] clave e duas partituras entram somente no handoff para a Home;
- [x] barra final realiza cadência sem ocultar CTA ou formulário.

## Tablet

- [x] casca usa CSS 3D, sem WebGL/Three.js;
- [x] tela é DOM e permanece legível;
- [x] controles funcionam por teclado, mouse e toque;
- [x] resultado é determinístico e anunciado;
- [x] nenhum upload, request ou processamento real ocorre;
- [x] tilt não ultrapassa 6°;
- [x] reduced motion remove tilt;
- [x] mobile não possui overflow horizontal.

## Técnica

- [x] Next.js/React/TypeScript conforme manifesto;
- [x] dependências com versões exatas;
- [x] historical F00–F08 standalone checkpoints built and started locally;
- [x] final-current-revision standalone build/start/smoke passes locally;
- [ ] the exact checksummed candidate starts and passes smoke in the actual
  Napoleon staging application;
- [x] páginas estáticas no build;
- [x] nenhuma dependência de banco;
- [x] nenhum código do aplicativo musical;
- [x] manifesto de capítulos validado;
- [x] timeout de transição libera navegação em falha.

## Segurança

- [x] Turnstile server-side;
- [ ] rate limit ativo;
- [x] payload, origem e schema validados;
- [x] final-current-revision local headers and report-only CSP outputs are
  verified;
- [x] application source emits no contact payload log, and focused local tests
  do not record a full contact payload;
- [x] Contact provider credentials remain server-only by source contract;
- [x] final bundle, archive, and local closure logs have been inspected for
  secret values;
- [ ] Napoleon, Cloudflare, Actions, and provider logs have been verified under
  the owner-approved external retention policy.

## Qualidade

- [x] final-current-revision lint and typecheck are green;
- [x] final-current-revision unit/component suite is green;
- [x] final-current-revision Storybook build/browser suite is green;
- [x] final-current-revision Playwright suite is green in every supported
  engine;
- [x] final-current-revision visual regression is inspected against approved
  references;
- [x] final-current-revision axe suite has no unjustified critical/serious
  finding;
- [x] final-current-revision Lighthouse results satisfy the documented
  budgets;
- [ ] revisão em dispositivo real;
- [x] final documentation, manifests, Graphify outputs, and checksums match the
  focused repository checkpoint.


## Publicação e conteúdo operacional

- [x] e-mail exibido é `davi.benucci@wflyer.com.br`;
- [ ] formulário entrega no mesmo endereço;
- [x] Instagram aponta para `@davibenucci`;
- [x] GitHub aponta para `DaviBenucci`;
- [x] portfólio contém W_Flyer, MSN Distribuidora e MSN Suprimentos sem métricas inventadas;
- [x] nenhum analytics, pixel ou session replay foi instalado;
- [ ] deploy usa GitHub → Napoleon → Cloudflare;
- [x] não existe dependência de VPS ou EasyPanel;
- [ ] GitHub Actions Secrets não aparecem em logs;
- [ ] homologação final foi registrada por Davi Benucci.

## Status interpretation

Checked items have durable source-level, measured final-revision, or historical
phase-checkpoint evidence. Repository-owned closure is green. Cloudflare rate
limiting, an actual Napoleon staging runtime, a physical device/screen-reader
review, the independent `app.wflyer.com.br` DNS/availability baseline, real
staging Resend delivery, GitHub/Napoleon/Cloudflare execution, external
secret-safe logs, and final homologation deliberately remain open. Mocked or
local standalone evidence does not complete those gates. The operational state
is `CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING`.
