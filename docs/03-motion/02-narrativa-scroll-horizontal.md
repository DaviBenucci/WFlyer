# Narrativa de scroll horizontal

## Mapeamento

O usuário usa scroll vertical. No desktop, o progresso desloca a trilha horizontalmente.

```text
scroll para baixo → scoreTrack.x diminui → conteúdo avança para a direita
scroll para cima  → scoreTrack.x aumenta → conteúdo retorna para a esquerda
```

## Cena

- trigger: contêiner da experiência;
- pin: viewport da experiência;
- scrub inicial: `0.6`;
- início: `top top`;
- fim: calculado pela largura total da trilha menos a largura do viewport;
- atualização do header: rótulos de timeline ou interseções lógicas;
- sem snap obrigatório na primeira versão.

## Sequência

1. aplicação;
2. como funciona;
3. benefícios;
4. centro W_Flyer;
5. empresa;
6. serviços;
7. transição para fluxo vertical.

## Navegação por link

Ao selecionar um compasso:

1. resolver o progresso da seção;
2. converter em posição vertical da cena;
3. usar scroll nativo para o destino;
4. atualizar URL com hash;
5. manter foco e histórico;
6. não executar animação longa quando movimento reduzido estiver ativo.

## Falha segura

Sem JavaScript, os capítulos devem aparecer em fluxo vertical ou em uma estrutura linear compreensível. O HTML não pode depender da posição `x` para existir.
