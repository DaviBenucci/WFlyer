# Requisitos funcionais e não funcionais

## Requisitos funcionais

| ID | Requisito |
|---|---|
| RF-001 | Exibir marca textual W_Flyer sem logotipo definitivo. |
| RF-002 | Separar navegação em grupo Aplicação e grupo Empresa. |
| RF-003 | Sincronizar compasso ativo com a seção atual. |
| RF-004 | Mover a composição para a esquerda ao descer e para a direita ao subir. |
| RF-005 | Permitir navegação direta por âncora sem perda de contexto. |
| RF-006 | Exibir partitura ondulada em SVG original. |
| RF-007 | Fornecer experiência vertical equivalente em mobile e movimento reduzido. |
| RF-008 | Alternar entre tema claro e escuro. |
| RF-009 | Salvar preferência de tema localmente, sem banco. |
| RF-010 | Enviar contato por `POST /api/contact`. |
| RF-011 | Validar Turnstile no servidor. |
| RF-012 | Aplicar rate limit na borda. |
| RF-013 | Exibir estados de envio, sucesso e erro acessíveis. |
| RF-014 | Disponibilizar páginas legais. |
| RF-015 | Encaminhar para `app.wflyer.com.br`. |

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
| RNF-008 | Sem dependências da aplicação musical. |
| RNF-009 | Sem imagens de terceiros publicadas sem licença. |
| RNF-010 | Logs sem conteúdo pessoal integral. |
| RNF-011 | Erros públicos não revelam detalhes internos. |
| RNF-012 | O site continua utilizável sem animação programática. |
