# WFlyer

WFlyer e um sistema para ler partitura em PDF, detectar o instrumento de origem e transpor para o instrumento de destino escolhido.

## Recursos implementados

- Deteccao automatica de instrumento por texto no cabecalho/canto superior.
- Deteccao com confianca e top candidatos.
- Correcao manual do instrumento de origem com historico persistente.
- Transposicao para multiplos instrumentos de destino (nao apenas trompete).
- Tratamento especial para piano:
  - `somente clave de Sol` (melodia), ou
  - `melodia + base` (duas partituras separadas).
- Melhor separacao de vozes para piano complexo:
  - prioriza clave quando disponivel;
  - fallback por faixa de altura (pitch range), inclusive separacao de acordes mistos.
- Exportacao de saida em MusicXML.
- Exportacao adicional em PDF (quando backend de PDF estiver disponivel).

## Fluxo

1. Upload de PDF.
2. Extracao de texto do cabecalho.
3. Deteccao do instrumento de origem com score de confianca.
4. Correcao manual opcional (registrada em historico quando muda a deteccao).
5. Conversao do PDF para MusicXML via Audiveris.
6. Transposicao com `music21` para o instrumento de destino.
7. Geracao dos arquivos de saida (MusicXML e opcionalmente PDF).

## Estrutura

- `app.py`: interface Streamlit.
- `wflyer/instrument.py`: catalogo de instrumentos, deteccao e confianca.
- `wflyer/pdf_text.py`: leitura de texto de cabecalho em PDF.
- `wflyer/omr.py`: OMR (PDF -> MusicXML) usando Audiveris.
- `wflyer/transposer.py`: transposicao geral e logica de piano.
- `wflyer/exporter.py`: exportacao opcional para PDF.
- `wflyer/history.py`: historico de correcoes do usuario.
- `wflyer/pipeline.py`: orquestracao ponta a ponta.
- `tests/test_instrument_detection.py`: testes base de deteccao/transposicao.

## Dependencias

### Python

- Python 3.11+ recomendado.

### Pacotes Python

```bash
python -m pip install -r requirements.txt
```

### OMR obrigatorio (entrada PDF)

Instale **Audiveris** e garanta `audiveris` no `PATH`:

```bash
audiveris -help
```

### Exportacao PDF (opcional)

Para gerar PDF final automaticamente, instale **MuseScore** e adicione ao `PATH` (por exemplo `MuseScore4`, `musescore` ou `mscore`).

Sem MuseScore, o WFlyer continua funcionando e gera MusicXML normalmente.

## Como executar

```bash
python -m streamlit run app.py
```

Se estiver usando Git Bash e quiser usar `streamlit` direto:

```bash
echo "alias streamlit='python -m streamlit'" >> ~/.bashrc
source ~/.bashrc
```

## Testes

```bash
python -m pytest -q
```

## Historico de correcoes

- Arquivo: `wflyer_history.json` (na raiz do projeto).
- Cada correcao manual registra:
  - timestamp UTC,
  - nome do PDF,
  - instrumento detectado,
  - instrumento selecionado pelo usuario,
  - confianca da deteccao.

## Limites atuais

- A qualidade da transcricao depende da qualidade do OMR no PDF.
- PDFs escaneados de baixa qualidade podem exigir pre-processamento.
- Exportacao PDF depende de ferramenta externa instalada.
