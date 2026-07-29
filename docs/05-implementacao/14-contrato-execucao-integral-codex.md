# Contrato de execução integral pelo Codex

## 1. Autorização

O projeto está em `READY_FOR_IMPLEMENTATION`. O Codex pode implementar o site do início ao fim sem aguardar novas imagens, desde que use a matriz e os arquétipos aprovados.

## 2. Paradas permitidas

O Codex só deve parar por:

- segredo ou acesso externo indispensável para publicar/testar serviço real;
- conflito normativo verdadeiro;
- falha de segurança, acessibilidade ou QA que não possa ser corrigida sem decisão;
- alteração destrutiva de infraestrutura;
- decisão jurídica não técnica.

A falta de PNG individual não é bloqueio quando a matriz indicar `authorized-derived`.

## 3. Git e branches

```text
main
  └── develop/site-institucional
        ├── feature/fase-0-foundation
        ├── feature/fase-1-design-system
        ├── feature/fase-2-pages
        ├── feature/fase-3-motion
        ├── feature/fase-4-contact-security
        └── release/site-v1
```

- GitHub é o repositório oficial;
- não modificar repositório da aplicação;
- `main` recebe somente release homologada;
- produção é identificada por commit/tag.

## 4. Ordem obrigatória

1. validar documentação, manifests e referências;
2. criar Next.js, TypeScript, pnpm, lint e CI;
3. criar design system, tokens e componentes;
4. implementar rotas e conteúdo;
5. implementar header, Home e partitura estática;
6. implementar páginas por arquétipo;
7. implementar responsividade e temas;
8. implementar transições GSAP;
9. implementar tablet;
10. implementar abertura da marca;
11. implementar contato, Turnstile e Resend;
12. configurar segurança, SEO e políticas;
13. executar QA completo;
14. preparar build standalone para Napoleon;
15. publicar staging;
16. obter homologação de Davi Benucci;
17. publicar produção e testar rollback.

## 5. Definition of Done

- todas as rotas existem;
- todos os estados visuais seguem referência ou arquétipo;
- claro/escuro e desktop/mobile validados;
- dupla partitura e barras finais funcionam;
- tablet é DOM e determinístico;
- abertura é pulável e acessível;
- formulário funciona sem persistência;
- Turnstile e WAF ativos;
- e-mail chega a `davi.benucci@wflyer.com.br`;
- portfólio contém apenas os três projetos aprovados;
- Instagram e GitHub corretos;
- nenhum analytics instalado;
- build standalone funciona na Napoleon;
- Cloudflare e `app.wflyer.com.br` permanecem íntegros;
- homologação registrada;
- rollback testado.

## 6. Relatório por fase

Registrar arquivos, comandos, testes, screenshots, diffs, acessibilidade, performance, riscos, commit e gate.

## 7. Prompt inicial

O prompt ao Codex deve ordenar:

1. leitura de `AGENTS.md` e `PRE-CODE-STATUS.md`;
2. uso obrigatório dos exemplos atuais e dos arquétipos;
3. execução sequencial até o final;
4. armazenamento de secrets fora do Git;
5. deploy Napoleon/GitHub atrás da Cloudflare;
6. preservação de `app.wflyer.com.br`;
7. parada somente por bloqueio externo real.
