# AGENTS.md — regras normativas para agentes de implementação

## 1. Escopo do repositório

Este repositório pertence exclusivamente ao site institucional `wflyer.com.br`.

É proibido:

- importar código, documentação de domínio ou regras do motor musical do aplicativo;
- implementar OCR, OMR, transposição, harmonização, análise de partitura ou processamento musical real;
- criar autenticação, painel administrativo, banco de dados ou área de cliente sem decisão formal;
- afirmar que a W_Flyer possui equipe, clientes, números, cases ou resultados ainda inexistentes;
- tratar a clave de sol narrativa como logotipo oficial;
- publicar métricas, depoimentos, contatos, redes sociais ou cases de preenchimento;
- incorporar golden references ou screenshots como interface produtiva.

A aplicação musical deve ser apresentada somente em linguagem pública e comercial. A demonstração do tablet é local, determinística e ilustrativa.

## 2. Fonte da verdade

A ordem de precedência é:

1. decisões aprovadas em `docs/00-governanca/05-registro-decisoes.md`;
2. bloqueio tecnológico;
3. requisitos de produto;
4. especificação da dupla partitura e das páginas;
5. golden reference individual aprovada;
6. prancha visual mestra;
7. motion, implementação e comentários do código.

A imagem controla composição; a documentação controla comportamento, semântica, acessibilidade, segurança e conteúdo. Quando houver conflito, não escolher arbitrariamente. Interromper a etapa, registrar o conflito e solicitar decisão.

## 3. Stack bloqueada

Usar somente:

- Next.js App Router;
- React;
- TypeScript em modo estrito;
- Tailwind CSS 4;
- CSS Custom Properties;
- GSAP, ScrollTrigger e `@gsap/react`;
- SVG original;
- MDX local e objetos TypeScript tipados;
- Zod;
- Resend;
- Cloudflare Turnstile e WAF Rate Limiting;
- Vitest, Testing Library, Storybook, Playwright, axe-core e Lighthouse CI.

Não instalar Anime.js, Motion/Framer Motion, React Spring, Lenis, Three.js, React Three Fiber, Lottie, bibliotecas de partículas, smooth scroll global, CMS ou biblioteca geral de componentes.

## 4. Dependências

- toda dependência deve ter versão exata no `package.json`;
- não usar `^` ou `~`;
- o lockfile é obrigatório;
- uma dependência nova exige justificativa e ADR;
- não substituir uma biblioteca por preferência do agente;
- remover dependências sem uso antes do encerramento da fase.

## 5. Identidade oficial e referências

- usar os SVGs oficiais da W_Flyer;
- o símbolo oficial ocupa o centro do header desktop;
- o wordmark oficial só aparece nos lockups e locais previstos;
- a clave de sol é um elemento narrativo da Home e não substitui a marca;
- usar tokens `--wf-*` definidos em `02-tokens-visuais-v1.md`;
- não copiar vetores, notas ou composições das referências de terceiros;
- não usar a prancha mestra ou golden pages como background, texture, `<img>` de interface ou mapa de imagem;
- reconstruir cada referência com componentes semânticos, CSS e SVG originais;
- uma página final exige golden reference individual `approved` e `.spec.yaml` correspondente.

## 6. Arquitetura da dupla partitura

- a Home é a origem da composição;
- o ramo da aplicação avança para a esquerda;
- o ramo institucional avança para a direita;
- cada rota principal declara `branch`, `order`, `previous`, `next`, `entryAnchor`, `exitAnchor` e `terminal`;
- Benefícios termina com CTA para o app e barra dupla final;
- Contato termina com formulário e barra dupla final;
- páginas de detalhe de serviço e páginas legais são rotas auxiliares, não novos compassos da linha principal;
- deep links devem renderizar diretamente a página correta, sem simular toda a viagem desde a Home;
- saltos no mesmo ramo usam passagem comprimida e nunca montam páginas intermediárias;
- trocas entre ramos usam a Home como pivô conceitual e nunca conectam diretamente uma pauta à outra.

## 7. Animação e interação

- usar GSAP para timelines, transições laterais, entrada, saída e reações coordenadas;
- usar CSS para hover, foco, cor e profundidade estrutural do tablet;
- não substituir o scroll nativo;
- não deformar continuamente a pauta durante o scroll;
- não criar animação automática infinita;
- respeitar `prefers-reduced-motion`;
- não bloquear leitura, foco, teclado, histórico ou navegação por links;
- o tablet pode inclinar no máximo dentro dos limites documentados e deve permanecer operável por teclado;
- a tela do tablet deve ser DOM, nunca uma imagem achatada ou textura WebGL.

## 8. Segurança

- o formulário envia exclusivamente para `POST /api/contact`;
- validar Content-Type, tamanho, origem, Turnstile, honeypot e schema Zod;
- não registrar corpo integral, mensagem, e-mail completo, token ou segredo;
- não aceitar anexos nem HTML do visitante;
- não criar persistência local ou remota para contatos;
- falhar de forma fechada quando Turnstile ou validação estiverem indisponíveis.

## 9. Regra sequencial

Uma fase só pode ser marcada como `CONCLUÍDA` quando:

- implementação prevista estiver presente;
- testes obrigatórios estiverem verdes;
- regressão visual tiver sido verificada contra referência aprovada;
- acessibilidade aplicável tiver sido auditada;
- documentação, manifests e evidências tiverem sido atualizados;
- não existirem pendências bloqueadoras.

Não iniciar a próxima fase em paralelo para contornar falhas da fase atual.

## 10. Animação de entrada da marca

A implementação deve seguir `docs/03-motion/06-animacao-entrada-marca.md` e `06-animacao-entrada-marca.timeline.yaml`. É proibido substituir a abertura por vídeo, Lottie, Canvas, WebGL, outro motor de animação ou reveal genérico. Não alterar os paths oficiais. O handoff termina na Home real, onde a clave narrativa e as duas partituras passam a existir.
