# Glossário do WFlyer

## Partitura escrita

Forma como a música aparece para o instrumentista. Instrumentos transpositores podem ler uma nota diferente do som real produzido.

## Concert pitch / som real

Som real produzido, usado como referência neutra. Piano, flauta e violino normalmente são tratados como instrumentos em som real no contexto básico.

## Instrumento transpositor

Instrumento cuja nota escrita não corresponde ao som real. Exemplo: trompete em Bb lê C e soa Bb.

## `written_to_concert`

Quantidade de semitons necessária para converter a nota escrita do instrumento para som real.

Exemplo:

```text
Piano: 0
Trompete Bb: -2
Trompa F: -7
Sax alto Eb: -9
```

## Intervalo de transposição

Para converter uma partitura escrita para instrumento de origem em uma partitura escrita para instrumento de destino:

```text
intervalo = source.written_to_concert - target.written_to_concert
```

Exemplo:

```text
Piano -> Trompete Bb
0 - (-2) = +2 semitons
```

## OMR

Optical Music Recognition. Processo de ler uma partitura visual/PDF/imagem e converter para representação musical estruturada, como MusicXML.

## MusicXML

Formato estruturado para representação de partituras. Deve ser o formato intermediário principal para leitura, transposição e renderização.

## Artefato

Arquivo gerado ou armazenado pelo sistema. Exemplos: PDF original, MusicXML intermediário, MusicXML final, PDF final, preview.

## Job

Unidade de processamento assíncrono. Um job representa uma solicitação de transposição.

## Download token

Token temporário usado no MVP sem login para autorizar acesso a artefatos de um job sem expor dados privados.

## Confidence score

Métrica interna de confiança. Não deve ser exibida para o usuário comum; deve ficar restrita a admin/suporte.
