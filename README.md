# W_Flyer — documentação do site institucional

**Domínio:** `wflyer.com.br`  
**Aplicação separada:** `app.wflyer.com.br`  
**Status:** `READY_FOR_IMPLEMENTATION` — versão 1.4  
**Data-base:** 2026-07-29

Este pacote é a fonte normativa para a implementação integral do site institucional da W_Flyer. O site apresenta a empresa, os serviços, a aplicação musical em linguagem pública, o processo, o portfólio, o contato e as políticas institucionais.

O site institucional é independente do aplicativo musical. OCR/OMR, transposição real, harmonização, banco de dados e administração da aplicação não integram este repositório.

## Arquitetura de entrega

O projeto é **static-first**, mas não um `static export` puro:

- páginas, textos, imagens e políticas são gerados estaticamente no build;
- não há banco, CMS, autenticação ou painel administrativo na versão inicial;
- somente `POST /api/contact` exige runtime Node.js;
- o código fica no GitHub e é implantado como aplicação Node.js na Napoleon;
- Cloudflare permanece como DNS, proxy, HTTPS, WAF, rate limit e Turnstile;
- não utilizar VPS, EasyPanel ou Docker como requisito de produção;
- `app.wflyer.com.br` permanece separado e intocável.

## Referências visuais autorizadas

O Codex deve usar os exemplos já aprovados como sistema visual, e não aguardar 60 screenshots independentes:

1. `docs/design-reference/golden-pages/master/wflyer-approved-master-board.png` define a identidade global e os painéis aprovados;
2. `docs/design-reference/golden-pages/application/application-desktop-light.png` define a página Aplicação e o tablet;
3. `docs/design-reference/golden-pages/visual-archetypes.yaml` define como as demais páginas herdam composição;
4. `docs/02-design/10-especificacao-visual-paginas.md` define conteúdo e estrutura por rota;
5. tokens, motion e responsividade completam os estados escuros e mobile.

As imagens nunca podem ser usadas como background, textura, mapa de cliques ou frontend. A implementação deve ser semântica e original.

## Decisões visuais consolidadas

- símbolo oficial centralizado no header desktop;
- Home como origem de duas partituras;
- ramo da aplicação: Aplicação → Como funciona → Benefícios → app → barra final;
- ramo institucional: Empresa → Serviços → Processo → Portfólio → Contato → barra final;
- tablet em DOM com CSS 3D limitado e GSAP;
- temas claro e escuro com a mesma geometria;
- mobile derivado das regras normativas, sem copiar literalmente a composição desktop.

## Dados de publicação

- contato público: `davi.benucci@wflyer.com.br`;
- destinatário do formulário: `davi.benucci@wflyer.com.br`;
- Instagram: `https://www.instagram.com/davibenucci/`;
- GitHub: `https://github.com/DaviBenucci`;
- portfólio inicial: W_Flyer, `msndistribuidora.com.br` e `msnsuprimentos.com.br`;
- analytics: desabilitado na versão inicial;
- homologação: Davi Benucci.

## Leitura obrigatória

1. [`AGENTS.md`](AGENTS.md)
2. [`PRE-CODE-STATUS.md`](PRE-CODE-STATUS.md)
3. [`docs/00-governanca/00-fonte-da-verdade.md`](docs/00-governanca/00-fonte-da-verdade.md)
4. [`docs/00-governanca/01-bloqueio-tecnologico.md`](docs/00-governanca/01-bloqueio-tecnologico.md)
5. [`docs/00-governanca/08-decisoes-operacionais-publicacao.md`](docs/00-governanca/08-decisoes-operacionais-publicacao.md)
6. [`docs/design-reference/golden-pages/IMPLEMENTATION-AUTHORIZATION.md`](docs/design-reference/golden-pages/IMPLEMENTATION-AUTHORIZATION.md)
7. [`docs/design-reference/golden-pages/visual-archetypes.yaml`](docs/design-reference/golden-pages/visual-archetypes.yaml)
8. [`docs/02-design/09-sistema-dupla-partitura.md`](docs/02-design/09-sistema-dupla-partitura.md)
9. [`docs/02-design/10-especificacao-visual-paginas.md`](docs/02-design/10-especificacao-visual-paginas.md)
10. [`docs/03-motion/03-catalogo-animacoes.md`](docs/03-motion/03-catalogo-animacoes.md)
11. [`docs/05-implementacao/14-contrato-execucao-integral-codex.md`](docs/05-implementacao/14-contrato-execucao-integral-codex.md)
12. [`docs/05-implementacao/16-github-actions-secrets-napoleon.md`](docs/05-implementacao/16-github-actions-secrets-napoleon.md)
13. [`docs/07-qa/05-criterios-aceite.md`](docs/07-qa/05-criterios-aceite.md)

## Regra de implementação

O estado `READY_FOR_IMPLEMENTATION` autoriza o Codex a percorrer todas as fases. A ausência de uma referência individual adicional não é bloqueio quando a página estiver marcada como `authorized-derived` na matriz. O Codex só interrompe por impedimento externo real, conflito normativo, falha de segurança/teste ou ausência de credencial necessária para publicar.
