# Sistema de dupla partitura

**Status:** NORMATIVO

## 1. Modelo espacial

A composição possui uma origem e dois eixos narrativos:

```text
                   RAMO DA APLICAÇÃO
barra final ← Benefícios ← Como funciona ← Aplicação ← HOME → Empresa → Serviços → Processo → Portfólio → Contato → barra final
                                                     RAMO INSTITUCIONAL
```

A leitura conceitual parte da Home. A direção comunica categoria e progresso; não define a ordem DOM nem obriga arraste horizontal.

## 2. Contrato de capítulo

Toda rota principal deve corresponder a um registro do manifesto:

```ts
type ScoreBranch = "application" | "institutional";

type ScoreChapter = {
  id: string;
  route: string;
  branch: ScoreBranch | "origin";
  order: number;
  coordinate: number;
  previous: string | null;
  next: string | null;
  activeHeaderItem: string;
  entryEdge: "left" | "right" | "center";
  exitEdge: "left" | "right" | "center";
  entryAnchorY: number;
  exitAnchorY: number;
  terminal: boolean;
  finalBarline: boolean;
};
```

O manifesto normativo está em `05-implementacao/11-manifesto-capitulos-partitura.yaml`.

## 3. Home/origem

- `branch: origin`;
- `coordinate: 0`;
- não possui anterior nem seguinte único;
- oferece duas escolhas equivalentes;
- a clave narrativa origina as pautas;
- o símbolo oficial permanece no header;
- a escolha do ramo é explícita por link/CTA.

## 4. Ramo da aplicação

### Ordem

1. Aplicação;
2. Como funciona;
3. Benefícios;
4. CTA externo para o aplicativo;
5. barra final.

### Orientação

- retorno à Home/rota anterior no lado direito;
- avanço para o próximo capítulo no lado esquerdo;
- a sensação narrativa é de câmera avançando para a esquerda;
- visualmente, o conteúdo atual se desloca para a direita e o próximo capítulo entra pela esquerda;
- a transição de retorno inverte esses sentidos.

### Terminal

Benefícios contém o CTA principal para `app.wflyer.com.br`. A barra final aparece depois da área de decisão, sem sugerir que o aplicativo faz parte do mesmo domínio ou runtime.

## 5. Ramo institucional

### Ordem

1. Empresa;
2. Serviços;
3. Processo;
4. Portfólio;
5. Contato;
6. barra final.

### Orientação

- retorno à Home/rota anterior no lado esquerdo;
- avanço para o próximo capítulo no lado direito;
- a sensação narrativa é de câmera avançando para a direita;
- visualmente, o conteúdo atual se desloca para a esquerda e o próximo capítulo entra pela direita;
- a transição de retorno inverte esses sentidos.

### Terminal

Contato encerra o ramo após formulário, estado de sucesso/erro e canais alternativos válidos. A barra final não pode substituir o feedback do formulário.

## 6. Páginas auxiliares

Detalhes de serviço, políticas e acessibilidade não alteram a ordem da partitura principal.

- recebem `branchContext` para manter tema e navegação;
- usam pauta local, sem fingir um novo capítulo;
- exibem retorno explícito ao capítulo de origem;
- não exibem barra final da jornada principal.

## 7. Tipos de deslocamento entre capítulos

A continuidade não autoriza tratar qualquer link como se os dois capítulos fossem vizinhos:

- **adjacente no mesmo ramo:** usa a conexão completa entre a âncora de saída e a âncora de entrada;
- **salto no mesmo ramo:** usa uma passagem comprimida na direção correta, sem renderizar nem simular a leitura das páginas intermediárias;
- **troca de ramo:** recua visualmente até o eixo central da Home e emerge no ramo oposto, usando o símbolo/clave como pivô narrativo;
- **carregamento direto:** não executa viagem fictícia; a página abre no estado final;
- **rota auxiliar:** usa transição neutra curta e mantém retorno explícito ao capítulo pai.

A troca de ramo não conecta diretamente a pauta da aplicação à pauta institucional. Conceitualmente, toda mudança entre ramos passa pela origem, mesmo quando a Home não é montada como página intermediária.

## 8. Continuidade

A continuidade deve existir em três níveis:

1. **visual:** entrada e saída da pauta usam âncoras compatíveis;
2. **narrativo:** título e CTA conectam o assunto anterior ao seguinte;
3. **motion:** a transição preserva direção e revela o próximo segmento.

Não é obrigatório manter um único SVG montado entre rotas. É obrigatório que a passagem pareça uma única composição.

## 9. Estado sem JavaScript

- páginas renderizam em fluxo vertical normal;
- links funcionam como navegação convencional;
- pauta aparece estática;
- anterior/próximo continua disponível;
- nenhuma informação depende do frame de transição.

## 10. Estado de movimento reduzido

- sem viagem lateral extensa;
- crossfade curto ou troca direta;
- pauta estática no estado final;
- direção comunicada por rótulos, ordem e controles;
- barra final permanece visível.
