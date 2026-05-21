# WFlyer — Regra universal de transposição entre instrumentos

## 1. Objetivo

Este documento define a regra musical universal que o motor de transposição do WFlyer deve seguir.

A transposição **não deve depender da tonalidade da música estar em C maior**.

O sistema deve funcionar para qualquer tonalidade escrita, qualquer armadura de clave e qualquer par de instrumentos suportados.

A regra principal é:

```text
A distância entre dois instrumentos transpositores permanece a mesma,
independentemente da tonalidade em que a partitura foi escrita.
```

Portanto, se uma partitura está escrita para um instrumento de origem em qualquer tonalidade, o WFlyer deve calcular a distância em semitons entre o instrumento de origem e o instrumento de destino e aplicar essa diferença à partitura inteira.

---

## 2. Princípio musical

Cada instrumento deve possuir uma propriedade chamada:

```text
written_to_concert
```

Essa propriedade representa quantos semitons o som real fica distante da nota escrita.

Exemplo:

```text
Piano:
Quando lê C, soa C.
written_to_concert = 0
```

```text
Trompete Bb:
Quando lê C, soa Bb.
written_to_concert = -2
```

```text
Sax Alto Eb:
Quando lê C, soa Eb.
written_to_concert = -9
```

```text
Trompa F:
Quando lê C, soa F.
written_to_concert = -7
```

Essa propriedade pertence ao **instrumento**, não à tonalidade da música.

---

## 3. Separação obrigatória de conceitos

O WFlyer deve tratar separadamente:

```text
1. Instrumento de origem
2. Instrumento de destino
3. Tonalidade escrita da partitura
4. Armadura de clave escrita
5. Intervalo de transposição entre instrumentos
```

Essas informações não podem ser confundidas.

### Exemplo importante

Uma partitura para Trompete Bb escrita em E maior significa:

```text
Instrumento: Trompete Bb
Tonalidade escrita: E maior
Armadura: F#, C#, G#, D#
```

Isso **não** significa que o instrumento é “Trompete em E”.

A tonalidade da partitura não altera a afinação/transposição fixa do instrumento.

---

## 4. Fórmula universal

O intervalo que deve ser aplicado à partitura escrita deve ser calculado assim:

```text
intervalo_escrito = origem.written_to_concert - destino.written_to_concert
```

Onde:

```text
origem.written_to_concert = distância entre a nota escrita e o som real do instrumento original

destino.written_to_concert = distância entre a nota escrita e o som real do instrumento de destino
```

O resultado é o intervalo, em semitons, que deve ser aplicado às notas e à tonalidade escrita da partitura original.

---

## 5. Regra geral de aplicação

Depois de calcular o intervalo, o sistema deve aplicar essa diferença a:

```text
- notas;
- acordes;
- armadura de clave;
- tonalidade escrita;
- acidentes locais;
- partes musicais;
- vozes internas;
- cifras, quando suportadas;
- metadados musicais relevantes.
```

O sistema não deve apenas alterar o nome do instrumento no cabeçalho.

Ele deve realmente transformar a partitura musical.

---

## 6. Tonalidade natural C não é pré-requisito

O sistema não deve assumir que toda partitura começa em C maior.

A tonalidade pode ser:

```text
C maior
D maior
E maior
F maior
G maior
A maior
B maior
Db maior
Eb maior
Gb maior
Ab maior
Bb maior
C menor
D menor
E menor
F# menor
C# menor
qualquer outra tonalidade suportada
```

A regra permanece a mesma.

Exemplo:

```text
Se a distância entre o instrumento de origem e o instrumento de destino for -2 semitons,
a partitura deve descer 2 semitons independentemente de estar em C, E, Ab, F# ou qualquer outro tom.
```

---

## 7. Exemplos práticos

### 7.1 Trompete Bb escrito em C maior para Piano

```text
Origem: Trompete Bb
written_to_concert: -2
Destino: Piano
written_to_concert: 0

intervalo_escrito = -2 - 0 = -2
```

Resultado:

```text
C maior escrito para Trompete Bb
→ Bb maior para Piano
```

---

### 7.2 Trompete Bb escrito em E maior para Piano

```text
Origem: Trompete Bb
written_to_concert: -2
Destino: Piano
written_to_concert: 0

intervalo_escrito = -2 - 0 = -2
```

Resultado:

```text
E maior escrito para Trompete Bb
→ D maior para Piano
```

Armaduras:

```text
Origem: E maior = F#, C#, G#, D#
Destino: D maior = F#, C#
```

---

### 7.3 Piano escrito em D maior para Trompete Bb

