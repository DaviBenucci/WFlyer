# Controles de segurança

## DNS e hospedagem ativos

- Registro.br delega ao DNS autoritativo Napoleon;
- Napoleon hospeda o processo Node.js standalone;
- HTTPS, redirects, cache e controles de rede são aceitos somente após
  inventário e evidência dos recursos Napoleon;
- WAF, rate limit e proteção de bots não são presumidos como ativos;
- Cloudflare DNS/proxy/WAF não faz parte do caminho ativo;
- Cloudflare Turnstile permanece independente.

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
- artefato standalone e dependências reconstruídos após atualização;
- deploy da Napoleon identificado por commit/tag;
- secrets apenas em GitHub Actions/Napoleon, nunca no repositório.
