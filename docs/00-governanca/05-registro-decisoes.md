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

## ADR-005 — Scroll nativo

**Status:** aprovado  
A navegação usa scroll nativo. O scroll vertical controla uma cena horizontal; nenhuma biblioteca de smooth scroll será usada.

## ADR-006 — Header em compassos

**Status:** aprovado  
Compassos da aplicação à esquerda, marca textual ao centro e compassos da empresa à direita.

## ADR-007 — Partitura ondulada

**Status:** aprovado  
A pauta principal usa curvas suaves em SVG, com amplitude moderada. Não usar linha totalmente reta nem ondulação extrema.

## ADR-008 — Identidade provisória

**Status:** aprovado  
Somente `W_Flyer` textual e tokens com prefixo provisório até a aprovação da marca.

## ADR-009 — Formulário por Route Handler

**Status:** aprovado  
`POST /api/contact`, Zod, Turnstile, WAF Rate Limiting e Resend. Sem armazenamento.

## ADR-010 — Sem token CSRF customizado na versão inicial

**Status:** aprovado  
O endpoint não usa sessão, autenticação, cookies de autoridade ou mutação de dados do usuário. Portanto, um token CSRF customizado não adicionaria uma fronteira de segurança relevante. Em vez disso, serão usados `Origin`, Content-Type restrito, Turnstile, rate limit e CORS fechado. A decisão deve ser revista se forem introduzidos login, sessão ou cookies autenticados.

## ADR-011 — Sem framework de IA no runtime

**Status:** aprovado  
Ferramentas de IA são apenas de desenvolvimento. O site publicado não terá chatbot, geração dinâmica ou agente.
