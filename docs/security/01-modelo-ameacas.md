# Modelo de ameaças

## Ativos protegidos

- PDFs originais enviados pelos usuários.
- MusicXML e PDFs finais.
- Tokens temporários de download.
- Metadados de jobs.
- Dados futuros de conta.
- Métricas internas/admin.
- Infraestrutura de workers.

## Ameaças principais

### Upload malicioso

Risco: PDF explorando ferramenta de parsing/OMR/renderização.

Mitigações:

- validação real de MIME;
- limites de tamanho/páginas;
- quarentena;
- worker sem privilégio;
- subprocess com timeout;
- isolamento por job.

### Path traversal

Risco: filename com `../` gravando fora do diretório esperado.

Mitigações:

- nunca usar filename original como path;
- usar UUID;
- storage key gerada pelo servidor.

### Vazamento por URL

Risco: artefato acessível publicamente.

Mitigações:

- bucket privado;
- URLs assinadas e temporárias;
- validação de token/ownership.

### Exposição de métricas internas

Risco: usuário comum ver confidence score, erros internos ou stacktrace.

Mitigações:

- DTO público separado;
- admin API separada;
- testes de contrato.

### Abuso de processamento

Risco: usuário envia muitos jobs e consome CPU/memória.

Mitigações:

- rate limiting;
- limite de jobs simultâneos;
- quota futura;
- filas separadas;
- timeout.

### Logs sensíveis

Risco: tokens, URLs e nomes de arquivos sensíveis em logs.

Mitigações:

- mascaramento;
- política de logging;
- correlation ID sem dados sensíveis.
