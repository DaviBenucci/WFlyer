# Especificação visual das páginas

**Status:** NORMATIVO
**Uso:** orientar geração de referências individuais e implementação pelo Codex.

## Regras compartilhadas

Todas as páginas principais devem:

- usar o header em partitura com símbolo oficial central;
- conservar o mesmo sistema de grid, tipografia, bordas e botões da prancha mestra;
- possuir versões claro e escuro com a mesma geometria;
- mostrar somente uma página por imagem de referência, sem colagem de várias telas;
- usar português legível e conteúdo coerente com `docs/04-conteudo/`;
- declarar pontos de entrada e saída da pauta;
- reservar espaço para anterior/próximo sem parecer um carrossel genérico;
- evitar métricas, clientes, redes sociais, depoimentos ou cases fictícios;
- tratar títulos como headings editoriais e controles como interface sans-serif;
- manter notas, pautas e ícones como elementos vetoriais originais;
- não renderizar no site rótulos de apresentação como `MODO CLARO` ou o nome da prancha.

## 1. Home — origem

### Objetivo

Apresentar os dois lados da W_Flyer e permitir escolha consciente de ramo.

### Composição

- bloco da aplicação à esquerda;
- clave de sol volumétrica no centro;
- bloco institucional à direita;
- pautas saindo da clave para os dois lados;
- CTA da aplicação e CTA de serviços com peso equivalente;
- indicação discreta de exploração abaixo;
- nenhum card de serviço completo no primeiro viewport.

### Motion de referência

- handoff da logo para o header;
- desenho das duas pautas do centro para as extremidades;
- conteúdo esquerdo e direito entram em sentidos opostos;
- hover/foco enfatiza o ramo correspondente.

## 2. Aplicação W_Flyer — capítulo -1

### Referência aprovada

`golden-pages/application/application-desktop-light.png`

### Composição

- copy principal à esquerda;
- título `Sua música, em qualquer tom.` como direção aprovada de texto;
- tablet inclinado à direita, grande e legível;
- tela com uma partitura de exemplo e controles públicos;
- CTA `Acessar aplicação` e secundário `Saiba mais`;
- faixa inferior com cinco benefícios curtos;
- conexão com a Home no lado direito e saída para Como funciona no lado esquerdo.

### Tablet

- casca com profundidade e sombra;
- tela em HTML, não raster;
- inclinação suave baseada no cursor;
- controles acessíveis e simulação determinística;
- sem upload real nem processamento musical.

### Proibições

- screenshot achatado;
- efeito 3D que prejudique leitura;
- promessa de precisão absoluta;
- mostrar APIs, modelos ou pipeline interno.

## 3. Como funciona — capítulo -2

### Objetivo

Explicar o fluxo público sem revelar tecnologia interna.

### Composição recomendada

- título central ou alinhado ao eixo de leitura;
- sequência numerada em cinco etapas;
- pequeno ícone original por etapa;
- ilustração musical ou recorte ampliado da partitura no lado oposto;
- pauta conectando visualmente os números;
- anterior para Aplicação, próximo para Benefícios.

### Etapas públicas

1. inserir ou escolher uma partitura;
2. informar instrumento e tonalidade de origem;
3. escolher instrumento e tonalidade de destino;
4. visualizar o resultado e revisar;
5. exportar ou continuar no aplicativo.

Não usar termos de implementação como OCR, OMR, modelo, prompt, pipeline ou confiança interna.

## 4. Benefícios — capítulo -3, terminal

### Objetivo

Consolidar valor e conduzir ao aplicativo.

### Composição recomendada

- título e descrição curta;
- grade de seis benefícios com ícones lineares;
- benefícios concretos: tempo, clareza, adaptação entre instrumentos, revisão humana, acesso e exportação;
- CTA principal para `app.wflyer.com.br`;
- barra dupla final no extremo esquerdo após a área de CTA;
- nenhuma continuidade de pauta além da barra final.

### Proibições

- números de usuários;
- percentual de precisão;
- selo de garantia;
- testemunhos fictícios.

## 5. Empresa/Sobre — capítulo +1

### Objetivo

Apresentar origem, propósito e modo de trabalho.

### Composição recomendada

- título `Sobre a W_Flyer`;
- narrativa curta de união entre tecnologia, design e música;
- missão, visão e valores em três blocos;
- logo ou clave narrativa como elemento focal, sem competir com o header;
- sem contadores ou métricas até existirem dados verificáveis;
- pauta entra pela esquerda e sai pela direita.