```text
Origem: Piano
written_to_concert: 0
Destino: Trompete Bb
written_to_concert: -2

intervalo_escrito = 0 - (-2) = +2
```

Resultado:

```text
D maior no Piano
→ E maior para Trompete Bb
```

---

### 7.4 Sax Alto Eb escrito em G maior para Piano

```text
Origem: Sax Alto Eb
written_to_concert: -9
Destino: Piano
written_to_concert: 0

intervalo_escrito = -9 - 0 = -9
```

Resultado:

```text
G maior escrito para Sax Alto Eb
→ Bb maior para Piano
```

Observação:

```text
O sistema pode normalizar o intervalo para uma oitava equivalente quando necessário,
mas deve preservar o registro musical adequado do instrumento.
```

---

### 7.5 Piano escrito em Bb maior para Sax Alto Eb

```text
Origem: Piano
written_to_concert: 0
Destino: Sax Alto Eb
written_to_concert: -9

intervalo_escrito = 0 - (-9) = +9
```

Resultado:

```text
Bb maior no Piano
→ G maior para Sax Alto Eb
```

---

### 7.6 Trompa F escrita em C maior para Piano

```text
Origem: Trompa F
written_to_concert: -7
Destino: Piano
written_to_concert: 0

intervalo_escrito = -7 - 0 = -7
```

Resultado:

```text
C maior escrito para Trompa F
→ F maior para Piano
```

---

### 7.7 Piano escrito em F maior para Trompa F

```text
Origem: Piano
written_to_concert: 0
Destino: Trompa F
written_to_concert: -7

intervalo_escrito = 0 - (-7) = +7
```

Resultado:

```text
F maior no Piano
→ C maior para Trompa F
```

---

## 8. Catálogo obrigatório de instrumentos

O Codex deve implementar um catálogo de instrumentos com, no mínimo:

```text
id
nome
família
written_to_concert
clave padrão
aliases
transposição de oitava, quando existir
registro confortável opcional
status de suporte
```

Exemplo conceitual:

```ts
{
  id: "trumpet_bb",
  name: "Trompete Bb",
  family: "metais",
  written_to_concert: -2,
  default_clef: "treble",
  aliases: ["trompete bb", "trumpet in bb", "trumpet b flat"],
  octave_adjustment: 0,
  supported: true
}
```

```ts
{
  id: "piano",
  name: "Piano",
  family: "teclas",
  written_to_concert: 0,
  default_clef: "grand_staff",
  aliases: ["piano", "keyboard"],
  octave_adjustment: 0,
  supported: true
}
```

```ts
{
  id: "alto_sax_eb",
  name: "Sax Alto Eb",
  family: "madeiras",
  written_to_concert: -9,
  default_clef: "treble",
  aliases: ["sax alto", "alto sax", "alto saxophone eb"],
  octave_adjustment: 0,
  supported: true
}
```

---

## 9. Instrumentos em oitava

Alguns instrumentos não apenas transpõem por intervalo, mas também são escritos uma oitava diferente do som real.

Exemplos comuns:

```text
Violão: soa uma oitava abaixo do escrito.
Contrabaixo: soa uma oitava abaixo do escrito.
Flautim/Piccolo: soa uma oitava acima do escrito.
```

Esses casos devem ser modelados explicitamente.

O sistema deve diferenciar:

```text
transposição de classe de altura
transposição de oitava
```

Exemplo de campos:

```text
written_to_concert
concert_octave_offset
notation_octave_policy
```

Para o MVP, é permitido priorizar instrumentos de transposição simples, mas a arquitetura não pode impedir suporte futuro a instrumentos em oitava.

---

## 10. Armadura de clave

A armadura de clave final deve ser recalculada a partir da tonalidade transposta.

O sistema não deve copiar a armadura original.

Fluxo correto:

```text
1. identificar tonalidade escrita original;
2. calcular intervalo entre origem e destino;
3. transpor tonalidade;
4. escolher grafia tonal adequada;
5. gerar nova armadura;
6. aplicar acidentes locais coerentes.
```

Exemplo:

```text
Origem: Trompete Bb em E maior
Destino: Piano
Intervalo: -2
Resultado: D maior
Armadura: F#, C#
```

---

## 11. Enarmonia e legibilidade

O motor deve evitar tonalidades teoricamente corretas, mas ilegíveis.

Exemplo:

```text
A# maior
```

Pode ser teoricamente possível, mas normalmente deve ser preferido:

```text
Bb maior
```

O sistema deve usar uma política de grafia musical que priorize tonalidades comuns.

Preferir:

