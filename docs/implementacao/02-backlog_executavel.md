# Backlog executável

## Legenda

```text
[P0] obrigatório para base
[P1] importante para MVP
[P2] melhoria/futuro
```

## P0 — Fundação

- [ ] Criar estrutura do repositório.
- [ ] Configurar frontend Next.js + TypeScript.
- [ ] Configurar backend FastAPI.
- [ ] Configurar Docker Compose com Postgres, Redis e storage local/MinIO.
- [ ] Criar `.env.example`.
- [ ] Configurar lint, format, typecheck e testes.
- [ ] Criar health check backend.
- [ ] Criar README técnico do repositório.

## P0 — Design base

- [ ] Implementar tokens do design system.
- [ ] Implementar AppShell.
- [ ] Implementar DesktopSidebar.
- [ ] Implementar MobileBottomNav.
- [ ] Implementar PageContainer.
- [ ] Implementar reduced motion global.

## P1 — Páginas MVP

- [ ] Home.
- [ ] Como funciona.
- [ ] Instrumentos.
- [ ] Configurações locais.
- [ ] Histórico local.
- [ ] Resultado.

## P1 — Wizard

- [ ] Estrutura do TranspositionWizard.
- [ ] Etapa Upload.
- [ ] Etapa Origem.
- [ ] Etapa Destino.
- [ ] Etapa Revisão.
- [ ] Etapa Processamento.
- [ ] Integração com API de jobs.

## P1 — Backend MVP

- [ ] Modelagem inicial.
- [ ] Alembic.
- [ ] Seed de instrumentos.
- [ ] Endpoints de instrumentos.
- [ ] Upload seguro.
- [ ] Criação de job.
- [ ] Status de job.
- [ ] Artefatos/download.
- [ ] Worker inicial.
- [ ] Cleanup de 15 dias.

## P1 — Segurança e testes

- [ ] Rate limiting.
- [ ] CORS restritivo.
- [ ] Headers de segurança.
- [ ] Testes de PDF inválido.
- [ ] Testes de path traversal.
- [ ] Testes de token inválido.
- [ ] Testes de DTO público sem campos internos.

## P2 — Futuro

- [ ] Login/cadastro.
- [ ] Dashboard.
- [ ] Histórico remoto.
- [ ] Biblioteca.
- [ ] Compartilhados.
- [ ] Push notifications.
- [ ] Admin.
- [ ] Observabilidade avançada.
