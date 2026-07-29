# AGENTS.md — regras normativas para agentes de implementação

## 1. Escopo do repositório

Este repositório pertence exclusivamente ao site institucional `wflyer.com.br`.

É proibido:

- importar código, documentação de domínio ou regras do motor musical do aplicativo;
- implementar OCR, transposição, harmonização, análise de partitura ou processamento musical;
- criar autenticação, painel administrativo, banco de dados ou área de cliente sem decisão formal;
- afirmar que a W_Flyer possui equipe, clientes, números, cases ou resultados ainda inexistentes;
- tratar a clave provisória como logotipo oficial.

A aplicação musical deve ser apresentada somente como produto futuro, em linguagem pública e comercial.

## 2. Fonte da verdade

A ordem de precedência é:

1. decisões aprovadas em `docs/00-governanca/05-registro-decisoes.md`;
2. bloqueio tecnológico;
3. requisitos de produto e critérios de aceite;
4. especificações de design e motion;
5. instruções de implementação;
6. comentários do código.

Quando houver conflito, não escolher arbitrariamente. Interromper a etapa, registrar o conflito e solicitar decisão.

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

## 5. Identidade provisória

Enquanto a identidade oficial não estiver aprovada:

- usar apenas o nome textual `W_Flyer` como marca principal;
- prefixar tokens provisórios com `--wf-provisional-`;
- nomear o símbolo temporário como `ProvisionalBrandMark`;
- não incorporar as imagens de inspiração ao produto final;
- não copiar vetores, notas ou composições das referências de terceiros.

## 6. Animação

- usar GSAP para timelines, scroll, entrada, saída e reações coordenadas;
- usar CSS somente para estados simples de hover, foco e cor;
- não substituir o scroll nativo;
- não deformar continuamente a pauta durante o scroll;
- respeitar `prefers-reduced-motion`;
- não bloquear leitura, foco, teclado ou navegação por âncoras.

## 7. Segurança

- o formulário envia exclusivamente para `POST /api/contact`;
- validar Content-Type, tamanho, origem, Turnstile, honeypot e schema Zod;
- não registrar corpo integral, mensagem, e-mail completo, token ou segredo;
- não aceitar anexos nem HTML do visitante;
- não criar persistência local ou remota para contatos;
- falhar de forma fechada quando Turnstile ou validação estiverem indisponíveis.

## 8. Regra sequencial

Uma fase só pode ser marcada como `CONCLUÍDA` quando:

- implementação prevista estiver presente;
- testes obrigatórios estiverem verdes;
- regressão visual tiver sido verificada;
- acessibilidade aplicável tiver sido auditada;
- documentação e logs tiverem sido atualizados;
- não existirem pendências bloqueadoras.

Não iniciar a próxima fase em paralelo para contornar falhas da fase atual.


## Animação de entrada da marca

A implementação deve seguir `docs/03-motion/06-animacao-entrada-marca.md` e o arquivo `06-animacao-entrada-marca.timeline.yaml`. É proibido substituir a abertura por vídeo, Lottie, Canvas, WebGL, outro motor de animação ou um reveal genérico. Não alterar os paths oficiais da marca. Cada fase só pode avançar após aprovação visual e testes da fase anterior.
