# Acessibilidade

## Objetivo

Garantir que o WFlyer possa ser usado por teclado, leitores de tela e usuários com sensibilidade a movimento.

## Requisitos globais

- H1 único por página.
- Ordem de foco lógica.
- Área de toque mínima de 44x44px.
- Contraste adequado.
- `aria-current="page"` em navegação ativa.
- `aria-live` para erros e progresso relevante.
- Labels em todos os inputs.
- Não depender apenas de cor.
- Suporte a `prefers-reduced-motion`.

## Wizard

- Stepper deve informar etapa atual em texto.
- Erros devem ser associados ao campo/componente.
- Dropzone deve aceitar Enter/Espaço.
- Progresso deve ter valor textual.

## Upload

- Dropzone com botão alternativo: `Selecionar PDF`.
- Mensagem de formato e limite clara.
- Erro anunciado via `aria-live`.

## Bottom navigation

- Botões com `aria-label`.
- Aba ativa com `aria-current="page"`.
- Logo com label `Ir para início`.
- Rastro musical `aria-hidden="true"`.

## Redução de movimento

Quando `prefers-reduced-motion` estiver ativo:

- remover rastro musical;
- reduzir transição de cortina;
- evitar spring/bounce;
- manter feedback visual simples.

## Testes

- Navegar a aplicação só com teclado.
- Verificar labels com leitor de tela.
- Rodar auditoria com axe ou Lighthouse.
- Simular `prefers-reduced-motion`.
