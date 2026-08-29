# Guia operacional para Codex

## Antes de escrever código

1. ler `AGENTS.md`;
2. confirmar `READY_FOR_IMPLEMENTATION`;
3. identificar fase e rota;
4. consultar manifesto de capítulos;
5. consultar `page-matrix.yaml` e `visual-archetypes.yaml`;
6. abrir a referência individual ou os painéis-fonte do arquétipo;
7. ler design, conteúdo, motion, segurança e QA;
8. listar arquivos, testes e riscos;
9. não instalar dependência sem autorização.

## Implementação visual

- `approved-individual`: reproduzir composição do PNG/spec;
- `approved-master-panel`: reconstruir o painel com componentes em alta resolução;
- `authorized-derived`: aplicar fielmente o arquétipo, os tokens e a especificação da página;
- não solicitar uma nova imagem quando a matriz já autorizar derivação;
- não importar `docs/design-reference/` no runtime;
- implementar estático antes de motion;
- manter a mesma geometria entre temas;
- adaptar mobile conforme regras normativas.

## Durante a implementação

- mudanças rastreáveis;
- TypeScript estrito;
- sem conteúdo fictício;
- sem segredo no cliente;
- sem rasterização da interface;
- navegação classificada como adjacente, salto comprimido, pivô Home ou neutra;
- nenhum capítulo intermediário montado em salto;
- nenhuma ligação direta entre ramos.

## Comparação e QA

1. fixar viewport, tema, conteúdo e motion;
2. capturar screenshot determinístico;
3. comparar estrutura, proporção, tipografia, cor e microdetalhes;
4. executar lint, typecheck, unitários, Storybook, Playwright, axe e Lighthouse;
5. validar claro, escuro, mobile e reduced motion;
6. registrar evidências e gate.

## Infraestrutura

- GitHub é o repositório/CI;
- Registro.br delega ao DNS autoritativo Napoleon;
- Napoleon fornece DNS autoritativo e hospedagem da origem Node.js;
- Cloudflare DNS/proxy está inativo; Turnstile permanece independente;
- preservar `app.wflyer.com.br`;
- inventário dos controles DNS/hospedagem Napoleon antes de alterações, sem
  inventar APIs, WAF, cache, redirect ou rate limit;
- secrets em GitHub Actions, com injeção explícita no runtime Napoleon;
- staging antes de produção;
- homologação por Davi Benucci.

## Execução integral

Seguir `14-contrato-execucao-integral-codex.md`. Parar somente por bloqueio externo real, conflito normativo ou falha de gate não solucionável sem decisão.
