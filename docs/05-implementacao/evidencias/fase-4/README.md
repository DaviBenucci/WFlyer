# Evidências visuais — Fase 4

Capturas locais geradas em 2026-07-30 com Chromium e o pacote standalone de
produção do Next.js. O script reproduzível é
`scripts/capture-phase4-evidence.mjs`.

## Matrizes completas

As quatro matrizes registram o primeiro viewport das 16 rotas da Fase 4, na
ordem normativa: oito páginas principais, quatro detalhes de serviço e quatro
páginas legais.

- `matrix-desktop-light.png`: 16 rotas em 1536 × 1024, tema claro;
- `matrix-desktop-dark.png`: as mesmas rotas e geometrias, tema escuro;
- `matrix-mobile-light.png`: 16 rotas em 390 × 844, tema claro;
- `matrix-mobile-dark.png`: as mesmas rotas em fluxo mobile escuro.

Cada painel da matriz é um viewport real carregado do standalone. Os testes
automatizados complementam as matrizes verificando toda a altura das páginas,
zero overflow e igualdade geométrica entre os temas. As matrizes usam
`prefers-reduced-motion: reduce` para registrar também a variante acessível e
manter a captura determinística.

## Capturas detalhadas

- `application-desktop-light.png`: comparação direta do arquétipo
  `product-demo` com a referência individual aprovada, no mesmo viewport
  1536 × 1024 e com a preferência de movimento padrão, preservando a
  inclinação canônica do tablet;
- `application-mobile-dark.png`: ordem copy → CTAs → tablet DOM no mobile;
- `how-it-works-mobile-light.png`: sequência vertical das cinco etapas;
- `benefits-desktop-dark.png`: primeiro viewport 1536 × 1024 da grade de seis
  benefícios;
- `company-mobile-light.png`: hero editorial e missão, visão e valores;
- `services-desktop-light.png`: primeiro viewport com CTA e quatro cards
  canônicos com ícones lineares, na ordem do painel aprovado
  cards → CTA → pauta;
- `process-desktop-light.png`: primeiro viewport com quatro marcos conectados
  pela pauta;
- `portfolio-desktop-dark.png`: primeiro viewport com três projetos oficiais
  e arte abstrata original;
- `contact-desktop-light.png`: primeiro viewport da composição em duas
  colunas, com shell honesto do formulário e canais;
- `service-detail-mobile-light.png`: detalhe derivado sem capítulo falso;
- `legal-mobile-dark.png`: template legal, índice e coluna de leitura.

## Proveniência e limites

As imagens deste diretório são evidências de QA, não novas golden references.
Nenhuma delas é importada pelo frontend. A prancha mestra e a Aplicação
aprovada foram usadas somente para comparação visual; copy e fatos seguem a
documentação editorial.

As capturas desktop detalhadas usam exatamente 1536 × 1024 para permitir
comparação direta de composição e densidade. As capturas mobile detalhadas são
full-page para registrar a ordem completa do fluxo vertical. Exceto pela
captura desktop da Aplicação, feita com a preferência padrão para expor sua
inclinação autorizada, as capturas detalhadas também usam movimento reduzido.

O tablet permanece uma composição estática em HTML/SVG nesta fase e recebe
interação determinística na Fase 6. O formulário permanece visualmente
indisponível, sem simular envio, até a implementação segura da Fase 8.