## 6. Serviços — capítulo +2

### Referência na prancha mestra

Painéis claro e escuro de `Nossas soluções`.

### Composição

- quatro cards: Sites, Aplicações, Integrações e Soluções sob medida;
- ícones lineares originais;
- descrição curta, orientada a benefício;
- CTA para lista/detalhe de serviços;
- pauta passa atrás ou abaixo sem atravessar cards;
- card ativo pode elevar 4–8 px em hover, sem loop.

## 7. Processo — capítulo +3

### Objetivo

Explicar como a empresa conduz projetos. Este capítulo **não** descreve o pipeline técnico da aplicação musical.

### Etapas

1. descoberta e contexto;
2. definição de escopo e solução;
3. implementação incremental;
4. validação, entrega e evolução.

### Composição recomendada

- quatro marcos conectados pela pauta;
- texto curto abaixo de cada marco;
- entregáveis ou critérios em cards discretos;
- sem termos de OCR/OMR/transposição;
- anterior para Serviços, próximo para Portfólio.

## 8. Portfólio — capítulo +4

### Estado inicial aprovado

- mensagem honesta de projetos selecionados em breve;
- carrossel/galeria com placeholders abstratos próprios;
- produto próprio pode aparecer somente identificado como `em desenvolvimento`;
- CTA para projeto em destaque quando existir conteúdo válido;
- sem logos de clientes, métricas ou imagens fictícias.

### Motion

- cards podem responder a anterior/próximo;
- sem autoplay obrigatório;
- teclado e gestos acessíveis;
- pauta continua para Contato.

## 9. Contato — capítulo +5, terminal

### Composição

- título `Entre em contato`;
- nome, e-mail, empresa opcional, tipo de projeto, mensagem e consentimento;
- feedback acessível de envio;
- canais alternativos somente quando configurados;
- barra dupla final no extremo direito após o bloco de contato;
- rodapé aparece como cadência, sem ocultar o estado do formulário.

### Proibições

- e-mail, telefone ou rede social fictícia;
- checkbox pré-marcado;
- mensagem de sucesso sem confirmação do servidor.

## 10. Páginas de detalhe de serviço

Cada página deve conter:

- hero com nome do serviço;
- problema que resolve;
- escopo e entregáveis;
- processo específico;
- critérios de qualidade;
- CTA para contato com tipo de projeto pré-selecionado;
- retorno para `/servicos`;
- pauta local derivada do capítulo Serviços, sem alterar o grafo principal.

### Criação de sites

Foco em sites institucionais, landing pages, performance, SEO técnico e acessibilidade.

### Criação de aplicações

Foco em sistemas web, portais, dashboards e fluxos operacionais.

### Integrações

Foco em APIs, eventos, sincronização, automação e observabilidade.

### Soluções sob medida

Foco em diagnóstico, desenho, implementação e evolução de necessidades não atendidas por solução pronta.

## 11. Footer compartilhado

- disponível em todas as rotas para navegação e políticas;
- versão clara/escura coerente;
- lockup oficial e resumo curto;
- redes somente com URLs oficiais;
- em páginas intermediárias, pauta continua de forma discreta;
- em Benefícios e Contato, integra-se à barra final do ramo.


## 12. Template compartilhado de páginas legais

Aplica-se a:

- `/politica-de-privacidade`;
- `/politica-de-cookies`;
- `/termos-de-uso`;
- `/acessibilidade`.

### Composição

- header oficial simplificado;
- título, resumo e data de atualização;
- índice por âncoras;
- coluna de leitura com largura controlada;
- headings semânticos e foco visível;
- pauta decorativa discreta;
- footer compartilhado;
- nenhuma barra final da partitura principal.

O mesmo template controla as quatro rotas. O conteúdo é independente e deve ser aprovado; não inventar razão social, endereço, DPO, contatos ou obrigações específicas.

## 13. Contrato de referência

Cada página principal possui um estado em `design-reference/golden-pages/page-matrix.yaml`:

- `approved-individual`;
- `approved-master-panel`;
- `authorized-derived`.

O Codex deve usar o arquétipo indicado em `visual-archetypes.yaml`. Novos PNGs podem ser criados durante QA, mas não são obrigatórios para páginas já autorizadas por derivação.
