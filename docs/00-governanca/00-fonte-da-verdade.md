# Fonte da verdade

## Objetivo

Evitar que decisões mudem durante a implementação por preferência da IA, repetição de prompts, leitura isolada de uma imagem ou adoção oportunista de bibliotecas.

## Documentos e referências normativas

| Prioridade | Fonte | Função |
|---|---|---|
| 1 | `05-registro-decisoes.md` e ADRs aprovadas | decisões formais e substituições |
| 2 | `01-bloqueio-tecnologico.md` | tecnologias autorizadas e proibidas |
| 3 | `01-produto/05-requisitos.md` | comportamento e restrições do produto |
| 4 | `02-design/09-sistema-dupla-partitura.md` e `10-especificacao-visual-paginas.md` | arquitetura visual e contrato de cada página |
| 5 | golden reference individual marcada como `approved` | composição específica de uma página/estado |
| 6 | `wflyer-approved-master-board.png` | linguagem visual global, temas e densidade |
| 7 | `03-motion/*` | movimento, continuidade e interação |
| 8 | `07-qa/05-criterios-aceite.md` | evidência exigida para conclusão |
| 9 | `05-implementacao/*` | modo de execução |

## Regra para conflitos entre texto e imagem

- uma imagem nunca autoriza conteúdo fictício, texto incorreto, violação de acessibilidade ou tecnologia proibida;
- a especificação textual controla semântica, conteúdo, comportamento, acessibilidade e segurança;
- a golden reference individual controla composição, hierarquia, proporção, ritmo, densidade e posição relativa dos elementos daquela página;
- a prancha mestra controla a identidade visual compartilhada;
- quando uma referência individual aprovada substituir um painel da prancha mestra, a referência individual prevalece somente para aquela página;
- qualquer conflito real deve ser registrado, não resolvido silenciosamente.

## Tratamento de conflito

1. identificar os dois trechos conflitantes;
2. não implementar nenhuma interpretação silenciosa;
3. abrir registro em `05-registro-decisoes.md`;
4. registrar impacto em escopo, prazo, segurança, acessibilidade, conteúdo e performance;
5. aguardar decisão;
6. atualizar todos os documentos, manifests e referências afetados na mesma mudança.

## Terminologia

- **site institucional:** projeto em `wflyer.com.br`;
- **aplicação:** produto separado em `app.wflyer.com.br`;
- **static-first:** páginas estáticas com endpoint mínimo de contato;
- **identidade oficial:** símbolo, wordmark e regras de uso aprovados da W_Flyer;
- **prancha mestra:** composição aprovada que fixa a linguagem visual dos temas claro e escuro;
- **ramo da aplicação:** partitura que parte da Home e avança para a esquerda;
- **ramo institucional:** partitura que parte da Home e avança para a direita;
- **capítulo de partitura:** página/rota principal com posição definida em um ramo;
- **âncora de continuidade:** ponto vetorial pelo qual a pauta entra ou sai de uma página;
- **barra final:** barra dupla que encerra formalmente um ramo;
- **golden reference:** imagem original aprovada para comparação, nunca um asset de produção;
- **compasso de navegação:** item do header construído como miniatura de pauta musical.