```text
C, G, D, A, E, B, F#, F, Bb, Eb, Ab, Db, Gb
```

Evitar, quando houver equivalente mais legível:

```text
A#, D#, G#, Cb, Fb, E#, B#
```

Essa política deve ser testada.

---

## 12. Acidentes locais

Acidentes locais devem ser recalculados depois da transposição.

O sistema deve:

```text
1. transpor a altura musical;
2. decidir a grafia correta da nota;
3. comparar com a armadura final;
4. manter acidentes cromáticos necessários;
5. remover acidentes redundantes;
6. preservar intenção harmônica quando possível.
```

A transposição não pode ser apenas visual.

Ela deve operar sobre a representação musical estruturada, preferencialmente MusicXML ou estrutura equivalente.

---

## 13. MusicXML como representação intermediária

O fluxo recomendado é:

```text
PDF
↓
OMR
↓
MusicXML intermediário
↓
Transposição musical estruturada
↓
MusicXML final
↓
PDF final
```

A transposição deve ocorrer sobre o MusicXML ou sobre uma estrutura musical equivalente, não diretamente sobre pixels do PDF.

---

## 14. Requisitos funcionais

```text
RF-MUS-001
O sistema deve calcular a distância em semitons entre instrumento de origem e instrumento de destino usando written_to_concert.
```

```text
RF-MUS-002
O sistema deve aplicar o intervalo calculado à partitura inteira, independentemente da tonalidade escrita original.
```

```text
RF-MUS-003
O sistema deve recalcular armadura de clave e tonalidade final após a transposição.
```

```text
RF-MUS-004
O sistema deve recalcular acidentes locais conforme a nova tonalidade.
```

```text
RF-MUS-005
O sistema deve diferenciar instrumento transpositor de tonalidade escrita da música.
```

```text
RF-MUS-006
O sistema não deve assumir que a partitura original está em C maior.
```

```text
RF-MUS-007
O sistema deve suportar múltiplos instrumentos desde que estejam cadastrados no catálogo com written_to_concert correto.
```

```text
RF-MUS-008
O sistema deve registrar no job o instrumento de origem, instrumento de destino, intervalo aplicado, tonalidade detectada e tonalidade resultante.
```

---

## 15. Critérios de aceite

### CA-001 — Independência da tonalidade

Dado qualquer instrumento de origem e destino,

Quando a partitura estiver em qualquer tonalidade,

Então o sistema deve aplicar a mesma distância entre instrumentos.

Exemplo:

```text
Trompete Bb → Piano = -2 semitons
```

Deve valer para:

```text
C maior → Bb maior
E maior → D maior
Ab maior → Gb maior
F# maior → E maior
```

---

### CA-002 — Não confundir tonalidade com instrumento

Dado uma partitura para Trompete Bb escrita em E maior,

Quando o sistema processar a partitura,

Então ele deve reconhecer:

```text
instrumento = Trompete Bb
tonalidade escrita = E maior
```

E não:

```text
instrumento = Trompete em E
```

---

### CA-003 — Recalcular armadura

Dado uma transposição com intervalo calculado,

Quando a tonalidade final for determinada,

Então a armadura final deve corresponder à tonalidade transposta.

---

### CA-004 — Preservar estrutura musical

A transposição deve preservar:

```text
- ritmo;
- compassos;
- pausas;
- articulações;
- dinâmicas;
- ligaduras;
- repetições;
- vozes;
- partes;
- layout quando possível.
```

---

## 16. Testes obrigatórios

### 16.1 Trompete Bb para Piano em múltiplas tonalidades

```text
Origem: Trompete Bb
Destino: Piano
Intervalo esperado: -2 semitons
```

Casos:

```text
C maior → Bb maior
D maior → C maior
E maior → D maior
F maior → Eb maior
G maior → F maior
A maior → G maior
Bb maior → Ab maior
Eb maior → Db maior
```

---

### 16.2 Piano para Trompete Bb em múltiplas tonalidades

```text
Origem: Piano
Destino: Trompete Bb
Intervalo esperado: +2 semitons
```

Casos:

```text
C maior → D maior
D maior → E maior
E maior → F# maior
F maior → G maior
G maior → A maior
Bb maior → C maior
Eb maior → F maior
```

---

### 16.3 Sax Alto Eb para Piano

```text
Origem: Sax Alto Eb
Destino: Piano
Intervalo esperado: -9 semitons
```

Casos:

```text
C maior escrito → Eb maior real
G maior escrito → Bb maior real
D maior escrito → F maior real
A maior escrito → C maior real
```

---

