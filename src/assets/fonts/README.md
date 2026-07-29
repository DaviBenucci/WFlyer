# Fontes self-hosted

Arquivos oficiais usados pelo site:

| Família | Arquivo | Peso/estilo | SHA-256 |
|---|---|---|---|
| Cormorant Garamond | `cormorant-garamond-latin-variable.woff2` | 300–700, normal | `d80df8ff5aecd299a61549f9e29ab1ed0b9b05f4ea71d50fe978e07d5240b235` |
| Cormorant Garamond | `cormorant-garamond-latin-variable-italic.woff2` | 300–700, itálico | `6f2f5c3b1abc3d0bb035a927f66a90ca873f94fc31c4966c8d024142c2036e55` |
| Manrope | `manrope-latin-variable.woff2` | 200–800, normal | `a30ddcd349703aff7464c34bef3fffdff405ee50c113440d7c8693c02d210972` |

Origem: distribuição oficial Google Fonts (`fonts.gstatic.com`), Cormorant
Garamond v21 e Manrope v20, subset latino em WOFF2. As licenças SIL Open Font
License correspondentes estão em `licenses/`.

As fontes são empacotadas por `next/font/local`; o frontend não consulta Google
Fonts em runtime.
