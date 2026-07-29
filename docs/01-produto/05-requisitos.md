# Requisitos funcionais e não funcionais

## Requisitos funcionais

| ID | Requisito |
|---|---|
| RF-001 | Exibir o símbolo oficial W_Flyer no centro do header desktop. |
| RF-002 | Separar a navegação em ramo Aplicação e ramo Institucional. |
| RF-003 | Sincronizar o compasso ativo com a rota/capítulo atual. |
| RF-004 | Tratar a Home como origem das duas partituras. |
| RF-005 | Mover a transição em direção à esquerda ao avançar no ramo da aplicação. |
| RF-006 | Mover a transição em direção à direita ao avançar no ramo institucional. |
| RF-007 | Permitir navegação direta por rota sem perda de contexto. |
| RF-008 | Exibir partitura ondulada em SVG original com âncoras de continuidade. |
| RF-009 | Declarar rota anterior, seguinte, ramo, ordem e terminal em manifesto tipado. |
| RF-010 | Exibir barra dupla final após o CTA do ramo da aplicação. |
| RF-011 | Exibir barra dupla final após o contato no ramo institucional. |
| RF-012 | Fornecer experiência vertical equivalente em mobile e movimento reduzido. |
| RF-013 | Alternar entre tema claro e escuro sem alterar geometria ou layout. |
| RF-014 | Salvar preferência de tema localmente, sem banco. |
| RF-015 | Disponibilizar tablet demonstrativo em DOM na página Aplicação. |
| RF-016 | Permitir interação por mouse, toque e teclado nos controles do tablet. |
| RF-017 | Executar somente uma simulação local determinística no tablet. |
| RF-018 | Enviar contato por `POST /api/contact`. |
| RF-019 | Validar Turnstile no servidor. |
| RF-020 | Aplicar rate limit na borda. |
| RF-021 | Exibir estados de envio, sucesso e erro acessíveis. |
| RF-022 | Disponibilizar páginas legais. |
| RF-023 | Encaminhar para `app.wflyer.com.br`. |
| RF-024 | Permitir retorno à Home pelo símbolo central. |
| RF-025 | Exibir anterior/próximo em todas as páginas da linha principal. |
| RF-026 | Manter a homepage e páginas legíveis sem animação programática. |
| RF-027 | Executar a abertura oficial uma vez por sessão conforme especificação. |
| RF-028 | Tratar salto não adjacente no mesmo ramo como passagem comprimida, sem montar páginas intermediárias. |
| RF-029 | Tratar troca entre ramos como passagem pelo pivô conceitual da Home, sem conectar diretamente as duas pautas. |

## Requisitos não funcionais

| ID | Requisito |
|---|---|
| RNF-001 | Sem banco de dados ou CMS. |
| RNF-002 | Conteúdo essencial presente no HTML. |
| RNF-003 | Navegação completa por teclado. |
| RNF-004 | Respeitar `prefers-reduced-motion`. |
| RNF-005 | LCP ≤ 2,5 s, INP ≤ 200 ms e CLS ≤ 0,1 no p75. |
| RNF-006 | Sem áudio automático. |
| RNF-007 | Sem smooth scroll global. |
| RNF-008 | Sem dependências ou código do aplicativo musical. |
| RNF-009 | Sem imagens de terceiros publicadas sem licença. |
| RNF-010 | Golden references são somente referência e não entram no bundle produtivo. |
| RNF-011 | Sem Three.js, WebGL ou segundo motor de animação. |
| RNF-012 | A tela do tablet permanece DOM e semanticamente operável. |
| RNF-013 | Logs sem conteúdo pessoal integral. |
| RNF-014 | Erros públicos não revelam detalhes internos. |
| RNF-015 | Transições não bloqueiam histórico, foco ou carregamento direto. |
| RNF-016 | Nenhuma métrica, cliente, depoimento ou rede social fictícia. |
| RNF-017 | A pauta não sofre morph contínuo durante scroll ou movimento do cursor. |
| RNF-018 | Cada página final implementada deve corresponder a golden reference individual aprovada. |
| RNF-019 | A duração da transição não cresce linearmente com a distância entre capítulos. |
| RNF-020 | Carregamento direto não simula capítulos anteriores nem a passagem pela Home. |
