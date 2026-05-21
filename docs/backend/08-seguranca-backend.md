# Segurança do backend

## Princípio central

PDFs devem ser tratados como arquivos potencialmente perigosos.

## Upload

Checklist obrigatório:

- validação real de MIME;
- magic bytes;
- limite de tamanho;
- limite de páginas;
- bloqueio de PDFs criptografados se não suportados;
- rejeição de arquivos vazios;
- sanitização de filename;
- UUID interno;
- storage fora de pasta pública;
- quarentena/isolamento.

## Path traversal

Nunca concatenar path com input do usuário.

Correto:

```text
storage_key = jobs/{job_id}/original/{uuid}.pdf
```

Errado:

```text
uploads/{original_filename}
```

## Subprocessos

Regras:

- `shell=False`;
- argumentos como lista;
- timeout obrigatório;
- cwd temporário isolado;
- variáveis de ambiente mínimas;
- usuário sem privilégio;
- capturar stdout/stderr com limite;
- não logar conteúdo sensível.

## API

- Rate limiting por IP/sessão/usuário.
- CORS restritivo.
- Headers de segurança.
- Validação Pydantic em todos os payloads.
- Erros sem stacktrace.
- Correlation ID.
- Logs sem dados sensíveis.

## Download

- URLs assinadas.
- Tokens temporários.
- Validar ownership/token.
- Não expor storage path.
- Bloquear artefatos expirados.

## Workers

- Separar API e worker.
- Worker sem privilégio root.
- Limitar CPU/memória.
- Timeouts por etapa.
- Limpar temporários.
- Isolar arquivos por job.

## Logs

Não logar:

- tokens;
- URLs assinadas completas;
- conteúdo de PDFs;
- dados pessoais desnecessários;
- stacktrace em resposta pública.

Pode logar:

- job_id;
- correlation_id;
- error_code;
- etapa;
- duração;
- worker_id.

## Proteções adicionais

- Proteção contra zip bomb/PDF malicioso via limite de tamanho, páginas e timeout.
- Varredura opcional com antivírus/ClamAV em fase futura.
- CSP e headers na camada frontend/API gateway.
- Secrets via ambiente/secret manager, nunca commitados.

## Critérios de aceite

- PDF falso é rejeitado.
- Path traversal em filename não afeta storage.
- Download expirado não funciona.
- Erro público não contém stacktrace.
- Worker não usa `shell=True`.
