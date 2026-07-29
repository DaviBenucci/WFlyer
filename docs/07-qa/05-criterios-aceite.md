# Critérios de aceite da versão inicial

## Produto

- [ ] Home apresenta claramente os dois ramos;
- [ ] Aplicação, Como funciona e Benefícios estão disponíveis como páginas;
- [ ] Empresa, Serviços, Processo, Portfólio e Contato estão disponíveis como páginas;
- [ ] detalhes dos quatro serviços estão disponíveis;
- [ ] portfólio não contém informação fictícia;
- [ ] contato e políticas estão disponíveis;
- [ ] acesso ao aplicativo funciona;
- [ ] site e aplicativo permanecem separados.

## Narrativa da partitura

- [ ] Home é a origem visual das duas pautas;
- [ ] ramo da aplicação avança para a esquerda;
- [ ] ramo institucional avança para a direita;
- [ ] cada capítulo possui manifesto correto;
- [ ] anterior/próximo corresponde ao grafo;
- [ ] deep links renderizam diretamente;
- [ ] saltos no mesmo ramo não montam capítulos intermediários;
- [ ] trocas entre ramos usam o pivô conceitual da Home sem conectar as pautas diretamente;
- [ ] Benefícios termina com barra dupla à esquerda;
- [ ] Contato termina com barra dupla à direita;
- [ ] páginas auxiliares não criam capítulos falsos.

## Design

- [ ] símbolo oficial está centralizado no header;
- [ ] clave narrativa não é usada como logo;
- [ ] pauta principal é ondulada e moderada;
- [ ] temas correspondem aos tokens visuais v1;
- [ ] imagens de inspiração não foram publicadas;
- [ ] cada página segue referência individual, painel ou arquétipo autorizado;
- [ ] golden references não entram no bundle;
- [ ] nenhuma página usa screenshot como interface;
- [ ] claro e escuro preservam geometria;
- [ ] nenhuma métrica, cliente, depoimento ou canal foi inventado.

## Motion

- [ ] transições seguem a coordenada do destino;
- [ ] header permanece estável;
- [ ] continuidade da pauta não apresenta salto perceptível;
- [ ] não existe segundo motor de animação;
- [ ] modo reduzido remove viagem lateral, tilt e abertura extensa;
- [ ] performance permanece dentro do orçamento;
- [ ] abertura usa SVG oficial e executa uma vez por sessão;
- [ ] skip, Escape e reduced motion funcionam;
- [ ] lockup final mantém geometria oficial;
- [ ] handoff para o símbolo do header não apresenta corte perceptível;
- [ ] clave e duas partituras entram somente no handoff para a Home;
- [ ] barra final realiza cadência sem ocultar CTA ou formulário.

## Tablet

- [ ] casca usa CSS 3D, sem WebGL/Three.js;
- [ ] tela é DOM e permanece legível;
- [ ] controles funcionam por teclado, mouse e toque;
- [ ] resultado é determinístico e anunciado;
- [ ] nenhum upload, request ou processamento real ocorre;
- [ ] tilt não ultrapassa 6°;
- [ ] reduced motion remove tilt;
- [ ] mobile não possui overflow horizontal.

## Técnica

- [ ] Next.js/React/TypeScript conforme manifesto;
- [ ] dependências com versões exatas;
- [ ] build standalone reproduzível e executável na Napoleon;
- [ ] páginas estáticas no build;
- [ ] nenhuma dependência de banco;
- [ ] nenhum código do aplicativo musical;
- [ ] manifesto de capítulos validado;
- [ ] timeout de transição libera navegação em falha.

## Segurança

- [ ] Turnstile server-side;
- [ ] rate limit ativo;
- [ ] payload, origem e schema validados;
- [ ] headers e CSP verificados;
- [ ] logs sanitizados;
- [ ] segredos server-only.

## Qualidade

- [ ] lint e typecheck verdes;
- [ ] unitários verdes;
- [ ] Storybook testado;
- [ ] Playwright verde nos navegadores definidos;
- [ ] visual regression comparada às referências aprovadas;
- [ ] axe sem violações críticas/sérias não justificadas;
- [ ] Lighthouse dentro das metas;
- [ ] revisão em dispositivo real;
- [ ] documentação, manifests e checksums atualizados.


## Publicação e conteúdo operacional

- [ ] e-mail exibido é `davi.benucci@wflyer.com.br`;
- [ ] formulário entrega no mesmo endereço;
- [ ] Instagram aponta para `@davibenucci`;
- [ ] GitHub aponta para `DaviBenucci`;
- [ ] portfólio contém W_Flyer, MSN Distribuidora e MSN Suprimentos sem métricas inventadas;
- [ ] nenhum analytics, pixel ou session replay foi instalado;
- [ ] deploy usa GitHub → Napoleon → Cloudflare;
- [ ] não existe dependência de VPS ou EasyPanel;
- [ ] GitHub Actions Secrets não aparecem em logs;
- [ ] homologação final foi registrada por Davi Benucci.
