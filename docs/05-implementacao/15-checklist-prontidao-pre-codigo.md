# Checklist de prontidão antes do código definitivo

**Historical checkpoint:** `READY_FOR_IMPLEMENTATION`

This file preserves the pre-code authorization checkpoint. It is not the
current release or deployment contract. Current GitHub Environment ownership,
Napoleon Node.js build/runtime configuration, and external evidence are defined
in `16-github-actions-secrets-napoleon.md`,
`22-napoleon-node-runtime-runbook.md`, and the Phase 09 QA reports.

## A. Design e referências

- [x] identidade oficial aprovada;
- [x] prancha mestra aprovada;
- [x] Aplicação desktop claro aprovada individualmente;
- [x] arquitetura de dupla partitura aprovada;
- [x] arquétipos visuais definidos;
- [x] matriz sem estados bloqueadores;
- [x] tema escuro autorizado por tokens e painéis canônicos;
- [x] mobile autorizado pelas regras responsivas;
- [x] motion e reduced motion documentados;
- [x] tablet documentado.

## B. Conteúdo

- [x] base editorial aprovada;
- [x] e-mail público e destinatário definidos;
- [x] redes sociais definidas;
- [x] portfólio inicial definido;
- [x] URL do aplicativo definida;
- [x] analytics desabilitado;
- [x] políticas com requisitos e dados de contato definidos;
- [x] proibição de métricas e claims inventados.

## C. Infraestrutura

- [x] Cloudflare e DNS existentes;
- [x] aplicação separada protegida;
- [x] origem definida como Napoleon;
- [x] repositório definido como GitHub;
- [x] VPS e EasyPanel excluídos;
- [x] build Node.js standalone definido;
- [x] estratégia de staging e rollback documentada;
- [x] inventário Cloudflare classificado como gate de publicação, não de código.

## D. Segredos e serviços

- [x] nomes das variáveis definidos;
- [x] nomes e escopos dos valores do GitHub Environment documentados;
- [x] configuração independente de build/runtime na Napoleon documentada;
- [x] e-mail remetente/destinatário definido;
- [ ] valores reais Turnstile e Resend cadastrados — gate de staging/produção;
- [x] nenhuma credencial de deploy Napoleon é inventada: a integração confirmada
  usa Git pull/build e a configuração do painel permanece um gate externo.

## E. Engenharia

- [x] stack, fases, componentes, QA e segurança definidos;
- [x] contrato integral definido;
- [x] responsável pela homologação: Davi Benucci;
- [x] autorização de implementação registrada.

## Regra

Os itens de credencial não impedem o Codex de concluir o código. Impedem somente testes externos finais e publicação. O Codex deve chegar até o ponto de deploy e emitir bloqueio objetivo caso o secret ainda não exista.
