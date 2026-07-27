# Fonte da verdade

## Objetivo

Evitar que decisões mudem durante a implementação por preferência da IA, repetição de prompts ou adoção oportunista de bibliotecas.

## Documentos normativos

| Prioridade | Documento | Função |
|---|---|---|
| 1 | `05-registro-decisoes.md` | decisões aprovadas e alterações formais |
| 2 | `01-bloqueio-tecnologico.md` | tecnologias autorizadas e proibidas |
| 3 | `01-produto/05-requisitos.md` | comportamento e restrições do produto |
| 4 | `02-design/*` e `03-motion/*` | aparência, interação e movimento |
| 5 | `07-qa/05-criterios-aceite.md` | evidência exigida para conclusão |
| 6 | `05-implementacao/*` | modo de execução |

## Tratamento de conflito

1. identificar os dois trechos conflitantes;
2. não implementar nenhuma interpretação silenciosa;
3. abrir registro em `05-registro-decisoes.md`;
4. registrar impacto em escopo, prazo, segurança, acessibilidade e performance;
5. aguardar decisão;
6. atualizar todos os documentos afetados na mesma mudança.

## Terminologia

- **site institucional:** projeto em `wflyer.com.br`;
- **aplicação:** produto separado em `app.wflyer.com.br`;
- **static-first:** páginas estáticas com endpoint mínimo de contato;
- **identidade provisória:** cores, fontes e símbolo substituíveis;
- **golden reference:** referência visual original aprovada para comparação;
- **compasso de navegação:** item do header construído como miniatura de pauta musical.
