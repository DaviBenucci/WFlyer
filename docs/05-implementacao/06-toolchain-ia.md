# Toolchain de IA para desenvolvimento

Nenhuma ferramenta desta lista integra o runtime do site.

## Aprovadas

### Codex

Agente principal de implementação, testes, revisão e atualização documental. O Codex deve reconstruir golden references com código; não pode incorporar as imagens à interface.

### OpenSpec

Especificações de mudança antes de código. Uma funcionalidade relevante deve ter proposta, critérios e tarefas.

### Context7 MCP

Consulta de documentação atual e específica por versão.

### Next.js DevTools MCP

Inspeção de erros, rotas, runtime e comportamento do Next.js durante o desenvolvimento.

### Playwright MCP

Validação de navegação, direção das transições, responsividade, acessibilidade e comportamento em navegador.

### Graphify

Mapa do repositório e relações entre documentação, componentes e testes. Não pode alterar a arquitetura nem substituir a leitura das fontes normativas.

### Gerador de imagens de referência

Pode ser usado fora do runtime para criar golden references individuais a partir dos briefs. Uma imagem só se torna normativa após revisão e aprovação explícita do usuário. O gerador não aprova o próprio resultado.

## Não aprovadas

- LangChain;
- LlamaIndex;
- CrewAI;
- AutoGen;
- AI SDK em produção;
- Agents SDK em produção;
- geração automática de conteúdo publicada sem revisão;
- uso de screenshot como implementação;
- aprovação automática de baseline visual.

## Protocolo de uso

1. ler `AGENTS.md`;
2. ler fonte da verdade e bloqueio;
3. identificar capítulo, ramo e status da golden reference;
4. abrir a imagem aprovada e seu `.spec.yaml`;
5. consultar OpenSpec da mudança;
6. usar Context7 quando uma API estiver incerta;
7. implementar a menor mudança coerente;
8. comparar screenshot do código com a referência;
9. testar com Playwright e ferramentas locais;
10. registrar evidências;
11. atualizar documentação na mesma entrega.

## Regra de bloqueio visual

Se a página estiver marcada como `pending-generation` ou `pending-approval`, o Codex pode implementar somente estrutura neutra, tipos, rotas, conteúdo semântico e testes de infraestrutura. Ele não pode inventar a composição final nem marcar a página como concluída.
