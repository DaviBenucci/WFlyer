# Workflow OpenSpec

**Status:** OPERACIONAL
**Versão validada:** `@fission-ai/openspec 1.11.0`
**Schema padrão:** `spec-driven`
**Escopo:** changes focados do site institucional `wflyer.com.br`

## 1. Papel no projeto

OpenSpec registra a mudança imediata; não converte toda a documentação existente
nem assume precedência sobre ela. A ordem normativa de `AGENTS.md`, ADRs,
manifests, contratos, golden references e critérios de aceite continua válida.
`app.wflyer.com.br` e o aplicativo musical permanecem fora do escopo.

Mudanças não triviais usam proposal, delta specs quando há comportamento novo,
design e tasks verificáveis. Correções triviais e localizadas não precisam criar
um change apenas para satisfazer processo.

## 2. Baseline instalada

- CLI global gerenciada por pnpm: `1.11.0`;
- Node.js validado: `24.18.0`;
- raiz saudável em `openspec/`;
- contexto e regras em `openspec/config.yaml`;
- seis skills compartilhadas geradas em `.agents/skills/openspec-*`;
- `.agents/skills/.openspec-target` registra o destino Codex; as antigas cópias
  geradas em `.codex/skills/openspec-*` foram removidas sem afetar a skill
  Graphify independente;
- perfil `core`;
- templates artesanais anteriores em `openspec/templates/` preservados;
- validação estrita no job `quality` do CI.

O upgrade de manutenção 1.7.0 → 1.11.0 preservou o gerenciador pnpm e foi
feito com:

```bash
pnpm add --global @fission-ai/openspec@1.11.0
openspec update .
```

O conteúdo do change ativo permaneceu preservado durante a migração. As quatro
specs principais que antecediam a exigência de cenários do schema atual
receberam somente cenários que reiteram seus requisitos existentes.

## 3. Changes desta subetapa

### `archive/2026-07-30-bootstrap-repository-intelligence`

Change somente de tooling e documentação. Usa `skip_specs: true`; no OpenSpec
1.7 isso faz o artefato `specs` aparecer como `skipped` e permite zero delta
specs sem inventar comportamento de produto. Foi arquivado em 2026-07-30, com
17/17 tasks e todos os gates verdes, sem sincronizar specs funcionais.

### `rebuild-scroll-driven-wflyer-v2`

Change funcional ativo. Na manutenção de 2026-08-29:

- identidade e conteúdo funcional foram preservados;
- progresso permaneceu `32/45`;
- task 33, `Human-approve Score Path layouts`, permaneceu desmarcada;
- nenhum trabalho de Phase 9 foi iniciado.

Os registros arquivados abaixo permanecem históricos e não substituem o estado
do change ativo.

## 4. Fluxo operacional

Listar e inspecionar:

```bash
openspec list --json
openspec status --change <nome> --json
openspec show <nome>
```

Criar e planejar:

```bash
openspec new change <nome> --schema spec-driven --json
openspec instructions proposal --change <nome> --json
openspec instructions specs --change <nome> --json
openspec instructions design --change <nome> --json
openspec instructions tasks --change <nome> --json
```

Aplicar:

```bash
openspec instructions apply --change <nome> --json
```

Cada task muda de `- [ ]` para `- [x]` somente depois de existir implementação e
evidência verificáveis. Um arquivo existente, uma intenção ou contexto da CLI
não provam conclusão.

Validar:

```bash
openspec doctor --json
openspec validate <nome> --type change --strict --no-interactive
openspec validate <nome> --type change --strict --json --no-interactive
openspec validate --all --strict --no-interactive
```

Arquivar:

```bash
openspec archive <nome> --yes
```

Para tooling/documentação sem delta:

```bash
openspec archive <nome> --yes --skip-specs
```

Nunca usar `--no-validate` para contornar falha. Um change funcional só é
arquivado depois de decidir e verificar a sincronização de seus deltas; o change
da Fase 05 deve permanecer ativo nesta subetapa.

## 5. CI

O CI usa uma versão fixa e não modifica specs:

```bash
pnpm dlx @fission-ai/openspec@1.11.0 \
  validate --all --strict --no-interactive
```

A geração Graphify não roda em todos os pull requests. Ela permanece local e
manual porque envolve extração semântica e outputs pesados.

## 6. Atualização futura

Antes de atualizar:

1. consultar documentação e release atual;
2. manter o mesmo gerenciador global;
3. executar `openspec update .`;
4. revisar o diff das skills;
5. confirmar templates artesanais preservados;
6. validar todos os changes em modo humano e JSON;
7. atualizar o pin do CI apenas depois dos gates locais.
