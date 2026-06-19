# Frontend — Guia detalhado de implementação

## Objetivo do frontend

O frontend do WFlyer deve oferecer uma experiência responsiva, acessível, musical e profissional para o fluxo principal:

```text
Upload de PDF -> seleção de instrumento de origem -> seleção de instrumento de destino -> revisão -> processamento -> resultado -> download
```

O frontend final deve consumir contratos reais do backend e não deve implementar regra sensível de segurança sozinho.

## Regra de ordem

O frontend final só pode começar depois que o backend MVP estiver concluído e validado.

Antes disso, é permitido apenas um frontend simples de verificação, com rotas debug, usado para comprovar que banco, API, storage, fila, worker e downloads funcionam.

## Frontend simples de verificação

### Objetivo

Provar integração real com backend antes do polimento visual.

### Rotas permitidas

```text
/debug/health
/debug/instruments
/debug/upload
/debug/transposition
/debug/jobs
/debug/artifacts
```

### Deve testar

- `/health`;
- listagem de instrumentos vinda do banco;
- upload real;
- criação de job;
- polling de status;
- listagem de artefatos;
- download temporário.

### Não deve implementar

- design final;
- animações;
- wizard definitivo;
- PWA definitivo;
- histórico local final;
- compartilhados reais;
- login;
- admin;
- dashboard.

## Frontend final

Após backend MVP e contratos congelados, o frontend final deve implementar:

- design system;
- AppShell;
- DesktopSidebar;
- MobileBottomNav;
- páginas do MVP;
- wizard de transposição;
- integração real com API;
- histórico local;
- estados de erro/loading/empty;
- acessibilidade;
- responsividade;
- PWA/local cache quando definido.

## Stack recomendada

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
Framer Motion
Lucide React
React Hook Form
Zod
TanStack Query
Dexie/IndexedDB
Service Worker/PWA
Vitest/Jest
Testing Library
Playwright
```

## Estrutura recomendada

```text
apps/web/
  app/
    layout.tsx
    page.tsx
    transpor/
      page.tsx
    resultado/
      [jobId]/
        page.tsx
    como-funciona/
      page.tsx
    instrumentos/
      page.tsx
    historico/
      page.tsx
    configuracoes/
      page.tsx
    debug/
      health/
      instruments/
      upload/
      transposition/
      jobs/
      artifacts/
  src/
    components/
      layout/
        AppShell.tsx
        DesktopSidebar.tsx
        MobileBottomNav.tsx
        PageContainer.tsx
      ui/
      wizard/
      feedback/
    features/
      transposition/
      instruments/
      history/
      settings/
    lib/
      api/
        client.ts
        errors.ts
        instruments.ts
        uploads.ts
        jobs.ts
        artifacts.ts
      schemas/
        instrument.schema.ts
        upload.schema.ts
        job.schema.ts
        artifact.schema.ts
        error.schema.ts
      storage/
        indexedDb.ts
      security/
        tokenStorage.ts
    styles/
      globals.css
      tokens.css
    tests/
