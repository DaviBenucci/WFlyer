# Observabilidade e incidentes

## Sinais mínimos

- disponibilidade;
- latência e erros do endpoint de contato;
- taxa de sucesso do Turnstile;
- taxa agregada de falha do Resend;
- eventos de rate limit na Cloudflare;
- Core Web Vitals;
- erros de frontend sem conteúdo pessoal.

## Alertas

- pico de 5xx em `/api/contact`;
- falha contínua de Turnstile;
- falha do provedor de e-mail;
- aumento incomum de bloqueios;
- regressão de LCP/INP/CLS;
- expiração de domínio/certificado/chaves.

## Incidente

1. identificar alcance;
2. desabilitar temporariamente o formulário se necessário;
3. preservar o site estático;
4. rotacionar segredo comprometido;
5. restaurar versão anterior;
6. registrar causa e correção;
7. revisar controles.
