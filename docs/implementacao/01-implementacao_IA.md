# implementação_IA — Instruções operacionais para Codex

## Papel da IA

Você é a IA implementadora do WFlyer. Sua função é transformar a documentação em código seguro, testado e bem organizado, sem inventar comportamento fora do escopo.

## Regras obrigatórias

### 1. Leia antes de implementar

Antes de qualquer tarefa, leia:

```text
docs/implementacao/00-guia_de_implementacao.md
docs/implementacao/01-implementacao_IA.md
docs/logs/IMPLEMENTATION_LOG.md
docs/logs/DECISIONS.md
docs/logs/TEST_LOG.md
```

Depois leia os documentos específicos da área que será alterada.

### 2. Não alucine contratos

Não invente endpoints, campos, tabelas, status, rotas ou componentes sem consultar a documentação.

Se faltar informação:

- escolher a opção mais conservadora;
- registrar a lacuna em `docs/logs/DECISIONS.md` como `PENDENTE`;
- criar item em `docs/implementacao/02-backlog_executavel.md` se necessário.

### 3. Não misture fases sem necessidade

O MVP é sem login.

Não implementar login, planos, biblioteca, compartilhados reais, admin completo ou push real antes da base do MVP, salvo quando a tarefa pedir explicitamente.

### 4. Segurança acima de conveniência

Nunca:

- processar PDF pesado dentro da request HTTP;
- usar `shell=True`;
- salvar PDF no banco;
- expor storage path;
- logar token;
- mostrar confidence score para usuário comum;
- confiar apenas em validação frontend.

### 5. Implementação incremental

Para cada tarefa:

```text
1. Resumir objetivo da tarefa.
2. Identificar arquivos/documentos relevantes.
3. Implementar menor mudança funcional.
4. Rodar testes/lint/typecheck/build aplicáveis.
5. Corrigir falhas.
6. Atualizar logs e documentação.
7. Registrar pendências reais.
```

### 6. Testes obrigatórios

Sempre que criar ou alterar código, executar os testes relacionados.

Mínimo esperado quando disponível:

```text
npm/pnpm lint
npm/pnpm typecheck
npm/pnpm test
npm/pnpm build
pytest
alembic check ou migração equivalente
```

Se um comando não existir, registre no log e crie tarefa para adicioná-lo.

### 7. Controle de side-effects

Antes de finalizar:

- verificar importações quebradas;
- verificar rotas alteradas;
- verificar DTOs alterados;
- verificar testes impactados;
- verificar responsividade se UI mudou;
- verificar segurança se upload/download/API mudou.

### 8. Logs obrigatórios

Atualizar `docs/logs/IMPLEMENTATION_LOG.md` com:

```text
Data
Objetivo
Arquivos alterados
Resumo técnico
Testes executados
Resultado
Pendências
```

Atualizar `docs/logs/TEST_LOG.md` com comandos e resultados.

Atualizar `docs/logs/DECISIONS.md` quando houver decisão nova.

Atualizar `docs/logs/CHANGELOG.md` quando comportamento mudar.

### 9. Mensagens públicas seguras

Erros exibidos ao usuário devem ser claros e seguros.

Bom:

```text
Ocorreu um acidente na leitura da partitura.
Não foi possível concluir a transposição deste arquivo.
```

Ruim:

```text
Audiveris subprocess failed at /tmp/jobs/abc with stacktrace...
```

### 10. Contratos públicos

Endpoints públicos não devem retornar campos internos/admin.

Proibido em DTO público:

```text
confidence_score_omr
internal_error_message
worker_id
storage_key
stacktrace
signed_url permanente
token em claro desnecessário
```

### 11. Definição de pronto

Uma tarefa só está pronta quando:

- código implementado;
- testes aplicáveis executados;
- documentação atualizada;
- logs atualizados;
- sem pendência crítica oculta;
- riscos conhecidos registrados.

## Checklist rápido antes de finalizar resposta ao usuário

- [ ] A mudança segue o MVP?
- [ ] Segurança de upload/download preservada?
- [ ] Testes rodaram?
- [ ] Logs atualizados?
- [ ] Documentação atualizada?
- [ ] Alguma decisão nova foi registrada?
- [ ] Não há confidence score público?
- [ ] Não há processamento pesado na request?
