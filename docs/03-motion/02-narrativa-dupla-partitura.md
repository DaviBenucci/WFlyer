# Narrativa de dupla partitura

**Status:** NORMATIVO

## Princípio

A direção espacial comunica o ramo e o progresso, enquanto o scroll vertical continua controlando a leitura dentro de cada página.

```text
ramo da aplicação:   HOME → deslocamento narrativo para a esquerda
ramo institucional: HOME → deslocamento narrativo para a direita
```

Não existe uma única trilha gigante com todas as páginas montadas simultaneamente.

## Home

A Home é estável. O movimento inicial ocorre apenas no handoff da abertura e na escolha do ramo:

1. símbolo chega ao header;
2. compassos crescem para os lados;
3. clave narrativa surge no centro;
4. pauta esquerda e direita são desenhadas;
5. conteúdo de cada lado entra;
6. hover/foco pode enfatizar um ramo;
7. clique inicia a transição direcional.

## Avanço no ramo da aplicação

```text
Aplicação (-1) → Como funciona (-2) → Benefícios (-3)
```

- a página atual se afasta em direção à direita do viewport;
- a próxima página entra pela esquerda;
- a pauta parece continuar para a esquerda;
- o link de retorno usa o sentido inverso;
- a transição termina antes de o conteúdo exigir leitura.

## Avanço no ramo institucional

```text
Empresa (+1) → Serviços (+2) → Processo (+3) → Portfólio (+4) → Contato (+5)
```

- a página atual se afasta em direção à esquerda do viewport;
- a próxima página entra pela direita;
- a pauta parece continuar para a direita;
- o link de retorno usa o sentido inverso.

## Modos de navegação

### Capítulos adjacentes no mesmo ramo

Aplicar a transição completa de continuidade, com segmento temporário ligando as âncoras previstas no manifesto.

### Salto não adjacente no mesmo ramo

Não montar páginas intermediárias. Usar uma passagem comprimida na direção do destino, com marcas de compasso ou notas atravessando a camada persistente em quantidade limitada. A duração continua dentro do limite global; ela não cresce proporcionalmente ao número de capítulos ignorados.

### Troca entre ramos

A Home é o único ponto de conexão conceitual. A transição possui duas fases sobrepostas:

1. o ramo de origem recua em direção ao centro;
2. o ramo de destino emerge do centro para o lado correto.

O símbolo do header permanece estável e pode receber apenas uma resposta curta de ênfase. A Home não precisa ser renderizada como página intermediária, e nenhuma pauta deve atravessar diretamente de um ramo ao outro.

### Carregamento direto e rotas auxiliares

Carregamento direto abre a página no estado final. Rotas auxiliares usam transição neutra curta, sem fingir posição própria na composição principal.

## Profundidade de movimento

A transição não deve deslizar uma página inteira como um carrossel genérico. O alvo é uma sensação de câmera acompanhando a pauta:

- deslocamento principal: 8–18% da largura do viewport;
- opacidade coordenada, sem desaparecer no primeiro frame;
- leve parallax entre pauta, conteúdo e notas;
- duração alvo: 620–820 ms;
- máximo absoluto: 900 ms antes de liberar a nova página;
- nenhuma rotação de conteúdo textual.

## Continuidade da pauta

Durante a troca:

1. capturar posição da âncora de saída;
2. exibir segmento de conexão na camada persistente;
3. animar notas para fora da página atual;
4. alinhar com a âncora de entrada da nova página;
5. revelar a pauta local da nova rota;
6. remover o segmento temporário.

A transição deve funcionar mesmo se o segmento temporário falhar: a nova página aparece estática.

## Scroll local

Dentro de cada página:

- conteúdo usa fluxo vertical nativo;
- ScrollTrigger pode revelar seções e cards;
- nenhum pin extenso é obrigatório;
- o scroll não decide automaticamente o ramo;
- ao fim da página, anterior/próximo e CTA deixam a próxima ação explícita.

## Navegação por header

Ao selecionar um compasso:

1. localizar capítulo de origem e destino;
2. calcular direção pelas coordenadas;
3. se origem ou destino não pertencer à linha principal, usar transição neutra curta;
4. atualizar URL e foco de forma acessível;
5. restaurar scroll no topo da nova página, salvo comportamento de histórico documentado;
6. não executar viagem lateral em reduced motion.

## Histórico

- `Back` usa direção oposta ao avanço quando origem e destino são conhecidos;
- `Forward` repete a direção canônica;
- recarregar mantém apenas a rota, não o estado intermediário da timeline;
- âncoras internas não disparam transição de capítulo.

## Falha segura

Sem JavaScript ou com erro de motion:

- links navegam normalmente;
- conteúdo aparece em fluxo vertical;
- header indica a rota;
- pauta fica no estado estático final;
- barra final permanece nos terminais.
