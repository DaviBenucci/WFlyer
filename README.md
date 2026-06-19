# WFlyer — Documentação modular do projeto

Este pacote divide a documentação do WFlyer em arquivos menores, com foco em orientar a implementação futura por IA/Codex sem perda de contexto.

A nova versão do WFlyer deve ser planejada do zero. O código antigo não deve ser reaproveitado como base técnica. Ele pode servir apenas como referência conceitual quando houver algo útil de produto.

## Objetivo do produto

O WFlyer será uma aplicação web/mobile capaz de receber uma partitura em PDF e gerar uma nova versão transposta para outro instrumento, alterando:

- notas;
- acordes;
- armadura de clave;
- acidentes locais;
- tonalidade escrita;
- partes musicais quando houver múltiplos instrumentos.

Exemplo principal:

```text
Piano em C maior, som real/concert pitch
Destino: Trompete Bb
written_to_concert do piano = 0
written_to_concert do trompete Bb = -2
intervalo = 0 - (-2) = +2 semitons
Resultado escrito: C maior -> D maior
```

## Princípios obrigatórios

1. Começar pelo MVP sem login.
2. Processamento musical sempre assíncrono no backend.
3. PDFs tratados como arquivos potencialmente perigosos.
4. Banco guarda metadados; arquivos ficam em storage.
5. Arquivos expiram no servidor após 15 dias.
6. Métricas de confiança não aparecem para usuário comum.
7. Interface deve ser responsiva, acessível, musical, profissional e discreta.
8. Codex deve implementar em etapas pequenas, testadas e documentadas.
9. Codex só pode avançar para a próxima etapa quando a etapa anterior estiver `CONCLUIDA`.
10. Banco de dados e backend devem ser implementados antes do frontend final.
11. Antes do frontend final, só é permitido frontend simples de verificação do backend.

## Regra rígida para Codex

O guia principal está em:

```text
docs/implementacao/00-guia_de_implementacao.md
```

A regra central é:

```text
Nenhuma etapa seguinte pode começar enquanto a etapa anterior não estiver CONCLUIDA.
```

Se ocorrer imprevisto, o Codex deve criar sub-etapa na etapa atual, corrigir, validar, registrar em log e somente então continuar.

## Ordem macro de implementação

```text
1. Escopo, documentação e governança.
2. Estrutura do repositório.
3. Docker Compose, Postgres, Redis e storage.
4. Banco de dados, migrations e seeds.
5. Backend base.
6. Backend de instrumentos, upload, jobs, fila, worker e pipeline musical.
7. Frontend simples de verificação do backend.
8. Hardening e testes do backend.
9. Congelamento de contratos API.
10. Frontend final.
11. Integração ponta a ponta.
12. QA, segurança, documentação e entrega.
```

## Estrutura

```text
docs/
  00-visao-geral/       Decisões principais, roadmap, stack e glossário
  pages/                Especificação detalhada de cada página
  frontend/             Layout, navegação, design system, acessibilidade e guia detalhado
  features/             Funcionalidades transversais do produto
  backend/              API, workers, banco, filas, storage, admin e guia detalhado
  security/             Modelo de ameaças e checklist de segurança
  qa/                   Estratégia de testes e regressão
  implementacao/        Guia para Codex e arquivo implementacao_IA
  logs/                 Arquivos que devem ser atualizados durante o desenvolvimento
```

## Ordem recomendada de leitura pelo Codex

Antes de escrever qualquer código, o Codex deve ler nesta ordem:

1. `README.md`
2. `docs/implementacao/00-guia_de_implementacao.md`
3. `docs/implementacao/01-implementacao_IA.md`
4. `docs/implementacao/02-backlog_executavel.md`
5. `docs/implementacao/03-checklist_codex.md`
6. `docs/implementacao/05-definition_of_done.md`
7. `docs/00-visao-geral/01-decisoes-arquiteturais.md`
8. `docs/00-visao-geral/04-stack-recomendada.md`
9. `docs/backend/01-visao-geral.md`
10. `docs/backend/15-guia_detalhado_backend.md`
11. `docs/frontend/09-guia_detalhado_frontend.md`
12. `docs/security/02-checklist-seguranca.md`
13. `docs/qa/01-estrategia-testes.md`
14. `docs/logs/IMPLEMENTATION_LOG.md`
15. `docs/logs/TEST_LOG.md`
16. `docs/logs/DECISIONS.md`

## Documentos principais atualizados

- Guia de implementação detalhado: `docs/implementacao/00-guia_de_implementacao.md`
- Instruções operacionais para IA: `docs/implementacao/01-implementacao_IA.md`
- Backlog executável por fases/etapas: `docs/implementacao/02-backlog_executavel.md`
- Checklist Codex: `docs/implementacao/03-checklist_codex.md`
- Definition of Done: `docs/implementacao/05-definition_of_done.md`
- Guia detalhado backend: `docs/backend/15-guia_detalhado_backend.md`
- Guia detalhado frontend: `docs/frontend/09-guia_detalhado_frontend.md`
- Estratégia de testes: `docs/qa/01-estrategia-testes.md`
- Checklist de segurança: `docs/security/02-checklist-seguranca.md`

## Regra de manutenção documental

Qualquer alteração em comportamento, rota, contrato de API, regra de negócio, banco, segurança, teste ou componente visual deve atualizar também a documentação correspondente e os logs em `docs/logs/`.

## Status atual

A documentação foi reforçada para que o Codex implemente o projeto de forma sequencial, começando por banco/backend, validando cada etapa individualmente, registrando status e usando sub-etapas para qualquer imprevisto.
