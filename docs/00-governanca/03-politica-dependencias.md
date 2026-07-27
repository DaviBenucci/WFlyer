# Política de dependências

## Regras

- usar versão exata, sem `^` ou `~`;
- manter `pnpm-lock.yaml` versionado;
- instalar somente dependências listadas no manifesto tecnológico;
- preferir APIs nativas do navegador a pacotes auxiliares;
- verificar licença, manutenção e tamanho antes de qualquer inclusão;
- proibir dependência que replique função já coberta pela stack;
- carregar GSAP e módulos de experiência somente em componentes cliente necessários;
- carregar Turnstile apenas quando a seção de contato estiver próxima do viewport;
- não adicionar pacote apenas para uma função trivial.

## Atualização

Atualizações de segurança têm prioridade, mas exigem:

1. branch de manutenção;
2. leitura do changelog e advisory;
3. testes unitários, E2E, visuais e Lighthouse;
4. verificação do formulário;
5. registro da versão anterior e posterior;
6. rollback documentado.
