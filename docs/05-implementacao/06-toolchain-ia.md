# Toolchain de IA para desenvolvimento

Nenhuma ferramenta desta lista integra o runtime do site.

## Aprovadas

### Codex

Agente principal de implementação, testes, revisão e atualização documental.

### OpenSpec

Especificações de mudança antes de código. Uma funcionalidade relevante deve ter proposta, critérios e tarefas.

### Context7 MCP

Consulta de documentação atual e específica por versão.

### Next.js DevTools MCP

Inspeção de erros, rotas, runtime e comportamento do Next.js durante o desenvolvimento.

### Playwright MCP

Validação da navegação, responsividade, acessibilidade e comportamento em navegador.

### Graphify

Mapa do repositório e relações entre documentação, componentes e testes. Não pode alterar a arquitetura nem substituir a leitura das fontes normativas.

## Não aprovadas

- LangChain;
- LlamaIndex;
- CrewAI;
- AutoGen;
- AI SDK em produção;
- Agents SDK em produção;
- geração automática de conteúdo publicada sem revisão.

## Protocolo de uso

1. ler `AGENTS.md`;
2. ler fonte da verdade e bloqueio;
3. consultar OpenSpec da mudança;
4. usar Context7 quando uma API estiver incerta;
5. implementar a menor mudança coerente;
6. testar com Playwright e ferramentas locais;
7. registrar evidências;
8. atualizar documentação na mesma entrega.
