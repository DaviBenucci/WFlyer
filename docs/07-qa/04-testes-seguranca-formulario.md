# Testes de segurança do formulário

## Entrada

- JSON inválido;
- payload > 16 KB;
- Content-Type incorreto;
- campo desconhecido;
- nome curto/longo;
- e-mail inválido;
- mensagem curta/larga;
- honeypot preenchido;
- `privacyConsent=false`;
- tentativa de HTML/script;
- CRLF em nome/e-mail;
- URL repetida/spam.

## Turnstile

- token ausente;
- token inválido;
- token expirado;
- token reutilizado;
- hostname incorreto;
- action incorreta;
- timeout da Cloudflare;
- chave de teste em ambiente de teste.

## Origem

- origem oficial;
- preview autorizado;
- origem externa;
- ausência inesperada de Origin;
- CORS preflight externo.

## Rate limit

- abaixo do limite;
- regra de rajada;
- regra de repetição;
- retorno 429/desafio;
- ausência de cache da resposta.

## E-mail

- destinatário não alterável;
- remetente não alterável;
- replyTo validado;
- template escapa HTML;
- erro do provedor não revela segredo;
- ausência de duplicação em retry indevido.
