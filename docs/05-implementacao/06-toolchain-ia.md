# Toolchain de IA para desenvolvimento

Nenhuma ferramenta desta lista integra o runtime.

## Aprovadas

- Codex: implementação, testes e documentação;
- OpenSpec: propostas e critérios de mudança;
- Context7 MCP: documentação por versão;
- Next.js DevTools MCP: inspeção do framework;
- Playwright MCP: navegação, visual, responsividade e acessibilidade;
- Graphify: mapa do repositório;
- gerador de imagens: opcional para refinamento visual durante QA.

## Não aprovadas no runtime

LangChain, LlamaIndex, CrewAI, AutoGen, AI SDK, Agents SDK, conteúdo gerado sem revisão, screenshot como frontend e aprovação automática de baseline.

## Protocolo

1. ler `AGENTS.md` e o estado pré-código;
2. localizar rota, capítulo e arquétipo na matriz;
3. abrir referência individual ou painéis-fonte do arquétipo;
4. ler conteúdo, motion, segurança e QA;
5. implementar estado estático;
6. comparar screenshot com as fontes visuais;
7. implementar motion;
8. executar testes;
9. registrar evidências e atualizar documentação.

## Regra visual

Todas as páginas estão autorizadas. Para `authorized-derived`, o Codex deve seguir o arquétipo e não solicitar PNG adicional por padrão. Uma nova imagem só é necessária se surgir conflito visual real não resolvido por tokens, especificações ou painéis canônicos.