```

A estrutura pode variar, mas deve manter separação entre UI, features, contratos e integração com API.

## Princípios do frontend

1. **Não confiar em validação local.** O backend valida de verdade.
2. **Não armazenar secrets.** Token temporário deve ser tratado com cuidado.
3. **Não logar token.**
4. **Não exibir métricas internas.**
5. **Não mostrar stacktrace.**
6. **Não criar contrato novo sem documentação.**
7. **Não começar telas futuras como recurso real no MVP.**
8. **Acessibilidade e responsividade são requisitos de aceite.**
9. **Animações devem respeitar reduced motion.**
10. **Estados de erro precisam ser claros e seguros.**

## Contratos com API

O frontend deve validar respostas com Zod ou estratégia equivalente.

DTOs mínimos:

```text
InstrumentDTO
UploadDTO
PublicJobDTO
ArtifactDTO
ErrorDTO
```

O frontend deve tratar:

- erro de rede;
- erro de schema;
- PDF inválido;
- PDF grande demais;
- job falhou;
- job expirou;
- token inválido;
- download indisponível;
- backend offline;
- timeout de polling.

## Cliente HTTP

O cliente HTTP deve:

- configurar base URL por variável pública segura;
- enviar headers necessários;
- propagar correlation ID quando aplicável;
- tratar `ErrorDTO`;
- não registrar token em console;
- não transformar erro interno em mensagem técnica para usuário;
- ser testável.

Exemplo conceitual de erro público:

```text
Não foi possível processar esta partitura. Tente outro arquivo ou revise a origem selecionada.
```

Evitar:

```text
Worker failed at /tmp/jobs/... stacktrace...
```

## TanStack Query e estado assíncrono

Usar TanStack Query para:

- instrumentos;
- upload mutation;
- criação de job;
- polling de job;
- artefatos;
- download metadata.

Política recomendada de polling:

```text
1s durante os primeiros 10s
2s até 60s
5s após 60s
parar em completed, failed, cancelled ou expired
```

O polling deve parar ao desmontar componente, ao finalizar job ou ao receber erro irrecuperável.

## Wizard de transposição

### Etapas

```text
1. Upload
2. Instrumento de origem
3. Instrumento de destino
4. Revisão
5. Processamento
6. Resultado
```

### Upload

Responsabilidades:

- aceitar PDF por clique ou drag/drop;
- mostrar nome e tamanho;
- validar extensão/tamanho como UX;
- enviar para backend;
- exibir erro público;
- não prometer segurança baseada no cliente.

### Origem

Responsabilidades:

- listar instrumentos da API;
- permitir busca por nome e alias;
- exibir família;
- indicar suporte;
- impedir instrumento não suportado.

### Destino

Responsabilidades:

- listar instrumentos da API;
- permitir busca por nome e alias;
- impedir destino inválido;
- mostrar explicação simples da transposição quando possível.

### Revisão

Responsabilidades:

- exibir arquivo;
- origem;
- destino;
- intervalo calculado quando disponível;
- retenção de 15 dias;
- aviso de conferência musical.

### Processamento

Responsabilidades:

- criar job;
- iniciar polling;
- mostrar progresso e etapa atual;
- mostrar mensagens seguras;
- lidar com retry visual sem reenviar arquivo automaticamente de forma perigosa.

### Resultado

Responsabilidades:

- mostrar origem/destino;
- mostrar transposição aplicada;
- listar artefatos;
- permitir download temporário;
- informar expiração;
- permitir novo processamento.

## Design system

### Tom visual

- profissional;
- musical;
- discreto;
- limpo;
- responsivo;
- acessível.

### Cores

Manter gradiente principal:

```text
linear-gradient(135deg, #7C3AED, #2563EB)
```

Usos:

- CTA principal;
- item ativo;
- progresso;
- destaques sutis;
- hero.

### Componentes base

```text
Button
Card
Input
Select/Combobox
Badge
Progress
Toast
Dialog
Tabs/Chips
Skeleton
Alert
Tooltip
FileDropzone
InstrumentCard
JobStatusTimeline
ArtifactList
```

### Estados obrigatórios

Cada componente de fluxo deve suportar:

- default;
- hover;
- focus-visible;
- disabled;
- loading;
- error;
- success quando aplicável;
- empty quando aplicável.

## Layout responsivo

### Desktop

- sidebar fixa/recolhida;
- expansão por hover/focus;
- conteúdo com margem segura;
- foco visível;
- navegação por teclado.

### Mobile

- bottom navigation fixa;
- safe-area respeitada;
- padding inferior no conteúdo;
- trilho ativo;
- comportamento previsível com teclado virtual.

### Tablet

- layout intermediário;
- evitar componentes largos demais;
- manter fluxo do wizard legível.

## Acessibilidade

Requisitos mínimos:

- labels em inputs;
- foco visível;
- navegação por teclado;
- contraste validado;
- `aria-live` para progresso do job;
- mensagens de erro associadas aos campos;
- botões com nomes acessíveis;
- drag/drop com alternativa por input;
- reduced motion;
- headings em ordem coerente.

## Histórico local

O MVP sem login pode manter histórico local com IndexedDB.

Guardar apenas metadados não sensíveis:

```text
job_id
original_filename seguro
source_instrument_id
target_instrument_id
status
created_at
expires_at
completed_at
artifact kinds disponíveis
```

Evitar guardar:

- PDF original;
- MusicXML;
- token em claro de longo prazo;
- storage key;
- métricas internas;
- stacktrace.

Se for necessário guardar token temporário para retomar download, documentar risco e limitar a retenção local.

## PWA/offline

Funcionalidade PWA deve ser conservadora:

- cachear assets estáticos;
- não cachear PDF do usuário;
- não cachear resposta com token sem decisão;
- indicar offline;
- permitir histórico local mesmo sem API;
- bloquear upload quando offline.

## Segurança no frontend

O frontend deve:

- tratar token como dado sensível;
- evitar `console.log` de payload completo;
- não expor variáveis privadas;
- usar apenas variáveis públicas permitidas;
- validar schemas recebidos;
- mostrar mensagens públicas seguras;
- não confiar em valores do cliente para autorização;
- não construir URL de storage manualmente.

## Testes frontend

### Unitários

- componentes base;
- schemas Zod;
- helpers de API;
- cálculo visual de estados;
- histórico local.

### Integração

- wizard com API mockada;
- erro de upload;
- job completed;
- job failed;
- job expired;
- token inválido.

### E2E

- fluxo completo com backend real/local;
- responsividade mobile;
- navegação por teclado;
- download;
- histórico local.

### Acessibilidade

- foco;
- labels;
- aria-live no progresso;
- contraste;
- reduced motion.

## Critérios de aceite do frontend final

O frontend final está concluído quando:

- backend MVP já estava validado antes do início;
- contratos API estão documentados e validados;
- telas MVP estão implementadas;
- wizard funciona com backend real;
- estados de erro/loading/empty existem;
- responsividade foi verificada;
- acessibilidade básica foi verificada;
- histórico local não vaza dados sensíveis;
- download temporário funciona;
- nenhuma métrica interna aparece para usuário comum;
- testes/lint/typecheck/build foram executados;
- documentação e logs foram atualizados.

## Fora do MVP frontend

Não implementar como recurso real antes de decisão explícita:

- login;
- dashboard autenticado;
- biblioteca remota;
- compartilhamento público real;
- push notifications reais;
- admin completo;
- pagamentos;
- planos;
- moderação pública.
