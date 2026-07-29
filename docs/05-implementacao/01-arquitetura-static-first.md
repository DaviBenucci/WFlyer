# Arquitetura static-first

## Definição

O conteúdo é estático, mas o projeto não usa `output: "export"` na primeira versão porque o formulário depende de um Route Handler.

```text
Cloudflare
├── cache de páginas e assets
├── WAF
├── rate limit
└── Turnstile
        ↓
Next.js standalone
├── páginas estáticas geradas no build
├── layout persistente da experiência
├── ilhas cliente de tema, menu, motion e tablet
└── POST /api/contact (dinâmico)
        ↓
Resend
```

## Renderização

- páginas principais e de serviço: static generation;
- páginas legais: static generation;
- MDX: compilado no build;
- manifesto de capítulos: objeto TypeScript gerado/validado a partir do YAML normativo;
- header e conteúdo base: server/static sempre que possível;
- transições de capítulo: Client Component pequeno no layout compartilhado;
- tablet demonstrativo: Client Component isolado, sem chamadas de rede;
- contato: formulário cliente + Route Handler Node.js;
- nenhuma leitura de banco ou CMS.

## Rotas e experiência

Cada rota principal existe independentemente para SEO, acessibilidade e carregamento direto. A continuidade da partitura é uma camada de apresentação progressiva, não uma dependência para renderizar o conteúdo.

Sem JavaScript:

- cada URL continua acessível;
- links anterior/próximo funcionam;
- pauta aparece estática;
- tablet mostra estado ilustrativo não interativo ou controles degradados de forma compreensível;
- formulário deve informar indisponibilidade de envio se a hidratação necessária falhar.

## Cache

- HTML estático com política de cache compatível com deploy versionado;
- assets com hash e cache longo;
- `/api/contact` com `Cache-Control: no-store`;
- respostas de erro do contato não devem ser cacheadas;
- golden references nunca são copiadas para `public/` nem entregues pelo site.

## Tema

- preferência em `localStorage`;
- fallback para `prefers-color-scheme`;
- script mínimo antes da pintura para evitar flash;
- nenhuma dependência de cookie servidor;
- layout e âncoras da pauta são idênticos nos dois temas.
