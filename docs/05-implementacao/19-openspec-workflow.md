# Workflow OpenSpec

**Status:** OPERACIONAL  
**Versão validada:** `@fission-ai/openspec 1.7.0`  
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

- CLI global gerenciada por pnpm: `1.7.0`;
- Node.js validado: `24.18.0`;
- raiz saudável em `openspec/`;
- contexto e regras em `openspec/config.yaml`;
- seis skills Codex em `.codex/skills/openspec-*`;
- perfil `core`;
- templates artesanais anteriores em `openspec/templates/` preservados;
- validação estrita no job `quality` do CI.

O upgrade 1.6.0 → 1.7.0 foi feito com:

```bash
pnpm add --global @fission-ai/openspec@1.7.0
openspec update .
```

A CLI adiou, de forma segura, a limpeza dos prompts globais `opsx-*` até que
possa confirmar skills substitutas no mesmo escopo. Nenhum prompt global foi
apagado ou forçado nesta baseline.

## 3. Changes desta subetapa

### `archive/2026-07-30-bootstrap-repository-intelligence`

Change somente de tooling e documentação. Usa `skip_specs: true`; no OpenSpec
1.7 isso faz o artefato `specs` aparecer como `skipped` e permite zero delta
specs sem inventar comportamento de produto. Foi arquivado em 2026-07-30, com
17/17 tasks e todos os gates verdes, sem sincronizar specs funcionais.

### `complete-phase-05-motion-navigation`

Change funcional ativo da Fase 05. Contém:

- proposta com baseline comprovada e trabalho ausente;
- specs `score-transition-navigation` e
  `accessible-navigation-lifecycle`;
- design do shell/lifecycle persistente;
- tasks funcionais ainda desmarcadas.

Fases 0–4 são apenas evidência e pré-condição. O change não declara motion,
provider, timelines, foco ou histórico como implementados.

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
pnpm dlx @fission-ai/openspec@1.7.0 \
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
