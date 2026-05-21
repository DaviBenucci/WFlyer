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

## Estrutura

```text
docs/
  00-visao-geral/       Decisões principais, roadmap, stack e glossário
  pages/                Especificação detalhada de cada página
  frontend/             Layout, navegação, design system e acessibilidade
  features/             Funcionalidades transversais do produto
  backend/              API, workers, banco, filas, storage e admin
  security/             Modelo de ameaças e checklist de segurança
  qa/                   Estratégia de testes e regressão
  implementacao/        Guia para Codex e arquivo implementacao_IA
  logs/                 Arquivos que devem ser atualizados durante o desenvolvimento
```

## Ordem recomendada de leitura pelo Codex

Antes de escrever qualquer código, o Codex deve ler nesta ordem:

1. `docs/implementacao/00-guia_de_implementacao.md`
2. `docs/implementacao/01-implementacao_IA.md`
3. `docs/00-visao-geral/01-decisoes-arquiteturais.md`
4. `docs/frontend/05-design-system.md`
5. `docs/frontend/01-layout-responsivo.md`
6. `docs/pages/02-transpor.md`
7. `docs/backend/01-visao-geral.md`
8. `docs/backend/08-seguranca-backend.md`
9. `docs/qa/01-estrategia-testes.md`
10. `docs/logs/IMPLEMENTATION_LOG.md`

## Regra de manutenção documental

Qualquer alteração em comportamento, rota, contrato de API, regra de negócio, banco, segurança, teste ou componente visual deve atualizar também a documentação correspondente e os logs em `docs/logs/`.

## Entregáveis principais

- Guia de implementação: `docs/implementacao/00-guia_de_implementacao.md`
- Arquivo operacional para IA: `docs/implementacao/01-implementacao_IA.md`
- Backlog executável: `docs/implementacao/02-backlog_executavel.md`
- Checklist Codex: `docs/implementacao/03-checklist_codex.md`
- Estratégia de testes: `docs/qa/01-estrategia-testes.md`
- Checklist de segurança: `docs/security/02-checklist-seguranca.md`
