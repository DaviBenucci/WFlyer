# Controles de segurança

## Borda

- Cloudflare proxy;
- HTTPS;
- WAF;
- rate limiting específico;
- proteção de bots disponível no plano;
- cache somente onde seguro.

## Aplicação

- método e Content-Type restritos;
- payload máximo;
- validação de origem;
- Zod;
- Turnstile server-side;
- hostname/action verificados;
- timeouts de chamadas externas;
- resposta genérica;
- `Cache-Control: no-store` no endpoint;
- sem anexos;
- sem HTML do usuário.

## Segredos

- nunca usar `NEXT_PUBLIC_` em segredo;
- separar por ambiente;
- rotacionar após exposição;
- não imprimir em logs;
- não incluir em screenshots ou fixtures;
- usar chaves de teste em CI quando necessário.

## Supply chain

- versões exatas;
- lockfile;
- revisão de scripts de instalação;
- dependências mínimas;
- atualização rápida de patches de segurança;
- imagem Docker reconstruída após atualização.
