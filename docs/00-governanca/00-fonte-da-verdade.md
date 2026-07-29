# Fonte da verdade

## Objetivo

Impedir que a implementação mude por preferência do agente ou por leitura isolada de uma imagem.

## Ordem normativa

| Prioridade | Fonte | Função |
|---|---|---|
| 1 | `05-registro-decisoes.md` | decisões formais e substituições |
| 2 | `01-bloqueio-tecnologico.md` | tecnologias autorizadas e proibidas |
| 3 | `01-produto/05-requisitos.md` | comportamento e restrições |
| 4 | `02-design/09-sistema-dupla-partitura.md` e `10-especificacao-visual-paginas.md` | arquitetura visual por rota |
| 5 | `golden-pages/IMPLEMENTATION-AUTHORIZATION.md` e `visual-archetypes.yaml` | autorização e herança visual |
| 6 | golden reference individual aprovada | composição específica quando existir |
| 7 | painel aprovado da prancha mestra | composição canônica de arquétipo |
| 8 | tokens, motion, responsividade e QA | estados derivados e comportamento |

## Regra de herança visual

A ausência de PNG individual não autoriza improvisação e também não bloqueia o código. A página deve herdar o arquétipo indicado na matriz:

- a prancha mestra fixa a linguagem global;
- a referência individual da Aplicação fixa o padrão de página de produto e o tablet;
- os arquétipos fixam estrutura, densidade, cards, ritmo e tipos de seção;
- tokens fixam a conversão entre temas;
- regras responsivas fixam a adaptação mobile;
- especificações textuais fixam conteúdo e continuidade da pauta.

## Conflitos

- imagem não autoriza conteúdo fictício ou inacessível;
- texto controla semântica, conteúdo, segurança e comportamento;
- referência individual prevalece sobre painel da prancha somente para a página correspondente;
- arquétipo prevalece sobre preferência estética do agente;
- conflito real exige registro, não decisão silenciosa.

## Terminologia

- **approved-individual:** imagem individual aprovada;
- **approved-master-panel:** painel aprovado da prancha mestra;
- **authorized-derived:** estado autorizado por herança de arquétipo, tokens e regras;
- **golden reference:** referência de comparação, nunca asset de produção;
- **arquétipo visual:** contrato reutilizável de composição para páginas relacionadas;
- **capítulo:** rota principal da dupla partitura.