### 16.4 Piano para Sax Alto Eb

```text
Origem: Piano
Destino: Sax Alto Eb
Intervalo esperado: +9 semitons
```

Casos:

```text
Eb maior real → C maior escrito
Bb maior real → G maior escrito
F maior real → D maior escrito
C maior real → A maior escrito
```

---

### 16.5 Trompa F para Piano

```text
Origem: Trompa F
Destino: Piano
Intervalo esperado: -7 semitons
```

Casos:

```text
C maior escrito → F maior real
G maior escrito → C maior real
D maior escrito → G maior real
F maior escrito → Bb maior real
```

---

### 16.6 Piano para Trompa F

```text
Origem: Piano
Destino: Trompa F
Intervalo esperado: +7 semitons
```

Casos:

```text
F maior real → C maior escrito
C maior real → G maior escrito
G maior real → D maior escrito
Bb maior real → F maior escrito
```

---

## 17. Teste obrigatório do caso citado

Este caso deve existir nos testes para evitar regressão.

```text
Origem: Trompete Bb
Tonalidade escrita: E maior
Armadura original: F#, C#, G#, D#
Destino: Piano
Intervalo esperado: -2 semitons
Tonalidade final esperada: D maior
Armadura final esperada: F#, C#
```

Notas da escala:

```text
E  → D
F# → E
G# → F#
A  → G
B  → A
C# → B
D# → C#
```

---

## 18. Pseudocódigo conceitual

```ts
function calculateWrittenInterval(sourceInstrument, targetInstrument) {
  return sourceInstrument.written_to_concert - targetInstrument.written_to_concert
}

function transposeScore(score, sourceInstrument, targetInstrument) {
  const interval = calculateWrittenInterval(sourceInstrument, targetInstrument)

  const sourceKey = detectWrittenKey(score)
  const targetKey = transposeKey(sourceKey, interval)
  const normalizedTargetKey = normalizeEnharmonicKey(targetKey)

  const transposedScore = transposeNotesAndChords(score, interval, normalizedTargetKey)

  transposedScore.keySignature = buildKeySignature(normalizedTargetKey)
  transposedScore.metadata.sourceInstrument = sourceInstrument.id
  transposedScore.metadata.targetInstrument = targetInstrument.id
  transposedScore.metadata.appliedInterval = interval
  transposedScore.metadata.sourceKey = sourceKey
  transposedScore.metadata.targetKey = normalizedTargetKey

  return transposedScore
}
```

---

## 19. Dados mínimos no job

Cada job de transposição deve armazenar:

```text
source_instrument_id
target_instrument_id
source_written_to_concert
target_written_to_concert
transpose_interval
source_detected_key
target_key
source_key_signature
target_key_signature
engine_version
```

Esses dados ajudam a validar, auditar e depurar a transposição.

---

## 20. Erros que o Codex deve evitar

```text
1. Assumir que toda partitura está em C maior.
2. Confundir tonalidade da música com afinação do instrumento.
3. Copiar a armadura original sem recalcular.
4. Transpor notas sem atualizar armadura.
5. Atualizar armadura sem transpor notas.
6. Ignorar acidentes locais.
7. Implementar regras fixas apenas para Trompete Bb.
8. Criar if/else para cada tonalidade manualmente.
9. Criar if/else para cada par de instrumentos manualmente.
10. Não testar fluxo inverso.
```

A implementação correta deve ser orientada por dados:

```text
instrument_catalog + written_to_concert + fórmula universal
```

---

## 21. Onde referenciar este documento

Este documento deve ser referenciado em:

```text
docs/backend/05-pipeline-processamento.md
docs/backend/13-regras-musicais-transposicao.md
docs/features/03-catalogo-instrumentos-transpositores.md
docs/qa/05-testes-musicais.md
docs/implementacao/01-implementacao_IA.md
```

O arquivo `implementacao_IA.md` deve instruir o Codex a ler este documento antes de implementar qualquer código relacionado à transposição musical.

---

## 22. Resumo final

A regra universal do WFlyer é:

```text
A tonalidade da música pode ser qualquer uma.
A diferença entre os instrumentos permanece fixa.
O sistema calcula a distância entre origem e destino em semitons.
Depois aplica essa distância à partitura inteira.
```

Fórmula:

```text
intervalo_escrito = origem.written_to_concert - destino.written_to_concert
```

Exemplo citado:

```text
Trompete Bb em E maior → Piano
-2 semitons
E maior → D maior
F#, C#, G#, D# → F#, C#
```

Essa regra deve valer para todos os instrumentos suportados, não apenas para trompete.

