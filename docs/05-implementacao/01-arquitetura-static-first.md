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
├── assets estáticos
└── POST /api/contact (dinâmico)
        ↓
Resend
```

## Renderização

- páginas institucionais: static generation;
- MDX: compilado no build;
- dados de navegação: objetos TypeScript locais;
- homepage: HTML estático + ilhas cliente para tema, menu e experiência GSAP;
- contato: formulário cliente + Route Handler Node.js;
- nenhuma leitura de banco ou CMS.

## Cache

- HTML estático com política de cache compatível com deploy versionado;
- assets com hash e cache longo;
- `/api/contact` com `Cache-Control: no-store`;
- respostas de erro do contato não devem ser cacheadas.

## Tema

- preferência em `localStorage`;
- fallback para `prefers-color-scheme`;
- script mínimo antes da pintura para evitar flash;
- nenhuma dependência de cookie servidor.
